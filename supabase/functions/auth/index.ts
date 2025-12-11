/**
 * Auth Edge Function
 * Handles: GET /auth/me, POST /auth/logout
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';

// Get current user from session cookie or auth header
async function getCurrentUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const cookieHeader = req.headers.get('Cookie');
  
  // Try to get session from cookie
  let sessionToken: string | null = null;
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith('flinkly_session='));
    if (sessionCookie) {
      sessionToken = sessionCookie.split('=')[1];
    }
  }
  
  // If no cookie, try auth header (for API calls)
  if (!sessionToken && authHeader?.startsWith('Bearer ')) {
    sessionToken = authHeader.substring(7);
  }
  
  if (!sessionToken) return null;
  
  // Decode session and get user
  try {
    const supabase = getServiceClient();
    
    // Session token is the user's open_id
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('open_id', sessionToken)
      .single();
    
    if (error || !user) return null;
    
    return {
      id: user.id,
      openId: user.open_id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
      verified: user.verified,
      emailVerified: user.email_verified,
      sellerLevel: user.seller_level,
      completedOrders: user.completed_orders,
      averageRating: user.average_rating,
      stripeAccountId: user.stripe_account_id,
      stripeOnboardingComplete: user.stripe_onboarding_complete,
      stripeChargesEnabled: user.stripe_charges_enabled,
      stripePayoutsEnabled: user.stripe_payouts_enabled,
      isCommercial: user.is_commercial,
      companyName: user.company_name,
    };
  } catch (error) {
    console.error('[auth.me] Error:', error);
    return null;
  }
}

serve(async (req: Request) => {
  // Set request for dynamic CORS headers
  setCurrentRequest(req);
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = req.method;
  
  try {
    // GET /auth/me - Get current user
    if (method === 'GET' && pathParts[1] === 'me') {
      const user = await getCurrentUser(req);
      return jsonResponse(user);
    }
    
    // POST /auth/logout
    if (method === 'POST' && pathParts[1] === 'logout') {
      // Clear cookie by setting expired date
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'flinkly_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }
    
    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[auth] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
