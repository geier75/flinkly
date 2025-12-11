import { describe, it, expect } from 'vitest';
import {
  COOKIE_NAME,
  ONE_YEAR_MS,
  THIRTY_DAYS_MS,
  TWENTY_FOUR_HOURS_MS,
  AXIOS_TIMEOUT_MS,
  UNAUTHED_ERR_MSG,
  NOT_ADMIN_ERR_MSG,
} from '../const';

/**
 * Constants Tests
 * 
 * Tests for shared constants
 */

describe('Shared Constants', () => {
  describe('Cookie Configuration', () => {
    it('should have valid cookie name', () => {
      expect(COOKIE_NAME).toBe('app_session_id');
      expect(typeof COOKIE_NAME).toBe('string');
      expect(COOKIE_NAME.length).toBeGreaterThan(0);
    });
  });

  describe('Time Constants', () => {
    it('should have correct ONE_YEAR_MS value', () => {
      const expectedMs = 1000 * 60 * 60 * 24 * 365;
      expect(ONE_YEAR_MS).toBe(expectedMs);
      expect(ONE_YEAR_MS).toBe(31536000000);
    });

    it('should have correct THIRTY_DAYS_MS value', () => {
      const expectedMs = 1000 * 60 * 60 * 24 * 30;
      expect(THIRTY_DAYS_MS).toBe(expectedMs);
      expect(THIRTY_DAYS_MS).toBe(2592000000);
    });

    it('should have correct TWENTY_FOUR_HOURS_MS value', () => {
      const expectedMs = 1000 * 60 * 60 * 24;
      expect(TWENTY_FOUR_HOURS_MS).toBe(expectedMs);
      expect(TWENTY_FOUR_HOURS_MS).toBe(86400000);
    });

    it('should have time constants in correct order', () => {
      expect(TWENTY_FOUR_HOURS_MS).toBeLessThan(THIRTY_DAYS_MS);
      expect(THIRTY_DAYS_MS).toBeLessThan(ONE_YEAR_MS);
    });
  });

  describe('Axios Configuration', () => {
    it('should have reasonable timeout', () => {
      expect(AXIOS_TIMEOUT_MS).toBe(30000);
      expect(AXIOS_TIMEOUT_MS).toBeGreaterThanOrEqual(10000);
      expect(AXIOS_TIMEOUT_MS).toBeLessThanOrEqual(60000);
    });
  });

  describe('Error Messages', () => {
    it('should have auth error message with code', () => {
      expect(UNAUTHED_ERR_MSG).toContain('login');
      expect(UNAUTHED_ERR_MSG).toContain('10001');
    });

    it('should have admin error message with code', () => {
      expect(NOT_ADMIN_ERR_MSG).toContain('permission');
      expect(NOT_ADMIN_ERR_MSG).toContain('10002');
    });

    it('should have unique error codes', () => {
      const code1 = UNAUTHED_ERR_MSG.match(/\d+/)?.[0];
      const code2 = NOT_ADMIN_ERR_MSG.match(/\d+/)?.[0];
      expect(code1).not.toBe(code2);
    });
  });
});
