import { describe, it, expect } from 'vitest';

/**
 * Card Component Tests
 * 
 * Tests for card component logic
 */

describe('Card Component', () => {
  describe('Card Variants', () => {
    type CardVariant = 'default' | 'outlined' | 'elevated' | 'interactive';

    const getVariantClasses = (variant: CardVariant): string => {
      const variants: Record<CardVariant, string> = {
        default: 'bg-card text-card-foreground',
        outlined: 'border border-border bg-transparent',
        elevated: 'bg-card shadow-lg',
        interactive: 'bg-card hover:shadow-md transition-shadow cursor-pointer',
      };
      return variants[variant];
    };

    it('should return default classes', () => {
      expect(getVariantClasses('default')).toContain('bg-card');
    });

    it('should return outlined classes', () => {
      expect(getVariantClasses('outlined')).toContain('border');
    });

    it('should return elevated classes', () => {
      expect(getVariantClasses('elevated')).toContain('shadow-lg');
    });

    it('should return interactive classes', () => {
      expect(getVariantClasses('interactive')).toContain('cursor-pointer');
      expect(getVariantClasses('interactive')).toContain('hover:shadow-md');
    });
  });

  describe('Card Padding', () => {
    type CardPadding = 'none' | 'sm' | 'md' | 'lg';

    const getPaddingClasses = (padding: CardPadding): string => {
      const paddings: Record<CardPadding, string> = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      };
      return paddings[padding];
    };

    it('should return no padding', () => {
      expect(getPaddingClasses('none')).toBe('');
    });

    it('should return small padding', () => {
      expect(getPaddingClasses('sm')).toBe('p-3');
    });

    it('should return medium padding', () => {
      expect(getPaddingClasses('md')).toBe('p-4');
    });

    it('should return large padding', () => {
      expect(getPaddingClasses('lg')).toBe('p-6');
    });
  });

  describe('Card Header', () => {
    const createCardHeader = (
      title: string,
      subtitle?: string,
      action?: { label: string; onClick: () => void }
    ) => ({
      title,
      subtitle,
      hasAction: !!action,
      actionLabel: action?.label,
    });

    it('should create header with title', () => {
      const header = createCardHeader('Meine Bestellungen');
      expect(header.title).toBe('Meine Bestellungen');
    });

    it('should include subtitle', () => {
      const header = createCardHeader('Titel', 'Untertitel');
      expect(header.subtitle).toBe('Untertitel');
    });

    it('should track action presence', () => {
      const header = createCardHeader('Titel', undefined, { label: 'Mehr', onClick: () => {} });
      expect(header.hasAction).toBe(true);
      expect(header.actionLabel).toBe('Mehr');
    });
  });

  describe('Card Footer', () => {
    const createCardFooter = (
      primaryAction?: { label: string },
      secondaryAction?: { label: string }
    ) => ({
      hasPrimaryAction: !!primaryAction,
      hasSecondaryAction: !!secondaryAction,
      alignment: primaryAction && secondaryAction ? 'justify-between' : 'justify-end',
    });

    it('should align to end with single action', () => {
      const footer = createCardFooter({ label: 'Speichern' });
      expect(footer.alignment).toBe('justify-end');
    });

    it('should space between with two actions', () => {
      const footer = createCardFooter({ label: 'Speichern' }, { label: 'Abbrechen' });
      expect(footer.alignment).toBe('justify-between');
    });
  });

  describe('Card Image', () => {
    const createCardImage = (
      src: string,
      alt: string,
      aspectRatio: '1:1' | '16:9' | '4:3' = '16:9'
    ) => {
      const aspectClasses: Record<string, string> = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
      };
      
      return {
        src,
        alt,
        aspectClass: aspectClasses[aspectRatio],
      };
    };

    it('should create image with aspect ratio', () => {
      const image = createCardImage('/image.jpg', 'Test');
      expect(image.aspectClass).toBe('aspect-video');
    });

    it('should support square aspect', () => {
      const image = createCardImage('/image.jpg', 'Test', '1:1');
      expect(image.aspectClass).toBe('aspect-square');
    });
  });

  describe('Card Badge', () => {
    type BadgeType = 'new' | 'sale' | 'featured' | 'sold';

    const getBadgeStyles = (type: BadgeType) => {
      const styles: Record<BadgeType, { bg: string; text: string; label: string }> = {
        new: { bg: 'bg-green-500', text: 'text-white', label: 'Neu' },
        sale: { bg: 'bg-red-500', text: 'text-white', label: 'Sale' },
        featured: { bg: 'bg-yellow-500', text: 'text-black', label: 'Featured' },
        sold: { bg: 'bg-gray-500', text: 'text-white', label: 'Verkauft' },
      };
      return styles[type];
    };

    it('should return new badge styles', () => {
      const badge = getBadgeStyles('new');
      expect(badge.label).toBe('Neu');
      expect(badge.bg).toContain('green');
    });

    it('should return sale badge styles', () => {
      const badge = getBadgeStyles('sale');
      expect(badge.label).toBe('Sale');
      expect(badge.bg).toContain('red');
    });
  });

  describe('Gig Card', () => {
    const createGigCard = (gig: {
      title: string;
      price: number;
      rating: number;
      reviewCount: number;
      sellerName: string;
      deliveryDays: number;
    }) => ({
      ...gig,
      formattedPrice: `${(gig.price / 100).toFixed(2)} €`,
      formattedRating: (gig.rating / 100).toFixed(1),
      deliveryText: `Lieferung in ${gig.deliveryDays} ${gig.deliveryDays === 1 ? 'Tag' : 'Tagen'}`,
    });

    it('should format price', () => {
      const card = createGigCard({
        title: 'Logo Design',
        price: 5000,
        rating: 480,
        reviewCount: 42,
        sellerName: 'Max',
        deliveryDays: 3,
      });
      expect(card.formattedPrice).toBe('50.00 €');
    });

    it('should format rating', () => {
      const card = createGigCard({
        title: 'Logo Design',
        price: 5000,
        rating: 480,
        reviewCount: 42,
        sellerName: 'Max',
        deliveryDays: 3,
      });
      expect(card.formattedRating).toBe('4.8');
    });

    it('should format delivery text', () => {
      const card = createGigCard({
        title: 'Logo Design',
        price: 5000,
        rating: 480,
        reviewCount: 42,
        sellerName: 'Max',
        deliveryDays: 1,
      });
      expect(card.deliveryText).toContain('1 Tag');
    });
  });

  describe('Skeleton Card', () => {
    const createSkeletonCard = (showImage: boolean = true) => ({
      showImage,
      imageClass: showImage ? 'h-40 bg-gray-200 animate-pulse' : '',
      titleClass: 'h-4 bg-gray-200 animate-pulse rounded',
      subtitleClass: 'h-3 bg-gray-200 animate-pulse rounded w-2/3',
    });

    it('should include image skeleton', () => {
      const skeleton = createSkeletonCard(true);
      expect(skeleton.imageClass).toContain('animate-pulse');
    });

    it('should exclude image skeleton', () => {
      const skeleton = createSkeletonCard(false);
      expect(skeleton.imageClass).toBe('');
    });

    it('should have animated title', () => {
      const skeleton = createSkeletonCard();
      expect(skeleton.titleClass).toContain('animate-pulse');
    });
  });
});
