import { describe, it, expect, vi } from 'vitest';

/**
 * Input Component Tests
 * 
 * Tests for input component logic
 */

describe('Input Component', () => {
  describe('Input Types', () => {
    const INPUT_TYPES = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];

    it('should support all common types', () => {
      expect(INPUT_TYPES).toContain('text');
      expect(INPUT_TYPES).toContain('email');
      expect(INPUT_TYPES).toContain('password');
    });
  });

  describe('Input Validation', () => {
    const validateInput = (
      value: string,
      type: string
    ): { valid: boolean; error?: string } => {
      if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { valid: false, error: 'Ungültige E-Mail-Adresse' };
        }
      }
      
      if (type === 'url') {
        try {
          new URL(value);
        } catch {
          return { valid: false, error: 'Ungültige URL' };
        }
      }
      
      return { valid: true };
    };

    it('should validate email', () => {
      expect(validateInput('test@example.com', 'email').valid).toBe(true);
      expect(validateInput('invalid', 'email').valid).toBe(false);
    });

    it('should validate URL', () => {
      expect(validateInput('https://example.com', 'url').valid).toBe(true);
      expect(validateInput('not-a-url', 'url').valid).toBe(false);
    });

    it('should accept any text', () => {
      expect(validateInput('anything', 'text').valid).toBe(true);
    });
  });

  describe('Input States', () => {
    const getInputClasses = (state: {
      error?: boolean;
      disabled?: boolean;
      focused?: boolean;
    }): string => {
      const classes: string[] = ['border rounded-md px-3 py-2'];
      
      if (state.error) {
        classes.push('border-red-500 focus:ring-red-500');
      } else {
        classes.push('border-gray-300 focus:ring-blue-500');
      }
      
      if (state.disabled) {
        classes.push('bg-gray-100 cursor-not-allowed opacity-50');
      }
      
      if (state.focused) {
        classes.push('ring-2');
      }
      
      return classes.join(' ');
    };

    it('should have error styles', () => {
      expect(getInputClasses({ error: true })).toContain('border-red-500');
    });

    it('should have disabled styles', () => {
      expect(getInputClasses({ disabled: true })).toContain('cursor-not-allowed');
    });

    it('should have focus styles', () => {
      expect(getInputClasses({ focused: true })).toContain('ring-2');
    });
  });

  describe('Input with Label', () => {
    const createInputWithLabel = (
      id: string,
      label: string,
      required: boolean = false
    ) => ({
      id,
      label,
      required,
      labelText: required ? `${label} *` : label,
    });

    it('should create label with asterisk for required', () => {
      const input = createInputWithLabel('email', 'E-Mail', true);
      expect(input.labelText).toContain('*');
    });

    it('should create label without asterisk for optional', () => {
      const input = createInputWithLabel('name', 'Name', false);
      expect(input.labelText).not.toContain('*');
    });
  });

  describe('Input with Icon', () => {
    const getInputPadding = (iconPosition?: 'left' | 'right'): string => {
      if (iconPosition === 'left') {
        return 'pl-10 pr-3';
      }
      if (iconPosition === 'right') {
        return 'pl-3 pr-10';
      }
      return 'px-3';
    };

    it('should add left padding for left icon', () => {
      expect(getInputPadding('left')).toContain('pl-10');
    });

    it('should add right padding for right icon', () => {
      expect(getInputPadding('right')).toContain('pr-10');
    });

    it('should use default padding without icon', () => {
      expect(getInputPadding()).toBe('px-3');
    });
  });

  describe('Password Toggle', () => {
    const createPasswordInput = () => {
      let showPassword = false;
      
      return {
        getType: () => showPassword ? 'text' : 'password',
        toggle: () => { showPassword = !showPassword; },
        isVisible: () => showPassword,
      };
    };

    it('should start with hidden password', () => {
      const input = createPasswordInput();
      expect(input.getType()).toBe('password');
      expect(input.isVisible()).toBe(false);
    });

    it('should toggle visibility', () => {
      const input = createPasswordInput();
      input.toggle();
      expect(input.getType()).toBe('text');
      expect(input.isVisible()).toBe(true);
    });

    it('should toggle back', () => {
      const input = createPasswordInput();
      input.toggle();
      input.toggle();
      expect(input.getType()).toBe('password');
    });
  });

  describe('Character Counter', () => {
    const getCharacterCount = (value: string, maxLength: number) => ({
      current: value.length,
      max: maxLength,
      remaining: maxLength - value.length,
      isOverLimit: value.length > maxLength,
      display: `${value.length}/${maxLength}`,
    });

    it('should count characters', () => {
      const count = getCharacterCount('Hello', 100);
      expect(count.current).toBe(5);
      expect(count.remaining).toBe(95);
    });

    it('should detect over limit', () => {
      const count = getCharacterCount('Too long', 5);
      expect(count.isOverLimit).toBe(true);
    });

    it('should format display', () => {
      const count = getCharacterCount('Test', 100);
      expect(count.display).toBe('4/100');
    });
  });

  describe('Input Masking', () => {
    const maskPhone = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    };

    it('should mask phone number', () => {
      expect(maskPhone('1234567890')).toBe('123 456 7890');
    });

    it('should handle partial input', () => {
      expect(maskPhone('123')).toBe('123');
      expect(maskPhone('12345')).toBe('123 45');
    });

    it('should strip non-digits', () => {
      expect(maskPhone('123-456-7890')).toBe('123 456 7890');
    });
  });

  describe('Autocomplete', () => {
    const AUTOCOMPLETE_VALUES = {
      name: 'name',
      email: 'email',
      tel: 'tel',
      address: 'street-address',
      city: 'address-level2',
      postalCode: 'postal-code',
      country: 'country',
      newPassword: 'new-password',
      currentPassword: 'current-password',
    };

    it('should have correct autocomplete values', () => {
      expect(AUTOCOMPLETE_VALUES.email).toBe('email');
      expect(AUTOCOMPLETE_VALUES.newPassword).toBe('new-password');
    });
  });
});
