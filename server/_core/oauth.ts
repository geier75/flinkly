import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../adapters";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // DEV-ONLY: Quick login for local development
  if (process.env.NODE_ENV !== 'production') {
    app.get("/api/dev-login", async (req: Request, res: Response) => {
      try {
        // Use a fixed dev user ID so profile changes persist across logins
        const testOpenId = "dev_user_persistent";
        const testName = "Dev User";
        const testEmail = "dev@flinkly.local";

        // Try to create/update user in DB
        try {
          // Check if user exists first
          const existingUser = await db.getUserByOpenId(testOpenId);
          if (existingUser) {
            // Update last signed in
            await db.upsertUser({
              openId: testOpenId,
              lastSignedIn: new Date(),
            });
            console.log("[Dev Login] Using existing dev user:", existingUser.name);
          } else {
            // Create new dev user
            await db.upsertUser({
              openId: testOpenId,
              name: testName,
              email: testEmail,
              loginMethod: "dev",
              lastSignedIn: new Date(),
            });
            console.log("[Dev Login] Created new dev user");
          }
        } catch (dbError) {
          console.warn("[Dev Login] DB unavailable, continuing without persistence:", dbError);
        }

        // Get the user's current name from DB (might have been updated)
        let userName = testName;
        try {
          const user = await db.getUserByOpenId(testOpenId);
          if (user?.name) userName = user.name;
        } catch {}

        // Create a proper JWT session token using SDK
        const sessionToken = await sdk.createSessionToken(testOpenId, {
          name: userName,
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        console.log("[Dev Login] Logged in as:", testOpenId, userName);
        res.redirect(302, "/dashboard");
      } catch (error) {
        console.error("[Dev Login] Failed", error);
        res.status(500).json({ error: "Dev login failed" });
      }
    });
    
    // Login as existing seeded seller
    app.get("/api/dev-login/:sellerId", async (req: Request, res: Response) => {
      try {
        const sellerId = parseInt(req.params.sellerId);
        const user = await db.getUserById(sellerId);
        
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }

        // Create a proper JWT session token using SDK
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "User",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        console.log("[Dev Login] Logged in as:", user.name, "(ID:", sellerId, ")");
        res.redirect(302, "/dashboard");
      } catch (error) {
        console.error("[Dev Login] Failed", error);
        res.status(500).json({ error: "Dev login failed" });
      }
    });
  }

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
