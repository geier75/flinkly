import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Seller Level System
 * 
 * 4 Tiers:
 * - New: 0-9 orders, any rating
 * - Rising: 10-49 orders, 4.5+ rating, 85%+ on-time
 * - Level One: 50-199 orders, 4.7+ rating, 90%+ on-time, <12h response
 * - Top Rated: 200+ orders, 4.9+ rating, 95%+ on-time, <6h response
 */

type SellerLevel = "new" | "rising" | "level_one" | "top_rated";

interface SellerStats {
  completedOrders: number;
  averageRating: number; // Stored as integer (450 = 4.5 stars)
  responseTimeHours: number;
  onTimeDeliveryRate: number;
}

const LEVEL_REQUIREMENTS: Record<SellerLevel, SellerStats> = {
  new: {
    completedOrders: 0,
    averageRating: 0,
    responseTimeHours: 24,
    onTimeDeliveryRate: 0,
  },
  rising: {
    completedOrders: 10,
    averageRating: 450, // 4.5 stars
    responseTimeHours: 24,
    onTimeDeliveryRate: 85,
  },
  level_one: {
    completedOrders: 50,
    averageRating: 470, // 4.7 stars
    responseTimeHours: 12,
    onTimeDeliveryRate: 90,
  },
  top_rated: {
    completedOrders: 200,
    averageRating: 490, // 4.9 stars
    responseTimeHours: 6,
    onTimeDeliveryRate: 95,
  },
};

/**
 * Check if seller meets requirements for a specific level
 */
export function meetsLevelRequirements(
  seller: SellerStats,
  targetLevel: SellerLevel
): boolean {
  const requirements = LEVEL_REQUIREMENTS[targetLevel];
  
  return (
    seller.completedOrders >= requirements.completedOrders &&
    seller.averageRating >= requirements.averageRating &&
    seller.responseTimeHours <= requirements.responseTimeHours &&
    seller.onTimeDeliveryRate >= requirements.onTimeDeliveryRate
  );
}

/**
 * Calculate the next level a seller should be upgraded to
 * Returns null if no upgrade is possible
 */
export function calculateNextLevel(
  currentLevel: SellerLevel,
  seller: SellerStats
): SellerLevel | null {
  const levelOrder: SellerLevel[] = ["new", "rising", "level_one", "top_rated"];
  const currentIndex = levelOrder.indexOf(currentLevel);
  
  // Already at max level
  if (currentIndex === levelOrder.length - 1) {
    return null;
  }
  
  // Check each higher level (skip levels if seller meets requirements)
  for (let i = levelOrder.length - 1; i > currentIndex; i--) {
    const targetLevel = levelOrder[i];
    if (meetsLevelRequirements(seller, targetLevel)) {
      return targetLevel;
    }
  }
  
  return null;
}

/**
 * Upgrade all eligible sellers to their next level
 * Called by daily cron job
 */
export async function upgradeAllSellers(): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[SellerLevelService] Database not available");
    return 0;
  }
  
  try {
    // Get all sellers with their stats
    const sellers = await db.select().from(users);
    
    let upgradeCount = 0;
    
    for (const seller of sellers) {
      const currentLevel = (seller.sellerLevel as SellerLevel) || "new";
      
      const sellerStats: SellerStats = {
        completedOrders: seller.completedOrders || 0,
        averageRating: seller.averageRating || 0,
        responseTimeHours: seller.responseTimeHours || 24,
        onTimeDeliveryRate: seller.onTimeDeliveryRate || 0,
      };
      
      const nextLevel = calculateNextLevel(currentLevel, sellerStats);
      
      if (nextLevel) {
        await db
          .update(users)
          .set({ sellerLevel: nextLevel })
          .where(eq(users.id, seller.id));
        
        console.log(
          `[SellerLevelService] Upgraded seller ${seller.id} from ${currentLevel} to ${nextLevel}`
        );
        upgradeCount++;
      }
    }
    
    return upgradeCount;
  } catch (error) {
    console.error("[SellerLevelService] Error upgrading sellers:", error);
    throw error;
  }
}
