import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../adapters";

export const favoritesRouter = router({
  /**
   * Add gig to favorites
   */
  add: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log(`[Favorites] Adding gig ${input.gigId} to favorites for user ${ctx.user.id}`);
      await db.addFavorite(ctx.user.id, input.gigId);
      console.log(`[Favorites] Successfully added gig ${input.gigId}`);
      return { success: true };
    }),

  /**
   * Remove gig from favorites
   */
  remove: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log(`[Favorites] Removing gig ${input.gigId} from favorites for user ${ctx.user.id}`);
      await db.removeFavorite(ctx.user.id, input.gigId);
      return { success: true };
    }),

  /**
   * Get all favorites for current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    console.log(`[Favorites] Getting favorites for user ${ctx.user.id}`);
    const favorites = await db.getFavoritesByUserId(ctx.user.id);
    console.log(`[Favorites] Found ${favorites.length} favorites`);
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
