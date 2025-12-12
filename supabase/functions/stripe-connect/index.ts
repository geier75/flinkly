/**
 * Stripe Connect Edge Function
 * Handles: GET /stripe-connect/status, POST /stripe-connect/account, GET /stripe-connect/onboarding, GET /stripe-connect/dashboard
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse, unauthorizedResponse, setCurrentRequest } from '../_shared/response.ts';
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno';

// Initialize Stripe
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://flinkly.vercel.app';

function getStripe(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// Get user from Supabase auth header
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (token === ANON_KEY) {
    return null;
  }
  
  const supabase = getServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  // Get user from our users table
  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', user.id)
    .single();
  
  return dbUser;
}

// GET /stripe-connect/status - Get account status
async function getAccountStatus(userId: number, stripeAccountId: string | null) {
  if (!stripeAccountId) {
    return {
      hasAccount: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      onboardingComplete: false,
    };
  }

  try {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(stripeAccountId);
    
    // Update database with latest status
    const supabase = getServiceClient();
    await supabase
      .from('users')
      .update({
        stripe_onboarding_complete: account.details_submitted,
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return {
      hasAccount: true,
      accountId: stripeAccountId,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      onboardingComplete: account.details_submitted,
    };
  } catch (error) {
    console.error('[stripe-connect.status] Error:', error);
    return {
      hasAccount: true,
      accountId: stripeAccountId,
      chargesEnabled: false,
      payoutsEnabled: false,
      onboardingComplete: false,
      error: 'Could not retrieve account status',
    };
  }
}

// POST /stripe-connect/account - Create Connect account
async function createAccount(userId: number, email: string, country: string = 'DE') {
  try {
    const stripe = getStripe();
    
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Save account ID to database
    const supabase = getServiceClient();
    await supabase
      .from('users')
      .update({
        stripe_account_id: account.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return {
      success: true,
      accountId: account.id,
    };
  } catch (error) {
    console.error('[stripe-connect.createAccount] Error:', error);
    throw error;
  }
}

// GET /stripe-connect/onboarding - Get onboarding link
async function getOnboardingLink(stripeAccountId: string) {
  try {
    const stripe = getStripe();
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${FRONTEND_URL}/seller-dashboard?refresh=true`,
      return_url: `${FRONTEND_URL}/seller-dashboard?onboarding=complete`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  } catch (error) {
    console.error('[stripe-connect.onboarding] Error:', error);
    throw error;
  }
}

// GET /stripe-connect/dashboard - Get dashboard login link
async function getDashboardLink(stripeAccountId: string) {
  try {
    const stripe = getStripe();
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    return { url: loginLink.url };
  } catch (error) {
    console.error('[stripe-connect.dashboard] Error:', error);
    throw error;
  }
}

// GET /stripe-connect/earnings - Get seller earnings
async function getEarnings(userId: number) {
  const supabase = getServiceClient();
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', userId)
    .eq('status', 'completed');

  const completedOrders = orders || [];
  
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.seller_earnings || 0), 0);
  const totalPlatformFees = completedOrders.reduce((sum, o) => sum + (o.platform_fee || 0), 0);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_price, 0);

  return {
    totalEarnings,
    totalPlatformFees,
    totalRevenue,
    completedOrdersCount: completedOrders.length,
    platformFeePercent: 15,
  };
}

serve(async (req: Request) => {
  setCurrentRequest(req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = req.method;
  const action = pathParts[1]; // status, account, onboarding, dashboard, earnings
  
  try {
    // All endpoints require authentication
    const user = await getUser(req);
    if (!user) {
      return unauthorizedResponse('Authentication required');
    }

    // GET /stripe-connect/status
    if (method === 'GET' && action === 'status') {
      const result = await getAccountStatus(user.id, user.stripe_account_id);
      return jsonResponse(result);
    }

    // POST /stripe-connect/account
    if (method === 'POST' && action === 'account') {
      if (user.stripe_account_id) {
        return jsonResponse({
          success: false,
          error: 'User already has a Stripe Connect account',
          accountId: user.stripe_account_id,
        });
      }
      
      if (!user.email) {
        return errorResponse('E-Mail-Adresse erforderlich. Bitte aktualisiere dein Profil.');
      }
      
      const body = await req.json().catch(() => ({}));
      const country = body.country || 'DE';
      
      const result = await createAccount(user.id, user.email, country);
      return jsonResponse(result);
    }

    // GET /stripe-connect/onboarding
    if (method === 'GET' && action === 'onboarding') {
      if (!user.stripe_account_id) {
        return errorResponse('User does not have a Stripe Connect account. Create one first.');
      }
      
      const result = await getOnboardingLink(user.stripe_account_id);
      return jsonResponse(result);
    }

    // GET /stripe-connect/dashboard
    if (method === 'GET' && action === 'dashboard') {
      if (!user.stripe_account_id) {
        return errorResponse('User does not have a Stripe Connect account');
      }
      
      const result = await getDashboardLink(user.stripe_account_id);
      return jsonResponse(result);
    }

    // GET /stripe-connect/earnings
    if (method === 'GET' && action === 'earnings') {
      const result = await getEarnings(user.id);
      return jsonResponse(result);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    console.error('[stripe-connect] Error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
});
