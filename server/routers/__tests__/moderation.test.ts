import { describe, it, expect } from 'vitest';

/**
 * Moderation Router Tests
 * 
 * Tests for content moderation system
 */

describe('Moderation Router', () => {
  describe('Content Flags', () => {
    const FLAG_REASONS = [
      'spam',
      'inappropriate',
      'misleading',
      'copyright',
      'harassment',
      'other',
    ] as const;

    const REASON_LABELS: Record<typeof FLAG_REASONS[number], string> = {
      spam: 'Spam',
      inappropriate: 'Unangemessener Inhalt',
      misleading: 'Irreführend',
      copyright: 'Urheberrechtsverletzung',
      harassment: 'Belästigung',
      other: 'Sonstiges',
    };

    it('should have all reasons defined', () => {
      expect(FLAG_REASONS.length).toBe(6);
    });

    it('should have labels for all reasons', () => {
      FLAG_REASONS.forEach(reason => {
        expect(REASON_LABELS[reason]).toBeDefined();
      });
    });
  });

  describe('Moderation Queue', () => {
    type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

    const sortQueue = (items: { priority: number; createdAt: Date }[]) => {
      return [...items].sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    };

    it('should sort by priority first', () => {
      const items = [
        { priority: 1, createdAt: new Date('2024-01-01') },
        { priority: 3, createdAt: new Date('2024-01-03') },
        { priority: 2, createdAt: new Date('2024-01-02') },
      ];
      const sorted = sortQueue(items);
      expect(sorted[0].priority).toBe(3);
      expect(sorted[1].priority).toBe(2);
      expect(sorted[2].priority).toBe(1);
    });

    it('should sort by date for same priority', () => {
      const items = [
        { priority: 1, createdAt: new Date('2024-01-03') },
        { priority: 1, createdAt: new Date('2024-01-01') },
        { priority: 1, createdAt: new Date('2024-01-02') },
      ];
      const sorted = sortQueue(items);
      expect(sorted[0].createdAt.getDate()).toBe(1);
    });
  });

  describe('Auto-Moderation', () => {
    const BANNED_WORDS = ['spam', 'scam', 'fake'];

    const containsBannedWords = (text: string): boolean => {
      const lower = text.toLowerCase();
      return BANNED_WORDS.some(word => lower.includes(word));
    };

    const calculateSpamScore = (text: string): number => {
      let score = 0;
      
      // Check for excessive caps
      const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
      if (capsRatio > 0.5) score += 30;
      
      // Check for excessive punctuation
      const punctRatio = (text.match(/[!?]/g) || []).length / text.length;
      if (punctRatio > 0.1) score += 20;
      
      // Check for banned words
      if (containsBannedWords(text)) score += 50;
      
      return Math.min(score, 100);
    };

    it('should detect banned words', () => {
      expect(containsBannedWords('This is spam')).toBe(true);
      expect(containsBannedWords('Normal text')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(containsBannedWords('SPAM')).toBe(true);
      expect(containsBannedWords('SpAm')).toBe(true);
    });

    it('should calculate spam score', () => {
      expect(calculateSpamScore('Normal text')).toBe(0);
      expect(calculateSpamScore('SPAM!!!')).toBeGreaterThan(50);
    });
  });

  describe('User Warnings', () => {
    const WARNING_THRESHOLDS = {
      warning: 1,
      temporary_ban: 3,
      permanent_ban: 5,
    };

    const getAction = (warningCount: number): string => {
      if (warningCount >= WARNING_THRESHOLDS.permanent_ban) return 'permanent_ban';
      if (warningCount >= WARNING_THRESHOLDS.temporary_ban) return 'temporary_ban';
      if (warningCount >= WARNING_THRESHOLDS.warning) return 'warning';
      return 'none';
    };

    it('should return warning for 1-2 violations', () => {
      expect(getAction(1)).toBe('warning');
      expect(getAction(2)).toBe('warning');
    });

    it('should return temporary ban for 3-4 violations', () => {
      expect(getAction(3)).toBe('temporary_ban');
      expect(getAction(4)).toBe('temporary_ban');
    });

    it('should return permanent ban for 5+ violations', () => {
      expect(getAction(5)).toBe('permanent_ban');
      expect(getAction(10)).toBe('permanent_ban');
    });
  });

  describe('Content Review', () => {
    const createReviewRecord = (
      contentId: number,
      contentType: 'gig' | 'review' | 'message',
      moderatorId: number,
      action: 'approve' | 'reject',
      reason?: string
    ) => ({
      contentId,
      contentType,
      moderatorId,
      action,
      reason: reason || null,
      reviewedAt: new Date(),
    });

    it('should create review record', () => {
      const record = createReviewRecord(1, 'gig', 100, 'approve');
      expect(record.contentId).toBe(1);
      expect(record.contentType).toBe('gig');
      expect(record.action).toBe('approve');
    });

    it('should include reason for rejection', () => {
      const record = createReviewRecord(1, 'gig', 100, 'reject', 'Violates TOS');
      expect(record.reason).toBe('Violates TOS');
    });
  });

  describe('Report Handling', () => {
    const REPORT_PRIORITY = {
      harassment: 3,
      copyright: 2,
      spam: 1,
      inappropriate: 2,
      misleading: 1,
      other: 1,
    };

    const calculatePriority = (
      reason: keyof typeof REPORT_PRIORITY,
      reportCount: number
    ): number => {
      const basePriority = REPORT_PRIORITY[reason];
      const countBonus = Math.min(reportCount - 1, 2); // Max +2 for multiple reports
      return basePriority + countBonus;
    };

    it('should give highest priority to harassment', () => {
      expect(REPORT_PRIORITY.harassment).toBe(3);
    });

    it('should increase priority with more reports', () => {
      expect(calculatePriority('spam', 1)).toBe(1);
      expect(calculatePriority('spam', 3)).toBe(3);
    });

    it('should cap priority bonus', () => {
      expect(calculatePriority('spam', 10)).toBe(3);
    });
  });

  describe('Temporary Ban', () => {
    const BAN_DURATIONS = {
      first: 24 * 60 * 60 * 1000, // 24 hours
      second: 7 * 24 * 60 * 60 * 1000, // 7 days
      third: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    const calculateBanEnd = (banCount: number): Date => {
      const now = new Date();
      let duration: number;
      
      if (banCount === 1) duration = BAN_DURATIONS.first;
      else if (banCount === 2) duration = BAN_DURATIONS.second;
      else duration = BAN_DURATIONS.third;
      
      return new Date(now.getTime() + duration);
    };

    it('should ban for 24 hours on first offense', () => {
      const banEnd = calculateBanEnd(1);
      const diffHours = (banEnd.getTime() - Date.now()) / (1000 * 60 * 60);
      expect(Math.round(diffHours)).toBe(24);
    });

    it('should ban for 7 days on second offense', () => {
      const banEnd = calculateBanEnd(2);
      const diffDays = (banEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      expect(Math.round(diffDays)).toBe(7);
    });

    it('should ban for 30 days on third offense', () => {
      const banEnd = calculateBanEnd(3);
      const diffDays = (banEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      expect(Math.round(diffDays)).toBe(30);
    });
  });

  describe('Appeal System', () => {
    const APPEAL_WINDOW_DAYS = 14;

    const canAppeal = (banDate: Date, hasAppealed: boolean): boolean => {
      if (hasAppealed) return false;
      const now = new Date();
      const daysSinceBan = (now.getTime() - banDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceBan <= APPEAL_WINDOW_DAYS;
    };

    it('should allow appeal within window', () => {
      const recentBan = new Date();
      expect(canAppeal(recentBan, false)).toBe(true);
    });

    it('should not allow appeal after window', () => {
      const oldBan = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
      expect(canAppeal(oldBan, false)).toBe(false);
    });

    it('should not allow second appeal', () => {
      const recentBan = new Date();
      expect(canAppeal(recentBan, true)).toBe(false);
    });
  });
});
