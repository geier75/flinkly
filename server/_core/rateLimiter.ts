/**
 * Rate Limiting Middleware
 * 
 * Protects API endpoints from abuse and DDoS attacks.
 * 
 * Limits:
 * - Authenticated users: 100 requests/minute
 * - Anonymous users: 20 requests/minute
 * - Stripe webhooks: No limit (verified by signature)
 */

import rateLimit from "express-rate-limit";
import type { Request } from "express";

/**
 * Rate limiter for authenticated users
 * 100 requests per minute per user
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Use user ID as key for authenticated requests
  keyGenerator: (req: Request) => {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.id?.toString();
    if (userId) return `user:${userId}`;
    
    // Fallback to IP (with IPv6 support)
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;
    return `ip:${ip || "unknown"}`;
  },
  skip: (req: Request) => {
    // Skip rate limiting for Stripe webhooks
    return req.path === "/api/stripe/webhook";
  },
});

/**
 * Rate limiter for anonymous users
 * 20 requests per minute per IP
 */
export const anonRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: {
    error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;
    return `anon:${ip || "unknown"}`;
  },
  skip: (req: Request) => {
    // Skip for authenticated users (they use authRateLimiter)
    // @ts-ignore
    return !!req.user || req.path === "/api/stripe/webhook";
  },
});

/**
 * Strict rate limiter for sensitive endpoints
 * 10 requests per minute
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: "Zu viele Anfragen an diesen Endpunkt. Bitte versuche es später erneut.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // @ts-ignore
    const userId = req.user?.id?.toString();
    if (userId) return `strict:user:${userId}`;
    
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;
    return `strict:ip:${ip || "unknown"}`;
  },
});

/**
 * Rate limiter for login/signup endpoints
 * 5 attempts per 15 minutes
 */
export const authEndpointRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: "Zu viele Login-Versuche. Bitte versuche es in 15 Minuten erneut.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;
    return `auth:${ip || "unknown"}`;
  },
});
