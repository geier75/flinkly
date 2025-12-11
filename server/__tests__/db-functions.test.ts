import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../adapters';

/**
 * Database Functions Tests
 * 
 * Comprehensive tests for all database adapter functions
 */

describe('Database Functions', () => {
  describe('User Functions', () => {
    it('should get user by ID', async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        const user = await db.getUserById(gigs[0].sellerId);
        expect(user).toBeDefined();
        expect(user?.id).toBe(gigs[0].sellerId);
      }
    });

    it('should return null/undefined for non-existent user', async () => {
      const user = await db.getUserById(888888888);
      expect(user).toBeFalsy();
    });

    it('should return null/undefined for non-existent openId', async () => {
      const user = await db.getUserByOpenId('non-existent-open-id-12345');
      expect(user).toBeFalsy();
    });
  });

  describe('Gig Functions', () => {
    let testGigId: number | null = null;
    let testSellerId: number | null = null;

    beforeAll(async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        testGigId = gigs[0].id;
        testSellerId = gigs[0].sellerId;
      }
    });

    it('should get gigs paginated', async () => {
      const gigs = await db.getGigsPaginated({ limit: 10 });
      expect(Array.isArray(gigs)).toBe(true);
      if (gigs.length > 0) {
        expect(gigs[0]).toHaveProperty('id');
        expect(gigs[0]).toHaveProperty('title');
        expect(gigs[0]).toHaveProperty('price');
      }
    });

    it('should respect limit parameter', async () => {
      const gigs = await db.getGigsPaginated({ limit: 5 });
      expect(gigs.length).toBeLessThanOrEqual(5);
    });

    it('should get gig by ID', async () => {
      if (testGigId) {
        const gig = await db.getGigById(testGigId);
        expect(gig).toBeDefined();
        expect(gig?.id).toBe(testGigId);
      }
    });

    it('should return null for non-existent gig', async () => {
      const gig = await db.getGigById(999999);
      expect(gig).toBeNull();
    });

    it('should get seller gigs', async () => {
      if (testSellerId) {
        const gigs = await db.getSellerGigs(testSellerId);
        expect(Array.isArray(gigs)).toBe(true);
        gigs.forEach(gig => {
          expect(gig.sellerId).toBe(testSellerId);
        });
      }
    });

    it('should get gigs for seller', async () => {
      // Note: 999999 is a test seller ID that may have gigs
      const gigs = await db.getSellerGigs(999999);
      expect(Array.isArray(gigs)).toBe(true);
    });

    it('should create and delete gig', async () => {
      if (testSellerId) {
        const newGig = await db.createGig({
          sellerId: testSellerId,
          title: 'Test Gig for DB Functions Test',
          description: 'This is a test gig created by automated tests. It will be deleted.',
          category: 'Design & Kreatives',
          price: 5000,
          deliveryDays: 3,
          status: 'draft',
          active: false,
          tags: '',
          imageUrl: null,
        });

        expect(newGig).toBeDefined();
        expect(newGig.id).toBeDefined();

        // Verify it was created
        const fetchedGig = await db.getGigById(newGig.id);
        expect(fetchedGig).toBeDefined();
        expect(fetchedGig?.title).toBe('Test Gig for DB Functions Test');

        // Delete it
        await db.deleteGig(newGig.id);

        // Verify it was deleted
        const deletedGig = await db.getGigById(newGig.id);
        expect(deletedGig).toBeNull();
      }
    });

    it('should update gig', async () => {
      if (testGigId) {
        const originalGig = await db.getGigById(testGigId);
        const newTitle = `Updated Title ${Date.now()}`;

        await db.updateGig(testGigId, { title: newTitle });
        const updatedGig = await db.getGigById(testGigId);

        expect(updatedGig?.title).toBe(newTitle);

        // Restore original title
        if (originalGig?.title) {
          await db.updateGig(testGigId, { title: originalGig.title });
        }
      }
    });
  });

  describe('Gig Package Functions', () => {
    let testGigId: number | null = null;

    beforeAll(async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        testGigId = gigs[0].id;
      }
    });

    it('should get gig packages', async () => {
      if (testGigId) {
        const packages = await db.getGigPackages(testGigId);
        expect(Array.isArray(packages)).toBe(true);
      }
    });

    it('should return empty array for gig with no packages', async () => {
      const packages = await db.getGigPackages(999999);
      expect(packages).toEqual([]);
    });

    it('should create and delete package', async () => {
      if (testGigId) {
        const newPackage = await db.createGigPackage({
          gigId: testGigId,
          name: 'Test Package',
          description: 'Test package description',
          price: 5000,
          deliveryDays: 3,
          revisions: 2,
          active: true,
          packageType: 'basic',
          features: '',
        });

        expect(newPackage).toBeDefined();
        expect(newPackage.id).toBeDefined();

        // Verify it was created
        const packages = await db.getGigPackages(testGigId);
        const found = packages.find(p => p.id === newPackage.id);
        expect(found).toBeDefined();

        // Delete it
        await db.deleteGigPackage(newPackage.id);

        // Verify it was deleted
        const packagesAfter = await db.getGigPackages(testGigId);
        const foundAfter = packagesAfter.find(p => p.id === newPackage.id);
        expect(foundAfter).toBeUndefined();
      }
    });
  });

  describe('Gig Extra Functions', () => {
    let testGigId: number | null = null;

    beforeAll(async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        testGigId = gigs[0].id;
      }
    });

    it('should get gig extras', async () => {
      if (testGigId) {
        const extras = await db.getGigExtras(testGigId);
        expect(Array.isArray(extras)).toBe(true);
      }
    });

    it('should return empty array for gig with no extras', async () => {
      const extras = await db.getGigExtras(999999);
      expect(extras).toEqual([]);
    });

    it('should create and delete extra', async () => {
      if (testGigId) {
        const newExtra = await db.createGigExtra({
          gigId: testGigId,
          name: 'Test Extra',
          description: 'Test extra description',
          price: 1000,
          deliveryDaysReduction: 0,
        });

        expect(newExtra).toBeDefined();
        expect(newExtra.id).toBeDefined();

        // Verify it was created
        const extras = await db.getGigExtras(testGigId);
        const found = extras.find(e => e.id === newExtra.id);
        expect(found).toBeDefined();

        // Delete it
        await db.deleteGigExtra(newExtra.id);

        // Verify it was deleted
        const extrasAfter = await db.getGigExtras(testGigId);
        const foundAfter = extrasAfter.find(e => e.id === newExtra.id);
        expect(foundAfter).toBeUndefined();
      }
    });
  });

  describe('Order Functions', () => {
    it('should get orders by buyer ID', async () => {
      const orders = await db.getOrdersByBuyerId(999999);
      expect(Array.isArray(orders)).toBe(true);
    });

    it('should get orders by seller ID', async () => {
      const orders = await db.getOrdersBySellerId(999999);
      expect(Array.isArray(orders)).toBe(true);
    });
  });


  describe('Edge Cases', () => {
    it('should handle concurrent reads', async () => {
      const promises = Array(10).fill(null).map(() => 
        db.getGigsPaginated({ limit: 5 })
      );
      
      const results = await Promise.all(promises);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it('should handle empty updates', async () => {
      const gigs = await db.getGigsPaginated({ limit: 1 });
      if (gigs.length > 0) {
        // Update with empty object should not throw
        await db.updateGig(gigs[0].id, {});
        const gig = await db.getGigById(gigs[0].id);
        expect(gig).toBeDefined();
      }
    });
  });
});
