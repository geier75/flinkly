/**
 * Admin-Router (User-Management, Gig-Moderation, Platform-Analytics)
 * 
 * Features:
 * - User-Management (View, Ban, Suspend)
 * - Gig-Moderation (Approve, Reject)
 * - Seller-Verification-Queue
 * - Platform-Analytics
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

/**
 * Admin-only procedure
 */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Nur Admins haben Zugriff auf diese Funktion",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get all users (paginated)
   */
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        role: z.enum(["user", "admin"]).optional(),
        verified: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      return await db.getUsers(input.limit, input.offset, {
        role: input.role,
        verified: input.verified,
      });
    }),

  /**
   * Get user by ID (detailed view)
   */
  getUserById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await db.getUserById(input.id);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Get user statistics
      const stats = await db.getUserStats(input.id);

      return {
        user,
        stats,
      };
    }),

  /**
   * Ban user
   */
  banUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      await db.banUser(input.userId, input.reason);

      return {
        success: true,
        message: `User ${input.userId} wurde gesperrt`,
      };
    }),

  /**
   * Unban user
   */
  unbanUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await db.unbanUser(input.userId);

      return {
        success: true,
        message: `User ${input.userId} wurde entsperrt`,
      };
    }),

  /**
   * Get all gigs (for moderation)
   */
  getGigsForModeration: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        status: z.enum(["draft", "published", "archived"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await db.getAllGigs(input.limit, input.offset, input.status);
    }),

  /**
   * Approve gig
   */
  approveGig: adminProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ input }) => {
      await db.publishGig(input.gigId);

      return {
        success: true,
        message: `Gig ${input.gigId} wurde genehmigt und veröffentlicht`,
      };
    }),

  /**
   * Reject gig
   */
  rejectGig: adminProcedure
    .input(
      z.object({
        gigId: z.number(),
        reason: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      await db.rejectGig(input.gigId, input.reason);

      return {
        success: true,
        message: `Gig ${input.gigId} wurde abgelehnt`,
      };
    }),

  /**
   * Get seller verification queue
   */
  getVerificationQueue: adminProcedure.query(async () => {
    return await db.getVerificationQueue();
  }),

  /**
   * Approve seller verification
   */
  approveSellerVerification: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateUserVerification(input.userId, {
        adminApproved: true,
        verificationLevel: "admin",
      });

      return {
        success: true,
        message: `Seller ${input.userId} wurde verifiziert`,
      };
    }),

  /**
   * Reject seller verification
   */
  rejectSellerVerification: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Store rejection reason and notify user
      console.log(`[Admin] Rejected seller verification for user ${input.userId}: ${input.reason}`);

      return {
        success: true,
        message: `Seller-Verifizierung für User ${input.userId} wurde abgelehnt`,
      };
    }),

  /**
   * Get platform analytics
   */
  getPlatformAnalytics: adminProcedure.query(async () => {
    const analytics = await db.getPlatformAnalytics();

    return analytics;
  }),

  /**
   * Get recent activity (for dashboard)
   */
  getRecentActivity: adminProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return await db.getRecentActivity(input.limit);
    }),
});
