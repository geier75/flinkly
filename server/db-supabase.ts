/**
 * Supabase Database Layer for Flinkly
 * Replaces MySQL/Drizzle with Supabase client
 */

import { supabase } from './_core/supabase';

// Helper to convert snake_case to camelCase
function toCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => toCamelCase(item)) as T;
  if (typeof obj !== 'object') return obj;
  
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = toCamelCase(obj[key]);
  }
  return result as T;
}

// Types (matching the schema)
export interface User {
  id: number;
  open_id: string;
  name: string | null;
  email: string | null;
  login_method: string | null;
  role: 'user' | 'admin';
  user_type: 'buyer' | 'seller' | 'both' | null;
  bio: string | null;
  avatar_url: string | null;
  country: string | null;
  verified: boolean | null;
  email_verified: boolean | null;
  seller_level: 'new' | 'rising' | 'level_one' | 'top_rated' | null;
  completed_orders: number;
  average_rating: number | null;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  stripe_charges_enabled: boolean;
  stripe_payouts_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
}

export interface Gig {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  category: string;
  tags: string | null;
  price: number;
  delivery_days: number;
  image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  active: boolean | null;
  completed_orders: number | null;
  average_rating: number | null;
  popularity_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface GigPackage {
  id: number;
  gig_id: number;
  package_type: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number;
  delivery_days: number;
  revisions: number;
  features: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// User functions
export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
}): Promise<void> {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      open_id: user.openId,
      name: user.name || null,
      email: user.email || null,
      login_method: user.loginMethod || null,
      last_signed_in: user.lastSignedIn?.toISOString() || new Date().toISOString(),
    }, {
      onConflict: 'open_id'
    });

  if (error) {
    console.error('[Supabase] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', openId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Failed to get user:', error);
  }

  return data || undefined;
}

export async function getUserById(id: number): Promise<any | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Failed to get user by ID:', error);
  }

  return data ? toCamelCase(data) : undefined;
}

// Gig functions
export async function getGigsPaginated(options: {
  limit?: number;
  cursor?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sellerId?: number;
}): Promise<Gig[]> {
  let query = supabase
    .from('gigs')
    .select('*')
    .eq('status', 'published')
    .eq('active', true);

  if (options.category) {
    query = query.eq('category', options.category);
  }
  if (options.minPrice) {
    query = query.gte('price', options.minPrice);
  }
  if (options.maxPrice) {
    query = query.lte('price', options.maxPrice);
  }
  if (options.sellerId) {
    query = query.eq('seller_id', options.sellerId);
  }
  if (options.cursor) {
    query = query.gt('id', options.cursor);
  }

  // Sorting
  switch (options.sortBy) {
    case 'price':
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('average_rating', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('popularity_score', { ascending: false });
  }

  query = query.limit(options.limit || 20);

  const { data, error } = await query;

  if (error) {
    console.error('[Supabase] Failed to get gigs:', error);
    return [];
  }

  return toCamelCase(data || []);
}

export async function getGigById(id: number): Promise<any | null> {
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Failed to get gig:', error);
  }

  return data ? toCamelCase(data) : null;
}

