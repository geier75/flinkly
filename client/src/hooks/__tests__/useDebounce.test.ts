import { describe, it, expect, vi } from 'vitest';

/**
 * useDebounce Hook Tests
 * 
 * Tests for debounce logic
 */

describe('useDebounce', () => {
  describe('Debounce Logic', () => {
    const createDebounce = <T extends (...args: any[]) => any>(
      fn: T,
      delay: number
    ) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return (...args: Parameters<T>) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    };

    it('should delay function execution', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = createDebounce(fn, 100);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should cancel previous calls', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = createDebounce(fn, 100);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should pass arguments', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = createDebounce(fn, 100);

      debounced('test', 123);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('test', 123);

      vi.useRealTimers();
    });
  });

  describe('Debounced Value', () => {
    const createDebouncedValue = <T>(initialValue: T, delay: number) => {
      let value = initialValue;
      let debouncedValue = initialValue;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return {
        getValue: () => value,
        getDebouncedValue: () => debouncedValue,
        setValue: (newValue: T) => {
          value = newValue;
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            debouncedValue = newValue;
          }, delay);
        },
        flush: () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            debouncedValue = value;
          }
        },
      };
    };

    it('should track immediate and debounced values', () => {
      vi.useFakeTimers();
      const state = createDebouncedValue('initial', 100);

      state.setValue('updated');
      expect(state.getValue()).toBe('updated');
      expect(state.getDebouncedValue()).toBe('initial');

      vi.advanceTimersByTime(100);
      expect(state.getDebouncedValue()).toBe('updated');

      vi.useRealTimers();
    });

    it('should flush immediately', () => {
      const state = createDebouncedValue('initial', 100);
      state.setValue('updated');
      state.flush();
      expect(state.getDebouncedValue()).toBe('updated');
    });
  });
});
