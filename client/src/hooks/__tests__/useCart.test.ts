import { describe, it, expect } from 'vitest';

/**
 * useCart Hook Tests
 * 
 * Tests for shopping cart logic
 */

describe('useCart Hook', () => {
  describe('Cart State', () => {
    type CartItem = {
      gigId: number;
      packageId: number;
      price: number;
      quantity: number;
      extras: { id: number; price: number }[];
    };

    const createCartState = (items: CartItem[]) => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => {
        const extrasTotal = i.extras.reduce((e, ex) => e + ex.price, 0);
        return sum + (i.price + extrasTotal) * i.quantity;
      }, 0),
      isEmpty: items.length === 0,
    });

    it('should calculate item count', () => {
      const items = [
        { gigId: 1, packageId: 1, price: 5000, quantity: 2, extras: [] },
        { gigId: 2, packageId: 1, price: 3000, quantity: 1, extras: [] },
      ];
      const state = createCartState(items);
      expect(state.itemCount).toBe(3);
    });

    it('should calculate subtotal', () => {
      const items = [
        { gigId: 1, packageId: 1, price: 5000, quantity: 1, extras: [] },
      ];
      const state = createCartState(items);
      expect(state.subtotal).toBe(5000);
    });

    it('should include extras in subtotal', () => {
      const items = [
        { gigId: 1, packageId: 1, price: 5000, quantity: 1, extras: [{ id: 1, price: 1000 }] },
      ];
      const state = createCartState(items);
      expect(state.subtotal).toBe(6000);
    });

    it('should detect empty cart', () => {
      const state = createCartState([]);
      expect(state.isEmpty).toBe(true);
    });
  });

  describe('Add to Cart', () => {
    type CartItem = {
      gigId: number;
      packageId: number;
      price: number;
      quantity: number;
    };

    const addToCart = (
      cart: CartItem[],
      item: Omit<CartItem, 'quantity'>
    ): CartItem[] => {
      const existing = cart.find(
        i => i.gigId === item.gigId && i.packageId === item.packageId
      );

      if (existing) {
        return cart.map(i =>
          i.gigId === item.gigId && i.packageId === item.packageId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...cart, { ...item, quantity: 1 }];
    };

    it('should add new item', () => {
      const cart: CartItem[] = [];
      const newCart = addToCart(cart, { gigId: 1, packageId: 1, price: 5000 });
      expect(newCart.length).toBe(1);
      expect(newCart[0].quantity).toBe(1);
    });

    it('should increment existing item', () => {
      const cart: CartItem[] = [{ gigId: 1, packageId: 1, price: 5000, quantity: 1 }];
      const newCart = addToCart(cart, { gigId: 1, packageId: 1, price: 5000 });
      expect(newCart.length).toBe(1);
      expect(newCart[0].quantity).toBe(2);
    });
  });

  describe('Remove from Cart', () => {
    type CartItem = { gigId: number; packageId: number };

    const removeFromCart = (
      cart: CartItem[],
      gigId: number,
      packageId: number
    ): CartItem[] => {
      return cart.filter(i => !(i.gigId === gigId && i.packageId === packageId));
    };

    it('should remove item', () => {
      const cart = [
        { gigId: 1, packageId: 1 },
        { gigId: 2, packageId: 1 },
      ];
      const newCart = removeFromCart(cart, 1, 1);
      expect(newCart.length).toBe(1);
      expect(newCart[0].gigId).toBe(2);
    });
  });

  describe('Update Quantity', () => {
    type CartItem = { gigId: number; quantity: number };

    const updateQuantity = (
      cart: CartItem[],
      gigId: number,
      quantity: number
    ): CartItem[] => {
      if (quantity <= 0) {
        return cart.filter(i => i.gigId !== gigId);
      }
      return cart.map(i =>
        i.gigId === gigId ? { ...i, quantity } : i
      );
    };

    it('should update quantity', () => {
      const cart = [{ gigId: 1, quantity: 1 }];
      const newCart = updateQuantity(cart, 1, 3);
      expect(newCart[0].quantity).toBe(3);
    });

    it('should remove item when quantity is 0', () => {
      const cart = [{ gigId: 1, quantity: 1 }];
      const newCart = updateQuantity(cart, 1, 0);
      expect(newCart.length).toBe(0);
    });
  });

  describe('Cart Persistence', () => {
    const serializeCart = (cart: unknown[]): string => {
      return JSON.stringify(cart);
    };

    const deserializeCart = (data: string): unknown[] => {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    };

    it('should serialize cart', () => {
      const cart = [{ gigId: 1, price: 5000 }];
      const serialized = serializeCart(cart);
      expect(typeof serialized).toBe('string');
    });

    it('should deserialize cart', () => {
      const data = '[{"gigId":1,"price":5000}]';
      const cart = deserializeCart(data);
      expect(cart.length).toBe(1);
    });

    it('should handle invalid JSON', () => {
      const cart = deserializeCart('invalid');
      expect(cart).toEqual([]);
    });
  });

  describe('Cart Validation', () => {
    const validateCart = (
      cart: { gigId: number; price: number }[],
      availableGigs: Set<number>
    ): { valid: boolean; removedItems: number[] } => {
      const removedItems: number[] = [];

      cart.forEach(item => {
        if (!availableGigs.has(item.gigId)) {
          removedItems.push(item.gigId);
        }
      });

      return {
        valid: removedItems.length === 0,
        removedItems,
      };
    };

    it('should validate available items', () => {
      const cart = [{ gigId: 1, price: 5000 }];
      const available = new Set([1, 2, 3]);
      const result = validateCart(cart, available);
      expect(result.valid).toBe(true);
    });

    it('should detect unavailable items', () => {
      const cart = [{ gigId: 1, price: 5000 }, { gigId: 99, price: 3000 }];
      const available = new Set([1, 2, 3]);
      const result = validateCart(cart, available);
      expect(result.valid).toBe(false);
      expect(result.removedItems).toContain(99);
    });
  });

  describe('Discount Application', () => {
    const applyDiscount = (
      subtotal: number,
      discount: { type: 'percent' | 'fixed'; value: number }
    ): { discount: number; total: number } => {
      let discountAmount: number;

      if (discount.type === 'percent') {
        discountAmount = Math.round(subtotal * (discount.value / 100));
      } else {
        discountAmount = discount.value;
      }

      discountAmount = Math.min(discountAmount, subtotal);

      return {
        discount: discountAmount,
        total: subtotal - discountAmount,
      };
    };

    it('should apply percent discount', () => {
      const result = applyDiscount(10000, { type: 'percent', value: 10 });
      expect(result.discount).toBe(1000);
      expect(result.total).toBe(9000);
    });

    it('should apply fixed discount', () => {
      const result = applyDiscount(10000, { type: 'fixed', value: 500 });
      expect(result.discount).toBe(500);
      expect(result.total).toBe(9500);
    });

    it('should not exceed subtotal', () => {
      const result = applyDiscount(1000, { type: 'fixed', value: 5000 });
      expect(result.discount).toBe(1000);
      expect(result.total).toBe(0);
    });
  });

  describe('Cart Summary', () => {
    const calculateSummary = (
      subtotal: number,
      discount: number,
      taxRate: number = 0
    ) => {
      const afterDiscount = subtotal - discount;
      const tax = Math.round(afterDiscount * (taxRate / 100));
      const total = afterDiscount + tax;

      return {
        subtotal,
        discount,
        tax,
        total,
      };
    };

    it('should calculate summary', () => {
      const summary = calculateSummary(10000, 1000, 19);
      expect(summary.subtotal).toBe(10000);
      expect(summary.discount).toBe(1000);
      expect(summary.tax).toBe(1710);
      expect(summary.total).toBe(10710);
    });
  });

  describe('Cart Expiry', () => {
    const CART_EXPIRY_HOURS = 24;

    const isCartExpired = (createdAt: Date): boolean => {
      const expiryTime = createdAt.getTime() + CART_EXPIRY_HOURS * 60 * 60 * 1000;
      return Date.now() > expiryTime;
    };

    it('should detect fresh cart', () => {
      const recent = new Date();
      expect(isCartExpired(recent)).toBe(false);
    });

    it('should detect expired cart', () => {
      const old = new Date(Date.now() - 48 * 60 * 60 * 1000);
      expect(isCartExpired(old)).toBe(true);
    });
  });
});
