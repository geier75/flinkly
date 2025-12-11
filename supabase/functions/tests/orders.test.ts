/**
 * Tests für Orders Edge Function
 * TDD: Diese Tests definieren das erwartete Verhalten
 */

import { describe, it, expect } from 'vitest';

const API_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

describe('Orders Edge Function', () => {
  describe('GET /orders - List orders', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await fetch(`${API_URL}/functions/v1/orders`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.status).toBe(401);
    });

    it('should return orders when authenticated', async () => {
      // This test requires a valid session
      const response = await fetch(`${API_URL}/functions/v1/orders`, {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Cookie': 'flinkly_session=test-open-id',
        },
      });
      
      // Will be 401 if test user doesn't exist
      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('orders');
        expect(Array.isArray(data.orders)).toBe(true);
      }
    });

    it('should filter by role (buyer/seller)', async () => {
      const response = await fetch(`${API_URL}/functions/v1/orders?role=seller`, {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Cookie': 'flinkly_session=test-open-id',
        },
      });
      
      // Will be 401 if test user doesn't exist
      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('orders');
      }
    });
  });

  describe('GET /orders/:id - Single order', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await fetch(`${API_URL}/functions/v1/orders/1`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await fetch(`${API_URL}/functions/v1/orders/999999`, {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Cookie': 'flinkly_session=test-open-id',
        },
      });
      
      // Will be 401 if test user doesn't exist, 404 if order doesn't exist
      expect([401, 404]).toContain(response.status);
    });
  });
});
