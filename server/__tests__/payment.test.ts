import { describe, it, expect, vi, beforeAll } from 'vitest';
import Stripe from 'stripe';

/**
 * Payment Module Tests
 * 
 * Tests Stripe payment integration:
 * - Checkout session creation
 * - Price calculation
 * - Fee calculation
 * - Escrow handling
 */

// Get Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover' as any,
});

describe('Payment Module', () => {
  describe('Stripe Configuration', () => {
    it('should have Stripe secret key configured', () => {
      expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
      expect(process.env.STRIPE_SECRET_KEY?.startsWith('sk_')).toBe(true);
    });

    it('should be in test mode', () => {
      expect(process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')).toBe(true);
    });
  });

  describe('Price Calculation', () => {
    const calculateTotalPrice = (basePrice: number, extras: { price: number }[] = []): number => {
      const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
      return basePrice + extrasTotal;
    };

    it('should calculate base price correctly', () => {
      expect(calculateTotalPrice(5000)).toBe(5000);
    });

    it('should add extras to base price', () => {
      const extras = [{ price: 1000 }, { price: 500 }];
      expect(calculateTotalPrice(5000, extras)).toBe(6500);
    });

    it('should handle empty extras array', () => {
      expect(calculateTotalPrice(5000, [])).toBe(5000);
    });

    it('should handle multiple extras', () => {
      const extras = [
        { price: 1000 },
        { price: 2000 },
        { price: 500 },
        { price: 1500 },
      ];
      expect(calculateTotalPrice(5000, extras)).toBe(10000);
    });
  });

  describe('Platform Fee Calculation', () => {
    const PLATFORM_FEE_PERCENT = 15;

    const calculatePlatformFee = (amount: number): number => {
      return Math.round(amount * (PLATFORM_FEE_PERCENT / 100));
    };

    const calculateSellerAmount = (amount: number): number => {
      return amount - calculatePlatformFee(amount);
    };

    it('should calculate 15% platform fee', () => {
      expect(calculatePlatformFee(10000)).toBe(1500); // €100 → €15 fee
    });

    it('should calculate seller amount (85%)', () => {
      expect(calculateSellerAmount(10000)).toBe(8500); // €100 → €85 to seller
    });

    it('should handle small amounts', () => {
      expect(calculatePlatformFee(500)).toBe(75); // €5 → €0.75 fee
      expect(calculateSellerAmount(500)).toBe(425); // €5 → €4.25 to seller
    });

    it('should round to nearest cent', () => {
      expect(calculatePlatformFee(333)).toBe(50); // Rounded
    });

    it('should handle zero amount', () => {
      expect(calculatePlatformFee(0)).toBe(0);
      expect(calculateSellerAmount(0)).toBe(0);
    });
  });

  describe('Checkout Session Validation', () => {
    const validateCheckoutParams = (params: {
      gigId: number;
      packageId?: number;
      extras?: number[];
      buyerId: number;
    }): { valid: boolean; error?: string } => {
      if (!params.gigId || params.gigId <= 0) {
        return { valid: false, error: 'Invalid gig ID' };
      }
      if (!params.buyerId || params.buyerId <= 0) {
        return { valid: false, error: 'Invalid buyer ID' };
      }
      if (params.packageId !== undefined && params.packageId <= 0) {
        return { valid: false, error: 'Invalid package ID' };
      }
      if (params.extras && !Array.isArray(params.extras)) {
        return { valid: false, error: 'Extras must be an array' };
      }
      return { valid: true };
    };

    it('should validate valid params', () => {
      const result = validateCheckoutParams({ gigId: 1, buyerId: 2 });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid gig ID', () => {
      const result = validateCheckoutParams({ gigId: 0, buyerId: 2 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('gig ID');
    });

    it('should reject invalid buyer ID', () => {
      const result = validateCheckoutParams({ gigId: 1, buyerId: 0 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('buyer ID');
    });

    it('should reject invalid package ID', () => {
      const result = validateCheckoutParams({ gigId: 1, buyerId: 2, packageId: -1 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('package ID');
    });

    it('should accept valid extras array', () => {
      const result = validateCheckoutParams({ gigId: 1, buyerId: 2, extras: [1, 2, 3] });
      expect(result.valid).toBe(true);
    });
  });

  describe('Stripe API Integration', () => {
    it('should create a product', async () => {
      const product = await stripe.products.create({
        name: 'Test Product - Payment Test',
        metadata: { test: 'true' },
      });

      expect(product.id).toBeDefined();
      expect(product.name).toBe('Test Product - Payment Test');

      // Cleanup
      await stripe.products.update(product.id, { active: false });
    });

    it('should create a price', async () => {
      const product = await stripe.products.create({
        name: 'Test Product for Price',
        metadata: { test: 'true' },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 5000,
        currency: 'eur',
      });

      expect(price.id).toBeDefined();
      expect(price.unit_amount).toBe(5000);
      expect(price.currency).toBe('eur');

      // Cleanup
      await stripe.products.update(product.id, { active: false });
    });

    it('should create a checkout session', async () => {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Test Gig',
              },
              unit_amount: 5000,
            },
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: {
          test: 'true',
        },
      });

      expect(session.id).toBeDefined();
      expect(session.id.startsWith('cs_test_')).toBe(true);
      expect(session.url).toBeDefined();
    });

    it('should create checkout with manual capture (escrow)', async () => {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        payment_intent_data: {
          capture_method: 'manual',
        },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Escrow Test',
              },
              unit_amount: 5000,
            },
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      expect(session.id).toBeDefined();
    });
  });

  describe('Payment Intent Handling', () => {
    it('should create a payment intent', async () => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: { test: 'true' },
      });

      expect(paymentIntent.id).toBeDefined();
      expect(paymentIntent.id.startsWith('pi_')).toBe(true);
      expect(paymentIntent.amount).toBe(5000);
      expect(paymentIntent.status).toBe('requires_payment_method');

      // Cleanup
      await stripe.paymentIntents.cancel(paymentIntent.id);
    });

    it('should create payment intent with manual capture', async () => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'eur',
        payment_method_types: ['card'],
        capture_method: 'manual',
      });

      expect(paymentIntent.capture_method).toBe('manual');

      // Cleanup
      await stripe.paymentIntents.cancel(paymentIntent.id);
    });
  });

  describe('Refund Handling', () => {
    it('should calculate full refund amount', () => {
      const calculateRefund = (amount: number, type: 'full' | 'partial', partialPercent?: number) => {
        if (type === 'full') return amount;
        return Math.round(amount * ((partialPercent || 50) / 100));
      };

      expect(calculateRefund(10000, 'full')).toBe(10000);
      expect(calculateRefund(10000, 'partial', 50)).toBe(5000);
      expect(calculateRefund(10000, 'partial', 25)).toBe(2500);
    });
  });

  describe('Currency Formatting', () => {
    const formatPrice = (cents: number, currency: string = 'EUR'): string => {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency,
      }).format(cents / 100);
    };

    it('should format EUR correctly', () => {
      expect(formatPrice(5000)).toMatch(/50,00/);
      expect(formatPrice(5000)).toMatch(/€/);
    });

    it('should handle cents', () => {
      expect(formatPrice(1999)).toMatch(/19,99/);
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toMatch(/0,00/);
    });

    it('should handle large amounts', () => {
      expect(formatPrice(25000)).toMatch(/250,00/);
    });
  });
});
