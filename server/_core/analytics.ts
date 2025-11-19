/**
 * PostHog Analytics Integration
 * 
 * Tracks user events, conversion funnels und product analytics.
 * 
 * Setup:
 * 1. PostHog-Projekt erstellen: https://posthog.com
 * 2. API-Key in .env konfigurieren:
 *    - POSTHOG_API_KEY (z.B. phc_xxx)
 *    - POSTHOG_HOST (z.B. https://app.posthog.com oder self-hosted URL)
 * 
 * Features:
 * - Event-Tracking (User-Actions, Conversions)
 * - User-Properties (Metadata, Segmentation)
 * - Feature-Flags (A/B-Testing)
 * - Session-Recording (optional)
 */

import { PostHog } from 'posthog-node';

let posthog: PostHog | null = null;

/**
 * Initialize PostHog (call once at server startup)
 */
export function initPostHog(): void {
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';
  
  if (!apiKey) {
    console.warn('[PostHog] Not configured - analytics will not be tracked');
    console.warn('[PostHog] Set POSTHOG_API_KEY in environment to enable analytics');
    return;
  }

  posthog = new PostHog(apiKey, {
    host,
    flushAt: 20, // Flush after 20 events
    flushInterval: 10000, // Flush every 10 seconds
  });

  console.log(`[PostHog] Initialized (host: ${host})`);
}

/**
 * Check if PostHog is configured
 */
export function isPostHogConfigured(): boolean {
  return posthog !== null;
}

/**
 * Track event
 */
export function trackEvent(
  userId: number | string,
  event: string,
  properties?: Record<string, any>
): void {
  if (!posthog) {
    console.log(`[PostHog] Event tracked (PostHog not configured): ${event}`, properties);
    return;
  }

  posthog.capture({
    distinctId: userId.toString(),
    event,
    properties,
  });
}

/**
 * Identify user (set user properties)
 */
export function identifyUser(
  userId: number | string,
  properties: Record<string, any>
): void {
  if (!posthog) return;

  posthog.identify({
    distinctId: userId.toString(),
    properties,
  });
}

/**
 * Track page view
 */
export function trackPageView(
  userId: number | string,
  path: string,
  properties?: Record<string, any>
): void {
  trackEvent(userId, '$pageview', {
    $current_url: path,
    ...properties,
  });
}

/**
 * Get feature flag value
 */
export async function getFeatureFlag(
  userId: number | string,
  flagKey: string
): Promise<boolean | string | undefined> {
  if (!posthog) return undefined;

  return await posthog.getFeatureFlag(flagKey, userId.toString());
}

/**
 * Check if feature flag is enabled
 */
export async function isFeatureFlagEnabled(
  userId: number | string,
  flagKey: string
): Promise<boolean> {
  if (!posthog) return false;

  const result = await posthog.isFeatureEnabled(flagKey, userId.toString());
  return result === true;
}

/**
 * Flush PostHog events (call before server shutdown)
 */
export async function flushPostHog(): Promise<void> {
  if (!posthog) return;

  await posthog.shutdown();
  console.log('[PostHog] Flushed and shut down');
}

/**
 * Conversion Funnel Events
 * 
 * Track key steps in the user journey to identify drop-off points.
 */

export function trackGigView(userId: number | string, gigId: number, gigTitle: string, category: string, price: number): void {
  trackEvent(userId, 'gig_viewed', {
    gig_id: gigId,
    gig_title: gigTitle,
    category,
    price,
  });
}

export function trackAddToCart(userId: number | string, gigId: number, gigTitle: string, price: number): void {
  trackEvent(userId, 'add_to_cart', {
    gig_id: gigId,
    gig_title: gigTitle,
    price,
  });
}

export function trackCheckoutStart(userId: number | string, gigId: number, price: number): void {
  trackEvent(userId, 'checkout_started', {
    gig_id: gigId,
    price,
  });
}

export function trackPaymentSuccess(userId: number | string, orderId: number, gigId: number, price: number): void {
  trackEvent(userId, 'payment_success', {
    order_id: orderId,
    gig_id: gigId,
    price,
    revenue: price, // For revenue tracking
  });
}

export function trackOrderCompleted(userId: number | string, orderId: number, gigId: number, price: number): void {
  trackEvent(userId, 'order_completed', {
    order_id: orderId,
    gig_id: gigId,
    price,
  });
}

export function trackDisputeOpened(userId: number | string, orderId: number, reason: string): void {
  trackEvent(userId, 'dispute_opened', {
    order_id: orderId,
    reason,
  });
}

export function trackMessageSent(userId: number | string, conversationId: number, messageType: string): void {
  trackEvent(userId, 'message_sent', {
    conversation_id: conversationId,
    message_type: messageType,
  });
}
