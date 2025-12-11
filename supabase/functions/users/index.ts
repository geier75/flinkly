/**
 * Users Edge Function
 * Handles: GET /users/:id, PUT /users/profile
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, notFoundResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';

function toPublicUser(row: any) {
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    verified: row.verified,
    sellerLevel: row.seller_level,
    completedOrders: row.completed_orders,
    averageRating: row.average_rating,
    bio: row.bio,
    country: row.country,
    createdAt: new Date(row.created_at),
  };
}

// Get user from session
async function getSessionUser(req: Request) {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('flinkly_session='));
  if (!sessionCookie) return null;
  
  const openId = sessionCookie.split('=')[1];
  const supabase = getServiceClient();
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', openId)
    .single();
  
  return user;
}

// GET /users/:id - Public profile
async function getPublicProfile(id: number) {
  const supabase = getServiceClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('id, name, avatar_url, verified, seller_level, completed_orders, average_rating, bio, country, created_at')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return toPublicUser(data);
}

// PUT /users/profile - Update own profile
async function updateProfile(userId: number, updates: any) {
  const supabase = getServiceClient();
  
  const allowedFields: Record<string, string> = {
    name: 'name',
    bio: 'bio',
    country: 'country',
    avatarUrl: 'avatar_url',
  };
  
  const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
  
  for (const [key, dbKey] of Object.entries(allowedFields)) {
    if (updates[key] !== undefined) {
      updateData[dbKey] = updates[key];
    }
  }
  
  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);
  
  if (error) throw error;
  return { success: true };
}

serve(async (req: Request) => {
  // Set request for dynamic CORS headers
  setCurrentRequest(req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = req.method;
  
  try {
    // GET /users/:id - Public profile (no auth required)
    if (method === 'GET' && pathParts.length === 2) {
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid user ID');
      
      const user = await getPublicProfile(id);
      if (!user) return notFoundResponse('User not found');
      
      return jsonResponse(user);
    }
    
    // PUT /users/profile - Update own profile (auth required)
    if (method === 'PUT' && pathParts[1] === 'profile') {
      const sessionUser = await getSessionUser(req);
      if (!sessionUser) return unauthorizedResponse();
      
      const body = await req.json();
      const result = await updateProfile(sessionUser.id, body);
      return jsonResponse(result);
    }
    
    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[users] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
