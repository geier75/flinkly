import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, gigs, orders, reviews, transactions, payouts, invoices,
  InsertGig, InsertOrder, InsertReview, InsertTransaction, InsertPayout, InsertInvoice
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
