import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended for Flinkly marketplace with seller/buyer roles
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["buyer", "seller", "both"]).default("both"),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  country: varchar("country", { length: 2 }), // DE, AT, CH
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Gigs table - Digital microservices offered by sellers (max 250€)
 */
export const gigs = mysqlTable("gigs", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  price: int("price").notNull(), // in cents, max 25000 (250€)
  deliveryDays: int("deliveryDays").notNull().default(3),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  active: boolean("active").default(true),
  completedOrders: int("completedOrders").default(0),
  averageRating: int("averageRating").default(0), // stored as int (0-500) for 0.00-5.00 rating
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Gig = typeof gigs.$inferSelect;
export type InsertGig = typeof gigs.$inferInsert;

/**
 * Orders table - Transactions between buyers and sellers
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  gigId: int("gigId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "preview", "delivered", "revision", "completed", "disputed", "cancelled"]).default("pending"),
  totalPrice: int("totalPrice").notNull(), // in cents
  buyerMessage: text("buyerMessage"),
  sellerDelivery: text("sellerDelivery"),
  deliveryDate: timestamp("deliveryDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Reviews table - Ratings and feedback for completed orders
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  gigId: int("gigId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Transactions table - Payment records with escrow system
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("EUR"),
  paymentMethod: varchar("paymentMethod", { length: 32 }), // 'klarna', 'sepa', 'card', 'twint'
  paymentIntentId: varchar("paymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "authorized", "captured", "refunded", "failed"]).default("pending"),
  escrowReleaseDate: timestamp("escrowReleaseDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Payouts table - Seller earnings withdrawals
 */
export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("EUR"),
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed"]).default("pending"),
  payoutMethod: varchar("payoutMethod", { length: 32 }).default("bank_transfer"),
  stripePayoutId: varchar("stripePayoutId", { length: 255 }),
  transactionIds: text("transactionIds"), // JSON array of transaction IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;

/**
 * Invoices table - Generated invoices for orders
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 32 }).notNull().unique(),
  amount: int("amount").notNull(), // in cents (net)
  vatAmount: int("vatAmount").notNull(), // in cents
  totalAmount: int("totalAmount").notNull(), // in cents (gross)
  pdfUrl: varchar("pdfUrl", { length: 512 }),
  status: mysqlEnum("status", ["draft", "sent", "paid", "cancelled"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Conversations table - 1:1 chat threads between buyer and seller per order
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().unique(), // One conversation per order
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table - Individual messages within conversations
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["text", "file", "system"]).default("text"),
  fileUrl: varchar("fileUrl", { length: 512 }),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"), // in bytes
  fileMimeType: varchar("fileMimeType", { length: 100 }),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Consent Logs (DSGVO Proof-of-Consent, 12-Monate-Retention)
 */
export const consentLogs = mysqlTable("consent_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  consentId: varchar("consentId", { length: 64 }).notNull().unique(),
  timestamp: timestamp("timestamp").notNull(),
  version: varchar("version", { length: 16 }).notNull(),
  essential: boolean("essential").notNull().default(true),
  statistics: boolean("statistics").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  personalization: boolean("personalization").notNull().default(false),
  hash: varchar("hash", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConsentLog = typeof consentLogs.$inferSelect;
export type InsertConsentLog = typeof consentLogs.$inferInsert;

/**
 * Account Deletion Requests (30-Tage-Grace-Period)
 */
export const accountDeletionRequests = mysqlTable("account_deletion_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  scheduledDeletionAt: timestamp("scheduledDeletionAt").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "cancelled", "completed"]).notNull().default("pending"),
  cancelledAt: timestamp("cancelledAt"),
  completedAt: timestamp("completedAt"),
});

export type AccountDeletionRequest = typeof accountDeletionRequests.$inferSelect;
export type InsertAccountDeletionRequest = typeof accountDeletionRequests.$inferInsert;
