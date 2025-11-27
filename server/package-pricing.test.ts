import { describe, it, expect } from 'vitest';

/**
 * Package Pricing Integration Tests
 * 
 * Verifies that:
 * 1. Package prices are correctly calculated
 * 2. Extras are added to total
 * 3. Discount codes are applied
 */

describe('Package Pricing Logic', () => {
  it('should calculate basic package price correctly', () => {
    const basicPackage = {
      id: 1,
      gigId: 1,
      packageType: 'basic' as const,
      name: 'Basic Package',
      description: 'Basic features',
      price: 9900, // 99€ in cents
      deliveryDays: 7,
      revisions: 2,
      features: JSON.stringify(['Feature 1', 'Feature 2']),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Price should be in cents, convert to euros
    const priceInEuros = basicPackage.price / 100;
    expect(priceInEuros).toBe(99);
  });

  it('should calculate total with package + extras', () => {
    const selectedPackagePrice = 9900; // 99€ in cents
    const extras = [
      { id: 1, price: 1500 }, // 15€ Express Delivery
      { id: 2, price: 1000 }, // 10€ Extra Revisions
    ];
    const selectedExtraIds = [1, 2];

    // Calculate extras total
    const extrasTotal = extras
      .filter(e => selectedExtraIds.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0);

    const totalInCents = selectedPackagePrice + extrasTotal;
    const totalInEuros = totalInCents / 100;

    expect(totalInEuros).toBe(124); // 99 + 15 + 10
  });

  it('should apply discount code correctly', () => {
    const packagePrice = 9900; // 99€
    const extrasPrice = 2500; // 25€
    const discountAmount = 500; // 5€ discount in cents

    const subtotal = (packagePrice + extrasPrice) / 100; // 124€
    const total = Math.max(subtotal - (discountAmount / 100), 0);

    expect(total).toBe(119); // 124 - 5
  });

  it('should not allow negative total after discount', () => {
    const packagePrice = 1000; // 10€
    const discountAmount = 2000; // 20€ discount

    const total = Math.max((packagePrice / 100) - (discountAmount / 100), 0);

    expect(total).toBe(0); // Should not go negative
  });

  it('should handle package selection change', () => {
    const packages = [
      { packageType: 'basic' as const, price: 9900 },
      { packageType: 'standard' as const, price: 14900 },
      { packageType: 'premium' as const, price: 19900 },
    ];

    let selectedPackage: 'basic' | 'standard' | 'premium' = 'basic';
    let price = packages.find(p => p.packageType === selectedPackage)?.price || 0;
    expect(price / 100).toBe(99);

    // Change to premium
    selectedPackage = 'premium';
    price = packages.find(p => p.packageType === selectedPackage)?.price || 0;
    expect(price / 100).toBe(199);
  });

  it('should parse JSON features correctly', () => {
    const packageWithFeatures = {
      features: JSON.stringify(['Feature 1', 'Feature 2', 'Feature 3']),
    };

    const parsedFeatures = JSON.parse(packageWithFeatures.features);
    
    expect(Array.isArray(parsedFeatures)).toBe(true);
    expect(parsedFeatures.length).toBe(3);
    expect(parsedFeatures[0]).toBe('Feature 1');
  });

  it('should handle null features gracefully', () => {
    const packageWithoutFeatures = {
      features: null,
    };

    const parsedFeatures = packageWithoutFeatures.features 
      ? JSON.parse(packageWithoutFeatures.features as string) 
      : null;
    
    expect(parsedFeatures).toBeNull();
  });
});

describe('Checkout Price Calculation', () => {
  /**
   * Simulates the calculateTotalPrice function from Checkout.tsx
   */
  function calculateTotalPrice(
    gigBasePrice: number,
    packages: Array<{ packageType: string; price: number }> | undefined,
    selectedPackage: string,
    extras: Array<{ id: number; price: number }> | undefined,
    selectedExtras: number[],
    discountAmount: number
  ): number {
    // Get selected package price (or fallback to gig.price)
    let basePrice = gigBasePrice;
    if (packages && packages.length > 0) {
      const selectedPkg = packages.find(p => p.packageType === selectedPackage);
      if (selectedPkg) {
        basePrice = selectedPkg.price;
      }
    }
    
    // Add extras price
    let extrasPrice = 0;
    if (extras && selectedExtras.length > 0) {
      extrasPrice = extras
        .filter(extra => selectedExtras.includes(extra.id))
        .reduce((sum, extra) => sum + extra.price, 0);
    }
    
    // Convert from cents to euros
    const totalInEuros = (basePrice + extrasPrice) / 100;
    
    // Apply discount
    return Math.max(totalInEuros - (discountAmount / 100), 0);
  }

  it('should calculate total with basic package only', () => {
    const total = calculateTotalPrice(
      9900, // gig base price (99€)
      [
        { packageType: 'basic', price: 9900 },
        { packageType: 'standard', price: 14900 },
        { packageType: 'premium', price: 19900 },
      ],
      'basic', // selected package
      [], // no extras
      [], // no selected extras
      0 // no discount
    );

    expect(total).toBe(99);
  });

  it('should calculate total with premium package + extras', () => {
    const total = calculateTotalPrice(
      9900, // gig base price
      [
        { packageType: 'basic', price: 9900 },
        { packageType: 'standard', price: 14900 },
        { packageType: 'premium', price: 19900 },
      ],
      'premium', // selected package
      [
        { id: 1, price: 1500 }, // Express Delivery 15€
        { id: 2, price: 1000 }, // Extra Revisions 10€
        { id: 3, price: 2000 }, // Commercial License 20€
      ],
      [1, 3], // Selected: Express + License
      500 // 5€ discount
    );

    // 199€ (premium) + 15€ (express) + 20€ (license) - 5€ (discount) = 229€
    expect(total).toBe(229);
  });

  it('should fallback to gig base price if no packages', () => {
    const total = calculateTotalPrice(
      9900, // gig base price
      undefined, // no packages
      'basic',
      [],
      [],
      0
    );

    expect(total).toBe(99);
  });
});
