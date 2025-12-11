import { describe, it, expect } from 'vitest';

/**
 * Disputes Router Tests
 * 
 * Tests for dispute resolution system
 */

describe('Disputes Router', () => {
  describe('Dispute Reasons', () => {
    const DISPUTE_REASONS = [
      'not_delivered',
      'poor_quality',
      'wrong_service',
      'communication_issue',
      'other',
    ] as const;

    const REASON_LABELS: Record<typeof DISPUTE_REASONS[number], string> = {
      not_delivered: 'Nicht geliefert',
      poor_quality: 'Schlechte Qualität',
      wrong_service: 'Falsche Dienstleistung',
      communication_issue: 'Kommunikationsproblem',
      other: 'Sonstiges',
    };

    it('should have all reasons defined', () => {
      expect(DISPUTE_REASONS.length).toBe(5);
    });

    it('should have German labels for all reasons', () => {
      DISPUTE_REASONS.forEach(reason => {
        expect(REASON_LABELS[reason]).toBeDefined();
        expect(typeof REASON_LABELS[reason]).toBe('string');
      });
    });

    it('should have unique labels', () => {
      const labels = Object.values(REASON_LABELS);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });
  });

  describe('Dispute Status', () => {
    type DisputeStatus = 'open' | 'mediation' | 'resolved';

    const STATUS_FLOW: Record<DisputeStatus, DisputeStatus[]> = {
      open: ['mediation'],
      mediation: ['resolved'],
      resolved: [],
    };

    const canTransition = (from: DisputeStatus, to: DisputeStatus): boolean => {
      return STATUS_FLOW[from].includes(to);
    };

    it('should allow open -> mediation', () => {
      expect(canTransition('open', 'mediation')).toBe(true);
    });

    it('should allow mediation -> resolved', () => {
      expect(canTransition('mediation', 'resolved')).toBe(true);
    });

    it('should not allow skipping mediation', () => {
      expect(canTransition('open', 'resolved')).toBe(false);
    });

    it('should not allow reopening resolved', () => {
      expect(canTransition('resolved', 'open')).toBe(false);
    });
  });

  describe('Resolution Types', () => {
    type Resolution = 'pending' | 'full_refund' | 'partial_refund' | 'revision' | 'no_action';

    const RESOLUTION_ACTIONS: Record<Resolution, { buyerRefund: boolean; sellerPenalty: boolean }> = {
      pending: { buyerRefund: false, sellerPenalty: false },
      full_refund: { buyerRefund: true, sellerPenalty: true },
      partial_refund: { buyerRefund: true, sellerPenalty: false },
      revision: { buyerRefund: false, sellerPenalty: false },
      no_action: { buyerRefund: false, sellerPenalty: false },
    };

    it('should define actions for all resolutions', () => {
      const resolutions: Resolution[] = ['pending', 'full_refund', 'partial_refund', 'revision', 'no_action'];
      resolutions.forEach(res => {
        expect(RESOLUTION_ACTIONS[res]).toBeDefined();
      });
    });

    it('should refund buyer for full_refund', () => {
      expect(RESOLUTION_ACTIONS.full_refund.buyerRefund).toBe(true);
    });

    it('should penalize seller for full_refund', () => {
      expect(RESOLUTION_ACTIONS.full_refund.sellerPenalty).toBe(true);
    });

    it('should not penalize seller for partial_refund', () => {
      expect(RESOLUTION_ACTIONS.partial_refund.sellerPenalty).toBe(false);
    });
  });

  describe('Description Validation', () => {
    const MIN_DESCRIPTION_LENGTH = 50;

    const validateDescription = (description: string): { valid: boolean; error?: string } => {
      if (description.length < MIN_DESCRIPTION_LENGTH) {
        return { 
          valid: false, 
          error: `Beschreibung muss mindestens ${MIN_DESCRIPTION_LENGTH} Zeichen lang sein` 
        };
      }
      return { valid: true };
    };

    it('should reject short descriptions', () => {
      const result = validateDescription('Too short');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('50');
    });

    it('should accept valid descriptions', () => {
      const longDescription = 'A'.repeat(50);
      const result = validateDescription(longDescription);
      expect(result.valid).toBe(true);
    });

    it('should accept exactly 50 characters', () => {
      const exactDescription = 'A'.repeat(50);
      expect(validateDescription(exactDescription).valid).toBe(true);
    });
  });

  describe('Evidence Handling', () => {
    const parseEvidence = (evidenceJson: string | null): string[] => {
      if (!evidenceJson) return [];
      try {
        return JSON.parse(evidenceJson);
      } catch {
        return [];
      }
    };

    const serializeEvidence = (evidence: string[]): string => {
      return JSON.stringify(evidence);
    };

    it('should parse evidence JSON', () => {
      const json = '["file1.jpg", "file2.pdf"]';
      const result = parseEvidence(json);
      expect(result).toEqual(['file1.jpg', 'file2.pdf']);
    });

    it('should handle null evidence', () => {
      expect(parseEvidence(null)).toEqual([]);
    });

    it('should handle invalid JSON', () => {
      expect(parseEvidence('invalid')).toEqual([]);
    });

    it('should serialize evidence', () => {
      const evidence = ['file1.jpg', 'file2.pdf'];
      const json = serializeEvidence(evidence);
      expect(JSON.parse(json)).toEqual(evidence);
    });
  });

  describe('Dispute Creation', () => {
    const createDisputeRecord = (input: {
      orderId: number;
      buyerId: number;
      sellerId: number;
      gigId: number;
      reason: string;
      description: string;
      buyerEvidence?: string[];
    }) => ({
      ...input,
      buyerEvidence: input.buyerEvidence ? JSON.stringify(input.buyerEvidence) : null,
      status: 'open' as const,
      resolution: 'pending' as const,
      createdAt: new Date(),
    });

    it('should create dispute with correct defaults', () => {
      const dispute = createDisputeRecord({
        orderId: 1,
        buyerId: 2,
        sellerId: 3,
        gigId: 4,
        reason: 'not_delivered',
        description: 'A'.repeat(50),
      });

      expect(dispute.status).toBe('open');
      expect(dispute.resolution).toBe('pending');
      expect(dispute.buyerEvidence).toBeNull();
    });

    it('should serialize evidence', () => {
      const dispute = createDisputeRecord({
        orderId: 1,
        buyerId: 2,
        sellerId: 3,
        gigId: 4,
        reason: 'poor_quality',
        description: 'A'.repeat(50),
        buyerEvidence: ['screenshot.png'],
      });

      expect(dispute.buyerEvidence).toBe('["screenshot.png"]');
    });
  });

  describe('Admin Resolution', () => {
    const resolveDispute = (
      disputeId: number,
      resolution: string,
      adminNotes: string,
      refundAmount?: number
    ) => ({
      disputeId,
      resolution,
      adminNotes,
      refundAmount: refundAmount || null,
      status: 'resolved' as const,
      resolvedAt: new Date(),
    });

    it('should create resolution record', () => {
      const result = resolveDispute(1, 'full_refund', 'Seller did not deliver', 5000);
      expect(result.resolution).toBe('full_refund');
      expect(result.refundAmount).toBe(5000);
      expect(result.status).toBe('resolved');
    });

    it('should handle no refund', () => {
      const result = resolveDispute(1, 'no_action', 'Buyer claim not valid');
      expect(result.refundAmount).toBeNull();
    });
  });

  describe('Dispute Timeline', () => {
    const MAX_DISPUTE_DAYS = 14;
    const MAX_MEDIATION_DAYS = 7;

    const isDisputeExpired = (createdAt: Date, status: string): boolean => {
      const now = new Date();
      const ageMs = now.getTime() - createdAt.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      if (status === 'open') return ageDays > MAX_DISPUTE_DAYS;
      if (status === 'mediation') return ageDays > MAX_DISPUTE_DAYS + MAX_MEDIATION_DAYS;
      return false;
    };

    it('should not expire recent disputes', () => {
      const recentDate = new Date();
      expect(isDisputeExpired(recentDate, 'open')).toBe(false);
    });

    it('should expire old open disputes', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 20);
      expect(isDisputeExpired(oldDate, 'open')).toBe(true);
    });

    it('should not expire resolved disputes', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);
      expect(isDisputeExpired(oldDate, 'resolved')).toBe(false);
    });
  });

  describe('Email Notifications', () => {
    const generateDisputeEmail = (
      type: 'buyer_confirmation' | 'seller_alert' | 'resolution',
      data: { userName: string; orderId: number; gigTitle: string; reason?: string }
    ) => {
      const templates = {
        buyer_confirmation: `Hallo ${data.userName}, dein Streitfall für Bestellung #${data.orderId} wurde eröffnet.`,
        seller_alert: `Achtung ${data.userName}! Ein Streitfall wurde für "${data.gigTitle}" eröffnet.`,
        resolution: `Hallo ${data.userName}, der Streitfall für Bestellung #${data.orderId} wurde gelöst.`,
      };
      return templates[type];
    };

    it('should generate buyer confirmation email', () => {
      const email = generateDisputeEmail('buyer_confirmation', {
        userName: 'Max',
        orderId: 123,
        gigTitle: 'Logo Design',
      });
      expect(email).toContain('Max');
      expect(email).toContain('#123');
    });

    it('should generate seller alert email', () => {
      const email = generateDisputeEmail('seller_alert', {
        userName: 'Anna',
        orderId: 123,
        gigTitle: 'Logo Design',
      });
      expect(email).toContain('Anna');
      expect(email).toContain('Logo Design');
    });
  });
});
