// @ts-nocheck
/**
 * Content Moderation Router
 * 
 * Admin-only endpoints for reviewing flagged content
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../adapters";
import { fraudAlerts, gigs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { moderateGigTitle, moderateGigDescription } from "../moderation/keywords";
import { moderateImage } from "../moderation/images";

export const moderationRouter = router({
  /**
   * Get all pending fraud alerts (Admin only)
   */
  getPendingAlerts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    // Admin-only
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    const results = await db
      .select()
      .from(fraudAlerts)
      .where(eq(fraudAlerts.status, "pending"));

    return results;
  }),

  /**
   * Review fraud alert (Admin only)
   */
  reviewAlert: protectedProcedure
    .input(
      z.object({
        alertId: z.number(),
        status: z.enum(["resolved", "false_positive"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Admin-only
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db
        .update(fraudAlerts)
        .set({
          status: input.status,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(fraudAlerts.id, input.alertId));

      return { success: true };
    }),

  /**
   * Moderate gig content (called during gig creation/update)
   */
  moderateGig: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Moderate title
      const titleResult = moderateGigTitle(input.title);
      if (!titleResult.allowed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: titleResult.reason || "Title contains prohibited content",
        });
      }

      // Moderate description
      const descriptionResult = moderateGigDescription(input.description);
      if (!descriptionResult.allowed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: descriptionResult.reason || "Description contains prohibited content",
        });
      }

      // Moderate image (if provided)
      if (input.imageUrl) {
        const imageResult = await moderateImage(input.imageUrl);
        if (!imageResult.allowed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: imageResult.reason || "Image contains inappropriate content",
          });
        }
      }

      return {
        success: true,
        warnings: {
          title: titleResult.flaggedKeywords,
          description: descriptionResult.flaggedKeywords,
        },
      };
    }),

  /**
   * Get flagged gigs (Admin only)
   */
  getFlaggedGigs: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    // Admin-only
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    // TODO: Add "flagged" status to gigs table
    // For now, return empty array
    return [];
  }),
});
