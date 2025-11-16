import { COOKIE_NAME, TWENTY_FOUR_HOURS_MS } from "@shared/const";
import type { Request, Response, NextFunction } from "express";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";

/**
 * Middleware to refresh session cookie on every request if user is active
 * This ensures the 24h inactivity timeout is reset on each request
 */
export async function sessionRefreshMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Parse cookies
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return next();
    }

    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const sessionCookie = cookies[COOKIE_NAME];
    if (!sessionCookie) {
      return next();
    }

    // Verify session
    const session = await sdk.verifySession(sessionCookie);
    if (!session) {
      // Session expired or invalid - clear cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return next();
    }

    // Check if we should refresh the session (only if > 1 hour since last activity)
    const now = Date.now();
    const lastActivity = session.lastActivity ?? 0;
    const timeSinceLastActivity = now - lastActivity;
    const ONE_HOUR_MS = 1000 * 60 * 60;

    if (timeSinceLastActivity > ONE_HOUR_MS) {
      // Refresh session with updated lastActivity
      const newSessionToken = await sdk.signSession({
        openId: session.openId,
        appId: session.appId,
        name: session.name,
        lastActivity: now,
      });

      // Set new cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, newSessionToken, {
        ...cookieOptions,
        maxAge: TWENTY_FOUR_HOURS_MS,
      });
    }

    next();
  } catch (error) {
    console.error("[SessionRefresh] Error refreshing session:", error);
    next();
  }
}
