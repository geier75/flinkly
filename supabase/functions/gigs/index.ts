/**
 * Gigs Edge Function
 * Handles: GET /gigs, GET /gigs/:id, POST /gigs, PUT /gigs/:id, DELETE /gigs/:id
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '../_shared/response.ts';
import type { DbGig, GigListInput } from '../_shared/types.ts';

// Snake case to camelCase conversion
function toDbGig(row: any): DbGig {
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags,
    price: row.price,
    deliveryDays: row.delivery_days,
    imageUrl: row.image_url,
    status: row.status,
    active: row.active ?? true,
    completedOrders: row.completed_orders ?? 0,
    averageRating: row.average_rating,
    popularityScore: row.popularity_score,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// GET /gigs - List gigs with pagination and filters
async function listGigs(input: GigListInput) {
  const supabase = getServiceClient();
  
  const limit = Math.min(input.limit ?? 20, 100);
  
  let query = supabase
    .from('gigs')
    .select('*')
    .eq('status', 'published')
    .eq('active', true);
  
  if (input.category) query = query.eq('category', input.category);
  if (input.minPrice) query = query.gte('price', input.minPrice);
  if (input.maxPrice) query = query.lte('price', input.maxPrice);
  if (input.cursor) query = query.gt('id', input.cursor);
  
  // Sorting
  switch (input.sortBy) {
    case 'price':
      query = query.order('price', { ascending: true });
      break;
    case 'rating':
      query = query.order('average_rating', { ascending: false, nullsFirst: false });
      break;
    case 'delivery':
      query = query.order('delivery_days', { ascending: true });
      break;
    case 'popularity':
      query = query.order('popularity_score', { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order('popularity_score', { ascending: false, nullsFirst: false });
  }
  
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[gigs.list] Error:', error);
    return { gigs: [], nextCursor: undefined };
  }
  
  const gigs = (data || []).map(toDbGig);
  const nextCursor = gigs.length === limit ? gigs[gigs.length - 1]?.id : undefined;
  
  return { gigs, nextCursor };
}

// GET /gigs/:id - Get single gig with packages
async function getGig(id: number) {
  const supabase = getServiceClient();
  
  const { data: gig, error: gigError } = await supabase
    .from('gigs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (gigError || !gig) return null;
  
  // Get packages
  const { data: packages } = await supabase
    .from('gig_packages')
    .select('*')
    .eq('gig_id', id)
    .eq('active', true)
    .order('price', { ascending: true });
  
  // Get seller info
  const { data: seller } = await supabase
    .from('users')
    .select('id, name, avatar_url, verified, seller_level, completed_orders, average_rating')
    .eq('id', gig.seller_id)
    .single();
  
  return {
    ...toDbGig(gig),
    packages: (packages || []).map((p: any) => ({
      id: p.id,
      gigId: p.gig_id,
      packageType: p.package_type,
      name: p.name,
      description: p.description,
      price: p.price,
      deliveryDays: p.delivery_days,
      revisions: p.revisions,
      features: p.features,
      active: p.active,
    })),
    seller: seller ? {
      id: seller.id,
      name: seller.name,
      avatarUrl: seller.avatar_url,
      verified: seller.verified,
      sellerLevel: seller.seller_level,
      completedOrders: seller.completed_orders,
      averageRating: seller.average_rating,
    } : null,
  };
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = req.method;
  
  try {
    // GET /gigs - List
    if (method === 'GET' && pathParts.length === 1) {
      const params = Object.fromEntries(url.searchParams);
      const input: GigListInput = {
        limit: params.limit ? parseInt(params.limit) : undefined,
        cursor: params.cursor ? parseInt(params.cursor) : undefined,
        category: params.category,
        minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
        sortBy: params.sortBy as GigListInput['sortBy'],
      };
      
      const result = await listGigs(input);
      return jsonResponse(result);
    }
    
    // GET /gigs/:id - Single gig
    if (method === 'GET' && pathParts.length === 2) {
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid gig ID');
      
      const gig = await getGig(id);
      if (!gig) return notFoundResponse('Gig not found');
      
      return jsonResponse(gig);
    }
    
    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[gigs] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
