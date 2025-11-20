/**
 * Cron-Jobs für automatisierte Tasks
 * 
 * - Weekly-Digest: Jeden Montag 9 Uhr
 */

import cron from "node-cron";
import { aggregateDigestContent, getDigestRecipients } from "./weeklyDigest";
import { weeklyDigestTemplate } from "./emailTemplates";
import { sendEmail } from "./email";
import { upgradeAllSellers } from "../services/sellerLevelService";

/**
 * Sendet Weekly-Digest an alle User
 */
async function sendWeeklyDigests() {
  console.log("[CronJob] Starting weekly digest send...");
  
  try {
    const recipients = await getDigestRecipients();
    console.log(`[CronJob] Found ${recipients.length} digest recipients`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const userId of recipients) {
      try {
        const digestData = await aggregateDigestContent(userId);
        
        if (!digestData) {
          console.warn(`[CronJob] No digest data for user ${userId}`);
          continue;
        }
        
        // Nur senden wenn es Content gibt (oder immer senden für Engagement)
        // Aktuell: Immer senden, auch wenn keine Updates
        const emailHtml = weeklyDigestTemplate(digestData);
        
        await sendEmail({
          to: digestData.userName, // TODO: Email-Adresse aus User-Objekt
          subject: digestData.newGigs.length > 0 || digestData.unreadMessages > 0 || digestData.openOrders.length > 0
            ? `📬 Dein Flinkly Weekly Digest - ${digestData.newGigs.length} neue Gigs, ${digestData.unreadMessages} Nachrichten`
            : "📬 Dein Flinkly Weekly Digest",
          html: emailHtml,
        });
        
        successCount++;
      } catch (error) {
        console.error(`[CronJob] Error sending digest to user ${userId}:`, error);
        errorCount++;
      }
    }
    
    console.log(`[CronJob] Weekly digest send completed: ${successCount} success, ${errorCount} errors`);
  } catch (error) {
    console.error("[CronJob] Error in weekly digest send:", error);
  }
}

/**
 * Initialisiert alle Cron-Jobs
 */
export function initCronJobs() {
  console.log("[CronJob] Initializing cron jobs...");
  
  // Weekly-Digest: Jeden Montag um 9:00 Uhr
  // Cron-Format: Sekunde Minute Stunde Tag Monat Wochentag
  // 0 0 9 * * 1 = Montag 9:00 Uhr
  cron.schedule("0 0 9 * * 1", () => {
    console.log("[CronJob] Triggering weekly digest send (Monday 9:00 AM)");
    sendWeeklyDigests();
  }, {
    timezone: "Europe/Berlin" // DACH-Timezone
  });
  
  // Seller-Level-Upgrade: Jeden Tag um 3:00 Uhr nachts
  // 0 0 3 * * * = Täglich 3:00 Uhr
  cron.schedule("0 0 3 * * *", async () => {
    console.log("[CronJob] Triggering seller level upgrade check (Daily 3:00 AM)");
    try {
      const upgradeCount = await upgradeAllSellers();
      console.log(`[CronJob] Seller level upgrade completed: ${upgradeCount} sellers upgraded`);
    } catch (error) {
      console.error("[CronJob] Error in seller level upgrade:", error);
    }
  }, {
    timezone: "Europe/Berlin"
  });
  
  console.log("[CronJob] Cron jobs initialized: Weekly-Digest (Monday 9:00 AM), Seller-Level-Upgrade (Daily 3:00 AM)");
}

/**
 * Manueller Trigger für Testing
 */
export async function triggerWeeklyDigestManually() {
  console.log("[CronJob] Manual trigger: Weekly digest send");
  await sendWeeklyDigests();
}
