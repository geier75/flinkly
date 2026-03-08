import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../adapters";
import { users, gigs, orders } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from '@trpc/server';
import { sendEmail } from "../_core/email";

/**
 * Account Deletion Router (DSGVO Art. 17)
 * 
 * Provides account deletion functionality as required by GDPR Article 17 (Right to Erasure).
 * 
 * Implementation:
 * - Soft-Delete: 30-day waiting period before final deletion
 * - Anonymization: Personal data is anonymized instead of hard-deleted
 * - Audit-Logs: Deletion requests are logged for compliance
 */

export const accountDeletionRouter = router({
  /**
   * Request account deletion (DSGVO Art. 17)
   * Initiates 30-day soft-delete period
   */
  requestDeletion: protectedProcedure
    .input(z.object({
      reason: z.string().optional(),
      confirmPassword: z.string().optional(), // Optional: Add password confirmation for security
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      
      // Check for pending orders (GDPR allows data retention for legal obligations)
      const pendingOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.sellerId, userId),
            sql`status IN ('pending', 'in_progress', 'preview', 'revision')`
          )
        )
        .limit(1);

      if (pendingOrders.length > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Cannot delete account with pending orders. Please complete or cancel all active orders first.',
        });
      }

      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 30); // 30 days grace period

      // Update user with deletion request
      await db
        .update(users)
        .set({
          deletionRequestedAt: new Date(),
          scheduledDeletionDate: deletionDate,
          deletionReason: input.reason || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log deletion request for audit (GDPR Art. 30)
      await db.execute(sql`
        INSERT INTO account_deletion_logs (user_id, action, reason, ip_address, user_agent)
        VALUES (${userId}, 'requested', ${input.reason || null}, ${ctx.req.ip || null}, ${ctx.req.headers['user-agent'] || null})
      `);

      // Send confirmation email
      const user = ctx.user;
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: 'Account-Löschung bestätigt - Flinkly',
          html: `
            <h2>Account-Löschung beantragt</h2>
            <p>Hallo ${user.name || 'User'},</p>
            <p>Dein Account wird am <strong>${deletionDate.toLocaleDateString('de-DE')}</strong> permanent gelöscht.</p>
            <p>Du kannst die Löschung jederzeit in deinen Einstellungen widerrufen.</p>
            <p><strong>Was passiert:</strong></p>
            <ul>
              <li>Alle persönlichen Daten werden gelöscht</li>
              <li>Deine Gigs werden deaktiviert</li>
              <li>Bestellhistorie wird anonymisiert</li>
            </ul>
            <p>Bei Fragen: support@flinkly.eu</p>
          `,
        });
      }

      return {
        success: true,
        scheduledDeletionDate: deletionDate.toISOString(),
        message: "Dein Account wird in 30 Tagen gelöscht. Du kannst die Löschung jederzeit widerrufen.",
      };
    }),

  /**
   * Cancel account deletion request
   * User can cancel within 30-day period
   */
  cancelDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;

    // Remove deletion request
    await db
      .update(users)
      .set({
        deletionRequestedAt: null,
        scheduledDeletionDate: null,
        deletionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Log cancellation for audit
    await db.execute(sql`
      INSERT INTO account_deletion_logs (user_id, action, ip_address, user_agent)
      VALUES (${userId}, 'cancelled', ${ctx.req.ip || null}, ${ctx.req.headers['user-agent'] || null})
    `);

    // Send cancellation confirmation email
    const user = ctx.user;
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Account-Löschung widerrufen - Flinkly',
        html: `
          <h2>Account-Löschung widerrufen</h2>
          <p>Hallo ${user.name || 'User'},</p>
          <p>Die Löschung deines Accounts wurde erfolgreich widerrufen.</p>
          <p>Dein Account bleibt aktiv und alle Daten bleiben erhalten.</p>
        `,
      });
    }

    return {
      success: true,
      message: "Die Löschung deines Accounts wurde erfolgreich widerrufen.",
    };
  }),

  /**
   * Get deletion status
   * Check if account is scheduled for deletion
   */
  getDeletionStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!userResult[0]) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const user = userResult[0];
    const isDeletionScheduled = !!user.scheduledDeletionDate;
    const scheduledDeletionDate = user.scheduledDeletionDate;

    return {
      isDeletionScheduled,
      scheduledDeletionDate: scheduledDeletionDate?.toISOString() || null,
      deletionRequestedAt: user.deletionRequestedAt?.toISOString() || null,
      daysRemaining: isDeletionScheduled && scheduledDeletionDate
        ? Math.ceil((scheduledDeletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      reason: user.deletionReason || null,
    };
  }),

  /**
   * Anonymize user data (GDPR-compliant)
   * Called after 30-day period expires
   * 
   * Anonymization strategy:
   * - Replace name with "Deleted User #[ID]"
   * - Replace email with "deleted-[ID]@flinkly.local"
   * - Clear openId, loginMethod
   * - Keep orders/reviews for platform integrity (anonymized)
   */
  anonymizeUser: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;

    // Verify deletion is scheduled
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!userResult[0]?.scheduledDeletionDate) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'No deletion scheduled for this account',
      });
    }

    // Check if deletion date has passed
    const now = new Date();
    if (userResult[0].scheduledDeletionDate > now) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Deletion date has not yet passed. Please wait until scheduled date.',
      });
    }

    // Anonymize user data (GDPR Art. 17)
    await db
      .update(users)
      .set({
        name: `Deleted User #${userId}`,
        email: `deleted-${userId}@flinkly.local`,
        openId: `deleted-${userId}`,
        loginMethod: "deleted",
        bio: null,
        avatarUrl: null,
        phone: null,
        companyName: null,
        companyAddress: null,
        taxId: null,
        tradeRegister: null,
        deletionRequestedAt: null,
        scheduledDeletionDate: null,
        deletionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Deactivate all gigs (keep for business records)
    await db
      .update(gigs)
      .set({
        title: sql`CONCAT('Deleted Gig #', id)`,
        description: '[Deleted]',
        active: false,
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(eq(gigs.sellerId, userId));

    // Anonymize orders (keep for accounting/legal)
    await db.execute(sql`
      UPDATE orders 
      SET buyer_message = '[Deleted]',
          updated_at = NOW()
      WHERE buyer_id = ${userId} OR seller_id = ${userId}
    `);

    // Log anonymization for audit (GDPR Art. 30)
    await db.execute(sql`
      INSERT INTO account_deletion_logs (user_id, action)
      VALUES (${userId}, 'completed')
    `);

    return {
      success: true,
      deletedAt: new Date().toISOString(),
      message: "Account erfolgreich gelöscht und anonymisiert.",
    };
  }),
});
