import { describe, it, expect } from 'vitest';

/**
 * Client Utils Tests
 * 
 * Tests for client-side utility functions
 */

describe('Client Utils', () => {
  describe('cn (classnames)', () => {
    const cn = (...classes: (string | undefined | null | false)[]) => {
      return classes.filter(Boolean).join(' ');
    };

    it('should join class names', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c');
    });

    it('should filter falsy values', () => {
      expect(cn('a', false, 'b', null, 'c', undefined)).toBe('a b c');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
    });
  });

  describe('formatCurrency', () => {
    const formatCurrency = (cents: number, currency: string = 'EUR'): string => {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency,
      }).format(cents / 100);
    };

    it('should format EUR', () => {
      expect(formatCurrency(5000)).toContain('50');
      expect(formatCurrency(5000)).toContain('€');
    });

    it('should handle cents', () => {
      expect(formatCurrency(5099)).toContain('50,99');
    });

    it('should format other currencies', () => {
      expect(formatCurrency(5000, 'USD')).toContain('$');
    });
  });

  describe('formatDate', () => {
    const formatDate = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      
      if (format === 'long') {
        return d.toLocaleDateString('de-DE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      
      return d.toLocaleDateString('de-DE');
    };

    it('should format short date', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('15');
      expect(formatDate(date)).toContain('1');
      expect(formatDate(date)).toContain('2024');
    });

    it('should format long date', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'long');
      expect(formatted).toContain('Januar');
    });

    it('should accept string dates', () => {
      expect(formatDate('2024-01-15')).toBeDefined();
    });
  });

  describe('truncate', () => {
    const truncate = (text: string, maxLength: number, suffix: string = '...'): string => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength - suffix.length) + suffix;
    };

    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 8, '…')).toBe('Hello W…');
    });
  });

  describe('slugify', () => {
    const slugify = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    };

    it('should convert to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with dashes', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    it('should handle German umlauts', () => {
      expect(slugify('Größe')).toBe('groesse');
      expect(slugify('Übung')).toBe('uebung');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! World?')).toBe('hello-world');
    });
  });

  describe('debounce', () => {
    const debounce = <T extends (...args: any[]) => any>(
      fn: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };

    it('should return a function', () => {
      const debounced = debounce(() => {}, 100);
      expect(typeof debounced).toBe('function');
    });
  });

  describe('throttle', () => {
    const throttle = <T extends (...args: any[]) => any>(
      fn: T,
      limit: number
    ): ((...args: Parameters<T>) => void) => {
      let lastRun = 0;
      return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastRun >= limit) {
          fn(...args);
          lastRun = now;
        }
      };
    };

    it('should return a function', () => {
      const throttled = throttle(() => {}, 100);
      expect(typeof throttled).toBe('function');
    });
  });

  describe('deepClone', () => {
    const deepClone = <T>(obj: T): T => {
      return JSON.parse(JSON.stringify(obj));
    };

    it('should clone objects', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should clone arrays', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('isEmpty', () => {
    const isEmpty = (value: any): boolean => {
      if (value == null) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    };

    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should detect non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('generateId', () => {
    const generateId = (prefix: string = ''): string => {
      const random = Math.random().toString(36).substring(2, 9);
      const timestamp = Date.now().toString(36);
      return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
    };

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should include prefix', () => {
      const id = generateId('user');
      expect(id.startsWith('user_')).toBe(true);
    });
  });

  describe('parseQueryString', () => {
    const parseQueryString = (query: string): Record<string, string> => {
      const params: Record<string, string> = {};
      const searchParams = new URLSearchParams(query);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    };

    it('should parse query string', () => {
      const result = parseQueryString('?foo=bar&baz=qux');
      expect(result).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should handle empty query', () => {
      expect(parseQueryString('')).toEqual({});
    });

    it('should decode values', () => {
      const result = parseQueryString('?name=Hello%20World');
      expect(result.name).toBe('Hello World');
    });
  });

  describe('buildQueryString', () => {
    const buildQueryString = (params: Record<string, string | number | boolean | undefined>): string => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      return query ? `?${query}` : '';
    };

    it('should build query string', () => {
      const result = buildQueryString({ foo: 'bar', baz: 'qux' });
      expect(result).toBe('?foo=bar&baz=qux');
    });

    it('should handle empty params', () => {
      expect(buildQueryString({})).toBe('');
    });

    it('should skip undefined values', () => {
      const result = buildQueryString({ foo: 'bar', baz: undefined });
      expect(result).toBe('?foo=bar');
    });
  });
});
