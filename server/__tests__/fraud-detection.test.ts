import { describe, it, expect } from 'vitest';
import {
  detectPriceManipulation,
  detectSuspiciousDevice,
  runFraudDetection,
} from '../fraud-detection';
import type { DeviceFingerprint } from '../middleware/fingerprint';

/**
 * Fraud Detection Tests
 * 
 * Tests the fraud detection system for:
 * - Price manipulation detection
 * - Suspicious device detection
 * - Combined fraud detection
 */

// Helper to create fingerprint with correct structure
const createFingerprint = (overrides: Partial<DeviceFingerprint> = {}): DeviceFingerprint => ({
  fingerprintHash: 'test123',
  ipHash: 'ip123',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  acceptLanguage: 'de-DE,de;q=0.9',
  timestamp: new Date(),
  ...overrides,
});

describe('Fraud Detection', () => {
  describe('detectPriceManipulation', () => {
    it('should detect price set to 0', async () => {
      const alert = await detectPriceManipulation(1, 0);
      expect(alert).not.toBeNull();
      expect(alert?.type).toBe('price_manipulation');
      expect(alert?.severity).toBe('high');
      expect(alert?.description).toContain('0 or negative');
    });

    it('should detect negative price', async () => {
      const alert = await detectPriceManipulation(1, -100);
      expect(alert).not.toBeNull();
      expect(alert?.type).toBe('price_manipulation');
      expect(alert?.severity).toBe('high');
    });

    it('should detect price exceeding maximum', async () => {
      const alert = await detectPriceManipulation(1, 300);
      expect(alert).not.toBeNull();
      expect(alert?.type).toBe('price_manipulation');
      expect(alert?.severity).toBe('medium');
      expect(alert?.description).toContain('exceeds platform maximum');
    });

    it('should return null for valid price', async () => {
      const alert = await detectPriceManipulation(1, 50);
      expect(alert).toBeNull();
    });

    it('should return null for price at maximum', async () => {
      const alert = await detectPriceManipulation(1, 250);
      expect(alert).toBeNull();
    });

    it('should return null for minimum price', async () => {
      const alert = await detectPriceManipulation(1, 5);
      expect(alert).toBeNull();
    });

    it('should include metadata in alert', async () => {
      const alert = await detectPriceManipulation(123, -50);
      expect(alert?.metadata).toEqual({ gigId: 123, newPrice: -50 });
    });

    it('should include timestamp in alert', async () => {
      const alert = await detectPriceManipulation(1, 0);
      expect(alert?.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('detectSuspiciousDevice', () => {
    it('should detect bot user agent', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
      expect(alert?.type).toBe('suspicious_device');
      expect(alert?.severity).toBe('medium');
    });

    it('should detect crawler user agent', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Mozilla/5.0 crawler',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should detect spider user agent', () => {
      const fingerprint = createFingerprint({
        userAgent: 'spider-bot/1.0',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should detect HeadlessChrome', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Mozilla/5.0 HeadlessChrome/91.0',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should detect Puppeteer', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Puppeteer/1.0',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should detect Selenium', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Selenium WebDriver',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should detect missing user agent', () => {
      const fingerprint = createFingerprint({
        userAgent: 'unknown',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).not.toBeNull();
    });

    it('should return null for normal browser', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).toBeNull();
    });

    it('should return null for mobile browser', () => {
      const fingerprint = createFingerprint({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert).toBeNull();
    });

    it('should include fingerprint hash in metadata', () => {
      const fingerprint = createFingerprint({
        userAgent: 'bot',
        fingerprintHash: 'suspicious123',
      });

      const alert = detectSuspiciousDevice(fingerprint);
      expect(alert?.metadata.fingerprintHash).toBe('suspicious123');
    });
  });

  describe('runFraudDetection', () => {
    it('should return empty array when no params', async () => {
      const alerts = await runFraudDetection({});
      expect(alerts).toEqual([]);
    });

    it('should detect price manipulation', async () => {
      const alerts = await runFraudDetection({
        gigId: 1,
        newPrice: -10,
      });
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.type === 'price_manipulation')).toBe(true);
    });

    it('should detect suspicious device', async () => {
      const alerts = await runFraudDetection({
        fingerprint: createFingerprint({ userAgent: 'bot' }),
      });
      expect(alerts.some(a => a.type === 'suspicious_device')).toBe(true);
    });

    it('should combine multiple alerts', async () => {
      const alerts = await runFraudDetection({
        gigId: 1,
        newPrice: 0,
        fingerprint: createFingerprint({ userAgent: 'bot' }),
      });
      expect(alerts.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle userId param', async () => {
      const alerts = await runFraudDetection({
        userId: 123,
      });
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should handle ipHash param', async () => {
      const alerts = await runFraudDetection({
        ipHash: 'abc123hash',
      });
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should handle gigId without newPrice', async () => {
      const alerts = await runFraudDetection({
        gigId: 1,
      });
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('Alert Structure', () => {
    it('should have correct alert structure', async () => {
      const alert = await detectPriceManipulation(1, -1);
      
      expect(alert).toHaveProperty('userId');
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('severity');
      expect(alert).toHaveProperty('description');
      expect(alert).toHaveProperty('metadata');
      expect(alert).toHaveProperty('timestamp');
    });

    it('should have valid severity levels', async () => {
      const validSeverities = ['low', 'medium', 'high', 'critical'];
      
      const alert1 = await detectPriceManipulation(1, 0);
      expect(validSeverities).toContain(alert1?.severity);
      
      const alert2 = await detectPriceManipulation(1, 300);
      expect(validSeverities).toContain(alert2?.severity);
    });

    it('should have valid alert types', async () => {
      const validTypes = [
        'rapid_creation',
        'unusual_orders',
        'price_manipulation',
        'review_bombing',
        'suspicious_device',
      ];
      
      const alert = await detectPriceManipulation(1, 0);
      expect(validTypes).toContain(alert?.type);
    });
  });
});
