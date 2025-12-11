import { describe, it, expect } from 'vitest';

/**
 * Recommendation Engine Tests
 * 
 * Tests for gig recommendation algorithms:
 * - Similar gigs calculation
 * - Trending gigs
 * - Personalized recommendations
 */

describe('Recommendation Engine', () => {
  describe('Similarity Score Calculation', () => {
    const calculateSimilarityScore = (
      referenceGig: { category: string; price: number; tags?: string[] },
      candidateGig: { category: string; price: number; tags?: string[] }
    ): number => {
      let score = 0;

      // Category match (highest weight)
      if (referenceGig.category === candidateGig.category) {
        score += 100;
      }

      // Price range match (±30%)
      const priceMin = referenceGig.price * 0.7;
      const priceMax = referenceGig.price * 1.3;
      if (candidateGig.price >= priceMin && candidateGig.price <= priceMax) {
        score += 50;
      }

      // Tag overlap
      if (referenceGig.tags && candidateGig.tags) {
        const refTags = new Set(referenceGig.tags);
        const overlap = candidateGig.tags.filter(t => refTags.has(t)).length;
        score += overlap * 10;
      }

      return score;
    };

    it('should give highest score for same category', () => {
      const ref = { category: 'Design', price: 5000 };
      const same = { category: 'Design', price: 5000 };
      const diff = { category: 'Marketing', price: 5000 };

      expect(calculateSimilarityScore(ref, same)).toBeGreaterThan(
        calculateSimilarityScore(ref, diff)
      );
    });

    it('should give bonus for similar price', () => {
      const ref = { category: 'Design', price: 5000 };
      const similarPrice = { category: 'Marketing', price: 5500 };
      const differentPrice = { category: 'Marketing', price: 15000 };

      expect(calculateSimilarityScore(ref, similarPrice)).toBeGreaterThan(
        calculateSimilarityScore(ref, differentPrice)
      );
    });

    it('should give bonus for tag overlap', () => {
      const ref = { category: 'Design', price: 5000, tags: ['logo', 'branding', 'modern'] };
      const withTags = { category: 'Design', price: 5000, tags: ['logo', 'branding'] };
      const noTags = { category: 'Design', price: 5000, tags: [] };

      expect(calculateSimilarityScore(ref, withTags)).toBeGreaterThan(
        calculateSimilarityScore(ref, noTags)
      );
    });

    it('should calculate max score for perfect match', () => {
      const ref = { category: 'Design', price: 5000, tags: ['logo', 'branding'] };
      const perfect = { category: 'Design', price: 5000, tags: ['logo', 'branding'] };

      const score = calculateSimilarityScore(ref, perfect);
      expect(score).toBe(170); // 100 (category) + 50 (price) + 20 (2 tags)
    });

    it('should handle missing tags', () => {
      const ref = { category: 'Design', price: 5000 };
      const candidate = { category: 'Design', price: 5000 };

      const score = calculateSimilarityScore(ref, candidate);
      expect(score).toBe(150); // 100 (category) + 50 (price)
    });
  });

  describe('Trending Score Calculation', () => {
    const calculateTrendingScore = (gig: {
      views: number;
      orders: number;
      favorites: number;
      createdAt: Date;
    }): number => {
      const now = new Date();
      const ageInDays = (now.getTime() - gig.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      
      // Recency factor (newer = higher)
      const recencyFactor = Math.max(0, 1 - ageInDays / 30);
      
      // Engagement score
      const engagementScore = gig.views * 0.1 + gig.orders * 10 + gig.favorites * 2;
      
      return Math.round(engagementScore * (0.5 + recencyFactor * 0.5));
    };

    it('should favor newer gigs', () => {
      const now = new Date();
      const newGig = {
        views: 100,
        orders: 5,
        favorites: 10,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      };
      const oldGig = {
        views: 100,
        orders: 5,
        favorites: 10,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
      };

      expect(calculateTrendingScore(newGig)).toBeGreaterThan(
        calculateTrendingScore(oldGig)
      );
    });

    it('should favor gigs with more orders', () => {
      const now = new Date();
      const manyOrders = {
        views: 100,
        orders: 20,
        favorites: 10,
        createdAt: now,
      };
      const fewOrders = {
        views: 100,
        orders: 2,
        favorites: 10,
        createdAt: now,
      };

      expect(calculateTrendingScore(manyOrders)).toBeGreaterThan(
        calculateTrendingScore(fewOrders)
      );
    });

    it('should handle zero engagement', () => {
      const now = new Date();
      const noEngagement = {
        views: 0,
        orders: 0,
        favorites: 0,
        createdAt: now,
      };

      expect(calculateTrendingScore(noEngagement)).toBe(0);
    });
  });

  describe('Price Range Calculation', () => {
    const calculatePriceRange = (basePrice: number, tolerance: number = 0.3) => {
      return {
        min: Math.floor(basePrice * (1 - tolerance)),
        max: Math.ceil(basePrice * (1 + tolerance)),
      };
    };

    it('should calculate 30% range by default', () => {
      const range = calculatePriceRange(10000);
      expect(range.min).toBe(7000);
      expect(range.max).toBe(13000);
    });

    it('should respect custom tolerance', () => {
      const range = calculatePriceRange(10000, 0.5);
      expect(range.min).toBe(5000);
      expect(range.max).toBe(15000);
    });

    it('should handle small prices', () => {
      const range = calculatePriceRange(500);
      expect(range.min).toBe(350);
      expect(range.max).toBe(650);
    });
  });

  describe('Category Matching', () => {
    const CATEGORIES = [
      'Design & Kreatives',
      'Programmierung & IT',
      'Text & Übersetzung',
      'Marketing & Social Media',
      'Video & Animation',
      'Musik & Audio',
      'Business & Beratung',
      'Lifestyle & Freizeit',
    ];

    const getRelatedCategories = (category: string): string[] => {
      const relations: Record<string, string[]> = {
        'Design & Kreatives': ['Video & Animation', 'Marketing & Social Media'],
        'Programmierung & IT': ['Business & Beratung'],
        'Text & Übersetzung': ['Marketing & Social Media', 'Business & Beratung'],
        'Marketing & Social Media': ['Design & Kreatives', 'Text & Übersetzung'],
        'Video & Animation': ['Design & Kreatives', 'Musik & Audio'],
        'Musik & Audio': ['Video & Animation'],
        'Business & Beratung': ['Text & Übersetzung', 'Programmierung & IT'],
        'Lifestyle & Freizeit': [],
      };
      return relations[category] || [];
    };

    it('should return related categories', () => {
      const related = getRelatedCategories('Design & Kreatives');
      expect(related).toContain('Video & Animation');
      expect(related).toContain('Marketing & Social Media');
    });

    it('should handle categories with no relations', () => {
      const related = getRelatedCategories('Lifestyle & Freizeit');
      expect(related).toEqual([]);
    });

    it('should handle unknown categories', () => {
      const related = getRelatedCategories('Unknown Category');
      expect(related).toEqual([]);
    });
  });

  describe('Recommendation Sorting', () => {
    const sortByRelevance = <T extends { score: number; createdAt: Date }>(
      items: T[]
    ): T[] => {
      return [...items].sort((a, b) => {
        // Primary: score descending
        if (b.score !== a.score) return b.score - a.score;
        // Secondary: newer first
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    };

    it('should sort by score descending', () => {
      const items = [
        { score: 50, createdAt: new Date() },
        { score: 100, createdAt: new Date() },
        { score: 75, createdAt: new Date() },
      ];

      const sorted = sortByRelevance(items);
      expect(sorted[0].score).toBe(100);
      expect(sorted[1].score).toBe(75);
      expect(sorted[2].score).toBe(50);
    });

    it('should use date as tiebreaker', () => {
      const older = new Date('2024-01-01');
      const newer = new Date('2024-01-15');

      const items = [
        { score: 100, createdAt: older },
        { score: 100, createdAt: newer },
      ];

      const sorted = sortByRelevance(items);
      expect(sorted[0].createdAt).toEqual(newer);
    });
  });

  describe('Pagination', () => {
    const paginate = <T>(items: T[], page: number, limit: number): T[] => {
      const start = (page - 1) * limit;
      return items.slice(start, start + limit);
    };

    it('should return correct page', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      expect(paginate(items, 1, 3)).toEqual([1, 2, 3]);
      expect(paginate(items, 2, 3)).toEqual([4, 5, 6]);
      expect(paginate(items, 3, 3)).toEqual([7, 8, 9]);
      expect(paginate(items, 4, 3)).toEqual([10]);
    });

    it('should handle empty results', () => {
      const items: number[] = [];
      expect(paginate(items, 1, 10)).toEqual([]);
    });

    it('should handle page beyond results', () => {
      const items = [1, 2, 3];
      expect(paginate(items, 10, 10)).toEqual([]);
    });
  });
});
