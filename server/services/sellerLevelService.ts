// @ts-nocheck
import { getDb } from "../adapters";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";
import { sendEmail } from "../_core/email";
import { levelUpTemplate } from "../_core/emailTemplates";

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
        
        // Send level-up notifications
        try {
          // 1. Push notification (Manus Notification API)
          await notifyOwner({
            title: `🎉 Seller Level-Up: ${seller.name || 'Seller'} → ${nextLevel}`,
            content: `Seller ${seller.id} (${seller.name || 'Unknown'}) wurde von ${currentLevel} auf ${nextLevel} hochgestuft.\n\nStats:\n- Completed Orders: ${sellerStats.completedOrders}\n- Rating: ${(sellerStats.averageRating / 100).toFixed(1)}/5.0\n- On-Time Delivery: ${sellerStats.onTimeDeliveryRate}%\n- Response Time: ${sellerStats.responseTimeHours}h`,
          });
          
          // 2. Email notification to seller
          if (seller.email) {
            const emailHtml = levelUpTemplate({
              sellerName: seller.name || 'Seller',
              oldLevel: currentLevel,
              newLevel: nextLevel,
              completedOrders: sellerStats.completedOrders,
              averageRating: (sellerStats.averageRating / 100).toFixed(1),
              onTimeDeliveryRate: sellerStats.onTimeDeliveryRate,
              responseTimeHours: sellerStats.responseTimeHours,
            });
            
            await sendEmail({
              to: seller.email,
              subject: `🎉 Glückwunsch! Du bist jetzt ${nextLevel} Seller`,
              html: emailHtml,
            });
          }
        } catch (notificationError) {
          console.error(
            `[SellerLevelService] Failed to send notifications for seller ${seller.id}:`,
            notificationError
          );
        }
        
        upgradeCount++;
      }
    }
    
    return upgradeCount;
  } catch (error) {
    console.error("[SellerLevelService] Error upgrading sellers:", error);
    throw error;
  }
}
