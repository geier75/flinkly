import { describe, it, expect } from 'vitest';

/**
 * Pagination Component Tests
 * 
 * Tests for pagination logic
 */

describe('Pagination Component', () => {
  describe('Page Calculation', () => {
    const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
      return Math.ceil(totalItems / itemsPerPage);
    };

    it('should calculate total pages', () => {
      expect(calculateTotalPages(100, 10)).toBe(10);
      expect(calculateTotalPages(95, 10)).toBe(10);
      expect(calculateTotalPages(101, 10)).toBe(11);
    });

    it('should handle zero items', () => {
      expect(calculateTotalPages(0, 10)).toBe(0);
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

    it('should show all pages when few', () => {
      expect(getPageRange(1, 3)).toEqual([1, 2, 3]);
    });

    it('should center around current page', () => {
      const range = getPageRange(5, 10);
      expect(range).toContain(5);
      expect(range.length).toBe(5);
    });

    it('should handle first page', () => {
      const range = getPageRange(1, 10);
      expect(range[0]).toBe(1);
    });

    it('should handle last page', () => {
      const range = getPageRange(10, 10);
      expect(range[range.length - 1]).toBe(10);
    });
  });

  describe('Navigation State', () => {
    const getNavigationState = (currentPage: number, totalPages: number) => ({
      canGoPrevious: currentPage > 1,
      canGoNext: currentPage < totalPages,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    });

    it('should detect first page', () => {
      const state = getNavigationState(1, 10);
      expect(state.isFirstPage).toBe(true);
      expect(state.canGoPrevious).toBe(false);
    });

    it('should detect last page', () => {
      const state = getNavigationState(10, 10);
      expect(state.isLastPage).toBe(true);
      expect(state.canGoNext).toBe(false);
    });

    it('should allow navigation in middle', () => {
      const state = getNavigationState(5, 10);
      expect(state.canGoPrevious).toBe(true);
      expect(state.canGoNext).toBe(true);
    });
  });

  describe('Items Per Page', () => {
    const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

    const validateItemsPerPage = (value: number): number => {
      if (ITEMS_PER_PAGE_OPTIONS.includes(value)) return value;
      return ITEMS_PER_PAGE_OPTIONS[0];
    };

    it('should accept valid options', () => {
      expect(validateItemsPerPage(25)).toBe(25);
    });

    it('should default for invalid', () => {
      expect(validateItemsPerPage(15)).toBe(10);
    });
  });

  describe('Offset Calculation', () => {
    const calculateOffset = (page: number, itemsPerPage: number): number => {
      return (page - 1) * itemsPerPage;
    };

    it('should calculate offset', () => {
      expect(calculateOffset(1, 10)).toBe(0);
      expect(calculateOffset(2, 10)).toBe(10);
      expect(calculateOffset(5, 25)).toBe(100);
    });
  });

  describe('Display Range', () => {
    const getDisplayRange = (
      currentPage: number,
      itemsPerPage: number,
      totalItems: number
    ) => {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      return { start, end, total: totalItems };
    };

    it('should calculate display range', () => {
      const range = getDisplayRange(1, 10, 95);
      expect(range.start).toBe(1);
      expect(range.end).toBe(10);
    });

    it('should handle last page', () => {
      const range = getDisplayRange(10, 10, 95);
      expect(range.start).toBe(91);
      expect(range.end).toBe(95);
    });
  });

  describe('URL Params', () => {
    const buildPaginationUrl = (
      basePath: string,
      page: number,
      params: Record<string, string> = {}
    ): string => {
      const searchParams = new URLSearchParams(params);
      if (page > 1) {
        searchParams.set('page', page.toString());
      }
      const queryString = searchParams.toString();
      return queryString ? `${basePath}?${queryString}` : basePath;
    };

    it('should build URL without page for first page', () => {
      expect(buildPaginationUrl('/gigs', 1)).toBe('/gigs');
    });

    it('should include page param', () => {
      expect(buildPaginationUrl('/gigs', 2)).toBe('/gigs?page=2');
    });

    it('should preserve other params', () => {
      const url = buildPaginationUrl('/gigs', 2, { category: 'design' });
      expect(url).toContain('category=design');
      expect(url).toContain('page=2');
    });
  });

  describe('Ellipsis', () => {
    const getPageNumbers = (
      currentPage: number,
      totalPages: number
    ): (number | 'ellipsis')[] => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | 'ellipsis')[] = [1];

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);

      return pages;
    };

    it('should show all pages when few', () => {
      const pages = getPageNumbers(1, 5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show ellipsis for many pages', () => {
      const pages = getPageNumbers(5, 10);
      expect(pages).toContain('ellipsis');
    });

    it('should always show first and last', () => {
      const pages = getPageNumbers(5, 10);
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(10);
    });
  });

  describe('Keyboard Navigation', () => {
    const handleKeyboardNavigation = (
      key: string,
      currentPage: number,
      totalPages: number
    ): number => {
      switch (key) {
        case 'ArrowLeft':
          return Math.max(1, currentPage - 1);
        case 'ArrowRight':
          return Math.min(totalPages, currentPage + 1);
        case 'Home':
          return 1;
        case 'End':
          return totalPages;
        default:
          return currentPage;
      }
    };

    it('should navigate with arrow keys', () => {
      expect(handleKeyboardNavigation('ArrowRight', 1, 10)).toBe(2);
      expect(handleKeyboardNavigation('ArrowLeft', 5, 10)).toBe(4);
    });

    it('should go to first/last with Home/End', () => {
      expect(handleKeyboardNavigation('Home', 5, 10)).toBe(1);
      expect(handleKeyboardNavigation('End', 5, 10)).toBe(10);
    });

    it('should not exceed bounds', () => {
      expect(handleKeyboardNavigation('ArrowLeft', 1, 10)).toBe(1);
      expect(handleKeyboardNavigation('ArrowRight', 10, 10)).toBe(10);
    });
  });
});
