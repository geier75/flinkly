/**
 * Templates Router
 * 
 * Provides gig templates to help sellers create professional gigs faster
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getTemplatesByCategory, getTemplateById, getCategories } from "../templates";

export const templatesRouter = router({
  /**
   * Get all categories
   */
  getCategories: publicProcedure.query(() => {
    return getCategories();
  }),

  /**
   * Get templates by category
   */
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return getTemplatesByCategory(input.category);
    }),

  /**
   * Get template by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getTemplateById(input.id);
    }),
});
