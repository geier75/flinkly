/**
 * Stripe Payment Integration for Flinkly Marketplace
 * 
 * Architecture:
 * - Stripe Checkout for buyer payments
 * - Stripe Connect for seller payouts (85% to seller, 15% platform fee)
 * - Escrow system: Funds held until order completion
 * 
 * Supported payment methods:
 * - card: Credit/Debit cards
 * - sepa_debit: SEPA Direct Debit
 * - klarna: Klarna Buy Now Pay Later  
 * - twint: TWINT (Swiss mobile payment)
 */

import Stripe from 'stripe';
import { ENV } from './_core/env';

// Initialize Stripe with secret key
const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export interface CreateCheckoutParams {
  gigId: number;
  gigTitle: string;
  gigPrice: number; // in EUR
  buyerId: number;
  buyerEmail: string;
  buyerName?: string;
  sellerId: number;
  sellerStripeAccountId?: string; // Stripe Connect Account ID (for Destination Charges)
  origin: string; // For success/cancel URLs
  buyerMessage?: string; // JSON string with briefing data
  selectedPackage?: string; // basic/standard/premium
  selectedExtras?: string; // JSON array of extra IDs
}

export interface CheckoutSession {
  id: string;
  url: string;
}

/**
 * Create Stripe Checkout Session for Gig purchase
 * 
 * Flow:
 * 1. Buyer clicks "Projekt starten"
 * 2. Create Checkout Session with gig details
 * 3. Redirect to Stripe-hosted checkout page
 * 4. On success, webhook creates order in DB
 * 5. Funds held in escrow until delivery
 * 
 * Marketplace Model:
 * - If seller has Stripe Connect: Use Destination Charges (85% to seller, 15% platform fee)
 * - If seller has NO Connect: Funds go to platform (manual payout later)
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutSession> {
  try {
    const totalAmountCents = Math.round(params.gigPrice * 100);
    const platformFeeCents = Math.round(totalAmountCents * 0.15); // 15% platform fee
    
    // Base session config
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card', 'sepa_debit', 'klarna'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.gigTitle,
              description: `Digitale Dienstleistung auf Flinkly`,
            },
            unit_amount: totalAmountCents,
          },
          quantity: 1,
        },
      ],
      customer_email: params.buyerEmail,
      client_reference_id: params.buyerId.toString(),
      metadata: {
        gig_id: params.gigId.toString(),
        buyer_id: params.buyerId.toString(),
        seller_id: params.sellerId.toString(),
        buyer_email: params.buyerEmail,
        buyer_name: params.buyerName || '',
        buyer_message: params.buyerMessage || '',
        selected_package: params.selectedPackage || 'basic',
        selected_extras: params.selectedExtras || '[]',
      },
      success_url: `${params.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${params.origin}/gig/${params.gigId}?payment=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      payment_intent_data: {
        capture_method: 'manual', // Escrow: hold funds until order completion
        metadata: {
          gig_id: params.gigId.toString(),
          buyer_id: params.buyerId.toString(),
          seller_id: params.sellerId.toString(),
        },
      },
    };
    
    // If seller has Stripe Connect: Use Destination Charges
    if (params.sellerStripeAccountId) {
      sessionConfig.payment_intent_data!.application_fee_amount = platformFeeCents;
      sessionConfig.payment_intent_data!.transfer_data = {
        destination: params.sellerStripeAccountId,
      };
      console.log(`[Stripe] Destination Charge: ${params.gigPrice}€ total, ${(platformFeeCents / 100).toFixed(2)}€ platform fee, ${((totalAmountCents - platformFeeCents) / 100).toFixed(2)}€ to seller`);
    } else {
      console.log(`[Stripe] Platform Charge: ${params.gigPrice}€ to platform (seller has no Connect account)`);
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      id: session.id,
      url: session.url!,
    };
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Capture authorized payment after order completion
 * 
 * Called when:
 * - Buyer marks order as complete
 * - Auto-release after 7 days (if no dispute)
 */
export async function capturePayment(paymentIntentId: string): Promise<void> {
  try {
    await stripe.paymentIntents.capture(paymentIntentId);
    console.log(`[Stripe] Payment captured: ${paymentIntentId}`);
  } catch (error) {
    console.error('[Stripe] Failed to capture payment:', error);
    throw new Error('Failed to capture payment');
  }
}

