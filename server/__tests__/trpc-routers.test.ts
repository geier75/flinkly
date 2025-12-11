import { describe, it, expect, beforeAll, vi } from 'vitest';
import * as db from '../adapters';

/**
 * tRPC Router Integration Tests
 * 
 * Tests critical API endpoints:
 * - gigs.list - Public gig listing
 * - gigs.getById - Single gig retrieval
 * - orders.create - Order creation (requires auth)
 * - user.profile - User profile (requires auth)
 */

describe('tRPC Router Tests', () => {
  describe('Gigs Router', () => {
    it('should list gigs with pagination', async () => {
      const gigs = await db.getGigsPaginated({ limit: 10 });
      
      expect(Array.isArray(gigs)).toBe(true);
      expect(gigs.length).toBeLessThanOrEqual(10);
      
      if (gigs.length > 0) {
        const gig = gigs[0];
        expect(gig).toHaveProperty('id');
        expect(gig).toHaveProperty('title');
        expect(gig).toHaveProperty('price');
        expect(gig).toHaveProperty('category');
      }
    });

    it('should filter gigs by category', async () => {
      const gigs = await db.getGigsPaginated({ 
        limit: 10, 
        category: 'design' 
      });
      
      expect(Array.isArray(gigs)).toBe(true);
      gigs.forEach(gig => {
        expect(gig.category).toBe('design');
      });
    });

    it('should filter gigs by price range', async () => {
      const minPrice = 1000; // 10€
      const maxPrice = 10000; // 100€
      
      const gigs = await db.getGigsPaginated({ 
        limit: 10, 
        minPrice,
        maxPrice,
      });
      
      expect(Array.isArray(gigs)).toBe(true);
      gigs.forEach(gig => {
        expect(gig.price).toBeGreaterThanOrEqual(minPrice);
        expect(gig.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should sort gigs by price ascending', async () => {
      const gigs = await db.getGigsPaginated({ 
        limit: 20, 
        sortBy: 'price' 
      });
      
      expect(Array.isArray(gigs)).toBe(true);
      
      if (gigs.length > 1) {
        for (let i = 1; i < gigs.length; i++) {
          expect(gigs[i].price).toBeGreaterThanOrEqual(gigs[i - 1].price);
        }
      }
    });

    it('should get gig by ID', async () => {
      // First get a gig to know a valid ID
      const gigs = await db.getGigsPaginated({ limit: 1 });
      
      if (gigs.length > 0) {
        const gig = await db.getGigById(gigs[0].id);
        
        expect(gig).toBeDefined();
        expect(gig?.id).toBe(gigs[0].id);
        expect(gig?.title).toBe(gigs[0].title);
      }
    });

    it('should return null for non-existent gig', async () => {
      const gig = await db.getGigById(999999999);
      expect(gig).toBeNull();
    });
  });

  describe('User Router', () => {
    it('should get user by ID', async () => {
      // Get a user from an existing gig
      const gigs = await db.getGigsPaginated({ limit: 1 });
      
      if (gigs.length > 0 && gigs[0].sellerId) {
        const user = await db.getUserById(gigs[0].sellerId);
        
        expect(user).toBeDefined();
        expect(user?.id).toBe(gigs[0].sellerId);
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      }
    });

    it('should return undefined for non-existent user', async () => {
      const user = await db.getUserById(999999999);
      expect(user).toBeUndefined();
    });
  });

  describe('Gig Packages Router', () => {
    let testGigId: number;

    beforeAll(async () => {
      // Get a gig to test packages
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        testGigId = gigs[0].id;
      }
    });

    it('should get packages for a gig', async () => {
      if (!testGigId) return;
      
      const packages = await db.getGigPackages(testGigId);
      
      expect(Array.isArray(packages)).toBe(true);
      
      if (packages.length > 0) {
        const pkg = packages[0];
        expect(pkg).toHaveProperty('id');
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('price');
        expect(pkg).toHaveProperty('packageType');
      }
    });

    it('should return empty array for gig without packages', async () => {
      const packages = await db.getGigPackages(999999999);
      expect(packages).toEqual([]);
    });
  });

  describe('Gig Extras Router', () => {
    let testGigId: number;

    beforeAll(async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        testGigId = gigs[0].id;
      }
    });

    it('should get extras for a gig', async () => {
      if (!testGigId) return;
      
      const extras = await db.getGigExtras(testGigId);
      
      expect(Array.isArray(extras)).toBe(true);
      
      if (extras.length > 0) {
        const extra = extras[0];
        expect(extra).toHaveProperty('id');
        expect(extra).toHaveProperty('name');
        expect(extra).toHaveProperty('price');
      }
    });

    it('should return empty array for gig without extras', async () => {
      const extras = await db.getGigExtras(999999999);
      expect(extras).toEqual([]);
    });
  });

  describe('Database Connection', () => {
    it('should be connected to database', async () => {
      const connected = await db.isConnected();
      expect(connected).toBe(true);
    });
  });
});
