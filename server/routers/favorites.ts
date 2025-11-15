import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const favoritesRouter = router({
  /**
   * Add gig to favorites
   */
  add: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.addFavorite(ctx.user.id, input.gigId);
      return { success: true };
    }),

  /**
   * Remove gig from favorites
   */
  remove: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.removeFavorite(ctx.user.id, input.gigId);
      return { success: true };
    }),

  /**
   * Get all favorites for current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await db.getFavoritesByUserId(ctx.user.id);
    return favorites;
  }),

  /**
   * Check if gig is favorited
   */
  isFavorite: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .query(async ({ ctx, input }) => {
      const isFav = await db.isFavorite(ctx.user.id, input.gigId);
      return { isFavorite: isFav };
    }),
});
