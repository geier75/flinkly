import { describe, it, expect } from 'vitest';

/**
 * Messages Router Tests
 * 
 * Tests for messaging system
 */

describe('Messages Router', () => {
  describe('Message Validation', () => {
    const MAX_MESSAGE_LENGTH = 5000;
    const MIN_MESSAGE_LENGTH = 1;

    const validateMessage = (content: string): { valid: boolean; error?: string } => {
      if (content.length < MIN_MESSAGE_LENGTH) {
        return { valid: false, error: 'Nachricht darf nicht leer sein' };
      }
      if (content.length > MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `Nachricht darf maximal ${MAX_MESSAGE_LENGTH} Zeichen haben` };
      }
      return { valid: true };
    };

    it('should reject empty messages', () => {
      expect(validateMessage('').valid).toBe(false);
    });

    it('should accept valid messages', () => {
      expect(validateMessage('Hello!').valid).toBe(true);
    });

    it('should reject too long messages', () => {
      const longMessage = 'A'.repeat(5001);
      expect(validateMessage(longMessage).valid).toBe(false);
    });

    it('should accept max length message', () => {
      const maxMessage = 'A'.repeat(5000);
      expect(validateMessage(maxMessage).valid).toBe(true);
    });
  });

  describe('Conversation ID Generation', () => {
    const generateConversationId = (userId1: number, userId2: number): string => {
      const sorted = [userId1, userId2].sort((a, b) => a - b);
      return `conv_${sorted[0]}_${sorted[1]}`;
    };

    it('should generate consistent ID regardless of order', () => {
      expect(generateConversationId(1, 2)).toBe(generateConversationId(2, 1));
    });

    it('should generate unique IDs for different pairs', () => {
      expect(generateConversationId(1, 2)).not.toBe(generateConversationId(1, 3));
    });

    it('should include both user IDs', () => {
      const id = generateConversationId(10, 20);
      expect(id).toContain('10');
      expect(id).toContain('20');
    });
  });

  describe('Message Formatting', () => {
    const formatMessageTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Gerade eben';
      if (diffMins < 60) return `vor ${diffMins} Min.`;
      if (diffHours < 24) return `vor ${diffHours} Std.`;
      if (diffDays < 7) return `vor ${diffDays} Tagen`;
      return date.toLocaleDateString('de-DE');
    };

    it('should show "Gerade eben" for recent messages', () => {
      expect(formatMessageTime(new Date())).toBe('Gerade eben');
    });

    it('should show minutes for recent messages', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatMessageTime(fiveMinAgo)).toBe('vor 5 Min.');
    });

    it('should show hours for same day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatMessageTime(threeHoursAgo)).toBe('vor 3 Std.');
    });
  });

  describe('Unread Count', () => {
    const calculateUnreadCount = (messages: { read: boolean; recipientId: number }[], userId: number): number => {
      return messages.filter(m => !m.read && m.recipientId === userId).length;
    };

    it('should count unread messages', () => {
      const messages = [
        { read: false, recipientId: 1 },
        { read: true, recipientId: 1 },
        { read: false, recipientId: 1 },
      ];
      expect(calculateUnreadCount(messages, 1)).toBe(2);
    });

    it('should only count messages for user', () => {
      const messages = [
        { read: false, recipientId: 1 },
        { read: false, recipientId: 2 },
      ];
      expect(calculateUnreadCount(messages, 1)).toBe(1);
    });

    it('should return 0 for no unread', () => {
      const messages = [
        { read: true, recipientId: 1 },
      ];
      expect(calculateUnreadCount(messages, 1)).toBe(0);
    });
  });

  describe('File Attachment Validation', () => {
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const validateAttachment = (file: { type: string; size: number }): { valid: boolean; error?: string } => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Dateityp nicht erlaubt' };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'Datei zu groß (max. 5MB)' };
      }
      return { valid: true };
    };

    it('should accept valid images', () => {
      expect(validateAttachment({ type: 'image/jpeg', size: 1024 }).valid).toBe(true);
      expect(validateAttachment({ type: 'image/png', size: 1024 }).valid).toBe(true);
    });

    it('should accept PDFs', () => {
      expect(validateAttachment({ type: 'application/pdf', size: 1024 }).valid).toBe(true);
    });

    it('should reject invalid types', () => {
      expect(validateAttachment({ type: 'application/exe', size: 1024 }).valid).toBe(false);
    });

    it('should reject large files', () => {
      expect(validateAttachment({ type: 'image/jpeg', size: 10 * 1024 * 1024 }).valid).toBe(false);
    });
  });

  describe('Conversation List', () => {
    const sortConversations = (conversations: { lastMessageAt: Date }[]) => {
      return [...conversations].sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
    };

    it('should sort by most recent first', () => {
      const convs = [
        { lastMessageAt: new Date('2024-01-01') },
        { lastMessageAt: new Date('2024-01-03') },
        { lastMessageAt: new Date('2024-01-02') },
      ];
      const sorted = sortConversations(convs);
      expect(sorted[0].lastMessageAt.getDate()).toBe(3);
      expect(sorted[1].lastMessageAt.getDate()).toBe(2);
      expect(sorted[2].lastMessageAt.getDate()).toBe(1);
    });
  });

  describe('Message Preview', () => {
    const generatePreview = (content: string, maxLength: number = 50): string => {
      if (content.length <= maxLength) return content;
      return content.slice(0, maxLength - 3) + '...';
    };

    it('should not truncate short messages', () => {
      expect(generatePreview('Hello')).toBe('Hello');
    });

    it('should truncate long messages', () => {
      const longMessage = 'A'.repeat(100);
      const preview = generatePreview(longMessage);
      expect(preview.length).toBe(50);
      expect(preview.endsWith('...')).toBe(true);
    });
  });

  describe('Blocked Users', () => {
    const canSendMessage = (
      senderId: number,
      recipientId: number,
      blockedUsers: Set<number>
    ): boolean => {
      return !blockedUsers.has(senderId);
    };

    it('should allow messages from non-blocked users', () => {
      const blocked = new Set([3, 4, 5]);
      expect(canSendMessage(1, 2, blocked)).toBe(true);
    });

    it('should block messages from blocked users', () => {
      const blocked = new Set([1, 3, 5]);
      expect(canSendMessage(1, 2, blocked)).toBe(false);
    });
  });

  describe('Message Search', () => {
    const searchMessages = (
      messages: { content: string; senderId: number }[],
      query: string
    ) => {
      const lowerQuery = query.toLowerCase();
      return messages.filter(m => m.content.toLowerCase().includes(lowerQuery));
    };

    it('should find matching messages', () => {
      const messages = [
        { content: 'Hello World', senderId: 1 },
        { content: 'Goodbye', senderId: 2 },
        { content: 'Hello again', senderId: 1 },
      ];
      const results = searchMessages(messages, 'hello');
      expect(results.length).toBe(2);
    });

    it('should be case insensitive', () => {
      const messages = [{ content: 'HELLO', senderId: 1 }];
      expect(searchMessages(messages, 'hello').length).toBe(1);
    });

    it('should return empty for no matches', () => {
      const messages = [{ content: 'Hello', senderId: 1 }];
      expect(searchMessages(messages, 'xyz').length).toBe(0);
    });
  });

  describe('Typing Indicator', () => {
    const TYPING_TIMEOUT_MS = 3000;

    const isTyping = (lastTypingAt: Date | null): boolean => {
      if (!lastTypingAt) return false;
      const now = new Date();
      return now.getTime() - lastTypingAt.getTime() < TYPING_TIMEOUT_MS;
    };

    it('should show typing for recent activity', () => {
      const recent = new Date();
      expect(isTyping(recent)).toBe(true);
    });

    it('should not show typing for old activity', () => {
      const old = new Date(Date.now() - 5000);
      expect(isTyping(old)).toBe(false);
    });

    it('should handle null', () => {
      expect(isTyping(null)).toBe(false);
    });
  });

  describe('Message Attachments', () => {
    const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip'];

    const validateAttachment = (
      file: { size: number; type: string; name: string }
    ): { valid: boolean; error?: string } => {
      if (file.size > MAX_ATTACHMENT_SIZE) {
        return { valid: false, error: 'Datei zu groß (max 10MB)' };
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Dateityp nicht erlaubt' };
      }
      return { valid: true };
    };

    it('should accept valid attachments', () => {
      const file = { size: 1024, type: 'image/jpeg', name: 'photo.jpg' };
      expect(validateAttachment(file).valid).toBe(true);
    });

    it('should reject oversized files', () => {
      const file = { size: 20 * 1024 * 1024, type: 'image/jpeg', name: 'large.jpg' };
      expect(validateAttachment(file).valid).toBe(false);
    });

    it('should reject disallowed types', () => {
      const file = { size: 1024, type: 'application/exe', name: 'virus.exe' };
      expect(validateAttachment(file).valid).toBe(false);
    });
  });

  describe('Message Reactions', () => {
    const ALLOWED_REACTIONS = ['👍', '❤️', '😊', '😂', '😮', '😢', '🎉'];

    const addReaction = (
      messageId: number,
      userId: number,
      reaction: string,
      existingReactions: { messageId: number; userId: number; reaction: string }[]
    ): { success: boolean; error?: string } => {
      if (!ALLOWED_REACTIONS.includes(reaction)) {
        return { success: false, error: 'Reaktion nicht erlaubt' };
      }

      const existing = existingReactions.find(
        r => r.messageId === messageId && r.userId === userId && r.reaction === reaction
      );
      if (existing) {
        return { success: false, error: 'Bereits reagiert' };
      }

      return { success: true };
    };

    it('should allow valid reactions', () => {
      expect(addReaction(1, 1, '👍', []).success).toBe(true);
    });

    it('should reject invalid reactions', () => {
      expect(addReaction(1, 1, '💀', []).success).toBe(false);
    });

    it('should prevent duplicate reactions', () => {
      const existing = [{ messageId: 1, userId: 1, reaction: '👍' }];
      expect(addReaction(1, 1, '👍', existing).success).toBe(false);
    });
  });

  describe('Message Threading', () => {
    const getThreadMessages = (
      messages: { id: number; parentId: number | null }[],
      parentId: number
    ) => {
      return messages.filter(m => m.parentId === parentId);
    };

    const countReplies = (
      messages: { parentId: number | null }[],
      parentId: number
    ): number => {
      return messages.filter(m => m.parentId === parentId).length;
    };

    it('should get thread messages', () => {
      const messages = [
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 1 },
        { id: 4, parentId: null },
      ];
      expect(getThreadMessages(messages, 1).length).toBe(2);
    });

    it('should count replies', () => {
      const messages = [
        { parentId: null },
        { parentId: 1 },
        { parentId: 1 },
        { parentId: 2 },
      ];
      expect(countReplies(messages, 1)).toBe(2);
    });
  });

  describe('Message Delivery Status', () => {
    type DeliveryStatus = 'sent' | 'delivered' | 'read';

    const getStatusIcon = (status: DeliveryStatus): string => {
      const icons: Record<DeliveryStatus, string> = {
        sent: '✓',
        delivered: '✓✓',
        read: '✓✓', // blue in UI
      };
      return icons[status];
    };

    const updateDeliveryStatus = (
      currentStatus: DeliveryStatus,
      newStatus: DeliveryStatus
    ): DeliveryStatus => {
      const order: DeliveryStatus[] = ['sent', 'delivered', 'read'];
      const currentIndex = order.indexOf(currentStatus);
      const newIndex = order.indexOf(newStatus);
      return newIndex > currentIndex ? newStatus : currentStatus;
    };

    it('should return correct icons', () => {
      expect(getStatusIcon('sent')).toBe('✓');
      expect(getStatusIcon('delivered')).toBe('✓✓');
    });

    it('should only update to higher status', () => {
      expect(updateDeliveryStatus('sent', 'delivered')).toBe('delivered');
      expect(updateDeliveryStatus('read', 'delivered')).toBe('read');
    });
  });

  describe('Quick Replies', () => {
    const QUICK_REPLIES = [
      'Danke für Ihre Nachricht!',
      'Ich melde mich bald bei Ihnen.',
      'Können Sie mir mehr Details geben?',
      'Das klingt interessant!',
      'Ich bin gerade beschäftigt, antworte später.',
    ];

    const getQuickReplies = (context: 'order' | 'inquiry' | 'general'): string[] => {
      const contextReplies: Record<string, string[]> = {
        order: [
          'Ich habe Ihre Bestellung erhalten.',
          'Ich beginne sofort mit der Arbeit.',
          'Können Sie mir die Anforderungen senden?',
        ],
        inquiry: [
          'Danke für Ihr Interesse!',
          'Ich kann Ihnen gerne ein Angebot machen.',
          'Haben Sie spezielle Anforderungen?',
        ],
        general: QUICK_REPLIES,
      };
      return contextReplies[context];
    };

    it('should return context-specific replies', () => {
      expect(getQuickReplies('order').length).toBe(3);
      expect(getQuickReplies('inquiry').length).toBe(3);
      expect(getQuickReplies('general').length).toBe(5);
    });
  });

  describe('Message Export', () => {
    const exportConversation = (
      messages: { content: string; senderId: number; createdAt: Date }[],
      format: 'text' | 'json'
    ) => {
      if (format === 'json') {
        return JSON.stringify(messages, null, 2);
      }
      return messages.map(m => 
        `[${m.createdAt.toISOString()}] User ${m.senderId}: ${m.content}`
      ).join('\n');
    };

    it('should export as JSON', () => {
      const messages = [{ content: 'Hello', senderId: 1, createdAt: new Date() }];
      const exported = exportConversation(messages, 'json');
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should export as text', () => {
      const messages = [{ content: 'Hello', senderId: 1, createdAt: new Date() }];
      const exported = exportConversation(messages, 'text');
      expect(exported).toContain('User 1: Hello');
    });
  });
});