export async function getGigWithSeller(id: number): Promise<(Gig & { seller: User }) | undefined> {
  const { data, error } = await supabase
    .from('gigs')
    .select(`
      *,
      seller:users!seller_id(*)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Failed to get gig with seller:', error);
  }

  return data || undefined;
}

// Gig Packages
export async function getGigPackages(gigId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('gig_packages')
    .select('*')
    .eq('gig_id', gigId)
    .eq('active', true)
    .order('price', { ascending: true });

  if (error) {
    console.error('[Supabase] Failed to get gig packages:', error);
    return [];
  }

  return toCamelCase(data || []);
}

// Gig Extras
export async function getGigExtras(gigId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('gig_extras')
    .select('*')
    .eq('gig_id', gigId)
    .eq('active', true);

  if (error) {
    console.error('[Supabase] Failed to get gig extras:', error);
    return [];
  }

  return toCamelCase(data || []);
}

// Create Gig
export async function createGig(gig: {
  sellerId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  imageUrl?: string;
  status?: 'draft' | 'published';
  active?: boolean;
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('gigs')
    .insert({
      seller_id: gig.sellerId,
      title: gig.title,
      description: gig.description,
      category: gig.category,
      price: gig.price,
      delivery_days: gig.deliveryDays,
      image_url: gig.imageUrl || null,
      status: gig.status || 'published',
      active: gig.active !== undefined ? gig.active : true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create gig:', error);
    throw error;
  }

  return { id: data.id };
}

// Orders
export async function createOrder(order: {
  gigId: number;
  buyerId: number;
  sellerId: number;
  totalPrice: number;
  platformFee: number;
  sellerEarnings: number;
  selectedPackage?: 'basic' | 'standard' | 'premium';
  buyerMessage?: string;
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      gig_id: order.gigId,
      buyer_id: order.buyerId,
      seller_id: order.sellerId,
      total_price: order.totalPrice,
      platform_fee: order.platformFee,
      seller_earnings: order.sellerEarnings,
      selected_package: order.selectedPackage || 'basic',
      buyer_message: order.buyerMessage || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create order:', error);
    throw error;
  }

  return { id: data.id };
}

export async function getOrderById(id: number): Promise<any | undefined> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Failed to get order:', error);
  }

  return data || undefined;
}

export async function getOrdersByBuyerId(buyerId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get orders:', error);
    return [];
  }

  return data || [];
}

export async function getOrdersBySellerId(sellerId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get orders:', error);
    return [];
  }

  return data || [];
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('[Supabase] Failed to update order status:', error);
    throw error;
  }
}

// Reviews
export async function getGigReviews(gigId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:users!reviewer_id(id, name, avatar_url)
    `)
    .eq('gig_id', gigId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get reviews:', error);
    return [];
  }

  return data || [];
}

export async function createReview(review: {
  orderId: number;
  gigId: number;
  reviewerId: number;
  rating: number;
  comment?: string;
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      order_id: review.orderId,
      gig_id: review.gigId,
      reviewer_id: review.reviewerId,
      rating: review.rating,
      comment: review.comment || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create review:', error);
    throw error;
  }

  return { id: data.id };
}

// Favorites
export async function getUserFavorites(userId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      gig:gigs(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('[Supabase] Failed to get favorites:', error);
    return [];
  }

  return data || [];
}

export async function toggleFavorite(userId: number, gigId: number): Promise<boolean> {
  // Check if favorite exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('gig_id', gigId)
    .single();

  if (existing) {
    // Remove favorite
    await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id);
    return false;
  } else {
    // Add favorite
    await supabase
      .from('favorites')
      .insert({ user_id: userId, gig_id: gigId });
    return true;
  }
}

// Seller Gigs
export async function getSellerGigs(sellerId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to get seller gigs:', error);
    return [];
  }

  return toCamelCase(data || []);
}

// Missing functions needed by routers.ts

export async function createGigPackage(pkg: {
  gigId: number;
  packageType: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string;
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('gig_packages')
    .insert({
      gig_id: pkg.gigId,
      package_type: pkg.packageType,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      delivery_days: pkg.deliveryDays,
      revisions: pkg.revisions,
      features: pkg.features,
      active: true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create gig package:', error);
    throw error;
  }
  return { id: data.id };
}

export async function updateGigPackage(id: number, updates: Partial<{
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string;
}>): Promise<void> {
  const { error } = await supabase
    .from('gig_packages')
    .update({
      name: updates.name,
      description: updates.description,
      price: updates.price,
      delivery_days: updates.deliveryDays,
      revisions: updates.revisions,
      features: updates.features,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to update gig package:', error);
    throw error;
  }
}

export async function deleteGigPackage(id: number): Promise<void> {
  const { error } = await supabase
    .from('gig_packages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete gig package:', error);
    throw error;
  }
}

export async function createGigExtra(extra: {
  gigId: number;
  name: string;
  description: string;
  price: number;
  deliveryTimeReduction?: number;
  extraType?: 'express_delivery' | 'extra_revisions' | 'commercial_license' | 'source_files' | 'custom';
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('gig_extras')
    .insert({
      gig_id: extra.gigId,
      extra_type: extra.extraType || 'custom',
      name: extra.name,
      description: extra.description,
      price: extra.price,
      delivery_days_reduction: extra.deliveryTimeReduction || 0,
      active: true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create gig extra:', error);
    throw error;
  }
  return { id: data.id };
}

export async function updateGigExtra(id: number, updates: Partial<{
  name: string;
  description: string;
  price: number;
  deliveryTimeReduction: number;
}>): Promise<void> {
  const updateData: any = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.deliveryTimeReduction !== undefined) updateData.delivery_days_reduction = updates.deliveryTimeReduction;

  const { error } = await supabase
    .from('gig_extras')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to update gig extra:', error);
    throw error;
  }
}

export async function deleteGigExtra(id: number): Promise<void> {
  const { error } = await supabase
    .from('gig_extras')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete gig extra:', error);
    throw error;
  }
}

export async function updateGig(id: number, updates: Partial<{
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  imageUrl: string;
  status: string;
  active: boolean;
}>): Promise<void> {
  const { error } = await supabase
    .from('gigs')
    .update({
      title: updates.title,
      description: updates.description,
      category: updates.category,
      price: updates.price,
      delivery_days: updates.deliveryDays,
      image_url: updates.imageUrl,
      status: updates.status,
      active: updates.active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to update gig:', error);
    throw error;
  }
}

export async function deleteGig(id: number): Promise<void> {
  const { error } = await supabase
    .from('gigs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete gig:', error);
    throw error;
  }
}

export async function publishGig(id: number): Promise<void> {
  const { error } = await supabase
    .from('gigs')
    .update({ status: 'published', active: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to publish gig:', error);
    throw error;
  }
}

export async function getSellerDrafts(sellerId: number): Promise<Gig[]> {
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to get seller drafts:', error);
    return [];
  }
  return data || [];
}

export async function getBuyerOrders(buyerId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, gig:gigs(*)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get buyer orders:', error);
    return [];
  }
  return data || [];
}

