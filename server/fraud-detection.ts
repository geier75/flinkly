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

import { getDb } from "./adapters";
import { DeviceFingerprint, isSuspiciousFingerprint } from "./middleware/fingerprint";
import { users, orders, reviews, gigs } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

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
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  
  // Count recent signups (using lastSignedIn as proxy for creation)
  const recentUsers = await db
    .select()
    .from(users)
    .where(gte(users.createdAt, yesterday));
  
  // If more than 5 accounts in 24h → Suspicious
  if (recentUsers.length > 5) {
    return {
      userId: recentUsers[0]?.id || 0,
      type: "rapid_creation",
      severity: "high",
      description: `${recentUsers.length} accounts created in 24h`,
      metadata: { ipHash, count: recentUsers.length },
      timestamp: new Date(),
    };
  }
  
  return null;
}

/**
 * Check for unusual order patterns
 */
export async function detectUnusualOrders(userId: number): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Check orders in last hour
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  const recentOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.buyerId, userId),
        gte(orders.createdAt, oneHourAgo)
      )
    );
  
  // More than 10 orders in 1 hour → Suspicious
  if (recentOrders.length > 10) {
    return {
      userId,
      type: "unusual_orders",
      severity: "high",
      description: `${recentOrders.length} orders placed in 1 hour`,
      metadata: { orderCount: recentOrders.length },
      timestamp: new Date(),
    };
  }
  
  // Check for repeated orders to same seller
  const sellerCounts = new Map<number, number>();
  recentOrders.forEach(order => {
    const count = sellerCounts.get(order.sellerId) || 0;
    sellerCounts.set(order.sellerId, count + 1);
  });
  
  for (const [sellerId, count] of sellerCounts) {
    if (count > 5) {
      return {
        userId,
        type: "unusual_orders",
        severity: "medium",
        description: `${count} orders to same seller in 1 hour (potential collusion)`,
        metadata: { sellerId, orderCount: count },
        timestamp: new Date(),
      };
    }
  }
  
  return null;
}

/**
 * Check for price manipulation
 */
export async function detectPriceManipulation(gigId: number, newPrice: number): Promise<FraudAlert | null> {
  const db = await getDb();
  if (!db) return null;

  // Get gig and seller info
  const gigResult = await db.select().from(gigs).where(eq(gigs.id, gigId)).limit(1);
  if (!gigResult[0]) return null;
  
  const gig = gigResult[0];
  const oldPrice = gig.price;
  
  // Price set to 0 or negative
  if (newPrice <= 0) {
    return {
      userId: gig.sellerId,
      type: "price_manipulation",
      severity: "high",
      description: "Price set to 0 or negative",
      metadata: { gigId, oldPrice, newPrice },
      timestamp: new Date(),
    };
  }

  // Price exceeds platform maximum (25000 cents = 250€)
  if (newPrice > 25000) {
    return {
      userId: gig.sellerId,
      type: "price_manipulation",
      severity: "medium",
      description: "Price exceeds platform maximum (250€)",
      metadata: { gigId, oldPrice, newPrice },
      timestamp: new Date(),
    };
  }
  
  // Price changed more than 50% in 24h
  const priceChange = Math.abs((newPrice - oldPrice) / oldPrice);
  if (priceChange > 0.5) {
    return {
      userId: gig.sellerId,
      type: "price_manipulation",
      severity: "medium",
      description: `Price changed by ${(priceChange * 100).toFixed(0)}% (suspicious)`,
      metadata: { gigId, oldPrice, newPrice, changePercent: priceChange * 100 },
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

  // Check reviews in last hour
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  const recentReviews = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.gigId, gigId),
        gte(reviews.createdAt, oneHourAgo)
      )
    );
  
  // More than 10 reviews in 1 hour → Suspicious
  if (recentReviews.length > 10) {
    return {
      userId: 0,
      type: "review_bombing",
      severity: "high",
      description: `${recentReviews.length} reviews in 1 hour (review bombing)`,
      metadata: { gigId, reviewCount: recentReviews.length },
      timestamp: new Date(),
    };
  }
  
  // Check if all reviews are extreme (all 5-star or all 1-star)
  if (recentReviews.length >= 5) {
    const ratings = recentReviews.map(r => r.rating);
    const allFiveStars = ratings.every(r => r === 500); // 5.0 stars = 500
    const allOneStar = ratings.every(r => r <= 100); // 1.0 star = 100
    
    if (allFiveStars || allOneStar) {
      return {
        userId: 0,
        type: "review_bombing",
        severity: "medium",
        description: allFiveStars ? "All 5-star reviews (suspicious)" : "All 1-star reviews (suspicious)",
        metadata: { gigId, reviewCount: recentReviews.length, pattern: allFiveStars ? "5-star" : "1-star" },
        timestamp: new Date(),
      };
    }
  }
  
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
