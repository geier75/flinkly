import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from '@trpc/server';
import { z } from "zod";
import * as db from "./db";
import * as v from "./validation";
import { sanitizeHTML, sanitizeText } from "@shared/sanitize";
import { userRouter } from "./routers/user";
import { messagesRouter } from "./routers/messages";
import { verificationRouter } from "./routers/verification";
import { adminRouter } from "./routers/admin";
import { similarGigsRouter } from "./routers/similarGigs";
import { discountRouter } from "./routers/discount";
import { dataExportRouter } from "./routers/dataExport";
import { accountDeletionRouter } from "./routers/accountDeletion";
import { favoritesRouter } from "./routers/favorites";
import { disputesRouter } from "./routers/disputes";
import { moderationRouter } from "./routers/moderation";
import { templatesRouter } from "./routers/templates";
import { analyticsRouter } from "./routers/analytics";
import { featureFlagsRouter } from "./routers/featureFlags";
import { passwordResetRouter } from "./routers/passwordReset";
import { paymentMethodsRouter } from "./routers/paymentMethods";
import { sendEmail } from "./_core/email";
import { orderConfirmationTemplate } from "./_core/emailTemplates";
import { trackPaymentSuccess } from "./_core/analytics";
import { getCached, setCached, deletePattern, CacheKeys, CacheTTL } from "./_core/redis";

