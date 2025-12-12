/**
 * Orders Edge Function
 * Handles: GET /orders, GET /orders/:id, POST /orders
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, notFoundResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';

interface OrderInput {
  gigId: number;
  packageType: 'basic' | 'standard' | 'premium';
  buyerMessage?: string;
}

function toOrder(row: any) {
  return {
    id: row.id,
    gigId: row.gig_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    status: row.status,
    totalPrice: row.total_price,
    platformFee: row.platform_fee,
    sellerEarnings: row.seller_earnings,
    selectedPackage: row.selected_package,
    buyerMessage: row.buyer_message,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Get user from Supabase auth header
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[orders.getUser] No auth header');
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Check if this is the anon key (not a user token)
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (token === ANON_KEY) {
    console.log('[orders.getUser] Anon key used, no user');
    return null;
  }
  
  const supabase = getServiceClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.log('[orders.getUser] Auth error:', error.message);
    return null;
  }
  if (!user) {
    console.log('[orders.getUser] No user from token');
    return null;
  }
  
  console.log('[orders.getUser] Found auth user:', user.id);
  
  // Get user from our users table
  let { data: dbUser } = await supabase
    .from('users')
    .select('id, open_id, role')
    .eq('open_id', user.id)
    .single();
  
  // If user doesn't exist in our table, create them
  if (!dbUser) {
    console.log('[orders.getUser] Creating new user in DB');
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
      .select('id, open_id, role')
      .single();
    
    if (insertError) {
      console.error('[orders.getUser] Error creating user:', insertError);
      return null;
    }
    dbUser = newUser;
  }
  
  console.log('[orders.getUser] DB user:', dbUser?.id);
  return dbUser;
}

// GET /orders - List user's orders
async function listOrders(userId: number, role: 'buyer' | 'seller') {
  const supabase = getServiceClient();
  
  const column = role === 'buyer' ? 'buyer_id' : 'seller_id';
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('[orders.list] Error:', error);
    return [];
  }
  
  return (data || []).map(toOrder);
}

// GET /orders/:id
async function getOrder(id: number, userId: number) {
  const supabase = getServiceClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  
  // Check access
  if (data.buyer_id !== userId && data.seller_id !== userId) {
    return null;
  }
  
  return toOrder(data);
}

serve(async (req: Request) => {
  // Set request for dynamic CORS headers
  setCurrentRequest(req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = req.method;
  
  // Auth required for all order endpoints
  const user = await getUser(req);
  if (!user) return unauthorizedResponse();
  
  try {
    // GET /orders
    if (method === 'GET' && pathParts.length === 1) {
      const role = url.searchParams.get('role') as 'buyer' | 'seller' || 'buyer';
      const orders = await listOrders(user.id, role);
      return jsonResponse({ orders });
    }
    
    // GET /orders/:id
    if (method === 'GET' && pathParts.length === 2) {
      const id = parseInt(pathParts[1]);
      if (isNaN(id)) return errorResponse('Invalid order ID');
      
      const order = await getOrder(id, user.id);
      if (!order) return notFoundResponse('Order not found');
      
      return jsonResponse(order);
    }
    
    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[orders] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
