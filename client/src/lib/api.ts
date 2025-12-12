/**
 * API Client für Supabase Edge Functions
 * Ersetzt tRPC-Calls mit direkten fetch-Aufrufen
 */

import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fpiszghehrjmkbxhbwqr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaXN6Z2hlaHJqbWtieGhid3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUwNDcsImV4cCI6MjA4MDI1MTA0N30.K7S7NtVrjOcW6vR_kmxG1KK2cpuYZDcGeuAremLJpSk';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  params?: Record<string, string | number | undefined>;
  requireAuth?: boolean;
}

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, params, requireAuth = false } = options;
  
  let url = `${SUPABASE_URL}/functions/v1/${endpoint}`;
  
  // Add query params
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  // Get auth token for authenticated requests
  let authToken = SUPABASE_ANON_KEY;
  if (requireAuth) {
    const userToken = await getAuthToken();
    if (userToken) {
      authToken = userToken;
    }
  }
  
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }
  
  return response.json();
}

// ============ GIGS API ============

export interface Gig {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  category: string;
  tags: string | null;
  price: number;
  deliveryDays: number;
  imageUrl: string | null;
  status: 'draft' | 'published' | 'archived';
  active: boolean;
  completedOrders: number;
  averageRating: number | null;
  popularityScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GigPackage {
  id: number;
  gigId: number;
  packageType: 'basic' | 'standard' | 'premium';
  name: string;
  description: string | null;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string | null;
  active: boolean;
}

export interface GigReview {
  id: number;
  gigId: number;
  reviewerId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: number;
    name: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface GigExtra {
  id: number;
  gigId: number;
  name: string;
  description: string | null;
  price: number;
  deliveryDays: number;
  active: boolean;
}

export interface GigWithDetails extends Gig {
  packages: GigPackage[];
  seller: {
    id: number;
    name: string | null;
    avatarUrl: string | null;
    verified: boolean;
    sellerLevel: string | null;
    completedOrders: number;
    averageRating: number | null;
    bio?: string | null;
  } | null;
  reviews: GigReview[];
  extras: GigExtra[];
}

export interface GigListParams {
  limit?: number;
  cursor?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price' | 'delivery' | 'rating' | 'popularity';
}

export interface GigListResponse {
  gigs: Gig[];
  nextCursor?: number;
}

export interface GigCreateInput {
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays?: number;
  imageUrl?: string;
  tags?: string;
}

export interface GigUpdateInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  deliveryDays?: number;
  imageUrl?: string;
  status?: string;
}

export const gigsApi = {
  list: (params?: GigListParams): Promise<GigListResponse> => 
    apiCall('gigs', { params: params as Record<string, string | number | undefined> }),
  
  get: (id: number): Promise<GigWithDetails> => 
    apiCall(`gigs/${id}`),
  
  create: (input: GigCreateInput): Promise<Gig> =>
    apiCall('gigs', { method: 'POST', body: input, requireAuth: true }),
  
  update: (id: number, input: GigUpdateInput): Promise<Gig> =>
    apiCall(`gigs/${id}`, { method: 'PUT', body: input, requireAuth: true }),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    apiCall(`gigs/${id}`, { method: 'DELETE', requireAuth: true }),
};

// ============ AUTH API ============

export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  avatarUrl: string | null;
  verified: boolean;
  emailVerified: boolean;
  sellerLevel: 'new' | 'rising' | 'level_one' | 'top_rated' | null;
  completedOrders: number;
  averageRating: number | null;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  isCommercial: boolean;
  companyName: string | null;
}

export const authApi = {
  me: (): Promise<User | null> => 
    apiCall('auth/me'),
  
  logout: (): Promise<{ success: boolean }> => 
    apiCall('auth/logout', { method: 'POST' }),
};

// ============ ORDERS API ============

export interface Order {
  id: number;
  gigId: number;
  buyerId: number;
  sellerId: number;
  status: string;
  totalPrice: number;
  platformFee: number;
  sellerEarnings: number;
  selectedPackage: 'basic' | 'standard' | 'premium';
  buyerMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = {
  list: (role: 'buyer' | 'seller' = 'buyer'): Promise<{ orders: Order[] }> => 
    apiCall('orders', { params: { role } }),
  
  get: (id: number): Promise<Order> => 
    apiCall(`orders/${id}`),
};

// ============ CHECKOUT API ============

export interface CheckoutInput {
  gigId: number;
  selectedPackage: 'basic' | 'standard' | 'premium';
  selectedExtras?: number[];
  buyerMessage?: string;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export const checkoutApi = {
  createSession: (input: CheckoutInput): Promise<CheckoutSession> =>
    apiCall('checkout', { method: 'POST', body: input, requireAuth: true }),
};

// ============ USERS API ============

export interface PublicUser {
  id: number;
  name: string | null;
  avatarUrl: string | null;
  verified: boolean;
  sellerLevel: string | null;
  completedOrders: number;
  averageRating: number | null;
  bio: string | null;
  country: string | null;
  createdAt: string;
}

export interface ProfileUpdate {
  name?: string;
  bio?: string;
  country?: string;
  avatarUrl?: string;
}

export const usersApi = {
  get: (id: number): Promise<PublicUser> => 
    apiCall(`users/${id}`),
  
  updateProfile: (updates: ProfileUpdate): Promise<{ success: boolean }> => 
    apiCall('users/profile', { method: 'PUT', body: updates }),
};

// ============ LEGACY TRPC COMPATIBILITY ============
// Diese Funktionen ermöglichen eine schrittweise Migration

export const api = {
  gigs: gigsApi,
  auth: authApi,
  orders: ordersApi,
  users: usersApi,
  checkout: checkoutApi,
};

export default api;
