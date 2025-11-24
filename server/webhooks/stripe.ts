/**
 * Stripe Webhook Handler for Flinkly
 * 
 * Handles Stripe events:
 * - checkout.session.completed: Create order after successful payment
 * - payment_intent.succeeded: Log successful payment
 * - payment_intent.payment_failed: Handle failed payment
 * - charge.refunded: Handle refunds
 * - account.updated: Update seller Connect account status
 */

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { constructWebhookEvent } from '../payment';
import { getDb } from '../db';
import { orders, transactions } from '../../drizzle/schema';

/**
 * Webhook endpoint: POST /api/stripe/webhook
 * 
 * IMPORTANT: This route MUST use express.raw() middleware
 * Register in server/_core/index.ts BEFORE express.json()
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];

  if (!signature || Array.isArray(signature)) {
    console.error('[Stripe Webhook] Missing signature');
    // Always return 200 OK (Stripe requirement)
    return res.status(200).json({ verified: false, error: 'Missing signature' });
  }

  try {
    // Verify webhook signature
    const event = constructWebhookEvent(req.body, signature);

    console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

    // Handle test events (required for webhook verification)
    if (event.id.startsWith('evt_test_')) {
      console.log('[Stripe Webhook] Test event detected, returning verification response');
      return res.json({ verified: true });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ verified: true, received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    // Always return 200 OK, even on error (Stripe requirement)
    return res.status(200).json({ verified: false, error: 'Webhook processing failed' });
  }
}

/**
 * Handle checkout.session.completed
 * Create order in database after successful payment
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Stripe Webhook] Database not available');
      return;
    }

    const metadata = session.metadata;
    if (!metadata) {
      console.error('[Stripe Webhook] Missing metadata in session');
      return;
    }

    const gigId = parseInt(metadata.gig_id);
    const buyerId = parseInt(metadata.buyer_id);
    const sellerId = parseInt(metadata.seller_id);
    const paymentIntentId = session.payment_intent as string;
    
    // Calculate platform fee (15% default)
    const totalPrice = session.amount_total!;
    const platformFeePercent = 15;
    const platformFee = Math.round((totalPrice * platformFeePercent) / 100);
    const sellerEarnings = totalPrice - platformFee;

    // Create order
    const [order] = await db.insert(orders).values({
      gigId,
      buyerId,
      sellerId,
      status: 'in_progress',
      totalPrice,
      platformFeePercent,
      platformFee,
      sellerEarnings,
    });

    // Create transaction record
    await db.insert(transactions).values({
      orderId: order.insertId,
      buyerId,
      sellerId,
      amount: totalPrice,
      platformFee,
      sellerEarnings,
      currency: 'EUR',
      paymentIntentId,
      status: 'authorized',
    });

    console.log(`[Stripe Webhook] Order created for gig ${gigId}, buyer ${buyerId}`);
  } catch (error) {
    console.error('[Stripe Webhook] Failed to create order:', error);
  }
}

/**
 * Handle payment_intent.succeeded
 * Log successful payment
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id} (${paymentIntent.amount / 100}€)`);
  
  // Optional: Send notification to buyer
  // await notifyOwner({ 
  //   title: 'Zahlung erfolgreich', 
  //   content: `Payment ${paymentIntent.id} wurde erfolgreich autorisiert.` 
  // });
}

/**
 * Handle payment_intent.payment_failed
 * Log failed payment and notify buyer
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
  
  // Optional: Notify buyer about failed payment
  // await notifyOwner({ 
  //   title: 'Zahlung fehlgeschlagen', 
  //   content: `Payment ${paymentIntent.id} ist fehlgeschlagen.` 
  // });
}

/**
 * Handle charge.refunded
 * Update order status to refunded
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const db = await getDb();
    if (!db) return;

    const paymentIntentId = charge.payment_intent as string;

    // Find transaction by payment intent
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.paymentIntentId, paymentIntentId))
      .limit(1);

    if (!transaction) {
      console.error(`[Stripe Webhook] Transaction not found for payment ${paymentIntentId}`);
      return;
    }

    // Update transaction status
    await db
      .update(transactions)
      .set({ status: 'refunded' })
      .where(eq(transactions.paymentIntentId, paymentIntentId));

    // Update order status
    await db
      .update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, transaction.orderId));

    console.log(`[Stripe Webhook] Order refunded for payment ${paymentIntentId}`);
  } catch (error) {
    console.error('[Stripe Webhook] Failed to update refunded order:', error);
  }
}

/**
 * Handle account.updated
 * Update seller's Connect account status and capabilities
 * 
 * This webhook is triggered when:
 * - Seller completes onboarding
 * - Account capabilities change (charges_enabled, payouts_enabled)
 * - Account is disabled/suspended
 */
async function handleAccountUpdated(account: Stripe.Account) {
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Stripe Webhook] Database not available');
      return;
    }

    const sellerId = account.metadata?.seller_id;
    if (!sellerId) {
      console.warn('[Stripe Webhook] account.updated event missing seller_id in metadata');
      return;
    }

    // Extract capabilities
    const chargesEnabled = account.charges_enabled || false;
    const payoutsEnabled = account.payouts_enabled || false;
    const onboardingComplete = account.details_submitted || false;
    
    // Check if account is fully functional
    const isFullyVerified = chargesEnabled && payoutsEnabled && onboardingComplete;

    console.log(`[Stripe Webhook] Seller ${sellerId} account updated:`);
    console.log(`  - Charges Enabled: ${chargesEnabled}`);
    console.log(`  - Payouts Enabled: ${payoutsEnabled}`);
    console.log(`  - Onboarding Complete: ${onboardingComplete}`);
    console.log(`  - Fully Verified: ${isFullyVerified}`);

    // Update seller's Stripe Connect status in database
    const { updateUserStripeAccount } = await import('../db');
    await updateUserStripeAccount(
      parseInt(sellerId),
      account.id,
      {
        chargesEnabled,
        payoutsEnabled,
        onboardingComplete,
      }
    );

    console.log(`[Stripe Webhook] ✅ Seller ${sellerId} capabilities updated in database`);
    
    // Optional: Send notification to seller if fully verified
    if (isFullyVerified) {
      console.log(`[Stripe Webhook] 🎉 Seller ${sellerId} is now fully verified!`);
      // TODO: Send email notification to seller
      // await sendEmail({
      //   to: sellerEmail,
      //   subject: 'Stripe-Konto erfolgreich verifiziert',
      //   template: 'stripe-verified',
      // });
    }
  } catch (error) {
    console.error('[Stripe Webhook] Failed to update seller account:', error);
  }
}

// Import eq for database queries
import { eq } from 'drizzle-orm';
