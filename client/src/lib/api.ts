/**
 * API Client - Supabase Edge Functions + tRPC Fallback
 * Nutzt Supabase Edge Functions in Production, tRPC lokal
 */

import { supabase } from './supabase';

// ============ CONFIGURATION ============

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fpiszghehrjmkbxhbwqr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const IS_PRODUCTION = import.meta.env.PROD || window.location.hostname !== 'localhost';

// ============ CORE FETCH FUNCTIONS ============

interface TrpcInput {
  [key: string]: any;
}

// Get auth token from Supabase session
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Supabase Edge Function Call
async function edgeFunctionCall<T>(
  functionName: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  path: string = '',
  body?: any,
  params?: Record<string, string>
): Promise<T> {
  const token = await getAuthToken();
  const url = new URL(`${SUPABASE_URL}/functions/v1/${functionName}${path}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
  };
  
  const response = await fetch(url.toString(), {
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

// tRPC Query Call (GET) - for local development only
async function trpcQuery<T>(procedure: string, input?: TrpcInput): Promise<T> {
  // In production, tRPC is not available - throw error to use Edge Functions instead
  if (IS_PRODUCTION) {
    console.warn(`[API] tRPC not available in production: ${procedure}`);
    throw new Error(`Feature not available: ${procedure}`);
  }
  
  const inputParam = input 
    ? encodeURIComponent(JSON.stringify({ 0: { json: input } })) 
    : encodeURIComponent(JSON.stringify({ 0: { json: {} } }));
  const url = `/api/trpc/${procedure}?batch=1&input=${inputParam}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const message = error[0]?.error?.json?.message || error[0]?.error?.message || error.error || `API error: ${response.status}`;
    throw new Error(message);
  }
  
  const result = await response.json();
  if (result[0]?.error) {
    throw new Error(result[0].error.json?.message || result[0].error.message || 'Unknown error');
  }
  return result[0]?.result?.data?.json ?? result[0]?.result?.data;
}

// tRPC Mutation Call (POST) - for local development only
async function trpcMutation<T>(procedure: string, input?: TrpcInput): Promise<T> {
  // In production, tRPC is not available - throw error to use Edge Functions instead
  if (IS_PRODUCTION) {
    console.warn(`[API] tRPC not available in production: ${procedure}`);
    throw new Error(`Feature not available: ${procedure}`);
  }
  
  const url = `/api/trpc/${procedure}?batch=1`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ 0: { json: input || {} } }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const message = error[0]?.error?.json?.message || error[0]?.error?.message || error.error || `API error: ${response.status}`;
    throw new Error(message);
  }
  
  const result = await response.json();
  if (result[0]?.error) {
    throw new Error(result[0].error.json?.message || result[0].error.message || 'Unknown error');
  }
  return result[0]?.result?.data?.json ?? result[0]?.result?.data;
}

// ============ TYPES ============

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
  reviewer?: { id: number; name: string; avatarUrl: string | null };
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

export interface GigSeller {
  id: number;
  name: string | null;
  avatarUrl: string | null;
  verified: boolean;
  sellerLevel: string | null;
  completedOrders: number;
  averageRating: number | null;
  bio: string | null;
}

export interface GigWithDetails extends Gig {
  seller: GigSeller | null;
  packages: GigPackage[];
  reviews: GigReview[];
  extras: GigExtra[];
}

export interface GigListParams {
  limit?: number;
  cursor?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high' | 'rating';
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

export interface Favorite {
  id: number;
  gigId: number;
  userId: number;
  createdAt: string;
  gig?: Gig;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: { id: number; name: string; avatarUrl: string | null };
  receiver?: { id: number; name: string; avatarUrl: string | null };
}

export interface Conversation {
  id: number;
  participantId: number;
  participant: { id: number; name: string; avatarUrl: string | null };
  lastMessage: Message | null;
  unreadCount: number;
}

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

// ============ API OBJECTS ============

export const gigsApi = {
  list: (params?: GigListParams): Promise<GigListResponse> => {
    if (IS_PRODUCTION) {
      const queryParams: Record<string, string> = {};
      if (params?.limit) queryParams.limit = String(params.limit);
      if (params?.cursor) queryParams.cursor = String(params.cursor);
      if (params?.category) queryParams.category = params.category;
      if (params?.minPrice) queryParams.minPrice = String(params.minPrice);
      if (params?.maxPrice) queryParams.maxPrice = String(params.maxPrice);
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      return edgeFunctionCall('gigs', 'GET', '', undefined, queryParams);
    }
    return trpcQuery('gigs.list', params);
  },
  
  get: (id: number): Promise<GigWithDetails> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'GET', `/${id}`);
    }
    return trpcQuery('gigs.getById', { gigId: id });
  },
  
  create: (input: GigCreateInput): Promise<Gig> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'POST', '', input);
    }
    return trpcMutation('gigs.create', input);
  },
  
  update: (id: number, input: GigUpdateInput): Promise<Gig> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'PUT', `/${id}`, input);
    }
    return trpcMutation('gigs.update', { gigId: id, ...input });
  },
  
  delete: (id: number): Promise<{ success: boolean }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'DELETE', `/${id}`);
    }
    return trpcMutation('gigs.delete', { gigId: id });
  },
  
  myGigs: (): Promise<Gig[]> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'GET', '', undefined, { mine: 'true', status: 'published' });
    }
    return trpcQuery('gigs.myGigs');
  },
  
  getDrafts: (): Promise<Gig[]> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'GET', '', undefined, { mine: 'true', status: 'draft' });
    }
    return trpcQuery('gigs.getDrafts');
  },
  
  publish: (id: number): Promise<Gig> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('gigs', 'PUT', `/${id}`, { status: 'published' });
    }
    return trpcMutation('gigs.publish', { gigId: id });
  },
  
  getSimilar: (gigId: number, k: number = 8, excludeSameSeller: boolean = true): Promise<Gig[]> =>
    trpcQuery('similarGigs.byGigId', { gigId, k, excludeSameSeller }),
  
  getExtras: (gigId: number): Promise<GigExtra[]> =>
    trpcQuery('gigs.getExtras', { gigId }),
};

