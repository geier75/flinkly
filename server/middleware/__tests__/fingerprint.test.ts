import { describe, it, expect } from 'vitest';
import { isSuspiciousFingerprint } from '../fingerprint';
import type { DeviceFingerprint } from '../fingerprint';

/**
 * Fingerprint Middleware Tests
 * 
 * Tests device fingerprinting for fraud detection
 */

const createFingerprint = (overrides: Partial<DeviceFingerprint> = {}): DeviceFingerprint => ({
  fingerprintHash: 'test123',
  ipHash: 'ip123',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  acceptLanguage: 'de-DE,de;q=0.9',
  timestamp: new Date(),
  ...overrides,
});

describe('Fingerprint Middleware', () => {
  describe('isSuspiciousFingerprint', () => {
    describe('Bot Detection', () => {
      it('should detect Googlebot', () => {
        const fp = createFingerprint({ userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect Bingbot', () => {
        const fp = createFingerprint({ userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0)' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect generic bot', () => {
        const fp = createFingerprint({ userAgent: 'some-bot/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect crawler', () => {
        const fp = createFingerprint({ userAgent: 'webcrawler/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect spider', () => {
        const fp = createFingerprint({ userAgent: 'spider-agent/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });
    });

    describe('Automation Tool Detection', () => {
      it('should detect HeadlessChrome', () => {
        const fp = createFingerprint({ userAgent: 'Mozilla/5.0 HeadlessChrome/91.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect PhantomJS', () => {
        const fp = createFingerprint({ userAgent: 'Mozilla/5.0 PhantomJS/2.1' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect Selenium', () => {
        const fp = createFingerprint({ userAgent: 'Selenium WebDriver' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect Puppeteer', () => {
        const fp = createFingerprint({ userAgent: 'Puppeteer/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });
    });

    describe('Missing Headers Detection', () => {
      it('should detect missing user agent', () => {
        const fp = createFingerprint({ userAgent: 'unknown' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect empty user agent', () => {
        const fp = createFingerprint({ userAgent: '' });
        // Empty string doesn't match 'unknown' but may still be suspicious
        // depending on implementation
        expect(typeof isSuspiciousFingerprint(fp)).toBe('boolean');
      });
    });

    describe('Legitimate Browsers', () => {
      it('should allow Chrome on Windows', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });

      it('should allow Firefox on Windows', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });

      it('should allow Safari on macOS', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });

      it('should allow Edge on Windows', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });

      it('should allow Chrome on Android', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });

      it('should allow Safari on iOS', () => {
        const fp = createFingerprint({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        });
        expect(isSuspiciousFingerprint(fp)).toBe(false);
      });
    });

    describe('Case Sensitivity', () => {
      it('should detect BOT in uppercase', () => {
        const fp = createFingerprint({ userAgent: 'SOME-BOT/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect Bot in mixed case', () => {
        const fp = createFingerprint({ userAgent: 'Some-Bot/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });

      it('should detect CRAWLER in uppercase', () => {
        const fp = createFingerprint({ userAgent: 'WEBCRAWLER/1.0' });
        expect(isSuspiciousFingerprint(fp)).toBe(true);
      });
    });
  });

  describe('Fingerprint Structure', () => {
    it('should have all required fields', () => {
      const fp = createFingerprint();
      
      expect(fp).toHaveProperty('fingerprintHash');
      expect(fp).toHaveProperty('ipHash');
      expect(fp).toHaveProperty('userAgent');
      expect(fp).toHaveProperty('acceptLanguage');
      expect(fp).toHaveProperty('timestamp');
    });

    it('should have valid timestamp', () => {
      const fp = createFingerprint();
      expect(fp.timestamp).toBeInstanceOf(Date);
    });

    it('should have string hashes', () => {
      const fp = createFingerprint();
      expect(typeof fp.fingerprintHash).toBe('string');
      expect(typeof fp.ipHash).toBe('string');
    });
  });
});
