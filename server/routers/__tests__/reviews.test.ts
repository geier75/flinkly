import { describe, it, expect } from 'vitest';

/**
 * Reviews Router Tests
 * 
 * Tests for review management
 */

describe('Reviews Router', () => {
  describe('Review Creation', () => {
    const createReview = (data: {
      orderId: number;
      gigId: number;
      buyerId: number;
      sellerId: number;
      rating: number;
      comment: string;
    }) => ({
      ...data,
      createdAt: new Date(),
      isPublic: true,
      sellerResponse: null,
    });

    it('should create review with all fields', () => {
      const review = createReview({
        orderId: 1,
        gigId: 2,
        buyerId: 3,
        sellerId: 4,
        rating: 500,
        comment: 'Excellent work!',
      });
      expect(review.rating).toBe(500);
      expect(review.isPublic).toBe(true);
    });
  });

  describe('Rating Validation', () => {
    const validateRating = (rating: number): { valid: boolean; error?: string } => {
      if (!Number.isInteger(rating)) {
        return { valid: false, error: 'Bewertung muss eine ganze Zahl sein' };
      }
      if (rating < 100 || rating > 500) {
        return { valid: false, error: 'Bewertung muss zwischen 1 und 5 Sternen liegen' };
      }
      return { valid: true };
    };

    it('should accept valid ratings', () => {
      expect(validateRating(100).valid).toBe(true);
      expect(validateRating(300).valid).toBe(true);
      expect(validateRating(500).valid).toBe(true);
    });

    it('should reject invalid ratings', () => {
      expect(validateRating(50).valid).toBe(false);
      expect(validateRating(600).valid).toBe(false);
      expect(validateRating(4.5).valid).toBe(false);
    });
  });

  describe('Comment Validation', () => {
    const MIN_COMMENT_LENGTH = 10;
    const MAX_COMMENT_LENGTH = 1000;

    const validateComment = (comment: string): { valid: boolean; error?: string } => {
      if (comment.length < MIN_COMMENT_LENGTH) {
        return { valid: false, error: `Mindestens ${MIN_COMMENT_LENGTH} Zeichen` };
      }
      if (comment.length > MAX_COMMENT_LENGTH) {
        return { valid: false, error: `Maximal ${MAX_COMMENT_LENGTH} Zeichen` };
      }
      return { valid: true };
    };

    it('should accept valid comments', () => {
      expect(validateComment('Great work, very professional!').valid).toBe(true);
    });

    it('should reject short comments', () => {
      expect(validateComment('Good').valid).toBe(false);
    });

    it('should reject long comments', () => {
      expect(validateComment('A'.repeat(1001)).valid).toBe(false);
    });
  });

  describe('Average Rating Calculation', () => {
    const calculateAverageRating = (ratings: number[]): number => {
      if (ratings.length === 0) return 0;
      const sum = ratings.reduce((a, b) => a + b, 0);
      return Math.round(sum / ratings.length);
    };

    it('should calculate average', () => {
      expect(calculateAverageRating([400, 500, 450])).toBe(450);
    });

    it('should handle single rating', () => {
      expect(calculateAverageRating([500])).toBe(500);
    });

    it('should return 0 for no ratings', () => {
      expect(calculateAverageRating([])).toBe(0);
    });
  });

  describe('Rating Distribution', () => {
    const calculateRatingDistribution = (ratings: number[]) => {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      ratings.forEach(rating => {
        const stars = Math.round(rating / 100);
        if (stars >= 1 && stars <= 5) {
          distribution[stars as keyof typeof distribution]++;
        }
      });

      return distribution;
    };

    it('should calculate distribution', () => {
      const ratings = [500, 500, 400, 300, 500];
      const dist = calculateRatingDistribution(ratings);
      expect(dist[5]).toBe(3);
      expect(dist[4]).toBe(1);
      expect(dist[3]).toBe(1);
    });
  });

  describe('Seller Response', () => {
    const MAX_RESPONSE_LENGTH = 500;

    const addSellerResponse = (
      review: { id: number; sellerResponse: string | null },
      response: string
    ): { success: boolean; error?: string } => {
      if (review.sellerResponse) {
        return { success: false, error: 'Antwort bereits vorhanden' };
      }
      if (response.length > MAX_RESPONSE_LENGTH) {
        return { success: false, error: 'Antwort zu lang' };
      }
      return { success: true };
    };

    it('should allow response on new review', () => {
      const review = { id: 1, sellerResponse: null };
      expect(addSellerResponse(review, 'Thank you!').success).toBe(true);
    });

    it('should reject duplicate response', () => {
      const review = { id: 1, sellerResponse: 'Already responded' };
      expect(addSellerResponse(review, 'New response').success).toBe(false);
    });

    it('should reject long response', () => {
      const review = { id: 1, sellerResponse: null };
      expect(addSellerResponse(review, 'A'.repeat(501)).success).toBe(false);
    });
  });

  describe('Review Sorting', () => {
    type SortBy = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

    const sortReviews = (
      reviews: { createdAt: Date; rating: number; helpfulCount: number }[],
      sortBy: SortBy
    ) => {
      return [...reviews].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'oldest':
            return a.createdAt.getTime() - b.createdAt.getTime();
          case 'highest':
            return b.rating - a.rating;
          case 'lowest':
            return a.rating - b.rating;
          case 'helpful':
            return b.helpfulCount - a.helpfulCount;
          default:
            return 0;
        }
      });
    };

    it('should sort by newest', () => {
      const reviews = [
        { createdAt: new Date('2024-01-01'), rating: 500, helpfulCount: 0 },
        { createdAt: new Date('2024-01-15'), rating: 400, helpfulCount: 0 },
      ];
      const sorted = sortReviews(reviews, 'newest');
      expect(sorted[0].rating).toBe(400);
    });

    it('should sort by highest rating', () => {
      const reviews = [
        { createdAt: new Date(), rating: 300, helpfulCount: 0 },
        { createdAt: new Date(), rating: 500, helpfulCount: 0 },
      ];
      const sorted = sortReviews(reviews, 'highest');
      expect(sorted[0].rating).toBe(500);
    });

    it('should sort by helpful', () => {
      const reviews = [
        { createdAt: new Date(), rating: 500, helpfulCount: 5 },
        { createdAt: new Date(), rating: 400, helpfulCount: 10 },
      ];
      const sorted = sortReviews(reviews, 'helpful');
      expect(sorted[0].helpfulCount).toBe(10);
    });
  });

  describe('Review Filtering', () => {
    const filterReviews = (
      reviews: { rating: number; hasPhoto: boolean; hasResponse: boolean }[],
      filters: { minRating?: number; withPhotos?: boolean; withResponse?: boolean }
    ) => {
      return reviews.filter(r => {
        if (filters.minRating && r.rating < filters.minRating) return false;
        if (filters.withPhotos && !r.hasPhoto) return false;
        if (filters.withResponse && !r.hasResponse) return false;
        return true;
      });
    };

    it('should filter by minimum rating', () => {
      const reviews = [
        { rating: 300, hasPhoto: false, hasResponse: false },
        { rating: 500, hasPhoto: false, hasResponse: false },
      ];
      expect(filterReviews(reviews, { minRating: 400 }).length).toBe(1);
    });

    it('should filter by photos', () => {
      const reviews = [
        { rating: 500, hasPhoto: true, hasResponse: false },
        { rating: 500, hasPhoto: false, hasResponse: false },
      ];
      expect(filterReviews(reviews, { withPhotos: true }).length).toBe(1);
    });
  });

  describe('Helpful Votes', () => {
    const canVoteHelpful = (
      userId: number,
      review: { buyerId: number; helpfulVoters: number[] }
    ): boolean => {
      // Can't vote on own review
      if (userId === review.buyerId) return false;
      // Can't vote twice
      if (review.helpfulVoters.includes(userId)) return false;
      return true;
    };

    it('should allow voting on others reviews', () => {
      const review = { buyerId: 1, helpfulVoters: [] };
      expect(canVoteHelpful(2, review)).toBe(true);
    });

    it('should not allow voting on own review', () => {
      const review = { buyerId: 1, helpfulVoters: [] };
      expect(canVoteHelpful(1, review)).toBe(false);
    });

    it('should not allow duplicate votes', () => {
      const review = { buyerId: 1, helpfulVoters: [2] };
      expect(canVoteHelpful(2, review)).toBe(false);
    });
  });

  describe('Review Eligibility', () => {
    const canLeaveReview = (order: {
      status: string;
      buyerId: number;
      hasReview: boolean;
    }, userId: number): { eligible: boolean; reason?: string } => {
      if (order.buyerId !== userId) {
        return { eligible: false, reason: 'Nur der Käufer kann bewerten' };
      }
      if (order.status !== 'completed') {
        return { eligible: false, reason: 'Bestellung muss abgeschlossen sein' };
      }
      if (order.hasReview) {
        return { eligible: false, reason: 'Bewertung bereits abgegeben' };
      }
      return { eligible: true };
    };

    it('should allow buyer to review completed order', () => {
      const order = { status: 'completed', buyerId: 1, hasReview: false };
      expect(canLeaveReview(order, 1).eligible).toBe(true);
    });

    it('should not allow seller to review', () => {
      const order = { status: 'completed', buyerId: 1, hasReview: false };
      expect(canLeaveReview(order, 2).eligible).toBe(false);
    });

    it('should not allow review on incomplete order', () => {
      const order = { status: 'in_progress', buyerId: 1, hasReview: false };
      expect(canLeaveReview(order, 1).eligible).toBe(false);
    });

    it('should not allow duplicate review', () => {
      const order = { status: 'completed', buyerId: 1, hasReview: true };
      expect(canLeaveReview(order, 1).eligible).toBe(false);
    });
  });

  describe('Review Display', () => {
    const formatRating = (rating: number): string => {
      const stars = rating / 100;
      return stars.toFixed(1);
    };

    const formatReviewDate = (date: Date): string => {
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Heute';
      if (diffDays === 1) return 'Gestern';
      if (diffDays < 7) return `Vor ${diffDays} Tagen`;
      if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
      return date.toLocaleDateString('de-DE');
    };

    it('should format rating', () => {
      expect(formatRating(450)).toBe('4.5');
      expect(formatRating(500)).toBe('5.0');
    });

    it('should format recent dates', () => {
      expect(formatReviewDate(new Date())).toBe('Heute');
      expect(formatReviewDate(new Date(Date.now() - 24 * 60 * 60 * 1000))).toBe('Gestern');
    });
  });
});
