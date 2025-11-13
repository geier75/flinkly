/**
 * Zod Validation Schemas for tRPC Procedures
 * 
 * Centralized validation schemas for all API inputs.
 * Provides type-safety and runtime validation.
 */

import { z } from "zod";

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const idSchema = z.number().int().positive();
export const emailSchema = z.string().email("Ungültige E-Mail-Adresse");
export const urlSchema = z.string().url("Ungültige URL");
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Ungültige Telefonnummer");

// Pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// ============================================================================
// GIG SCHEMAS
// ============================================================================

export const gigCategorySchema = z.enum([
  "Design & Kreatives",
  "Programmierung & IT",
  "Text & Übersetzung",
  "Marketing & Social Media",
  "Video & Animation",
  "Musik & Audio",
  "Business & Beratung",
  "Lifestyle & Freizeit",
]);

export const gigStatusSchema = z.enum(["draft", "published", "archived"]);

export const createGigSchema = z.object({
  title: z.string().min(10, "Titel muss mindestens 10 Zeichen lang sein").max(100, "Titel darf maximal 100 Zeichen lang sein"),
  description: z.string().min(50, "Beschreibung muss mindestens 50 Zeichen lang sein").max(5000, "Beschreibung darf maximal 5000 Zeichen lang sein"),
  category: gigCategorySchema,
  price: z.number().int().min(500, "Mindestpreis: 5€").max(25000, "Maximalpreis: 250€"), // in cents
  deliveryDays: z.number().int().min(1, "Mindestens 1 Tag").max(90, "Maximal 90 Tage"),
  imageUrl: z.string().url("Ungültige Bild-URL").optional(),
  briefingFields: z.array(z.object({
    label: z.string().min(1).max(100),
    type: z.enum(["text", "textarea", "file", "select"]),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).optional(),
});

export const updateGigSchema = z.object({
  id: idSchema,
  title: z.string().min(10).max(100).optional(),
  description: z.string().min(50).max(5000).optional(),
  category: gigCategorySchema.optional(),
  price: z.number().int().min(500).max(25000).optional(),
  deliveryDays: z.number().int().min(1).max(90).optional(),
  imageUrl: z.string().url().optional(),
  status: gigStatusSchema.optional(),
  briefingFields: z.array(z.object({
    label: z.string().min(1).max(100),
    type: z.enum(["text", "textarea", "file", "select"]),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).optional(),
});

export const getGigByIdSchema = z.object({
  id: idSchema,
});

export const getGigsByCategorySchema = z.object({
  category: gigCategorySchema,
  ...paginationSchema.shape,
});

export const searchGigsSchema = z.object({
  query: z.string().min(1).max(100),
  category: gigCategorySchema.optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().max(25000).optional(),
  ...paginationSchema.shape,
});

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

export const orderStatusSchema = z.enum([
  "pending_payment",
  "in_progress",
  "in_review",
  "completed",
  "cancelled",
  "disputed",
]);

export const createOrderSchema = z.object({
  gigId: idSchema,
  briefingData: z.record(z.string(), z.any()), // Dynamic based on gig's briefingFields
});

export const updateOrderStatusSchema = z.object({
  orderId: idSchema,
  status: orderStatusSchema,
  message: z.string().max(1000).optional(),
});

export const submitDeliverableSchema = z.object({
  orderId: idSchema,
  deliverableUrl: z.string().url("Ungültige URL"),
  message: z.string().max(1000).optional(),
});

export const requestRevisionSchema = z.object({
  orderId: idSchema,
  message: z.string().min(10, "Bitte beschreibe die gewünschten Änderungen").max(1000),
});

export const acceptDeliverableSchema = z.object({
  orderId: idSchema,
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// ============================================================================
// PAYMENT SCHEMAS
// ============================================================================

export const createCheckoutSessionSchema = z.object({
  gigId: idSchema,
  briefingData: z.record(z.string(), z.any()),
});

export const createPayoutSchema = z.object({
  amount: z.number().int().positive("Betrag muss positiv sein"),
  stripeAccountId: z.string().min(1, "Stripe-Account-ID erforderlich"),
});

// ============================================================================
// MESSAGE SCHEMAS
// ============================================================================

export const sendMessageSchema = z.object({
  conversationId: idSchema,
  content: z.string().min(1, "Nachricht darf nicht leer sein").max(5000, "Nachricht zu lang"),
  fileUrl: z.string().url().optional(),
  fileName: z.string().max(255).optional(),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024, "Datei zu groß (max. 10MB)").optional(), // 10MB
});

export const getMessagesSchema = z.object({
  conversationId: idSchema,
  ...paginationSchema.shape,
});

export const markAsReadSchema = z.object({
  conversationId: idSchema,
});

export const uploadFileSchema = z.object({
  conversationId: idSchema,
  file: z.object({
    name: z.string().max(255),
    size: z.number().int().positive().max(10 * 1024 * 1024), // 10MB
    type: z.string().regex(/^(image\/|application\/pdf|application\/msword|application\/vnd\.|text\/)/, "Ungültiger Dateityp"),
  }),
});

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  country: z.string().length(2, "Ländercode muss 2 Zeichen lang sein (ISO 3166-1 alpha-2)").optional(),
});

export const getUserByIdSchema = z.object({
  id: idSchema,
});

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const createReviewSchema = z.object({
  orderId: idSchema,
  rating: z.number().int().min(1, "Bewertung muss mindestens 1 sein").max(5, "Bewertung darf maximal 5 sein"),
  comment: z.string().max(1000, "Kommentar zu lang").optional(),
});

export const getGigReviewsSchema = z.object({
  gigId: idSchema,
  ...paginationSchema.shape,
});

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

export const adminUpdateUserSchema = z.object({
  userId: idSchema,
  role: z.enum(["user", "admin"]).optional(),
  verified: z.boolean().optional(),
});

export const adminUpdateGigStatusSchema = z.object({
  gigId: idSchema,
  status: gigStatusSchema,
  reason: z.string().max(500).optional(),
});
