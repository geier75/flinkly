/**
 * TDD Tests für Marketplace Flow
 * Kernfunktionen: Angebot erstellen, eigene Angebote sehen, alle Angebote browsen
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from '../adapters';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const hasCredentials = !!SUPABASE_URL;

describe.skipIf(!hasCredentials)('Marketplace Flow - TDD', () => {
  // Test data
  const testSellerId = `test_seller_${Date.now()}`;
  let createdUserId: number;
  let createdGigId: number;

  beforeAll(async () => {
    // Setup: Create test user
    await db.upsertUser({
      openId: testSellerId,
      name: 'Test Verkäufer',
      email: 'seller@test.de',
      loginMethod: 'test',
    });
    const user = await db.getUserByOpenId(testSellerId);
    if (!user) throw new Error('Test user creation failed');
    createdUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup: Delete test gig if created
    if (createdGigId) {
      try {
        await db.deleteGig(createdGigId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  describe('1. Angebot erstellen', () => {
    it('sollte ein neues Angebot erstellen können', async () => {
      const result = await db.createGig({
        sellerId: createdUserId,
        title: 'Webdesign Service',
        description: 'Ich erstelle moderne Webseiten für dein Business',
        category: 'design',
        tags: null,
        price: 15000, // 150€ in Cents
        deliveryDays: 7,
        imageUrl: null,
        status: 'published',
        active: true,
      });

      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('number');
      createdGigId = result.id;
    });

    it('sollte das erstellte Angebot abrufen können', async () => {
      const gig = await db.getGigById(createdGigId);

      expect(gig).not.toBeNull();
      expect(gig?.title).toBe('Webdesign Service');
      expect(gig?.sellerId).toBe(createdUserId);
      expect(gig?.price).toBe(15000);
      expect(gig?.status).toBe('published');
    });
  });

  describe('2. Meine Angebote anzeigen', () => {
    it('sollte alle Angebote des Verkäufers auflisten', async () => {
      const myGigs = await db.getSellerGigs(createdUserId);

      expect(Array.isArray(myGigs)).toBe(true);
      expect(myGigs.length).toBeGreaterThan(0);
      
      const myGig = myGigs.find(g => g.id === createdGigId);
      expect(myGig).toBeDefined();
      expect(myGig?.title).toBe('Webdesign Service');
    });

    it('sollte camelCase Properties haben (nicht snake_case)', async () => {
      const myGigs = await db.getSellerGigs(createdUserId);
      const gig = myGigs[0];

      // Prüfe camelCase
      expect(gig).toHaveProperty('sellerId');
      expect(gig).toHaveProperty('deliveryDays');
      expect(gig).toHaveProperty('imageUrl');
      expect(gig).toHaveProperty('createdAt');
      
      // Sollte NICHT snake_case haben
      expect(gig).not.toHaveProperty('seller_id');
      expect(gig).not.toHaveProperty('delivery_days');
    });
  });

  describe('3. Marketplace - Alle Angebote', () => {
    it('sollte veröffentlichte Angebote im Marketplace anzeigen', async () => {
      const allGigs = await db.getGigsPaginated({
        limit: 50,
        status: 'published',
      });

      expect(Array.isArray(allGigs)).toBe(true);
      expect(allGigs.length).toBeGreaterThan(0);
      
      // Jeder Gig sollte published sein
      for (const gig of allGigs) {
        expect(gig.status).toBe('published');
      }
    });

    it('sollte nach Kategorie filtern können', async () => {
      const designGigs = await db.getGigsPaginated({
        limit: 50,
        category: 'design',
      });

      // Alle zurückgegebenen Gigs sollten Kategorie 'design' haben
      for (const gig of designGigs) {
        expect(gig.category).toBe('design');
      }
    });

    it('sollte nach Preis sortieren können', async () => {
      const gigs = await db.getGigsPaginated({
        limit: 20,
        sortBy: 'price',
      });

      if (gigs.length > 1) {
        for (let i = 1; i < gigs.length; i++) {
          expect(gigs[i].price).toBeGreaterThanOrEqual(gigs[i-1].price);
        }
      }
    });
  });

  describe('4. Angebot aktualisieren', () => {
    it('sollte Preis ändern können', async () => {
      await db.updateGig(createdGigId, { price: 20000 });
      
      const updated = await db.getGigById(createdGigId);
      expect(updated?.price).toBe(20000);
    });

    it('sollte Titel ändern können', async () => {
      await db.updateGig(createdGigId, { title: 'Premium Webdesign' });
      
      const updated = await db.getGigById(createdGigId);
      expect(updated?.title).toBe('Premium Webdesign');
    });
  });

  describe('5. Angebot löschen', () => {
    it('sollte Angebot löschen können', async () => {
      await db.deleteGig(createdGigId);
      
      const deleted = await db.getGigById(createdGigId);
      expect(deleted).toBeNull();
      
      // Reset für cleanup
      createdGigId = 0;
    });
  });
});

describe('Database Connection', () => {
  it('sollte Verbindungsstatus melden', async () => {
    const connected = await db.isConnected();
    expect(typeof connected).toBe('boolean');
  });
});
