/**
 * Integration Tests for Gig Creation Flow
 * Tests the complete flow from API to database
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../adapters';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const hasCredentials = SUPABASE_URL && SUPABASE_KEY;

describe.skipIf(!hasCredentials)('Gig Creation Flow', () => {
  let testUserId: number;
  let testGigId: number;
  
  beforeAll(async () => {
    // Create a test user first
    const testOpenId = `test_seller_${Date.now()}`;
    await db.upsertUser({
      openId: testOpenId,
      name: 'Test Seller',
      email: 'seller@test.com',
      loginMethod: 'test',
    });
    
    const user = await db.getUserByOpenId(testOpenId);
    if (!user) throw new Error('Failed to create test user');
    testUserId = user.id;
  });
  
  describe('Create Gig', () => {
    it('should create a gig with all required fields', async () => {
      const result = await db.createGig({
        sellerId: testUserId,
        title: 'Test Gig for TDD',
        description: 'This is a test gig created during TDD refactoring',
        category: 'design',
        tags: 'test,tdd',
        price: 5000,
        deliveryDays: 3,
        imageUrl: null,
        status: 'published',
        active: true,
      });
      
      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('number');
      testGigId = result.id;
    });
    
    it('should retrieve the created gig', async () => {
      const gig = await db.getGigById(testGigId);
      
      expect(gig).not.toBeNull();
      expect(gig?.title).toBe('Test Gig for TDD');
      expect(gig?.sellerId).toBe(testUserId);
      expect(gig?.price).toBe(5000);
      expect(gig?.deliveryDays).toBe(3);
      expect(gig?.status).toBe('published');
    });
    
    it('should appear in seller gigs list', async () => {
      const gigs = await db.getSellerGigs(testUserId);
      
      const found = gigs.find(g => g.id === testGigId);
      expect(found).toBeDefined();
    });
    
    it('should appear in paginated gigs', async () => {
      const gigs = await db.getGigsPaginated({ 
        limit: 100,
        category: 'design' 
      });
      
      const found = gigs.find(g => g.id === testGigId);
      expect(found).toBeDefined();
    });
  });
  
  describe('Update Gig', () => {
    it('should update gig title', async () => {
      await db.updateGig(testGigId, { title: 'Updated Test Gig' });
      
      const gig = await db.getGigById(testGigId);
      expect(gig?.title).toBe('Updated Test Gig');
    });
    
    it('should update gig price', async () => {
      await db.updateGig(testGigId, { price: 7500 });
      
      const gig = await db.getGigById(testGigId);
      expect(gig?.price).toBe(7500);
    });
  });
  
  describe('Gig Packages', () => {
    let packageId: number;
    
    it('should create a gig package', async () => {
      const result = await db.createGigPackage({
        gigId: testGigId,
        packageType: 'basic',
        name: 'Basic Package',
        description: 'A basic package for testing',
        price: 5000,
        deliveryDays: 3,
        revisions: 2,
        features: JSON.stringify(['Feature 1', 'Feature 2']),
        active: true,
      });
      
      expect(result).toHaveProperty('id');
      packageId = result.id;
    });
    
    it('should retrieve gig packages', async () => {
      const packages = await db.getGigPackages(testGigId);
      
      expect(packages.length).toBeGreaterThan(0);
      const pkg = packages.find(p => p.id === packageId);
      expect(pkg).toBeDefined();
      expect(pkg?.name).toBe('Basic Package');
      expect(pkg?.packageType).toBe('basic');
    });
    
    it('should update gig package', async () => {
      await db.updateGigPackage(packageId, { price: 6000 });
      
      const packages = await db.getGigPackages(testGigId);
      const pkg = packages.find(p => p.id === packageId);
      expect(pkg?.price).toBe(6000);
    });
    
    it('should delete gig package', async () => {
      await db.deleteGigPackage(packageId);
      
      const packages = await db.getGigPackages(testGigId);
      const pkg = packages.find(p => p.id === packageId);
      expect(pkg).toBeUndefined();
    });
  });
  
  describe('Delete Gig', () => {
    it('should delete the test gig', async () => {
      await db.deleteGig(testGigId);
      
      const gig = await db.getGigById(testGigId);
      expect(gig).toBeNull();
    });
  });
});

describe('Database Connection', () => {
  it('should report connection status', async () => {
    const connected = await db.isConnected();
    // Will be true if Supabase is configured, false otherwise
    expect(typeof connected).toBe('boolean');
  });
});
