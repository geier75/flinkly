import { pgEnum, pgTable, text, timestamp, varchar, integer, boolean, index, serial } from "drizzle-orm/pg-core";

/**
 * PostgreSQL Schema for Flinkly (Supabase)
 * Converted from MySQL schema
 */

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const userTypeEnum = pgEnum("user_type", ["buyer", "seller", "both"]);
export const verificationLevelEnum = pgEnum("verification_level", ["none", "email", "phone", "admin"]);
export const sellerLevelEnum = pgEnum("seller_level", ["new", "rising", "level_one", "top_rated"]);
export const gigStatusEnum = pgEnum("gig_status", ["draft", "published", "archived"]);
export const packageTypeEnum = pgEnum("package_type", ["basic", "standard", "premium"]);
export const extraTypeEnum = pgEnum("extra_type", ["express_delivery", "extra_revisions", "commercial_license", "source_files", "custom"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "in_progress", "preview", "delivered", "revision", "completed", "disputed", "cancelled"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "authorized", "captured", "refunded", "failed"]);
export const payoutStatusEnum = pgEnum("payout_status", ["pending", "processing", "paid", "failed"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "sent", "paid", "cancelled"]);
export const messageTypeEnum = pgEnum("message_type", ["text", "file", "system"]);
export const deletionStatusEnum = pgEnum("deletion_status", ["pending", "cancelled", "completed"]);
export const disputeReasonEnum = pgEnum("dispute_reason", ["not_delivered", "poor_quality", "wrong_service", "communication_issue", "other"]);
export const disputeStatusEnum = pgEnum("dispute_status", ["open", "mediation", "resolved", "closed"]);
export const disputeResolutionEnum = pgEnum("dispute_resolution", ["pending", "refund_full", "refund_partial", "revision_requested", "buyer_favor", "seller_favor", "no_action"]);
export const fraudTypeEnum = pgEnum("fraud_type", ["rapid_creation", "unusual_orders", "price_manipulation", "review_bombing", "suspicious_device"]);
export const fraudSeverityEnum = pgEnum("fraud_severity", ["low", "medium", "high", "critical"]);
export const fraudStatusEnum = pgEnum("fraud_status", ["pending", "reviewed", "resolved", "false_positive"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  userType: userTypeEnum("user_type").default("both"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  country: varchar("country", { length: 2 }),
  verified: boolean("verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  phone: varchar("phone", { length: 20 }),
  adminApproved: boolean("admin_approved").default(false),
  verificationLevel: verificationLevelEnum("verification_level").default("none"),
  sellerLevel: sellerLevelEnum("seller_level").default("new"),
  completedOrders: integer("completed_orders").default(0).notNull(),
  averageRating: integer("average_rating").default(0),
  responseTimeHours: integer("response_time_hours").default(24),
  onTimeDeliveryRate: integer("on_time_delivery_rate").default(100),
  isCommercial: boolean("is_commercial").default(false).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  companyAddress: text("company_address"),
  taxId: varchar("tax_id", { length: 50 }),
  tradeRegister: varchar("trade_register", { length: 255 }),
  stripeAccountId: varchar("stripe_account_id", { length: 255 }),
  stripeOnboardingComplete: boolean("stripe_onboarding_complete").default(false).notNull(),
  stripeChargesEnabled: boolean("stripe_charges_enabled").default(false).notNull(),
  stripePayoutsEnabled: boolean("stripe_payouts_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Gigs table - Digital microservices offered by sellers
 */
export const gigs = pgTable("gigs", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  tags: text("tags"),
  price: integer("price").notNull(),
  deliveryDays: integer("delivery_days").notNull().default(3),
  imageUrl: text("image_url"),
  status: gigStatusEnum("status").default("draft").notNull(),
  active: boolean("active").default(true),
  completedOrders: integer("completed_orders").default(0),
  averageRating: integer("average_rating").default(0),
  popularityScore: integer("popularity_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("gigs_category_idx").on(table.category),
  sellerIdIdx: index("gigs_seller_id_idx").on(table.sellerId),
  statusIdx: index("gigs_status_idx").on(table.status),
  priceIdx: index("gigs_price_idx").on(table.price),
  ratingIdx: index("gigs_rating_idx").on(table.averageRating),
}));

export type Gig = typeof gigs.$inferSelect;
export type InsertGig = typeof gigs.$inferInsert;

/**
 * Gig Packages table - Basic/Standard/Premium tiers
 */
export const gigPackages = pgTable("gig_packages", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull(),
  packageType: packageTypeEnum("package_type").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  revisions: integer("revisions").notNull().default(1),
  features: text("features"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  gigIdIdx: index("gig_packages_gig_id_idx").on(table.gigId),
}));

export type GigPackage = typeof gigPackages.$inferSelect;
export type InsertGigPackage = typeof gigPackages.$inferInsert;

/**
 * Gig Extras table - Add-ons
 */
export const gigExtras = pgTable("gig_extras", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull(),
  extraType: extraTypeEnum("extra_type").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  deliveryDaysReduction: integer("delivery_days_reduction").default(0),
  revisionsAdded: integer("revisions_added").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  gigIdIdx: index("gig_extras_gig_id_idx").on(table.gigId),
}));

export type GigExtra = typeof gigExtras.$inferSelect;
export type InsertGigExtra = typeof gigExtras.$inferInsert;

/**
 * Orders table
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  status: orderStatusEnum("status").default("pending"),
  totalPrice: integer("total_price").notNull(),
  platformFeePercent: integer("platform_fee_percent").default(15).notNull(),
  platformFee: integer("platform_fee").notNull(),
  sellerEarnings: integer("seller_earnings").notNull(),
  selectedPackage: packageTypeEnum("selected_package").default("basic"),
  selectedExtras: text("selected_extras"),
  buyerMessage: text("buyer_message"),
  sellerDelivery: text("seller_delivery"),
  deliveryDate: timestamp("delivery_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("orders_status_idx").on(table.status),
  buyerIdIdx: index("orders_buyer_id_idx").on(table.buyerId),
  sellerIdIdx: index("orders_seller_id_idx").on(table.sellerId),
  gigIdIdx: index("orders_gig_id_idx").on(table.gigId),
}));

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Reviews table
 */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  gigId: integer("gig_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  gigIdIdx: index("reviews_gig_id_idx").on(table.gigId),
  reviewerIdIdx: index("reviews_reviewer_id_idx").on(table.reviewerId),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Transactions table
 */
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  amount: integer("amount").notNull(),
  platformFee: integer("platform_fee").notNull(),
  sellerEarnings: integer("seller_earnings").notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  paymentMethod: varchar("payment_method", { length: 32 }),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  transferId: varchar("transfer_id", { length: 255 }),
  status: transactionStatusEnum("status").default("pending"),
  escrowReleaseDate: timestamp("escrow_release_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Payouts table
 */
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  status: payoutStatusEnum("status").default("pending"),
  payoutMethod: varchar("payout_method", { length: 32 }).default("bank_transfer"),
  stripePayoutId: varchar("stripe_payout_id", { length: 255 }),
  transactionIds: text("transaction_ids"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;

/**
 * Invoices table
 */
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  invoiceNumber: varchar("invoice_number", { length: 32 }).notNull().unique(),
  amount: integer("amount").notNull(),
  vatAmount: integer("vat_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  pdfUrl: varchar("pdf_url", { length: 512 }),
  status: invoiceStatusEnum("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Conversations table
 */
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().unique(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  type: messageTypeEnum("type").default("text"),
  fileUrl: varchar("file_url", { length: 512 }),
  fileName: varchar("file_name", { length: 255 }),
  fileSize: integer("file_size"),
  fileMimeType: varchar("file_mime_type", { length: 100 }),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Consent Logs (DSGVO)
 */
export const consentLogs = pgTable("consent_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  consentId: varchar("consent_id", { length: 64 }).notNull().unique(),
  timestamp: timestamp("timestamp").notNull(),
  version: varchar("version", { length: 16 }).notNull(),
  essential: boolean("essential").notNull().default(true),
  statistics: boolean("statistics").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  personalization: boolean("personalization").notNull().default(false),
  hash: varchar("hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ConsentLog = typeof consentLogs.$inferSelect;
export type InsertConsentLog = typeof consentLogs.$inferInsert;

/**
 * Account Deletion Requests
 */
export const accountDeletionRequests = pgTable("account_deletion_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  scheduledDeletionAt: timestamp("scheduled_deletion_at").notNull(),
  reason: text("reason"),
  status: deletionStatusEnum("status").notNull().default("pending"),
  cancelledAt: timestamp("cancelled_at"),
  completedAt: timestamp("completed_at"),
});

export type AccountDeletionRequest = typeof accountDeletionRequests.$inferSelect;
export type InsertAccountDeletionRequest = typeof accountDeletionRequests.$inferInsert;

/**
 * Favorites/Wishlist
 */
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gigId: integer("gig_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("favorites_user_id_idx").on(table.userId),
  gigIdIdx: index("favorites_gig_id_idx").on(table.gigId),
}));

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Disputes table
 */
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  gigId: integer("gig_id").notNull(),
  reason: disputeReasonEnum("reason").notNull(),
  description: text("description").notNull(),
  status: disputeStatusEnum("status").default("open").notNull(),
  resolution: disputeResolutionEnum("resolution").default("pending"),
  buyerEvidence: text("buyer_evidence"),
  sellerEvidence: text("seller_evidence"),
  adminId: integer("admin_id"),
  adminNotes: text("admin_notes"),
  mediationStartedAt: timestamp("mediation_started_at"),
  resolvedAt: timestamp("resolved_at"),
  refundAmount: integer("refund_amount"),
  refundReason: text("refund_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Fraud alerts table
 */
export const fraudAlerts = pgTable("fraud_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: fraudTypeEnum("type").notNull(),
  severity: fraudSeverityEnum("severity").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"),
  status: fraudStatusEnum("status").default("pending").notNull(),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FraudAlert = typeof fraudAlerts.$inferSelect;
export type InsertFraudAlert = typeof fraudAlerts.$inferInsert;

/**
 * Gig Views Tracking
 */
export const gigViews = pgTable("gig_views", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull(),
  userId: integer("user_id"),
  ipHash: varchar("ip_hash", { length: 64 }),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export type GigView = typeof gigViews.$inferSelect;
export type InsertGigView = typeof gigViews.$inferInsert;

/**
 * Gig Stats Aggregation
 */
export const gigStats = pgTable("gig_stats", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull(),
  date: timestamp("date").notNull(),
  views: integer("views").default(0).notNull(),
  orders: integer("orders").default(0).notNull(),
  revenue: integer("revenue").default(0).notNull(),
  conversionRate: integer("conversion_rate").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type GigStats = typeof gigStats.$inferSelect;
export type InsertGigStats = typeof gigStats.$inferInsert;

/**
 * Password Reset Tokens
 */
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Payment Methods
 */
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stripePaymentMethodId: varchar("stripe_payment_method_id", { length: 255 }).notNull().unique(),
  last4: varchar("last4", { length: 4 }).notNull(),
  brand: varchar("brand", { length: 32 }).notNull(),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
