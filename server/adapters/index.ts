/**
 * Unified Database Export
 * Provides the same API as db.ts but uses Supabase adapter
 * This allows gradual migration without breaking existing code
 */

import { getSupabaseAdapter } from './supabase-adapter';
import type { DbAdapter, DbGig, DbUser, DbGigPackage, DbOrder, DbReview, GigFilterOptions } from './db-adapter';
import { supabase } from '../_core/supabase';

// Get the adapter instance
const adapter = getSupabaseAdapter();

// Re-export types
export type { DbUser, DbGig, DbGigPackage, DbOrder, DbReview, GigFilterOptions };

// ============ USER OPERATIONS ============

export async function getUserByOpenId(openId: string) {
  return adapter.getUserByOpenId(openId);
}

export async function getUserById(id: number) {
  return adapter.getUserById(id);
}

export async function getUserByEmail(email: string) {
  // Query Supabase for user by email
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    openId: data.open_id,
    name: data.name,
    email: data.email,
    role: data.role,
    loginMethod: data.login_method,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    verified: data.verified ?? false,
    emailVerified: data.email_verified ?? false,
    sellerLevel: data.seller_level,
    completedOrders: data.completed_orders ?? 0,
    averageRating: data.average_rating,
    stripeAccountId: data.stripe_account_id,
    stripeOnboardingComplete: data.stripe_onboarding_complete ?? false,
    stripeChargesEnabled: data.stripe_charges_enabled ?? false,
    stripePayoutsEnabled: data.stripe_payouts_enabled ?? false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    lastSignedIn: new Date(data.last_signed_in),
  };
}

export async function upsertUser(user: Parameters<DbAdapter['upsertUser']>[0]) {
  return adapter.upsertUser(user);
}

// ============ GIG OPERATIONS ============

export async function getGigById(id: number) {
  return adapter.getGigById(id);
}

export async function getGigsPaginated(options: GigFilterOptions) {
  return adapter.getGigsPaginated(options);
}

export async function getSellerGigs(sellerId: number, limit?: number, offset?: number) {
  return adapter.getSellerGigs(sellerId, limit, offset);
}

export async function getSellerDrafts(sellerId: number) {
  return adapter.getSellerDrafts(sellerId);
}

export async function createGig(gig: Parameters<DbAdapter['createGig']>[0]) {
  return adapter.createGig(gig);
}

export async function updateGig(id: number, updates: Partial<DbGig>) {
  return adapter.updateGig(id, updates);
}

export async function deleteGig(id: number) {
  return adapter.deleteGig(id);
}

export async function publishGig(id: number) {
  return adapter.publishGig(id);
}

// ============ GIG PACKAGE OPERATIONS ============

export async function getGigPackages(gigId: number) {
  return adapter.getGigPackages(gigId);
}

export async function createGigPackage(pkg: Parameters<DbAdapter['createGigPackage']>[0]) {
  return adapter.createGigPackage(pkg);
}

export async function updateGigPackage(id: number, updates: Partial<DbGigPackage>) {
  return adapter.updateGigPackage(id, updates);
}

export async function deleteGigPackage(id: number) {
  return adapter.deleteGigPackage(id);
}

// ============ GIG EXTRA OPERATIONS ============

export async function getGigExtras(gigId: number) {
  return adapter.getGigExtras(gigId);
}

export async function createGigExtra(extra: any) {
  return adapter.createGigExtra(extra);
}

export async function updateGigExtra(id: number, updates: any) {
  return adapter.updateGigExtra(id, updates);
}

export async function deleteGigExtra(id: number) {
  return adapter.deleteGigExtra(id);
}

// ============ ORDER OPERATIONS ============

export async function getOrderById(id: number) {
  return adapter.getOrderById(id);
}

export async function getBuyerOrders(buyerId: number, limit?: number, offset?: number) {
  return adapter.getBuyerOrders(buyerId, limit, offset);
}

export async function getSellerOrders(sellerId: number, limit?: number, offset?: number) {
  return adapter.getSellerOrders(sellerId, limit, offset);
}

export async function createOrder(order: Parameters<DbAdapter['createOrder']>[0]) {
  return adapter.createOrder(order);
}

export async function updateOrderStatus(id: number, status: string) {
  return adapter.updateOrderStatus(id, status);
}

// ============ REVIEW OPERATIONS ============

export async function getGigReviews(gigId: number, limit?: number, offset?: number) {
  return adapter.getGigReviews(gigId, limit, offset);
}

export async function createReview(review: Parameters<DbAdapter['createReview']>[0]) {
  return adapter.createReview(review);
}

