import { describe, it, expect } from 'vitest';

/**
 * Orders Router Tests
 * 
 * Tests for order management
 */

describe('Orders Router', () => {
  describe('Order Creation', () => {
    const createOrder = (data: {
      gigId: number;
      buyerId: number;
      sellerId: number;
      packageId?: number;
      amount: number;
      requirements?: string;
    }) => ({
      ...data,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should create order with required fields', () => {
      const order = createOrder({
        gigId: 1,
        buyerId: 2,
        sellerId: 3,
        amount: 5000,
      });
      expect(order.status).toBe('pending');
      expect(order.gigId).toBe(1);
    });

    it('should include optional package', () => {
      const order = createOrder({
        gigId: 1,
        buyerId: 2,
        sellerId: 3,
        packageId: 2,
        amount: 10000,
      });
      expect(order.packageId).toBe(2);
    });
  });

  describe('Order Status Transitions', () => {
    type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'revision' | 'completed' | 'cancelled' | 'disputed';

    const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
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
      return VALID_TRANSITIONS[from].includes(to);
    };

    it('should allow valid transitions', () => {
      expect(canTransition('pending', 'accepted')).toBe(true);
      expect(canTransition('accepted', 'in_progress')).toBe(true);
      expect(canTransition('delivered', 'completed')).toBe(true);
    });

    it('should reject invalid transitions', () => {
      expect(canTransition('pending', 'completed')).toBe(false);
      expect(canTransition('completed', 'pending')).toBe(false);
      expect(canTransition('cancelled', 'accepted')).toBe(false);
    });
  });

  describe('Order Timeline', () => {
    const calculateDeadline = (
      startDate: Date,
      deliveryDays: number
    ): Date => {
      const deadline = new Date(startDate);
      deadline.setDate(deadline.getDate() + deliveryDays);
      return deadline;
    };

    const getTimeRemaining = (deadline: Date): {
      days: number;
      hours: number;
      isOverdue: boolean;
    } => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const isOverdue = diff < 0;
      const absDiff = Math.abs(diff);
      
      return {
        days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        isOverdue,
      };
    };

    it('should calculate deadline', () => {
      const start = new Date('2024-01-01');
      const deadline = calculateDeadline(start, 7);
      expect(deadline.getDate()).toBe(8);
    });

    it('should detect overdue orders', () => {
      const pastDeadline = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const remaining = getTimeRemaining(pastDeadline);
      expect(remaining.isOverdue).toBe(true);
    });

    it('should calculate remaining time', () => {
      const futureDeadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const remaining = getTimeRemaining(futureDeadline);
      expect(remaining.isOverdue).toBe(false);
      expect(remaining.days).toBeGreaterThanOrEqual(1);
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

    const createRevisionRequest = (
      orderId: number,
      message: string
    ) => ({
      orderId,
      message,
      createdAt: new Date(),
      status: 'pending' as const,
    });

    it('should allow revision within limit', () => {
      expect(canRequestRevision(0)).toBe(true);
      expect(canRequestRevision(2)).toBe(true);
    });

    it('should block revision at limit', () => {
      expect(canRequestRevision(3)).toBe(false);
    });

    it('should create revision request', () => {
      const request = createRevisionRequest(1, 'Please change the color');
      expect(request.status).toBe('pending');
      expect(request.message).toContain('color');
    });
  });

  describe('Delivery', () => {
    const createDelivery = (
      orderId: number,
      message: string,
      files: { name: string; url: string; size: number }[]
    ) => ({
      orderId,
      message,
      files,
      createdAt: new Date(),
    });

    const validateDeliveryFiles = (
      files: { size: number; type: string }[],
      maxSize: number = 100 * 1024 * 1024
    ): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (files.length === 0) {
        errors.push('Mindestens eine Datei erforderlich');
      }
      
      files.forEach((file, i) => {
        if (file.size > maxSize) {
          errors.push(`Datei ${i + 1} ist zu groß`);
        }
      });

      return { valid: errors.length === 0, errors };
    };

    it('should create delivery', () => {
      const delivery = createDelivery(1, 'Here is your logo', [
        { name: 'logo.png', url: '/files/logo.png', size: 1024 },
      ]);
      expect(delivery.files.length).toBe(1);
    });

    it('should validate delivery files', () => {
      expect(validateDeliveryFiles([]).valid).toBe(false);
      expect(validateDeliveryFiles([{ size: 1024, type: 'image/png' }]).valid).toBe(true);
    });
  });

  describe('Order Completion', () => {
    const AUTO_COMPLETE_DAYS = 3;

    const shouldAutoComplete = (deliveredAt: Date): boolean => {
      const daysSinceDelivery = (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceDelivery >= AUTO_COMPLETE_DAYS;
    };

    const completeOrder = (order: { id: number; amount: number }) => ({
      orderId: order.id,
      completedAt: new Date(),
      sellerEarnings: Math.round(order.amount * 0.85),
      platformFee: Math.round(order.amount * 0.15),
    });

    it('should not auto-complete recent delivery', () => {
      const recent = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      expect(shouldAutoComplete(recent)).toBe(false);
    });

    it('should auto-complete after 3 days', () => {
      const old = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      expect(shouldAutoComplete(old)).toBe(true);
    });

    it('should calculate earnings on completion', () => {
      const result = completeOrder({ id: 1, amount: 10000 });
      expect(result.sellerEarnings).toBe(8500);
      expect(result.platformFee).toBe(1500);
    });
  });

  describe('Order Cancellation', () => {
    const CANCELLATION_REASONS = [
      'buyer_request',
      'seller_unavailable',
      'mutual_agreement',
      'order_mistake',
      'other',
    ] as const;

    const canCancel = (
      status: string,
      role: 'buyer' | 'seller' | 'admin'
    ): boolean => {
      const cancellableByBuyer = ['pending'];
      const cancellableBySeller = ['pending', 'accepted'];
      const cancellableByAdmin = ['pending', 'accepted', 'in_progress', 'delivered', 'disputed'];

      switch (role) {
        case 'buyer':
          return cancellableByBuyer.includes(status);
        case 'seller':
          return cancellableBySeller.includes(status);
        case 'admin':
          return cancellableByAdmin.includes(status);
        default:
          return false;
      }
    };

    it('should allow buyer to cancel pending', () => {
      expect(canCancel('pending', 'buyer')).toBe(true);
    });

    it('should not allow buyer to cancel in_progress', () => {
      expect(canCancel('in_progress', 'buyer')).toBe(false);
    });

    it('should allow admin to cancel most statuses', () => {
      expect(canCancel('in_progress', 'admin')).toBe(true);
      expect(canCancel('disputed', 'admin')).toBe(true);
    });

    it('should have all cancellation reasons', () => {
      expect(CANCELLATION_REASONS.length).toBe(5);
    });
  });

  describe('Order Rating', () => {
    const validateRating = (rating: number): boolean => {
      return rating >= 100 && rating <= 500 && Number.isInteger(rating);
    };

    const createReview = (
      orderId: number,
      rating: number,
      comment: string
    ) => ({
      orderId,
      rating,
      comment,
      createdAt: new Date(),
    });

    it('should validate rating range', () => {
      expect(validateRating(100)).toBe(true);
      expect(validateRating(500)).toBe(true);
      expect(validateRating(50)).toBe(false);
      expect(validateRating(600)).toBe(false);
    });

    it('should reject non-integer ratings', () => {
      expect(validateRating(4.5)).toBe(false);
    });

    it('should create review', () => {
      const review = createReview(1, 500, 'Excellent work!');
      expect(review.rating).toBe(500);
    });
  });

  describe('Order Search', () => {
    const searchOrders = (
      orders: { id: number; gigTitle: string; buyerName: string; status: string }[],
      query: string,
      status?: string
    ) => {
      const lowerQuery = query.toLowerCase();
      return orders.filter(o => {
        const matchesQuery = 
          o.id.toString().includes(query) ||
          o.gigTitle.toLowerCase().includes(lowerQuery) ||
          o.buyerName.toLowerCase().includes(lowerQuery);
        
        const matchesStatus = !status || o.status === status;
        
        return matchesQuery && matchesStatus;
      });
    };

    it('should search by order ID', () => {
      const orders = [
        { id: 123, gigTitle: 'Logo', buyerName: 'Max', status: 'pending' },
        { id: 456, gigTitle: 'Website', buyerName: 'Anna', status: 'completed' },
      ];
      expect(searchOrders(orders, '123').length).toBe(1);
    });

    it('should filter by status', () => {
      const orders = [
        { id: 1, gigTitle: 'Logo', buyerName: 'Max', status: 'pending' },
        { id: 2, gigTitle: 'Logo', buyerName: 'Anna', status: 'completed' },
      ];
      expect(searchOrders(orders, 'logo', 'pending').length).toBe(1);
    });
  });

  describe('Order Notifications', () => {
    type NotificationType = 
      | 'order_placed'
      | 'order_accepted'
      | 'order_delivered'
      | 'order_completed'
      | 'revision_requested'
      | 'order_cancelled';

    const getNotificationMessage = (type: NotificationType, orderTitle: string): string => {
      const messages: Record<NotificationType, string> = {
        order_placed: `Neue Bestellung für "${orderTitle}"`,
        order_accepted: `Bestellung "${orderTitle}" wurde angenommen`,
        order_delivered: `Lieferung für "${orderTitle}" erhalten`,
        order_completed: `Bestellung "${orderTitle}" abgeschlossen`,
        revision_requested: `Überarbeitung für "${orderTitle}" angefordert`,
        order_cancelled: `Bestellung "${orderTitle}" storniert`,
      };
      return messages[type];
    };

    it('should generate notification messages', () => {
      expect(getNotificationMessage('order_placed', 'Logo Design')).toContain('Neue Bestellung');
      expect(getNotificationMessage('order_completed', 'Logo Design')).toContain('abgeschlossen');
    });
  });
});
