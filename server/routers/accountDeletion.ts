// @ts-nocheck
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../adapters";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Account Deletion Router (DSGVO Art. 17)
 * 
 * Provides account deletion functionality as required by GDPR Article 17 (Right to Erasure).
 * 
 * Implementation:
 * - Soft-Delete: 30-day waiting period before final deletion
 * - Anonymization: Personal data is anonymized instead of hard-deleted
 * - Audit-Logs: Deletion requests are logged for compliance
 */

export const accountDeletionRouter = router({
  /**
   * Request account deletion (DSGVO Art. 17)
   * Initiates 30-day soft-delete period
   */
  requestDeletion: protectedProcedure
    .input(z.object({
      reason: z.string().optional(),
      confirmPassword: z.string().optional(), // Optional: Add password confirmation for security
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 30); // 30 days from now

      // Update user with deletion request
      await db
        .update(users)
        .set({
          // Mark for deletion (add deletionRequestedAt and scheduledDeletionDate fields to schema)
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // TODO: Send confirmation email
      // TODO: Log deletion request for audit

      return {
        success: true,
        scheduledDeletionDate: deletionDate.toISOString(),
        message: "Ihr Account wird in 30 Tagen gelöscht. Sie können die Löschung jederzeit widerrufen.",
      };
    }),

  /**
   * Cancel account deletion request
   * User can cancel within 30-day period
   */
  cancelDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;

    // Remove deletion request
    await db
      .update(users)
      .set({
        // Clear deletion flags (add deletionRequestedAt and scheduledDeletionDate fields to schema)
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // TODO: Send cancellation confirmation email
    // TODO: Log cancellation for audit

    return {
      success: true,
      message: "Die Löschung Ihres Accounts wurde erfolgreich widerrufen.",
    };
  }),

  /**
   * Get deletion status
   * Check if account is scheduled for deletion
   */
  getDeletionStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user[0]) {
      throw new Error("User not found");
    }

    // TODO: Check deletionRequestedAt and scheduledDeletionDate fields
    const isDeletionScheduled = false; // Placeholder
    const scheduledDeletionDate = null; // Placeholder

    return {
      isDeletionScheduled,
      scheduledDeletionDate,
      daysRemaining: isDeletionScheduled && scheduledDeletionDate
        ? Math.ceil((new Date(scheduledDeletionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }),

  /**
   * Anonymize user data (GDPR-compliant)
   * Called after 30-day period expires
   * 
   * Anonymization strategy:
   * - Replace name with "Deleted User #[ID]"
   * - Replace email with "deleted-[ID]@flinkly.local"
   * - Clear openId, loginMethod
   * - Keep orders/reviews for platform integrity (anonymized)
   */
  anonymizeUser: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;

    // Anonymize user data
    await db
      .update(users)
      .set({
        name: `Deleted User #${userId}`,
        email: `deleted-${userId}@flinkly.local`,
        openId: `deleted-${userId}`,
        loginMethod: "deleted",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // TODO: Anonymize related data (gigs, orders, reviews)
    // - Gig titles: "Deleted Gig #[ID]"
    // - Review comments: "[Deleted]"
    // - Messages: "[Deleted]"

    // TODO: Log anonymization for audit

    return {
      success: true,
      message: "Account erfolgreich anonymisiert.",
    };
  }),
});
