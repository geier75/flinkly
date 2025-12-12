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

// Get user from Supabase auth header
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[users.getUser] No auth header');
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Check if this is the anon key (not a user token)
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (token === ANON_KEY) {
    console.log('[users.getUser] Anon key used, no user');
    return null;
  }
  
  const supabase = getServiceClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.log('[users.getUser] Auth error:', error.message);
    return null;
  }
  if (!user) {
    console.log('[users.getUser] No user from token');
    return null;
  }
  
  console.log('[users.getUser] Found auth user:', user.id);
  
  // Get user from our users table
  let { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', user.id)
    .single();
  
  // If user doesn't exist in our table, create them
  if (!dbUser) {
    console.log('[users.getUser] Creating new user in DB');
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
      .select('*')
      .single();
    
    if (insertError) {
      console.error('[users.getUser] Error creating user:', insertError);
      return null;
    }
    dbUser = newUser;
  }
  
  console.log('[users.getUser] DB user:', dbUser?.id);
  return dbUser;
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
    // GET /users/me - Get current user (auth required)
    if (method === 'GET' && pathParts[1] === 'me') {
      const sessionUser = await getUser(req);
      if (!sessionUser) return jsonResponse(null);
      
      // Return full user object for authenticated user
      return jsonResponse({
        id: sessionUser.id,
        openId: sessionUser.open_id,
        name: sessionUser.name,
        email: sessionUser.email,
        role: sessionUser.role,
        avatarUrl: sessionUser.avatar_url,
        verified: sessionUser.verified,
        emailVerified: sessionUser.email_verified,
        sellerLevel: sessionUser.seller_level,
        completedOrders: sessionUser.completed_orders || 0,
        averageRating: sessionUser.average_rating,
        stripeAccountId: sessionUser.stripe_account_id,
        stripeOnboardingComplete: sessionUser.stripe_onboarding_complete || false,
        stripeChargesEnabled: sessionUser.stripe_charges_enabled || false,
        stripePayoutsEnabled: sessionUser.stripe_payouts_enabled || false,
        isCommercial: sessionUser.is_commercial || false,
        companyName: sessionUser.company_name,
      });
    }
    
    // GET /users/:id - Public profile (no auth required)
    if (method === 'GET' && pathParts.length === 2) {
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid user ID');
      
      const user = await getPublicProfile(id);
      if (!user) return notFoundResponse('User not found');
      
      return jsonResponse(user);
    }
    
    // PUT /users/me - Update own profile (auth required)
    if (method === 'PUT' && pathParts[1] === 'me') {
      const sessionUser = await getUser(req);
      if (!sessionUser) return unauthorizedResponse();
      
      const body = await req.json();
      const result = await updateProfile(sessionUser.id, body);
      return jsonResponse(result);
    }
    
    // PUT /users/profile - Update own profile (auth required) - legacy
    if (method === 'PUT' && pathParts[1] === 'profile') {
      const sessionUser = await getUser(req);
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
