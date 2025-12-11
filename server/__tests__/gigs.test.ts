import { describe, it, expect } from 'vitest';

/**
 * Gigs Tests
 * 
 * Tests for gig management logic
 */

describe('Gigs', () => {
  describe('Gig Validation', () => {
    const validateGig = (gig: {
      title?: string;
      description?: string;
      price?: number;
      deliveryDays?: number;
      category?: string;
    }): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!gig.title || gig.title.length < 10) {
        errors.push('Titel muss mindestens 10 Zeichen haben');
      }
      if (gig.title && gig.title.length > 100) {
        errors.push('Titel darf maximal 100 Zeichen haben');
      }
      if (!gig.description || gig.description.length < 100) {
        errors.push('Beschreibung muss mindestens 100 Zeichen haben');
      }
      if (!gig.price || gig.price < 500) {
        errors.push('Mindestpreis ist 5€');
      }
      if (gig.price && gig.price > 1000000) {
        errors.push('Höchstpreis ist 10.000€');
      }
      if (!gig.deliveryDays || gig.deliveryDays < 1) {
        errors.push('Lieferzeit muss mindestens 1 Tag sein');
      }
      if (gig.deliveryDays && gig.deliveryDays > 90) {
        errors.push('Lieferzeit darf maximal 90 Tage sein');
      }
      if (!gig.category) {
        errors.push('Kategorie ist erforderlich');
      }

      return { valid: errors.length === 0, errors };
    };

    it('should accept valid gig', () => {
      const result = validateGig({
        title: 'Professional Logo Design',
        description: 'A'.repeat(100),
        price: 5000,
        deliveryDays: 7,
        category: 'design',
      });
      expect(result.valid).toBe(true);
    });

    it('should reject short title', () => {
      const result = validateGig({
        title: 'Short',
        description: 'A'.repeat(100),
        price: 5000,
        deliveryDays: 7,
        category: 'design',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Titel muss mindestens 10 Zeichen haben');
    });

    it('should reject low price', () => {
      const result = validateGig({
        title: 'Valid Title Here',
        description: 'A'.repeat(100),
        price: 100,
        deliveryDays: 7,
        category: 'design',
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('Categories', () => {
    const CATEGORIES = [
      { id: 'design', label: 'Design & Grafik', icon: '🎨' },
      { id: 'programming', label: 'Programmierung', icon: '💻' },
      { id: 'writing', label: 'Texte & Übersetzung', icon: '✍️' },
      { id: 'video', label: 'Video & Animation', icon: '🎬' },
      { id: 'music', label: 'Musik & Audio', icon: '🎵' },
      { id: 'marketing', label: 'Marketing', icon: '📈' },
      { id: 'business', label: 'Business', icon: '💼' },
    ];

    const isValidCategory = (categoryId: string): boolean => {
      return CATEGORIES.some(c => c.id === categoryId);
    };

    it('should have all main categories', () => {
      expect(CATEGORIES.length).toBeGreaterThanOrEqual(7);
    });

    it('should validate category', () => {
      expect(isValidCategory('design')).toBe(true);
      expect(isValidCategory('invalid')).toBe(false);
    });

    it('should have icons for all categories', () => {
      CATEGORIES.forEach(cat => {
        expect(cat.icon).toBeDefined();
      });
    });
  });

  describe('Pricing Tiers', () => {
    type PackageType = 'basic' | 'standard' | 'premium';

    const createPackage = (
      type: PackageType,
      price: number,
      deliveryDays: number,
      features: string[]
    ) => ({
      type,
      price,
      deliveryDays,
      features,
      revisions: type === 'basic' ? 1 : type === 'standard' ? 3 : 5,
    });

    it('should create basic package', () => {
      const pkg = createPackage('basic', 5000, 7, ['Logo Design']);
      expect(pkg.revisions).toBe(1);
    });

    it('should create standard package', () => {
      const pkg = createPackage('standard', 10000, 5, ['Logo Design', 'Source Files']);
      expect(pkg.revisions).toBe(3);
    });

    it('should create premium package', () => {
      const pkg = createPackage('premium', 20000, 3, ['Logo Design', 'Source Files', 'Brand Guide']);
      expect(pkg.revisions).toBe(5);
    });
  });

  describe('Search & Filter', () => {
    const filterGigs = (
      gigs: { price: number; category: string; deliveryDays: number; rating: number }[],
      filters: {
        minPrice?: number;
        maxPrice?: number;
        category?: string;
        maxDeliveryDays?: number;
        minRating?: number;
      }
    ) => {
      return gigs.filter(gig => {
        if (filters.minPrice && gig.price < filters.minPrice) return false;
        if (filters.maxPrice && gig.price > filters.maxPrice) return false;
        if (filters.category && gig.category !== filters.category) return false;
        if (filters.maxDeliveryDays && gig.deliveryDays > filters.maxDeliveryDays) return false;
        if (filters.minRating && gig.rating < filters.minRating) return false;
        return true;
      });
    };

    const gigs = [
      { price: 5000, category: 'design', deliveryDays: 7, rating: 450 },
      { price: 10000, category: 'design', deliveryDays: 3, rating: 480 },
      { price: 3000, category: 'writing', deliveryDays: 5, rating: 420 },
    ];

    it('should filter by price range', () => {
      const result = filterGigs(gigs, { minPrice: 4000, maxPrice: 8000 });
      expect(result.length).toBe(1);
    });

    it('should filter by category', () => {
      const result = filterGigs(gigs, { category: 'design' });
      expect(result.length).toBe(2);
    });

    it('should filter by delivery time', () => {
      const result = filterGigs(gigs, { maxDeliveryDays: 5 });
      expect(result.length).toBe(2);
    });

    it('should combine filters', () => {
      const result = filterGigs(gigs, { category: 'design', maxDeliveryDays: 5 });
      expect(result.length).toBe(1);
    });
  });

  describe('Sorting', () => {
    type SortBy = 'relevance' | 'price' | 'delivery' | 'rating' | 'popularity';

    const sortGigs = (
      gigs: { price: number; deliveryDays: number; rating: number; popularity: number }[],
      sortBy: SortBy,
      order: 'asc' | 'desc' = 'desc'
    ) => {
      const sorted = [...gigs].sort((a, b) => {
        let diff = 0;
        switch (sortBy) {
          case 'price':
            diff = a.price - b.price;
            break;
          case 'delivery':
            diff = a.deliveryDays - b.deliveryDays;
            break;
          case 'rating':
            diff = a.rating - b.rating;
            break;
          case 'popularity':
            diff = a.popularity - b.popularity;
            break;
          default:
            diff = a.popularity - b.popularity;
        }
        return order === 'asc' ? diff : -diff;
      });
      return sorted;
    };

    const gigs = [
      { price: 5000, deliveryDays: 7, rating: 450, popularity: 100 },
      { price: 10000, deliveryDays: 3, rating: 480, popularity: 200 },
      { price: 3000, deliveryDays: 5, rating: 420, popularity: 50 },
    ];

    it('should sort by price ascending', () => {
      const sorted = sortGigs(gigs, 'price', 'asc');
      expect(sorted[0].price).toBe(3000);
    });

    it('should sort by rating descending', () => {
      const sorted = sortGigs(gigs, 'rating', 'desc');
      expect(sorted[0].rating).toBe(480);
    });

    it('should sort by delivery time', () => {
      const sorted = sortGigs(gigs, 'delivery', 'asc');
      expect(sorted[0].deliveryDays).toBe(3);
    });
  });

  describe('Tags', () => {
    const MAX_TAGS = 5;
    const MAX_TAG_LENGTH = 20;

    const validateTags = (tags: string[]): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (tags.length > MAX_TAGS) {
        errors.push(`Maximal ${MAX_TAGS} Tags erlaubt`);
      }

      tags.forEach((tag, i) => {
        if (tag.length > MAX_TAG_LENGTH) {
          errors.push(`Tag ${i + 1} ist zu lang`);
        }
        if (!/^[a-zA-Z0-9äöüÄÖÜß\s-]+$/.test(tag)) {
          errors.push(`Tag ${i + 1} enthält ungültige Zeichen`);
        }
      });

      return { valid: errors.length === 0, errors };
    };

    it('should accept valid tags', () => {
      const result = validateTags(['logo', 'design', 'branding']);
      expect(result.valid).toBe(true);
    });

    it('should reject too many tags', () => {
      const result = validateTags(['a', 'b', 'c', 'd', 'e', 'f']);
      expect(result.valid).toBe(false);
    });

    it('should reject long tags', () => {
      const result = validateTags(['A'.repeat(25)]);
      expect(result.valid).toBe(false);
    });
  });

  describe('Image Gallery', () => {
    const MAX_IMAGES = 5;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const validateGallery = (images: { type: string; size: number }[]) => {
      if (images.length === 0) {
        return { valid: false, error: 'Mindestens ein Bild erforderlich' };
      }
      if (images.length > MAX_IMAGES) {
        return { valid: false, error: `Maximal ${MAX_IMAGES} Bilder erlaubt` };
      }
      for (const img of images) {
        if (!ALLOWED_TYPES.includes(img.type)) {
          return { valid: false, error: 'Ungültiger Bildtyp' };
        }
      }
      return { valid: true };
    };

    it('should require at least one image', () => {
      expect(validateGallery([]).valid).toBe(false);
    });

    it('should accept valid gallery', () => {
      const images = [{ type: 'image/jpeg', size: 1024 }];
      expect(validateGallery(images).valid).toBe(true);
    });

    it('should reject too many images', () => {
      const images = Array(6).fill({ type: 'image/jpeg', size: 1024 });
      expect(validateGallery(images).valid).toBe(false);
    });
  });

  describe('FAQ', () => {
    const MAX_FAQ_ITEMS = 10;

    const validateFaq = (faq: { question: string; answer: string }[]) => {
      if (faq.length > MAX_FAQ_ITEMS) {
        return { valid: false, error: 'Maximal 10 FAQ-Einträge' };
      }
      for (const item of faq) {
        if (!item.question || item.question.length < 10) {
          return { valid: false, error: 'Frage zu kurz' };
        }
        if (!item.answer || item.answer.length < 20) {
          return { valid: false, error: 'Antwort zu kurz' };
        }
      }
      return { valid: true };
    };

    it('should accept valid FAQ', () => {
      const faq = [{
        question: 'Was ist enthalten?',
        answer: 'Das Paket enthält alle Dateien und Quellcode.',
      }];
      expect(validateFaq(faq).valid).toBe(true);
    });

    it('should reject short questions', () => {
      const faq = [{ question: 'Was?', answer: 'Eine ausführliche Antwort hier.' }];
      expect(validateFaq(faq).valid).toBe(false);
    });
  });
});