export const appRouter = router({
  system: systemRouter,
  user: userRouter,
  messages: messagesRouter,
  verification: verificationRouter,
  admin: adminRouter,
  similarGigs: similarGigsRouter,
  discount: discountRouter,
  dataExport: dataExportRouter,
  accountDeletion: accountDeletionRouter,
  favorites: favoritesRouter,
  disputes: disputesRouter,
  moderation: moderationRouter,
  templates: templatesRouter,
  analytics: analyticsRouter,
  featureFlags: featureFlagsRouter,
  passwordReset: passwordResetRouter,
  paymentMethods: paymentMethodsRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  gigs: router({
    list: publicProcedure
      .input(z.object({ 
        limit: z.number().min(1).max(100).default(20), // DoS-Prevention: Max 100 items per request
        cursor: z.number().optional(), // Cursor-based pagination (last seen gig ID)
        category: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(["relevance", "price", "delivery", "rating", "popularity"]).optional().default("relevance"),
      }))
      .query(async ({ input }) => {
        // Enforce max limit server-side (defense in depth)
        const safeLimit = Math.min(input.limit, 100);
        
        // Build cache key (only cache first page without cursor for simplicity)
        const cacheKey = !input.cursor 
          ? CacheKeys.gigsList(input.category, input.sortBy, 1)
          : null;
        
        // Try cache first (only for first page)
        if (cacheKey) {
          const cached = await getCached<{ gigs: any[]; nextCursor?: number }>(cacheKey);
          if (cached) {
            console.log(`[Cache HIT] ${cacheKey}`);
            return cached;
          }
        }
        
        // Cache miss - fetch from database
        const gigs = await db.getGigsPaginated({
          limit: safeLimit,
          cursor: input.cursor,
          category: input.category,
          minPrice: input.minPrice,
          maxPrice: input.maxPrice,
          sortBy: input.sortBy,
        });
        
        // Return cursor for next page (last gig ID)
        const nextCursor = gigs.length === safeLimit ? gigs[gigs.length - 1].id : undefined;
        
        const result = {
          gigs,
          nextCursor,
        };
        
        // Cache result (only first page)
        if (cacheKey) {
          await setCached(cacheKey, result, CacheTTL.gigsList);
          console.log(`[Cache SET] ${cacheKey}`);
        }
        
        return result;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getGigById(input.id)),

    myGigs: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(({ ctx, input }) => {
        const limit = input?.limit ? Math.min(input.limit, 100) : 50;
        const offset = input?.offset || 0;
        return db.getSellerGigs(ctx.user.id, limit, offset);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(5).max(255),
        description: z.string().min(20),
        category: z.string(),
        price: z.number().min(100).max(25000),
        deliveryDays: z.number().default(3),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createGig({
          sellerId: ctx.user.id,
          title: sanitizeText(input.title),
          description: sanitizeHTML(input.description),
          category: input.category,
          price: input.price,
          deliveryDays: input.deliveryDays,
          imageUrl: input.imageUrl,
          status: "published",
          active: true,
        });
        
        // Invalidate gigs list cache
        await deletePattern("gigs:list:*");
        console.log("[Cache INVALIDATE] gigs:list:* (new gig created)");
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(5).max(255).optional(),
        description: z.string().min(20).optional(),
        category: z.string().optional(),
        price: z.number().min(100).max(25000).optional(),
        deliveryDays: z.number().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateGig(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGig(input.id);
        return { success: true };
      }),

    saveDraft: protectedProcedure
      .input(z.object({
        title: z.string().min(5).max(255),
        description: z.string().min(20),
        category: z.string(),
        price: z.number().min(100).max(25000),
        deliveryDays: z.number().default(3),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createGig({
          sellerId: ctx.user.id,
          title: sanitizeText(input.title),
          description: sanitizeHTML(input.description),
          category: input.category,
          price: input.price,
          deliveryDays: input.deliveryDays,
          imageUrl: input.imageUrl,
          status: "draft",
        });
        return { success: true };
      }),

    getDrafts: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getSellerDrafts(ctx.user.id);
      }),

    publish: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.publishGig(input.id);
        return { success: true };
      }),
  }),

  gigPackages: router({
    list: publicProcedure
      .input(z.object({ gigId: z.number() }))
      .query(({ input }) => db.getGigPackages(input.gigId)),

    create: protectedProcedure
      .input(z.object({
        gigId: z.number(),
        packageType: z.enum(["basic", "standard", "premium"]),
        name: z.string().min(3).max(100),
        description: z.string().min(10),
        price: z.number().min(100).max(25000),
        deliveryDays: z.number().min(1).max(30),
        revisions: z.number().min(0).max(10),
        features: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const featuresJson = input.features ? JSON.stringify(input.features) : null;
        const id = await db.createGigPackage({
          ...input,
          features: featuresJson,
        });
        return { success: true, id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(3).max(100).optional(),
        description: z.string().min(10).optional(),
        price: z.number().min(100).max(25000).optional(),
        deliveryDays: z.number().min(1).max(30).optional(),
        revisions: z.number().min(0).max(10).optional(),
        features: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, features, ...updates } = input;
        const finalUpdates = {
          ...updates,
          ...(features ? { features: JSON.stringify(features) } : {}),
        };
        await db.updateGigPackage(id, finalUpdates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGigPackage(input.id);
        return { success: true };
      }),
  }),

  gigExtras: router({
    list: publicProcedure
      .input(z.object({ gigId: z.number() }))
      .query(({ input }) => db.getGigExtras(input.gigId)),

    create: protectedProcedure
      .input(z.object({
        gigId: z.number(),
        extraType: z.enum(["express_delivery", "extra_revisions", "commercial_license", "source_files", "custom"]),
        name: z.string().min(3).max(100),
        description: z.string().optional(),
        price: z.number().min(100).max(10000),
        deliveryDaysReduction: z.number().min(0).max(10).optional(),
        revisionsAdded: z.number().min(0).max(5).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createGigExtra(input);
        return { success: true, id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(3).max(100).optional(),
        description: z.string().optional(),
        price: z.number().min(100).max(10000).optional(),
        deliveryDaysReduction: z.number().min(0).max(10).optional(),
        revisionsAdded: z.number().min(0).max(5).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateGigExtra(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGigExtra(input.id);
        return { success: true };
      }),
  }),

  orders: router({
    myPurchases: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(({ ctx, input }) => {
        const limit = input?.limit ? Math.min(input.limit, 100) : 50;
        const offset = input?.offset || 0;
        return db.getBuyerOrders(ctx.user.id, limit, offset);
      }),

    mySales: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(({ ctx, input }) => {
        const limit = input?.limit ? Math.min(input.limit, 100) : 50;
        const offset = input?.offset || 0;
        return db.getSellerOrders(ctx.user.id, limit, offset);
      }),

    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderById(input.orderId);
      }),

    create: protectedProcedure
      .input(z.object({
        gigId: z.number(),
        buyerMessage: z.string().optional(),
        selectedPackage: z.enum(["basic", "standard", "premium"]).optional().default("basic"),
        selectedExtras: z.array(z.number()).optional(), // Array of extra IDs
      }))
      .mutation(async ({ ctx, input }) => {
        const gig = await db.getGigById(input.gigId);
        if (!gig) throw new Error("Gig not found");

        const order = await db.createOrder({
          gigId: input.gigId,
          buyerId: ctx.user.id,
          sellerId: gig.sellerId,
          totalPrice: gig.price,
          buyerMessage: input.buyerMessage,
          selectedPackage: input.selectedPackage,
          selectedExtras: input.selectedExtras ? JSON.stringify(input.selectedExtras) : null,
          status: "pending",
        });

        // Create order-based conversation thread
        await db.createConversation({
          orderId: order!.id,
          buyerId: ctx.user.id,
          sellerId: gig.sellerId,
        });

        // Track payment success event
        trackPaymentSuccess(ctx.user.id, order!.id, gig.id, gig.price);
        
        // Send order confirmation email to buyer
        const buyer = await db.getUserById(ctx.user.id);
        const seller = await db.getUserById(gig.sellerId);
        
        if (buyer?.email) {
          const emailHtml = orderConfirmationTemplate({
            buyerName: buyer.name || 'Kunde',
            orderId: order!.id,
            gigTitle: gig.title,
            price: gig.price,
            sellerName: seller?.name || 'Seller',
            deliveryDays: gig.deliveryDays,
          });
          
          await sendEmail({
            to: buyer.email,
            subject: `Bestellung bestätigt - ${gig.title} (#${order!.id})`,
            html: emailHtml,
          });
        }

        return { success: true, orderId: order!.id };
      }),

    updateStatus: protectedProcedure
      .input(z.object({ 
        orderId: z.number(), 
        status: z.enum(["pending", "in_progress", "preview", "delivered", "revision", "completed", "disputed", "cancelled"])
      }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.orderId, input.status);
        return { success: true };
      }),

    acceptDelivery: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.orderId, "completed");
        return { success: true };
      }),

    requestRevision: protectedProcedure
      .input(z.object({ orderId: z.number(), reason: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.orderId, "revision");
        return { success: true };
      }),

    openDispute: protectedProcedure
      .input(z.object({ orderId: z.number(), reason: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.orderId, "disputed");
        return { success: true };
      }),

    createFromStripeSession: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const Stripe = (await import('stripe')).default;
        const { ENV } = await import('./_core/env');
        const stripe = new Stripe(ENV.stripeSecretKey, {
          apiVersion: '2025-10-29.clover',
          typescript: true,
        });

        // Retrieve checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        
        if (!session || session.payment_status !== 'paid') {
          throw new Error('Payment not completed');
        }

        // Extract metadata
        const gigId = parseInt(session.metadata?.gig_id || '0');
        const buyerId = parseInt(session.metadata?.buyer_id || '0');
        const sellerId = parseInt(session.metadata?.seller_id || '0');
        const buyerMessage = session.metadata?.buyer_message;
        const selectedPackage = (session.metadata?.selected_package || 'basic') as 'basic' | 'standard' | 'premium';
        const selectedExtras = session.metadata?.selected_extras;

        // Verify buyer matches authenticated user
        if (buyerId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        const gig = await db.getGigById(gigId);
        if (!gig) throw new Error('Gig not found');

        // Create order
        const order = await db.createOrder({
          gigId,
          buyerId,
          sellerId,
          totalPrice: gig.price,
          buyerMessage,
          selectedPackage,
          selectedExtras,
          status: 'pending',
        });

        // Create order-based conversation thread
        await db.createConversation({
          orderId: order!.id,
          buyerId,
          sellerId,
        });

        // Track payment success event
        trackPaymentSuccess(ctx.user.id, order!.id, gigId, gig.price);
        
        // Send order confirmation email to buyer
        const buyer = await db.getUserById(buyerId);
        const seller = await db.getUserById(sellerId);
        
        if (buyer?.email) {
          const emailHtml = orderConfirmationTemplate({
            buyerName: buyer.name || 'Kunde',
            orderId: order!.id,
            gigTitle: gig.title,
            price: gig.price,
            sellerName: seller?.name || 'Seller',
            deliveryDays: gig.deliveryDays,
          });
          
          await sendEmail({
            to: buyer.email,
            subject: `Bestellung bestätigt - ${gig.title} (#${order!.id})`,
            html: emailHtml,
          });
        }

        return { success: true, orderId: order!.id };
      }),
  }),

  reviews: router({
    getGigReviews: publicProcedure
      .input(z.object({ 
        gigId: z.number(),
        limit: z.number().min(1).max(100).default(50), // DoS-Prevention: Max 100 reviews per request
        offset: z.number().min(0).default(0),
      }))
      .query(({ input }) => {
        const safeLimit = Math.min(input.limit, 100);
        return db.getGigReviews(input.gigId, safeLimit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        gigId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReview({
          orderId: input.orderId,
          gigId: input.gigId,
          reviewerId: ctx.user.id,
          rating: input.rating,
          comment: input.comment,
        });
        return { success: true };
      }),
  }),

  payment: router({
    createCheckout: protectedProcedure
      .input(z.object({ 
        gigId: z.number(),
        buyerMessage: z.string().optional(),
        selectedPackage: z.enum(['basic', 'standard', 'premium']).optional(),
        selectedExtras: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import('./payment');
        
        const gig = await db.getGigById(input.gigId);
        if (!gig) throw new Error("Gig not found");
        
        // Get seller's Stripe Connect account (if exists)
        const seller = await db.getUserById(gig.sellerId);
        const sellerStripeAccountId = seller?.stripeAccountId || undefined;
        
        if (!sellerStripeAccountId) {
          console.warn(`[Payment] Seller ${gig.sellerId} has no Stripe Connect account - funds will go to platform`);
        }

        const session = await createCheckoutSession({
          gigId: gig.id,
          gigTitle: gig.title,
          gigPrice: Number(gig.price),
          buyerId: ctx.user.id,
          buyerEmail: ctx.user.email || '',
          buyerName: ctx.user.name || '',
          sellerId: gig.sellerId,
          sellerStripeAccountId,
          origin: ctx.req.headers.origin || 'http://localhost:3000',
          buyerMessage: input.buyerMessage,
          selectedPackage: input.selectedPackage,
          selectedExtras: input.selectedExtras ? JSON.stringify(input.selectedExtras) : undefined,
        });

        return session;
      }),

    capturePayment: protectedProcedure
      .input(z.object({ paymentIntentId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { capturePayment } = await import('./payment');
        await capturePayment(input.paymentIntentId);
        return { success: true };
      }),

    refund: protectedProcedure
      .input(z.object({ 
        paymentIntentId: z.string(),
        amount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { refundPayment } = await import('./payment');
        await refundPayment(input.paymentIntentId, input.amount);
        return { success: true };
      }),
    
    // Stripe Connect procedures
    createConnectAccount: protectedProcedure
      .input(z.object({
        country: z.enum(['DE', 'AT', 'CH']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createConnectAccount } = await import('./payment');
        
        // Check if user already has a Connect account
        const user = await db.getUserById(ctx.user.id);
        if (user?.stripeAccountId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already has a Stripe Connect account',
          });
        }
        
        const result = await createConnectAccount(
          ctx.user.id,
          ctx.user.email || '',
          input.country || 'DE'
        );
        
        return result;
      }),
    
    getConnectAccountStatus: protectedProcedure
      .query(async ({ ctx }) => {
        const user = await db.getUserById(ctx.user.id);
        
        return {
          hasAccount: !!user?.stripeAccountId,
          accountId: user?.stripeAccountId || null,
          onboardingComplete: user?.stripeOnboardingComplete || false,
          chargesEnabled: user?.stripeChargesEnabled || false,
          payoutsEnabled: user?.stripePayoutsEnabled || false,
        };
      }),
    
    refreshOnboardingLink: protectedProcedure
      .mutation(async ({ ctx }) => {
        const user = await db.getUserById(ctx.user.id);
        
        if (!user?.stripeAccountId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No Stripe Connect account found',
          });
        }
        
        const { stripe } = await import('./payment');
        const { ENV } = await import('./_core/env');
        
        const accountLink = await stripe.accountLinks.create({
          account: user.stripeAccountId,
          refresh_url: `${ENV.frontendUrl}/seller-dashboard?onboarding=refresh`,
          return_url: `${ENV.frontendUrl}/seller-dashboard?onboarding=complete`,
          type: 'account_onboarding',
        });
        
        return { url: accountLink.url };
      }),
  }),

  payout: router({
    getEarnings: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getSellerEarnings(ctx.user.id);
      }),

    getPayouts: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getSellerPayouts(ctx.user.id);
      }),

    requestPayout: protectedProcedure
      .input(z.object({ 
        amount: z.number().min(2000), // Minimum 20€
        stripeAccountId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createPayout: createPayoutStripe } = await import('./payment');
        
        const earnings = await db.getSellerEarnings(ctx.user.id);
        if (earnings.available < input.amount) {
          throw new Error("Insufficient balance");
        }

        // Create Stripe payout
        const stripePayoutId = await createPayoutStripe(
          input.stripeAccountId,
          input.amount / 100 // Convert cents to EUR
        );

        // Record payout in DB
        await db.createPayout({
          sellerId: ctx.user.id,
          amount: input.amount,
          currency: 'EUR',
          status: 'pending',
          stripePayoutId: stripePayoutId.id,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
