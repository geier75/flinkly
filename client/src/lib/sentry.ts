/**
 * Sentry Error-Monitoring Integration
 * 
 * Team: Stefan Weber (Error-Monitoring Specialist, 30 Jahre Erfahrung)
 * Ex-Sentry Core Team, Real-User-Monitoring (RUM) Expert
 * 
 * Features:
 * - Real-User-Monitoring (RUM)
 * - Error-Tracking mit Source-Maps
 * - Performance-Monitoring (Core Web Vitals)
 * - Session-Replay für Error-Debugging
 * - Release-Tracking
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry (only in production)
 */
export function initSentry() {
  // Only initialize in browser and production
  if (typeof window === "undefined" || import.meta.env.DEV) {
    console.log("[Sentry] Skipped initialization (development mode)");
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn("[Sentry] DSN not found. Error monitoring disabled.");
    return;
  }

  Sentry.init({
    dsn,
    
    // Set environment
    environment: import.meta.env.MODE || "production",
    
    // Release tracking (use git commit hash or version)
    release: import.meta.env.VITE_APP_VERSION || "unknown",
    
    // Performance Monitoring
    integrations: [
      // Browser Tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      
      // Session Replay for error debugging
      Sentry.replayIntegration({
        // Mask all text and user input for GDPR compliance
        maskAllText: true,
        blockAllMedia: true,
      }),
      
      // Capture console errors
      Sentry.captureConsoleIntegration({
        levels: ["error", "assert"],
      }),
    ],

    // Performance Monitoring sample rate
    // 0.1 = 10% of transactions are sent to Sentry
    tracesSampleRate: 0.1,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors
      const error = hint.originalException;
      
      // Ignore network errors (handled by UI)
      if (error instanceof Error && error.message.includes("NetworkError")) {
        return null;
      }
      
      // Ignore cancelled requests
      if (error instanceof Error && error.message.includes("AbortError")) {
        return null;
      }
      
      // Add user context if available
      const user = (window as any).__Flinkly_USER__;
      if (user) {
        event.user = {
          id: user.id,
          email: user.email,
        };
      }
      
      return event;
    },

    // Breadcrumbs (user actions before error)
    beforeBreadcrumb(breadcrumb) {
      // Filter out sensitive data from breadcrumbs
      if (breadcrumb.category === "console") {
        return null; // Don't send console logs
      }
      
      if (breadcrumb.data?.url?.includes("password")) {
        return null; // Don't send URLs with "password"
      }
      
      return breadcrumb;
    },
  });

  console.log("[Sentry] Error monitoring initialized");
}

/**
 * Capture custom error with context
 */
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture custom message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context
 */
export function setUser(user: { id: number; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    email: user.email,
    username: user.name,
  });
  
  // Store user in window for beforeSend
  (window as any).__Flinkly_USER__ = user;
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  Sentry.setUser(null);
  delete (window as any).__Flinkly_USER__;
}

/**
 * Add breadcrumb (user action)
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: "info",
  });
}

/**
 * Start span for performance monitoring
 */
export function startSpan(name: string, op: string, callback: () => void) {
  return Sentry.startSpan({
    name,
    op,
  }, callback);
}

export default Sentry;
