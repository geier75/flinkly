import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { gigViews, gigStats, gigs, orders } from "../../drizzle/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";
import { TRPCError } from '@trpc/server';
import { getPlatformFeeSummary } from '../services/platformAnalyticsService';

export const analyticsRouter = router({
  /**
   * Track Gig-View for Analytics
   * Called when user opens GigDetail-Page
   */
  trackGigView: protectedProcedure
    .input(z.object({ gigId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Insert view-record
      await db.insert(gigViews).values({
        gigId: input.gigId,
        userId: ctx.user.id,
        ipHash: null, // TODO: Hash IP from request for GDPR compliance
        viewedAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Get Gig-Stats for specific Gig (Views, Orders, Revenue)
   * Used in Seller-Dashboard for individual Gig-Performance
   */
  getGigStats: protectedProcedure
    .input(
      z.object({
        gigId: z.number(),
        timeRange: z.enum(["7", "30", "90"]).default("30"),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { stats: [], totalViews: 0, totalOrders: 0, totalRevenue: 0, conversionRate: 0 };

      const daysAgo = parseInt(input.timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Get views count
      const viewsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(gigViews)
        .where(and(eq(gigViews.gigId, input.gigId), gte(gigViews.viewedAt, startDate)));

      const totalViews = viewsResult[0]?.count || 0;

      // Get orders count + revenue
      const ordersResult = await db
        .select({
          count: sql<number>`count(*)`,
          revenue: sql<number>`sum(${orders.totalPrice})`,
        })
        .from(orders)
        .where(and(eq(orders.gigId, input.gigId), gte(orders.createdAt, startDate)));

      const totalOrders = ordersResult[0]?.count || 0;
      const totalRevenue = ordersResult[0]?.revenue || 0;

      // Calculate conversion-rate
      const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;

      // Get daily stats (for chart)
      const dailyStats = await db
        .select({
          date: sql<string>`DATE(${gigViews.viewedAt})`,
          views: sql<number>`count(*)`,
        })
        .from(gigViews)
        .where(and(eq(gigViews.gigId, input.gigId), gte(gigViews.viewedAt, startDate)))
        .groupBy(sql`DATE(${gigViews.viewedAt})`)
        .orderBy(sql`DATE(${gigViews.viewedAt})`);

      return {
        stats: dailyStats,
        totalViews,
        totalOrders,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 100) / 100, // 2 decimals
      };
    }),

  /**
   * Get Revenue-Overview for Seller (All Gigs)
   * Used in Seller-Dashboard for Total-Revenue-Tracking
   */
  getRevenue: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(["7", "30", "90"]).default("30"),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { dailyRevenue: [], totalRevenue: 0, totalOrders: 0 };

      const daysAgo = parseInt(input.timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Get seller's gig IDs
      const sellerGigs = await db
        .select({ id: gigs.id })
        .from(gigs)
        .where(eq(gigs.sellerId, ctx.user.id));

      const gigIds = sellerGigs.map((g) => g.id);

      if (gigIds.length === 0) {
        return { dailyRevenue: [], totalRevenue: 0, totalOrders: 0 };
      }

      // Get daily revenue
      const dailyRevenue = await db
        .select({
          date: sql<string>`DATE(${orders.createdAt})`,
          revenue: sql<number>`sum(${orders.totalPrice})`,
          orders: sql<number>`count(*)`,
        })
        .from(orders)
        .where(and(sql`${orders.gigId} IN (${sql.join(gigIds, sql`, `)})`, gte(orders.createdAt, startDate)))
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);

      // Get total revenue + orders
      const totals = await db
        .select({
          revenue: sql<number>`sum(${orders.totalPrice})`,
          orders: sql<number>`count(*)`,
        })
        .from(orders)
        .where(and(sql`${orders.gigId} IN (${sql.join(gigIds, sql`, `)})`, gte(orders.createdAt, startDate)));

      return {
        dailyRevenue,
        totalRevenue: totals[0]?.revenue || 0,
        totalOrders: totals[0]?.orders || 0,
      };
    }),

  /**
   * Get Performance-Metrics for Seller
   * Response-Time, Completion-Rate, Avg-Rating
   */
  getPerformance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db)
      return {
        avgResponseTime: 0,
        completionRate: 0,
        avgRating: 0,
        totalCompletedOrders: 0,
      };

    // Get seller's gig IDs
    const sellerGigs = await db
      .select({ id: gigs.id, averageRating: gigs.averageRating, completedOrders: gigs.completedOrders })
      .from(gigs)
      .where(eq(gigs.sellerId, ctx.user.id));

    if (sellerGigs.length === 0) {
      return {
        avgResponseTime: 0,
        completionRate: 0,
        avgRating: 0,
        totalCompletedOrders: 0,
      };
    }

    // Calculate avg-rating across all gigs
    const totalRating = sellerGigs.reduce((sum, g) => sum + (g.averageRating || 0), 0);
    const avgRating = sellerGigs.length > 0 ? totalRating / sellerGigs.length / 100 : 0; // Convert from int to decimal

    // Calculate total-completed-orders
    const totalCompletedOrders = sellerGigs.reduce((sum, g) => sum + (g.completedOrders || 0), 0);

    // Get total orders (completed + in-progress + pending)
    const gigIds = sellerGigs.map((g) => g.id);
    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(sql`${orders.gigId} IN (${sql.join(gigIds, sql`, `)})`);

    const totalOrders = totalOrdersResult[0]?.count || 0;

    // Calculate completion-rate
    const completionRate = totalOrders > 0 ? (totalCompletedOrders / totalOrders) * 100 : 0;

    // TODO: Calculate avg-response-time from messages-table
    const avgResponseTime = 2.5; // Mock: 2.5 hours

    return {
      avgResponseTime,
      completionRate: Math.round(completionRate * 100) / 100,
      avgRating: Math.round(avgRating * 100) / 100,
      totalCompletedOrders,
    };
  }),

  /**
   * Get Top-Performing-Gigs for Seller
   * Sorted by Revenue DESC, Limit 5
   */
  getTopGigs: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Get seller's gigs with order-stats
      const sellerGigs = await db
        .select({
          id: gigs.id,
          title: gigs.title,
          price: gigs.price,
          imageUrl: gigs.imageUrl,
          completedOrders: gigs.completedOrders,
          averageRating: gigs.averageRating,
        })
        .from(gigs)
        .where(eq(gigs.sellerId, ctx.user.id))
        .orderBy(desc(gigs.completedOrders))
        .limit(input.limit);

      // Calculate revenue for each gig
      const gigsWithRevenue = await Promise.all(
        sellerGigs.map(async (gig) => {
          const revenueResult = await db
            .select({ revenue: sql<number>`sum(${orders.totalPrice})` })
            .from(orders)
            .where(eq(orders.gigId, gig.id));

          return {
            ...gig,
            revenue: revenueResult[0]?.revenue || 0,
          };
        })
      );

      // Sort by revenue DESC
      return gigsWithRevenue.sort((a, b) => b.revenue - a.revenue);
    }),

  /**
   * Get Platform Fee Summary (Admin Only)
   * Returns platform fees, seller payouts, and revenue breakdown
   */
  getPlatformSummary: protectedProcedure
    .query(async ({ ctx }) => {
      // Only admins can access platform analytics
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can access platform analytics',
        });
      }

      const summary = await getPlatformFeeSummary();
      return summary;
    }),
});
