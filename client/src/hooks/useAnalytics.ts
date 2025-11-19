/**
 * Analytics-Hooks für Frontend-Event-Tracking
 * 
 * Provides hooks for tracking button clicks, scroll depth, form interactions, etc.
 */

import { useEffect, useRef, useCallback } from 'react';
import posthog from 'posthog-js';

/**
 * Check if PostHog is configured
 */
function isPostHogConfigured(): boolean {
  return !!import.meta.env.VITE_POSTHOG_API_KEY;
}

/**
 * Track generic event
 */
export function trackEvent(event: string, properties?: Record<string, any>): void {
  if (!isPostHogConfigured()) return;
  posthog.capture(event, properties);
}

/**
 * Hook: Track button clicks
 * 
 * Usage:
 * ```tsx
 * const trackClick = useButtonClick();
 * <Button onClick={() => trackClick('cta_button', { location: 'hero' })}>Click me</Button>
 * ```
 */
export function useButtonClick() {
  return useCallback((buttonName: string, properties?: Record<string, any>) => {
    trackEvent('button_clicked', {
      button_name: buttonName,
      ...properties,
    });
  }, []);
}

/**
 * Hook: Track scroll depth
 * 
 * Automatically tracks when user scrolls to 25%, 50%, 75%, 100% of page.
 * 
 * Usage:
 * ```tsx
 * useScrollDepth('homepage');
 * ```
 */
export function useScrollDepth(pageName: string) {
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = Math.round((scrolled / scrollHeight) * 100);

      // Track milestones: 25%, 50%, 75%, 100%
      const checkpoints = [25, 50, 75, 100];
      checkpoints.forEach(checkpoint => {
        if (percentage >= checkpoint && !milestones.current.has(checkpoint)) {
          milestones.current.add(checkpoint);
          trackEvent('scroll_depth', {
            page: pageName,
            depth: checkpoint,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName]);
}

/**
 * Hook: Track form interactions
 * 
 * Tracks focus, blur, submit, and errors.
 * 
 * Usage:
 * ```tsx
 * const { trackFocus, trackBlur, trackSubmit, trackError } = useFormTracking('contact_form');
 * 
 * <input onFocus={() => trackFocus('email')} onBlur={() => trackBlur('email')} />
 * <form onSubmit={() => trackSubmit({ success: true })}>...</form>
 * ```
 */
export function useFormTracking(formName: string) {
  const trackFocus = useCallback((fieldName: string) => {
    trackEvent('form_field_focused', {
      form_name: formName,
      field_name: fieldName,
    });
  }, [formName]);

  const trackBlur = useCallback((fieldName: string, value?: string) => {
    trackEvent('form_field_blurred', {
      form_name: formName,
      field_name: fieldName,
      has_value: !!value,
    });
  }, [formName]);

  const trackSubmit = useCallback((properties?: Record<string, any>) => {
    trackEvent('form_submitted', {
      form_name: formName,
      ...properties,
    });
  }, [formName]);

  const trackError = useCallback((fieldName: string, errorMessage: string) => {
    trackEvent('form_error', {
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage,
    });
  }, [formName]);

  return {
    trackFocus,
    trackBlur,
    trackSubmit,
    trackError,
  };
}

/**
 * Hook: Track page view
 * 
 * Automatically tracks page view on mount.
 * 
 * Usage:
 * ```tsx
 * usePageView('/marketplace');
 * ```
 */
export function usePageView(path: string) {
  useEffect(() => {
    if (!isPostHogConfigured()) return;
    
    posthog.capture('$pageview', {
      $current_url: path,
    });
  }, [path]);
}

/**
 * Hook: Track CTA clicks (Call-to-Action)
 * 
 * Specialized hook for tracking important conversion buttons.
 * 
 * Usage:
 * ```tsx
 * const trackCTA = useCTAClick();
 * <Button onClick={() => trackCTA('buy_now', { gig_id: 123, price: 149 })}>Buy Now</Button>
 * ```
 */
export function useCTAClick() {
  return useCallback((ctaName: string, properties?: Record<string, any>) => {
    trackEvent('cta_clicked', {
      cta_name: ctaName,
      ...properties,
    });
  }, []);
}

/**
 * Hook: Track navigation clicks
 * 
 * Tracks clicks on navigation links (header, footer, sidebar).
 * 
 * Usage:
 * ```tsx
 * const trackNav = useNavigationClick();
 * <Link onClick={() => trackNav('marketplace', 'header')}>Marketplace</Link>
 * ```
 */
export function useNavigationClick() {
  return useCallback((destination: string, location: string) => {
    trackEvent('navigation_clicked', {
      destination,
      location, // 'header', 'footer', 'sidebar'
    });
  }, []);
}

/**
 * Hook: Track search queries
 * 
 * Usage:
 * ```tsx
 * const trackSearch = useSearchTracking();
 * <input onSubmit={(e) => trackSearch(e.target.value, resultsCount)} />
 * ```
 */
export function useSearchTracking() {
  return useCallback((query: string, resultsCount: number) => {
    trackEvent('search_performed', {
      query,
      results_count: resultsCount,
    });
  }, []);
}

/**
 * Hook: Track filter usage
 * 
 * Usage:
 * ```tsx
 * const trackFilter = useFilterTracking();
 * <Select onChange={(value) => trackFilter('category', value)}>...</Select>
 * ```
 */
export function useFilterTracking() {
  return useCallback((filterName: string, filterValue: string) => {
    trackEvent('filter_applied', {
      filter_name: filterName,
      filter_value: filterValue,
    });
  }, []);
}
