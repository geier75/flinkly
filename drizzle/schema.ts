import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, index } from "drizzle-orm/mysql-core";

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
  emailVerified: boolean("emailVerified").default(false),
  phoneVerified: boolean("phoneVerified").default(false),
  phone: varchar("phone", { length: 20 }),
  adminApproved: boolean("adminApproved").default(false),
  verificationLevel: mysqlEnum("verificationLevel", ["none", "email", "phone", "admin"]).default("none"),
  sellerLevel: mysqlEnum("sellerLevel", ["new", "rising", "level_one", "top_rated"]).default("new"),
  completedOrders: int("completedOrders").default(0).notNull(),
  averageRating: int("averageRating").default(0), // Stored as int (0-500 = 0.0-5.0 stars, multiply by 100)
  responseTimeHours: int("responseTimeHours").default(24), // Average response time in hours
  onTimeDeliveryRate: int("onTimeDeliveryRate").default(100), // Percentage (0-100)
  // Commercial seller fields (§ 5 TMG Impressumspflicht)
  isCommercial: boolean("isCommercial").default(false).notNull(), // Gewerblich vs. Privat
  companyName: varchar("companyName", { length: 255 }), // Firmenname
  companyAddress: text("companyAddress"), // Vollständige Adresse
  taxId: varchar("taxId", { length: 50 }), // USt-IdNr. (DE123456789)
  tradeRegister: varchar("tradeRegister", { length: 255 }), // Handelsregister (HRB 12345)
  // Stripe Connect fields (for seller payouts)
  stripeAccountId: varchar("stripeAccountId", { length: 255 }), // Stripe Connect Account ID (acct_...)
  stripeOnboardingComplete: boolean("stripeOnboardingComplete").default(false).notNull(), // KYC verification complete
  stripeChargesEnabled: boolean("stripeChargesEnabled").default(false).notNull(), // Can receive payments
  stripePayoutsEnabled: boolean("stripePayoutsEnabled").default(false).notNull(), // Can receive payouts
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
  tags: text("tags"), // JSON array of tags for similarity matching
  price: int("price").notNull(), // in cents, max 25000 (250€)
  deliveryDays: int("deliveryDays").notNull().default(3),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  active: boolean("active").default(true),
  completedOrders: int("completedOrders").default(0),
  averageRating: int("averageRating").default(0), // stored as int (0-500) for 0.00-5.00 rating
  popularityScore: int("popularityScore").default(0), // Calculated: views × 0.3 + orders × 0.5 + rating × 0.2
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.category),
  sellerIdIdx: index("seller_id_idx").on(table.sellerId),
  statusIdx: index("status_idx").on(table.status),
  priceIdx: index("price_idx").on(table.price),
  ratingIdx: index("rating_idx").on(table.averageRating),
}));

export type Gig = typeof gigs.$inferSelect;
export type InsertGig = typeof gigs.$inferInsert;

/**
 * Gig Packages table - Basic/Standard/Premium tiers for each gig
 * Enables tiered pricing and upselling
 */
export const gigPackages = mysqlTable("gigPackages", {
  id: int("id").autoincrement().primaryKey(),
  gigId: int("gigId").notNull(),
  packageType: mysqlEnum("packageType", ["basic", "standard", "premium"]).notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Basic Logo", "Premium Brand Package"
  description: text("description").notNull(),
  price: int("price").notNull(), // in cents
  deliveryDays: int("deliveryDays").notNull(),
  revisions: int("revisions").notNull().default(1),
  features: text("features"), // JSON array of feature strings
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  gigIdIdx: index("gig_packages_gig_id_idx").on(table.gigId),
}));

export type GigPackage = typeof gigPackages.$inferSelect;
export type InsertGigPackage = typeof gigPackages.$inferInsert;

/**
 * Gig Extras table - Add-ons that can be purchased with any package
 * Examples: Express delivery, extra revisions, commercial license, source files
 */
export const gigExtras = mysqlTable("gigExtras", {
  id: int("id").autoincrement().primaryKey(),
  gigId: int("gigId").notNull(),
  extraType: mysqlEnum("extraType", [
    "express_delivery",
    "extra_revisions",
    "commercial_license",
    "source_files",
    "custom"
  ]).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // in cents
  deliveryDaysReduction: int("deliveryDaysReduction").default(0), // for express delivery
  revisionsAdded: int("revisionsAdded").default(0), // for extra revisions
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  gigIdIdx: index("gig_extras_gig_id_idx").on(table.gigId),
}));

