import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
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
        limit: z.number().default(20), 
        offset: z.number().default(0),
        category: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      }))
      .query(async ({ input }) => {
        // TODO: Add filtering by category and price
        return await db.getGigs(input.limit, input.offset);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getGigById(input.id)),

    myGigs: protectedProcedure
      .query(({ ctx }) => db.getSellerGigs(ctx.user.id)),

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

  orders: router({
    myPurchases: protectedProcedure
      .query(({ ctx }) => db.getBuyerOrders(ctx.user.id)),

    mySales: protectedProcedure
      .query(({ ctx }) => db.getSellerOrders(ctx.user.id)),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        gigId: z.number(),
        buyerMessage: z.string().optional(),
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
          status: "pending",
        });

        // Create order-based conversation thread
        await db.createConversation({
          orderId: order!.id,
          buyerId: ctx.user.id,
          sellerId: gig.sellerId,
        });

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
  }),

  reviews: router({
    getGigReviews: publicProcedure
      .input(z.object({ gigId: z.number() }))
      .query(({ input }) => db.getGigReviews(input.gigId)),

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
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import('./payment');
        
        const gig = await db.getGigById(input.gigId);
        if (!gig) throw new Error("Gig not found");

        const session = await createCheckoutSession({
          gigId: gig.id,
          gigTitle: gig.title,
          gigPrice: Number(gig.price),
          buyerId: ctx.user.id,
          buyerEmail: ctx.user.email || '',
          buyerName: ctx.user.name || '',
          sellerId: gig.sellerId,
          origin: ctx.req.headers.origin || 'http://localhost:3000',
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
