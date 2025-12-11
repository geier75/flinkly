import { describe, it, expect } from 'vitest';

/**
 * Profile Router Tests
 * 
 * Tests for user profile management
 */

describe('Profile Router', () => {
  describe('Profile Validation', () => {
    const validateDisplayName = (name: string): { valid: boolean; error?: string } => {
      if (!name || name.trim().length < 2) {
        return { valid: false, error: 'Name muss mindestens 2 Zeichen haben' };
      }
      if (name.length > 50) {
        return { valid: false, error: 'Name darf maximal 50 Zeichen haben' };
      }
      if (!/^[a-zA-ZäöüÄÖÜß\s\-]+$/.test(name)) {
        return { valid: false, error: 'Name enthält ungültige Zeichen' };
      }
      return { valid: true };
    };

    it('should accept valid names', () => {
      expect(validateDisplayName('Max Mustermann').valid).toBe(true);
      expect(validateDisplayName('Anna-Maria').valid).toBe(true);
      expect(validateDisplayName('Müller').valid).toBe(true);
    });

    it('should reject too short names', () => {
      expect(validateDisplayName('M').valid).toBe(false);
      expect(validateDisplayName('').valid).toBe(false);
    });

    it('should reject names with special characters', () => {
      expect(validateDisplayName('Max@123').valid).toBe(false);
      expect(validateDisplayName('User<script>').valid).toBe(false);
    });
  });

  describe('Bio Validation', () => {
    const MAX_BIO_LENGTH = 500;

    const validateBio = (bio: string): { valid: boolean; error?: string } => {
      if (bio.length > MAX_BIO_LENGTH) {
        return { valid: false, error: `Bio darf maximal ${MAX_BIO_LENGTH} Zeichen haben` };
      }
      return { valid: true };
    };

    it('should accept valid bio', () => {
      expect(validateBio('Ich bin ein professioneller Designer.').valid).toBe(true);
    });

    it('should accept empty bio', () => {
      expect(validateBio('').valid).toBe(true);
    });

    it('should reject too long bio', () => {
      expect(validateBio('A'.repeat(501)).valid).toBe(false);
    });
  });

  describe('Avatar Upload', () => {
    const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const validateAvatar = (
      file: { size: number; type: string }
    ): { valid: boolean; error?: string } => {
      if (file.size > MAX_AVATAR_SIZE) {
        return { valid: false, error: 'Bild zu groß (max 5MB)' };
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Nur JPG, PNG und WebP erlaubt' };
      }
      return { valid: true };
    };

    it('should accept valid images', () => {
      expect(validateAvatar({ size: 1024, type: 'image/jpeg' }).valid).toBe(true);
      expect(validateAvatar({ size: 1024, type: 'image/png' }).valid).toBe(true);
    });

    it('should reject oversized images', () => {
      expect(validateAvatar({ size: 10 * 1024 * 1024, type: 'image/jpeg' }).valid).toBe(false);
    });

    it('should reject invalid types', () => {
      expect(validateAvatar({ size: 1024, type: 'image/gif' }).valid).toBe(false);
      expect(validateAvatar({ size: 1024, type: 'application/pdf' }).valid).toBe(false);
    });
  });

  describe('Skills Management', () => {
    const MAX_SKILLS = 10;

    const validateSkills = (skills: string[]): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (skills.length > MAX_SKILLS) {
        errors.push(`Maximal ${MAX_SKILLS} Skills erlaubt`);
      }

      skills.forEach((skill, i) => {
        if (skill.length < 2) {
          errors.push(`Skill ${i + 1} zu kurz`);
        }
        if (skill.length > 30) {
          errors.push(`Skill ${i + 1} zu lang`);
        }
      });

      const uniqueSkills = new Set(skills.map(s => s.toLowerCase()));
      if (uniqueSkills.size !== skills.length) {
        errors.push('Doppelte Skills nicht erlaubt');
      }

      return { valid: errors.length === 0, errors };
    };

    it('should accept valid skills', () => {
      expect(validateSkills(['JavaScript', 'React', 'Node.js']).valid).toBe(true);
    });

    it('should reject too many skills', () => {
      const skills = Array(11).fill('Skill').map((s, i) => `${s}${i}`);
      expect(validateSkills(skills).valid).toBe(false);
    });

    it('should reject duplicate skills', () => {
      expect(validateSkills(['JavaScript', 'javascript']).valid).toBe(false);
    });
  });

  describe('Languages', () => {
    const SUPPORTED_LANGUAGES = [
      { code: 'de', name: 'Deutsch' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' },
      { code: 'it', name: 'Italiano' },
    ];

    type LanguageLevel = 'basic' | 'conversational' | 'fluent' | 'native';

    const validateLanguage = (
      code: string,
      level: LanguageLevel
    ): boolean => {
      const validCodes = SUPPORTED_LANGUAGES.map(l => l.code);
      const validLevels: LanguageLevel[] = ['basic', 'conversational', 'fluent', 'native'];
      return validCodes.includes(code) && validLevels.includes(level);
    };

    it('should accept valid language', () => {
      expect(validateLanguage('de', 'native')).toBe(true);
      expect(validateLanguage('en', 'fluent')).toBe(true);
    });

    it('should reject invalid language code', () => {
      expect(validateLanguage('xx', 'native')).toBe(false);
    });
  });

  describe('Social Links', () => {
    const SOCIAL_PLATFORMS = ['twitter', 'linkedin', 'github', 'instagram', 'website'];

    const validateSocialLink = (
      platform: string,
      url: string
    ): { valid: boolean; error?: string } => {
      if (!SOCIAL_PLATFORMS.includes(platform)) {
        return { valid: false, error: 'Plattform nicht unterstützt' };
      }

      try {
        new URL(url);
      } catch {
        return { valid: false, error: 'Ungültige URL' };
      }

      return { valid: true };
    };

    it('should accept valid social links', () => {
      expect(validateSocialLink('twitter', 'https://twitter.com/user').valid).toBe(true);
      expect(validateSocialLink('github', 'https://github.com/user').valid).toBe(true);
    });

    it('should reject invalid platform', () => {
      expect(validateSocialLink('tiktok', 'https://tiktok.com/user').valid).toBe(false);
    });

    it('should reject invalid URL', () => {
      expect(validateSocialLink('twitter', 'not-a-url').valid).toBe(false);
    });
  });

  describe('Profile Completeness', () => {
    const calculateCompleteness = (profile: {
      displayName?: string;
      bio?: string;
      avatar?: string;
      skills?: string[];
      languages?: string[];
      location?: string;
    }): number => {
      const fields = [
        { key: 'displayName', weight: 20 },
        { key: 'bio', weight: 20 },
        { key: 'avatar', weight: 20 },
        { key: 'skills', weight: 15 },
        { key: 'languages', weight: 15 },
        { key: 'location', weight: 10 },
      ];

      let score = 0;
      fields.forEach(field => {
        const value = profile[field.key as keyof typeof profile];
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          score += field.weight;
        }
      });

      return score;
    };

    it('should calculate completeness', () => {
      const complete = {
        displayName: 'Max',
        bio: 'Bio',
        avatar: 'url',
        skills: ['JS'],
        languages: ['de'],
        location: 'Berlin',
      };
      expect(calculateCompleteness(complete)).toBe(100);
    });

    it('should handle partial profile', () => {
      const partial = {
        displayName: 'Max',
        bio: 'Bio',
      };
      expect(calculateCompleteness(partial)).toBe(40);
    });

    it('should handle empty profile', () => {
      expect(calculateCompleteness({})).toBe(0);
    });
  });

  describe('Seller Profile', () => {
    const canBecomeSeller = (profile: {
      emailVerified: boolean;
      displayName?: string;
      bio?: string;
      avatar?: string;
    }): { eligible: boolean; missing: string[] } => {
      const missing: string[] = [];

      if (!profile.emailVerified) missing.push('E-Mail-Verifizierung');
      if (!profile.displayName) missing.push('Anzeigename');
      if (!profile.bio || profile.bio.length < 50) missing.push('Bio (min. 50 Zeichen)');
      if (!profile.avatar) missing.push('Profilbild');

      return { eligible: missing.length === 0, missing };
    };

    it('should allow complete profile to become seller', () => {
      const profile = {
        emailVerified: true,
        displayName: 'Max',
        bio: 'A'.repeat(50),
        avatar: 'url',
      };
      expect(canBecomeSeller(profile).eligible).toBe(true);
    });

    it('should reject incomplete profile', () => {
      const profile = {
        emailVerified: true,
        displayName: 'Max',
      };
      const result = canBecomeSeller(profile);
      expect(result.eligible).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
  });

  describe('Profile Privacy', () => {
    type PrivacySetting = 'public' | 'private' | 'contacts_only';

    const getVisibleFields = (
      viewerId: number | null,
      profileOwnerId: number,
      privacy: Record<string, PrivacySetting>,
      isContact: boolean
    ): string[] => {
      const allFields = ['email', 'phone', 'location', 'lastSeen'];
      
      return allFields.filter(field => {
        const setting = privacy[field] || 'private';
        
        if (viewerId === profileOwnerId) return true;
        if (setting === 'public') return true;
        if (setting === 'contacts_only' && isContact) return true;
        return false;
      });
    };

    it('should show all fields to owner', () => {
      const privacy = { email: 'private' as PrivacySetting };
      const visible = getVisibleFields(1, 1, privacy, false);
      expect(visible).toContain('email');
    });

    it('should hide private fields from others', () => {
      const privacy = { email: 'private' as PrivacySetting };
      const visible = getVisibleFields(2, 1, privacy, false);
      expect(visible).not.toContain('email');
    });

    it('should show contacts_only to contacts', () => {
      const privacy = { email: 'contacts_only' as PrivacySetting };
      const visible = getVisibleFields(2, 1, privacy, true);
      expect(visible).toContain('email');
    });
  });

  describe('Profile Activity', () => {
    const getActivityStatus = (lastSeen: Date): string => {
      const now = new Date();
      const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

      if (diffMinutes < 5) return 'online';
      if (diffMinutes < 60) return 'vor kurzem aktiv';
      if (diffMinutes < 24 * 60) return 'heute aktiv';
      if (diffMinutes < 7 * 24 * 60) return 'diese Woche aktiv';
      return 'offline';
    };

    it('should show online for recent activity', () => {
      expect(getActivityStatus(new Date())).toBe('online');
    });

    it('should show offline for old activity', () => {
      const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      expect(getActivityStatus(old)).toBe('offline');
    });
  });
});
