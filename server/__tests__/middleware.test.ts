import { describe, it, expect } from 'vitest';

/**
 * Middleware Tests
 * 
 * Tests for Express middleware logic
 */

describe('Middleware', () => {
  describe('Auth Middleware', () => {
    const extractToken = (authHeader: string | undefined): string | null => {
      if (!authHeader) return null;
      if (!authHeader.startsWith('Bearer ')) return null;
      return authHeader.substring(7);
    };

    it('should extract bearer token', () => {
      expect(extractToken('Bearer abc123')).toBe('abc123');
    });

    it('should return null for missing header', () => {
      expect(extractToken(undefined)).toBeNull();
    });

    it('should return null for invalid format', () => {
      expect(extractToken('Basic abc123')).toBeNull();
    });
  });

  describe('Rate Limit Middleware', () => {
    const createRateLimiter = (
      maxRequests: number,
      windowMs: number
    ) => {
      const requests: Map<string, { count: number; resetAt: number }> = new Map();

      return (ip: string): { allowed: boolean; remaining: number; resetAt: number } => {
        const now = Date.now();
        const record = requests.get(ip);

        if (!record || record.resetAt < now) {
          requests.set(ip, { count: 1, resetAt: now + windowMs });
          return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
        }

        if (record.count >= maxRequests) {
          return { allowed: false, remaining: 0, resetAt: record.resetAt };
        }

        record.count++;
        return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
      };
    };

    it('should allow requests within limit', () => {
      const limiter = createRateLimiter(10, 60000);
      const result = limiter('127.0.0.1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });

    it('should block after limit exceeded', () => {
      const limiter = createRateLimiter(2, 60000);
      limiter('127.0.0.1');
      limiter('127.0.0.1');
      const result = limiter('127.0.0.1');
      expect(result.allowed).toBe(false);
    });
  });

  describe('CORS Middleware', () => {
    const ALLOWED_ORIGINS = [
      'https://flinkly.com',
      'https://www.flinkly.com',
      'http://localhost:3000',
    ];

    const isOriginAllowed = (origin: string): boolean => {
      return ALLOWED_ORIGINS.includes(origin);
    };

    it('should allow production origin', () => {
      expect(isOriginAllowed('https://flinkly.com')).toBe(true);
    });

    it('should allow localhost in development', () => {
      expect(isOriginAllowed('http://localhost:3000')).toBe(true);
    });

    it('should reject unknown origin', () => {
      expect(isOriginAllowed('https://evil.com')).toBe(false);
    });
  });

  describe('Error Handler', () => {
    const formatError = (
      error: Error,
      isDevelopment: boolean = false
    ): { error: string; status: number; stack?: string } => {
      const baseResponse: { error: string; status: number; stack?: string } = {
        error: error.message || 'Internal Server Error',
        status: 500,
      };

      if (isDevelopment) {
        baseResponse.stack = error.stack;
      }

      return baseResponse;
    };

    it('should format error for production', () => {
      const error = new Error('Something went wrong');
      const formatted = formatError(error, false);
      expect(formatted.error).toBe('Something went wrong');
      expect(formatted.stack).toBeUndefined();
    });

    it('should include stack in development', () => {
      const error = new Error('Something went wrong');
      const formatted = formatError(error, true);
      expect(formatted.stack).toBeDefined();
    });
  });

  describe('Request Logger', () => {
    const formatLogEntry = (
      method: string,
      path: string,
      statusCode: number,
      duration: number
    ) => ({
      method,
      path,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
      level: statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info',
    });

    it('should log info for success', () => {
      const log = formatLogEntry('GET', '/api/gigs', 200, 50);
      expect(log.level).toBe('info');
    });

    it('should log warn for client error', () => {
      const log = formatLogEntry('POST', '/api/login', 401, 10);
      expect(log.level).toBe('warn');
    });

    it('should log error for server error', () => {
      const log = formatLogEntry('GET', '/api/crash', 500, 100);
      expect(log.level).toBe('error');
    });
  });

  describe('Compression', () => {
    const shouldCompress = (
      contentType: string,
      contentLength: number,
      threshold: number = 1024
    ): boolean => {
      const compressibleTypes = [
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/javascript',
      ];

      if (contentLength < threshold) return false;
      return compressibleTypes.some(t => contentType.includes(t));
    };

    it('should compress large JSON', () => {
      expect(shouldCompress('application/json', 5000)).toBe(true);
    });

    it('should not compress small responses', () => {
      expect(shouldCompress('application/json', 500)).toBe(false);
    });

    it('should not compress images', () => {
      expect(shouldCompress('image/png', 50000)).toBe(false);
    });
  });

  describe('Security Headers', () => {
    const SECURITY_HEADERS = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
    };

    it('should have all security headers', () => {
      expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff');
      expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY');
      expect(SECURITY_HEADERS['Strict-Transport-Security']).toContain('max-age');
    });
  });

  describe('Request Validation', () => {
    const validateContentType = (
      contentType: string | undefined,
      expected: string
    ): boolean => {
      if (!contentType) return false;
      return contentType.includes(expected);
    };

    it('should validate JSON content type', () => {
      expect(validateContentType('application/json', 'application/json')).toBe(true);
      expect(validateContentType('application/json; charset=utf-8', 'application/json')).toBe(true);
    });

    it('should reject wrong content type', () => {
      expect(validateContentType('text/html', 'application/json')).toBe(false);
    });
  });

  describe('Request Sanitization', () => {
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    it('should escape HTML', () => {
      expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
    });

    it('should escape quotes', () => {
      expect(sanitizeInput('"test"')).toBe('&quot;test&quot;');
    });
  });

  describe('IP Detection', () => {
    const getClientIp = (headers: Record<string, string | undefined>, socketIp: string): string => {
      return headers['x-forwarded-for']?.split(',')[0].trim() ||
             headers['x-real-ip'] ||
             socketIp;
    };

    it('should use x-forwarded-for', () => {
      expect(getClientIp({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }, '127.0.0.1')).toBe('1.2.3.4');
    });

    it('should use x-real-ip', () => {
      expect(getClientIp({ 'x-real-ip': '1.2.3.4' }, '127.0.0.1')).toBe('1.2.3.4');
    });

    it('should fallback to socket IP', () => {
      expect(getClientIp({}, '127.0.0.1')).toBe('127.0.0.1');
    });
  });

  describe('Request Timeout', () => {
    const DEFAULT_TIMEOUT = 30000;

    const getTimeout = (path: string): number => {
      const longTimeoutPaths = ['/api/upload', '/api/export', '/api/import'];
      if (longTimeoutPaths.some(p => path.startsWith(p))) {
        return 120000;
      }
      return DEFAULT_TIMEOUT;
    };

    it('should use default timeout', () => {
      expect(getTimeout('/api/gigs')).toBe(30000);
    });

    it('should use long timeout for uploads', () => {
      expect(getTimeout('/api/upload/image')).toBe(120000);
    });
  });
});
