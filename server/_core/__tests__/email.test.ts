import { describe, it, expect } from 'vitest';

/**
 * Email Service Tests
 * 
 * Tests for email sending logic
 */

describe('Email Service', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('should accept valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('Email Options', () => {
    const createEmailOptions = (
      to: string,
      subject: string,
      html: string,
      options?: { replyTo?: string; attachments?: any[] }
    ) => ({
      from: 'Flinkly <noreply@flinkly.com>',
      to,
      subject,
      html,
      replyTo: options?.replyTo,
      attachments: options?.attachments,
    });

    it('should create email options', () => {
      const opts = createEmailOptions('user@example.com', 'Test', '<p>Hello</p>');
      expect(opts.from).toContain('Flinkly');
      expect(opts.to).toBe('user@example.com');
      expect(opts.subject).toBe('Test');
    });

    it('should include optional replyTo', () => {
      const opts = createEmailOptions('user@example.com', 'Test', '<p>Hello</p>', {
        replyTo: 'support@flinkly.com',
      });
      expect(opts.replyTo).toBe('support@flinkly.com');
    });
  });

  describe('Subject Line Generation', () => {
    const subjects = {
      orderConfirmation: (orderId: number) => `Bestellbestätigung #${orderId}`,
      newMessage: (senderName: string) => `Neue Nachricht von ${senderName}`,
      passwordReset: () => 'Passwort zurücksetzen',
      welcome: (userName: string) => `Willkommen bei Flinkly, ${userName}!`,
      levelUp: (newLevel: string) => `🎉 Glückwunsch! Du bist jetzt ${newLevel}`,
    };

    it('should generate order confirmation subject', () => {
      expect(subjects.orderConfirmation(123)).toBe('Bestellbestätigung #123');
    });

    it('should generate new message subject', () => {
      expect(subjects.newMessage('Max')).toBe('Neue Nachricht von Max');
    });

    it('should generate password reset subject', () => {
      expect(subjects.passwordReset()).toBe('Passwort zurücksetzen');
    });

    it('should generate welcome subject', () => {
      expect(subjects.welcome('Anna')).toBe('Willkommen bei Flinkly, Anna!');
    });

    it('should generate level up subject', () => {
      expect(subjects.levelUp('Top Rated')).toContain('Top Rated');
    });
  });

  describe('HTML Escaping', () => {
    const escapeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
      expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
    });

    it('should handle normal text', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('Template Variables', () => {
    const replaceVariables = (template: string, vars: Record<string, string>): string => {
      let result = template;
      for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      return result;
    };

    it('should replace single variable', () => {
      const template = 'Hello {{name}}!';
      expect(replaceVariables(template, { name: 'Max' })).toBe('Hello Max!');
    });

    it('should replace multiple variables', () => {
      const template = '{{greeting}} {{name}}, your order #{{orderId}} is ready.';
      const result = replaceVariables(template, {
        greeting: 'Hallo',
        name: 'Max',
        orderId: '123',
      });
      expect(result).toBe('Hallo Max, your order #123 is ready.');
    });

    it('should replace repeated variables', () => {
      const template = '{{name}} said: "Hi, I am {{name}}"';
      expect(replaceVariables(template, { name: 'Max' })).toBe('Max said: "Hi, I am Max"');
    });
  });

  describe('Rate Limiting', () => {
    const EMAIL_RATE_LIMITS = {
      perMinute: 10,
      perHour: 100,
      perDay: 500,
    };

    const checkRateLimit = (
      sentCounts: { minute: number; hour: number; day: number }
    ): { allowed: boolean; reason?: string } => {
      if (sentCounts.minute >= EMAIL_RATE_LIMITS.perMinute) {
        return { allowed: false, reason: 'Minute limit exceeded' };
      }
      if (sentCounts.hour >= EMAIL_RATE_LIMITS.perHour) {
        return { allowed: false, reason: 'Hour limit exceeded' };
      }
      if (sentCounts.day >= EMAIL_RATE_LIMITS.perDay) {
        return { allowed: false, reason: 'Day limit exceeded' };
      }
      return { allowed: true };
    };

    it('should allow within limits', () => {
      expect(checkRateLimit({ minute: 5, hour: 50, day: 200 }).allowed).toBe(true);
    });

    it('should block when minute limit exceeded', () => {
      const result = checkRateLimit({ minute: 10, hour: 50, day: 200 });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Minute');
    });

    it('should block when hour limit exceeded', () => {
      const result = checkRateLimit({ minute: 5, hour: 100, day: 200 });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Hour');
    });
  });

  describe('Bounce Handling', () => {
    type BounceType = 'hard' | 'soft' | 'complaint';

    const handleBounce = (type: BounceType, email: string) => {
      switch (type) {
        case 'hard':
          return { action: 'unsubscribe', email };
        case 'soft':
          return { action: 'retry', email, maxRetries: 3 };
        case 'complaint':
          return { action: 'unsubscribe', email, flag: 'complaint' };
      }
    };

    it('should unsubscribe on hard bounce', () => {
      const result = handleBounce('hard', 'test@example.com');
      expect(result.action).toBe('unsubscribe');
    });

    it('should retry on soft bounce', () => {
      const result = handleBounce('soft', 'test@example.com');
      expect(result.action).toBe('retry');
      expect(result.maxRetries).toBe(3);
    });

    it('should flag complaints', () => {
      const result = handleBounce('complaint', 'test@example.com');
      expect(result.flag).toBe('complaint');
    });
  });

  describe('Unsubscribe Link', () => {
    const generateUnsubscribeLink = (userId: number, token: string): string => {
      return `https://flinkly.com/unsubscribe?user=${userId}&token=${token}`;
    };

    it('should generate unsubscribe link', () => {
      const link = generateUnsubscribeLink(123, 'abc123');
      expect(link).toContain('user=123');
      expect(link).toContain('token=abc123');
    });
  });

  describe('Email Queue', () => {
    const createQueueItem = (
      to: string,
      subject: string,
      html: string,
      priority: 'high' | 'normal' | 'low' = 'normal'
    ) => ({
      to,
      subject,
      html,
      priority,
      createdAt: new Date(),
      attempts: 0,
      status: 'pending' as const,
    });

    it('should create queue item', () => {
      const item = createQueueItem('test@example.com', 'Test', '<p>Hello</p>');
      expect(item.status).toBe('pending');
      expect(item.attempts).toBe(0);
    });

    it('should set priority', () => {
      const highPriority = createQueueItem('test@example.com', 'Urgent', '<p>!</p>', 'high');
      expect(highPriority.priority).toBe('high');
    });
  });
});
