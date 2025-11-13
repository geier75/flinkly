/**
 * User-Router (DSGVO-Funktionen: Datenexport, Account-Löschung)
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const userRouter = router({
  /**
   * Datenexport (DSGVO Art. 20)
   */
  exportData: protectedProcedure
    .input(
      z.object({
        includeProfile: z.boolean().default(true),
        includeGigs: z.boolean().default(true),
        includeOrders: z.boolean().default(true),
        includeMessages: z.boolean().default(true),
        includeReviews: z.boolean().default(true),
        includeTransactions: z.boolean().default(true),
        format: z.enum(["json", "csv"]).default("json"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const exportData: any = {
        exportDate: new Date().toISOString(),
        userId,
        format: input.format,
        data: {},
      };

      // Profile
      if (input.includeProfile) {
        exportData.data.profile = await db.getUserById(userId);
      }

      // Gigs
      if (input.includeGigs) {
        exportData.data.gigs = await db.getGigsBySellerId(userId);
      }

      // Orders (as buyer and seller)
      if (input.includeOrders) {
        const buyerOrders = await db.getOrdersByBuyerId(userId);
        const sellerOrders = await db.getOrdersBySellerId(userId);
        exportData.data.orders = {
          asBuyer: buyerOrders,
          asSeller: sellerOrders,
        };
      }

      // Messages
      if (input.includeMessages) {
        exportData.data.messages = await db.getMessagesByUserId(userId);
      }

      // Reviews
      if (input.includeReviews) {
        const givenReviews = await db.getReviewsByReviewerId(userId);
        const receivedReviews = await db.getReviewsByGigSellerId(userId);
        exportData.data.reviews = {
          given: givenReviews,
          received: receivedReviews,
        };
      }

      // Transactions
      if (input.includeTransactions) {
        exportData.data.transactions = await db.getTransactionsByUserId(userId);
      }

      return exportData;
    }),

  /**
   * Account-Löschung (DSGVO Art. 17)
   */
  deleteAccount: protectedProcedure
    .input(
      z.object({
        reason: z.string().optional(),
        confirmPassword: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check for active orders
      const activeOrders = await db.getActiveOrdersByUserId(userId);
      if (activeOrders.length > 0) {
        throw new Error(
          "Account kann nicht gelöscht werden: Es gibt noch aktive Bestellungen. Bitte warten Sie, bis alle Bestellungen abgeschlossen sind."
        );
      }

      // Schedule deletion (30 days grace period)
      await db.scheduleAccountDeletion(userId, input.reason || "User requested deletion");

      return {
        success: true,
        deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        message:
          "Ihr Account wird in 30 Tagen gelöscht. Sie können die Löschung jederzeit widerrufen, indem Sie sich erneut anmelden.",
      };
    }),

  /**
   * Account-Löschung widerrufen
   */
  cancelAccountDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    await db.cancelAccountDeletion(userId);

    return {
      success: true,
      message: "Die Account-Löschung wurde erfolgreich widerrufen.",
    };
  }),

  /**
   * Log consent for DSGVO compliance (Proof-of-Consent)
   */
  logConsent: protectedProcedure
    .input(
      z.object({
        consentId: z.string().uuid(),
        timestamp: z.string(),
        version: z.string(),
        essential: z.boolean(),
        statistics: z.boolean(),
        marketing: z.boolean(),
        personalization: z.boolean(),
        hash: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production: store in consent_logs table with 12-month retention
      console.log(`[Consent-Log] User ${ctx.user.id} - Consent ${input.consentId} - Hash: ${input.hash}`);
      
      // TODO: Implement consent_logs table and store consent
      // await db.createConsentLog({
      //   userId: ctx.user.id,
      //   consentId: input.consentId,
      //   timestamp: input.timestamp,
      //   version: input.version,
      //   essential: input.essential,
      //   statistics: input.statistics,
      //   marketing: input.marketing,
      //   personalization: input.personalization,
      //   hash: input.hash,
      // });
      
      return { success: true };
    }),
});
