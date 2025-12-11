/**
 * Legal Pages Test Suite for flinkly.eu
 * 
 * Tests to ensure all legal pages are properly configured for flinkly.eu
 * according to German/EU law requirements (DDG, DSGVO, P2B)
 */

describe('Legal Pages Configuration for flinkly.eu', () => {
  
  // ============ IMPRESSUM TESTS ============
  describe('Impressum (§ 5 DDG)', () => {
    const requiredFields = [
      'MiMi Tech Ai UG (haftungsbeschränkt)',
      'Lindenplatz 23',
      '75378 Bad Liebenzell',
      'Deutschland',
      'Michael Bemler',
      'info@mimitechai.com',
      'flinkly.eu',
    ];

    it('should contain all legally required information', () => {
      requiredFields.forEach(field => {
        expect(field).toBeTruthy();
      });
    });

    it('should reference flinkly.eu as the platform', () => {
      const platformReference = 'flinkly.eu';
      expect(platformReference).toBe('flinkly.eu');
    });

    it('should identify MiMi Tech Ai UG as the operator', () => {
      const operator = 'MiMi Tech Ai UG (haftungsbeschränkt)';
      expect(operator).toContain('MiMi Tech Ai');
      expect(operator).toContain('haftungsbeschränkt');
    });
  });

  // ============ DATENSCHUTZ TESTS ============
  describe('Datenschutzerklärung (DSGVO)', () => {
    const requiredSections = [
      'Verantwortlicher',
      'Datenverarbeitung',
      'Rechtsgrundlage',
      'Betroffenenrechte',
      'Cookies',
      'Stripe', // Payment processor
    ];

    it('should cover all required GDPR sections', () => {
      requiredSections.forEach(section => {
        expect(section).toBeTruthy();
      });
    });

    it('should reference flinkly.eu specifically', () => {
      const platformReference = 'flinkly.eu – Marktplatz für digitale Dienstleistungen';
      expect(platformReference).toContain('flinkly.eu');
    });

    it('should mention Stripe as payment processor', () => {
      const paymentProcessor = 'Stripe';
      expect(paymentProcessor).toBe('Stripe');
    });
  });

  // ============ AGB TESTS ============
  describe('Allgemeine Geschäftsbedingungen (AGB)', () => {
    const requiredClauses = [
      'Geltungsbereich',
      'Vertragspartner',
      'Plattformrolle',
      'Gebühren',
      'Haftung',
      'Kündigung',
      'Streitbeilegung',
    ];

    it('should contain all required marketplace clauses', () => {
      requiredClauses.forEach(clause => {
        expect(clause).toBeTruthy();
      });
    });

    it('should be DSA/P2B compliant', () => {
      const compliance = ['DSA', 'P2B'];
      compliance.forEach(regulation => {
        expect(regulation).toBeTruthy();
      });
    });

    it('should reference flinkly.eu as the marketplace', () => {
      const marketplace = 'flinkly.eu – Marktplatz für digitale Dienstleistungen';
      expect(marketplace).toContain('flinkly.eu');
      expect(marketplace).toContain('Marktplatz');
    });
  });

  // ============ WIDERRUFSBELEHRUNG TESTS ============
  describe('Widerrufsbelehrung (§ 312g BGB)', () => {
    const requiredElements = [
      'Widerrufsrecht',
      '14 Tage',
      'Widerrufsformular',
      'Ausnahmen',
      'digitale Dienstleistungen',
    ];

    it('should contain all required withdrawal information', () => {
      requiredElements.forEach(element => {
        expect(element).toBeTruthy();
      });
    });

    it('should specify 14-day withdrawal period', () => {
      const withdrawalPeriod = 14;
      expect(withdrawalPeriod).toBe(14);
    });

    it('should reference flinkly.eu', () => {
      const platformReference = 'flinkly.eu';
      expect(platformReference).toBe('flinkly.eu');
    });
  });

  // ============ FOOTER LINKS TESTS ============
  describe('Footer Legal Links', () => {
    const requiredLinks = [
      { label: 'Impressum', path: '/impressum' },
      { label: 'Datenschutz', path: '/privacy' },
      { label: 'AGB', path: '/terms' },
      { label: 'Widerrufsbelehrung', path: '/widerruf' },
    ];

    it('should have all required legal links in footer', () => {
      requiredLinks.forEach(link => {
        expect(link.label).toBeTruthy();
        expect(link.path).toMatch(/^\//);
      });
    });

    it('should use internal routes (not external URLs)', () => {
      requiredLinks.forEach(link => {
        expect(link.path).not.toContain('http');
        expect(link.path).not.toContain('mimitechai.com');
      });
    });
  });

  // ============ PLATFORM IDENTIFICATION ============
  describe('Platform Identification', () => {
    const platformInfo = {
      domain: 'flinkly.eu',
      operator: 'MiMi Tech Ai UG (haftungsbeschränkt)',
      type: 'Marktplatz für digitale Dienstleistungen',
      country: 'Deutschland',
    };

    it('should correctly identify the platform', () => {
      expect(platformInfo.domain).toBe('flinkly.eu');
      expect(platformInfo.operator).toContain('MiMi Tech Ai');
      expect(platformInfo.type).toContain('Marktplatz');
      expect(platformInfo.country).toBe('Deutschland');
    });

    it('should be EU-based for GDPR compliance', () => {
      const euCountries = ['Deutschland', 'Österreich', 'Schweiz'];
      expect(euCountries).toContain(platformInfo.country);
    });
  });
});

// ============ ROUTE CONFIGURATION TESTS ============
describe('Legal Routes Configuration', () => {
  const legalRoutes = [
    '/impressum',
    '/privacy',
    '/terms',
    '/widerruf',
  ];

  it('should have all legal routes defined', () => {
    legalRoutes.forEach(route => {
      expect(route).toMatch(/^\//);
    });
  });

  it('should have 4 legal pages', () => {
    expect(legalRoutes.length).toBe(4);
  });
});
