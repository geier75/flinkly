/**
 * Supabase Database Adapter
 * Implements DbAdapter interface with Supabase backend
 * Handles snake_case <-> camelCase conversion
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { 
  DbAdapter, 
  DbUser, 
  DbGig, 
  DbGigPackage, 
  DbOrder, 
  DbReview,
  GigFilterOptions 
} from './db-adapter';

// Snake case types from Supabase
interface SupabaseUser {
  id: number;
  open_id: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  login_method: string | null;
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
  is_commercial: boolean | null;
  company_name: string | null;
  company_address: string | null;
  tax_id: string | null;
  trade_register: string | null;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
}

interface SupabaseGig {
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

// Conversion utilities
function toDbUser(su: SupabaseUser): DbUser {
  return {
    id: su.id,
    openId: su.open_id,
    name: su.name,
    email: su.email,
    role: su.role,
    loginMethod: su.login_method,
    bio: su.bio,
    avatarUrl: su.avatar_url,
    country: su.country,
    verified: su.verified ?? false,
    emailVerified: su.email_verified ?? false,
    sellerLevel: su.seller_level,
    completedOrders: su.completed_orders ?? 0,
    averageRating: su.average_rating,
    stripeAccountId: su.stripe_account_id,
    stripeOnboardingComplete: su.stripe_onboarding_complete ?? false,
    stripeChargesEnabled: su.stripe_charges_enabled ?? false,
    stripePayoutsEnabled: su.stripe_payouts_enabled ?? false,
    isCommercial: su.is_commercial ?? false,
    companyName: su.company_name,
    companyAddress: su.company_address,
    taxId: su.tax_id,
    tradeRegister: su.trade_register,
    createdAt: new Date(su.created_at),
    updatedAt: new Date(su.updated_at),
    lastSignedIn: new Date(su.last_signed_in),
  };
}

function toDbGig(sg: SupabaseGig): DbGig {
  return {
    id: sg.id,
    sellerId: sg.seller_id,
    title: sg.title,
    description: sg.description,
    category: sg.category,
    tags: sg.tags,
    price: sg.price,
    deliveryDays: sg.delivery_days,
    imageUrl: sg.image_url,
    status: sg.status,
    active: sg.active ?? true,
    completedOrders: sg.completed_orders ?? 0,
    averageRating: sg.average_rating,
    popularityScore: sg.popularity_score,
    createdAt: new Date(sg.created_at),
    updatedAt: new Date(sg.updated_at),
  };
}

export class SupabaseAdapter implements DbAdapter {
  private client: SupabaseClient;
  
  constructor(url?: string, key?: string) {
    const supabaseUrl = url || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = key || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('[SupabaseAdapter] Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    
    this.client = createClient(supabaseUrl, supabaseKey);
    console.log('[SupabaseAdapter] Initialized');
  }
  
  async isConnected(): Promise<boolean> {
    try {
      const { error } = await this.client.from('users').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
  
  // ============ USER OPERATIONS ============
  
  async getUserByOpenId(openId: string): Promise<DbUser | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('open_id', openId)
      .single();
    
    if (error || !data) return null;
    return toDbUser(data as SupabaseUser);
  }
  
  async getUserById(id: number): Promise<DbUser | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return toDbUser(data as SupabaseUser);
  }
  
  async upsertUser(user: Partial<DbUser> & { openId: string }): Promise<void> {
    // Build update object with only defined values to avoid overwriting existing data
    const updateData: Record<string, any> = {
      open_id: user.openId,
      last_signed_in: user.lastSignedIn?.toISOString() ?? new Date().toISOString(),
    };
    
    // Only include fields that are explicitly provided (not undefined)
    if (user.name !== undefined) updateData.name = user.name;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.loginMethod !== undefined) updateData.login_method = user.loginMethod;
    
    const { error } = await this.client
      .from('users')
      .upsert(updateData, { onConflict: 'open_id' });
    
    if (error) {
      console.error('[SupabaseAdapter] upsertUser error:', error);
      throw error;
    }
  }
  
  // ============ GIG OPERATIONS ============
  
  async getGigById(id: number): Promise<DbGig | null> {
    const { data, error } = await this.client
      .from('gigs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return toDbGig(data as SupabaseGig);
  }
  
  async getGigsPaginated(options: GigFilterOptions): Promise<DbGig[]> {
    let query = this.client
      .from('gigs')
      .select('*')
      .eq('status', options.status || 'published')
      .eq('active', true);
    
    if (options.category) query = query.eq('category', options.category);
    if (options.minPrice) query = query.gte('price', options.minPrice);
    if (options.maxPrice) query = query.lte('price', options.maxPrice);
    if (options.sellerId) query = query.eq('seller_id', options.sellerId);
    if (options.cursor) query = query.gt('id', options.cursor);
    
    // Sorting - map frontend values to database columns
    switch (options.sortBy) {
      case 'price_asc':
      case 'price':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false, nullsFirst: false });
        break;
      case 'newest':
      case 'delivery':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
      case 'relevance':
      default:
        query = query.order('popularity_score', { ascending: false, nullsFirst: false });
    }
    
    query = query.limit(options.limit || 20);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[SupabaseAdapter] getGigsPaginated error:', error);
      return [];
    }
    
    return (data || []).map(g => toDbGig(g as SupabaseGig));
  }
  
  async getSellerGigs(sellerId: number, limit = 50, offset = 0): Promise<DbGig[]> {
    const { data, error } = await this.client
      .from('gigs')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('[SupabaseAdapter] getSellerGigs error:', error);
      return [];
    }
    
    return (data || []).map(g => toDbGig(g as SupabaseGig));
  }
  
  async getSellerDrafts(sellerId: number): Promise<DbGig[]> {
    const { data, error } = await this.client
      .from('gigs')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SupabaseAdapter] getSellerDrafts error:', error);
      return [];
    }
    
    return (data || []).map(g => toDbGig(g as SupabaseGig));
  }
  
  async createGig(gig: Omit<DbGig, 'id' | 'createdAt' | 'updatedAt' | 'completedOrders' | 'averageRating' | 'popularityScore'>): Promise<{ id: number }> {
    const { data, error } = await this.client
      .from('gigs')
      .insert({
        seller_id: gig.sellerId,
        title: gig.title,
        description: gig.description,
        category: gig.category,
        tags: gig.tags,
        price: gig.price,
        delivery_days: gig.deliveryDays,
        image_url: gig.imageUrl,
        status: gig.status,
        active: gig.active,
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error('[SupabaseAdapter] createGig error:', error);
      throw error || new Error('Failed to create gig');
    }
    
    return { id: data.id };
  }
  
  async updateGig(id: number, updates: Partial<DbGig>): Promise<void> {
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.deliveryDays !== undefined) updateData.delivery_days = updates.deliveryDays;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.active !== undefined) updateData.active = updates.active;
    
    const { error } = await this.client
      .from('gigs')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('[SupabaseAdapter] updateGig error:', error);
      throw error;
    }
  }
  
  async deleteGig(id: number): Promise<void> {
    const { error } = await this.client
      .from('gigs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('[SupabaseAdapter] deleteGig error:', error);
      throw error;
    }
  }
  
  async publishGig(id: number): Promise<void> {
    await this.updateGig(id, { status: 'published', active: true });
  }
  
  // ============ GIG PACKAGE OPERATIONS ============
  
  async getGigPackages(gigId: number): Promise<DbGigPackage[]> {
    const { data, error } = await this.client
      .from('gig_packages')
      .select('*')
      .eq('gig_id', gigId)
      .eq('active', true)
      .order('price', { ascending: true });
    
    if (error) {
      console.error('[SupabaseAdapter] getGigPackages error:', error);
      return [];
    }
    
    return (data || []).map(p => ({
      id: p.id,
      gigId: p.gig_id,
      packageType: p.package_type,
      name: p.name,
      description: p.description,
      price: p.price,
      deliveryDays: p.delivery_days,
      revisions: p.revisions,
      features: p.features,
      active: p.active,
      createdAt: new Date(p.created_at),
      updatedAt: new Date(p.updated_at),
    }));
  }
  
  async createGigPackage(pkg: Omit<DbGigPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }> {
    const { data, error } = await this.client
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
        active: pkg.active,
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error('[SupabaseAdapter] createGigPackage error:', error);
      throw error || new Error('Failed to create gig package');
    }
    
    return { id: data.id };
  }
  
  async updateGigPackage(id: number, updates: Partial<DbGigPackage>): Promise<void> {
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.deliveryDays !== undefined) updateData.delivery_days = updates.deliveryDays;
    if (updates.revisions !== undefined) updateData.revisions = updates.revisions;
    if (updates.features !== undefined) updateData.features = updates.features;
    
    const { error } = await this.client
      .from('gig_packages')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('[SupabaseAdapter] updateGigPackage error:', error);
      throw error;
    }
  }
  
  async deleteGigPackage(id: number): Promise<void> {
    const { error } = await this.client
      .from('gig_packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('[SupabaseAdapter] deleteGigPackage error:', error);
      throw error;
    }
  }
  
  // ============ GIG EXTRA OPERATIONS ============
  
  async getGigExtras(gigId: number): Promise<any[]> {
    const { data, error } = await this.client
      .from('gig_extras')
      .select('*')
      .eq('gig_id', gigId)
      .eq('active', true);
    
    if (error) return [];
    return data || [];
  }
  
  async createGigExtra(extra: any): Promise<{ id: number }> {
    const { data, error } = await this.client
      .from('gig_extras')
      .insert({
        gig_id: extra.gigId,
        extra_type: extra.extraType,
        title: extra.name || extra.title,
        description: extra.description || '',
        price: extra.price,
        delivery_days: extra.deliveryDays || extra.deliveryDaysReduction || 0,
        active: true,
      })
      .select('id')
      .single();
    
    if (error || !data) throw error || new Error('Failed to create gig extra');
    return { id: data.id };
  }
  
  async updateGigExtra(id: number, updates: any): Promise<void> {
    const { error } = await this.client
      .from('gig_extras')
      .update({
        title: updates.name || updates.title,
        description: updates.description,
        price: updates.price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  }
  
  async deleteGigExtra(id: number): Promise<void> {
    const { error } = await this.client
      .from('gig_extras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
  
  // ============ ORDER OPERATIONS ============
  
  async getOrderById(id: number): Promise<DbOrder | null> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      gigId: data.gig_id,
      buyerId: data.buyer_id,
      sellerId: data.seller_id,
      totalPrice: data.total_price,
      platformFee: data.platform_fee,
      sellerEarnings: data.seller_earnings,
      status: data.status,
      selectedPackage: data.selected_package,
      buyerMessage: data.buyer_message,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
  
  async getBuyerOrders(buyerId: number, limit = 50, offset = 0): Promise<DbOrder[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) return [];
    
    return (data || []).map(o => ({
      id: o.id,
      gigId: o.gig_id,
      buyerId: o.buyer_id,
      sellerId: o.seller_id,
      totalPrice: o.total_price,
      platformFee: o.platform_fee,
      sellerEarnings: o.seller_earnings,
      status: o.status,
      selectedPackage: o.selected_package,
      buyerMessage: o.buyer_message,
      createdAt: new Date(o.created_at),
      updatedAt: new Date(o.updated_at),
    }));
  }
  
  async getSellerOrders(sellerId: number, limit = 50, offset = 0): Promise<DbOrder[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) return [];
    
    return (data || []).map(o => ({
      id: o.id,
      gigId: o.gig_id,
      buyerId: o.buyer_id,
      sellerId: o.seller_id,
      totalPrice: o.total_price,
      platformFee: o.platform_fee,
      sellerEarnings: o.seller_earnings,
      status: o.status,
      selectedPackage: o.selected_package,
      buyerMessage: o.buyer_message,
      createdAt: new Date(o.created_at),
      updatedAt: new Date(o.updated_at),
    }));
  }
  
  async createOrder(order: Omit<DbOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }> {
    const { data, error } = await this.client
      .from('orders')
      .insert({
        gig_id: order.gigId,
        buyer_id: order.buyerId,
        seller_id: order.sellerId,
        total_price: order.totalPrice,
        platform_fee: order.platformFee,
        seller_earnings: order.sellerEarnings,
        status: order.status,
        selected_package: order.selectedPackage,
        buyer_message: order.buyerMessage,
      })
      .select('id')
      .single();
    
    if (error || !data) throw error || new Error('Failed to create order');
    return { id: data.id };
  }
  
  async updateOrderStatus(id: number, status: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }
  
  // ============ REVIEW OPERATIONS ============
  
  async getGigReviews(gigId: number, limit = 50, offset = 0): Promise<DbReview[]> {
    const { data, error } = await this.client
      .from('reviews')
      .select('*')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) return [];
    
    return (data || []).map(r => ({
      id: r.id,
      orderId: r.order_id,
      gigId: r.gig_id,
      reviewerId: r.reviewer_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: new Date(r.created_at),
    }));
  }
  
  async createReview(review: Omit<DbReview, 'id' | 'createdAt'>): Promise<{ id: number }> {
    const { data, error } = await this.client
      .from('reviews')
      .insert({
        order_id: review.orderId,
        gig_id: review.gigId,
        reviewer_id: review.reviewerId,
        rating: review.rating,
        comment: review.comment,
      })
      .select('id')
      .single();
    
    if (error || !data) throw error || new Error('Failed to create review');
    return { id: data.id };
  }
  
  // ============ CONVERSATION OPERATIONS ============
  
  async createConversation(conv: { gigId?: number; orderId?: number; buyerId: number; sellerId: number }): Promise<{ id: number }> {
    // Build query for existing check
    let existingQuery = this.client
      .from('conversations')
      .select('id')
      .eq('buyer_id', conv.buyerId)
      .eq('seller_id', conv.sellerId);
    
    if (conv.gigId) existingQuery = existingQuery.eq('gig_id', conv.gigId);
    if (conv.orderId) existingQuery = existingQuery.eq('order_id', conv.orderId);
    
    const { data: existing } = await existingQuery.single();
    
    if (existing) return { id: existing.id };
    
    const { data, error } = await this.client
      .from('conversations')
      .insert({
        gig_id: conv.gigId || null,
        order_id: conv.orderId || null,
        buyer_id: conv.buyerId,
        seller_id: conv.sellerId,
      })
      .select('id')
      .single();
    
    if (error || !data) throw error || new Error('Failed to create conversation');
    return { id: data.id };
  }
  
  // ============ EARNINGS & PAYOUTS ============
  
  async getSellerEarnings(sellerId: number): Promise<{ totalEarnings: number; pendingEarnings: number; availableBalance: number }> {
    const { data, error } = await this.client
      .from('orders')
      .select('seller_earnings, status')
      .eq('seller_id', sellerId)
      .in('status', ['completed', 'delivered', 'in_progress']);
    
    if (error) return { totalEarnings: 0, pendingEarnings: 0, availableBalance: 0 };
    
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let availableBalance = 0;
    
    for (const order of data || []) {
      const earnings = order.seller_earnings || 0;
      totalEarnings += earnings;
      if (order.status === 'completed') {
        availableBalance += earnings;
      } else {
        pendingEarnings += earnings;
      }
    }
    
    return { totalEarnings, pendingEarnings, availableBalance };
  }
  
  async getSellerPayouts(sellerId: number, limit = 50): Promise<any[]> {
    const { data, error } = await this.client
      .from('payouts')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) return [];
    return data || [];
  }
  
  async createPayout(payout: { sellerId: number; amount: number; stripePayoutId?: string }): Promise<{ id: number }> {
    const { data, error } = await this.client
      .from('payouts')
      .insert({
        seller_id: payout.sellerId,
        amount: payout.amount,
        stripe_payout_id: payout.stripePayoutId || null,
        status: 'pending',
      })
      .select('id')
      .single();
    
    if (error || !data) throw error || new Error('Failed to create payout');
    return { id: data.id };
  }
}

// Singleton instance
let adapter: SupabaseAdapter | null = null;

export function getSupabaseAdapter(): SupabaseAdapter {
  if (!adapter) {
    adapter = new SupabaseAdapter();
  }
  return adapter;
}
