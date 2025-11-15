import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getSimilarGigs as getSimilarGigsFromDb } from "../db";
import { getSimilarGigs, getTrendingGigs } from "../recommendation";

/**
 * Similar Gigs Router - Content-Based Filtering
 * 
 * Provides recommendations based on:
 * - Category + Tags similarity (45%)
 * - Price proximity (15%)
 * - Delivery time proximity (15%)
 * - Trust score (rating + orders) (25%)
 */
export const similarGigsRouter = router({
  /**
   * Get similar gigs by gig ID
   * 
   * @param gigId - The gig ID to find similar gigs for
   * @param k - Maximum number of similar gigs to return (default: 12, max: 20)
   * @param excludeSameSeller - Whether to exclude gigs from the same seller (default: true)
   * @returns Array of similar gigs with similarity scores
   */
  byGigId: publicProcedure
    .input(
      z.object({
        gigId: z.number().int().positive(),
        k: z.number().int().min(1).max(20).default(12),
        excludeSameSeller: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      // Use new recommendation engine
      const similarGigs = await getSimilarGigs({
        gigId: input.gigId,
        limit: input.k,
      });
      
      // Fallback to trending if no similar gigs found
      if (similarGigs.length === 0) {
        const trending = await getTrendingGigs(input.k);
        return trending;
      }
      
      return similarGigs;
    }),

  /**
   * Get trending gigs
   */
  trending: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(20).default(6),
      })
    )
    .query(async ({ input }) => {
      return getTrendingGigs(input.limit);
    }),
});
