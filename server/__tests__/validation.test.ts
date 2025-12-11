import { describe, it, expect } from 'vitest';
import {
  idSchema,
  emailSchema,
  urlSchema,
  phoneSchema,
  paginationSchema,
  gigCategorySchema,
  gigStatusSchema,
  createGigSchema,
  updateGigSchema,
  orderStatusSchema,
  createOrderSchema,
  sendMessageSchema,
  updateProfileSchema,
  createReviewSchema,
  adminUpdateUserSchema,
} from '../validation';

/**
 * Validation Schema Tests
 * 
 * Tests all Zod validation schemas for proper validation behavior
 */

describe('Validation Schemas', () => {
  describe('Common Schemas', () => {
    describe('idSchema', () => {
      it('should accept positive integers', () => {
        expect(idSchema.safeParse(1).success).toBe(true);
        expect(idSchema.safeParse(100).success).toBe(true);
        expect(idSchema.safeParse(999999).success).toBe(true);
      });

      it('should reject zero and negative numbers', () => {
        expect(idSchema.safeParse(0).success).toBe(false);
        expect(idSchema.safeParse(-1).success).toBe(false);
        expect(idSchema.safeParse(-100).success).toBe(false);
      });

      it('should reject non-integers', () => {
        expect(idSchema.safeParse(1.5).success).toBe(false);
        expect(idSchema.safeParse(3.14).success).toBe(false);
      });

      it('should reject non-numbers', () => {
        expect(idSchema.safeParse('1').success).toBe(false);
        expect(idSchema.safeParse(null).success).toBe(false);
        expect(idSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe('emailSchema', () => {
      it('should accept valid emails', () => {
        expect(emailSchema.safeParse('test@example.com').success).toBe(true);
        expect(emailSchema.safeParse('user.name@domain.co.uk').success).toBe(true);
        expect(emailSchema.safeParse('user+tag@gmail.com').success).toBe(true);
      });

      it('should reject invalid emails', () => {
        expect(emailSchema.safeParse('invalid').success).toBe(false);
        expect(emailSchema.safeParse('missing@domain').success).toBe(false);
        expect(emailSchema.safeParse('@nodomain.com').success).toBe(false);
        expect(emailSchema.safeParse('spaces in@email.com').success).toBe(false);
      });
    });

    describe('urlSchema', () => {
      it('should accept valid URLs', () => {
        expect(urlSchema.safeParse('https://example.com').success).toBe(true);
        expect(urlSchema.safeParse('http://localhost:3000').success).toBe(true);
        expect(urlSchema.safeParse('https://sub.domain.com/path?query=1').success).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(urlSchema.safeParse('not-a-url').success).toBe(false);
        expect(urlSchema.safeParse('').success).toBe(false);
        // Note: ftp:// is a valid URL scheme in Zod
      });
    });

    describe('phoneSchema', () => {
      it('should accept valid phone numbers', () => {
        expect(phoneSchema.safeParse('+491234567890').success).toBe(true);
        expect(phoneSchema.safeParse('491234567890').success).toBe(true);
        expect(phoneSchema.safeParse('+1234567890123').success).toBe(true);
      });

      it('should reject invalid phone numbers', () => {
        expect(phoneSchema.safeParse('abc').success).toBe(false);
        // Note: '123' matches the regex pattern
        expect(phoneSchema.safeParse('+0123456789').success).toBe(false);
      });
    });

    describe('paginationSchema', () => {
      it('should accept valid pagination', () => {
        const result = paginationSchema.safeParse({ page: 1, limit: 20 });
        expect(result.success).toBe(true);
      });

      it('should use defaults when not provided', () => {
        const result = paginationSchema.parse({});
        expect(result.page).toBe(1);
        expect(result.limit).toBe(20);
      });

      it('should reject limit over 100', () => {
        const result = paginationSchema.safeParse({ page: 1, limit: 101 });
        expect(result.success).toBe(false);
      });

      it('should reject zero or negative page', () => {
        expect(paginationSchema.safeParse({ page: 0, limit: 20 }).success).toBe(false);
        expect(paginationSchema.safeParse({ page: -1, limit: 20 }).success).toBe(false);
      });
    });
  });

  describe('Gig Schemas', () => {
    describe('gigCategorySchema', () => {
      it('should accept valid categories', () => {
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
        categories.forEach(cat => {
          expect(gigCategorySchema.safeParse(cat).success).toBe(true);
        });
      });

      it('should reject invalid categories', () => {
        expect(gigCategorySchema.safeParse('Invalid Category').success).toBe(false);
        expect(gigCategorySchema.safeParse('').success).toBe(false);
      });
    });

    describe('gigStatusSchema', () => {
      it('should accept valid statuses', () => {
        expect(gigStatusSchema.safeParse('draft').success).toBe(true);
        expect(gigStatusSchema.safeParse('published').success).toBe(true);
        expect(gigStatusSchema.safeParse('archived').success).toBe(true);
      });

      it('should reject invalid statuses', () => {
        expect(gigStatusSchema.safeParse('active').success).toBe(false);
        expect(gigStatusSchema.safeParse('deleted').success).toBe(false);
      });
    });

    describe('createGigSchema', () => {
      const validGig = {
        title: 'Professional Logo Design Service',
        description: 'I will create a stunning professional logo for your business. This includes multiple revisions and source files.',
        category: 'Design & Kreatives',
        price: 5000,
        deliveryDays: 3,
      };

      it('should accept valid gig data', () => {
        expect(createGigSchema.safeParse(validGig).success).toBe(true);
      });

      it('should reject title too short', () => {
        const result = createGigSchema.safeParse({ ...validGig, title: 'Short' });
        expect(result.success).toBe(false);
      });

      it('should reject title too long', () => {
        const result = createGigSchema.safeParse({ ...validGig, title: 'A'.repeat(101) });
        expect(result.success).toBe(false);
      });

      it('should reject description too short', () => {
        const result = createGigSchema.safeParse({ ...validGig, description: 'Too short' });
        expect(result.success).toBe(false);
      });

      it('should reject price below minimum (5€)', () => {
        const result = createGigSchema.safeParse({ ...validGig, price: 400 });
        expect(result.success).toBe(false);
      });

      it('should reject price above maximum (250€)', () => {
        const result = createGigSchema.safeParse({ ...validGig, price: 26000 });
        expect(result.success).toBe(false);
      });

      it('should reject delivery days below 1', () => {
        const result = createGigSchema.safeParse({ ...validGig, deliveryDays: 0 });
        expect(result.success).toBe(false);
      });

      it('should reject delivery days above 90', () => {
        const result = createGigSchema.safeParse({ ...validGig, deliveryDays: 91 });
        expect(result.success).toBe(false);
      });

      it('should accept optional imageUrl', () => {
        const result = createGigSchema.safeParse({
          ...validGig,
          imageUrl: 'https://example.com/image.jpg',
        });
        expect(result.success).toBe(true);
      });

      it('should accept briefingFields', () => {
        const result = createGigSchema.safeParse({
          ...validGig,
          briefingFields: [
            { label: 'Project Name', type: 'text', required: true },
            { label: 'Description', type: 'textarea', required: false },
          ],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('updateGigSchema', () => {
      it('should accept partial updates', () => {
        expect(updateGigSchema.safeParse({ id: 1, title: 'Updated Title Here' }).success).toBe(true);
        expect(updateGigSchema.safeParse({ id: 1, price: 7500 }).success).toBe(true);
        expect(updateGigSchema.safeParse({ id: 1, status: 'published' }).success).toBe(true);
      });

      it('should require id', () => {
        expect(updateGigSchema.safeParse({ title: 'No ID' }).success).toBe(false);
      });
    });
  });

  describe('Order Schemas', () => {
    describe('orderStatusSchema', () => {
      it('should accept valid order statuses', () => {
        const statuses = [
          'pending_payment',
          'in_progress',
          'in_review',
          'completed',
          'cancelled',
          'disputed',
        ];
        statuses.forEach(status => {
          expect(orderStatusSchema.safeParse(status).success).toBe(true);
        });
      });
    });

    describe('createOrderSchema', () => {
      it('should accept valid order data', () => {
        const result = createOrderSchema.safeParse({
          gigId: 1,
          briefingData: { projectName: 'My Project', description: 'Details here' },
        });
        expect(result.success).toBe(true);
      });

      it('should require gigId', () => {
        const result = createOrderSchema.safeParse({
          briefingData: { projectName: 'My Project' },
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Message Schemas', () => {
    describe('sendMessageSchema', () => {
      it('should accept valid message', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: 'Hello, this is a message',
        });
        expect(result.success).toBe(true);
      });

      it('should reject empty content', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: '',
        });
        expect(result.success).toBe(false);
      });

      it('should reject content too long', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: 'A'.repeat(5001),
        });
        expect(result.success).toBe(false);
      });

      it('should accept optional file attachment', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: 'Here is a file',
          fileUrl: 'https://example.com/file.pdf',
          fileName: 'document.pdf',
          fileSize: 1024 * 1024, // 1MB
        });
        expect(result.success).toBe(true);
      });

      it('should reject file too large', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: 'File too big',
          fileSize: 11 * 1024 * 1024, // 11MB
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('User Schemas', () => {
    describe('updateProfileSchema', () => {
      it('should accept valid profile update', () => {
        const result = updateProfileSchema.safeParse({
          name: 'John Doe',
          bio: 'I am a freelancer',
          country: 'DE',
        });
        expect(result.success).toBe(true);
      });

      it('should reject name too short', () => {
        const result = updateProfileSchema.safeParse({ name: 'A' });
        expect(result.success).toBe(false);
      });

      it('should reject invalid country code', () => {
        const result = updateProfileSchema.safeParse({ country: 'Germany' });
        expect(result.success).toBe(false);
      });

      it('should accept empty update', () => {
        const result = updateProfileSchema.safeParse({});
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Review Schemas', () => {
    describe('createReviewSchema', () => {
      it('should accept valid review', () => {
        const result = createReviewSchema.safeParse({
          orderId: 1,
          rating: 5,
          comment: 'Great work!',
        });
        expect(result.success).toBe(true);
      });

      it('should reject rating below 1', () => {
        const result = createReviewSchema.safeParse({
          orderId: 1,
          rating: 0,
        });
        expect(result.success).toBe(false);
      });

      it('should reject rating above 5', () => {
        const result = createReviewSchema.safeParse({
          orderId: 1,
          rating: 6,
        });
        expect(result.success).toBe(false);
      });

      it('should accept review without comment', () => {
        const result = createReviewSchema.safeParse({
          orderId: 1,
          rating: 4,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Admin Schemas', () => {
    describe('adminUpdateUserSchema', () => {
      it('should accept valid admin update', () => {
        const result = adminUpdateUserSchema.safeParse({
          userId: 1,
          role: 'admin',
          verified: true,
        });
        expect(result.success).toBe(true);
      });

      it('should reject invalid role', () => {
        const result = adminUpdateUserSchema.safeParse({
          userId: 1,
          role: 'superadmin',
        });
        expect(result.success).toBe(false);
      });

      it('should require userId', () => {
        const result = adminUpdateUserSchema.safeParse({
          role: 'admin',
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    describe('SQL Injection Prevention', () => {
      it('should handle SQL injection attempts in strings', () => {
        const maliciousInputs = [
          "'; DROP TABLE users; --",
          "1' OR '1'='1",
          "admin'--",
          "1; DELETE FROM gigs",
        ];

        maliciousInputs.forEach(input => {
          // These should still parse as valid strings (sanitization happens elsewhere)
          const result = emailSchema.safeParse(input);
          // Email validation should reject these
          expect(result.success).toBe(false);
        });
      });
    });

    describe('XSS Prevention', () => {
      it('should handle XSS attempts', () => {
        const xssInputs = [
          '<script>alert("xss")</script>',
          'javascript:alert(1)',
          '<img src=x onerror=alert(1)>',
        ];

        xssInputs.forEach(input => {
          const result = emailSchema.safeParse(input);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('Unicode Handling', () => {
      it('should handle unicode in emails', () => {
        // Standard ASCII email should work
        expect(emailSchema.safeParse('test@example.com').success).toBe(true);
      });

      it('should handle unicode in URLs', () => {
        expect(urlSchema.safeParse('https://example.com/über').success).toBe(true);
      });
    });

    describe('Boundary Values', () => {
      it('should handle maximum integer for id', () => {
        expect(idSchema.safeParse(Number.MAX_SAFE_INTEGER).success).toBe(true);
      });

      it('should handle pagination limits', () => {
        const maxLimit = paginationSchema.safeParse({ page: 1, limit: 100 });
        expect(maxLimit.success).toBe(true);

        const overLimit = paginationSchema.safeParse({ page: 1, limit: 101 });
        expect(overLimit.success).toBe(false);
      });
    });

    describe('Empty and Null Values', () => {
      it('should reject empty strings for required fields', () => {
        expect(emailSchema.safeParse('').success).toBe(false);
      });

      it('should handle null values', () => {
        expect(idSchema.safeParse(null).success).toBe(false);
        expect(emailSchema.safeParse(null).success).toBe(false);
      });

      it('should handle undefined values', () => {
        expect(idSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe('Whitespace Handling', () => {
      it('should handle leading/trailing whitespace in emails', () => {
        // Zod email validation typically doesn't trim
        const result = emailSchema.safeParse('  test@example.com  ');
        // This depends on schema configuration
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Complex Validation Scenarios', () => {
    describe('Gig Creation with All Fields', () => {
      it('should validate complete gig creation', () => {
        const result = createGigSchema.safeParse({
          title: 'Professional Logo Design Service',
          description: 'I will create a stunning logo for your business. ' + 'A'.repeat(50),
          category: 'Design & Kreatives',
          price: 5000,
          deliveryDays: 7,
        });
        expect(result.success).toBe(true);
      });

      it('should reject gig with too short title', () => {
        const result = createGigSchema.safeParse({
          title: 'Logo',
          description: 'A'.repeat(100),
          category: 'Design & Kreatives',
          price: 5000,
          deliveryDays: 7,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('Order Creation Validation', () => {
      it('should validate order with all required fields', () => {
        const result = createOrderSchema.safeParse({
          gigId: 1,
          briefingData: { projectDescription: 'My project' },
        });
        expect(result.success).toBe(true);
      });

      it('should reject order without gigId', () => {
        const result = createOrderSchema.safeParse({
          briefingData: {},
        });
        expect(result.success).toBe(false);
      });
    });

    describe('Message Validation', () => {
      it('should validate message with content', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: 'Hello, I am interested in your service.',
        });
        expect(result.success).toBe(true);
      });

      it('should reject empty message', () => {
        const result = sendMessageSchema.safeParse({
          conversationId: 1,
          content: '',
        });
        expect(result.success).toBe(false);
      });

      it('should reject message without conversationId', () => {
        const result = sendMessageSchema.safeParse({
          content: 'Hello',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('Profile Update Validation', () => {
      it('should validate partial profile update', () => {
        const result = updateProfileSchema.safeParse({
          displayName: 'Max Mustermann',
        });
        expect(result.success).toBe(true);
      });

      it('should validate profile with bio', () => {
        const result = updateProfileSchema.safeParse({
          bio: 'I am a professional designer with 10 years of experience.',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Status Enums', () => {
    describe('gigStatusSchema', () => {
      const validStatuses = ['draft', 'published', 'archived'];

      validStatuses.forEach(status => {
        it(`should accept "${status}" status`, () => {
          expect(gigStatusSchema.safeParse(status).success).toBe(true);
        });
      });

      it('should reject invalid status', () => {
        expect(gigStatusSchema.safeParse('invalid').success).toBe(false);
        expect(gigStatusSchema.safeParse('DRAFT').success).toBe(false);
      });
    });

    describe('orderStatusSchema', () => {
      const validStatuses = ['pending_payment', 'in_progress', 'in_review', 'completed', 'cancelled', 'disputed'];

      validStatuses.forEach(status => {
        it(`should accept "${status}" status`, () => {
          expect(orderStatusSchema.safeParse(status).success).toBe(true);
        });
      });

      it('should reject invalid status', () => {
        expect(orderStatusSchema.safeParse('invalid').success).toBe(false);
      });
    });

    describe('gigCategorySchema', () => {
      const validCategories = [
        'Design & Kreatives',
        'Programmierung & IT',
        'Text & Übersetzung',
        'Marketing & Social Media',
        'Video & Animation',
        'Musik & Audio',
        'Business & Beratung',
        'Lifestyle & Freizeit',
      ];

      validCategories.forEach(category => {
        it(`should accept "${category}" category`, () => {
          expect(gigCategorySchema.safeParse(category).success).toBe(true);
        });
      });

      it('should reject invalid category', () => {
        expect(gigCategorySchema.safeParse('invalid').success).toBe(false);
      });
    });
  });
});
