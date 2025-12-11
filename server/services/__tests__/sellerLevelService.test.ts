import { describe, it, expect } from 'vitest';
import { meetsLevelRequirements, calculateNextLevel } from '../sellerLevelService';

/**
 * Seller Level Service Tests
 * 
 * Tests the seller level calculation logic:
 * - New: 0-9 orders, any rating
 * - Rising: 10-49 orders, 4.5+ rating, 85%+ on-time
 * - Level One: 50-199 orders, 4.7+ rating, 90%+ on-time, <12h response
 * - Top Rated: 200+ orders, 4.9+ rating, 95%+ on-time, <6h response
 */

describe('Seller Level Service', () => {
  describe('meetsLevelRequirements', () => {
    describe('New Level', () => {
      it('should meet new level requirements with baseline stats', () => {
        const seller = {
          completedOrders: 0,
          averageRating: 0,
          responseTimeHours: 24, // Must be <= 24h for new level
          onTimeDeliveryRate: 0,
        };
        expect(meetsLevelRequirements(seller, 'new')).toBe(true);
      });

      it('should meet new level with good stats', () => {
        const seller = {
          completedOrders: 5,
          averageRating: 300,
          responseTimeHours: 12, // Must be <= 24h
          onTimeDeliveryRate: 50,
        };
        expect(meetsLevelRequirements(seller, 'new')).toBe(true);
      });

      it('should not meet new level with slow response time', () => {
        const seller = {
          completedOrders: 5,
          averageRating: 300,
          responseTimeHours: 48, // > 24h fails
          onTimeDeliveryRate: 50,
        };
        expect(meetsLevelRequirements(seller, 'new')).toBe(false);
      });
    });

    describe('Rising Level', () => {
      it('should meet rising level with minimum requirements', () => {
        const seller = {
          completedOrders: 10,
          averageRating: 450, // 4.5 stars
          responseTimeHours: 24,
          onTimeDeliveryRate: 85,
        };
        expect(meetsLevelRequirements(seller, 'rising')).toBe(true);
      });

      it('should not meet rising level with insufficient orders', () => {
        const seller = {
          completedOrders: 9,
          averageRating: 500,
          responseTimeHours: 12,
          onTimeDeliveryRate: 95,
        };
        expect(meetsLevelRequirements(seller, 'rising')).toBe(false);
      });

      it('should not meet rising level with low rating', () => {
        const seller = {
          completedOrders: 20,
          averageRating: 440, // 4.4 stars
          responseTimeHours: 12,
          onTimeDeliveryRate: 90,
        };
        expect(meetsLevelRequirements(seller, 'rising')).toBe(false);
      });

      it('should not meet rising level with low on-time rate', () => {
        const seller = {
          completedOrders: 20,
          averageRating: 480,
          responseTimeHours: 12,
          onTimeDeliveryRate: 80,
        };
        expect(meetsLevelRequirements(seller, 'rising')).toBe(false);
      });
    });

    describe('Level One', () => {
      it('should meet level one with minimum requirements', () => {
        const seller = {
          completedOrders: 50,
          averageRating: 470, // 4.7 stars
          responseTimeHours: 12,
          onTimeDeliveryRate: 90,
        };
        expect(meetsLevelRequirements(seller, 'level_one')).toBe(true);
      });

      it('should not meet level one with slow response time', () => {
        const seller = {
          completedOrders: 100,
          averageRating: 490,
          responseTimeHours: 13, // Too slow
          onTimeDeliveryRate: 95,
        };
        expect(meetsLevelRequirements(seller, 'level_one')).toBe(false);
      });

      it('should not meet level one with insufficient orders', () => {
        const seller = {
          completedOrders: 49,
          averageRating: 490,
          responseTimeHours: 6,
          onTimeDeliveryRate: 98,
        };
        expect(meetsLevelRequirements(seller, 'level_one')).toBe(false);
      });
    });

    describe('Top Rated Level', () => {
      it('should meet top rated with minimum requirements', () => {
        const seller = {
          completedOrders: 200,
          averageRating: 490, // 4.9 stars
          responseTimeHours: 6,
          onTimeDeliveryRate: 95,
        };
        expect(meetsLevelRequirements(seller, 'top_rated')).toBe(true);
      });

      it('should meet top rated with excellent stats', () => {
        const seller = {
          completedOrders: 500,
          averageRating: 500, // 5.0 stars
          responseTimeHours: 2,
          onTimeDeliveryRate: 99,
        };
        expect(meetsLevelRequirements(seller, 'top_rated')).toBe(true);
      });

      it('should not meet top rated with slow response', () => {
        const seller = {
          completedOrders: 300,
          averageRating: 495,
          responseTimeHours: 7, // Too slow
          onTimeDeliveryRate: 98,
        };
        expect(meetsLevelRequirements(seller, 'top_rated')).toBe(false);
      });

      it('should not meet top rated with low on-time rate', () => {
        const seller = {
          completedOrders: 250,
          averageRating: 495,
          responseTimeHours: 4,
          onTimeDeliveryRate: 94, // Too low
        };
        expect(meetsLevelRequirements(seller, 'top_rated')).toBe(false);
      });
    });
  });

  describe('calculateNextLevel', () => {
    it('should return null for top_rated sellers (max level)', () => {
      const seller = {
        completedOrders: 500,
        averageRating: 500,
        responseTimeHours: 2,
        onTimeDeliveryRate: 99,
      };
      expect(calculateNextLevel('top_rated', seller)).toBeNull();
    });

    it('should upgrade new seller to rising', () => {
      const seller = {
        completedOrders: 15,
        averageRating: 460,
        responseTimeHours: 20,
        onTimeDeliveryRate: 88,
      };
      expect(calculateNextLevel('new', seller)).toBe('rising');
    });

    it('should upgrade new seller directly to level_one if qualified', () => {
      const seller = {
        completedOrders: 60,
        averageRating: 480,
        responseTimeHours: 10,
        onTimeDeliveryRate: 92,
      };
      expect(calculateNextLevel('new', seller)).toBe('level_one');
    });

    it('should upgrade new seller directly to top_rated if qualified', () => {
      const seller = {
        completedOrders: 250,
        averageRating: 495,
        responseTimeHours: 4,
        onTimeDeliveryRate: 97,
      };
      expect(calculateNextLevel('new', seller)).toBe('top_rated');
    });

    it('should upgrade rising seller to level_one', () => {
      const seller = {
        completedOrders: 75,
        averageRating: 475,
        responseTimeHours: 10,
        onTimeDeliveryRate: 91,
      };
      expect(calculateNextLevel('rising', seller)).toBe('level_one');
    });

    it('should upgrade level_one seller to top_rated', () => {
      const seller = {
        completedOrders: 220,
        averageRating: 492,
        responseTimeHours: 5,
        onTimeDeliveryRate: 96,
      };
      expect(calculateNextLevel('level_one', seller)).toBe('top_rated');
    });

    it('should return null if seller does not qualify for upgrade', () => {
      const seller = {
        completedOrders: 8,
        averageRating: 400,
        responseTimeHours: 30,
        onTimeDeliveryRate: 70,
      };
      expect(calculateNextLevel('new', seller)).toBeNull();
    });

    it('should return null if rising seller does not qualify for level_one', () => {
      const seller = {
        completedOrders: 30,
        averageRating: 460,
        responseTimeHours: 20,
        onTimeDeliveryRate: 87,
      };
      expect(calculateNextLevel('rising', seller)).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero stats with valid response time', () => {
      const seller = {
        completedOrders: 0,
        averageRating: 0,
        responseTimeHours: 24, // Must be <= 24h
        onTimeDeliveryRate: 0,
      };
      expect(meetsLevelRequirements(seller, 'new')).toBe(true);
      expect(meetsLevelRequirements(seller, 'rising')).toBe(false);
    });

    it('should handle exact boundary values for rising', () => {
      const seller = {
        completedOrders: 10, // Exact minimum
        averageRating: 450, // Exact minimum
        responseTimeHours: 24, // Exact maximum
        onTimeDeliveryRate: 85, // Exact minimum
      };
      expect(meetsLevelRequirements(seller, 'rising')).toBe(true);
    });

    it('should handle exact boundary values for level_one', () => {
      const seller = {
        completedOrders: 50,
        averageRating: 470,
        responseTimeHours: 12,
        onTimeDeliveryRate: 90,
      };
      expect(meetsLevelRequirements(seller, 'level_one')).toBe(true);
    });

    it('should handle exact boundary values for top_rated', () => {
      const seller = {
        completedOrders: 200,
        averageRating: 490,
        responseTimeHours: 6,
        onTimeDeliveryRate: 95,
      };
      expect(meetsLevelRequirements(seller, 'top_rated')).toBe(true);
    });

    it('should handle very high stats', () => {
      const seller = {
        completedOrders: 10000,
        averageRating: 500,
        responseTimeHours: 1,
        onTimeDeliveryRate: 100,
      };
      expect(meetsLevelRequirements(seller, 'top_rated')).toBe(true);
      expect(calculateNextLevel('level_one', seller)).toBe('top_rated');
    });
  });
});
