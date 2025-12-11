import { describe, it, expect } from 'vitest';

/**
 * Sitemap Generation Tests
 * 
 * Tests for SEO sitemap generation
 */

describe('Sitemap Generation', () => {
  describe('URL Generation', () => {
    const BASE_URL = 'https://flinkly.com';

    const generateUrl = (path: string, priority: number = 0.5, changefreq: string = 'weekly') => ({
      loc: `${BASE_URL}${path}`,
      priority,
      changefreq,
      lastmod: new Date().toISOString().split('T')[0],
    });

    it('should generate URL with correct structure', () => {
      const url = generateUrl('/gig/123', 0.8, 'daily');
      
      expect(url.loc).toBe('https://flinkly.com/gig/123');
      expect(url.priority).toBe(0.8);
      expect(url.changefreq).toBe('daily');
      expect(url.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use default values', () => {
      const url = generateUrl('/about');
      
      expect(url.priority).toBe(0.5);
      expect(url.changefreq).toBe('weekly');
    });
  });

  describe('Static Pages', () => {
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/marketplace', priority: 0.9, changefreq: 'daily' },
      { path: '/about', priority: 0.5, changefreq: 'monthly' },
      { path: '/contact', priority: 0.5, changefreq: 'monthly' },
      { path: '/faq', priority: 0.6, changefreq: 'weekly' },
      { path: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
      { path: '/impressum', priority: 0.3, changefreq: 'yearly' },
      { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
      { path: '/terms', priority: 0.3, changefreq: 'yearly' },
    ];

    it('should include all static pages', () => {
      expect(staticPages.length).toBeGreaterThan(0);
      expect(staticPages.some(p => p.path === '/')).toBe(true);
      expect(staticPages.some(p => p.path === '/marketplace')).toBe(true);
    });

    it('should have homepage with highest priority', () => {
      const homepage = staticPages.find(p => p.path === '/');
      expect(homepage?.priority).toBe(1.0);
    });

    it('should have legal pages with low priority', () => {
      const legalPages = staticPages.filter(p => 
        ['/impressum', '/privacy', '/terms'].includes(p.path)
      );
      legalPages.forEach(page => {
        expect(page.priority).toBeLessThanOrEqual(0.3);
      });
    });
  });

  describe('Gig URLs', () => {
    const generateGigUrls = (gigs: { id: number; updatedAt: Date }[]) => {
      return gigs.map(gig => ({
        loc: `https://flinkly.com/gig/${gig.id}`,
        priority: 0.8,
        changefreq: 'daily',
        lastmod: gig.updatedAt.toISOString().split('T')[0],
      }));
    };

    it('should generate URLs for all gigs', () => {
      const gigs = [
        { id: 1, updatedAt: new Date('2024-01-15') },
        { id: 2, updatedAt: new Date('2024-01-20') },
        { id: 3, updatedAt: new Date('2024-01-25') },
      ];

      const urls = generateGigUrls(gigs);
      
      expect(urls.length).toBe(3);
      expect(urls[0].loc).toBe('https://flinkly.com/gig/1');
      expect(urls[1].loc).toBe('https://flinkly.com/gig/2');
    });

    it('should use gig update date as lastmod', () => {
      const gigs = [{ id: 1, updatedAt: new Date('2024-06-15') }];
      const urls = generateGigUrls(gigs);
      
      expect(urls[0].lastmod).toBe('2024-06-15');
    });
  });

  describe('Category URLs', () => {
    const categories = [
      'Design & Kreatives',
      'Programmierung & IT',
      'Text & Übersetzung',
      'Marketing & Social Media',
      'Video & Animation',
      'Musik & Audio',
      'Business & Beratung',
      'Lifestyle & Freizeit',
    ];

    const slugify = (text: string) => {
      return text
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/&/g, 'und')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    };

    it('should generate category slugs', () => {
      expect(slugify('Design & Kreatives')).toBe('design-und-kreatives');
      expect(slugify('Programmierung & IT')).toBe('programmierung-und-it');
      expect(slugify('Text & Übersetzung')).toBe('text-und-uebersetzung');
    });

    it('should generate URLs for all categories', () => {
      const categoryUrls = categories.map(cat => ({
        loc: `https://flinkly.com/category/${slugify(cat)}`,
        priority: 0.7,
        changefreq: 'daily',
      }));

      expect(categoryUrls.length).toBe(8);
    });
  });

  describe('Seller Profile URLs', () => {
    const generateSellerUrls = (sellers: { id: number; username: string }[]) => {
      return sellers.map(seller => ({
        loc: `https://flinkly.com/seller/${seller.username}`,
        priority: 0.6,
        changefreq: 'weekly',
      }));
    };

    it('should generate URLs for sellers', () => {
      const sellers = [
        { id: 1, username: 'john-doe' },
        { id: 2, username: 'jane-smith' },
      ];

      const urls = generateSellerUrls(sellers);
      
      expect(urls[0].loc).toBe('https://flinkly.com/seller/john-doe');
      expect(urls[1].loc).toBe('https://flinkly.com/seller/jane-smith');
    });
  });

  describe('XML Generation', () => {
    const generateXmlUrl = (url: { loc: string; priority: number; changefreq: string; lastmod?: string }) => {
      return `  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`;
    };

    const generateSitemap = (urls: { loc: string; priority: number; changefreq: string; lastmod?: string }[]) => {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(generateXmlUrl).join('\n')}
</urlset>`;
    };

    it('should generate valid XML structure', () => {
      const urls = [
        { loc: 'https://flinkly.com/', priority: 1.0, changefreq: 'daily' },
      ];

      const xml = generateSitemap(urls);
      
      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<urlset');
      expect(xml).toContain('</urlset>');
      expect(xml).toContain('<url>');
      expect(xml).toContain('<loc>https://flinkly.com/</loc>');
    });

    it('should include lastmod when provided', () => {
      const urls = [
        { loc: 'https://flinkly.com/gig/1', priority: 0.8, changefreq: 'daily', lastmod: '2024-01-15' },
      ];

      const xml = generateSitemap(urls);
      expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
    });
  });

  describe('Sitemap Index', () => {
    const generateSitemapIndex = (sitemaps: { loc: string; lastmod: string }[]) => {
      return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
    };

    it('should generate sitemap index for large sites', () => {
      const sitemaps = [
        { loc: 'https://flinkly.com/sitemap-pages.xml', lastmod: '2024-01-15' },
        { loc: 'https://flinkly.com/sitemap-gigs.xml', lastmod: '2024-01-20' },
        { loc: 'https://flinkly.com/sitemap-sellers.xml', lastmod: '2024-01-18' },
      ];

      const index = generateSitemapIndex(sitemaps);
      
      expect(index).toContain('<sitemapindex');
      expect(index).toContain('sitemap-pages.xml');
      expect(index).toContain('sitemap-gigs.xml');
    });
  });

  describe('URL Limits', () => {
    it('should respect 50,000 URL limit per sitemap', () => {
      const MAX_URLS_PER_SITEMAP = 50000;
      
      const splitIntoSitemaps = <T>(items: T[], maxPerSitemap: number = MAX_URLS_PER_SITEMAP): T[][] => {
        const result: T[][] = [];
        for (let i = 0; i < items.length; i += maxPerSitemap) {
          result.push(items.slice(i, i + maxPerSitemap));
        }
        return result;
      };

      const items = Array(120000).fill(null).map((_, i) => ({ id: i }));
      const sitemaps = splitIntoSitemaps(items);
      
      expect(sitemaps.length).toBe(3);
      expect(sitemaps[0].length).toBe(50000);
      expect(sitemaps[1].length).toBe(50000);
      expect(sitemaps[2].length).toBe(20000);
    });
  });
});
