import { eq, or, and, desc, ne, isNull, inArray, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, gigs, orders, reviews, transactions, payouts, invoices,
  InsertGig, InsertOrder, InsertReview, InsertTransaction, InsertPayout, InsertInvoice,
  conversations, messages, InsertConversation, InsertMessage,
  consentLogs, InsertConsentLog, accountDeletionRequests, InsertAccountDeletionRequest
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


// ============================================
// DSGVO++ FUNCTIONS (Consent Logs, Account Deletion)
// ============================================

/**
 * Create consent log (Proof-of-Consent)
 */
export async function createConsentLog(log: InsertConsentLog): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(consentLogs).values(log);
}

/**
 * Get consent logs by user ID
 */
export async function getConsentLogsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(consentLogs)
    .where(eq(consentLogs.userId, userId))
    .orderBy(desc(consentLogs.timestamp));
}

/**
 * Schedule account deletion (30-day grace period)
 */
export async function scheduleAccountDeletion(userId: number, reason?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const scheduledDeletionAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  await db.insert(accountDeletionRequests).values({
    userId,
    requestedAt: new Date(),
    scheduledDeletionAt,
    reason: reason || null,
    status: "pending",
  });
  
  console.log(`[DSGVO] Account deletion scheduled for user ${userId} at ${scheduledDeletionAt}`);
}

/**
 * Cancel account deletion
 */
export async function cancelAccountDeletion(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(accountDeletionRequests)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(accountDeletionRequests.userId, userId));
  
  console.log(`[DSGVO] Account deletion cancelled for user ${userId}`);
}

/**
 * Get pending account deletion requests (for automated cleanup)
 */
export async function getPendingAccountDeletions() {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  return db
    .select()
    .from(accountDeletionRequests)
    .where(
      and(
        eq(accountDeletionRequests.status, "pending"),
        lte(accountDeletionRequests.scheduledDeletionAt, now)
      )
    );
}

/**
 * Get account deletion request by user ID
 */
export async function getAccountDeletionRequest(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(accountDeletionRequests)
    .where(eq(accountDeletionRequests.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Complete account deletion (pseudonymize data)
 */
export async function completeAccountDeletion(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Pseudonymize user data (keep for legal/accounting purposes, but remove personal info)
  await db
    .update(users)
    .set({
      name: "DELETED_USER",
      email: null,
      bio: null,
      avatarUrl: null,
      openId: `deleted_${userId}_${Date.now()}`,
    })
    .where(eq(users.id, userId));
  
  // Mark deletion as completed
  await db
    .update(accountDeletionRequests)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(accountDeletionRequests.userId, userId));
  
  console.log(`[DSGVO] Account deletion completed for user ${userId}`);
}


// ============================================
// VERIFICATION FUNCTIONS
// ============================================

/**
 * Update user verification status
 */
export async function updateUserVerification(
  userId: number,
  updates: {
    emailVerified?: boolean;
    phoneVerified?: boolean;
    adminApproved?: boolean;
    verificationLevel?: "none" | "email" | "phone" | "admin";
  }
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(updates).where(eq(users.id, userId));
}

/**
 * Update user phone number
 */
export async function updateUserPhone(userId: number, phone: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set({ phone }).where(eq(users.id, userId));
}

/**
 * Create admin approval request
 */
export async function createAdminApprovalRequest(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // For now, just log the request
  // TODO: Create admin_approval_requests table
  console.log(`[Admin Approval] Request created for user ${userId}`);
  
  // Auto-approve in development
  if (process.env.NODE_ENV === "development") {
    await db.update(users).set({
      adminApproved: true,
      verificationLevel: "admin",
    }).where(eq(users.id, userId));
    console.log(`[Admin Approval] Auto-approved user ${userId} (development mode)`);
  }
}


// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Get all users (paginated, with filters)
 */
export async function getUsers(
  limit: number,
  offset: number,
  filters?: { role?: "user" | "admin"; verified?: boolean }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db.select().from(users);

  if (filters?.role) {
    query = query.where(eq(users.role, filters.role)) as any;
  }
  if (filters?.verified !== undefined) {
    query = query.where(eq(users.verified, filters.verified)) as any;
  }

  const result = await query.limit(limit).offset(offset);
  return result;
}

/**
 * Get user statistics (gigs, orders, earnings)
 */
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [userGigs, userOrders, userReviews] = await Promise.all([
    db.select().from(gigs).where(eq(gigs.sellerId, userId)),
    db.select().from(orders).where(eq(orders.buyerId, userId)),
    db.select().from(reviews).where(eq(reviews.reviewerId, userId)),
  ]);

  const totalEarnings = userGigs.reduce((sum, gig) => {
    // Calculate from completed orders
    return sum;
  }, 0);

  return {
    totalGigs: userGigs.length,
    totalOrders: userOrders.length,
    totalReviews: userReviews.length,
    totalEarnings,
  };
}

/**
 * Ban user
 */
export async function banUser(userId: number, reason: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // TODO: Add banned field to users table
  // For now, just log
  console.log(`[Admin] Banned user ${userId}: ${reason}`);
}

/**
 * Unban user
 */
export async function unbanUser(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // TODO: Remove banned field
  console.log(`[Admin] Unbanned user ${userId}`);
}

/**
 * Get all gigs (for admin moderation)
 */
export async function getAllGigs(
  limit: number,
  offset: number,
  status?: "draft" | "published" | "archived"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db.select().from(gigs);

  if (status) {
    query = query.where(eq(gigs.status, status)) as any;
  }

  const result = await query.limit(limit).offset(offset);
  return result;
}

/**
 * Reject gig
 */
export async function rejectGig(gigId: number, reason: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Archive gig and store rejection reason
  await db.update(gigs).set({ status: "archived" }).where(eq(gigs.id, gigId));

  // TODO: Notify seller about rejection
  console.log(`[Admin] Rejected gig ${gigId}: ${reason}`);
}

/**
 * Get seller verification queue
 */
export async function getVerificationQueue() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get users who have email verified but not admin approved
  const queue = await db
    .select()
    .from(users)
    .where(and(eq(users.emailVerified, true), eq(users.adminApproved, false)));

  return queue;
}

