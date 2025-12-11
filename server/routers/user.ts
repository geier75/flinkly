/**
 * User-Router (DSGVO-Funktionen: Datenexport, Account-Löschung)
 */

import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../adapters";
import { getCached, setCached, CacheKeys, CacheTTL } from "../_core/redis";

export const userRouter = router({
  /**
   * Get user profile by ID (with Redis caching)
   * Public endpoint for viewing seller profiles
   */
  getProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const cacheKey = CacheKeys.sellerProfile(input.userId);
      
      // Try cache first
      const cached = await getCached<any>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] ${cacheKey}`);
        return cached;
      }
      
      // Cache miss - fetch from database
      const profile = await db.getUserById(input.userId);
      
      if (!profile) {
        return null;
      }
      
      // Cache result
      await setCached(cacheKey, profile, CacheTTL.sellerProfile);
      console.log(`[Cache SET] ${cacheKey}`);
      
      return profile;
    }),

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
      // Store consent in consent_logs table with 12-month retention
      console.log(`[Consent-Log] User ${ctx.user.id} - Consent ${input.consentId} - Hash: ${input.hash}`);
      
      await db.createConsentLog({
        userId: ctx.user.id,
        consentId: input.consentId,
        timestamp: new Date(input.timestamp),
        version: input.version,
        essential: input.essential,
        statistics: input.statistics,
        marketing: input.marketing,
        personalization: input.personalization,
        hash: input.hash,
      });
      
      return { success: true };
    }),

  /**
   * Get account deletion status
   */
  getAccountDeletionStatus: protectedProcedure.query(async ({ ctx }) => {
    const request = await db.getAccountDeletionRequest(ctx.user.id);
    return request || null;
  }),

  /**
   * Update user profile (including commercial seller fields)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        bio: z.string().optional(),
        country: z.string().optional(),
        // Commercial seller fields (§ 5 TMG)
        isCommercial: z.boolean().optional(),
        companyName: z.string().optional(),
        companyAddress: z.string().optional(),
        taxId: z.string().optional(),
        tradeRegister: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Validate: If isCommercial=true, companyName and companyAddress are required
      if (input.isCommercial && (!input.companyName || !input.companyAddress)) {
        throw new Error(
          "Gewerbliche Anbieter müssen Firmenname und Adresse angeben (§ 5 TMG Impressumspflicht)."
        );
      }

      // Update user profile
      await db.updateUser(userId, input);

      // Invalidate cache
      const cacheKey = CacheKeys.sellerProfile(userId);
      await setCached(cacheKey, null, 0); // Delete cache
      console.log(`[Cache INVALIDATE] ${cacheKey}`);

      return {
        success: true,
        message: "Profil erfolgreich aktualisiert.",
      };
    }),
});
