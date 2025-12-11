import { describe, it, expect } from 'vitest';

/**
 * Gigs Router Tests
 * 
 * Tests for gig listing and management
 */

describe('Gigs Router', () => {
  describe('Gig Listing', () => {
    const sortGigs = (
      gigs: { id: number; createdAt: Date; price: number; rating: number }[],
      sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating'
    ) => {
      return [...gigs].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
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

    it('should sort by newest', () => {
      const gigs = [
        { id: 1, createdAt: new Date('2024-01-01'), price: 5000, rating: 450 },
        { id: 2, createdAt: new Date('2024-01-15'), price: 3000, rating: 480 },
      ];
      const sorted = sortGigs(gigs, 'newest');
      expect(sorted[0].id).toBe(2);
    });

    it('should sort by price ascending', () => {
      const gigs = [
        { id: 1, createdAt: new Date(), price: 5000, rating: 450 },
        { id: 2, createdAt: new Date(), price: 3000, rating: 480 },
      ];
      const sorted = sortGigs(gigs, 'price_asc');
      expect(sorted[0].price).toBe(3000);
    });

    it('should sort by price descending', () => {
      const gigs = [
        { id: 1, createdAt: new Date(), price: 5000, rating: 450 },
        { id: 2, createdAt: new Date(), price: 3000, rating: 480 },
      ];
      const sorted = sortGigs(gigs, 'price_desc');
      expect(sorted[0].price).toBe(5000);
    });

    it('should sort by rating', () => {
      const gigs = [
        { id: 1, createdAt: new Date(), price: 5000, rating: 450 },
        { id: 2, createdAt: new Date(), price: 3000, rating: 480 },
      ];
      const sorted = sortGigs(gigs, 'rating');
      expect(sorted[0].rating).toBe(480);
    });
  });

  describe('Category Filtering', () => {
    const CATEGORIES = [
      'design',
      'programming',
      'writing',
      'video',
      'music',
      'marketing',
      'business',
    ];

    const filterByCategory = (
      gigs: { category: string }[],
      category: string
    ) => {
      return gigs.filter(g => g.category === category);
    };

    it('should filter by category', () => {
      const gigs = [
        { category: 'design' },
        { category: 'programming' },
        { category: 'design' },
      ];
      expect(filterByCategory(gigs, 'design').length).toBe(2);
    });

    it('should return empty for non-matching category', () => {
      const gigs = [{ category: 'design' }];
      expect(filterByCategory(gigs, 'music').length).toBe(0);
    });

    it('should have all categories defined', () => {
      expect(CATEGORIES.length).toBe(7);
    });
  });

  describe('Price Range Filtering', () => {
    const filterByPriceRange = (
      gigs: { price: number }[],
      minPrice?: number,
      maxPrice?: number
    ) => {
      return gigs.filter(g => {
        if (minPrice !== undefined && g.price < minPrice) return false;
        if (maxPrice !== undefined && g.price > maxPrice) return false;
        return true;
      });
    };

    it('should filter by minimum price', () => {
      const gigs = [{ price: 1000 }, { price: 5000 }, { price: 10000 }];
      expect(filterByPriceRange(gigs, 3000).length).toBe(2);
    });

    it('should filter by maximum price', () => {
      const gigs = [{ price: 1000 }, { price: 5000 }, { price: 10000 }];
      expect(filterByPriceRange(gigs, undefined, 6000).length).toBe(2);
    });

    it('should filter by price range', () => {
      const gigs = [{ price: 1000 }, { price: 5000 }, { price: 10000 }];
      expect(filterByPriceRange(gigs, 2000, 8000).length).toBe(1);
    });
  });

  describe('Delivery Time Filtering', () => {
    const filterByDeliveryTime = (
      gigs: { deliveryDays: number }[],
      maxDays: number
    ) => {
      return gigs.filter(g => g.deliveryDays <= maxDays);
    };

    it('should filter by delivery time', () => {
      const gigs = [
        { deliveryDays: 1 },
        { deliveryDays: 3 },
        { deliveryDays: 7 },
        { deliveryDays: 14 },
      ];
      expect(filterByDeliveryTime(gigs, 7).length).toBe(3);
    });
  });

  describe('Seller Level Filtering', () => {
    type SellerLevel = 'new' | 'level1' | 'level2' | 'top_rated';

    const filterBySellerLevel = (
      gigs: { sellerLevel: SellerLevel }[],
      minLevel: SellerLevel
    ) => {
      const levelOrder: Record<SellerLevel, number> = {
        new: 0,
        level1: 1,
        level2: 2,
        top_rated: 3,
      };
      const minLevelNum = levelOrder[minLevel];
      return gigs.filter(g => levelOrder[g.sellerLevel] >= minLevelNum);
    };

    it('should filter by minimum seller level', () => {
      const gigs = [
        { sellerLevel: 'new' as SellerLevel },
        { sellerLevel: 'level1' as SellerLevel },
        { sellerLevel: 'top_rated' as SellerLevel },
      ];
      expect(filterBySellerLevel(gigs, 'level1').length).toBe(2);
    });
  });

  describe('Search', () => {
    const searchGigs = (
      gigs: { title: string; description: string; tags: string[] }[],
      query: string
    ) => {
      const lowerQuery = query.toLowerCase();
      return gigs.filter(g => 
        g.title.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery) ||
        g.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
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
        { title: 'Development', description: 'Web apps', tags: [] },
      ];
      expect(searchGigs(gigs, 'logo').length).toBe(1);
    });

    it('should search by tags', () => {
      const gigs = [
        { title: 'Design', description: 'Graphics', tags: ['logo', 'branding'] },
        { title: 'Development', description: 'Code', tags: ['react', 'node'] },
      ];
      expect(searchGigs(gigs, 'react').length).toBe(1);
    });

    it('should be case insensitive', () => {
      const gigs = [
        { title: 'LOGO DESIGN', description: '', tags: [] },
      ];
      expect(searchGigs(gigs, 'logo').length).toBe(1);
    });
  });

  describe('Pagination', () => {
    const paginateGigs = (
      gigs: any[],
      page: number,
      limit: number
    ) => {
      const offset = (page - 1) * limit;
      return {
        items: gigs.slice(offset, offset + limit),
        total: gigs.length,
        page,
        limit,
        totalPages: Math.ceil(gigs.length / limit),
        hasNext: offset + limit < gigs.length,
        hasPrev: page > 1,
      };
    };

    it('should paginate correctly', () => {
      const gigs = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const result = paginateGigs(gigs, 1, 10);
      expect(result.items.length).toBe(10);
      expect(result.totalPages).toBe(3);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(false);
    });

    it('should handle last page', () => {
      const gigs = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const result = paginateGigs(gigs, 3, 10);
      expect(result.items.length).toBe(5);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(true);
    });
  });

  describe('Gig Status', () => {
    type GigStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'rejected';

    const canPublish = (gig: {
      title: string;
      description: string;
      price: number;
      images: string[];
    }): { canPublish: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (!gig.title || gig.title.length < 10) {
        errors.push('Titel zu kurz');
      }
      if (!gig.description || gig.description.length < 100) {
        errors.push('Beschreibung zu kurz');
      }
      if (!gig.price || gig.price < 500) {
        errors.push('Preis zu niedrig');
      }
      if (!gig.images || gig.images.length === 0) {
        errors.push('Mindestens ein Bild erforderlich');
      }

      return { canPublish: errors.length === 0, errors };
    };

    it('should allow publishing valid gig', () => {
      const gig = {
        title: 'Professional Logo Design',
        description: 'A'.repeat(100),
        price: 5000,
        images: ['image1.jpg'],
      };
      expect(canPublish(gig).canPublish).toBe(true);
    });

    it('should reject incomplete gig', () => {
      const gig = {
        title: 'Short',
        description: 'Too short',
        price: 100,
        images: [],
      };
      const result = canPublish(gig);
      expect(result.canPublish).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Featured Gigs', () => {
    const getFeaturedGigs = (
      gigs: { id: number; isFeatured: boolean; rating: number }[],
      limit: number = 10
    ) => {
      return gigs
        .filter(g => g.isFeatured)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    };

    it('should return only featured gigs', () => {
      const gigs = [
        { id: 1, isFeatured: true, rating: 450 },
        { id: 2, isFeatured: false, rating: 500 },
        { id: 3, isFeatured: true, rating: 480 },
      ];
      const featured = getFeaturedGigs(gigs);
      expect(featured.length).toBe(2);
      expect(featured.every(g => g.isFeatured)).toBe(true);
    });

    it('should sort by rating', () => {
      const gigs = [
        { id: 1, isFeatured: true, rating: 450 },
        { id: 2, isFeatured: true, rating: 480 },
      ];
      const featured = getFeaturedGigs(gigs);
      expect(featured[0].rating).toBe(480);
    });
  });

  describe('Gig Statistics', () => {
    const calculateGigStats = (gig: {
      views: number;
      orders: number;
      reviews: { rating: number }[];
    }) => ({
      views: gig.views,
      orders: gig.orders,
      conversionRate: gig.views > 0 ? (gig.orders / gig.views) * 100 : 0,
      averageRating: gig.reviews.length > 0
        ? gig.reviews.reduce((sum, r) => sum + r.rating, 0) / gig.reviews.length
        : 0,
      reviewCount: gig.reviews.length,
    });

    it('should calculate conversion rate', () => {
      const stats = calculateGigStats({
        views: 100,
        orders: 5,
        reviews: [],
      });
      expect(stats.conversionRate).toBe(5);
    });

    it('should calculate average rating', () => {
      const stats = calculateGigStats({
        views: 100,
        orders: 5,
        reviews: [{ rating: 400 }, { rating: 500 }],
      });
      expect(stats.averageRating).toBe(450);
    });

    it('should handle zero views', () => {
      const stats = calculateGigStats({
        views: 0,
        orders: 0,
        reviews: [],
      });
      expect(stats.conversionRate).toBe(0);
    });
  });

  describe('Gig Packages', () => {
    type Package = {
      name: 'basic' | 'standard' | 'premium';
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };

    const validatePackages = (packages: Package[]): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (packages.length === 0) {
        errors.push('Mindestens ein Paket erforderlich');
      }

      const names = packages.map(p => p.name);
      if (new Set(names).size !== names.length) {
        errors.push('Doppelte Paketnamen');
      }

      packages.forEach((pkg, i) => {
        if (pkg.price < 500) {
          errors.push(`Paket ${i + 1}: Preis zu niedrig`);
        }
        if (pkg.deliveryDays < 1) {
          errors.push(`Paket ${i + 1}: Lieferzeit ungültig`);
        }
      });

      // Prices should be ascending
      for (let i = 1; i < packages.length; i++) {
        if (packages[i].price <= packages[i - 1].price) {
          errors.push('Preise müssen aufsteigend sein');
          break;
        }
      }

      return { valid: errors.length === 0, errors };
    };

    it('should validate valid packages', () => {
      const packages: Package[] = [
        { name: 'basic', price: 1000, deliveryDays: 7, revisions: 1, features: ['Logo'] },
        { name: 'standard', price: 2000, deliveryDays: 5, revisions: 2, features: ['Logo', 'Visitenkarte'] },
        { name: 'premium', price: 5000, deliveryDays: 3, revisions: 5, features: ['Logo', 'Visitenkarte', 'Briefpapier'] },
      ];
      expect(validatePackages(packages).valid).toBe(true);
    });

    it('should reject empty packages', () => {
      expect(validatePackages([]).valid).toBe(false);
    });

    it('should reject duplicate names', () => {
      const packages: Package[] = [
        { name: 'basic', price: 1000, deliveryDays: 7, revisions: 1, features: [] },
        { name: 'basic', price: 2000, deliveryDays: 5, revisions: 2, features: [] },
      ];
      expect(validatePackages(packages).valid).toBe(false);
    });

    it('should reject non-ascending prices', () => {
      const packages: Package[] = [
        { name: 'basic', price: 2000, deliveryDays: 7, revisions: 1, features: [] },
        { name: 'standard', price: 1000, deliveryDays: 5, revisions: 2, features: [] },
      ];
      expect(validatePackages(packages).valid).toBe(false);
    });
  });

  describe('Gig FAQ', () => {
    type FAQ = { question: string; answer: string };

    const validateFAQ = (faqs: FAQ[]): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (faqs.length > 10) {
        errors.push('Maximal 10 FAQs erlaubt');
      }

      faqs.forEach((faq, i) => {
        if (!faq.question.trim()) {
          errors.push(`FAQ ${i + 1}: Frage fehlt`);
        }
        if (!faq.answer.trim()) {
          errors.push(`FAQ ${i + 1}: Antwort fehlt`);
        }
        if (faq.question.length > 200) {
          errors.push(`FAQ ${i + 1}: Frage zu lang`);
        }
        if (faq.answer.length > 1000) {
          errors.push(`FAQ ${i + 1}: Antwort zu lang`);
        }
      });

      return { valid: errors.length === 0, errors };
    };

    it('should validate valid FAQs', () => {
      const faqs = [
        { question: 'Was ist enthalten?', answer: 'Alles was Sie brauchen.' },
      ];
      expect(validateFAQ(faqs).valid).toBe(true);
    });

    it('should reject too many FAQs', () => {
      const faqs = Array(11).fill({ question: 'Q?', answer: 'A.' });
      expect(validateFAQ(faqs).valid).toBe(false);
    });

    it('should reject empty questions', () => {
      const faqs = [{ question: '', answer: 'Answer' }];
      expect(validateFAQ(faqs).valid).toBe(false);
    });
  });

  describe('Gig Requirements', () => {
    type Requirement = {
      question: string;
      type: 'text' | 'file' | 'choice';
      required: boolean;
      options?: string[];
    };

    const validateRequirements = (requirements: Requirement[]): boolean => {
      return requirements.every(req => {
        if (!req.question.trim()) return false;
        if (req.type === 'choice' && (!req.options || req.options.length < 2)) return false;
        return true;
      });
    };

    it('should validate valid requirements', () => {
      const reqs: Requirement[] = [
        { question: 'Beschreiben Sie Ihr Projekt', type: 'text', required: true },
        { question: 'Logo-Dateien', type: 'file', required: false },
        { question: 'Stil', type: 'choice', required: true, options: ['Modern', 'Klassisch', 'Minimalistisch'] },
      ];
      expect(validateRequirements(reqs)).toBe(true);
    });

    it('should reject choice without options', () => {
      const reqs: Requirement[] = [
        { question: 'Stil', type: 'choice', required: true },
      ];
      expect(validateRequirements(reqs)).toBe(false);
    });
  });

  describe('Gig SEO', () => {
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[äöüß]/g, c => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[c] || c))
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    };

    const generateMetaDescription = (description: string, maxLength: number = 160): string => {
      if (description.length <= maxLength) return description;
      return description.slice(0, maxLength - 3).trim() + '...';
    };

    it('should generate slug from title', () => {
      expect(generateSlug('Professionelles Logo Design')).toBe('professionelles-logo-design');
      expect(generateSlug('Über uns & mehr!')).toBe('ueber-uns-mehr');
    });

    it('should generate meta description', () => {
      const short = 'Short description';
      expect(generateMetaDescription(short)).toBe(short);

      const long = 'A'.repeat(200);
      const meta = generateMetaDescription(long);
      expect(meta.length).toBeLessThanOrEqual(160);
      expect(meta.endsWith('...')).toBe(true);
    });
  });

  describe('Gig Impressions', () => {
    const trackImpression = (
      gigId: number,
      userId: number | null,
      source: 'search' | 'category' | 'homepage' | 'profile'
    ) => ({
      gigId,
      userId,
      source,
      timestamp: new Date(),
      sessionId: Math.random().toString(36).substring(2),
    });

    const calculateImpressionStats = (
      impressions: { source: string }[]
    ) => {
      const bySource: Record<string, number> = {};
      impressions.forEach(imp => {
        bySource[imp.source] = (bySource[imp.source] || 0) + 1;
      });
      return {
        total: impressions.length,
        bySource,
      };
    };

    it('should track impression', () => {
      const imp = trackImpression(1, 123, 'search');
      expect(imp.gigId).toBe(1);
      expect(imp.source).toBe('search');
    });

    it('should calculate stats by source', () => {
      const impressions = [
        { source: 'search' },
        { source: 'search' },
        { source: 'category' },
      ];
      const stats = calculateImpressionStats(impressions);
      expect(stats.total).toBe(3);
      expect(stats.bySource.search).toBe(2);
    });
  });

  describe('Gig Comparison', () => {
    const compareGigs = (
      gig1: { price: number; deliveryDays: number; rating: number },
      gig2: { price: number; deliveryDays: number; rating: number }
    ) => ({
      priceDiff: gig1.price - gig2.price,
      deliveryDiff: gig1.deliveryDays - gig2.deliveryDays,
      ratingDiff: gig1.rating - gig2.rating,
      cheaper: gig1.price < gig2.price ? 'gig1' : gig1.price > gig2.price ? 'gig2' : 'equal',
      faster: gig1.deliveryDays < gig2.deliveryDays ? 'gig1' : gig1.deliveryDays > gig2.deliveryDays ? 'gig2' : 'equal',
      betterRated: gig1.rating > gig2.rating ? 'gig1' : gig1.rating < gig2.rating ? 'gig2' : 'equal',
    });

    it('should compare gigs', () => {
      const gig1 = { price: 5000, deliveryDays: 3, rating: 480 };
      const gig2 = { price: 3000, deliveryDays: 7, rating: 450 };
      const comparison = compareGigs(gig1, gig2);
      
      expect(comparison.cheaper).toBe('gig2');
      expect(comparison.faster).toBe('gig1');
      expect(comparison.betterRated).toBe('gig1');
    });
  });
});
