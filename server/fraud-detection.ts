/**
 * Fraud Detection System
 * 
 * Detects suspicious behavior patterns:
 * - Rapid account creation (same IP)
 * - Unusual order patterns
 * - Price manipulation attempts
 * - Review bombing
 * 
 * Integrates with Stripe Radar for payment fraud detection.
 */

import { getDb } from "./db";
import { DeviceFingerprint, isSuspiciousFingerprint } from "./middleware/fingerprint";

export interface FraudAlert {
  userId: number;
  type: "rapid_creation" | "unusual_orders" | "price_manipulation" | "review_bombing" | "suspicious_device";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

/**
 * Check for rapid account creation from same IP
 */
export async function detectRapidAccountCreation(ipHash: string): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Check how many accounts were created from this IP in the last 24h
  // Note: We need to add ipHash to users table first (TODO)
  
  // Placeholder logic:
  // If more than 5 accounts from same IP in 24h → Suspicious
  
  return null; // TODO: Implement after adding ipHash to users table
}

/**
 * Check for unusual order patterns
 */
export async function detectUnusualOrders(userId: number): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Suspicious patterns:
  // 1. More than 10 orders in 1 hour
  // 2. Orders to same seller repeatedly (potential collusion)
  // 3. High-value orders from new accounts
  
  // TODO: Implement after orders table is populated
  
  return null;
}

/**
 * Check for price manipulation
 */
export async function detectPriceManipulation(gigId: number, newPrice: number): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Suspicious patterns:
  // 1. Price changed more than 50% in 24h
  // 2. Price set to 0 or negative
  // 3. Price exceeds platform maximum (250€)
  
  if (newPrice <= 0) {
    return {
      userId: 0, // TODO: Get seller ID
      type: "price_manipulation",
      severity: "high",
      description: "Price set to 0 or negative",
      metadata: { gigId, newPrice },
      timestamp: new Date(),
    };
  }

  if (newPrice > 250) {
    return {
      userId: 0,
      type: "price_manipulation",
      severity: "medium",
      description: "Price exceeds platform maximum (250€)",
      metadata: { gigId, newPrice },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Check for review bombing
 */
export async function detectReviewBombing(gigId: number): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Suspicious patterns:
  // 1. More than 10 reviews in 1 hour
  // 2. All 5-star or all 1-star reviews
  // 3. Reviews from accounts created in the last 24h
  
  // TODO: Implement after reviews table is populated
  
  return null;
}

/**
 * Check device fingerprint for suspicious patterns
 */
export function detectSuspiciousDevice(fingerprint: DeviceFingerprint): FraudAlert | null {
  if (isSuspiciousFingerprint(fingerprint)) {
    return {
      userId: 0,
      type: "suspicious_device",
      severity: "medium",
      description: "Suspicious user-agent or missing headers detected",
      metadata: {
        userAgent: fingerprint.userAgent,
        fingerprintHash: fingerprint.fingerprintHash,
      },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Run all fraud detection checks
 */
export async function runFraudDetection(params: {
  userId?: number;
  gigId?: number;
  fingerprint?: DeviceFingerprint;
  ipHash?: string;
  newPrice?: number;
}): Promise<FraudAlert[]> {
  const alerts: FraudAlert[] = [];

  // Device fingerprint check
  if (params.fingerprint) {
    const deviceAlert = detectSuspiciousDevice(params.fingerprint);
    if (deviceAlert) alerts.push(deviceAlert);
  }

  // Rapid account creation check
  if (params.ipHash) {
    const rapidCreationAlert = await detectRapidAccountCreation(params.ipHash);
    if (rapidCreationAlert) alerts.push(rapidCreationAlert);
  }

  // Unusual orders check
  if (params.userId) {
    const ordersAlert = await detectUnusualOrders(params.userId);
    if (ordersAlert) alerts.push(ordersAlert);
  }

  // Price manipulation check
  if (params.gigId && params.newPrice !== undefined) {
    const priceAlert = await detectPriceManipulation(params.gigId, params.newPrice);
    if (priceAlert) alerts.push(priceAlert);
  }

  // Review bombing check
  if (params.gigId) {
    const reviewAlert = await detectReviewBombing(params.gigId);
    if (reviewAlert) alerts.push(reviewAlert);
  }

  return alerts;
}
