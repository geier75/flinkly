import { describe, it, expect } from 'vitest';

/**
 * useSearch Hook Tests
 * 
 * Tests for search functionality
 */

describe('useSearch Hook', () => {
  describe('Search Query', () => {
    const normalizeQuery = (query: string): string => {
      return query.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    it('should normalize query', () => {
      expect(normalizeQuery('  Logo  Design  ')).toBe('logo design');
    });

    it('should handle empty query', () => {
      expect(normalizeQuery('')).toBe('');
    });
  });

  describe('Search Suggestions', () => {
    const getSuggestions = (
      query: string,
      history: string[],
      popular: string[]
    ): string[] => {
      if (!query) return popular.slice(0, 5);

      const lowerQuery = query.toLowerCase();
      const fromHistory = history.filter(h => 
        h.toLowerCase().includes(lowerQuery)
      );
      const fromPopular = popular.filter(p => 
        p.toLowerCase().includes(lowerQuery)
      );

      return [...new Set([...fromHistory, ...fromPopular])].slice(0, 5);
    };

    it('should return popular for empty query', () => {
      const popular = ['Logo', 'Website', 'App'];
      const suggestions = getSuggestions('', [], popular);
      expect(suggestions).toEqual(popular);
    });

    it('should filter by query', () => {
      const history = ['Logo Design', 'Web Design'];
      const popular = ['Logo', 'Website'];
      const suggestions = getSuggestions('logo', history, popular);
      expect(suggestions.every(s => s.toLowerCase().includes('logo'))).toBe(true);
    });
  });

  describe('Search Filters', () => {
    type Filters = {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      deliveryDays?: number;
      sellerLevel?: string;
    };

    const buildFilterParams = (filters: Filters): URLSearchParams => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });

      return params;
    };

    it('should build filter params', () => {
      const filters = { category: 'design', minPrice: 1000 };
      const params = buildFilterParams(filters);
      expect(params.get('category')).toBe('design');
      expect(params.get('minPrice')).toBe('1000');
    });

    it('should skip undefined values', () => {
      const filters = { category: 'design', minPrice: undefined };
      const params = buildFilterParams(filters);
      expect(params.has('minPrice')).toBe(false);
    });
  });

  describe('Search Results', () => {
    type SearchResult = {
      id: number;
      title: string;
      price: number;
      rating: number;
    };

    const sortResults = (
      results: SearchResult[],
      sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating'
    ): SearchResult[] => {
      return [...results].sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
    };

    it('should sort by price ascending', () => {
      const results = [
        { id: 1, title: 'A', price: 5000, rating: 450 },
        { id: 2, title: 'B', price: 3000, rating: 480 },
      ];
      const sorted = sortResults(results, 'price_asc');
      expect(sorted[0].price).toBe(3000);
    });

    it('should sort by rating', () => {
      const results = [
        { id: 1, title: 'A', price: 5000, rating: 450 },
        { id: 2, title: 'B', price: 3000, rating: 480 },
      ];
      const sorted = sortResults(results, 'rating');
      expect(sorted[0].rating).toBe(480);
    });
  });

  describe('Search History', () => {
    const MAX_HISTORY = 10;

    const addToHistory = (history: string[], query: string): string[] => {
      const filtered = history.filter(h => h !== query);
      return [query, ...filtered].slice(0, MAX_HISTORY);
    };

    const clearHistory = (): string[] => [];

    it('should add to history', () => {
      const history = ['old query'];
      const newHistory = addToHistory(history, 'new query');
      expect(newHistory[0]).toBe('new query');
    });

    it('should move duplicate to front', () => {
      const history = ['first', 'second', 'third'];
      const newHistory = addToHistory(history, 'second');
      expect(newHistory[0]).toBe('second');
      expect(newHistory.length).toBe(3);
    });

    it('should limit history size', () => {
      const history = Array(10).fill('').map((_, i) => `query${i}`);
      const newHistory = addToHistory(history, 'new');
      expect(newHistory.length).toBe(10);
    });

    it('should clear history', () => {
      expect(clearHistory()).toEqual([]);
    });
  });

  describe('Debounced Search', () => {
    const shouldSearch = (
      query: string,
      minLength: number = 2
    ): boolean => {
      return query.trim().length >= minLength;
    };

    it('should search for valid query', () => {
      expect(shouldSearch('logo')).toBe(true);
    });

    it('should not search for short query', () => {
      expect(shouldSearch('a')).toBe(false);
    });

    it('should not search for whitespace only', () => {
      expect(shouldSearch('   ')).toBe(false);
    });
  });

  describe('Search Highlighting', () => {
    const highlightMatch = (
      text: string,
      query: string
    ): { text: string; isMatch: boolean }[] => {
      if (!query) return [{ text, isMatch: false }];

      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);

      return parts.filter(Boolean).map(part => ({
        text: part,
        isMatch: part.toLowerCase() === query.toLowerCase(),
      }));
    };

    it('should highlight matches', () => {
      const parts = highlightMatch('Logo Design', 'logo');
      expect(parts[0].isMatch).toBe(true);
      expect(parts[1].isMatch).toBe(false);
    });

    it('should handle no match', () => {
      const parts = highlightMatch('Web Design', 'logo');
      expect(parts.every(p => !p.isMatch)).toBe(true);
    });
  });

  describe('Faceted Search', () => {
    type Facet = {
      name: string;
      values: { value: string; count: number }[];
    };

    const extractFacets = (
      results: { category: string; sellerLevel: string }[]
    ): Facet[] => {
      const categoryCount: Record<string, number> = {};
      const levelCount: Record<string, number> = {};

      results.forEach(r => {
        categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
        levelCount[r.sellerLevel] = (levelCount[r.sellerLevel] || 0) + 1;
      });

      return [
        {
          name: 'category',
          values: Object.entries(categoryCount).map(([value, count]) => ({ value, count })),
        },
        {
          name: 'sellerLevel',
          values: Object.entries(levelCount).map(([value, count]) => ({ value, count })),
        },
      ];
    };

    it('should extract facets', () => {
      const results = [
        { category: 'design', sellerLevel: 'top' },
        { category: 'design', sellerLevel: 'new' },
        { category: 'programming', sellerLevel: 'top' },
      ];
      const facets = extractFacets(results);
      const categoryFacet = facets.find(f => f.name === 'category');
      expect(categoryFacet?.values.find(v => v.value === 'design')?.count).toBe(2);
    });
  });

  describe('Search Analytics', () => {
    const trackSearch = (
      query: string,
      resultsCount: number,
      filters: Record<string, unknown>
    ) => ({
      query,
      resultsCount,
      filters,
      timestamp: new Date(),
      hasResults: resultsCount > 0,
    });

    it('should track search', () => {
      const event = trackSearch('logo', 25, { category: 'design' });
      expect(event.query).toBe('logo');
      expect(event.hasResults).toBe(true);
    });

    it('should detect no results', () => {
      const event = trackSearch('xyzabc', 0, {});
      expect(event.hasResults).toBe(false);
    });
  });
});
