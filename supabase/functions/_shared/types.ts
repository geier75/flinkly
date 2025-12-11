/**
 * Shared Types für Edge Functions
 */

export interface DbUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  avatarUrl: string | null;
  verified: boolean;
  sellerLevel: 'new' | 'rising' | 'level_one' | 'top_rated' | null;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
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
  description: string | null;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string | null;
  active: boolean;
}

export interface GigListInput {
  limit?: number;
  cursor?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price' | 'delivery' | 'rating' | 'popularity';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
