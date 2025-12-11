import { describe, it, expect } from 'vitest';

/**
 * Categories Router Tests
 * 
 * Tests for category management
 */

describe('Categories Router', () => {
  describe('Category Structure', () => {
    const CATEGORIES = [
      {
        id: 'design',
        name: 'Design & Kreatives',
        icon: '🎨',
        subcategories: [
          { id: 'logo', name: 'Logo Design' },
          { id: 'web', name: 'Web Design' },
          { id: 'illustration', name: 'Illustration' },
        ],
      },
      {
        id: 'programming',
        name: 'Programmierung & IT',
        icon: '💻',
        subcategories: [
          { id: 'web-dev', name: 'Webentwicklung' },
          { id: 'mobile', name: 'Mobile Apps' },
          { id: 'backend', name: 'Backend' },
        ],
      },
    ];

    const getCategoryById = (id: string) => {
      return CATEGORIES.find(c => c.id === id);
    };

    const getSubcategory = (categoryId: string, subcategoryId: string) => {
      const category = getCategoryById(categoryId);
      return category?.subcategories.find(s => s.id === subcategoryId);
    };

    it('should find category by id', () => {
      const category = getCategoryById('design');
      expect(category?.name).toBe('Design & Kreatives');
    });

    it('should find subcategory', () => {
      const sub = getSubcategory('design', 'logo');
      expect(sub?.name).toBe('Logo Design');
    });

    it('should return undefined for unknown category', () => {
      expect(getCategoryById('unknown')).toBeUndefined();
    });
  });

  describe('Category Filtering', () => {
    const filterCategories = (
      categories: { id: string; name: string; gigCount: number }[],
      minGigs: number
    ) => {
      return categories.filter(c => c.gigCount >= minGigs);
    };

    it('should filter by minimum gig count', () => {
      const categories = [
        { id: '1', name: 'Design', gigCount: 100 },
        { id: '2', name: 'Writing', gigCount: 5 },
        { id: '3', name: 'Video', gigCount: 50 },
      ];
      const filtered = filterCategories(categories, 10);
      expect(filtered.length).toBe(2);
    });
  });

  describe('Category Sorting', () => {
    const sortCategories = (
      categories: { name: string; gigCount: number; order: number }[],
      sortBy: 'name' | 'popularity' | 'order'
    ) => {
      return [...categories].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'popularity':
            return b.gigCount - a.gigCount;
          case 'order':
            return a.order - b.order;
          default:
            return 0;
        }
      });
    };

    it('should sort by name', () => {
      const categories = [
        { name: 'Video', gigCount: 50, order: 2 },
        { name: 'Design', gigCount: 100, order: 1 },
      ];
      const sorted = sortCategories(categories, 'name');
      expect(sorted[0].name).toBe('Design');
    });

    it('should sort by popularity', () => {
      const categories = [
        { name: 'Video', gigCount: 50, order: 2 },
        { name: 'Design', gigCount: 100, order: 1 },
      ];
      const sorted = sortCategories(categories, 'popularity');
      expect(sorted[0].gigCount).toBe(100);
    });
  });

  describe('Category Breadcrumbs', () => {
    const generateBreadcrumbs = (
      categoryId: string,
      subcategoryId?: string
    ): { label: string; path: string }[] => {
      const crumbs = [{ label: 'Startseite', path: '/' }];
      
      if (categoryId) {
        crumbs.push({ label: categoryId, path: `/categories/${categoryId}` });
      }
      
      if (subcategoryId) {
        crumbs.push({ 
          label: subcategoryId, 
          path: `/categories/${categoryId}/${subcategoryId}` 
        });
      }
      
      return crumbs;
    };

    it('should generate category breadcrumbs', () => {
      const crumbs = generateBreadcrumbs('design');
      expect(crumbs.length).toBe(2);
    });

    it('should include subcategory', () => {
      const crumbs = generateBreadcrumbs('design', 'logo');
      expect(crumbs.length).toBe(3);
    });
  });

  describe('Category Stats', () => {
    const calculateCategoryStats = (
      gigs: { categoryId: string; price: number; rating: number }[]
    ) => {
      if (gigs.length === 0) {
        return { count: 0, avgPrice: 0, avgRating: 0 };
      }

      const totalPrice = gigs.reduce((sum, g) => sum + g.price, 0);
      const totalRating = gigs.reduce((sum, g) => sum + g.rating, 0);

      return {
        count: gigs.length,
        avgPrice: Math.round(totalPrice / gigs.length),
        avgRating: Math.round(totalRating / gigs.length),
      };
    };

    it('should calculate stats', () => {
      const gigs = [
        { categoryId: 'design', price: 5000, rating: 450 },
        { categoryId: 'design', price: 3000, rating: 500 },
      ];
      const stats = calculateCategoryStats(gigs);
      expect(stats.count).toBe(2);
      expect(stats.avgPrice).toBe(4000);
    });

    it('should handle empty array', () => {
      const stats = calculateCategoryStats([]);
      expect(stats.count).toBe(0);
    });
  });

  describe('Featured Categories', () => {
    const getFeaturedCategories = (
      categories: { id: string; isFeatured: boolean; order: number }[],
      limit: number = 6
    ) => {
      return categories
        .filter(c => c.isFeatured)
        .sort((a, b) => a.order - b.order)
        .slice(0, limit);
    };

    it('should return featured categories', () => {
      const categories = [
        { id: '1', isFeatured: true, order: 2 },
        { id: '2', isFeatured: false, order: 1 },
        { id: '3', isFeatured: true, order: 1 },
      ];
      const featured = getFeaturedCategories(categories);
      expect(featured.length).toBe(2);
      expect(featured[0].id).toBe('3');
    });
  });

  describe('Category Search', () => {
    const searchCategories = (
      categories: { id: string; name: string; keywords: string[] }[],
      query: string
    ) => {
      const lowerQuery = query.toLowerCase();
      return categories.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      );
    };

    it('should find by name', () => {
      const categories = [
        { id: '1', name: 'Logo Design', keywords: ['branding'] },
        { id: '2', name: 'Web Development', keywords: ['coding'] },
      ];
      const results = searchCategories(categories, 'logo');
      expect(results.length).toBe(1);
    });

    it('should find by keyword', () => {
      const categories = [
        { id: '1', name: 'Logo Design', keywords: ['branding', 'identity'] },
      ];
      const results = searchCategories(categories, 'branding');
      expect(results.length).toBe(1);
    });
  });

  describe('Category URL Generation', () => {
    const generateCategoryUrl = (
      categorySlug: string,
      subcategorySlug?: string,
      filters?: Record<string, string>
    ): string => {
      let url = `/categories/${categorySlug}`;
      
      if (subcategorySlug) {
        url += `/${subcategorySlug}`;
      }
      
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams(filters);
        url += `?${params.toString()}`;
      }
      
      return url;
    };

    it('should generate category URL', () => {
      expect(generateCategoryUrl('design')).toBe('/categories/design');
    });

    it('should include subcategory', () => {
      expect(generateCategoryUrl('design', 'logo')).toBe('/categories/design/logo');
    });

    it('should include filters', () => {
      const url = generateCategoryUrl('design', undefined, { sort: 'price' });
      expect(url).toContain('sort=price');
    });
  });

  describe('Category Validation', () => {
    const VALID_CATEGORIES = ['design', 'programming', 'writing', 'video'];

    const validateCategory = (categoryId: string): boolean => {
      return VALID_CATEGORIES.includes(categoryId);
    };

    const validateSubcategory = (
      categoryId: string,
      subcategoryId: string,
      subcategories: Record<string, string[]>
    ): boolean => {
      const validSubs = subcategories[categoryId];
      return validSubs?.includes(subcategoryId) ?? false;
    };

    it('should validate valid category', () => {
      expect(validateCategory('design')).toBe(true);
    });

    it('should reject invalid category', () => {
      expect(validateCategory('invalid')).toBe(false);
    });

    it('should validate subcategory', () => {
      const subs = { design: ['logo', 'web'] };
      expect(validateSubcategory('design', 'logo', subs)).toBe(true);
      expect(validateSubcategory('design', 'invalid', subs)).toBe(false);
    });
  });
});
