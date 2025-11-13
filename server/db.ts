import { eq, or, and, desc, ne, isNull, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, gigs, orders, reviews, transactions, payouts, invoices,
  InsertGig, InsertOrder, InsertReview, InsertTransaction, InsertPayout, InsertInvoice,
  conversations, messages, InsertConversation, InsertMessage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Gig queries
export async function getGigs(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gigs)
    .where(and(eq(gigs.active, true), eq(gigs.status, "published")))
    .orderBy(desc(gigs.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getGigById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gigs).where(eq(gigs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSellerGigs(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gigs)
    .where(eq(gigs.sellerId, sellerId))
    .orderBy(desc(gigs.createdAt));
}

// Alias for data export
export const getGigsBySellerId = getSellerGigs;

export async function getSellerDrafts(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gigs)
    .where(and(eq(gigs.sellerId, sellerId), eq(gigs.status, "draft")))
    .orderBy(desc(gigs.createdAt));
}

export async function createGig(gig: InsertGig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(gigs).values(gig);
}

export async function updateGig(id: number, updates: Partial<InsertGig>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gigs).set(updates).where(eq(gigs.id, id));
}

export async function deleteGig(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gigs).set({ active: false, status: "archived" }).where(eq(gigs.id, id));
}

export async function publishGig(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gigs).set({ status: "published", active: true }).where(eq(gigs.id, id));
}

// Order queries
export async function getBuyerOrders(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders)
    .where(eq(orders.buyerId, buyerId))
    .orderBy(desc(orders.createdAt));
}

export async function getSellerOrders(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders)
    .where(eq(orders.sellerId, sellerId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orders).values(order);
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

// Review queries
export async function getGigReviews(gigId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews)
    .where(eq(reviews.gigId, gigId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reviews).values(review);
}

// Transaction queries
export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(transactions).values(transaction);
}

export async function getTransactionByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transactions)
    .where(eq(transactions.orderId, orderId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTransactionStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(transactions).set({ status: status as any }).where(eq(transactions.id, id));
}

// Payout queries
export async function getSellerEarnings(sellerId: number) {
  const db = await getDb();
  if (!db) return { total: 0, available: 0, pending: 0 };
  
  const completedTransactions = await db.select().from(transactions)
    .where(and(
      eq(transactions.sellerId, sellerId),
      eq(transactions.status, "captured")
    ));
  
  const total = completedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const pendingPayouts = await db.select().from(payouts)
    .where(and(
      eq(payouts.sellerId, sellerId),
      eq(payouts.status, "pending")
    ));
  
  const pending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  
  return {
    total,
    available: total - pending,
    pending
  };
}

export async function createPayout(payout: InsertPayout) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payouts).values(payout);
}

export async function getSellerPayouts(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payouts)
    .where(eq(payouts.sellerId, sellerId))
    .orderBy(desc(payouts.createdAt));
}

export async function updatePayoutStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(payouts).set({ status: status as any }).where(eq(payouts.id, id));
}

// Invoice queries
export async function createInvoice(invoice: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(invoices).values(invoice);
}

export async function getInvoiceByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices)
    .where(eq(invoices.orderId, orderId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// ============================================
// MESSAGING QUERIES
// ============================================

/**
 * Create a new conversation for an order
 */
export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversations).values(data);
  return result;
}

/**
 * Get conversation by order ID
 */
export async function getConversationByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(conversations).where(eq(conversations.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all conversations for a user (as buyer or seller)
 */
export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(conversations)
    .where(
      or(
        eq(conversations.buyerId, userId),
        eq(conversations.sellerId, userId)
      )
    )
    .orderBy(desc(conversations.lastMessageAt));
  
  return result;
}

/**
 * Create a new message
 */
export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update conversation's lastMessageAt
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
  
  const result = await db.insert(messages).values(data);
  return result;
}

/**
 * Get messages for a conversation with pagination
 */
export async function getMessagesByConversationId(
  conversationId: number,
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
  
  return result.reverse(); // Reverse to show oldest first
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(eq(messages.id, messageId));
}

