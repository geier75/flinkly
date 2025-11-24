/**
 * Platform Analytics Service
 * 
 * Provides analytics for:
 * - Platform fees collected
 * - Seller payouts
 * - Revenue breakdown
 * - Payment method statistics
 */

import { getDb } from '../db';
import { transactions, orders, users } from '../../drizzle/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export interface PlatformFeeAnalytics {
  totalRevenue: number; // Total amount processed (in cents)
  platformFees: number; // Total platform fees (15% of revenue, in cents)
  sellerPayouts: number; // Total paid to sellers (85% of revenue, in cents)
  transactionCount: number;
  averageOrderValue: number; // in cents
  topSellersByRevenue: Array<{
    sellerId: number;
    sellerName: string | null;
    totalRevenue: number;
    platformFees: number;
    orderCount: number;
  }>;
}

export interface PayoutStatistics {
  totalPayouts: number; // in cents
  pendingPayouts: number; // in cents
  completedPayouts: number; // in cents
  sellersWithStripe: number;
  sellersWithoutStripe: number;
  totalSellers: number;
}

export interface RevenueTimeSeries {
  date: string; // YYYY-MM-DD
  revenue: number; // in cents
  platformFees: number; // in cents
  sellerPayouts: number; // in cents
  transactionCount: number;
}

/**
 * Get platform fee analytics for a date range
 */
export async function getPlatformFeeAnalytics(
  startDate: Date,
  endDate: Date
): Promise<PlatformFeeAnalytics> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Get all captured transactions in date range (captured = payment completed)
  const completedTransactions = await db
    .select({
      amount: transactions.amount,
      sellerId: transactions.sellerId,
      sellerName: users.name,
      orderId: transactions.orderId,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.sellerId, users.id))
    .where(
      and(
        eq(transactions.status, 'captured'),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    );

  // Calculate totals
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const platformFees = Math.round(totalRevenue * 0.15); // 15% platform fee
  const sellerPayouts = totalRevenue - platformFees; // 85% to sellers

  // Group by seller
  const sellerRevenueMap = new Map<number, {
    sellerName: string | null;
    totalRevenue: number;
    orderCount: number;
  }>();

  for (const transaction of completedTransactions) {
    const existing = sellerRevenueMap.get(transaction.sellerId);
    if (existing) {
      existing.totalRevenue += transaction.amount;
      existing.orderCount += 1;
    } else {
      sellerRevenueMap.set(transaction.sellerId, {
        sellerName: transaction.sellerName,
        totalRevenue: transaction.amount,
        orderCount: 1,
      });
    }
  }

  // Convert to array and sort by revenue
  const topSellersByRevenue = Array.from(sellerRevenueMap.entries())
    .map(([sellerId, data]) => ({
      sellerId,
      sellerName: data.sellerName,
      totalRevenue: data.totalRevenue,
      platformFees: Math.round(data.totalRevenue * 0.15),
      orderCount: data.orderCount,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10); // Top 10 sellers

  return {
    totalRevenue,
    platformFees,
    sellerPayouts,
    transactionCount: completedTransactions.length,
    averageOrderValue: completedTransactions.length > 0 
      ? Math.round(totalRevenue / completedTransactions.length) 
      : 0,
    topSellersByRevenue,
  };
}

/**
 * Get payout statistics
 */
export async function getPayoutStatistics(): Promise<PayoutStatistics> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Get all sellers with published gigs
  const allSellers = await db
    .selectDistinct({
      id: users.id,
      stripeAccountId: users.stripeAccountId,
      stripeOnboardingComplete: users.stripeOnboardingComplete,
    })
    .from(users)
    .innerJoin(orders, eq(orders.sellerId, users.id));

  const totalSellers = allSellers.length;
  const sellersWithStripe = allSellers.filter(s => s.stripeAccountId && s.stripeAccountId !== '').length;
  const sellersWithoutStripe = totalSellers - sellersWithStripe;

  // Get captured transactions (captured = payment completed)
  const completedTxns = await db
    .select({
      amount: transactions.amount,
      sellerId: transactions.sellerId,
      sellerStripeAccountId: users.stripeAccountId,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.sellerId, users.id))
    .where(eq(transactions.status, 'captured'));

  // Calculate payouts
  const totalPayouts = completedTxns.reduce((sum, t) => {
    const sellerAmount = Math.round(t.amount * 0.85); // 85% to seller
    return sum + sellerAmount;
  }, 0);

  // Payouts to sellers WITH Stripe Connect (automatic)
  const completedPayouts = completedTxns
    .filter(t => t.sellerStripeAccountId && t.sellerStripeAccountId !== '')
    .reduce((sum, t) => sum + Math.round(t.amount * 0.85), 0);

  // Payouts to sellers WITHOUT Stripe Connect (manual/pending)
  const pendingPayouts = completedTxns
    .filter(t => !t.sellerStripeAccountId || t.sellerStripeAccountId === '')
    .reduce((sum, t) => sum + Math.round(t.amount * 0.85), 0);

  return {
    totalPayouts,
    pendingPayouts,
    completedPayouts,
    sellersWithStripe,
    sellersWithoutStripe,
    totalSellers,
  };
}

/**
 * Get revenue time series (daily breakdown)
 */
export async function getRevenueTimeSeries(
  startDate: Date,
  endDate: Date
): Promise<RevenueTimeSeries[]> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Get all captured transactions grouped by date (captured = payment completed)
  const dailyRevenue = await db
    .select({
      date: sql<string>`DATE(${transactions.createdAt})`,
      revenue: sql<number>`SUM(${transactions.amount})`,
      transactionCount: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.status, 'captured'),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    )
    .groupBy(sql`DATE(${transactions.createdAt})`)
    .orderBy(sql`DATE(${transactions.createdAt})`);

  return dailyRevenue.map(day => ({
    date: day.date,
    revenue: day.revenue,
    platformFees: Math.round(day.revenue * 0.15),
    sellerPayouts: Math.round(day.revenue * 0.85),
    transactionCount: day.transactionCount,
  }));
}

/**
 * Get platform fee summary (for admin dashboard)
 */
export async function getPlatformFeeSummary() {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // All time
  const allTimeStats = await getPlatformFeeAnalytics(
    new Date('2024-01-01'),
    new Date()
  );

  // Last 30 days
  const last30DaysStats = await getPlatformFeeAnalytics(
    thirtyDaysAgo,
    new Date()
  );

  // Last 7 days
  const last7DaysStats = await getPlatformFeeAnalytics(
    sevenDaysAgo,
    new Date()
  );

  // Payout statistics
  const payoutStats = await getPayoutStatistics();

  return {
    allTime: allTimeStats,
    last30Days: last30DaysStats,
    last7Days: last7DaysStats,
    payouts: payoutStats,
  };
}
