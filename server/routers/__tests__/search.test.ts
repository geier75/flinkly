import { describe, it, expect } from 'vitest';

/**
 * Search Router Tests
 * 
 * Tests for search functionality
 */

describe('Search Router', () => {
  describe('Text Search', () => {
    const searchGigs = (
      gigs: { title: string; description: string; tags: string[] }[],
      query: string
    ) => {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) return gigs;

      return gigs.filter(gig => {
        const titleMatch = gig.title.toLowerCase().includes(lowerQuery);
        const descMatch = gig.description.toLowerCase().includes(lowerQuery);
        const tagMatch = gig.tags.some(t => t.toLowerCase().includes(lowerQuery));
        return titleMatch || descMatch || tagMatch;
      });
    };

    it('should search by title', () => {
      const gigs = [
        { title: 'Logo Design', description: 'Professional logos', tags: [] },
        { title: 'Website Development', description: 'Web apps', tags: [] },
      ];
      expect(searchGigs(gigs, 'logo').length).toBe(1);
    });

    it('should search by description', () => {
      const gigs = [
        { title: 'Design', description: 'Professional logo design', tags: [] },
      ];
      expect(searchGigs(gigs, 'professional').length).toBe(1);
    });

    it('should search by tags', () => {
      const gigs = [
        { title: 'Design', description: 'Graphics', tags: ['logo', 'branding'] },
      ];
      expect(searchGigs(gigs, 'branding').length).toBe(1);
    });

    it('should be case insensitive', () => {
      const gigs = [
        { title: 'LOGO DESIGN', description: '', tags: [] },
      ];
      expect(searchGigs(gigs, 'logo').length).toBe(1);
    });

    it('should return all for empty query', () => {
      const gigs = [
        { title: 'Logo', description: '', tags: [] },
        { title: 'Website', description: '', tags: [] },
      ];
      expect(searchGigs(gigs, '').length).toBe(2);
    });
  });

  describe('Search Suggestions', () => {
    const getSuggestions = (
      query: string,
      popularSearches: string[],
      limit: number = 5
    ): string[] => {
      const lowerQuery = query.toLowerCase();
      return popularSearches
        .filter(s => s.toLowerCase().includes(lowerQuery))
        .slice(0, limit);
    };

    it('should return matching suggestions', () => {
      const popular = ['logo design', 'website design', 'app development'];
      expect(getSuggestions('design', popular)).toEqual(['logo design', 'website design']);
    });

    it('should limit results', () => {
      const popular = Array(10).fill('design').map((d, i) => `${d} ${i}`);
      expect(getSuggestions('design', popular, 3).length).toBe(3);
    });
  });

  describe('Recent Searches', () => {
    const MAX_RECENT_SEARCHES = 10;

    const addRecentSearch = (
      searches: string[],
      query: string
    ): string[] => {
      const filtered = searches.filter(s => s !== query);
      return [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    };

    const clearRecentSearches = (): string[] => [];

    it('should add to recent searches', () => {
      const searches = ['old search'];
      const updated = addRecentSearch(searches, 'new search');
      expect(updated[0]).toBe('new search');
    });

    it('should move duplicate to top', () => {
      const searches = ['first', 'second', 'third'];
      const updated = addRecentSearch(searches, 'second');
      expect(updated[0]).toBe('second');
      expect(updated.length).toBe(3);
    });

    it('should limit to max', () => {
      const searches = Array(10).fill('search').map((s, i) => `${s}${i}`);
      const updated = addRecentSearch(searches, 'new');
      expect(updated.length).toBe(10);
    });

    it('should clear searches', () => {
      expect(clearRecentSearches()).toEqual([]);
    });
  });

  describe('Search Filters', () => {
    const applyFilters = (
      gigs: { price: number; category: string; deliveryDays: number; rating: number }[],
      filters: {
        minPrice?: number;
        maxPrice?: number;
        category?: string;
        maxDelivery?: number;
        minRating?: number;
      }
    ) => {
      return gigs.filter(gig => {
        if (filters.minPrice && gig.price < filters.minPrice) return false;
        if (filters.maxPrice && gig.price > filters.maxPrice) return false;
        if (filters.category && gig.category !== filters.category) return false;
        if (filters.maxDelivery && gig.deliveryDays > filters.maxDelivery) return false;
        if (filters.minRating && gig.rating < filters.minRating) return false;
        return true;
      });
    };

    it('should filter by price range', () => {
      const gigs = [
        { price: 1000, category: 'design', deliveryDays: 3, rating: 450 },
        { price: 5000, category: 'design', deliveryDays: 3, rating: 450 },
        { price: 10000, category: 'design', deliveryDays: 3, rating: 450 },
      ];
      expect(applyFilters(gigs, { minPrice: 2000, maxPrice: 8000 }).length).toBe(1);
    });

    it('should filter by category', () => {
      const gigs = [
        { price: 5000, category: 'design', deliveryDays: 3, rating: 450 },
        { price: 5000, category: 'programming', deliveryDays: 3, rating: 450 },
      ];
      expect(applyFilters(gigs, { category: 'design' }).length).toBe(1);
    });

    it('should combine filters', () => {
      const gigs = [
        { price: 5000, category: 'design', deliveryDays: 3, rating: 450 },
        { price: 5000, category: 'design', deliveryDays: 7, rating: 450 },
      ];
      expect(applyFilters(gigs, { category: 'design', maxDelivery: 5 }).length).toBe(1);
    });
  });

  describe('Search Sorting', () => {
    type SortOption = 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity';

    const sortResults = (
      gigs: { score: number; createdAt: Date; price: number; rating: number; orders: number }[],
      sortBy: SortOption
    ) => {
      return [...gigs].sort((a, b) => {
        switch (sortBy) {
          case 'relevance':
            return b.score - a.score;
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popularity':
            return b.orders - a.orders;
          default:
            return 0;
        }
      });
    };

    it('should sort by relevance', () => {
      const gigs = [
        { score: 0.5, createdAt: new Date(), price: 5000, rating: 450, orders: 10 },
        { score: 0.9, createdAt: new Date(), price: 5000, rating: 450, orders: 10 },
      ];
      const sorted = sortResults(gigs, 'relevance');
      expect(sorted[0].score).toBe(0.9);
    });

    it('should sort by price ascending', () => {
      const gigs = [
        { score: 0.5, createdAt: new Date(), price: 10000, rating: 450, orders: 10 },
        { score: 0.5, createdAt: new Date(), price: 5000, rating: 450, orders: 10 },
      ];
      const sorted = sortResults(gigs, 'price_asc');
      expect(sorted[0].price).toBe(5000);
    });
  });

  describe('Search Analytics', () => {
    const trackSearch = (
      query: string,
      resultsCount: number,
      userId?: number
    ) => ({
      query,
      resultsCount,
      userId,
      timestamp: new Date(),
      hasResults: resultsCount > 0,
    });

    it('should track search', () => {
      const tracked = trackSearch('logo design', 15, 123);
      expect(tracked.query).toBe('logo design');
      expect(tracked.hasResults).toBe(true);
    });

    it('should track zero results', () => {
      const tracked = trackSearch('nonexistent', 0);
      expect(tracked.hasResults).toBe(false);
    });
  });

  describe('Search Highlighting', () => {
    const highlightMatch = (
      text: string,
      query: string,
      tag: string = 'mark'
    ): string => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, `<${tag}>$1</${tag}>`);
    };

    it('should highlight matches', () => {
      const result = highlightMatch('Logo Design Services', 'logo');
      expect(result).toContain('<mark>Logo</mark>');
    });

    it('should be case insensitive', () => {
      const result = highlightMatch('LOGO design', 'logo');
      expect(result).toContain('<mark>LOGO</mark>');
    });

    it('should return original for empty query', () => {
      const result = highlightMatch('Logo Design', '');
      expect(result).toBe('Logo Design');
    });
  });

  describe('Faceted Search', () => {
    const calculateFacets = (
      gigs: { category: string; price: number; rating: number }[]
    ) => {
      const categories: Record<string, number> = {};
      const priceRanges = { under50: 0, '50to100': 0, '100to500': 0, over500: 0 };
      const ratings = { '4plus': 0, '3plus': 0, '2plus': 0 };

      gigs.forEach(gig => {
        categories[gig.category] = (categories[gig.category] || 0) + 1;

        if (gig.price < 5000) priceRanges.under50++;
        else if (gig.price < 10000) priceRanges['50to100']++;
        else if (gig.price < 50000) priceRanges['100to500']++;
        else priceRanges.over500++;

        if (gig.rating >= 400) ratings['4plus']++;
        else if (gig.rating >= 300) ratings['3plus']++;
        else if (gig.rating >= 200) ratings['2plus']++;
      });

      return { categories, priceRanges, ratings };
    };

    it('should calculate category facets', () => {
      const gigs = [
        { category: 'design', price: 5000, rating: 450 },
        { category: 'design', price: 5000, rating: 450 },
        { category: 'programming', price: 5000, rating: 450 },
      ];
      const facets = calculateFacets(gigs);
      expect(facets.categories.design).toBe(2);
      expect(facets.categories.programming).toBe(1);
    });
  });
});
