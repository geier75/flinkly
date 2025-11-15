import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, gigs, orders, reviews, conversations, messages, transactions, payouts } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Data Export Router (DSGVO Art. 20)
 * 
 * Provides user data export functionality as required by GDPR Article 20 (Right to Data Portability).
 * Users can download all their personal data in machine-readable JSON format.
 */

export const dataExportRouter = router({
  /**
   * Export all user data (DSGVO Art. 20)
   * Returns JSON with all user-related data
   */
  exportMyData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userId = ctx.user.id;

    // 1. User Profile Data
    const userProfile = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    // 2. Gigs (if seller)
    const userGigs = await db.select().from(gigs).where(eq(gigs.sellerId, userId));

    // 3. Orders (as buyer)
    const buyerOrders = await db.select().from(orders).where(eq(orders.buyerId, userId));

    // 4. Orders (as seller)
    const sellerOrders = await db.select().from(orders).where(eq(orders.sellerId, userId));

    // 5. Reviews (written by user)
    const writtenReviews = await db.select().from(reviews).where(eq(reviews.reviewerId, userId));

    // 6. Reviews (received as seller)
    const receivedReviews = await db
      .select({
        review: reviews,
        gig: gigs,
      })
      .from(reviews)
      .leftJoin(gigs, eq(reviews.gigId, gigs.id))
      .where(eq(gigs.sellerId, userId));

    // 7. Conversations
    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.buyerId, userId))
      .union(
        db.select().from(conversations).where(eq(conversations.sellerId, userId))
      );

    // 8. Messages
    const userMessages = await db.select().from(messages).where(eq(messages.senderId, userId));

    // 9. Transactions (as buyer)
    const buyerTransactions = await db.select().from(transactions).where(eq(transactions.buyerId, userId));

    // 10. Transactions (as seller)
    const sellerTransactions = await db.select().from(transactions).where(eq(transactions.sellerId, userId));

    // 11. Payouts (if seller)
    const userPayouts = await db.select().from(payouts).where(eq(payouts.sellerId, userId));

    // Compile all data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userId,
        openId: ctx.user.openId,
        name: ctx.user.name,
        email: ctx.user.email,
        loginMethod: ctx.user.loginMethod,
        role: ctx.user.role,
        createdAt: ctx.user.createdAt,
        updatedAt: ctx.user.updatedAt,
        lastSignedIn: ctx.user.lastSignedIn,
      },
      profile: userProfile[0] || null,
      gigs: userGigs,
      orders: {
        asBuyer: buyerOrders,
        asSeller: sellerOrders,
      },
      reviews: {
        written: writtenReviews,
        received: receivedReviews.map((r) => r.review),
      },
      conversations: userConversations,
      messages: userMessages,
      transactions: {
        asBuyer: buyerTransactions,
        asSeller: sellerTransactions,
      },
      payouts: userPayouts,
      verification: {
        emailVerified: userProfile[0]?.emailVerified || false,
        phoneVerified: userProfile[0]?.phoneVerified || false,
        verificationLevel: userProfile[0]?.verificationLevel || "none",
      },
      metadata: {
        totalGigs: userGigs.length,
        totalOrders: buyerOrders.length + sellerOrders.length,
        totalReviews: writtenReviews.length,
        totalMessages: userMessages.length,
        totalTransactions: buyerTransactions.length + sellerTransactions.length,
        totalPayouts: userPayouts.length,
        exportTimestamp: new Date().toISOString(),
        exportVersion: "1.0.0",
        gdprCompliance: "Art. 20 DSGVO - Right to Data Portability",
      },
    };

    return exportData;
  }),
});
