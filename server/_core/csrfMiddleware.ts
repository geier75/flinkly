import type { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Middleware to generate and validate CSRF tokens using Double-Submit Cookie pattern
 * 
 * How it works:
 * 1. On GET requests: Generate new CSRF token and set it in cookie
 * 2. On POST/PUT/DELETE/PATCH requests: Validate token from cookie matches header
 * 3. Token rotates on every state-changing request for maximum security
 * 
 * Client must:
 * - Read CSRF token from cookie
 * - Send it back in X-CSRF-Token header on state-changing requests
 */
export function csrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const method = req.method.toUpperCase();

  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    // Generate new CSRF token for GET requests
    const csrfToken = generateCsrfToken();
    res.cookie(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false, // Client needs to read this
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
    return next();
  }

  // For state-changing methods (POST, PUT, DELETE, PATCH), validate CSRF token
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerTokenRaw = req.headers[CSRF_HEADER_NAME];
  const headerToken = Array.isArray(headerTokenRaw) ? headerTokenRaw[0] : headerTokenRaw;

  if (!cookieToken || !headerToken) {
    console.warn(
      `[CSRF] Missing CSRF token - Cookie: ${!!cookieToken}, Header: ${!!headerToken}`
    );
    return res.status(403).json({
      error: "CSRF token missing",
      code: "CSRF_TOKEN_MISSING",
    });
  }

  // Constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(cookieToken, headerToken)) {
    console.warn("[CSRF] CSRF token mismatch");
    return res.status(403).json({
      error: "CSRF token invalid",
      code: "CSRF_TOKEN_INVALID",
    });
  }

  // Token is valid - rotate it for next request
  const newCsrfToken = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, newCsrfToken, {
    httpOnly: false,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });

  next();
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
