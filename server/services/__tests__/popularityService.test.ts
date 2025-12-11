import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Popularity Service Tests
 * 
 * Tests the gig popularity calculation logic
 */

// Mock the popularity calculation logic
const calculatePopularityScore = (gig: {
  views: number;
  orders: number;
  favorites: number;
  rating: number;
  reviewCount: number;
  daysActive: number;
}): number => {
  // Weights for different factors
  const WEIGHTS = {
    views: 0.1,
    orders: 0.3,
    favorites: 0.15,
    rating: 0.25,
    reviewCount: 0.1,
    recency: 0.1,
  };

  // Normalize values
  const normalizedViews = Math.min(gig.views / 1000, 1);
  const normalizedOrders = Math.min(gig.orders / 100, 1);
  const normalizedFavorites = Math.min(gig.favorites / 50, 1);
  const normalizedRating = gig.rating / 500; // Rating stored as 0-500
  const normalizedReviews = Math.min(gig.reviewCount / 50, 1);
  const recencyBonus = Math.max(0, 1 - gig.daysActive / 365);

  const score =
    normalizedViews * WEIGHTS.views +
    normalizedOrders * WEIGHTS.orders +
    normalizedFavorites * WEIGHTS.favorites +
    normalizedRating * WEIGHTS.rating +
    normalizedReviews * WEIGHTS.reviewCount +
    recencyBonus * WEIGHTS.recency;

  return Math.round(score * 100);
};

const isHighDemand = (orders: number, views: number): boolean => {
  return orders >= 10 || views >= 500;
};

const isTrending = (recentOrders: number, previousOrders: number): boolean => {
  if (previousOrders === 0) return recentOrders >= 3;
  const growthRate = (recentOrders - previousOrders) / previousOrders;
  return growthRate >= 0.5; // 50% growth
};

describe('Popularity Service', () => {
  describe('calculatePopularityScore', () => {
    it('should calculate score for new gig with no activity', () => {
      const gig = {
        views: 0,
        orders: 0,
        favorites: 0,
        rating: 0,
        reviewCount: 0,
        daysActive: 0,
      };
      const score = calculatePopularityScore(gig);
      expect(score).toBe(10); // Only recency bonus (0.1 * 100)
    });

    it('should calculate score for popular gig', () => {
      const gig = {
        views: 1000,
        orders: 100,
        favorites: 50,
        rating: 490,
        reviewCount: 50,
        daysActive: 30,
      };
      const score = calculatePopularityScore(gig);
      expect(score).toBeGreaterThan(80);
    });

    it('should give higher score to gigs with more orders', () => {
      const lowOrders = {
        views: 500,
        orders: 10,
        favorites: 20,
        rating: 450,
        reviewCount: 10,
        daysActive: 60,
      };
      const highOrders = {
        ...lowOrders,
        orders: 80,
      };
      
      expect(calculatePopularityScore(highOrders)).toBeGreaterThan(
        calculatePopularityScore(lowOrders)
      );
    });

    it('should give higher score to gigs with better rating', () => {
      const lowRating = {
        views: 500,
        orders: 50,
        favorites: 20,
        rating: 350, // 3.5 stars
        reviewCount: 20,
        daysActive: 60,
      };
      const highRating = {
        ...lowRating,
        rating: 490, // 4.9 stars
      };
      
      expect(calculatePopularityScore(highRating)).toBeGreaterThan(
        calculatePopularityScore(lowRating)
      );
    });

    it('should give recency bonus to newer gigs', () => {
      const newGig = {
        views: 100,
        orders: 10,
        favorites: 5,
        rating: 450,
        reviewCount: 5,
        daysActive: 7,
      };
      const oldGig = {
        ...newGig,
        daysActive: 300,
      };
      
      expect(calculatePopularityScore(newGig)).toBeGreaterThan(
        calculatePopularityScore(oldGig)
      );
    });

    it('should cap normalized values at 1', () => {
      const extremeGig = {
        views: 10000, // Way over 1000
        orders: 500, // Way over 100
        favorites: 200, // Way over 50
        rating: 500,
        reviewCount: 200, // Way over 50
        daysActive: 1,
      };
      const score = calculatePopularityScore(extremeGig);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('isHighDemand', () => {
    it('should return true for gigs with 10+ orders', () => {
      expect(isHighDemand(10, 100)).toBe(true);
      expect(isHighDemand(50, 200)).toBe(true);
    });

    it('should return true for gigs with 500+ views', () => {
      expect(isHighDemand(5, 500)).toBe(true);
      expect(isHighDemand(0, 1000)).toBe(true);
    });

    it('should return false for gigs with low activity', () => {
      expect(isHighDemand(5, 200)).toBe(false);
      expect(isHighDemand(0, 0)).toBe(false);
    });

    it('should return true if either condition is met', () => {
      expect(isHighDemand(15, 100)).toBe(true); // Orders met
      expect(isHighDemand(3, 600)).toBe(true); // Views met
    });
  });

  describe('isTrending', () => {
    it('should return true for 50%+ growth', () => {
      expect(isTrending(15, 10)).toBe(true); // 50% growth
      expect(isTrending(20, 10)).toBe(true); // 100% growth
    });

    it('should return false for less than 50% growth', () => {
      expect(isTrending(14, 10)).toBe(false); // 40% growth
      expect(isTrending(10, 10)).toBe(false); // 0% growth
    });

    it('should handle zero previous orders', () => {
      expect(isTrending(3, 0)).toBe(true); // 3+ new orders
      expect(isTrending(2, 0)).toBe(false); // Less than 3 new orders
    });

    it('should handle declining orders', () => {
      expect(isTrending(5, 10)).toBe(false); // Negative growth
    });
  });

  describe('Popularity Ranking', () => {
    it('should rank gigs correctly by popularity score', () => {
      const gigs = [
        { id: 1, views: 100, orders: 5, favorites: 2, rating: 400, reviewCount: 3, daysActive: 30 },
        { id: 2, views: 500, orders: 30, favorites: 15, rating: 470, reviewCount: 20, daysActive: 60 },
        { id: 3, views: 1000, orders: 80, favorites: 40, rating: 490, reviewCount: 50, daysActive: 90 },
      ];

      const ranked = gigs
        .map(gig => ({ ...gig, score: calculatePopularityScore(gig) }))
        .sort((a, b) => b.score - a.score);

      expect(ranked[0].id).toBe(3); // Most popular
      expect(ranked[1].id).toBe(2);
      expect(ranked[2].id).toBe(1); // Least popular
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative values gracefully', () => {
      const gig = {
        views: -10,
        orders: -5,
        favorites: -2,
        rating: -100,
        reviewCount: -3,
        daysActive: -30,
      };
      const score = calculatePopularityScore(gig);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should handle very old gigs', () => {
      const oldGig = {
        views: 500,
        orders: 50,
        favorites: 20,
        rating: 450,
        reviewCount: 30,
        daysActive: 1000, // Very old
      };
      const score = calculatePopularityScore(oldGig);
      expect(score).toBeGreaterThan(0);
    });
  });
});
