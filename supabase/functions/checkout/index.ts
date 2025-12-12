/**
 * Checkout Edge Function
 * Creates Stripe Checkout Sessions for gig purchases
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';

interface CheckoutInput {
  gigId: number;
  selectedPackage: 'basic' | 'standard' | 'premium';
  selectedExtras?: number[];
  buyerMessage?: string;
}

// Get user from Supabase auth header
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[checkout.getUser] No auth header');
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Check if this is the anon key (not a user token)
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (token === ANON_KEY) {
    console.log('[checkout.getUser] Anon key used, no user');
    return null;
  }
  
  const supabase = getServiceClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.log('[checkout.getUser] Auth error:', error.message);
    return null;
  }
  if (!user) {
    console.log('[checkout.getUser] No user from token');
    return null;
  }
  
  console.log('[checkout.getUser] Found auth user:', user.id);
  
  // Get user from our users table
  let { data: dbUser } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('open_id', user.id)
    .single();
  
  // If user doesn't exist in our table, create them
  if (!dbUser) {
    console.log('[checkout.getUser] Creating new user in DB');
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
      .select('id, email, name')
      .single();
    
    if (insertError) {
      console.error('[checkout.getUser] Error creating user:', insertError);
      return null;
    }
    dbUser = newUser;
  }
  
  console.log('[checkout.getUser] DB user:', dbUser?.id);
  return dbUser;
}

serve(async (req: Request) => {
  setCurrentRequest(req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }
  
  try {
    const user = await getUser(req);
    if (!user) return unauthorizedResponse();
    
    const input: CheckoutInput = await req.json();
    const { gigId, selectedPackage, selectedExtras = [], buyerMessage = '' } = input;
    
    const supabase = getServiceClient();
    
    // Get gig
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('*')
      .eq('id', gigId)
      .single();
    
    if (gigError || !gig) {
      return errorResponse('Gig not found', 404);
    }
    
    // Get package
    const { data: pkg } = await supabase
      .from('gig_packages')
      .select('*')
      .eq('gig_id', gigId)
      .eq('package_type', selectedPackage)
      .eq('active', true)
      .single();
    
    if (!pkg) {
      return errorResponse('Package not found', 404);
    }
    
    // Get extras
    let extras: any[] = [];
    if (selectedExtras.length > 0) {
      const { data: extrasData } = await supabase
        .from('gig_extras')
        .select('*')
        .eq('gig_id', gigId)
        .in('id', selectedExtras);
      extras = extrasData || [];
    }
    
    // Calculate total
    let totalAmount = pkg.price;
    for (const extra of extras) {
      totalAmount += extra.price;
    }
    
    // Get origin for redirect URLs
    const origin = req.headers.get('Origin') || 'https://flinkly.eu';
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/gig/${gigId}`;
    
    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('success_url', successUrl);
    params.append('cancel_url', cancelUrl);
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][product_data][name]', `${gig.title} - ${pkg.name}`);
    params.append('line_items[0][price_data][product_data][description]', pkg.description || '');
    params.append('line_items[0][price_data][unit_amount]', String(pkg.price));
    params.append('line_items[0][quantity]', '1');
    
    // Add extras as line items
    let lineItemIndex = 1;
    for (const extra of extras) {
      params.append(`line_items[${lineItemIndex}][price_data][currency]`, 'eur');
      params.append(`line_items[${lineItemIndex}][price_data][product_data][name]`, extra.name);
      params.append(`line_items[${lineItemIndex}][price_data][unit_amount]`, String(extra.price));
      params.append(`line_items[${lineItemIndex}][quantity]`, '1');
      lineItemIndex++;
    }
    
    // Metadata for webhook
    params.append('metadata[gig_id]', String(gig.id));
    params.append('metadata[buyer_id]', String(user.id));
    params.append('metadata[seller_id]', String(gig.seller_id));
    params.append('metadata[package_type]', selectedPackage);
    params.append('metadata[buyer_message]', buyerMessage);
    params.append('metadata[extras]', JSON.stringify(selectedExtras));
    
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error('[checkout] Stripe error:', error);
      return errorResponse('Failed to create checkout session', 500);
    }
    
    const session = await stripeResponse.json();
    
    return jsonResponse({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[checkout] Error:', error);
    return errorResponse('Internal server error', 500);
  }
});
