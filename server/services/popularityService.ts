// @ts-nocheck
import { getDb } from "../adapters";
import { gigs, gigViews, gigStats } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Popularity Score Calculation Service
 * 
 * Formula: views × 0.3 + orders × 0.5 + (rating/100) × 0.2
 * 
 * This creates a balanced score that:
 * - Rewards completed orders (50% weight) - strongest signal of quality
 * - Values views (30% weight) - indicates interest/discovery
 * - Considers ratings (20% weight) - quality indicator
 */

interface PopularityMetrics {
  gigId: number;
  views: number;
  orders: number;
  rating: number; // 0-500 scale
}

export function calculatePopularityScore(metrics: PopularityMetrics): number {
  const { views, orders, rating } = metrics;
  
  // Normalize rating from 0-500 scale to 0-5 scale
  const normalizedRating = rating / 100;
  
  // Calculate weighted score
  const score = (views * 0.3) + (orders * 0.5) + (normalizedRating * 0.2);
  
  // Round to integer for storage
  return Math.round(score);
}

export async function updateAllPopularityScores(): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.error("[PopularityService] Database not available");
    return 0;
  }
  
  try {
    // Get all published gigs
    const allGigs = await db
      .select({
        id: gigs.id,
        completedOrders: gigs.completedOrders,
        averageRating: gigs.averageRating,
      })
      .from(gigs)
      .where(eq(gigs.status, "published"));
    
    let updateCount = 0;
    
    for (const gig of allGigs) {
      // Get total view count from gigStats (sum all daily views)
      const stats = await db
        .select({ totalViews: sql<number>`SUM(${gigStats.views})` })
        .from(gigStats)
        .where(eq(gigStats.gigId, gig.id));
      
      const views = stats[0]?.totalViews || 0;
      
      // Calculate popularity score
      const popularityScore = calculatePopularityScore({
        gigId: gig.id,
        views,
        orders: gig.completedOrders || 0,
        rating: gig.averageRating || 0,
      });
      
      // Update gig with new popularity score
      await db
        .update(gigs)
        .set({ popularityScore })
        .where(eq(gigs.id, gig.id));
      
      updateCount++;
    }
    
    console.log(
      `[PopularityService] Updated popularity scores for ${updateCount} gigs`
    );
    
    return updateCount;
  } catch (error) {
    console.error("[PopularityService] Failed to update popularity scores:", error);
    throw error;
  }
}

/**
 * Update popularity score for a single gig
 * Useful for real-time updates after order completion or view
 */
export async function updateGigPopularityScore(gigId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[PopularityService] Database not available");
    return;
  }
  
  try {
    const gig = await db
      .select({
        completedOrders: gigs.completedOrders,
        averageRating: gigs.averageRating,
      })
      .from(gigs)
      .where(eq(gigs.id, gigId))
      .limit(1);
    
    if (!gig[0]) {
      console.warn(`[PopularityService] Gig ${gigId} not found`);
      return;
    }
    
    const stats = await db
      .select({ totalViews: sql<number>`SUM(${gigStats.views})` })
      .from(gigStats)
      .where(eq(gigStats.gigId, gigId));
    
    const views = stats[0]?.totalViews || 0;
    
    const popularityScore = calculatePopularityScore({
      gigId,
      views,
      orders: gig[0].completedOrders || 0,
      rating: gig[0].averageRating || 0,
    });
    
    await db
      .update(gigs)
      .set({ popularityScore })
      .where(eq(gigs.id, gigId));
    
    console.log(
      `[PopularityService] Updated popularity score for gig ${gigId}: ${popularityScore}`
    );
  } catch (error) {
    console.error(
      `[PopularityService] Failed to update popularity score for gig ${gigId}:`,
      error
    );
  }
}
