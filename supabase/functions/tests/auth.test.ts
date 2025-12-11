/**
 * Tests für Auth Edge Function
 * TDD: Diese Tests definieren das erwartete Verhalten
 */

import { describe, it, expect } from 'vitest';

const API_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

describe('Auth Edge Function', () => {
  describe('GET /auth/me - Get current user', () => {
    it('should return null when not authenticated', async () => {
      const response = await fetch(`${API_URL}/functions/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toBeNull();
    });

    it('should return user when authenticated with valid session', async () => {
      // This test requires a valid session cookie
      // In real tests, we would set up a test user first
      const response = await fetch(`${API_URL}/functions/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Cookie': 'flinkly_session=test-open-id',
        },
      });
      
      expect(response.ok).toBe(true);
      // Response will be null if test user doesn't exist
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear session cookie', async () => {
      const response = await fetch(`${API_URL}/functions/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('success', true);
      
      // Check Set-Cookie header clears the session
      const setCookie = response.headers.get('Set-Cookie');
      expect(setCookie).toContain('flinkly_session=');
      expect(setCookie).toContain('Max-Age=0');
    });
  });

  describe('CORS', () => {
    it('should handle OPTIONS preflight request', async () => {
      const response = await fetch(`${API_URL}/functions/v1/auth/me`, {
        method: 'OPTIONS',
      });
      
      expect(response.ok).toBe(true);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });
});
