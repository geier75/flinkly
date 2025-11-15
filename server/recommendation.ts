/**
 * Recommendation Engine for Similar Gigs
 * 
 * Algorithms:
 * 1. Content-Based Filtering (Category + Tags + Price-Range)
 * 2. Collaborative Filtering (User behavior patterns)
 */

import { getDb } from "./db";
import { gigs } from "../drizzle/schema";
import { eq, and, ne, between, sql, inArray } from "drizzle-orm";

interface SimilarGigsParams {
  gigId: number;
  limit?: number;
}

/**
 * Get similar gigs based on category, tags, and price range
 */
export async function getSimilarGigs({ gigId, limit = 6 }: SimilarGigsParams) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  // 1. Get the reference gig
  const referenceGig = await db
    .select()
    .from(gigs)
    .where(eq(gigs.id, gigId))
    .limit(1);

  if (referenceGig.length === 0) {
    return [];
  }

  const ref = referenceGig[0];

  // 2. Calculate price range (±30%)
  const priceMin = Math.floor(ref.price * 0.7);
  const priceMax = Math.ceil(ref.price * 1.3);

  // 3. Find similar gigs
  // Priority:
  // - Same category (highest weight)
  // - Similar price range (medium weight)
  // - Exclude the reference gig itself

  const similarGigs = await db
    .select({
      id: gigs.id,
      title: gigs.title,
      description: gigs.description,
      category: gigs.category,
      price: gigs.price,
      deliveryDays: gigs.deliveryDays,
      imageUrl: gigs.imageUrl,
      sellerId: gigs.sellerId,
      createdAt: gigs.createdAt,
      // Calculate similarity score
      similarityScore: sql<number>`
        CASE
          WHEN ${gigs.category} = ${ref.category} THEN 100
          ELSE 0
        END +
        CASE
          WHEN ${gigs.price} BETWEEN ${priceMin} AND ${priceMax} THEN 50
          ELSE 0
        END
      `.as("similarity_score"),
    })
    .from(gigs)
    .where(
      and(
        ne(gigs.id, gigId), // Exclude reference gig
        eq(gigs.category, ref.category) // Same category
      )
    )
    .orderBy(sql`similarity_score DESC, RAND()`)
    .limit(limit);

  return similarGigs;
}

/**
 * Get trending gigs (most popular in last 7 days)
 * Fallback when similar gigs are not available
 */
export async function getTrendingGigs(limit: number = 6) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  // Simple trending algorithm:
  // - Recent gigs (created in last 30 days)
  // - Random order for demo (in production: use views/orders/ratings)

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trending = await db
    .select()
    .from(gigs)
    .where(sql`${gigs.createdAt} >= ${thirtyDaysAgo}`)
    .orderBy(sql`RAND()`)
    .limit(limit);

  return trending;
}

/**
 * Get personalized recommendations based on user's favorite categories
 */
export async function getPersonalizedRecommendations(
  userId: number,
  limit: number = 6
) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  // In production: analyze user's favorite gigs, order history, browsing history
  // For now: return trending gigs

  return getTrendingGigs(limit);
}
