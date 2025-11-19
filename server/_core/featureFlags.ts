/**
 * Feature Flags & A/B Testing
 * 
 * Ermöglicht A/B-Tests für UI-Varianten, Pricing-Experimente und Feature-Rollouts.
 * 
 * Setup:
 * 1. PostHog-Feature-Flags erstellen: https://posthog.com/docs/feature-flags
 * 2. Flags im PostHog-Dashboard konfigurieren (z.B. "cta_variant", "pricing_format")
 * 3. Rollout-Prozent festlegen (z.B. 50% Variant A, 50% Variant B)
 * 
 * Features:
 * - Boolean-Flags (Feature on/off)
 * - Multivariate-Flags (A/B/C-Tests)
 * - Gradual-Rollouts (0-100%)
 * - User-Targeting (basierend auf Properties)
 */

import { getFeatureFlag, isFeatureFlagEnabled } from './analytics';

/**
 * CTA-Button-Text-Varianten
 * 
 * A/B-Test für Call-to-Action-Buttons im Marketplace.
 * 
 * Setup in PostHog:
 * - Flag-Key: "cta_button_text"
 * - Variants: "jetzt_kaufen", "gig_bestellen", "jetzt_buchen"
 * - Rollout: 33% / 33% / 34%
 */
export async function getCtaButtonText(userId: number): Promise<string> {
  const variant = await getFeatureFlag(userId, 'cta_button_text');
  
  switch (variant) {
    case 'jetzt_kaufen':
      return 'Jetzt kaufen';
    case 'gig_bestellen':
      return 'Gig bestellen';
    case 'jetzt_buchen':
      return 'Jetzt buchen';
    default:
      return 'Jetzt kaufen'; // Default fallback
  }
}

/**
 * Pricing-Format-Varianten
 * 
 * A/B-Test für Preis-Darstellung.
 * 
 * Setup in PostHog:
 * - Flag-Key: "pricing_format"
 * - Variants: "standard", "with_cents", "with_prefix"
 * - Rollout: 33% / 33% / 34%
 */
export async function formatPrice(userId: number, price: number): Promise<string> {
  const variant = await getFeatureFlag(userId, 'pricing_format');
  
  switch (variant) {
    case 'standard':
      return `€${price}`;
    case 'with_cents':
      return `€${price.toFixed(2)}`;
    case 'with_prefix':
      return `Nur €${price}`;
    default:
      return `€${price}`; // Default fallback
  }
}

/**
 * Checkout-Flow-Varianten
 * 
 * A/B-Test für Checkout-Prozess (3-Step vs 1-Page).
 * 
 * Setup in PostHog:
 * - Flag-Key: "checkout_flow"
 * - Variants: "three_step", "one_page"
 * - Rollout: 50% / 50%
 */
export async function getCheckoutFlow(userId: number): Promise<'three_step' | 'one_page'> {
  const variant = await getFeatureFlag(userId, 'checkout_flow');
  
  return variant === 'one_page' ? 'one_page' : 'three_step'; // Default: three_step
}

/**
 * Trust-Badge-Varianten
 * 
 * A/B-Test für Trust-Badges auf Gig-Seiten.
 * 
 * Setup in PostHog:
 * - Flag-Key: "trust_badge"
 * - Variants: "geld_zurueck", "dsgvo_konform", "verifiziert"
 * - Rollout: 33% / 33% / 34%
 */
export async function getTrustBadge(userId: number): Promise<string> {
  const variant = await getFeatureFlag(userId, 'trust_badge');
  
  switch (variant) {
    case 'geld_zurueck':
      return 'Geld-zurück-Garantie';
    case 'dsgvo_konform':
      return 'DSGVO-konform';
    case 'verifiziert':
      return 'Verifizierter Seller';
    default:
      return 'Geld-zurück-Garantie'; // Default fallback
  }
}

/**
 * New-Feature-Rollout
 * 
 * Gradual-Rollout für neue Features (z.B. Video-Calls, AI-Matching).
 * 
 * Setup in PostHog:
 * - Flag-Key: "video_calls_enabled"
 * - Type: Boolean
 * - Rollout: 0% → 10% → 50% → 100% (schrittweise)
 */
export async function isVideoCallsEnabled(userId: number): Promise<boolean> {
  return await isFeatureFlagEnabled(userId, 'video_calls_enabled');
}

export async function isAiMatchingEnabled(userId: number): Promise<boolean> {
  return await isFeatureFlagEnabled(userId, 'ai_matching_enabled');
}

/**
 * Premium-Feature-Gates
 * 
 * Feature-Flags für Premium-User (z.B. Priority-Support, Advanced-Analytics).
 * 
 * Setup in PostHog:
 * - Flag-Key: "premium_features"
 * - Type: Boolean
 * - Targeting: User-Property "subscription_tier" = "premium"
 */
export async function isPremiumFeaturesEnabled(userId: number): Promise<boolean> {
  return await isFeatureFlagEnabled(userId, 'premium_features');
}

/**
 * Helper: Get all active flags for a user
 * 
 * Useful for debugging and analytics.
 */
export async function getActiveFlags(userId: number): Promise<Record<string, any>> {
  const flags = {
    cta_button_text: await getFeatureFlag(userId, 'cta_button_text'),
    pricing_format: await getFeatureFlag(userId, 'pricing_format'),
    checkout_flow: await getFeatureFlag(userId, 'checkout_flow'),
    trust_badge: await getFeatureFlag(userId, 'trust_badge'),
    video_calls_enabled: await isFeatureFlagEnabled(userId, 'video_calls_enabled'),
    ai_matching_enabled: await isFeatureFlagEnabled(userId, 'ai_matching_enabled'),
    premium_features: await isFeatureFlagEnabled(userId, 'premium_features'),
  };
  
  return flags;
}
