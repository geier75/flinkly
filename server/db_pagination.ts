import { and, eq, gte, lte, lt, desc, asc } from "drizzle-orm";
import { getDb } from "./db";
import { gigs, users } from "../drizzle/schema";

/**
 * Cursor-based pagination for gigs with filtering
 * More efficient than offset-based pagination for large datasets
 */
export async function getGigsPaginated(options: {
  limit: number;
  cursor?: number; // Last seen gig ID
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price" | "delivery" | "rating" | "popularity";
}) {
  const db = await getDb();
  if (!db) return [];

  const { limit, cursor, category, minPrice, maxPrice, sortBy = "relevance" } = options;

  // Build where conditions
  const conditions = [
    eq(gigs.active, true),
    eq(gigs.status, "published"),
  ];

  // Cursor-based pagination: Get gigs with ID less than cursor (older gigs)
  if (cursor) {
    conditions.push(lt(gigs.id, cursor));
  }

  // Category filter
  if (category) {
    conditions.push(eq(gigs.category, category));
  }

  // Price range filter
  if (minPrice !== undefined) {
    conditions.push(gte(gigs.price, minPrice));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(gigs.price, maxPrice));
  }

  // Determine sort order based on sortBy parameter
  let orderByClause;
  switch (sortBy) {
    case "price":
      orderByClause = asc(gigs.price);
      break;
    case "delivery":
      orderByClause = asc(gigs.deliveryDays);
      break;
    case "rating":
      orderByClause = desc(gigs.averageRating);
      break;
    case "popularity":
      orderByClause = desc(gigs.popularityScore);
      break;
    case "relevance":
    default:
      orderByClause = desc(gigs.id); // Most recent first
      break;
  }
  
  // Join with users table to get seller info (prevents N+1 query problem)
  const result = await db
    .select({
      gig: gigs,
      seller: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        verified: users.verified,
        emailVerified: users.emailVerified,
        phoneVerified: users.phoneVerified,
        verificationLevel: users.verificationLevel,
        sellerLevel: users.sellerLevel,
        completedOrders: users.completedOrders,
        averageRating: users.averageRating,
      },
    })
    .from(gigs)
    .leftJoin(users, eq(gigs.sellerId, users.id))
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(limit);

  // Flatten structure for consistency
  return result.map((r) => ({
    ...r.gig,
    seller: r.seller,
  }));
}
