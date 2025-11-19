/**
 * Feature-Flags-Hooks für A/B-Testing im Frontend
 * 
 * Provides hooks for accessing feature flags from PostHog.
 */

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

/**
 * Hook: Get feature flag value
 * 
 * Usage:
 * ```tsx
 * const ctaText = useFeatureFlag('cta_button_text', 'Jetzt kaufen');
 * <Button>{ctaText}</Button>
 * ```
 */
export function useFeatureFlag(flagKey: string, defaultValue: string | boolean = false): string | boolean {
  const [value, setValue] = useState<string | boolean>(defaultValue);

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_API_KEY) {
      setValue(defaultValue);
      return;
    }

    // Get flag value from PostHog
    const flagValue = posthog.getFeatureFlag(flagKey);
    
    if (flagValue !== undefined) {
      setValue(flagValue as string | boolean);
    } else {
      setValue(defaultValue);
    }

    // Listen for flag changes (PostHog reloads flags periodically)
    const interval = setInterval(() => {
      const newValue = posthog.getFeatureFlag(flagKey);
      if (newValue !== undefined && newValue !== value) {
        setValue(newValue as string | boolean);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [flagKey, defaultValue]);

  return value;
}

/**
 * Hook: Get CTA button text variant
 * 
 * A/B-Test: "Jetzt kaufen" | "Gig bestellen" | "Jetzt buchen"
 * 
 * Usage:
 * ```tsx
 * const ctaText = useCTAButtonText();
 * <Button>{ctaText}</Button>
 * ```
 */
export function useCTAButtonText(): string {
  const variant = useFeatureFlag('cta_button_text', 'jetzt_kaufen');

  switch (variant) {
    case 'jetzt_kaufen':
      return 'Jetzt kaufen';
    case 'gig_bestellen':
      return 'Gig bestellen';
    case 'jetzt_buchen':
      return 'Jetzt buchen';
    default:
      return 'Jetzt kaufen';
  }
}

/**
 * Hook: Get pricing format variant
 * 
 * A/B-Test: "€149" | "€149,00" | "Nur €149"
 * 
 * Usage:
 * ```tsx
 * const formatPrice = usePricingFormat();
 * <span>{formatPrice(149)}</span>
 * ```
 */
export function usePricingFormat(): (price: number) => string {
  const variant = useFeatureFlag('pricing_format', 'standard');

  return (price: number) => {
    switch (variant) {
      case 'standard':
        return `€${price}`;
      case 'with_cents':
        return `€${price.toFixed(2)}`;
      case 'with_prefix':
        return `Nur €${price}`;
      default:
        return `€${price}`;
    }
  };
}

/**
 * Hook: Get checkout flow variant
 * 
 * A/B-Test: "three_step" | "one_page"
 * 
 * Usage:
 * ```tsx
 * const checkoutFlow = useCheckoutFlow();
 * {checkoutFlow === 'one_page' ? <OnePageCheckout /> : <ThreeStepCheckout />}
 * ```
 */
export function useCheckoutFlow(): 'three_step' | 'one_page' {
  const variant = useFeatureFlag('checkout_flow', 'three_step');
  return variant === 'one_page' ? 'one_page' : 'three_step';
}

/**
 * Hook: Get trust badge variant
 * 
 * A/B-Test: "Geld-zurück-Garantie" | "DSGVO-konform" | "Verifizierter Seller"
 * 
 * Usage:
 * ```tsx
 * const trustBadge = useTrustBadge();
 * <Badge>{trustBadge}</Badge>
 * ```
 */
export function useTrustBadge(): string {
  const variant = useFeatureFlag('trust_badge', 'geld_zurueck');

  switch (variant) {
    case 'geld_zurueck':
      return 'Geld-zurück-Garantie';
    case 'dsgvo_konform':
      return 'DSGVO-konform';
    case 'verifiziert':
      return 'Verifizierter Seller';
    default:
      return 'Geld-zurück-Garantie';
  }
}

/**
 * Hook: Check if video calls are enabled
 * 
 * Feature-Rollout: Gradual rollout (0% → 10% → 50% → 100%)
 * 
 * Usage:
 * ```tsx
 * const videoCallsEnabled = useVideoCallsEnabled();
 * {videoCallsEnabled && <VideoCallButton />}
 * ```
 */
export function useVideoCallsEnabled(): boolean {
  const enabled = useFeatureFlag('video_calls_enabled', false);
  return enabled === true;
}

/**
 * Hook: Check if AI matching is enabled
 * 
 * Feature-Rollout: Gradual rollout
 * 
 * Usage:
 * ```tsx
 * const aiMatchingEnabled = useAIMatchingEnabled();
 * {aiMatchingEnabled && <AIRecommendations />}
 * ```
 */
export function useAIMatchingEnabled(): boolean {
  const enabled = useFeatureFlag('ai_matching_enabled', false);
  return enabled === true;
}

/**
 * Hook: Check if premium features are enabled
 * 
 * Feature-Gate: Only for premium users
 * 
 * Usage:
 * ```tsx
 * const premiumFeaturesEnabled = usePremiumFeaturesEnabled();
 * {premiumFeaturesEnabled && <PremiumDashboard />}
 * ```
 */
export function usePremiumFeaturesEnabled(): boolean {
  const enabled = useFeatureFlag('premium_features', false);
  return enabled === true;
}
