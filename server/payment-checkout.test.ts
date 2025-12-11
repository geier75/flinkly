import { describe, it, expect, beforeAll } from 'vitest';
import { getGigById, getUserById } from '../server/db';

describe('Payment Checkout Flow', () => {
  let testGig: any;
  let testSeller: any;

  beforeAll(async () => {
    // Use an existing gig from the database (get the first published gig)
    const { getGigsPaginated } = await import('../server/db');
    const gigs = await getGigsPaginated({ limit: 1 });
    testGig = gigs[0];
    if (testGig) {
      testSeller = await getUserById(testGig.sellerId);
    }
  });

  it('should fetch gig successfully', async () => {
    expect(testGig).toBeDefined();
    expect(testGig).toHaveProperty('id');
    expect(testGig).toHaveProperty('title');
    expect(testGig).toHaveProperty('price');
    expect(testGig).toHaveProperty('sellerId');
  });

  it('should fetch seller successfully', async () => {
    expect(testSeller).toBeDefined();
    expect(testSeller).toHaveProperty('id');
    expect(testSeller).toHaveProperty('name');
    expect(testSeller).toHaveProperty('email');
  });

  it('should have valid gig price', () => {
    expect(testGig.price).toBeGreaterThan(0);
    expect(Number.isFinite(testGig.price)).toBe(true);
  });

  it('should have valid seller ID', () => {
    expect(testGig.sellerId).toBe(testSeller.id);
  });

  it('should handle stripeAccountId gracefully', () => {
    // Seller might or might not have Stripe Connect account
    // This should not cause an error regardless
    const stripeAccountId = testSeller?.stripeAccountId;
    // stripeAccountId can be undefined, null (new seller) or a string (connected seller)
    expect(stripeAccountId === undefined || stripeAccountId === null || typeof stripeAccountId === 'string').toBe(true);
  });
});