/**
 * Get platform analytics
 */
export async function getPlatformAnalytics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [allUsers, allGigs, allOrders, allReviews] = await Promise.all([
    db.select().from(users),
    db.select().from(gigs),
    db.select().from(orders),
    db.select().from(reviews),
  ]);

  const totalRevenue = allOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return {
    totalUsers: allUsers.length,
    totalSellers: allUsers.filter((u) => u.userType === "seller" || u.userType === "both").length,
    totalGigs: allGigs.length,
    publishedGigs: allGigs.filter((g) => g.status === "published").length,
    totalOrders: allOrders.length,
    completedOrders: allOrders.filter((o) => o.status === "completed").length,
    totalReviews: allReviews.length,
    totalRevenue,
    averageOrderValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0,
  };
}

/**
 * Get recent activity (for admin dashboard)
 */
export async function getRecentActivity(limit: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get recent orders, gigs, users
  const [recentOrders, recentGigs, recentUsers] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit),
    db.select().from(gigs).orderBy(desc(gigs.createdAt)).limit(limit),
    db.select().from(users).orderBy(desc(users.createdAt)).limit(limit),
  ]);

  return {
    recentOrders,
    recentGigs,
    recentUsers,
  };
}


// ============================================
// Similar Gigs Algorithm (Content-Based Filtering)
// ============================================

/**
 * Get similar gigs based on content similarity (category, tags, price, delivery, rating)
 * Uses weighted scoring: text similarity (0.45) + price proximity (0.15) + delivery proximity (0.15) + trust (0.25)
 * 
 * @param gigId - The gig ID to find similar gigs for
 * @param k - Maximum number of similar gigs to return (default: 12)
 * @param excludeSameSeller - Whether to exclude gigs from the same seller (default: true)
 * @returns Array of similar gigs with similarity scores
 */
export async function getSimilarGigs(gigId: number, k: number = 12, excludeSameSeller: boolean = true) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get similar gigs: database not available");
    return [];
  }

  try {
    // Get the reference gig
    const [refGig] = await db.select().from(gigs).where(eq(gigs.id, gigId)).limit(1);
    if (!refGig || !refGig.active) return [];

    // Parse tags (JSON array)
    const refTags = refGig.tags ? JSON.parse(refGig.tags) : [];
    const refSearchBlob = `${refGig.category} ${refTags.join(' ')}`.toLowerCase();

    // Get candidate gigs (active, not the same gig, optionally not same seller)
    const candidates = await db
      .select()
      .from(gigs)
      .where(
        and(
          eq(gigs.active, true),
          ne(gigs.id, gigId),
          excludeSameSeller ? ne(gigs.sellerId, refGig.sellerId) : undefined
        )
      );

    // Calculate similarity scores for each candidate
    const scored = candidates.map((cand) => {
      const candTags = cand.tags ? JSON.parse(cand.tags) : [];
      const candSearchBlob = `${cand.category} ${candTags.join(' ')}`.toLowerCase();

      // Text similarity (Jaccard + simple word overlap)
      const refWords = new Set(refSearchBlob.split(' '));
      const candWords = new Set(candSearchBlob.split(' '));
      const intersection = new Set(Array.from(refWords).filter(w => candWords.has(w)));
      const union = new Set([...Array.from(refWords), ...Array.from(candWords)]);
      const textSim = union.size > 0 ? intersection.size / union.size : 0;

      // Price proximity (normalized)
      const maxPrice = Math.max(refGig.price, cand.price);
      const priceSim = maxPrice > 0 ? 1 - Math.abs(refGig.price - cand.price) / maxPrice : 0;

      // Delivery proximity (normalized)
      const maxDelivery = Math.max(refGig.deliveryDays, cand.deliveryDays);
      const deliverySim = maxDelivery > 0 ? 1 - Math.abs(refGig.deliveryDays - cand.deliveryDays) / maxDelivery : 0;

      // Trust score (rating + completed orders, capped at 50 orders)
      const ratingScore = (cand.averageRating || 0) / 500; // 0-1 scale (500 = 5.00 rating)
      const ordersScore = Math.min(cand.completedOrders || 0, 50) / 50; // 0-1 scale, capped at 50
      const trustSim = ratingScore * 0.6 + ordersScore * 0.4;

      // Weighted total score
      const score = 
        0.45 * textSim +
        0.15 * priceSim +
        0.15 * deliverySim +
        0.25 * trustSim;

      return {
        ...cand,
        score: Math.round(score * 1000) / 1000, // Round to 3 decimals
      };
    });

    // Sort by score descending and return top k
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  } catch (error) {
    console.error("[Database] Failed to get similar gigs:", error);
    return [];
  }
}
