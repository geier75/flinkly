import { describe, it, expect } from 'vitest';

/**
 * Client Validation Tests
 * 
 * Tests for client-side form validation
 */

describe('Client Validation', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('should accept valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (password.length < 8) {
        errors.push('Mindestens 8 Zeichen');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Ein Großbuchstabe erforderlich');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Ein Kleinbuchstabe erforderlich');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Eine Zahl erforderlich');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Ein Sonderzeichen erforderlich');
      }

      return { valid: errors.length === 0, errors };
    };

    it('should accept strong password', () => {
      expect(validatePassword('SecureP@ss1').valid).toBe(true);
    });

    it('should reject weak password', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should list all missing requirements', () => {
      const result = validatePassword('password');
      expect(result.errors).toContain('Ein Großbuchstabe erforderlich');
      expect(result.errors).toContain('Eine Zahl erforderlich');
    });
  });

  describe('Phone Validation', () => {
    const isValidPhone = (phone: string): boolean => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 10 && cleaned.length <= 15;
    };

    it('should accept valid phone numbers', () => {
      expect(isValidPhone('+49 171 1234567')).toBe(true);
      expect(isValidPhone('0171-1234567')).toBe(true);
      expect(isValidPhone('01711234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('should accept valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://sub.domain.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('Required Field', () => {
    const isRequired = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    };

    it('should detect empty values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired([])).toBe(false);
    });

    it('should accept non-empty values', () => {
      expect(isRequired('hello')).toBe(true);
      expect(isRequired(0)).toBe(true);
      expect(isRequired([1])).toBe(true);
    });
  });

  describe('Min/Max Length', () => {
    const validateLength = (
      value: string,
      min?: number,
      max?: number
    ): { valid: boolean; error?: string } => {
      if (min !== undefined && value.length < min) {
        return { valid: false, error: `Mindestens ${min} Zeichen` };
      }
      if (max !== undefined && value.length > max) {
        return { valid: false, error: `Maximal ${max} Zeichen` };
      }
      return { valid: true };
    };

    it('should validate minimum length', () => {
      expect(validateLength('ab', 3).valid).toBe(false);
      expect(validateLength('abc', 3).valid).toBe(true);
    });

    it('should validate maximum length', () => {
      expect(validateLength('abcdef', undefined, 5).valid).toBe(false);
      expect(validateLength('abcde', undefined, 5).valid).toBe(true);
    });

    it('should validate range', () => {
      expect(validateLength('abc', 2, 5).valid).toBe(true);
      expect(validateLength('a', 2, 5).valid).toBe(false);
      expect(validateLength('abcdef', 2, 5).valid).toBe(false);
    });
  });

  describe('Number Range', () => {
    const validateNumber = (
      value: number,
      min?: number,
      max?: number
    ): { valid: boolean; error?: string } => {
      if (isNaN(value)) {
        return { valid: false, error: 'Ungültige Zahl' };
      }
      if (min !== undefined && value < min) {
        return { valid: false, error: `Minimum ist ${min}` };
      }
      if (max !== undefined && value > max) {
        return { valid: false, error: `Maximum ist ${max}` };
      }
      return { valid: true };
    };

    it('should validate minimum', () => {
      expect(validateNumber(5, 10).valid).toBe(false);
      expect(validateNumber(10, 10).valid).toBe(true);
    });

    it('should validate maximum', () => {
      expect(validateNumber(15, undefined, 10).valid).toBe(false);
      expect(validateNumber(10, undefined, 10).valid).toBe(true);
    });

    it('should reject NaN', () => {
      expect(validateNumber(NaN).valid).toBe(false);
    });
  });

  describe('Form Validation', () => {
    type ValidationRule = {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: any) => string | null;
    };

    const validateField = (value: any, rules: ValidationRule): string | null => {
      if (rules.required && !value) {
        return 'Pflichtfeld';
      }
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          return `Mindestens ${rules.minLength} Zeichen`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          return `Maximal ${rules.maxLength} Zeichen`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          return 'Ungültiges Format';
        }
      }
      if (rules.custom) {
        return rules.custom(value);
      }
      return null;
    };

    it('should validate required field', () => {
      expect(validateField('', { required: true })).toBe('Pflichtfeld');
      expect(validateField('value', { required: true })).toBeNull();
    });

    it('should validate pattern', () => {
      expect(validateField('abc', { pattern: /^\d+$/ })).toBe('Ungültiges Format');
      expect(validateField('123', { pattern: /^\d+$/ })).toBeNull();
    });

    it('should run custom validation', () => {
      const customRule = {
        custom: (v: string) => v === 'forbidden' ? 'Nicht erlaubt' : null,
      };
      expect(validateField('forbidden', customRule)).toBe('Nicht erlaubt');
      expect(validateField('allowed', customRule)).toBeNull();
    });
  });

  describe('File Validation', () => {
    const validateFile = (
      file: { name: string; size: number; type: string },
      options: {
        maxSize?: number;
        allowedTypes?: string[];
      }
    ): { valid: boolean; error?: string } => {
      if (options.maxSize && file.size > options.maxSize) {
        return { valid: false, error: 'Datei zu groß' };
      }
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Dateityp nicht erlaubt' };
      }
      return { valid: true };
    };

    it('should validate file size', () => {
      expect(validateFile(
        { name: 'test.jpg', size: 10 * 1024 * 1024, type: 'image/jpeg' },
        { maxSize: 5 * 1024 * 1024 }
      ).valid).toBe(false);
    });

    it('should validate file type', () => {
      expect(validateFile(
        { name: 'test.exe', size: 1024, type: 'application/exe' },
        { allowedTypes: ['image/jpeg', 'image/png'] }
      ).valid).toBe(false);
    });

    it('should accept valid file', () => {
      expect(validateFile(
        { name: 'test.jpg', size: 1024, type: 'image/jpeg' },
        { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/jpeg'] }
      ).valid).toBe(true);
    });
  });
});