export const authApi = {
  me: async (): Promise<User | null> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall<User | null>('users', 'GET', '/me');
    }
    return trpcQuery('auth.me');
  },
  
  logout: async (): Promise<{ success: boolean }> => {
    await supabase.auth.signOut();
    return { success: true };
  },
};

export const ordersApi = {
  list: (role: 'buyer' | 'seller' = 'buyer'): Promise<{ orders: Order[] }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'GET', '', undefined, { role });
    }
    return role === 'seller' ? trpcQuery('orders.mySales') : trpcQuery('orders.myPurchases');
  },
  
  get: (id: number): Promise<Order> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'GET', `/${id}`);
    }
    return trpcQuery('orders.getById', { orderId: id });
  },
  
  acceptDelivery: (orderId: number): Promise<Order> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'PUT', `/${orderId}/accept`);
    }
    return trpcMutation('orders.acceptDelivery', { orderId });
  },
  
  requestRevision: (orderId: number, message: string): Promise<Order> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'PUT', `/${orderId}/revision`, { message });
    }
    return trpcMutation('orders.requestRevision', { orderId, message });
  },
  
  openDispute: (orderId: number, reason: string): Promise<Order> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'PUT', `/${orderId}/dispute`, { reason });
    }
    return trpcMutation('orders.openDispute', { orderId, reason });
  },
  
  deliver: (orderId: number, deliveryMessage: string, files?: string[]): Promise<Order> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('orders', 'PUT', `/${orderId}/deliver`, { deliveryMessage, files });
    }
    return trpcMutation('orders.deliver', { orderId, deliveryMessage, files });
  },
};

export const checkoutApi = {
  createSession: (input: CheckoutInput): Promise<CheckoutSession> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('checkout', 'POST', '', input);
    }
    return trpcMutation('checkout.createSession', input);
  },
  
  confirmSession: (sessionId: string): Promise<{ success: boolean; orderId: number }> =>
    trpcMutation('checkout.createFromStripeSession', { sessionId }),
};

export const usersApi = {
  get: (id: number): Promise<PublicUser> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('users', 'GET', `/${id}`);
    }
    return trpcQuery('user.getById', { userId: id });
  },
  
  updateProfile: (updates: ProfileUpdate): Promise<{ success: boolean }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('users', 'PUT', '/me', updates);
    }
    return trpcMutation('user.updateProfile', updates);
  },
  
  getAccountDeletionStatus: (): Promise<{ scheduled: boolean; scheduledDate?: string }> =>
    trpcQuery('user.getAccountDeletionStatus'),
  
  requestAccountDeletion: (): Promise<{ success: boolean; scheduledDate: string }> =>
    trpcMutation('user.requestAccountDeletion'),
  
  cancelAccountDeletion: (): Promise<{ success: boolean }> =>
    trpcMutation('user.cancelAccountDeletion'),
};

export const favoritesApi = {
  list: (): Promise<{ favorites: Favorite[] }> =>
    trpcQuery('favorites.list'),
  
  add: (gigId: number): Promise<Favorite> =>
    trpcMutation('favorites.add', { gigId }),
  
  remove: (gigId: number): Promise<{ success: boolean }> =>
    trpcMutation('favorites.remove', { gigId }),
  
  check: (gigId: number): Promise<{ isFavorite: boolean }> =>
    trpcQuery('favorites.check', { gigId }),
};

export const messagesApi = {
  getConversations: (): Promise<{ conversations: Conversation[] }> =>
    trpcQuery('messages.getConversations'),
  
  getMessages: (participantId: number): Promise<{ messages: Message[] }> =>
    trpcQuery('messages.getMessages', { participantId }),
  
  send: (receiverId: number, content: string): Promise<Message> =>
    trpcMutation('messages.send', { receiverId, content }),
  
  markAsRead: (messageId: number): Promise<{ success: boolean }> =>
    trpcMutation('messages.markAsRead', { messageId }),
};

