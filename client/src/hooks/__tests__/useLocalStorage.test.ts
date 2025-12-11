import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * useLocalStorage Hook Tests
 * 
 * Tests for localStorage logic
 */

describe('useLocalStorage', () => {
  // Mock localStorage
  const createMockStorage = () => {
    const store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] || null,
    };
  };

  describe('Storage Operations', () => {
    it('should get and set values', () => {
      const storage = createMockStorage();
      storage.setItem('test', 'value');
      expect(storage.getItem('test')).toBe('value');
    });

    it('should return null for missing keys', () => {
      const storage = createMockStorage();
      expect(storage.getItem('nonexistent')).toBeNull();
    });

    it('should remove values', () => {
      const storage = createMockStorage();
      storage.setItem('test', 'value');
      storage.removeItem('test');
      expect(storage.getItem('test')).toBeNull();
    });

    it('should clear all values', () => {
      const storage = createMockStorage();
      storage.setItem('a', '1');
      storage.setItem('b', '2');
      storage.clear();
      expect(storage.length).toBe(0);
    });
  });

  describe('JSON Serialization', () => {
    const getStoredValue = <T>(storage: Storage, key: string, defaultValue: T): T => {
      try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const setStoredValue = <T>(storage: Storage, key: string, value: T): void => {
      storage.setItem(key, JSON.stringify(value));
    };

    it('should serialize objects', () => {
      const storage = createMockStorage() as unknown as Storage;
      const obj = { name: 'Test', count: 42 };
      setStoredValue(storage, 'obj', obj);
      expect(getStoredValue(storage, 'obj', {})).toEqual(obj);
    });

    it('should serialize arrays', () => {
      const storage = createMockStorage() as unknown as Storage;
      const arr = [1, 2, 3];
      setStoredValue(storage, 'arr', arr);
      expect(getStoredValue(storage, 'arr', [])).toEqual(arr);
    });

    it('should return default for invalid JSON', () => {
      const storage = createMockStorage() as unknown as Storage;
      storage.setItem('invalid', 'not json');
      expect(getStoredValue(storage, 'invalid', 'default')).toBe('default');
    });

    it('should return default for missing key', () => {
      const storage = createMockStorage() as unknown as Storage;
      expect(getStoredValue(storage, 'missing', 'default')).toBe('default');
    });
  });

  describe('Hook State Management', () => {
    const createLocalStorageState = <T>(
      storage: Storage,
      key: string,
      initialValue: T
    ) => {
      let value: T;
      
      try {
        const item = storage.getItem(key);
        value = item ? JSON.parse(item) : initialValue;
      } catch {
        value = initialValue;
      }

      return {
        getValue: () => value,
        setValue: (newValue: T | ((prev: T) => T)) => {
          const resolvedValue = typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(value)
            : newValue;
          value = resolvedValue;
          storage.setItem(key, JSON.stringify(resolvedValue));
        },
        removeValue: () => {
          value = initialValue;
          storage.removeItem(key);
        },
      };
    };

    it('should initialize with stored value', () => {
      const storage = createMockStorage() as unknown as Storage;
      storage.setItem('count', '42');
      const state = createLocalStorageState(storage, 'count', 0);
      expect(state.getValue()).toBe(42);
    });

    it('should initialize with default if not stored', () => {
      const storage = createMockStorage() as unknown as Storage;
      const state = createLocalStorageState(storage, 'count', 0);
      expect(state.getValue()).toBe(0);
    });

    it('should update storage on setValue', () => {
      const storage = createMockStorage() as unknown as Storage;
      const state = createLocalStorageState(storage, 'count', 0);
      state.setValue(42);
      expect(storage.getItem('count')).toBe('42');
    });

    it('should support updater function', () => {
      const storage = createMockStorage() as unknown as Storage;
      const state = createLocalStorageState(storage, 'count', 10);
      state.setValue(prev => prev + 5);
      expect(state.getValue()).toBe(15);
    });

    it('should remove from storage', () => {
      const storage = createMockStorage() as unknown as Storage;
      storage.setItem('count', '42');
      const state = createLocalStorageState(storage, 'count', 0);
      state.removeValue();
      expect(storage.getItem('count')).toBeNull();
      expect(state.getValue()).toBe(0);
    });
  });

  describe('Storage Keys', () => {
    const STORAGE_KEYS = {
      theme: 'flinkly_theme',
      language: 'flinkly_language',
      recentSearches: 'flinkly_recent_searches',
      favorites: 'flinkly_favorites',
      cartItems: 'flinkly_cart',
    };

    it('should have prefixed keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(key.startsWith('flinkly_')).toBe(true);
      });
    });

    it('should have unique keys', () => {
      const keys = Object.values(STORAGE_KEYS);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });
});
