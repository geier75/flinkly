/**
 * Integration Tests for Supabase Adapter
 * Tests real Supabase connection
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { SupabaseAdapter } from '../adapters/supabase-adapter';

// Skip tests if no Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const hasCredentials = SUPABASE_URL && SUPABASE_KEY;

describe.skipIf(!hasCredentials)('SupabaseAdapter Integration', () => {
  let adapter: SupabaseAdapter;
  
  beforeAll(() => {
    adapter = new SupabaseAdapter(SUPABASE_URL, SUPABASE_KEY);
  });
  
  describe('Connection', () => {
    it('should connect to Supabase', async () => {
      const connected = await adapter.isConnected();
      expect(connected).toBe(true);
    });
  });
  
  describe('Gig Operations', () => {
    it('should fetch gigs with pagination', async () => {
      const gigs = await adapter.getGigsPaginated({ limit: 5 });
      
      expect(Array.isArray(gigs)).toBe(true);
      
      if (gigs.length > 0) {
        const gig = gigs[0];
        // Verify camelCase conversion
        expect(gig).toHaveProperty('id');
        expect(gig).toHaveProperty('sellerId');
        expect(gig).toHaveProperty('title');
        expect(gig).toHaveProperty('deliveryDays');
        expect(gig).toHaveProperty('imageUrl');
        expect(gig).toHaveProperty('createdAt');
        expect(gig.createdAt).toBeInstanceOf(Date);
      }
    });
    
    it('should fetch gig by id', async () => {
      // First get a gig to have a valid ID
      const gigs = await adapter.getGigsPaginated({ limit: 1 });
      
      if (gigs.length > 0) {
        const gig = await adapter.getGigById(gigs[0].id);
        expect(gig).not.toBeNull();
        expect(gig?.id).toBe(gigs[0].id);
        expect(gig?.sellerId).toBeTypeOf('number');
      }
    });
    
    it('should filter gigs by category', async () => {
      const gigs = await adapter.getGigsPaginated({ 
        limit: 10, 
        category: 'design' 
      });
      
      // All returned gigs should have the category
      for (const gig of gigs) {
        expect(gig.category).toBe('design');
      }
    });
    
    it('should sort gigs by price ascending', async () => {
      const gigs = await adapter.getGigsPaginated({ 
        limit: 10, 
        sortBy: 'price_asc' 
      });
      
      if (gigs.length > 1) {
        for (let i = 1; i < gigs.length; i++) {
          expect(gigs[i].price).toBeGreaterThanOrEqual(gigs[i-1].price);
        }
      }
    });
  });
  
  describe('User Operations', () => {
    it('should return null for non-existent user', async () => {
      const user = await adapter.getUserByOpenId('non_existent_user_12345');
      expect(user).toBeNull();
    });
    
    it('should upsert and retrieve user', async () => {
      const testOpenId = `test_user_${Date.now()}`;
      
      // Upsert
      await adapter.upsertUser({
        openId: testOpenId,
        name: 'Test User',
        email: 'test@example.com',
        loginMethod: 'test',
      });
      
      // Retrieve
      const user = await adapter.getUserByOpenId(testOpenId);
      
      expect(user).not.toBeNull();
      expect(user?.openId).toBe(testOpenId);
      expect(user?.name).toBe('Test User');
      expect(user?.email).toBe('test@example.com');
      
      // Verify camelCase properties
      expect(user).toHaveProperty('loginMethod');
      expect(user).toHaveProperty('stripeAccountId');
      expect(user).toHaveProperty('stripeOnboardingComplete');
      expect(user).toHaveProperty('lastSignedIn');
      expect(user?.lastSignedIn).toBeInstanceOf(Date);
    });
  });
  
  describe('Gig Packages', () => {
    it('should fetch packages for a gig', async () => {
      const gigs = await adapter.getGigsPaginated({ limit: 1 });
      
      if (gigs.length > 0) {
        const packages = await adapter.getGigPackages(gigs[0].id);
        expect(Array.isArray(packages)).toBe(true);
        
        if (packages.length > 0) {
          const pkg = packages[0];
          expect(pkg).toHaveProperty('gigId');
          expect(pkg).toHaveProperty('packageType');
          expect(pkg).toHaveProperty('deliveryDays');
        }
      }
    });
  });
  
  describe('Reviews', () => {
    it('should fetch reviews for a gig', async () => {
      const gigs = await adapter.getGigsPaginated({ limit: 1 });
      
      if (gigs.length > 0) {
        const reviews = await adapter.getGigReviews(gigs[0].id, 10);
        expect(Array.isArray(reviews)).toBe(true);
        
        if (reviews.length > 0) {
          const review = reviews[0];
          expect(review).toHaveProperty('gigId');
          expect(review).toHaveProperty('reviewerId');
          expect(review).toHaveProperty('rating');
          expect(review.createdAt).toBeInstanceOf(Date);
        }
      }
    });
  });
  
  describe('Earnings', () => {
    it('should return earnings structure', async () => {
      const earnings = await adapter.getSellerEarnings(999999);
      
      expect(earnings).toHaveProperty('totalEarnings');
      expect(earnings).toHaveProperty('pendingEarnings');
      expect(earnings).toHaveProperty('availableBalance');
      expect(typeof earnings.totalEarnings).toBe('number');
    });
  });
});

// Unit tests that don't need real connection
describe('SupabaseAdapter Unit', () => {
  it('should throw error without credentials', () => {
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_ANON_KEY;
    const originalViteUrl = process.env.VITE_SUPABASE_URL;
    const originalViteKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // Clear all env vars
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
    
    expect(() => new SupabaseAdapter()).toThrow('Missing SUPABASE_URL');
    
    // Restore
    if (originalUrl) process.env.SUPABASE_URL = originalUrl;
    if (originalKey) process.env.SUPABASE_ANON_KEY = originalKey;
    if (originalViteUrl) process.env.VITE_SUPABASE_URL = originalViteUrl;
    if (originalViteKey) process.env.VITE_SUPABASE_ANON_KEY = originalViteKey;
  });
});