export type GigExtra = typeof gigExtras.$inferSelect;
export type InsertGigExtra = typeof gigExtras.$inferInsert;

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
  platformFeePercent: int("platformFeePercent").default(15).notNull(), // Platform commission (default 15%)
  platformFee: int("platformFee").notNull(), // Platform fee in cents (calculated from totalPrice)
  sellerEarnings: int("sellerEarnings").notNull(), // Seller earnings in cents (totalPrice - platformFee)
  selectedPackage: mysqlEnum("selectedPackage", ["basic", "standard", "premium"]).default("basic"), // Package tier selected by buyer
  selectedExtras: text("selectedExtras"), // JSON array of extra IDs purchased with this order
  buyerMessage: text("buyerMessage"),
  sellerDelivery: text("sellerDelivery"),
  deliveryDate: timestamp("deliveryDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("orders_status_idx").on(table.status),
  buyerIdIdx: index("orders_buyer_id_idx").on(table.buyerId),
  sellerIdIdx: index("orders_seller_id_idx").on(table.sellerId),
  gigIdIdx: index("orders_gig_id_idx").on(table.gigId),
}));

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
}, (table) => ({
  gigIdIdx: index("reviews_gig_id_idx").on(table.gigId),
  reviewerIdIdx: index("reviews_reviewer_id_idx").on(table.reviewerId),
}));

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
  amount: int("amount").notNull(), // in cents (total amount paid by buyer)
  platformFee: int("platformFee").notNull(), // Platform fee in cents
  sellerEarnings: int("sellerEarnings").notNull(), // Seller earnings in cents
  currency: varchar("currency", { length: 3 }).default("EUR"),
  paymentMethod: varchar("paymentMethod", { length: 32 }), // 'klarna', 'sepa', 'card', 'twint'
  paymentIntentId: varchar("paymentIntentId", { length: 255 }),
  transferId: varchar("transferId", { length: 255 }), // Stripe Connect transfer ID (tr_...)
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

/**
 * Favorites/Wishlist - Users can save gigs to their wishlist
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  gigId: int("gigId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("favorites_user_id_idx").on(table.userId),
  gigIdIdx: index("favorites_gig_id_idx").on(table.gigId),
}));

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;


/**
 * Disputes table - 3-stage dispute resolution process
 * Stages: open → mediation → resolved
 */
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  gigId: int("gigId").notNull(),
  
  // Dispute details
  reason: mysqlEnum("reason", [
    "not_delivered",
    "poor_quality",
    "wrong_service",
    "communication_issue",
    "other"
  ]).notNull(),
  description: text("description").notNull(),
  
  // Status tracking
  status: mysqlEnum("status", ["open", "mediation", "resolved", "closed"]).default("open").notNull(),
  resolution: mysqlEnum("resolution", [
    "pending",
    "refund_full",
    "refund_partial",
    "revision_requested",
    "buyer_favor",
    "seller_favor",
    "no_action"
  ]).default("pending"),
  
  // Evidence uploads
  buyerEvidence: text("buyerEvidence"), // JSON array of file URLs
  sellerEvidence: text("sellerEvidence"), // JSON array of file URLs
  
  // Admin mediation
  adminId: int("adminId"), // Admin who handled the dispute
  adminNotes: text("adminNotes"),
  mediationStartedAt: timestamp("mediationStartedAt"),
  resolvedAt: timestamp("resolvedAt"),
  
  // Refund details (if applicable)
  refundAmount: int("refundAmount"), // in cents
  refundReason: text("refundReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Fraud alerts table - Stores fraud detection alerts for admin review
 */
export const fraudAlerts = mysqlTable("fraudAlerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  type: mysqlEnum("type", [
    "rapid_creation",
    "unusual_orders",
    "price_manipulation",
    "review_bombing",
    "suspicious_device"
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"), // JSON object with additional details
  status: mysqlEnum("status", ["pending", "reviewed", "resolved", "false_positive"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"), // Admin ID who reviewed the alert
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FraudAlert = typeof fraudAlerts.$inferSelect;
export type InsertFraudAlert = typeof fraudAlerts.$inferInsert;

/**
 * Gig-Views-Tracking für Analytics
 * Tracks every view of a gig for analytics purposes
 */
export const gigViews = mysqlTable("gigViews", {
  id: int("id").autoincrement().primaryKey(),
  gigId: int("gigId").notNull(),
  userId: int("userId"), // null if anonymous
  ipHash: varchar("ipHash", { length: 64 }), // hashed IP for GDPR compliance
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type GigView = typeof gigViews.$inferSelect;
export type InsertGigView = typeof gigViews.$inferInsert;

/**
 * Gig-Stats-Aggregation für Dashboard-Performance
 * Daily aggregated stats for fast dashboard queries
 */
export const gigStats = mysqlTable("gigStats", {
  id: int("id").autoincrement().primaryKey(),
  gigId: int("gigId").notNull(),
  date: timestamp("date").notNull(), // YYYY-MM-DD 00:00:00
  views: int("views").default(0).notNull(),
  orders: int("orders").default(0).notNull(),
  revenue: int("revenue").default(0).notNull(), // in cents
  conversionRate: int("conversionRate").default(0), // stored as int (0-10000) for 0.00%-100.00%
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GigStats = typeof gigStats.$inferSelect;
export type InsertGigStats = typeof gigStats.$inferInsert;

/**
 * Password-Reset-Tokens
 * Stores tokens for password reset flow
 */
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;


/**
 * Payment Methods - Saved Stripe payment methods for faster checkout
 * Stores tokenized payment method IDs from Stripe
 */
export const paymentMethods = mysqlTable("paymentMethods", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentMethodId: varchar("stripePaymentMethodId", { length: 255 }).notNull().unique(),
  last4: varchar("last4", { length: 4 }).notNull(), // Last 4 digits of card
  brand: varchar("brand", { length: 32 }).notNull(), // visa, mastercard, amex, etc.
  expiryMonth: int("expiryMonth").notNull(),
  expiryYear: int("expiryYear").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
