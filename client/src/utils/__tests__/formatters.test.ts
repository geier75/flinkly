import { describe, it, expect } from 'vitest';

/**
 * Formatter Utility Tests
 * 
 * Tests for common formatting functions used in the client
 */

// Price formatting (cents to EUR)
const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
};

// Rating formatting (integer to decimal)
const formatRating = (rating: number | null): string => {
  if (rating === null || rating === 0) return '-';
  return (rating / 100).toFixed(1);
};

// Date formatting
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

// Relative time formatting
const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return formatDate(d);
};

// Truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Delivery time formatting
const formatDeliveryTime = (days: number): string => {
  if (days === 1) return '1 Tag';
  return `${days} Tage`;
};

// File size formatting
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

describe('Formatter Utilities', () => {
  describe('formatPrice', () => {
    it('should format cents to EUR', () => {
      expect(formatPrice(5000)).toMatch(/50,00/);
      expect(formatPrice(5000)).toMatch(/€/);
    });

    it('should handle decimal amounts', () => {
      expect(formatPrice(1999)).toMatch(/19,99/);
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toMatch(/0,00/);
    });

    it('should handle large amounts', () => {
      expect(formatPrice(25000)).toMatch(/250,00/);
    });

    it('should handle small amounts', () => {
      expect(formatPrice(99)).toMatch(/0,99/);
    });
  });

  describe('formatRating', () => {
    it('should format integer rating to decimal', () => {
      expect(formatRating(450)).toBe('4.5');
      expect(formatRating(500)).toBe('5.0');
      expect(formatRating(380)).toBe('3.8');
    });

    it('should return dash for null rating', () => {
      expect(formatRating(null)).toBe('-');
    });

    it('should return dash for zero rating', () => {
      expect(formatRating(0)).toBe('-');
    });

    it('should handle perfect rating', () => {
      expect(formatRating(500)).toBe('5.0');
    });
  });

  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15.01.2024');
    });

    it('should format date string', () => {
      expect(formatDate('2024-06-20')).toBe('20.06.2024');
    });

    it('should handle ISO date strings', () => {
      expect(formatDate('2024-12-25T10:30:00Z')).toMatch(/25\.12\.2024/);
    });
  });

  describe('formatRelativeTime', () => {
    it('should show "gerade eben" for very recent', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('gerade eben');
    });

    it('should show minutes for recent times', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinAgo)).toBe('vor 5 Min.');
    });

    it('should show hours for same day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeHoursAgo)).toBe('vor 3 Std.');
    });

    it('should show days for recent past', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoDaysAgo)).toBe('vor 2 Tagen');
    });

    it('should show full date for older times', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoWeeksAgo)).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text with ellipsis', () => {
      expect(truncateText('This is a very long text', 15)).toBe('This is a ve...');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('formatDeliveryTime', () => {
    it('should format single day', () => {
      expect(formatDeliveryTime(1)).toBe('1 Tag');
    });

    it('should format multiple days', () => {
      expect(formatDeliveryTime(3)).toBe('3 Tage');
      expect(formatDeliveryTime(7)).toBe('7 Tage');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(2048)).toBe('2.0 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative prices', () => {
      // Refunds might be negative
      expect(formatPrice(-500)).toMatch(/-5,00/);
    });

    it('should handle very large numbers', () => {
      expect(formatPrice(9999999)).toMatch(/99\.999,99/);
    });

    it('should handle special characters in text', () => {
      expect(truncateText('Hëllo Wörld', 8)).toBe('Hëllo...');
    });
  });
});