export const payoutApi = {
  getEarnings: (): Promise<{ available: number; pending: number; total: number }> =>
    trpcQuery('payout.getEarnings'),
  
  getPayouts: (): Promise<any[]> =>
    trpcQuery('payout.getPayouts'),
  
  requestPayout: (amount: number): Promise<{ success: boolean }> =>
    trpcMutation('payout.requestPayout', { amount }),
};

export const stripeConnectApi = {
  getAccountStatus: (): Promise<{ hasAccount: boolean; chargesEnabled: boolean; payoutsEnabled: boolean; onboardingComplete: boolean }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('stripe-connect', 'GET', '/status');
    }
    return trpcQuery('stripeConnect.getAccountStatus');
  },
  
  createAccount: (country: string): Promise<{ accountId: string }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('stripe-connect', 'POST', '/account', { country });
    }
    return trpcMutation('stripeConnect.createAccount', { country });
  },
  
  getOnboardingLink: (): Promise<{ url: string }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('stripe-connect', 'GET', '/onboarding');
    }
    return trpcMutation('stripeConnect.getOnboardingLink');
  },
  
  getDashboardLink: (): Promise<{ url: string }> => {
    if (IS_PRODUCTION) {
      return edgeFunctionCall('stripe-connect', 'GET', '/dashboard');
    }
    return trpcMutation('stripeConnect.getDashboardLink');
  },
};

export const paymentMethodsApi = {
  list: (): Promise<any[]> =>
    trpcQuery('paymentMethods.list'),
  
  save: (paymentMethodId: string): Promise<{ success: boolean }> =>
    trpcMutation('paymentMethods.save', { paymentMethodId }),
  
  delete: (paymentMethodId: string): Promise<{ success: boolean }> =>
    trpcMutation('paymentMethods.delete', { paymentMethodId }),
  
  setDefault: (paymentMethodId: string): Promise<{ success: boolean }> =>
    trpcMutation('paymentMethods.setDefault', { paymentMethodId }),
  
  getSetupIntent: (): Promise<{ clientSecret: string }> =>
    trpcMutation('paymentMethods.createSetupIntent'),
};

export const discountApi = {
  createExitIntentDiscount: (): Promise<{ code: string; amount: number }> =>
    trpcMutation('discount.createExitIntentDiscount'),
  
  validate: (code: string): Promise<{ valid: boolean; amount: number }> =>
    trpcQuery('discount.validate', { code }),
};

export const dataExportApi = {
  request: (): Promise<{ success: boolean; exportId: string }> =>
    trpcMutation('dataExport.exportMyData'),
  
  getStatus: (exportId: string): Promise<{ status: string; downloadUrl?: string }> =>
    trpcQuery('dataExport.getStatus', { exportId }),
};

export const consentApi = {
  get: (): Promise<{ consents: Record<string, boolean> }> =>
    trpcQuery('consent.get'),
  
  update: (consents: Record<string, boolean>): Promise<{ success: boolean }> =>
    trpcMutation('consent.update', consents),
};

export const adminApi = {
  getStats: (): Promise<any> =>
    trpcQuery('analytics.getPlatformSummary'),
  
  getUsers: (params?: { search?: string; page?: number }): Promise<any> =>
    trpcQuery('admin.getUsers', params),
  
  banUser: (userId: number): Promise<{ success: boolean }> =>
    trpcMutation('admin.banUser', { userId }),
  
  unbanUser: (userId: number): Promise<{ success: boolean }> =>
    trpcMutation('admin.unbanUser', { userId }),
  
  getGigs: (params?: { status?: string; page?: number }): Promise<any> =>
    trpcQuery('admin.getGigs', params),
  
  approveGig: (gigId: number): Promise<{ success: boolean }> =>
    trpcMutation('admin.approveGig', { gigId }),
  
  rejectGig: (gigId: number, reason: string): Promise<{ success: boolean }> =>
    trpcMutation('admin.rejectGig', { gigId, reason }),
};

export const verificationApi = {
  getStatus: (): Promise<any> =>
    trpcQuery('verification.getVerificationStatus'),
  
  sendEmailVerification: (): Promise<{ success: boolean }> =>
    trpcMutation('verification.sendEmailVerification'),
  
  verifyEmail: (token: string): Promise<{ success: boolean }> =>
    trpcMutation('verification.verifyEmail', { token }),
  
  sendPhoneVerification: (phoneNumber: string): Promise<{ success: boolean }> =>
    trpcMutation('verification.sendPhoneVerification', { phoneNumber }),
  
  verifyPhone: (code: string): Promise<{ success: boolean }> =>
    trpcMutation('verification.verifyPhone', { code }),
  
  submitKybc: (data: any): Promise<{ success: boolean }> =>
    trpcMutation('verification.submitKybc', data),
};

// ============ LEGACY COMPATIBILITY ============

export const api = {
  gigs: gigsApi,
  auth: authApi,
  orders: ordersApi,
  users: usersApi,
  checkout: checkoutApi,
};

export default api;