// ============ CONVERSATION OPERATIONS ============

export async function createConversation(conv: { gigId?: number; orderId?: number; buyerId: number; sellerId: number }) {
  return adapter.createConversation(conv);
}

// ============ EARNINGS & PAYOUTS ============

export async function getSellerEarnings(sellerId: number) {
  return adapter.getSellerEarnings(sellerId);
}

export async function getSellerPayouts(sellerId: number, limit?: number) {
  return adapter.getSellerPayouts(sellerId, limit);
}

export async function createPayout(payout: Parameters<DbAdapter['createPayout']>[0]) {
  return adapter.createPayout(payout);
}

// ============ PAYMENT METHODS ============

export async function savePaymentMethod(data: {
  userId: number;
  stripePaymentMethodId: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault?: boolean;
}) {
  const { data: result, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: data.userId,
      stripe_payment_method_id: data.stripePaymentMethodId,
      type: 'card',
      last4: data.last4,
      brand: data.brand,
      expiry_month: data.expiryMonth,
      expiry_year: data.expiryYear,
      is_default: data.isDefault ?? false,
    })
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getPaymentMethodsByUserId(userId: number) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Map to camelCase for frontend
  return (data || []).map(pm => ({
    id: pm.id,
    userId: pm.user_id,
    stripePaymentMethodId: pm.stripe_payment_method_id,
    type: pm.type,
    last4: pm.last4,
    brand: pm.brand,
    expiryMonth: pm.expiry_month,
    expiryYear: pm.expiry_year,
    isDefault: pm.is_default,
    createdAt: pm.created_at,
  }));
}

export async function deletePaymentMethod(id: number) {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function setDefaultPaymentMethod(userId: number, id: number) {
  // First, unset all defaults for this user
  await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);
  
  // Then set the new default
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) throw error;
  return true;
}

export async function getDefaultPaymentMethod(userId: number) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// ============ DSGVO DATA EXPORT FUNCTIONS ============

export async function getGigsBySellerId(sellerId: number) {
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('seller_id', sellerId);
  
  if (error) throw error;
  return data || [];
}

export async function getMessagesByUserId(userId: number) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('[getMessagesByUserId] Error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('[getMessagesByUserId] Exception:', e);
    return [];
  }
}

export async function getReviewsByReviewerId(reviewerId: number) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewer_id', reviewerId);
    
    if (error) {
      console.warn('[getReviewsByReviewerId] Error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('[getReviewsByReviewerId] Exception:', e);
    return [];
  }
}

export async function getReviewsByGigSellerId(sellerId: number) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, gigs!inner(*)')
      .eq('gigs.seller_id', sellerId);
    
    if (error) {
      console.warn('[getReviewsByGigSellerId] Error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('[getReviewsByGigSellerId] Exception:', e);
    return [];
  }
}

export async function getTransactionsByUserId(userId: number) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('[getTransactionsByUserId] Error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('[getTransactionsByUserId] Exception:', e);
    return [];
  }
}

export async function getActiveOrdersByUserId(userId: number) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .in('status', ['pending', 'in_progress', 'delivered'])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// ============ USER UPDATE ============

export async function updateUser(userId: number, updates: Partial<{
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  country: string;
  isCommercial: boolean;
  companyName: string;
  companyAddress: string;
  taxId: string;
  tradeRegister: string;
  stripeAccountId: string;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
}>) {
  // Build update object with only defined values
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
  if (updates.country !== undefined) updateData.country = updates.country;
  if (updates.isCommercial !== undefined) updateData.is_commercial = updates.isCommercial;
  if (updates.companyName !== undefined) updateData.company_name = updates.companyName;
  if (updates.companyAddress !== undefined) updateData.company_address = updates.companyAddress;
  if (updates.taxId !== undefined) updateData.tax_id = updates.taxId;
  if (updates.tradeRegister !== undefined) updateData.trade_register = updates.tradeRegister;
  if (updates.stripeAccountId !== undefined) updateData.stripe_account_id = updates.stripeAccountId;
  if (updates.stripeOnboardingComplete !== undefined) updateData.stripe_onboarding_complete = updates.stripeOnboardingComplete;
  if (updates.stripeChargesEnabled !== undefined) updateData.stripe_charges_enabled = updates.stripeChargesEnabled;
  if (updates.stripePayoutsEnabled !== undefined) updateData.stripe_payouts_enabled = updates.stripePayoutsEnabled;

  console.log(`[DB] Updating user ${userId} with:`, updateData);

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();
  
  if (error) {
    console.error(`[DB] Error updating user ${userId}:`, error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.error(`[DB] User ${userId} not found for update`);
    throw new Error(`User with ID ${userId} not found`);
  }
  
  console.log(`[DB] User ${userId} updated successfully:`, data[0]?.name);
  return data[0];
}

// ============ CONSENT LOGGING ============

export async function createConsentLog(data: {
  userId: number;
  consentType: string;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
}) {
  const { data: result, error } = await supabase
    .from('consent_logs')
    .insert({
      user_id: data.userId,
      consent_type: data.consentType,
      granted: data.granted,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    })
    .select()
    .single();
  
  if (error) {
    // Table might not exist yet, log and continue
    console.warn('[Consent] Could not log consent:', error.message);
    return null;
  }
  return result;
}

// ============ ACCOUNT DELETION ============

export async function getAccountDeletionRequest(userId: number) {
  const { data, error } = await supabase
    .from('account_deletion_requests')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.warn('[Deletion] Could not get deletion request:', error.message);
    return null;
  }
  return data || null;
}

