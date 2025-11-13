/**
 * Form Validation Hook
 * 
 * Best Practices 2025 (H5: Error-Prevention):
 * - Inline-Validation (während Eingabe)
 * - Visuelles Feedback (Icons, Farben)
 * - Spezifische Error-Messages
 * - Positive Bestätigung bei korrekter Eingabe
 * - Debouncing für Performance
 */

import { useState, useEffect, useCallback } from 'react';
import { ERRORS } from '@/lib/microcopy';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null; // Returns error message or null
}

export interface FieldValidation {
  value: any;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface FormValidation {
  [key: string]: FieldValidation;
}

/**
 * Hook for form validation with inline feedback
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<keyof T, ValidationRule>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate single field
   */
  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rule = rules[name];
      if (!rule) return null;

      // Required
      if (rule.required && !value) {
        return ERRORS.required(String(name));
      }

      // Skip other validations if empty and not required
      if (!value && !rule.required) {
        return null;
      }

      // Min Length
      if (rule.minLength && String(value).length < rule.minLength) {
        return ERRORS.minLength(String(name), rule.minLength);
      }

      // Max Length
      if (rule.maxLength && String(value).length > rule.maxLength) {
        return ERRORS.maxLength(String(name), rule.maxLength);
      }

      // Min Value
      if (rule.minValue !== undefined && Number(value) < rule.minValue) {
        return ERRORS.minValue(String(name), rule.minValue);
      }

      // Max Value
      if (rule.maxValue !== undefined && Number(value) > rule.maxValue) {
        return ERRORS.maxValue(String(name), rule.maxValue);
      }

      // Pattern
      if (rule.pattern && !rule.pattern.test(String(value))) {
        // Check for common patterns
        if (rule.pattern.source.includes('@')) {
          return ERRORS.invalidEmail;
        }
        if (rule.pattern.source.includes('http')) {
          return ERRORS.invalidUrl;
        }
        return `${String(name)} hat ein ungültiges Format`;
      }

      // Custom Validation
      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [rules]
  );

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if field was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateField]
  );

  /**
   * Validate all fields
   */
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<keyof T, string | null> = {} as any;
    let hasErrors = false;

    for (const name in rules) {
      const error = validateField(name, values[name]);
      newErrors[name] = error;
      if (error) hasErrors = true;
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {} as any)
    );

    return !hasErrors;
  }, [rules, values, validateField]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      setIsSubmitting(true);

      try {
        const isValid = validateAll();
        if (!isValid) {
          setIsSubmitting(false);
          return;
        }

        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll]
  );

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as any);
    setTouched({} as any);
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Get field props (for easy integration with inputs)
   */
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] : null,
      valid: touched[name] && !errors[name],
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  /**
   * Check if form is valid
   */
  const isValid = Object.values(errors).every((error) => !error);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset,
    getFieldProps,
  };
}

/**
 * Debounced validation hook (for expensive validations)
 */
export function useDebouncedValidation(
  value: any,
  validate: (value: any) => string | null,
  delay: number = 500
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsValidating(true);
    const timer = setTimeout(() => {
      const validationError = validate(value);
      setError(validationError);
      setIsValidating(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, validate, delay]);

  return { error, isValidating };
}

/**
 * Async validation hook (for server-side validations)
 */
export function useAsyncValidation(
  value: any,
  validate: (value: any) => Promise<string | null>,
  delay: number = 500
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!value) {
      setError(null);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(async () => {
      try {
        const validationError = await validate(value);
        setError(validationError);
      } catch (err) {
        setError('Validierung fehlgeschlagen');
      } finally {
        setIsValidating(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, validate, delay]);

  return { error, isValidating };
}