/**
 * Refund payment (full or partial)
 * 
 * Called when:
 * - Buyer requests refund before delivery
 * - Dispute resolved in buyer's favor
 * - Seller cancels order
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number // Optional: partial refund in cents
): Promise<void> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // Undefined = full refund
    });
    console.log(`[Stripe] Refund created: ${refund.id}`);
  } catch (error) {
    console.error('[Stripe] Failed to create refund:', error);
    throw new Error('Failed to create refund');
  }
}

/**
 * Transfer funds to seller (after platform fee)
 * 
 * Flow:
 * 1. Payment captured from buyer
 * 2. Calculate platform fee (15%)
 * 3. Transfer 85% to seller's Stripe Connect account
 * 
 * Note: Requires Stripe Connect setup for sellers
 */
export async function transferToSeller(
  paymentIntentId: string,
  sellerId: number,
  sellerStripeAccountId: string
): Promise<void> {
  try {
    // Get payment intent to get amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const totalAmount = paymentIntent.amount; // in cents
    
    // Calculate platform fee (15%)
    const platformFee = Math.round(totalAmount * 0.15);
    const sellerAmount = totalAmount - platformFee;

    // Create transfer to seller
    const transfer = await stripe.transfers.create({
      amount: sellerAmount,
      currency: 'eur',
      destination: sellerStripeAccountId,
      transfer_group: `order_${paymentIntentId}`,
      metadata: {
        seller_id: sellerId.toString(),
        payment_intent_id: paymentIntentId,
        platform_fee: platformFee.toString(),
      },
    });

    console.log(`[Stripe] Transfer created: ${transfer.id} (${sellerAmount / 100}€ to seller ${sellerId})`);
  } catch (error) {
    console.error('[Stripe] Failed to create transfer:', error);
    throw new Error('Failed to transfer funds to seller');
  }
}

/**
 * Create Stripe Connect account for seller
 * 
 * Required for receiving payouts
 * Sellers must complete KYC verification
 * 
 * Flow:
 * 1. Create Stripe Express account
 * 2. Generate onboarding link for KYC
 * 3. Save account ID to database
 * 4. Seller completes onboarding
 * 5. Webhook updates capabilities
 */
export async function createConnectAccount(
  sellerId: number,
  email: string,
  country: string = 'DE'
): Promise<{ accountId: string; onboardingUrl: string }> {
  try {
    // Create Connect account
    const account = await stripe.accounts.create({
      type: 'express', // Express = Stripe handles KYC UI
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        seller_id: sellerId.toString(),
      },
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${ENV.frontendUrl}/seller-dashboard?onboarding=refresh`,
      return_url: `${ENV.frontendUrl}/seller-dashboard?onboarding=complete`,
      type: 'account_onboarding',
    });

    // Save account ID to database
    const { updateUserStripeAccount } = await import('./db');
    await updateUserStripeAccount(sellerId, account.id);

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    console.error('[Stripe] Failed to create Connect account:', error);
    throw new Error('Failed to create seller account');
  }
}

/**
 * Get seller payout balance
 */
export async function getSellerBalance(
  stripeAccountId: string
): Promise<{ available: number; pending: number }> {
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });

    const available = balance.available.reduce((sum, b) => sum + b.amount, 0);
    const pending = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return {
      available: available / 100, // Convert to EUR
      pending: pending / 100,
    };
  } catch (error) {
    console.error('[Stripe] Failed to get balance:', error);
    throw new Error('Failed to get seller balance');
  }
}

/**
 * Create payout to seller's bank account
 * 
 * Note: Stripe automatically pays out to seller's bank account
 * This is just for manual payouts if needed
 */
export async function createPayout(
  stripeAccountId: string,
  amount: number // in EUR
): Promise<{ id: string }> {
  try {
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'eur',
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    console.log(`[Stripe] Payout created: ${payout.id}`);
    return { id: payout.id };
  } catch (error) {
    console.error('[Stripe] Failed to create payout:', error);
    throw new Error('Failed to create payout');
  }
}

/**
 * Verify webhook signature
 * 
 * CRITICAL: Always verify webhooks before processing
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      ENV.stripeWebhookSecret
    );
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

// Export Stripe instance for advanced usage
export { stripe };
