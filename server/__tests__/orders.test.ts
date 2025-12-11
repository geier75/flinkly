import { describe, it, expect } from 'vitest';

/**
 * Orders Tests
 * 
 * Tests for order management logic
 */

describe('Orders', () => {
  describe('Order Status', () => {
    type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'revision' | 'completed' | 'cancelled' | 'disputed';

    const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in_progress', 'cancelled'],
      in_progress: ['delivered', 'cancelled'],
      delivered: ['revision', 'completed', 'disputed'],
      revision: ['in_progress'],
      completed: [],
      cancelled: [],
      disputed: ['completed', 'cancelled'],
    };

    const canTransition = (from: OrderStatus, to: OrderStatus): boolean => {
      return STATUS_FLOW[from].includes(to);
    };

    it('should allow pending -> accepted', () => {
      expect(canTransition('pending', 'accepted')).toBe(true);
    });

    it('should allow delivered -> completed', () => {
      expect(canTransition('delivered', 'completed')).toBe(true);
    });

    it('should not allow pending -> completed', () => {
      expect(canTransition('pending', 'completed')).toBe(false);
    });

    it('should not allow completed -> anything', () => {
      expect(canTransition('completed', 'cancelled')).toBe(false);
    });
  });

  describe('Order Timeline', () => {
    const calculateDeadline = (startDate: Date, deliveryDays: number): Date => {
      const deadline = new Date(startDate);
      deadline.setDate(deadline.getDate() + deliveryDays);
      return deadline;
    };

    const isOverdue = (deadline: Date): boolean => {
      return new Date() > deadline;
    };

    const getDaysRemaining = (deadline: Date): number => {
      const now = new Date();
      const diffMs = deadline.getTime() - now.getTime();
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    };

    it('should calculate deadline', () => {
      const start = new Date('2024-01-01');
      const deadline = calculateDeadline(start, 7);
      expect(deadline.getDate()).toBe(8);
    });

    it('should detect overdue orders', () => {
      const pastDeadline = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isOverdue(pastDeadline)).toBe(true);
    });

    it('should not mark future deadline as overdue', () => {
      const futureDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(isOverdue(futureDeadline)).toBe(false);
    });

    it('should calculate days remaining', () => {
      const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      expect(getDaysRemaining(deadline)).toBe(3);
    });
  });

  describe('Order Pricing', () => {
    const PLATFORM_FEE_PERCENT = 15;

    const calculateOrderTotal = (
      basePrice: number,
      extras: { price: number }[] = [],
      quantity: number = 1
    ) => {
      const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
      const subtotal = (basePrice + extrasTotal) * quantity;
      const platformFee = Math.round(subtotal * (PLATFORM_FEE_PERCENT / 100));
      const sellerEarnings = subtotal - platformFee;

      return {
        basePrice,
        extrasTotal,
        subtotal,
        platformFee,
        sellerEarnings,
        total: subtotal,
      };
    };

    it('should calculate simple order', () => {
      const result = calculateOrderTotal(5000);
      expect(result.subtotal).toBe(5000);
      expect(result.platformFee).toBe(750);
      expect(result.sellerEarnings).toBe(4250);
    });

    it('should include extras', () => {
      const result = calculateOrderTotal(5000, [{ price: 1000 }, { price: 500 }]);
      expect(result.extrasTotal).toBe(1500);
      expect(result.subtotal).toBe(6500);
    });

    it('should multiply by quantity', () => {
      const result = calculateOrderTotal(5000, [], 3);
      expect(result.subtotal).toBe(15000);
    });
  });

  describe('Revision Handling', () => {
    const MAX_REVISIONS = 3;

    const canRequestRevision = (
      revisionCount: number,
      maxRevisions: number = MAX_REVISIONS
    ): boolean => {
      return revisionCount < maxRevisions;
    };

    it('should allow first revision', () => {
      expect(canRequestRevision(0)).toBe(true);
    });

    it('should allow up to max revisions', () => {
      expect(canRequestRevision(2)).toBe(true);
    });

    it('should block after max revisions', () => {
      expect(canRequestRevision(3)).toBe(false);
    });
  });

  describe('Order Requirements', () => {
    const validateRequirements = (
      requirements: string,
      minLength: number = 50
    ): { valid: boolean; error?: string } => {
      if (!requirements || requirements.trim().length === 0) {
        return { valid: false, error: 'Anforderungen sind erforderlich' };
      }
      if (requirements.length < minLength) {
        return { valid: false, error: `Mindestens ${minLength} Zeichen erforderlich` };
      }
      return { valid: true };
    };

    it('should reject empty requirements', () => {
      expect(validateRequirements('').valid).toBe(false);
    });

    it('should reject short requirements', () => {
      expect(validateRequirements('Too short').valid).toBe(false);
    });

    it('should accept valid requirements', () => {
      const longReq = 'A'.repeat(50);
      expect(validateRequirements(longReq).valid).toBe(true);
    });
  });

  describe('Delivery Files', () => {
    const ALLOWED_FILE_TYPES = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf', 'application/zip',
      'video/mp4', 'audio/mp3',
    ];
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    const validateDeliveryFile = (file: { type: string; size: number }) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Dateityp nicht erlaubt' };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'Datei zu groß (max. 100MB)' };
      }
      return { valid: true };
    };

    it('should accept valid files', () => {
      expect(validateDeliveryFile({ type: 'application/pdf', size: 1024 }).valid).toBe(true);
      expect(validateDeliveryFile({ type: 'application/zip', size: 1024 }).valid).toBe(true);
    });

    it('should reject invalid types', () => {
      expect(validateDeliveryFile({ type: 'application/exe', size: 1024 }).valid).toBe(false);
    });

    it('should reject large files', () => {
      expect(validateDeliveryFile({ type: 'application/pdf', size: 200 * 1024 * 1024 }).valid).toBe(false);
    });
  });

  describe('Rating System', () => {
    const validateRating = (rating: number): boolean => {
      return rating >= 100 && rating <= 500 && Number.isInteger(rating);
    };

    const calculateAverageRating = (ratings: number[]): number => {
      if (ratings.length === 0) return 0;
      const sum = ratings.reduce((a, b) => a + b, 0);
      return Math.round(sum / ratings.length);
    };

    it('should validate rating range', () => {
      expect(validateRating(100)).toBe(true);
      expect(validateRating(500)).toBe(true);
      expect(validateRating(50)).toBe(false);
      expect(validateRating(600)).toBe(false);
    });

    it('should reject non-integer ratings', () => {
      expect(validateRating(4.5)).toBe(false);
    });

    it('should calculate average', () => {
      expect(calculateAverageRating([400, 500, 450])).toBe(450);
    });

    it('should handle empty ratings', () => {
      expect(calculateAverageRating([])).toBe(0);
    });
  });

  describe('Auto-Complete', () => {
    const AUTO_COMPLETE_DAYS = 3;

    const shouldAutoComplete = (deliveredAt: Date): boolean => {
      const daysSinceDelivery = (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceDelivery >= AUTO_COMPLETE_DAYS;
    };

    it('should not auto-complete recent delivery', () => {
      const recent = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      expect(shouldAutoComplete(recent)).toBe(false);
    });

    it('should auto-complete after 3 days', () => {
      const old = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      expect(shouldAutoComplete(old)).toBe(true);
    });
  });

  describe('Cancellation', () => {
    const CANCELLATION_REASONS = [
      'buyer_request',
      'seller_unavailable',
      'mutual_agreement',
      'order_mistake',
      'other',
    ];

    const canCancel = (
      status: string,
      isAdmin: boolean = false
    ): boolean => {
      const cancellableStatuses = ['pending', 'accepted'];
      if (isAdmin) {
        return !['completed', 'cancelled'].includes(status);
      }
      return cancellableStatuses.includes(status);
    };

    it('should allow cancelling pending orders', () => {
      expect(canCancel('pending')).toBe(true);
    });

    it('should not allow cancelling completed orders', () => {
      expect(canCancel('completed')).toBe(false);
    });

    it('should allow admin to cancel in_progress', () => {
      expect(canCancel('in_progress', true)).toBe(true);
    });

    it('should have all cancellation reasons', () => {
      expect(CANCELLATION_REASONS.length).toBe(5);
    });
  });

  describe('Order Search', () => {
    const searchOrders = (
      orders: { id: number; gigTitle: string; buyerName: string; status: string }[],
      query: string
    ) => {
      const lowerQuery = query.toLowerCase();
      return orders.filter(o =>
        o.id.toString().includes(query) ||
        o.gigTitle.toLowerCase().includes(lowerQuery) ||
        o.buyerName.toLowerCase().includes(lowerQuery)
      );
    };

    it('should search by ID', () => {
      const orders = [
        { id: 123, gigTitle: 'Logo', buyerName: 'Max', status: 'pending' },
        { id: 456, gigTitle: 'Website', buyerName: 'Anna', status: 'completed' },
      ];
      expect(searchOrders(orders, '123').length).toBe(1);
    });

    it('should search by title', () => {
      const orders = [
        { id: 1, gigTitle: 'Logo Design', buyerName: 'Max', status: 'pending' },
        { id: 2, gigTitle: 'Website', buyerName: 'Anna', status: 'completed' },
      ];
      expect(searchOrders(orders, 'logo').length).toBe(1);
    });
  });
});
