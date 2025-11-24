import Stripe from "stripe";
import { ENV } from "./_core/env";

if (!ENV.stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required for Stripe Connect");
}

const stripe = new Stripe(ENV.stripeSecretKey);

/**
 * Create a Stripe Connect Express account for a seller
 * Express accounts are the simplest type - Stripe handles all KYC/verification
 */
export async function createConnectAccount(params: {
  email: string;
  country: string; // 'DE', 'AT', 'CH'
}): Promise<{ accountId: string }> {
  const account = await stripe.accounts.create({
    type: "express",
    country: params.country,
    email: params.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual", // Most sellers are individuals, not companies
  });

  return { accountId: account.id };
}

/**
 * Create an onboarding link for a seller to complete their Stripe Connect setup
 * This link redirects to Stripe's hosted onboarding flow
 */
export async function createAccountLink(params: {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const accountLink = await stripe.accountLinks.create({
    account: params.accountId,
    refresh_url: params.refreshUrl,
    return_url: params.returnUrl,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

/**
 * Get the current status of a Connect account
 */
export async function getAccountStatus(accountId: string): Promise<{
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}> {
  const account = await stripe.accounts.retrieve(accountId);

  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
  };
}

/**
 * Create a login link for sellers to access their Stripe Express Dashboard
 * This is where they can see earnings, payouts, and manage their account
 */
export async function createLoginLink(accountId: string): Promise<{ url: string }> {
  const loginLink = await stripe.accounts.createLoginLink(accountId);
  return { url: loginLink.url };
}

/**
 * Create a Payment Intent with destination charges (Stripe Connect)
 * 
 * How it works:
 * 1. Buyer pays totalAmount
 * 2. Platform automatically keeps platformFee
 * 3. Seller receives (totalAmount - platformFee) directly to their account
 * 
 * @param totalAmount - Total amount in cents (what buyer pays)
 * @param platformFeePercent - Platform commission percentage (e.g., 15)
 * @param sellerAccountId - Seller's Stripe Connect account ID
 * @param metadata - Additional data to attach to the payment
 */
export async function createConnectPaymentIntent(params: {
  totalAmount: number; // in cents
  platformFeePercent: number; // e.g., 15 for 15%
  sellerAccountId: string;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<{
  paymentIntentId: string;
  clientSecret: string;
  platformFee: number;
  sellerEarnings: number;
}> {
  const { totalAmount, platformFeePercent, sellerAccountId, currency = "eur", metadata = {} } = params;

  // Calculate fees
  const platformFee = Math.round((totalAmount * platformFeePercent) / 100);
  const sellerEarnings = totalAmount - platformFee;

  // Create Payment Intent with destination charges
  // https://docs.stripe.com/connect/destination-charges
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency,
    application_fee_amount: platformFee, // Platform keeps this
    transfer_data: {
      destination: sellerAccountId, // Seller receives the rest
    },
    metadata: {
      ...metadata,
      platformFee: platformFee.toString(),
      sellerEarnings: sellerEarnings.toString(),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret!,
    platformFee,
    sellerEarnings,
  };
}

/**
 * Retrieve a Payment Intent to check its status
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Create a refund for a payment (used in dispute resolution)
 * When refunding a Connect payment, the platform fee is also refunded
 */
export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number; // Optional: partial refund amount in cents
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
}): Promise<{ refundId: string }> {
  const refund = await stripe.refunds.create({
    payment_intent: params.paymentIntentId,
    amount: params.amount,
    reason: params.reason,
  });

  return { refundId: refund.id };
}
