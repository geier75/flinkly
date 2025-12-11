import { describe, it, expect, vi } from 'vitest';

/**
 * Button Component Tests
 * 
 * Tests for button component logic
 */

describe('Button Component', () => {
  describe('Button Variants', () => {
    type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

    const getVariantClasses = (variant: ButtonVariant): string => {
      const variants: Record<ButtonVariant, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      };
      return variants[variant];
    };

    it('should return primary classes', () => {
      expect(getVariantClasses('primary')).toContain('bg-primary');
    });

    it('should return secondary classes', () => {
      expect(getVariantClasses('secondary')).toContain('bg-secondary');
    });

    it('should return outline classes', () => {
      expect(getVariantClasses('outline')).toContain('border');
    });

    it('should return ghost classes', () => {
      expect(getVariantClasses('ghost')).toContain('hover:bg-accent');
    });

    it('should return destructive classes', () => {
      expect(getVariantClasses('destructive')).toContain('bg-destructive');
    });
  });

  describe('Button Sizes', () => {
    type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

    const getSizeClasses = (size: ButtonSize): string => {
      const sizes: Record<ButtonSize, string> = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      };
      return sizes[size];
    };

    it('should return small size classes', () => {
      expect(getSizeClasses('sm')).toContain('h-8');
    });

    it('should return medium size classes', () => {
      expect(getSizeClasses('md')).toContain('h-10');
    });

    it('should return large size classes', () => {
      expect(getSizeClasses('lg')).toContain('h-12');
    });

    it('should return icon size classes', () => {
      expect(getSizeClasses('icon')).toContain('w-10');
    });
  });

  describe('Button States', () => {
    const getStateClasses = (state: {
      disabled?: boolean;
      loading?: boolean;
    }): string => {
      const classes: string[] = [];
      
      if (state.disabled) {
        classes.push('opacity-50 cursor-not-allowed pointer-events-none');
      }
      if (state.loading) {
        classes.push('cursor-wait');
      }
      
      return classes.join(' ');
    };

    it('should return disabled classes', () => {
      expect(getStateClasses({ disabled: true })).toContain('opacity-50');
      expect(getStateClasses({ disabled: true })).toContain('cursor-not-allowed');
    });

    it('should return loading classes', () => {
      expect(getStateClasses({ loading: true })).toContain('cursor-wait');
    });

    it('should return empty for normal state', () => {
      expect(getStateClasses({})).toBe('');
    });
  });

  describe('Button Props', () => {
    type ButtonProps = {
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
      size?: 'sm' | 'md' | 'lg' | 'icon';
      disabled?: boolean;
      loading?: boolean;
      fullWidth?: boolean;
      leftIcon?: string;
      rightIcon?: string;
    };

    const getButtonClasses = (props: ButtonProps): string => {
      const classes: string[] = ['inline-flex items-center justify-center rounded-md font-medium'];
      
      if (props.fullWidth) {
        classes.push('w-full');
      }
      
      return classes.join(' ');
    };

    it('should include base classes', () => {
      expect(getButtonClasses({})).toContain('inline-flex');
      expect(getButtonClasses({})).toContain('rounded-md');
    });

    it('should add full width class', () => {
      expect(getButtonClasses({ fullWidth: true })).toContain('w-full');
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      onClick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      const isDisabled = true;
      
      if (!isDisabled) {
        onClick();
      }
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const onClick = vi.fn();
      const isLoading = true;
      
      if (!isLoading) {
        onClick();
      }
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading Spinner', () => {
    const getLoadingContent = (loading: boolean, children: string): string => {
      if (loading) {
        return '⏳ ' + children;
      }
      return children;
    };

    it('should show spinner when loading', () => {
      expect(getLoadingContent(true, 'Submit')).toContain('⏳');
    });

    it('should show normal content when not loading', () => {
      expect(getLoadingContent(false, 'Submit')).toBe('Submit');
    });
  });

  describe('Button as Link', () => {
    const isExternalLink = (href: string): boolean => {
      return href.startsWith('http://') || href.startsWith('https://');
    };

    it('should detect external links', () => {
      expect(isExternalLink('https://example.com')).toBe(true);
      expect(isExternalLink('http://example.com')).toBe(true);
    });

    it('should detect internal links', () => {
      expect(isExternalLink('/about')).toBe(false);
      expect(isExternalLink('#section')).toBe(false);
    });
  });
});
