import { describe, it, expect, beforeAll } from 'vitest';
import { createGig, getGigById } from './db';

/**
 * CreateGig E2E Test
 * 
 * Tests the full gig creation flow:
 * 1. Create a gig with valid data
 * 2. Verify it's stored in database
 * 3. Verify it has correct status and active flag
 */
describe('CreateGig E2E', () => {
  let createdGigId: number;
  const testSellerId = 4740010; // Use existing seller from seed data

  it('should create a gig with valid data', async () => {
    const gigData = {
      sellerId: testSellerId,
      title: 'Test Gig - E2E Test',
      description: 'This is a test gig created by automated E2E test. It should be deleted after test completion.',
      category: 'design',
      price: 199,
      deliveryDays: 5,
      imageUrl: '/images/test-gig.jpg',
      status: 'published' as const,
      active: true,
    };

    const result = await createGig(gigData);
    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    
    createdGigId = result.id;
    console.log(`✅ Created gig with ID: ${createdGigId}`);
  });

  it('should retrieve the created gig from database', async () => {
    const gig = await getGigById(createdGigId);
    
    expect(gig).toBeDefined();
    expect(gig?.id).toBe(createdGigId);
    expect(gig?.title).toBe('Test Gig - E2E Test');
    expect(gig?.category).toBe('design');
    expect(gig?.price).toBe(199);
    expect(gig?.deliveryDays).toBe(5);
    expect(gig?.status).toBe('published');
    expect(gig?.active).toBe(true);
    
    console.log(`✅ Retrieved gig: ${gig?.title}`);
  });

  it('should have correct seller information', async () => {
    const gig = await getGigById(createdGigId);
    
    expect(gig?.seller).toBeDefined();
    expect(gig?.seller?.id).toBe(testSellerId);
    expect(gig?.seller?.name).toBeDefined();
    
    console.log(`✅ Seller: ${gig?.seller?.name}`);
  });
});
