/**
 * Feature-Flags-Router (tRPC Procedures für A/B-Testing)
 */

import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import * as featureFlags from "../_core/featureFlags";

export const featureFlagsRouter = router({
  /**
   * Get CTA-Button-Text for current user
   */
  getCtaButtonText: protectedProcedure.query(async ({ ctx }) => {
    const text = await featureFlags.getCtaButtonText(ctx.user.id);
    return { text };
  }),

  /**
   * Get Pricing-Format for current user
   */
  getPricingFormat: protectedProcedure.query(async ({ ctx }) => {
    // Example: Format a test price
    const formatted = await featureFlags.formatPrice(ctx.user.id, 149);
    return { formatted };
  }),

  /**
   * Get Checkout-Flow for current user
   */
  getCheckoutFlow: protectedProcedure.query(async ({ ctx }) => {
    const flow = await featureFlags.getCheckoutFlow(ctx.user.id);
    return { flow };
  }),

  /**
   * Get Trust-Badge for current user
   */
  getTrustBadge: protectedProcedure.query(async ({ ctx }) => {
    const badge = await featureFlags.getTrustBadge(ctx.user.id);
    return { badge };
  }),

  /**
   * Check if Video-Calls are enabled for current user
   */
  isVideoCallsEnabled: protectedProcedure.query(async ({ ctx }) => {
    const enabled = await featureFlags.isVideoCallsEnabled(ctx.user.id);
    return { enabled };
  }),

  /**
   * Check if AI-Matching is enabled for current user
   */
  isAiMatchingEnabled: protectedProcedure.query(async ({ ctx }) => {
    const enabled = await featureFlags.isAiMatchingEnabled(ctx.user.id);
    return { enabled };
  }),

  /**
   * Check if Premium-Features are enabled for current user
   */
  isPremiumFeaturesEnabled: protectedProcedure.query(async ({ ctx }) => {
    const enabled = await featureFlags.isPremiumFeaturesEnabled(ctx.user.id);
    return { enabled };
  }),

  /**
   * Get all active flags for current user (for debugging)
   */
  getActiveFlags: protectedProcedure.query(async ({ ctx }) => {
    const flags = await featureFlags.getActiveFlags(ctx.user.id);
    return { flags };
  }),
});
