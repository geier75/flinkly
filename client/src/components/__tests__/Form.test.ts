import { describe, it, expect, vi } from 'vitest';

/**
 * Form Component Tests
 * 
 * Tests for form handling logic
 */

describe('Form Components', () => {
  describe('Form State', () => {
    const createFormState = <T extends Record<string, any>>(initialValues: T) => {
      let values = { ...initialValues };
      let errors: Partial<Record<keyof T, string>> = {};
      let touched: Partial<Record<keyof T, boolean>> = {};

      return {
        getValues: () => values,
        getErrors: () => errors,
        getTouched: () => touched,
        setValue: (field: keyof T, value: any) => {
          values = { ...values, [field]: value };
        },
        setError: (field: keyof T, error: string) => {
          errors = { ...errors, [field]: error };
        },
        setTouched: (field: keyof T) => {
          touched = { ...touched, [field]: true };
        },
        reset: () => {
          values = { ...initialValues };
          errors = {};
          touched = {};
        },
      };
    };

    it('should initialize with values', () => {
      const form = createFormState({ name: '', email: '' });
      expect(form.getValues()).toEqual({ name: '', email: '' });
    });

    it('should update values', () => {
      const form = createFormState({ name: '' });
      form.setValue('name', 'Max');
      expect(form.getValues().name).toBe('Max');
    });

    it('should track errors', () => {
      const form = createFormState({ email: '' });
      form.setError('email', 'Ungültige E-Mail');
      expect(form.getErrors().email).toBe('Ungültige E-Mail');
    });

    it('should reset form', () => {
      const form = createFormState({ name: '' });
      form.setValue('name', 'Max');
      form.reset();
      expect(form.getValues().name).toBe('');
    });
  });

  describe('Field Validation', () => {
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

    it('should validate required', () => {
      expect(validateField('', { required: true })).toBe('Pflichtfeld');
      expect(validateField('value', { required: true })).toBeNull();
    });

    it('should validate minLength', () => {
      expect(validateField('ab', { minLength: 3 })).toBe('Mindestens 3 Zeichen');
    });

    it('should validate pattern', () => {
      expect(validateField('abc', { pattern: /^\d+$/ })).toBe('Ungültiges Format');
    });

    it('should run custom validation', () => {
      const rule = { custom: (v: string) => v === 'bad' ? 'Nicht erlaubt' : null };
      expect(validateField('bad', rule)).toBe('Nicht erlaubt');
    });
  });

  describe('Form Submission', () => {
    const createSubmitHandler = <T>(
      onSubmit: (values: T) => Promise<void>,
      validate: (values: T) => Record<string, string>
    ) => {
      let isSubmitting = false;
      let submitError: string | null = null;

      return {
        isSubmitting: () => isSubmitting,
        getError: () => submitError,
        submit: async (values: T) => {
          const errors = validate(values);
          if (Object.keys(errors).length > 0) {
            return { success: false, errors };
          }

          isSubmitting = true;
          submitError = null;

          try {
            await onSubmit(values);
            return { success: true, errors: {} };
          } catch (error) {
            submitError = error instanceof Error ? error.message : 'Fehler';
            return { success: false, errors: { _form: submitError } };
          } finally {
            isSubmitting = false;
          }
        },
      };
    };

    it('should handle successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const validate = () => ({});
      const handler = createSubmitHandler(onSubmit, validate);

      const result = await handler.submit({ name: 'Max' });
      expect(result.success).toBe(true);
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const onSubmit = vi.fn();
      const validate = () => ({ name: 'Pflichtfeld' });
      const handler = createSubmitHandler(onSubmit, validate);

      const result = await handler.submit({ name: '' });
      expect(result.success).toBe(false);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should handle submission errors', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Server error'));
      const validate = () => ({});
      const handler = createSubmitHandler(onSubmit, validate);

      const result = await handler.submit({ name: 'Max' });
      expect(result.success).toBe(false);
      expect(result.errors._form).toBe('Server error');
    });
  });

  describe('Input Masking', () => {
    const masks = {
      phone: (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
      },
      creditCard: (value: string) => {
        const digits = value.replace(/\D/g, '');
        return digits.match(/.{1,4}/g)?.join(' ') || digits;
      },
      date: (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
        return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
      },
    };

    it('should mask phone number', () => {
      expect(masks.phone('1234567890')).toBe('123 456 7890');
    });

    it('should mask credit card', () => {
      expect(masks.creditCard('1234567890123456')).toBe('1234 5678 9012 3456');
    });

    it('should mask date', () => {
      expect(masks.date('15012024')).toBe('15.01.2024');
    });
  });

  describe('Form Dirty State', () => {
    const isDirty = <T extends Record<string, any>>(
      currentValues: T,
      initialValues: T
    ): boolean => {
      return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    };

    it('should detect dirty form', () => {
      expect(isDirty({ name: 'Max' }, { name: '' })).toBe(true);
    });

    it('should detect clean form', () => {
      expect(isDirty({ name: '' }, { name: '' })).toBe(false);
    });
  });

  describe('Form Arrays', () => {
    const createArrayField = <T>(initialItems: T[] = []) => {
      let items = [...initialItems];

      return {
        getItems: () => items,
        add: (item: T) => { items = [...items, item]; },
        remove: (index: number) => { items = items.filter((_, i) => i !== index); },
        update: (index: number, item: T) => {
          items = items.map((existing, i) => i === index ? item : existing);
        },
        move: (from: number, to: number) => {
          const newItems = [...items];
          const [removed] = newItems.splice(from, 1);
          newItems.splice(to, 0, removed);
          items = newItems;
        },
      };
    };

    it('should add items', () => {
      const field = createArrayField<string>([]);
      field.add('item1');
      expect(field.getItems()).toEqual(['item1']);
    });

    it('should remove items', () => {
      const field = createArrayField(['a', 'b', 'c']);
      field.remove(1);
      expect(field.getItems()).toEqual(['a', 'c']);
    });

    it('should update items', () => {
      const field = createArrayField(['a', 'b']);
      field.update(1, 'updated');
      expect(field.getItems()).toEqual(['a', 'updated']);
    });

    it('should move items', () => {
      const field = createArrayField(['a', 'b', 'c']);
      field.move(0, 2);
      expect(field.getItems()).toEqual(['b', 'c', 'a']);
    });
  });

  describe('Autosave', () => {
    const createAutosave = (saveDelay: number = 1000) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let lastSavedValues: any = null;

      return {
        schedule: (values: any, onSave: (values: any) => void) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (JSON.stringify(values) !== JSON.stringify(lastSavedValues)) {
              onSave(values);
              lastSavedValues = values;
            }
          }, saveDelay);
        },
        cancel: () => {
          if (timeoutId) clearTimeout(timeoutId);
        },
        getLastSaved: () => lastSavedValues,
      };
    };

    it('should create autosave handler', () => {
      const autosave = createAutosave(500);
      expect(autosave.getLastSaved()).toBeNull();
    });
  });
});
