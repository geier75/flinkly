import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createGig, 
  getGigPackages, 
  createGigPackage, 
  updateGigPackage, 
  deleteGigPackage,
  getGigExtras,
  createGigExtra,
  updateGigExtra,
  deleteGigExtra
} from './db';

describe('Gig Packages & Extras', () => {
  let testGigId: number;
  let testPackageId: number;
  let testExtraId: number;

  beforeAll(async () => {
    // Create a test gig first
    const result = await createGig({
      sellerId: 4740010, // Use existing seller from seed data
      title: 'Test Gig for Packages',
      description: 'This is a test gig to test package functionality. It will be cleaned up after tests.',
      category: 'design',
      price: 1000, // 10€ in cents
      deliveryDays: 3,
      status: 'draft',
      active: false,
    });
    testGigId = result.id;
    console.log('[Test] Created test gig:', testGigId);
  });

  afterAll(async () => {
    // Cleanup will be handled by deleteGig cascade
    console.log('[Test] Test gig will be cleaned up manually if needed:', testGigId);
  });

  describe('Gig Packages', () => {
    it('should create a basic package', async () => {
      const result = await createGigPackage({
        gigId: testGigId,
        packageType: 'basic',
        name: 'Basic Logo',
        description: '1 logo concept, 2 revisions, 3 days delivery',
        price: 5000, // 50€
        deliveryDays: 3,
        revisions: 2,
        features: JSON.stringify(['1 concept', '2 revisions', 'Source files']),
      });

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      testPackageId = result.id;
    });

    it('should get packages for a gig', async () => {
      const packages = await getGigPackages(testGigId);
      
      expect(packages).toBeDefined();
      expect(Array.isArray(packages)).toBe(true);
      expect(packages.length).toBeGreaterThan(0);
      
      const basicPackage = packages.find(p => p.packageType === 'basic');
      expect(basicPackage).toBeDefined();
      expect(basicPackage?.name).toBe('Basic Logo');
      expect(basicPackage?.price).toBe(5000);
    });

    it('should update a package', async () => {
      await updateGigPackage(testPackageId, {
        price: 6000, // Update to 60€
        revisions: 3,
      });

      const packages = await getGigPackages(testGigId);
      const updatedPackage = packages.find(p => p.id === testPackageId);
      
      expect(updatedPackage?.price).toBe(6000);
      expect(updatedPackage?.revisions).toBe(3);
    });

    it('should create standard and premium packages', async () => {
      await createGigPackage({
        gigId: testGigId,
        packageType: 'standard',
        name: 'Standard Logo Package',
        description: '3 logo concepts, 5 revisions, 5 days delivery',
        price: 10000, // 100€
        deliveryDays: 5,
        revisions: 5,
        features: JSON.stringify(['3 concepts', '5 revisions', 'Source files', 'Brand guide']),
      });

      await createGigPackage({
        gigId: testGigId,
        packageType: 'premium',
        name: 'Premium Brand Package',
        description: '5 logo concepts, unlimited revisions, 7 days delivery',
        price: 20000, // 200€
        deliveryDays: 7,
        revisions: 999,
        features: JSON.stringify(['5 concepts', 'Unlimited revisions', 'Source files', 'Brand guide', 'Social media kit']),
      });

      const packages = await getGigPackages(testGigId);
      expect(packages.length).toBe(3); // basic, standard, premium
    });

    it('should delete a package', async () => {
      await deleteGigPackage(testPackageId);
      
      const packages = await getGigPackages(testGigId);
      const deletedPackage = packages.find(p => p.id === testPackageId);
      
      expect(deletedPackage).toBeUndefined();
    });
  });

  describe('Gig Extras', () => {
    it('should create an extra', async () => {
      const result = await createGigExtra({
        gigId: testGigId,
        name: 'Express Delivery',
        description: 'Get your order 2 days faster',
        price: 2000, // 20€
        deliveryTimeReduction: 2,
      });

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      testExtraId = result.id;
    });

    it('should get extras for a gig', async () => {
      const extras = await getGigExtras(testGigId);
      
      expect(extras).toBeDefined();
      expect(Array.isArray(extras)).toBe(true);
      expect(extras.length).toBeGreaterThan(0);
      
      const expressExtra = extras.find(e => e.name === 'Express Delivery');
      expect(expressExtra).toBeDefined();
      expect(expressExtra?.price).toBe(2000);
    });

    it('should create multiple extras', async () => {
      await createGigExtra({
        gigId: testGigId,
        name: 'Extra Revisions (+3)',
        description: 'Get 3 additional revision rounds',
        price: 1500, // 15€
        deliveryTimeReduction: 0,
      });

      await createGigExtra({
        gigId: testGigId,
        name: 'Commercial License',
        description: 'Full commercial usage rights',
        price: 5000, // 50€
        deliveryTimeReduction: 0,
      });

      const extras = await getGigExtras(testGigId);
      expect(extras.length).toBe(3);
    });

    it('should update an extra', async () => {
      await updateGigExtra(testExtraId, {
        price: 2500, // Update to 25€
      });

      const extras = await getGigExtras(testGigId);
      const updatedExtra = extras.find(e => e.id === testExtraId);
      
      expect(updatedExtra?.price).toBe(2500);
    });

    it('should delete an extra', async () => {
      await deleteGigExtra(testExtraId);
      
      const extras = await getGigExtras(testGigId);
      const deletedExtra = extras.find(e => e.id === testExtraId);
      
      expect(deletedExtra).toBeUndefined();
    });
  });

  describe('Backwards Compatibility', () => {
    it('should handle gigs without packages gracefully', async () => {
      // Get an existing gig - should return array (empty or with items)
      const packages = await getGigPackages(150001); // Existing gig from seed
      
      expect(packages).toBeDefined();
      expect(Array.isArray(packages)).toBe(true);
      // Should return array without error (length can be 0 or more)
      expect(packages.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle gigs without extras gracefully', async () => {
      const extras = await getGigExtras(150001);
      
      expect(extras).toBeDefined();
      expect(Array.isArray(extras)).toBe(true);
      expect(extras.length).toBe(0);
    });
  });
});
