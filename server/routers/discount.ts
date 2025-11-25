import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover" as any,
});

/**
 * Discount Router
 * 
 * Handles Stripe Coupon & Promotion Code creation for Exit-Intent-Modal
 */
export const discountRouter = router({
  /**
   * Create a discount code for Exit-Intent-Modal
   * 
   * Creates a Stripe Coupon + Promotion Code with:
   * - 5€ fixed discount
   * - Single-use per customer
   * - 24h expiration
   * - Unique code (exit5-RANDOM)
   */
  createExitIntentDiscount: publicProcedure
    .input(
      z.object({
        gigId: z.number(),
        gigPrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Create Coupon (5€ fixed discount)
        const coupon = await stripe.coupons.create({
          amount_off: 500, // 5€ in cents
          currency: "eur",
          duration: "once",
          name: `Exit Intent Discount - Gig #${input.gigId}`,
          metadata: {
            gigId: input.gigId.toString(),
            gigPrice: input.gigPrice.toString(),
            source: "exit_intent_modal",
          },
        });

        // Create Promotion Code
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `EXIT5-${randomSuffix}`;

        const promotionCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code,
          max_redemptions: 1, // Single-use
          expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24h expiration
          metadata: {
            gigId: input.gigId.toString(),
            source: "exit_intent_modal",
          },
        } as any);

        return {
          code: promotionCode.code,
          discountAmount: 5,
          expiresAt: promotionCode.expires_at,
        };
      } catch (error) {
        console.error("[Stripe] Failed to create discount code:", error);
        throw new Error("Failed to create discount code");
      }
    }),

  /**
   * Validate a discount code
   * 
   * Checks if a promotion code is valid and returns discount details
   */
  validateDiscountCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: input.code,
          limit: 1,
        });

        if (promotionCodes.data.length === 0) {
          return {
            valid: false,
            message: "Ungültiger Rabattcode",
          };
        }

        const promotionCode = promotionCodes.data[0];

        // Check if code is active
        if (!promotionCode.active) {
          return {
            valid: false,
            message: "Dieser Rabattcode ist nicht mehr aktiv",
          };
        }

        // Check if code is expired
        if (promotionCode.expires_at && promotionCode.expires_at < Math.floor(Date.now() / 1000)) {
          return {
            valid: false,
            message: "Dieser Rabattcode ist abgelaufen",
          };
        }

        // Check if code has been fully redeemed
        if (
          promotionCode.max_redemptions &&
          promotionCode.times_redeemed >= promotionCode.max_redemptions
        ) {
          return {
            valid: false,
            message: "Dieser Rabattcode wurde bereits eingelöst",
          };
        }

        // Get coupon details
        const coupon = await stripe.coupons.retrieve((promotionCode as any).coupon as string);

        return {
          valid: true,
          discountAmount: coupon.amount_off ? coupon.amount_off / 100 : 0,
          code: promotionCode.code,
        };
      } catch (error) {
        console.error("[Stripe] Failed to validate discount code:", error);
        return {
          valid: false,
          message: "Fehler beim Überprüfen des Rabattcodes",
        };
      }
    }),
});
