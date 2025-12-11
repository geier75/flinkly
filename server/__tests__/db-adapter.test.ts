/**
 * TDD Tests for Database Adapter
 * Step 1: Define the interface through tests
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Types that both MySQL and Supabase adapters must support
interface DbUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  loginMethod: string | null;
  sellerLevel: 'new' | 'rising' | 'level_one' | 'top_rated' | null;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  createdAt: Date;
  lastSignedIn: Date;
}

interface DbGig {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  imageUrl: string | null;
  status: 'draft' | 'published' | 'archived';
  active: boolean;
  createdAt: Date;
}

interface DbAdapter {
  // User operations
  getUserByOpenId(openId: string): Promise<DbUser | null>;
  getUserById(id: number): Promise<DbUser | null>;
  upsertUser(user: Partial<DbUser> & { openId: string }): Promise<void>;
  
  // Gig operations
  getGigById(id: number): Promise<DbGig | null>;
  getGigsPaginated(options: {
    limit?: number;
    cursor?: number;
    category?: string;
    sellerId?: number;
  }): Promise<DbGig[]>;
  createGig(gig: Omit<DbGig, 'id' | 'createdAt'>): Promise<{ id: number }>;
  updateGig(id: number, updates: Partial<DbGig>): Promise<void>;
  deleteGig(id: number): Promise<void>;
  
  // Health check
  isConnected(): Promise<boolean>;
}

describe('DbAdapter Interface', () => {
  describe('User Operations', () => {
    it('should define getUserByOpenId returning DbUser or null', async () => {
      // This test defines the contract
      const mockAdapter: DbAdapter = {
        getUserByOpenId: async (openId: string) => null,
        getUserById: async (id: number) => null,
        upsertUser: async () => {},
        getGigById: async () => null,
        getGigsPaginated: async () => [],
        createGig: async () => ({ id: 1 }),
        updateGig: async () => {},
        deleteGig: async () => {},
        isConnected: async () => true,
      };
      
      const result = await mockAdapter.getUserByOpenId('test_user');
      expect(result).toBeNull();
    });

    it('should define upsertUser with openId required', async () => {
      let upsertedUser: any = null;
      
      const mockAdapter: DbAdapter = {
        getUserByOpenId: async () => null,
        getUserById: async () => null,
        upsertUser: async (user) => { upsertedUser = user; },
        getGigById: async () => null,
        getGigsPaginated: async () => [],
        createGig: async () => ({ id: 1 }),
        updateGig: async () => {},
        deleteGig: async () => {},
        isConnected: async () => true,
      };
      
      await mockAdapter.upsertUser({ 
        openId: 'test_123', 
        name: 'Test User',
        email: 'test@example.com'
      });
      
      expect(upsertedUser.openId).toBe('test_123');
      expect(upsertedUser.name).toBe('Test User');
    });
  });

  describe('Gig Operations', () => {
    it('should define createGig returning id', async () => {
      let createdGig: any = null;
      
      const mockAdapter: DbAdapter = {
        getUserByOpenId: async () => null,
        getUserById: async () => null,
        upsertUser: async () => {},
        getGigById: async () => null,
        getGigsPaginated: async () => [],
        createGig: async (gig) => { 
          createdGig = gig;
          return { id: 42 }; 
        },
        updateGig: async () => {},
        deleteGig: async () => {},
        isConnected: async () => true,
      };
      
      const result = await mockAdapter.createGig({
        sellerId: 1,
        title: 'Test Gig',
        description: 'A test gig description',
        category: 'design',
        price: 5000,
        deliveryDays: 3,
        imageUrl: null,
        status: 'published',
        active: true,
      });
      
      expect(result.id).toBe(42);
      expect(createdGig.title).toBe('Test Gig');
      expect(createdGig.sellerId).toBe(1);
    });

    it('should define getGigsPaginated with filtering options', async () => {
      const mockGigs: DbGig[] = [
        {
          id: 1,
          sellerId: 1,
          title: 'Design Gig',
          description: 'A design gig',
          category: 'design',
          price: 5000,
          deliveryDays: 3,
          imageUrl: null,
          status: 'published',
          active: true,
          createdAt: new Date(),
        }
      ];
      
      const mockAdapter: DbAdapter = {
        getUserByOpenId: async () => null,
        getUserById: async () => null,
        upsertUser: async () => {},
        getGigById: async () => null,
        getGigsPaginated: async (options) => {
          return mockGigs.filter(g => 
            (!options.category || g.category === options.category) &&
            (!options.sellerId || g.sellerId === options.sellerId)
          );
        },
        createGig: async () => ({ id: 1 }),
        updateGig: async () => {},
        deleteGig: async () => {},
        isConnected: async () => true,
      };
      
      const result = await mockAdapter.getGigsPaginated({ 
        limit: 10, 
        category: 'design' 
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('design');
    });
  });

  describe('Connection Health', () => {
    it('should define isConnected for health checks', async () => {
      const mockAdapter: DbAdapter = {
        getUserByOpenId: async () => null,
        getUserById: async () => null,
        upsertUser: async () => {},
        getGigById: async () => null,
        getGigsPaginated: async () => [],
        createGig: async () => ({ id: 1 }),
        updateGig: async () => {},
        deleteGig: async () => {},
        isConnected: async () => true,
      };
      
      const connected = await mockAdapter.isConnected();
      expect(connected).toBe(true);
    });
  });
});
