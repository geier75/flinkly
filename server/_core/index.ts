import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import cors from "cors";
import { authRateLimiter, anonRateLimiter } from "./rateLimiter";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initializeSocketIO } from "./socket";
import { sessionRefreshMiddleware } from "./sessionRefreshMiddleware";
import { initSentry } from "./sentry";
import { initPostHog } from "./analytics";
import { initCronJobs } from "./cronJobs";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Initialize Sentry (must be first!)
  initSentry();
  
  // Initialize PostHog
  initPostHog();
  
  // Initialize Cron-Jobs
  initCronJobs();
  
  const app = express();
  const server = createServer(app);
  
  // IMPORTANT: Stripe webhook MUST use express.raw() BEFORE express.json()
  // This is required for signature verification
  const webhookHandler = async (req: any, res: any) => {
    const { handleStripeWebhook } = await import('../webhooks/stripe');
    return handleStripeWebhook(req, res);
  };
  
  // Register for both GET (Stripe verification) and POST (actual webhooks)
  app.get('/api/stripe/webhook', webhookHandler);
  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    webhookHandler
  );
  
  // Security headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://manus-analytics.com"], // Allow inline scripts for Vite HMR + Manus Analytics
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "wss:", "ws:", "https://manus-analytics.com"],
          frameSrc: ["'self'", "https://js.stripe.com"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for Stripe
    })
  );

  // CORS
  app.use(cors({ origin: true, credentials: true }));

  // Session refresh middleware (before rate limiting to ensure sessions are updated)
  app.use(sessionRefreshMiddleware);

  // Rate limiting (before body parser to protect against large payloads)
  app.use("/api", authRateLimiter);
  app.use("/api", anonRateLimiter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Health-Check-Endpoints (for Load-Balancers, Kubernetes, etc.)
  app.get("/health", (req, res) => {
    // Liveness-Check: Server is running
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/ready", async (req, res) => {
    // Readiness-Check: Server is ready to accept traffic (DB connection OK)
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ 
          status: "not_ready", 
          reason: "database_unavailable",
          timestamp: new Date().toISOString() 
        });
      }
      // Simple DB ping
      await db.execute("SELECT 1");
      res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ 
        status: "not_ready", 
        reason: "database_error",
        error: String(error),
        timestamp: new Date().toISOString() 
      });
    }
  });
  // Sitemap & Robots.txt (SEO)
  app.get("/sitemap.xml", async (req, res) => {
    const { generateSitemap } = await import("../sitemap");
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const sitemap = await generateSitemap(baseUrl);
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  app.get("/robots.txt", async (req, res) => {
    const { generateRobotsTxt } = await import("../sitemap");
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const robotsTxt = generateRobotsTxt(baseUrl);
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Initialize Socket.io for real-time messaging
  initializeSocketIO(server);
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Graceful shutdown handler
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[${signal}] Graceful shutdown initiated...`);
    
    // Stop accepting new connections
    server.close(async () => {
      console.log("[Shutdown] HTTP server closed");
      
      try {
        // Close database connections
        const { getDb } = await import("../db");
        const db = await getDb();
        if (db) {
          // MySQL2 doesn't have a close method on drizzle instance
          // Connection pool will be closed automatically
          console.log("[Shutdown] Database connections closed");
        }
        
        console.log("[Shutdown] Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        console.error("[Shutdown] Error during graceful shutdown:", error);
        process.exit(1);
      }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error("[Shutdown] Forced shutdown after timeout");
      process.exit(1);
    }, 30000);
  };

  // Register shutdown handlers
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer().catch(console.error);
