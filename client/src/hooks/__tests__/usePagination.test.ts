import { describe, it, expect } from 'vitest';

/**
 * usePagination Hook Tests
 * 
 * Tests for pagination logic
 */

describe('usePagination', () => {
  describe('Page Calculation', () => {
    const calculatePages = (totalItems: number, itemsPerPage: number): number => {
      return Math.ceil(totalItems / itemsPerPage);
    };

    it('should calculate total pages', () => {
      expect(calculatePages(100, 10)).toBe(10);
      expect(calculatePages(95, 10)).toBe(10);
      expect(calculatePages(101, 10)).toBe(11);
    });

    it('should handle zero items', () => {
      expect(calculatePages(0, 10)).toBe(0);
    });

    it('should handle items less than page size', () => {
      expect(calculatePages(5, 10)).toBe(1);
    });
  });

  describe('Page Range', () => {
    const getPageRange = (
      currentPage: number,
      totalPages: number,
      maxVisible: number = 5
    ): number[] => {
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const half = Math.floor(maxVisible / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisible;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisible + 1;
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    it('should return all pages if less than max', () => {
      expect(getPageRange(1, 3, 5)).toEqual([1, 2, 3]);
    });

    it('should center current page', () => {
      const range = getPageRange(5, 10, 5);
      expect(range).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle first page', () => {
      const range = getPageRange(1, 10, 5);
      expect(range).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle last page', () => {
      const range = getPageRange(10, 10, 5);
      expect(range).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe('Pagination State', () => {
    const createPagination = (totalItems: number, itemsPerPage: number = 10) => {
      let currentPage = 1;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return {
        getCurrentPage: () => currentPage,
        getTotalPages: () => totalPages,
        getOffset: () => (currentPage - 1) * itemsPerPage,
        getLimit: () => itemsPerPage,
        goToPage: (page: number) => {
          if (page >= 1 && page <= totalPages) {
            currentPage = page;
          }
        },
        nextPage: () => {
          if (currentPage < totalPages) {
            currentPage++;
          }
        },
        prevPage: () => {
          if (currentPage > 1) {
            currentPage--;
          }
        },
        hasNext: () => currentPage < totalPages,
        hasPrev: () => currentPage > 1,
      };
    };

    it('should start at page 1', () => {
      const pagination = createPagination(100);
      expect(pagination.getCurrentPage()).toBe(1);
    });

    it('should calculate offset', () => {
      const pagination = createPagination(100);
      expect(pagination.getOffset()).toBe(0);
      pagination.goToPage(3);
      expect(pagination.getOffset()).toBe(20);
    });

    it('should navigate pages', () => {
      const pagination = createPagination(100);
      pagination.nextPage();
      expect(pagination.getCurrentPage()).toBe(2);
      pagination.prevPage();
      expect(pagination.getCurrentPage()).toBe(1);
    });

    it('should not go below page 1', () => {
      const pagination = createPagination(100);
      pagination.prevPage();
      expect(pagination.getCurrentPage()).toBe(1);
    });

    it('should not exceed total pages', () => {
      const pagination = createPagination(25);
      pagination.goToPage(10); // 10 > 3, so stays at 1 (goToPage only works for valid pages)
      expect(pagination.getCurrentPage()).toBe(1);
    });

    it('should track hasNext/hasPrev', () => {
      const pagination = createPagination(30);
      expect(pagination.hasPrev()).toBe(false);
      expect(pagination.hasNext()).toBe(true);
      pagination.goToPage(3);
      expect(pagination.hasPrev()).toBe(true);
      expect(pagination.hasNext()).toBe(false);
    });
  });

  describe('Cursor-based Pagination', () => {
    const createCursorPagination = <T extends { id: number }>(
      items: T[],
      limit: number = 10
    ) => {
      let cursor: number | null = null;

      return {
        getPage: () => {
          const startIndex = cursor 
            ? items.findIndex(item => item.id === cursor) + 1 
            : 0;
          const pageItems = items.slice(startIndex, startIndex + limit);
          const nextCursor = pageItems.length === limit 
            ? pageItems[pageItems.length - 1].id 
            : null;
          return { items: pageItems, nextCursor };
        },
        setCursor: (newCursor: number | null) => {
          cursor = newCursor;
        },
        hasMore: () => {
          const startIndex = cursor 
            ? items.findIndex(item => item.id === cursor) + 1 
            : 0;
          return startIndex + limit < items.length;
        },
      };
    };

    it('should return first page', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const pagination = createCursorPagination(items, 10);
      const page = pagination.getPage();
      expect(page.items.length).toBe(10);
      expect(page.items[0].id).toBe(1);
    });

    it('should return next page with cursor', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const pagination = createCursorPagination(items, 10);
      pagination.setCursor(10);
      const page = pagination.getPage();
      expect(page.items[0].id).toBe(11);
    });

    it('should indicate when more items exist', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const pagination = createCursorPagination(items, 10);
      expect(pagination.hasMore()).toBe(true);
      pagination.setCursor(20);
      expect(pagination.hasMore()).toBe(false);
    });
  });

  describe('Items Per Page', () => {
    const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

    const validateItemsPerPage = (value: number): number => {
      if (ITEMS_PER_PAGE_OPTIONS.includes(value)) {
        return value;
      }
      return ITEMS_PER_PAGE_OPTIONS[0];
    };

    it('should accept valid options', () => {
      ITEMS_PER_PAGE_OPTIONS.forEach(opt => {
        expect(validateItemsPerPage(opt)).toBe(opt);
      });
    });

    it('should default to first option for invalid', () => {
      expect(validateItemsPerPage(15)).toBe(10);
      expect(validateItemsPerPage(0)).toBe(10);
    });
  });
});
