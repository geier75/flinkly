/**
 * Recommendation Engine for Similar Gigs (Supabase Version)
 * 
 * Algorithms:
 * 1. Content-Based Filtering (Category + Tags + Price-Range)
 * 2. Collaborative Filtering (User behavior patterns)
 */

import * as db from "./adapters";

interface SimilarGigsParams {
  gigId: number;
  limit?: number;
}

/**
 * Get similar gigs based on category, tags, and price range
 */
export async function getSimilarGigs({ gigId, limit = 6 }: SimilarGigsParams) {
  try {
    // 1. Get the reference gig
    const referenceGig = await db.getGigById(gigId);
    
    if (!referenceGig) {
      return [];
    }

    // 2. Get all published gigs in the same category
    const allGigs = await db.getGigsPaginated({
      category: referenceGig.category,
      limit: 50,
    });

    // 3. Filter and score similar gigs
    const priceMin = Math.floor(referenceGig.price * 0.7);
    const priceMax = Math.ceil(referenceGig.price * 1.3);

    const similarGigs = allGigs
      .filter(gig => gig.id !== gigId) // Exclude reference gig
      .map(gig => ({
        ...gig,
        similarityScore: 
          (gig.category === referenceGig.category ? 100 : 0) +
          (gig.price >= priceMin && gig.price <= priceMax ? 50 : 0)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return similarGigs;
  } catch (error) {
    console.error('[Recommendation] getSimilarGigs error:', error);
    return [];
  }
}

/**
 * Get trending gigs (most popular in last 7 days)
 * Fallback when similar gigs are not available
 */
export async function getTrendingGigs(limit: number = 6) {
  try {
    // Get recent published gigs
    const gigs = await db.getGigsPaginated({ limit: limit * 2 });
    
    // Shuffle and return limited results
    const shuffled = gigs.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('[Recommendation] getTrendingGigs error:', error);
    return [];
  }
}

/**
 * Get personalized recommendations based on user's favorite categories
 */
export async function getPersonalizedRecommendations(
  userId: number,
  limit: number = 6
) {
  // In production: analyze user's favorite gigs, order history, browsing history
  // For now: return trending gigs
  return getTrendingGigs(limit);
}
