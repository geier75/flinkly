/**
 * API Client - Direkte fetch-Calls zum tRPC-Backend
 * Ersetzt die tRPC-React-Hooks mit einfachen fetch-Funktionen
 */

// ============ CORE FETCH FUNCTIONS ============

interface TrpcInput {
  [key: string]: any;
}

// tRPC Query Call (GET)
async function trpcQuery<T>(procedure: string, input?: TrpcInput): Promise<T> {
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

// tRPC Mutation Call (POST)
async function trpcMutation<T>(procedure: string, input?: TrpcInput): Promise<T> {
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
  list: (params?: GigListParams): Promise<GigListResponse> => 
    trpcQuery('gigs.list', params),
  
  get: (id: number): Promise<GigWithDetails> => 
    trpcQuery('gigs.getById', { gigId: id }),
  
  create: (input: GigCreateInput): Promise<Gig> =>
    trpcMutation('gigs.create', input),
  
  update: (id: number, input: GigUpdateInput): Promise<Gig> =>
    trpcMutation('gigs.update', { gigId: id, ...input }),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    trpcMutation('gigs.delete', { gigId: id }),
  
  myGigs: (): Promise<Gig[]> =>
    trpcQuery('gigs.myGigs'),
  
  getDrafts: (): Promise<Gig[]> =>
    trpcQuery('gigs.getDrafts'),
  
  publish: (id: number): Promise<Gig> =>
    trpcMutation('gigs.publish', { gigId: id }),
  
  getSimilar: (gigId: number, k: number = 8, excludeSameSeller: boolean = true): Promise<Gig[]> =>
    trpcQuery('similarGigs.byGigId', { gigId, k, excludeSameSeller }),
  
  getExtras: (gigId: number): Promise<GigExtra[]> =>
    trpcQuery('gigs.getExtras', { gigId }),
};

export const authApi = {
  me: (): Promise<User | null> => 
    trpcQuery('auth.me'),
  
  logout: (): Promise<{ success: boolean }> => 
    trpcMutation('auth.logout'),
};

export const ordersApi = {
  list: (role: 'buyer' | 'seller' = 'buyer'): Promise<{ orders: Order[] }> => 
    role === 'seller' ? trpcQuery('orders.mySales') : trpcQuery('orders.myPurchases'),
  
  get: (id: number): Promise<Order> => 
    trpcQuery('orders.getById', { orderId: id }),
  
  acceptDelivery: (orderId: number): Promise<Order> =>
    trpcMutation('orders.acceptDelivery', { orderId }),
  
  requestRevision: (orderId: number, message: string): Promise<Order> =>
    trpcMutation('orders.requestRevision', { orderId, message }),
  
  openDispute: (orderId: number, reason: string): Promise<Order> =>
    trpcMutation('orders.openDispute', { orderId, reason }),
  
  deliver: (orderId: number, deliveryMessage: string, files?: string[]): Promise<Order> =>
    trpcMutation('orders.deliver', { orderId, deliveryMessage, files }),
};

export const checkoutApi = {
  createSession: (input: CheckoutInput): Promise<CheckoutSession> =>
    trpcMutation('checkout.createSession', input),
  
  confirmSession: (sessionId: string): Promise<{ success: boolean; orderId: number }> =>
    trpcMutation('checkout.createFromStripeSession', { sessionId }),
};

export const usersApi = {
  get: (id: number): Promise<PublicUser> => 
    trpcQuery('user.getById', { userId: id }),
  
  updateProfile: (updates: ProfileUpdate): Promise<{ success: boolean }> => 
    trpcMutation('user.updateProfile', updates),
  
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
  getAccountStatus: (): Promise<{ hasAccount: boolean; chargesEnabled: boolean; payoutsEnabled: boolean; onboardingComplete: boolean }> =>
    trpcQuery('stripeConnect.getAccountStatus'),
  
  createAccount: (country: string): Promise<{ accountId: string }> =>
    trpcMutation('stripeConnect.createAccount', { country }),
  
  getOnboardingLink: (): Promise<{ url: string }> =>
    trpcMutation('stripeConnect.getOnboardingLink'),
  
  getDashboardLink: (): Promise<{ url: string }> =>
    trpcMutation('stripeConnect.getDashboardLink'),
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
