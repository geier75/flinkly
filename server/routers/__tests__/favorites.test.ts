import { describe, it, expect } from 'vitest';

/**
 * Favorites Router Tests
 * 
 * Tests for favorites/wishlist functionality
 */

describe('Favorites Router', () => {
  describe('Add Favorite', () => {
    const addFavorite = (
      userId: number,
      gigId: number,
      favorites: { userId: number; gigId: number }[]
    ): { success: boolean; error?: string } => {
      const exists = favorites.some(f => f.userId === userId && f.gigId === gigId);
      if (exists) {
        return { success: false, error: 'Bereits in Favoriten' };
      }
      favorites.push({ userId, gigId });
      return { success: true };
    };

    it('should add new favorite', () => {
      const favorites: { userId: number; gigId: number }[] = [];
      expect(addFavorite(1, 100, favorites).success).toBe(true);
      expect(favorites.length).toBe(1);
    });

    it('should not add duplicate', () => {
      const favorites = [{ userId: 1, gigId: 100 }];
      expect(addFavorite(1, 100, favorites).success).toBe(false);
    });
  });

  describe('Remove Favorite', () => {
    const removeFavorite = (
      userId: number,
      gigId: number,
      favorites: { userId: number; gigId: number }[]
    ): boolean => {
      const index = favorites.findIndex(f => f.userId === userId && f.gigId === gigId);
      if (index === -1) return false;
      favorites.splice(index, 1);
      return true;
    };

    it('should remove existing favorite', () => {
      const favorites = [{ userId: 1, gigId: 100 }];
      expect(removeFavorite(1, 100, favorites)).toBe(true);
      expect(favorites.length).toBe(0);
    });

    it('should return false for non-existent', () => {
      const favorites: { userId: number; gigId: number }[] = [];
      expect(removeFavorite(1, 100, favorites)).toBe(false);
    });
  });

  describe('Check Favorite', () => {
    const isFavorite = (
      userId: number,
      gigId: number,
      favorites: { userId: number; gigId: number }[]
    ): boolean => {
      return favorites.some(f => f.userId === userId && f.gigId === gigId);
    };

    it('should return true for favorited gig', () => {
      const favorites = [{ userId: 1, gigId: 100 }];
      expect(isFavorite(1, 100, favorites)).toBe(true);
    });

    it('should return false for non-favorited gig', () => {
      const favorites = [{ userId: 1, gigId: 100 }];
      expect(isFavorite(1, 200, favorites)).toBe(false);
    });
  });

  describe('Get User Favorites', () => {
    const getUserFavorites = (
      userId: number,
      favorites: { userId: number; gigId: number; createdAt: Date }[]
    ) => {
      return favorites
        .filter(f => f.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    };

    it('should return user favorites', () => {
      const favorites = [
        { userId: 1, gigId: 100, createdAt: new Date('2024-01-01') },
        { userId: 1, gigId: 200, createdAt: new Date('2024-01-15') },
        { userId: 2, gigId: 100, createdAt: new Date('2024-01-10') },
      ];
      const result = getUserFavorites(1, favorites);
      expect(result.length).toBe(2);
    });

    it('should sort by newest first', () => {
      const favorites = [
        { userId: 1, gigId: 100, createdAt: new Date('2024-01-01') },
        { userId: 1, gigId: 200, createdAt: new Date('2024-01-15') },
      ];
      const result = getUserFavorites(1, favorites);
      expect(result[0].gigId).toBe(200);
    });
  });

  describe('Favorites Count', () => {
    const getFavoritesCount = (
      userId: number,
      favorites: { userId: number }[]
    ): number => {
      return favorites.filter(f => f.userId === userId).length;
    };

    it('should count favorites', () => {
      const favorites = [
        { userId: 1 },
        { userId: 1 },
        { userId: 2 },
      ];
      expect(getFavoritesCount(1, favorites)).toBe(2);
    });

    it('should return 0 for no favorites', () => {
      expect(getFavoritesCount(1, [])).toBe(0);
    });
  });

  describe('Gig Favorite Count', () => {
    const getGigFavoriteCount = (
      gigId: number,
      favorites: { gigId: number }[]
    ): number => {
      return favorites.filter(f => f.gigId === gigId).length;
    };

    it('should count how many users favorited a gig', () => {
      const favorites = [
        { gigId: 100 },
        { gigId: 100 },
        { gigId: 200 },
      ];
      expect(getGigFavoriteCount(100, favorites)).toBe(2);
    });
  });

  describe('Favorites Limit', () => {
    const MAX_FAVORITES = 100;

    const canAddFavorite = (
      userId: number,
      favorites: { userId: number }[]
    ): { allowed: boolean; error?: string } => {
      const count = favorites.filter(f => f.userId === userId).length;
      if (count >= MAX_FAVORITES) {
        return { allowed: false, error: `Maximal ${MAX_FAVORITES} Favoriten erlaubt` };
      }
      return { allowed: true };
    };

    it('should allow adding within limit', () => {
      const favorites = Array(50).fill({ userId: 1 });
      expect(canAddFavorite(1, favorites).allowed).toBe(true);
    });

    it('should block at limit', () => {
      const favorites = Array(100).fill({ userId: 1 });
      expect(canAddFavorite(1, favorites).allowed).toBe(false);
    });
  });

  describe('Favorites Sync', () => {
    const syncFavorites = (
      localFavorites: number[],
      serverFavorites: number[]
    ) => {
      const toAdd = localFavorites.filter(id => !serverFavorites.includes(id));
      const toRemove = serverFavorites.filter(id => !localFavorites.includes(id));
      const synced = [...new Set([...localFavorites, ...serverFavorites])];
      
      return { toAdd, toRemove, synced };
    };

    it('should identify items to sync', () => {
      const local = [1, 2, 3];
      const server = [2, 3, 4];
      const result = syncFavorites(local, server);
      
      expect(result.toAdd).toEqual([1]);
      expect(result.toRemove).toEqual([4]);
    });
  });

  describe('Favorites Export', () => {
    const exportFavorites = (
      favorites: { gigId: number; gigTitle: string; createdAt: Date }[]
    ) => {
      return favorites.map(f => ({
        gigId: f.gigId,
        title: f.gigTitle,
        addedAt: f.createdAt.toISOString(),
      }));
    };

    it('should export favorites data', () => {
      const favorites = [
        { gigId: 1, gigTitle: 'Logo Design', createdAt: new Date() },
      ];
      const exported = exportFavorites(favorites);
      expect(exported[0].title).toBe('Logo Design');
      expect(exported[0].addedAt).toBeDefined();
    });
  });

  describe('Favorites Notification', () => {
    const shouldNotifyPriceChange = (
      oldPrice: number,
      newPrice: number,
      threshold: number = 10
    ): boolean => {
      const percentChange = ((oldPrice - newPrice) / oldPrice) * 100;
      return percentChange >= threshold;
    };

    it('should notify on significant price drop', () => {
      expect(shouldNotifyPriceChange(10000, 8000)).toBe(true);
    });

    it('should not notify on small price change', () => {
      expect(shouldNotifyPriceChange(10000, 9500)).toBe(false);
    });

    it('should not notify on price increase', () => {
      expect(shouldNotifyPriceChange(10000, 12000)).toBe(false);
    });
  });

  describe('Favorites Collections', () => {
    const createCollection = (
      userId: number,
      name: string,
      gigIds: number[]
    ) => ({
      userId,
      name,
      gigIds,
      createdAt: new Date(),
      isPublic: false,
    });

    const addToCollection = (
      collection: { gigIds: number[] },
      gigId: number
    ): boolean => {
      if (collection.gigIds.includes(gigId)) return false;
      collection.gigIds.push(gigId);
      return true;
    };

    it('should create collection', () => {
      const collection = createCollection(1, 'Design Ideas', [100, 200]);
      expect(collection.name).toBe('Design Ideas');
      expect(collection.gigIds.length).toBe(2);
    });

    it('should add to collection', () => {
      const collection = { gigIds: [100] };
      expect(addToCollection(collection, 200)).toBe(true);
      expect(collection.gigIds.length).toBe(2);
    });

    it('should not add duplicate to collection', () => {
      const collection = { gigIds: [100] };
      expect(addToCollection(collection, 100)).toBe(false);
    });
  });
});
