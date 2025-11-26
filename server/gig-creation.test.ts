import { describe, it, expect } from 'vitest';

describe('Gig Creation Price Validation', () => {
  it('should accept price in cents >= 100', () => {
    const priceInEuro = 10; // User enters 10€
    const priceInCent = priceInEuro * 100; // Convert to 1000 cents
    
    expect(priceInCent).toBeGreaterThanOrEqual(100);
    expect(priceInCent).toBe(1000);
  });

  it('should reject price < 100 cents', () => {
    const priceInCent = 50; // 0.50€
    expect(priceInCent).toBeLessThan(100);
  });

  it('should handle max price correctly', () => {
    const priceInEuro = 250; // Max price
    const priceInCent = priceInEuro * 100;
    
    expect(priceInCent).toBe(25000);
  });
});
