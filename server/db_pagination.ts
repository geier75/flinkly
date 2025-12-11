/**
 * Cursor-based pagination for gigs with filtering
 * Uses Supabase for database operations
 */
import { supabase } from './_core/supabase';

export async function getGigsPaginated(options: {
  limit: number;
  cursor?: number; // Last seen gig ID
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price" | "delivery" | "rating" | "popularity";
}) {
  const { limit, cursor, category, minPrice, maxPrice, sortBy = "relevance" } = options;

  try {
    // Build query with Supabase
    let query = supabase
      .from('gigs')
      .select(`
        *,
        seller:users!seller_id(
          id, name, email, avatar_url, verified, email_verified,
          phone_verified, verification_level, seller_level,
          completed_orders, average_rating
        )
      `)
      .eq('active', true)
      .eq('status', 'published');

    // Cursor-based pagination
    if (cursor) {
      query = query.lt('id', cursor);
    }

    // Category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Price range filter
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    // Sorting
    switch (sortBy) {
      case "price":
        query = query.order('price', { ascending: true });
        break;
      case "delivery":
        query = query.order('delivery_days', { ascending: true });
        break;
      case "rating":
        query = query.order('average_rating', { ascending: false });
        break;
      case "popularity":
        query = query.order('popularity_score', { ascending: false });
        break;
      case "relevance":
      default:
        query = query.order('id', { ascending: false });
        break;
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('[getGigsPaginated] Supabase query failed:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[getGigsPaginated] Database query failed:', error);
    return [];
  }
}
