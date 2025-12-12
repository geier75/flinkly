/**
 * Gigs Edge Function
 * Handles: GET /gigs, GET /gigs/:id, POST /gigs, PUT /gigs/:id, DELETE /gigs/:id
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, notFoundResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';
import type { DbGig, GigListInput } from '../_shared/types.ts';

// Get user from Supabase auth header
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = getServiceClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  // Get user from our users table
  let { data: dbUser } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('open_id', user.id)
    .single();
  
  // If user doesn't exist in our table, create them
  if (!dbUser) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        open_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
        verified: false,
        email_verified: !!user.email_confirmed_at,
      })
      .select('id, email, name, role')
      .single();
    
    if (insertError) {
      console.error('[gigs.getUser] Error creating user:', insertError);
      return null;
    }
    dbUser = newUser;
  }
  
  return dbUser;
}

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

// GET /gigs/:id - Get single gig with packages, reviews, extras
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
    .select('id, name, avatar_url, verified, seller_level, completed_orders, average_rating, bio')
    .eq('id', gig.seller_id)
    .single();
  
  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:users!reviewer_id(id, name, avatar_url)')
    .eq('gig_id', id)
    .order('created_at', { ascending: false });
  
  // Get extras
  const { data: extras } = await supabase
    .from('gig_extras')
    .select('*')
    .eq('gig_id', id)
    .eq('active', true)
    .order('price', { ascending: true });
  
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
      bio: seller.bio,
    } : null,
    reviews: (reviews || []).map((r: any) => ({
      id: r.id,
      gigId: r.gig_id,
      reviewerId: r.reviewer_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      reviewer: r.reviewer ? {
        id: r.reviewer.id,
        name: r.reviewer.name,
        avatarUrl: r.reviewer.avatar_url,
      } : null,
    })),
    extras: (extras || []).map((e: any) => ({
      id: e.id,
      gigId: e.gig_id,
      name: e.name,
      description: e.description,
      price: e.price,
      deliveryDays: e.delivery_days,
      active: e.active,
    })),
  };
}

serve(async (req: Request) => {
  // Set request for CORS headers
  setCurrentRequest(req);
  
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
    
    // POST /gigs - Create new gig
    if (method === 'POST' && pathParts.length === 1) {
      const user = await getUser(req);
      if (!user) return unauthorizedResponse();
      
      const input = await req.json();
      const supabase = getServiceClient();
      
      // Create gig
      const { data: gig, error: gigError } = await supabase
        .from('gigs')
        .insert({
          seller_id: user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          tags: input.tags || '[]',
          price: input.price,
          delivery_days: input.deliveryDays || 3,
          image_url: input.imageUrl,
          status: 'draft',
          active: true,
        })
        .select()
        .single();
      
      if (gigError) {
        console.error('[gigs.create] Error:', gigError);
        return errorResponse('Failed to create gig', 500);
      }
      
      // Create default package if price provided
      if (input.price) {
        await supabase
          .from('gig_packages')
          .insert({
            gig_id: gig.id,
            package_type: 'basic',
            name: 'Standard',
            description: input.description?.substring(0, 200) || '',
            price: input.price,
            delivery_days: input.deliveryDays || 3,
            revisions: 1,
            features: '[]',
            active: true,
          });
      }
      
      return jsonResponse(toDbGig(gig));
    }
    
    // PUT /gigs/:id - Update gig
    if (method === 'PUT' && pathParts.length === 2) {
      const user = await getUser(req);
      if (!user) return unauthorizedResponse();
      
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid gig ID');
      
      const input = await req.json();
      const supabase = getServiceClient();
      
      // Check ownership
      const { data: existing } = await supabase
        .from('gigs')
        .select('seller_id')
        .eq('id', id)
        .single();
      
      if (!existing || existing.seller_id !== user.id) {
        return errorResponse('Not authorized', 403);
      }
      
      const { data: gig, error } = await supabase
        .from('gigs')
        .update({
          title: input.title,
          description: input.description,
          category: input.category,
          tags: input.tags,
          price: input.price,
          delivery_days: input.deliveryDays,
          image_url: input.imageUrl,
          status: input.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('[gigs.update] Error:', error);
        return errorResponse('Failed to update gig', 500);
      }
      
      return jsonResponse(toDbGig(gig));
    }
    
    // DELETE /gigs/:id - Delete gig
    if (method === 'DELETE' && pathParts.length === 2) {
      const user = await getUser(req);
      if (!user) return unauthorizedResponse();
      
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid gig ID');
      
      const supabase = getServiceClient();
      
      // Check ownership
      const { data: existing } = await supabase
        .from('gigs')
        .select('seller_id')
        .eq('id', id)
        .single();
      
      if (!existing || existing.seller_id !== user.id) {
        return errorResponse('Not authorized', 403);
      }
      
      const { error } = await supabase
        .from('gigs')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('[gigs.delete] Error:', error);
        return errorResponse('Failed to delete gig', 500);
      }
      
      return jsonResponse({ success: true });
    }
    
    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[gigs] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