export async function getSellerOrders(sellerId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, gig:gigs(*), buyer:users!buyer_id(*)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get seller orders:', error);
    return [];
  }
  return data || [];
}

export async function createConversation(conv: {
  gigId: number;
  buyerId: number;
  sellerId: number;
}): Promise<{ id: number }> {
  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('gig_id', conv.gigId)
    .eq('buyer_id', conv.buyerId)
    .eq('seller_id', conv.sellerId)
    .single();

  if (existing) {
    return { id: existing.id };
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      gig_id: conv.gigId,
      buyer_id: conv.buyerId,
      seller_id: conv.sellerId,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create conversation:', error);
    throw error;
  }
  return { id: data.id };
}

export async function getSellerEarnings(sellerId: number): Promise<{ totalEarnings: number; pendingEarnings: number; availableBalance: number }> {
  const { data, error } = await supabase
    .from('orders')
    .select('seller_earnings, status')
    .eq('seller_id', sellerId)
    .in('status', ['completed', 'delivered', 'in_progress']);

  if (error) {
    console.error('[Supabase] Failed to get seller earnings:', error);
    return { totalEarnings: 0, pendingEarnings: 0, availableBalance: 0 };
  }

  let totalEarnings = 0;
  let pendingEarnings = 0;
  let availableBalance = 0;

  for (const order of data || []) {
    totalEarnings += order.seller_earnings || 0;
    if (order.status === 'completed') {
      availableBalance += order.seller_earnings || 0;
    } else {
      pendingEarnings += order.seller_earnings || 0;
    }
  }

  return { totalEarnings, pendingEarnings, availableBalance };
}

export async function getSellerPayouts(sellerId: number, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to get seller payouts:', error);
    return [];
  }
  return data || [];
}

export async function createPayout(payout: {
  sellerId: number;
  amount: number;
  stripePayoutId?: string;
}): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('payouts')
    .insert({
      seller_id: payout.sellerId,
      amount: payout.amount,
      stripe_payout_id: payout.stripePayoutId || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Failed to create payout:', error);
    throw error;
  }
  return { id: data.id };
}

// Stripe Connect functions
export async function updateUserStripeAccount(
  userId: number,
  stripeAccountId: string,
  options: {
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    onboardingComplete?: boolean;
  }
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      stripe_account_id: stripeAccountId,
      stripe_charges_enabled: options.chargesEnabled ?? false,
      stripe_payouts_enabled: options.payoutsEnabled ?? false,
      stripe_onboarding_complete: options.onboardingComplete ?? false,
    })
    .eq('id', userId);

  if (error) {
    console.error('[Supabase] Failed to update Stripe account:', error);
    throw error;
  }
}

// Compatibility function - returns supabase client
export async function getDb() {
  return supabase;
}

// Check if database is connected
export async function isConnected(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Export the supabase client for direct access if needed
export { supabase };

console.log('[Database] Supabase database layer loaded');
