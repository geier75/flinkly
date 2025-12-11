import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as stripeConnect from "../stripeConnect";
import * as db from "../adapters";
import { ENV } from "../_core/env";

/**
 * Stripe Connect router for seller onboarding and account management
 */
export const stripeConnectRouter = router({
  /**
   * Create a Stripe Connect account for the current user (seller)
   * This initiates the onboarding process
   */
  createAccount: protectedProcedure
    .input(
      z.object({
        country: z.enum(["DE", "AT", "CH"]).default("DE"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      // Check if user already has a Connect account
      if (user.stripeAccountId) {
        return {
          success: false,
          error: "User already has a Stripe Connect account",
          accountId: user.stripeAccountId,
        };
      }

      // Validate email before creating account
      if (!user.email) {
        throw new Error("E-Mail-Adresse erforderlich. Bitte aktualisiere dein Profil.");
      }

      // Create Connect account
      const { accountId } = await stripeConnect.createConnectAccount({
        email: user.email,
        country: input.country,
      });

      // Save account ID to database
      await db.updateUser(user.id, {
        stripeAccountId: accountId,
      });

      return {
        success: true,
        accountId,
      };
    }),

  /**
   * Get onboarding link for seller to complete Stripe Connect setup
   * This redirects to Stripe's hosted onboarding flow
   */
  getOnboardingLink: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.stripeAccountId) {
      throw new Error("User does not have a Stripe Connect account. Create one first.");
    }

    // Generate onboarding link
    const { url } = await stripeConnect.createAccountLink({
      accountId: user.stripeAccountId,
      refreshUrl: `${ENV.frontendUrl}/seller/dashboard?refresh=true`,
      returnUrl: `${ENV.frontendUrl}/seller/dashboard?onboarding=complete`,
    });

    return { url };
  }),

  /**
   * Get current Stripe Connect account status
   * Shows if seller can receive payments
   */
  getAccountStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.stripeAccountId) {
      return {
        hasAccount: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
      };
    }

    const status = await stripeConnect.getAccountStatus(user.stripeAccountId);

    // Update database with latest status
    await db.updateUser(user.id, {
      stripeOnboardingComplete: status.detailsSubmitted,
      stripeChargesEnabled: status.chargesEnabled,
      stripePayoutsEnabled: status.payoutsEnabled,
    });

    return {
      hasAccount: true,
      accountId: user.stripeAccountId,
      ...status,
      onboardingComplete: status.detailsSubmitted,
    };
  }),

  /**
   * Get Stripe Express Dashboard login link
   * Sellers can view earnings, payouts, and manage their account
   */
  getDashboardLink: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.stripeAccountId) {
      throw new Error("User does not have a Stripe Connect account");
    }

    const { url } = await stripeConnect.createLoginLink(user.stripeAccountId);

    return { url };
  }),

  /**
   * Get seller earnings summary
   * Shows total earnings, platform fees, and pending payouts
   */
  getEarnings: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    // Get all completed orders for this seller
    const orders = await db.getOrdersBySellerId(user.id);

    const completedOrders = orders.filter((o: any) => o.status === "completed");

    const totalEarnings = completedOrders.reduce((sum: number, o: any) => sum + (o.sellerEarnings || 0), 0);
    const totalPlatformFees = completedOrders.reduce((sum: number, o: any) => sum + (o.platformFee || 0), 0);
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);

    return {
      totalEarnings, // What seller receives (in cents)
      totalPlatformFees, // What platform keeps (in cents)
      totalRevenue, // Total amount buyers paid (in cents)
      completedOrdersCount: completedOrders.length,
      platformFeePercent: 15, // Default platform fee
    };
  }),
});
