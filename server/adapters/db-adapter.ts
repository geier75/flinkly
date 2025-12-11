/**
 * Database Adapter Interface
 * Unified interface for MySQL and Supabase backends
 */

// Normalized types (camelCase) used throughout the app
export interface DbUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  loginMethod: string | null;
  bio: string | null;
  avatarUrl: string | null;
  country: string | null;
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
  companyAddress: string | null;
  taxId: string | null;
  tradeRegister: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface DbGig {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface DbGigPackage {
  id: number;
  gigId: number;
  packageType: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbOrder {
  id: number;
  gigId: number;
  buyerId: number;
  sellerId: number;
  totalPrice: number;
  platformFee: number;
  sellerEarnings: number;
  status: string;
  selectedPackage?: 'basic' | 'standard' | 'premium' | null;
  buyerMessage?: string | null;
  selectedExtras?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbReview {
  id: number;
  orderId: number;
  gigId: number;
  reviewerId: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface PaginationOptions {
  limit?: number;
  cursor?: number;
  offset?: number;
}

export interface GigFilterOptions extends PaginationOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  status?: 'draft' | 'published' | 'archived';
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'relevance' | 'price' | 'delivery';
}

export interface DbAdapter {
  // Connection
  isConnected(): Promise<boolean>;
  
  // User operations
  getUserByOpenId(openId: string): Promise<DbUser | null>;
  getUserById(id: number): Promise<DbUser | null>;
  upsertUser(user: Partial<DbUser> & { openId: string }): Promise<void>;
  
  // Gig operations
  getGigById(id: number): Promise<DbGig | null>;
  getGigsPaginated(options: GigFilterOptions): Promise<DbGig[]>;
  getSellerGigs(sellerId: number, limit?: number, offset?: number): Promise<DbGig[]>;
  getSellerDrafts(sellerId: number): Promise<DbGig[]>;
  createGig(gig: Omit<DbGig, 'id' | 'createdAt' | 'updatedAt' | 'completedOrders' | 'averageRating' | 'popularityScore'>): Promise<{ id: number }>;
  updateGig(id: number, updates: Partial<DbGig>): Promise<void>;
  deleteGig(id: number): Promise<void>;
  publishGig(id: number): Promise<void>;
  
  // Gig Package operations
  getGigPackages(gigId: number): Promise<DbGigPackage[]>;
  createGigPackage(pkg: Omit<DbGigPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }>;
  updateGigPackage(id: number, updates: Partial<DbGigPackage>): Promise<void>;
  deleteGigPackage(id: number): Promise<void>;
  
  // Gig Extra operations
  getGigExtras(gigId: number): Promise<any[]>;
  createGigExtra(extra: any): Promise<{ id: number }>;
  updateGigExtra(id: number, updates: any): Promise<void>;
  deleteGigExtra(id: number): Promise<void>;
  
  // Order operations
  getOrderById(id: number): Promise<DbOrder | null>;
  getBuyerOrders(buyerId: number, limit?: number): Promise<DbOrder[]>;
  getSellerOrders(sellerId: number, limit?: number): Promise<DbOrder[]>;
  createOrder(order: Omit<DbOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  
  // Review operations
  getGigReviews(gigId: number, limit?: number, offset?: number): Promise<DbReview[]>;
  createReview(review: Omit<DbReview, 'id' | 'createdAt'>): Promise<{ id: number }>;
  
  // Conversation operations
  createConversation(conv: { gigId?: number; orderId?: number; buyerId: number; sellerId: number }): Promise<{ id: number }>;
  
  // Earnings & Payouts
  getSellerEarnings(sellerId: number): Promise<{ totalEarnings: number; pendingEarnings: number; availableBalance: number }>;
  getSellerPayouts(sellerId: number, limit?: number): Promise<any[]>;
  createPayout(payout: { sellerId: number; amount: number; stripePayoutId?: string }): Promise<{ id: number }>;
}
