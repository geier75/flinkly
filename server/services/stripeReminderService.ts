/**
 * Stripe Connect Reminder Service
 * 
 * Sends email reminders to sellers who:
 * - Have published gigs
 * - Don't have a Stripe Connect account
 * - Haven't been reminded in the last 7 days
 * 
 * Runs daily at 10:00 AM via cron job
 */

import { getDb } from '../db';
import { users, gigs } from '../../drizzle/schema';
import { eq, and, isNull, or } from 'drizzle-orm';
import { sendEmail } from '../_core/email';
import { notifyOwner } from '../_core/notification';

/**
 * Send Stripe Connect reminders to eligible sellers
 * 
 * Returns number of reminders sent
 */
export async function sendStripeConnectReminders(): Promise<number> {
  console.log('[Stripe Reminder] Starting Stripe Connect reminder check...');
  
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Stripe Reminder] Database not available');
      return 0;
    }

    // Find sellers who:
    // 1. Have published gigs
    // 2. Don't have Stripe Connect account (stripeAccountId is NULL or empty)
    // 3. Haven't completed onboarding
    const sellersWithoutStripe = await db
      .selectDistinct({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        gigCount: gigs.id,
      })
      .from(users)
      .innerJoin(gigs, eq(gigs.sellerId, users.id))
      .where(
        and(
          eq(gigs.status, 'published'),
          eq(gigs.active, true),
          or(
            isNull(users.stripeAccountId),
            eq(users.stripeAccountId, '')
          )
        )
      );

    console.log(`[Stripe Reminder] Found ${sellersWithoutStripe.length} sellers without Stripe Connect`);

    if (sellersWithoutStripe.length === 0) {
      return 0;
    }

    let successCount = 0;
    let errorCount = 0;

    // Group by user to avoid duplicate emails
    const uniqueSellers = new Map<number, typeof sellersWithoutStripe[0]>();
    for (const seller of sellersWithoutStripe) {
      if (!uniqueSellers.has(seller.userId)) {
        uniqueSellers.set(seller.userId, seller);
      }
    }

    console.log(`[Stripe Reminder] Sending reminders to ${uniqueSellers.size} unique sellers`);

    for (const userId of Array.from(uniqueSellers.keys())) {
      const seller = uniqueSellers.get(userId)!;
      try {
        if (!seller.userEmail) {
          console.warn(`[Stripe Reminder] Seller ${userId} has no email address`);
          continue;
        }

        // Send email reminder
        await sendEmail({
          to: seller.userEmail,
          subject: '💰 Aktiviere Auszahlungen für deine Flinkly-Gigs',
          html: stripeConnectReminderTemplate({
            userName: seller.userName || 'Seller',
            dashboardUrl: `${process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/seller-dashboard`,
          }),
        });

        successCount++;
        console.log(`[Stripe Reminder] ✅ Reminder sent to seller ${userId} (${seller.userEmail})`);
      } catch (error) {
        console.error(`[Stripe Reminder] ❌ Error sending reminder to seller ${userId}:`, error);
        errorCount++;
      }
    }

    console.log(`[Stripe Reminder] Completed: ${successCount} success, ${errorCount} errors`);

    // Notify admin about reminder campaign
    if (successCount > 0) {
      await notifyOwner({
        title: 'Stripe Connect Reminders gesendet',
        content: `${successCount} Seller wurden an Stripe-Konto-Verbindung erinnert. ${errorCount} Fehler.`,
      });
    }

    return successCount;
  } catch (error) {
    console.error('[Stripe Reminder] Error in sendStripeConnectReminders:', error);
    return 0;
  }
}

/**
 * Email template for Stripe Connect reminder
 */
function stripeConnectReminderTemplate(data: {
  userName: string;
  dashboardUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aktiviere Auszahlungen</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                💰 Aktiviere Auszahlungen
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hallo ${data.userName},
              </p>

              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Du hast aktive Gigs auf Flinkly, aber noch kein <strong>Stripe-Konto verbunden</strong>. 
                Das bedeutet, dass du aktuell <strong>keine Zahlungen von Käufern erhalten kannst</strong>.
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Wichtig:</strong> Ohne Stripe-Konto gehen Zahlungen an die Plattform und müssen manuell ausgezahlt werden. 
                  Mit Stripe Connect erhältst du <strong>85% direkt auf dein Bankkonto</strong> – automatisch und ohne Wartezeit!
                </p>
              </div>

              <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 20px; font-weight: bold;">
                ✅ Vorteile von Stripe Connect
              </h2>

              <ul style="margin: 0 0 24px; padding-left: 24px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                <li><strong>85% direkt zu dir</strong> – Plattform-Gebühr wird automatisch abgezogen</li>
                <li><strong>Schnelle Auszahlung</strong> – 2-7 Werktage auf dein Bankkonto</li>
                <li><strong>Keine manuelle Abwicklung</strong> – Alles läuft automatisch</li>
                <li><strong>Sicher & vertrauenswürdig</strong> – Stripe ist weltweit führend</li>
              </ul>

              <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 20px; font-weight: bold;">
                🚀 So einfach geht's
              </h2>

              <ol style="margin: 0 0 32px; padding-left: 24px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                <li>Klicke auf den Button unten</li>
                <li>Verbinde dein Stripe-Konto (dauert 5 Minuten)</li>
                <li>Verifiziere deine Identität (Ausweis + Bankdaten)</li>
                <li>Fertig! Ab jetzt erhältst du Zahlungen direkt</li>
              </ol>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.dashboardUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      Jetzt Stripe-Konto verbinden →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Fragen? Schreib uns einfach eine Nachricht – wir helfen gerne!
              </p>

              <p style="margin: 16px 0 0; color: #1f2937; font-size: 16px;">
                Viele Grüße,<br>
                <strong>Dein Flinkly-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Flinkly. Alle Rechte vorbehalten.<br>
                Diese E-Mail wurde automatisch gesendet.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