/**
 * Get unread message count for a user
 */
export async function getUnreadMessageCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  // Get all conversations where user is participant
  const userConversations = await db
    .select()
    .from(conversations)
    .where(
      or(
        eq(conversations.buyerId, userId),
        eq(conversations.sellerId, userId)
      )
    );
  
  if (userConversations.length === 0) return 0;
  
  const conversationIds = userConversations.map(c => c.id);
  
  // Count unread messages in those conversations (where sender is NOT the user)
  const result = await db
    .select()
    .from(messages)
    .where(
      and(
        inArray(messages.conversationId, conversationIds),
        ne(messages.senderId, userId),
        isNull(messages.readAt)
      )
    );
  
  return result.length;
}

/**
 * Get messages by user ID (for data export)
 */
export async function getMessagesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all conversations where user is participant
  const userConversations = await db
    .select()
    .from(conversations)
    .where(
      or(
        eq(conversations.buyerId, userId),
        eq(conversations.sellerId, userId)
      )
    );
  
  if (userConversations.length === 0) return [];
  
  const conversationIds = userConversations.map(c => c.id);
  
  // Get all messages in those conversations
  const result = await db
    .select()
    .from(messages)
    .where(inArray(messages.conversationId, conversationIds))
    .orderBy(desc(messages.createdAt));
  
  return result;
}


// ============================================
// DSGVO / DATA EXPORT QUERIES
// ============================================

/**
 * Get transactions by user ID (for data export)
 */
export async function getTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(transactions)
    .where(
      or(
        eq(transactions.buyerId, userId),
        eq(transactions.sellerId, userId)
      )
    )
    .orderBy(desc(transactions.createdAt));
  
  return result;
}

/**
 * Get active orders by user ID (for account deletion check)
 */
export async function getActiveOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(orders)
    .where(
      and(
        or(
          eq(orders.buyerId, userId),
          eq(orders.sellerId, userId)
        ),
        or(
          eq(orders.status, "pending"),
          eq(orders.status, "in_progress"),
          eq(orders.status, "preview"),
          eq(orders.status, "revision")
        )
      )
    );
  
  return result;
}

/**
 * Schedule account deletion (30 days grace period)
 */
export async function scheduleAccountDeletion(userId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Add deletionScheduledAt field to users table (needs migration)
  // For now, we'll just mark the user as inactive
  await db
    .update(users)
    .set({ 
      updatedAt: new Date(),
      // deletionScheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })
    .where(eq(users.id, userId));
  
  // TODO: Create scheduled job to delete account after 30 days
  console.log(`[DSGVO] Account deletion scheduled for user ${userId}. Reason: ${reason}`);
}

/**
 * Cancel account deletion
 */
export async function cancelAccountDeletion(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Remove deletionScheduledAt field
  await db
    .update(users)
    .set({ 
      updatedAt: new Date(),
      // deletionScheduledAt: null
    })
    .where(eq(users.id, userId));
  
  console.log(`[DSGVO] Account deletion cancelled for user ${userId}`);
}


/**
 * Get orders by buyer ID
 */
export async function getOrdersByBuyerId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.buyerId, userId))
    .orderBy(desc(orders.createdAt));
  
  return result;
}

/**
 * Get orders by seller ID
 */
export async function getOrdersBySellerId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.sellerId, userId))
    .orderBy(desc(orders.createdAt));
  
  return result;
}

/**
 * Get reviews by reviewer ID
 */
export async function getReviewsByReviewerId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.reviewerId, userId))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

/**
 * Get reviews for gigs owned by seller
 */
export async function getReviewsByGigSellerId(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all gigs by seller
  const sellerGigs = await db
    .select()
    .from(gigs)
    .where(eq(gigs.sellerId, sellerId));
  
  if (sellerGigs.length === 0) return [];
  
  const gigIds = sellerGigs.map(g => g.id);
  
  // Get all reviews for those gigs
  const result = await db
    .select()
    .from(reviews)
    .where(inArray(reviews.gigId, gigIds))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}
