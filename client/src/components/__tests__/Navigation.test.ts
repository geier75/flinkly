import { describe, it, expect } from 'vitest';

/**
 * Navigation Component Tests
 * 
 * Tests for navigation logic
 */

describe('Navigation', () => {
  describe('Active Link Detection', () => {
    const isActiveLink = (currentPath: string, linkPath: string): boolean => {
      if (linkPath === '/') return currentPath === '/';
      return currentPath.startsWith(linkPath);
    };

    it('should detect exact match for home', () => {
      expect(isActiveLink('/', '/')).toBe(true);
      expect(isActiveLink('/gigs', '/')).toBe(false);
    });

    it('should detect prefix match', () => {
      expect(isActiveLink('/gigs/123', '/gigs')).toBe(true);
      expect(isActiveLink('/orders', '/gigs')).toBe(false);
    });
  });

  describe('Breadcrumbs', () => {
    const generateBreadcrumbs = (path: string) => {
      const segments = path.split('/').filter(Boolean);
      const crumbs = [{ label: 'Home', path: '/' }];
      
      let currentPath = '';
      segments.forEach(segment => {
        currentPath += `/${segment}`;
        crumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: currentPath,
        });
      });

      return crumbs;
    };

    it('should generate breadcrumbs', () => {
      const crumbs = generateBreadcrumbs('/gigs/design');
      expect(crumbs.length).toBe(3);
      expect(crumbs[0].label).toBe('Home');
      expect(crumbs[1].label).toBe('Gigs');
      expect(crumbs[2].label).toBe('Design');
    });

    it('should handle root path', () => {
      const crumbs = generateBreadcrumbs('/');
      expect(crumbs.length).toBe(1);
    });
  });

  describe('Mobile Menu', () => {
    const getMobileMenuState = (
      isOpen: boolean,
      scrollY: number
    ) => ({
      isOpen,
      shouldShowBackdrop: isOpen,
      bodyClass: isOpen ? 'overflow-hidden' : '',
      headerClass: scrollY > 50 ? 'bg-white shadow' : 'bg-transparent',
    });

    it('should show backdrop when open', () => {
      const state = getMobileMenuState(true, 0);
      expect(state.shouldShowBackdrop).toBe(true);
      expect(state.bodyClass).toBe('overflow-hidden');
    });

    it('should add shadow on scroll', () => {
      const state = getMobileMenuState(false, 100);
      expect(state.headerClass).toContain('shadow');
    });
  });

  describe('User Menu', () => {
    type UserRole = 'buyer' | 'seller' | 'admin';

    const getUserMenuItems = (role: UserRole, isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        return [
          { label: 'Anmelden', path: '/login' },
          { label: 'Registrieren', path: '/register' },
        ];
      }

      const baseItems = [
        { label: 'Profil', path: '/profile' },
        { label: 'Nachrichten', path: '/messages' },
        { label: 'Bestellungen', path: '/orders' },
      ];

      if (role === 'seller' || role === 'admin') {
        baseItems.push({ label: 'Meine Gigs', path: '/seller/gigs' });
        baseItems.push({ label: 'Einnahmen', path: '/seller/earnings' });
      }

      if (role === 'admin') {
        baseItems.push({ label: 'Admin', path: '/admin' });
      }

      baseItems.push({ label: 'Abmelden', path: '/logout' });

      return baseItems;
    };

    it('should show login for guests', () => {
      const items = getUserMenuItems('buyer', false);
      expect(items.some(i => i.label === 'Anmelden')).toBe(true);
    });

    it('should show seller items for sellers', () => {
      const items = getUserMenuItems('seller', true);
      expect(items.some(i => i.label === 'Meine Gigs')).toBe(true);
    });

    it('should show admin items for admins', () => {
      const items = getUserMenuItems('admin', true);
      expect(items.some(i => i.label === 'Admin')).toBe(true);
    });
  });

  describe('Search Bar', () => {
    const getSearchPlaceholder = (category?: string): string => {
      if (category) {
        return `In ${category} suchen...`;
      }
      return 'Suche nach Services...';
    };

    const formatSearchQuery = (query: string): string => {
      return query.trim().toLowerCase();
    };

    it('should show category-specific placeholder', () => {
      expect(getSearchPlaceholder('Design')).toBe('In Design suchen...');
    });

    it('should show default placeholder', () => {
      expect(getSearchPlaceholder()).toBe('Suche nach Services...');
    });

    it('should format search query', () => {
      expect(formatSearchQuery('  LOGO Design  ')).toBe('logo design');
    });
  });

  describe('Category Navigation', () => {
    const CATEGORIES = [
      { id: 'design', label: 'Design', icon: '🎨' },
      { id: 'programming', label: 'Programmierung', icon: '💻' },
      { id: 'writing', label: 'Texte', icon: '✍️' },
      { id: 'video', label: 'Video', icon: '🎬' },
      { id: 'music', label: 'Musik', icon: '🎵' },
      { id: 'marketing', label: 'Marketing', icon: '📈' },
    ];

    const getCategoryBySlug = (slug: string) => {
      return CATEGORIES.find(c => c.id === slug);
    };

    it('should find category by slug', () => {
      const cat = getCategoryBySlug('design');
      expect(cat?.label).toBe('Design');
    });

    it('should return undefined for unknown', () => {
      expect(getCategoryBySlug('unknown')).toBeUndefined();
    });
  });

  describe('Notification Badge', () => {
    const formatBadgeCount = (count: number): string => {
      if (count === 0) return '';
      if (count > 99) return '99+';
      return count.toString();
    };

    it('should format count', () => {
      expect(formatBadgeCount(5)).toBe('5');
      expect(formatBadgeCount(100)).toBe('99+');
      expect(formatBadgeCount(0)).toBe('');
    });
  });

  describe('Language Selector', () => {
    const LANGUAGES = [
      { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
      { code: 'en', label: 'English', flag: '🇬🇧' },
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
    ];

    const getLanguageByCode = (code: string) => {
      return LANGUAGES.find(l => l.code === code);
    };

    it('should find language', () => {
      expect(getLanguageByCode('de')?.label).toBe('Deutsch');
    });
  });

  describe('Footer Links', () => {
    const FOOTER_SECTIONS = [
      {
        title: 'Kategorien',
        links: [
          { label: 'Design', path: '/categories/design' },
          { label: 'Programmierung', path: '/categories/programming' },
        ],
      },
      {
        title: 'Über uns',
        links: [
          { label: 'Über Flinkly', path: '/about' },
          { label: 'Karriere', path: '/careers' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Hilfe', path: '/help' },
          { label: 'Kontakt', path: '/contact' },
        ],
      },
      {
        title: 'Rechtliches',
        links: [
          { label: 'Impressum', path: '/impressum' },
          { label: 'Datenschutz', path: '/privacy' },
          { label: 'AGB', path: '/terms' },
        ],
      },
    ];

    it('should have all sections', () => {
      expect(FOOTER_SECTIONS.length).toBe(4);
    });

    it('should have legal links', () => {
      const legal = FOOTER_SECTIONS.find(s => s.title === 'Rechtliches');
      expect(legal?.links.some(l => l.label === 'Impressum')).toBe(true);
    });
  });
});
