/**
 * Tests für Gigs Edge Function
 * TDD: Diese Tests definieren das erwartete Verhalten
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

describe('Gigs Edge Function', () => {
  describe('GET /gigs - List gigs', () => {
    it('should return gigs array with pagination', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('gigs');
      expect(Array.isArray(data.gigs)).toBe(true);
      expect(data).toHaveProperty('nextCursor');
    });

    it('should filter by category', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs?category=design`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      data.gigs.forEach((gig: any) => {
        expect(gig.category).toBe('design');
      });
    });

    it('should filter by price range', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs?minPrice=10&maxPrice=100`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      data.gigs.forEach((gig: any) => {
        expect(gig.price).toBeGreaterThanOrEqual(10);
        expect(gig.price).toBeLessThanOrEqual(100);
      });
    });

    it('should sort by price ascending', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs?sortBy=price`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      for (let i = 1; i < data.gigs.length; i++) {
        expect(data.gigs[i].price).toBeGreaterThanOrEqual(data.gigs[i - 1].price);
      }
    });

    it('should respect limit parameter', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs?limit=5`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data.gigs.length).toBeLessThanOrEqual(5);
    });

    it('should enforce max limit of 100', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs?limit=200`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data.gigs.length).toBeLessThanOrEqual(100);
    });
  });

  describe('GET /gigs/:id - Single gig', () => {
    it('should return gig with packages and seller', async () => {
      // First get a gig ID
      const listResponse = await fetch(`${API_URL}/functions/v1/gigs?limit=1`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      const listData = await listResponse.json();
      
      if (listData.gigs.length === 0) {
        console.log('No gigs available for testing');
        return;
      }
      
      const gigId = listData.gigs[0].id;
      
      const response = await fetch(`${API_URL}/functions/v1/gigs/${gigId}`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.ok).toBe(true);
      const gig = await response.json();
      
      expect(gig).toHaveProperty('id', gigId);
      expect(gig).toHaveProperty('title');
      expect(gig).toHaveProperty('description');
      expect(gig).toHaveProperty('price');
      expect(gig).toHaveProperty('packages');
      expect(gig).toHaveProperty('seller');
    });

    it('should return 404 for non-existent gig', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs/999999`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid gig ID', async () => {
      const response = await fetch(`${API_URL}/functions/v1/gigs/invalid`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      });
      
      expect(response.status).toBe(400);
    });
  });
});
