/**
 * Device Fingerprinting Middleware
 * 
 * Tracks user devices via IP, User-Agent, and browser fingerprints
 * to detect fraud patterns and suspicious behavior.
 * 
 * GDPR-compliant: IP addresses are hashed, not stored in plain text.
 */

import { Request } from "express";
import crypto from "crypto";

export interface DeviceFingerprint {
  fingerprintHash: string;
  ipHash: string;
  userAgent: string;
  acceptLanguage: string;
  timestamp: Date;
}

/**
 * Generate a SHA-256 hash of the IP address (GDPR-compliant)
 */
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Extract client IP from request (handles proxies/load balancers)
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

/**
 * Generate device fingerprint from request headers
 */
export function generateFingerprint(req: Request): DeviceFingerprint {
  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  const acceptLanguage = req.headers["accept-language"] || "unknown";

  // Combine multiple signals for fingerprint
  const fingerprintData = `${ip}|${userAgent}|${acceptLanguage}`;
  const fingerprintHash = crypto
    .createHash("sha256")
    .update(fingerprintData)
    .digest("hex");

  return {
    fingerprintHash,
    ipHash: hashIP(ip),
    userAgent,
    acceptLanguage,
    timestamp: new Date(),
  };
}

/**
 * Check if fingerprint matches known fraud patterns
 */
export function isSuspiciousFingerprint(fingerprint: DeviceFingerprint): boolean {
  // Suspicious patterns:
  // 1. Headless browsers (Puppeteer, Playwright)
  // 2. Known bot user-agents
  // 3. Missing/unusual headers

  const suspiciousUA = [
    "HeadlessChrome",
    "PhantomJS",
    "Selenium",
    "Puppeteer",
    "bot",
    "crawler",
    "spider",
  ];

  const ua = fingerprint.userAgent.toLowerCase();
  if (suspiciousUA.some((pattern) => ua.includes(pattern.toLowerCase()))) {
    return true;
  }

  // Missing User-Agent
  if (fingerprint.userAgent === "unknown") {
    return true;
  }

  return false;
}
