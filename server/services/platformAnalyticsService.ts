/**
 * Platform Analytics Service
 * 
 * Provides analytics for:
 * - Platform fees collected
 * - Seller payouts
 * - Revenue breakdown
 * - Payment method statistics
 * 
 * Uses Supabase for database operations
 */

import { supabase } from '../_core/supabase';

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
  // Get all captured transactions in date range
  const { data: completedTransactions, error } = await supabase
    .from('transactions')
    .select('amount, seller_id, order_id')
    .eq('status', 'captured')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    console.error('[PlatformAnalytics] Failed to get transactions:', error);
    // Return empty analytics instead of throwing
    return {
      totalRevenue: 0,
      platformFees: 0,
      sellerPayouts: 0,
      transactionCount: 0,
      averageOrderValue: 0,
      topSellersByRevenue: [],
    };
  }

  const txns = completedTransactions || [];

  // Calculate totals
  const totalRevenue = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const platformFees = Math.round(totalRevenue * 0.15); // 15% platform fee
  const sellerPayouts = totalRevenue - platformFees; // 85% to sellers

  // Group by seller
  const sellerRevenueMap = new Map<number, {
    sellerName: string | null;
    totalRevenue: number;
    orderCount: number;
  }>();

  for (const transaction of txns) {
    const sellerId = transaction.seller_id;
    const existing = sellerRevenueMap.get(sellerId);
    if (existing) {
      existing.totalRevenue += transaction.amount || 0;
      existing.orderCount += 1;
    } else {
      sellerRevenueMap.set(sellerId, {
        sellerName: null, // Will be fetched separately if needed
        totalRevenue: transaction.amount || 0,
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
    transactionCount: txns.length,
    averageOrderValue: txns.length > 0 
      ? Math.round(totalRevenue / txns.length) 
      : 0,
    topSellersByRevenue,
  };
}

/**
 * Get payout statistics
 */
export async function getPayoutStatistics(): Promise<PayoutStatistics> {
  // Get all sellers with orders
  const { data: sellers, error: sellersError } = await supabase
    .from('users')
    .select('id, stripe_account_id, stripe_onboarding_complete')
    .not('id', 'is', null);

  if (sellersError) {
    console.error('[PlatformAnalytics] Failed to get sellers:', sellersError);
    throw new Error('Failed to get sellers');
  }

  // Get unique sellers from orders
  const { data: orderSellers } = await supabase
    .from('orders')
    .select('seller_id');

  const uniqueSellerIds = new Set((orderSellers || []).map(o => o.seller_id));
  const sellersWithOrders = (sellers || []).filter(s => uniqueSellerIds.has(s.id));

  const totalSellers = sellersWithOrders.length;
  const sellersWithStripe = sellersWithOrders.filter(s => s.stripe_account_id && s.stripe_account_id !== '').length;
  const sellersWithoutStripe = totalSellers - sellersWithStripe;

  // Get captured transactions
  const { data: completedTxns, error: txnError } = await supabase
    .from('transactions')
    .select('amount, seller_id')
    .eq('status', 'captured');

  if (txnError) {
    console.error('[PlatformAnalytics] Failed to get transactions:', txnError);
    // Return empty stats instead of throwing
    return {
      totalPayouts: 0,
      pendingPayouts: 0,
      completedPayouts: 0,
      sellersWithStripe,
      sellersWithoutStripe,
      totalSellers,
    };
  }

  const txns = completedTxns || [];

  // Calculate payouts
  const totalPayouts = txns.reduce((sum, t) => {
    const sellerAmount = Math.round((t.amount || 0) * 0.85);
    return sum + sellerAmount;
  }, 0);

  // Get seller stripe status for payout calculation
  const sellerStripeMap = new Map<number, boolean>();
  for (const seller of sellersWithOrders) {
    sellerStripeMap.set(seller.id, !!(seller.stripe_account_id && seller.stripe_account_id !== ''));
  }

  // Payouts to sellers WITH Stripe Connect (automatic)
  const completedPayouts = txns
    .filter(t => sellerStripeMap.get(t.seller_id) === true)
    .reduce((sum, t) => sum + Math.round((t.amount || 0) * 0.85), 0);

  // Payouts to sellers WITHOUT Stripe Connect (manual/pending)
  const pendingPayouts = txns
    .filter(t => sellerStripeMap.get(t.seller_id) !== true)
    .reduce((sum, t) => sum + Math.round((t.amount || 0) * 0.85), 0);

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
  // Get all captured transactions in date range
  const { data: txns, error } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('status', 'captured')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[PlatformAnalytics] Failed to get transactions:', error);
    throw new Error('Failed to get transactions');
  }

  // Group by date manually
  const dailyMap = new Map<string, { revenue: number; count: number }>();
  
  for (const txn of txns || []) {
    const date = txn.created_at.split('T')[0]; // YYYY-MM-DD
    const existing = dailyMap.get(date);
    if (existing) {
      existing.revenue += txn.amount || 0;
      existing.count += 1;
    } else {
      dailyMap.set(date, { revenue: txn.amount || 0, count: 1 });
    }
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    platformFees: Math.round(data.revenue * 0.15),
    sellerPayouts: Math.round(data.revenue * 0.85),
    transactionCount: data.count,
  }));
}

/**
 * Get platform fee summary (for admin dashboard)
 */
export async function getPlatformFeeSummary() {
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
