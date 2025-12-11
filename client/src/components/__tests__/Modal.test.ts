import { describe, it, expect, vi } from 'vitest';

/**
 * Modal Component Tests
 * 
 * Tests for modal component logic
 */

describe('Modal Component', () => {
  describe('Modal State', () => {
    const createModalState = (initialOpen: boolean = false) => {
      let isOpen = initialOpen;
      
      return {
        isOpen: () => isOpen,
        open: () => { isOpen = true; },
        close: () => { isOpen = false; },
        toggle: () => { isOpen = !isOpen; },
      };
    };

    it('should start closed by default', () => {
      const modal = createModalState();
      expect(modal.isOpen()).toBe(false);
    });

    it('should start open if specified', () => {
      const modal = createModalState(true);
      expect(modal.isOpen()).toBe(true);
    });

    it('should open and close', () => {
      const modal = createModalState();
      modal.open();
      expect(modal.isOpen()).toBe(true);
      modal.close();
      expect(modal.isOpen()).toBe(false);
    });

    it('should toggle', () => {
      const modal = createModalState();
      modal.toggle();
      expect(modal.isOpen()).toBe(true);
      modal.toggle();
      expect(modal.isOpen()).toBe(false);
    });
  });

  describe('Modal Sizes', () => {
    type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

    const getSizeClasses = (size: ModalSize): string => {
      const sizes: Record<ModalSize, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
      };
      return sizes[size];
    };

    it('should return correct size classes', () => {
      expect(getSizeClasses('sm')).toBe('max-w-sm');
      expect(getSizeClasses('lg')).toBe('max-w-lg');
      expect(getSizeClasses('full')).toContain('max-w-full');
    });
  });

  describe('Modal Overlay', () => {
    const getOverlayClasses = (blur: boolean = true): string => {
      const base = 'fixed inset-0 bg-black/50 z-50';
      return blur ? `${base} backdrop-blur-sm` : base;
    };

    it('should include blur by default', () => {
      expect(getOverlayClasses()).toContain('backdrop-blur-sm');
    });

    it('should exclude blur when disabled', () => {
      expect(getOverlayClasses(false)).not.toContain('backdrop-blur');
    });
  });

  describe('Close on Escape', () => {
    const handleKeyDown = (
      event: { key: string },
      onClose: () => void,
      closeOnEscape: boolean = true
    ) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    it('should call onClose on Escape', () => {
      const onClose = vi.fn();
      handleKeyDown({ key: 'Escape' }, onClose);
      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose on other keys', () => {
      const onClose = vi.fn();
      handleKeyDown({ key: 'Enter' }, onClose);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when disabled', () => {
      const onClose = vi.fn();
      handleKeyDown({ key: 'Escape' }, onClose, false);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Close on Overlay Click', () => {
    const handleOverlayClick = (
      event: { target: any; currentTarget: any },
      onClose: () => void,
      closeOnOverlayClick: boolean = true
    ) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    it('should close on overlay click', () => {
      const onClose = vi.fn();
      const element = {};
      handleOverlayClick({ target: element, currentTarget: element }, onClose);
      expect(onClose).toHaveBeenCalled();
    });

    it('should not close on content click', () => {
      const onClose = vi.fn();
      const overlay = {};
      const content = {};
      handleOverlayClick({ target: content, currentTarget: overlay }, onClose);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Focus Trap', () => {
    const getFocusableElements = (container: { querySelectorAll: (s: string) => any[] }) => {
      const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return container.querySelectorAll(selector);
    };

    it('should find focusable elements', () => {
      const mockContainer = {
        querySelectorAll: vi.fn().mockReturnValue(['button1', 'input1']),
      };
      const elements = getFocusableElements(mockContainer);
      expect(elements.length).toBe(2);
    });
  });

  describe('Body Scroll Lock', () => {
    const lockBodyScroll = () => {
      return {
        lock: () => 'overflow: hidden',
        unlock: () => 'overflow: auto',
      };
    };

    it('should lock scroll', () => {
      const scroll = lockBodyScroll();
      expect(scroll.lock()).toContain('hidden');
    });

    it('should unlock scroll', () => {
      const scroll = lockBodyScroll();
      expect(scroll.unlock()).toContain('auto');
    });
  });

  describe('Animation', () => {
    const getAnimationClasses = (isOpen: boolean, isAnimating: boolean) => {
      if (!isOpen && !isAnimating) return 'hidden';
      if (isOpen) return 'animate-fade-in';
      return 'animate-fade-out';
    };

    it('should be hidden when closed', () => {
      expect(getAnimationClasses(false, false)).toBe('hidden');
    });

    it('should animate in when opening', () => {
      expect(getAnimationClasses(true, true)).toBe('animate-fade-in');
    });

    it('should animate out when closing', () => {
      expect(getAnimationClasses(false, true)).toBe('animate-fade-out');
    });
  });

  describe('Modal Header', () => {
    const createModalHeader = (
      title: string,
      showCloseButton: boolean = true
    ) => ({
      title,
      showCloseButton,
      ariaLabel: `${title} schließen`,
    });

    it('should create header with title', () => {
      const header = createModalHeader('Bestätigung');
      expect(header.title).toBe('Bestätigung');
    });

    it('should include close button by default', () => {
      const header = createModalHeader('Test');
      expect(header.showCloseButton).toBe(true);
    });

    it('should have aria label', () => {
      const header = createModalHeader('Dialog');
      expect(header.ariaLabel).toContain('schließen');
    });
  });

  describe('Confirmation Modal', () => {
    type ConfirmationType = 'info' | 'warning' | 'danger';

    const getConfirmationStyles = (type: ConfirmationType) => {
      const styles: Record<ConfirmationType, { icon: string; buttonClass: string }> = {
        info: { icon: 'ℹ️', buttonClass: 'bg-blue-500' },
        warning: { icon: '⚠️', buttonClass: 'bg-yellow-500' },
        danger: { icon: '🗑️', buttonClass: 'bg-red-500' },
      };
      return styles[type];
    };

    it('should return info styles', () => {
      expect(getConfirmationStyles('info').icon).toBe('ℹ️');
    });

    it('should return danger styles', () => {
      expect(getConfirmationStyles('danger').buttonClass).toContain('red');
    });
  });
});
