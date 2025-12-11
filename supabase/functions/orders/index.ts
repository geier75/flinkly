/**
 * Orders Edge Function
 * Handles: GET /orders, GET /orders/:id, POST /orders
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '../_shared/response.ts';

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

// Get user from session
async function getUser(req: Request) {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('flinkly_session='));
  if (!sessionCookie) return null;
  
  const openId = sessionCookie.split('=')[1];
  const supabase = getServiceClient();
  
  const { data: user } = await supabase
    .from('users')
    .select('id, open_id, role')
    .eq('open_id', openId)
    .single();
  
  return user;
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
