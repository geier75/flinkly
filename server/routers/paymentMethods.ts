import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  savePaymentMethod,
  getPaymentMethodsByUserId,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getDefaultPaymentMethod,
} from "../adapters";
import Stripe from "stripe";
import { ENV } from "../_core/env";

// Lazy initialization to prevent startup crash when STRIPE_SECRET_KEY is not set
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(ENV.stripeSecretKey, {
      apiVersion: "2025-11-17.clover" as any,
    });
  }
  return stripe;
}

/**
 * Payment Methods Router - Stripe Payment Method Management
 * 
 * Enables users to:
 * - Save payment methods for faster checkout
 * - List saved payment methods
 * - Delete payment methods
 * - Set default payment method
 * 
 * Security:
 * - All procedures are protected (requires authentication)
 * - Stripe PaymentMethod IDs are tokenized (no raw card data stored)
 * - User can only access their own payment methods
 */
export const paymentMethodsRouter = router({
  /**
   * Create a SetupIntent for adding a new payment method
   * This is required before the frontend can collect card details
   * 
   * Flow:
   * 1. Frontend calls this to get clientSecret
   * 2. Frontend uses Stripe Elements with clientSecret
   * 3. User enters card details
   * 4. Frontend confirms SetupIntent
   * 5. Frontend calls save() with the PaymentMethod ID
   */
  createSetupIntent: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const stripe = getStripe();
      
      // Get or create Stripe Customer for this user
      let customerId = (ctx.user as any).stripeCustomerId as string | null;
      
      if (!customerId) {
        // Create a new Stripe Customer
        const customer = await stripe.customers.create({
          email: ctx.user.email || undefined,
          name: ctx.user.name || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
          },
        });
        customerId = customer.id;
        
        // TODO: Save customerId to user in database
        // For now, we'll just use it for this session
      }
      
      // Create SetupIntent
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session', // Allow future payments without customer present
      });
      
      return {
        clientSecret: setupIntent.client_secret,
        customerId,
      };
    } catch (error) {
      console.error("[PaymentMethods] CreateSetupIntent error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Fehler beim Erstellen des Setup-Intents",
      });
    }
  }),

  /**
   * Save a new payment method from Stripe
   * 
   * Flow:
   * 1. Frontend creates PaymentMethod via Stripe.js
   * 2. Frontend sends stripePaymentMethodId to this procedure
   * 3. Backend retrieves PaymentMethod details from Stripe
   * 4. Backend saves metadata (last4, brand, expiry) to database
   * 
   * @param stripePaymentMethodId - Stripe PaymentMethod ID (pm_xxx)
   * @param setAsDefault - Whether to set this as the default payment method
   */
  save: protectedProcedure
    .input(
      z.object({
        stripePaymentMethodId: z.string().min(1),
        setAsDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Retrieve PaymentMethod from Stripe to get card details
        const paymentMethod = await getStripe().paymentMethods.retrieve(
          input.stripePaymentMethodId
        );

        if (paymentMethod.type !== "card" || !paymentMethod.card) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only card payment methods are supported",
          });
        }

        const card = paymentMethod.card;

        // Save to database
        const savedPaymentMethod = await savePaymentMethod({
          userId: ctx.user.id,
          stripePaymentMethodId: input.stripePaymentMethodId,
          last4: card.last4,
          brand: card.brand,
          expiryMonth: card.exp_month,
          expiryYear: card.exp_year,
          isDefault: input.setAsDefault,
        });

        return {
          success: true,
          paymentMethod: savedPaymentMethod,
        };
      } catch (error) {
        console.error("[PaymentMethods] Save error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save payment method",
        });
      }
    }),

  /**
   * List all saved payment methods for current user
   * 
   * Returns:
   * - Array of payment methods (sorted by isDefault DESC, createdAt DESC)
   * - Each payment method includes: id, last4, brand, expiry, isDefault
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const paymentMethods = await getPaymentMethodsByUserId(ctx.user.id);
      return paymentMethods;
    } catch (error) {
      console.error("[PaymentMethods] List error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve payment methods",
      });
    }
  }),

  /**
   * Delete a saved payment method
   * 
   * Security:
   * - User can only delete their own payment methods
   * - Also detaches PaymentMethod from Stripe Customer (if attached)
   * 
   * @param id - Database ID of payment method
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get payment method to verify ownership
        const paymentMethods = await getPaymentMethodsByUserId(ctx.user.id);
        const paymentMethod = paymentMethods.find((pm: any) => pm.id === input.id);

        if (!paymentMethod) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment method not found",
          });
        }

        // Detach from Stripe (if attached to customer)
        try {
          await getStripe().paymentMethods.detach(
            paymentMethod.stripePaymentMethodId
          );
        } catch (stripeError: any) {
          // Ignore if already detached or doesn't exist
          if (stripeError.code !== "resource_missing") {
            console.warn("[PaymentMethods] Stripe detach warning:", stripeError);
          }
        }

        // Delete from database
        await deletePaymentMethod(input.id);

        return {
          success: true,
        };
      } catch (error) {
        console.error("[PaymentMethods] Delete error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete payment method",
        });
      }
    }),

  /**
   * Set a payment method as default
   * 
   * Security:
   * - User can only set their own payment methods as default
   * - Automatically unsets previous default
   * 
   * @param id - Database ID of payment method
   */
  setDefault: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify ownership
        const paymentMethods = await getPaymentMethodsByUserId(ctx.user.id);
        const paymentMethod = paymentMethods.find((pm: any) => pm.id === input.id);

        if (!paymentMethod) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment method not found",
          });
        }

        // Set as default (automatically unsets previous default)
        await setDefaultPaymentMethod(ctx.user.id, input.id);

        return {
          success: true,
        };
      } catch (error) {
        console.error("[PaymentMethods] SetDefault error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set default payment method",
        });
      }
    }),

  /**
   * Get default payment method for current user
   * 
   * Returns:
   * - Default payment method or null if none set
   */
  getDefault: protectedProcedure.query(async ({ ctx }) => {
    try {
      const defaultPaymentMethod = await getDefaultPaymentMethod(ctx.user.id);
      return defaultPaymentMethod;
    } catch (error) {
      console.error("[PaymentMethods] GetDefault error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve default payment method",
      });
    }
  }),
});