// ============ CONVERSATIONS ============

export async function getConversationsByUserId(userId: number) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      buyer:users!buyer_id(*),
      seller:users!seller_id(*),
      messages(*)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// ============ FAVORITES ============

export async function isFavorite(userId: number, gigId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('gig_id', gigId)
    .maybeSingle();
  
  if (error) {
    console.error('[Supabase] Failed to check favorite:', error);
    return false;
  }
  
  return !!data;
}

export async function addFavorite(userId: number, gigId: number): Promise<void> {
  // First check if already exists
  const existing = await isFavorite(userId, gigId);
  if (existing) return; // Already favorited
  
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, gig_id: gigId });
  
  if (error) {
    console.error('[Supabase] Failed to add favorite:', error);
    throw error;
  }
}

export async function removeFavorite(userId: number, gigId: number): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('gig_id', gigId);
  
  if (error) {
    console.error('[Supabase] Failed to remove favorite:', error);
    throw error;
  }
}

export async function getFavoritesByUserId(userId: number): Promise<{ gigId: number; createdAt: Date; gig: any }[]> {
  // First get the favorites
  const { data: favoritesData, error: favError } = await supabase
    .from('favorites')
    .select('gig_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (favError) {
    console.error('[Supabase] Failed to get favorites:', favError);
    return [];
  }
  
  if (!favoritesData || favoritesData.length === 0) {
    return [];
  }
  
  // Get the gig IDs
  const gigIds = favoritesData.map(f => f.gig_id);
  
  // Fetch the gigs with seller info
  const { data: gigsData, error: gigsError } = await supabase
    .from('gigs')
    .select(`
      id,
      title,
      description,
      price,
      delivery_days,
      category,
      image_url,
      seller_id
    `)
    .in('id', gigIds);
  
  if (gigsError) {
    console.error('[Supabase] Failed to get gigs for favorites:', gigsError);
    return [];
  }
  
  // Get seller info for all gigs
  const sellerIds = Array.from(new Set((gigsData || []).map(g => g.seller_id)));
  const { data: sellersData } = await supabase
    .from('users')
    .select('id, name, avatar_url')
    .in('id', sellerIds);
  
  const sellersMap = new Map((sellersData || []).map(s => [s.id, s]));
  const gigsMap = new Map((gigsData || []).map(g => [g.id, g]));
  
  // Combine the data
  return favoritesData.map(f => {
    const gig = gigsMap.get(f.gig_id);
    const seller = gig ? sellersMap.get(gig.seller_id) : null;
    
    return {
      gigId: f.gig_id,
      createdAt: new Date(f.created_at),
      gig: gig ? {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        price: gig.price,
        deliveryDays: gig.delivery_days,
        category: gig.category,
        imageUrl: gig.image_url,
        sellerId: gig.seller_id,
        rating: 5.0, // Default rating
        reviewCount: 0, // Default review count
        seller: seller ? {
          id: seller.id,
          name: seller.name,
          avatarUrl: seller.avatar_url,
        } : null,
      } : null,
    };
  });
}

// ============ HEALTH CHECK ============

export async function isConnected() {
  return adapter.isConnected();
}

// Export adapter for direct access if needed
export { adapter };

// Compatibility: getDb returns the Supabase client for legacy code
export async function getDb() {
  return supabase;
}

// Re-export supabase client
export { supabase };

// ============ LEGACY COMPATIBILITY ============
// Re-export all functions from old db.ts that are not yet migrated
// These will use MySQL until fully migrated to Supabase

export * from '../db';

console.log('[Database] Using Supabase adapter with legacy fallback');
