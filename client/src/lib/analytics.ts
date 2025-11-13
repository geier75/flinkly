/**
 * Analytics Helper Functions
 * 
 * Provides type-safe, versioned event tracking for PostHog
 * All events follow schema version 1 (v:1)
 * 
 * KPI Funnel:
 * view_marketplace → view_gig → start_checkout → checkout_step → purchase_succeeded
 */

type BaseEvent = { v: 1 };

/**
 * Analytics Event Helpers
 * 
 * Usage:
 * ```ts
 * import { A } from "@/lib/analytics";
 * A.viewMarketplace({ v: 1, filters: { category: "design" } });
 * ```
 */
export const A = {
  // Marketplace Events
  viewMarketplace: (p: BaseEvent & { filters?: Record<string, unknown> }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("view_marketplace", p);
    }
  },

  // Gig Events
  viewGig: (p: BaseEvent & { gigId: number; category?: string }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("view_gig", p);
    }
  },

  // Checkout Events
  startCheckout: (p: BaseEvent & { gigId: number; price: number }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("start_checkout", p);
    }
  },

  checkoutStep: (p: BaseEvent & { step: 1 | 2 | 3; valid: boolean; gigId?: number }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("checkout_step", p);
    }
  },

  // Purchase Events
  purchaseSucceeded: (p: BaseEvent & { orderId: number; amount: number; method: string }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("purchase_succeeded", p);
    }
  },

  purchaseFailed: (p: BaseEvent & { gigId: number; error: string }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("purchase_failed", p);
    }
  },

  // Similar Gigs Events
  similarGigsRequested: (p: BaseEvent & { gigId: number; k: number }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("similar_gigs.requested", p);
    }
  },

  similarGigsRendered: (p: BaseEvent & { gigId: number; count: number }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("similar_gigs.rendered", p);
    }
  },

  // Exit Intent Events
  exitIntentTriggered: (p: BaseEvent & { inCheckout: boolean }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("exit_intent.triggered", p);
    }
  },

  exitIntentShown: (p: BaseEvent & { variant: "control" | "discount" }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("exit_intent.shown", p);
    }
  },

  exitIntentAccepted: (p: BaseEvent & { variant: "control" | "discount"; hasCode: boolean }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("exit_intent.accepted", p);
    }
  },

  exitIntentDismissed: (p: BaseEvent & { variant: "control" | "discount" }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("exit_intent.dismissed", p);
    }
  },

  // User Events
  userSignup: (p: BaseEvent & { method: string }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("user_signup", p);
    }
  },

  userLogin: (p: BaseEvent & { method: string }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("user_login", p);
    }
  },

  // Search Events
  search: (p: BaseEvent & { query: string; filters?: Record<string, unknown> }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("search", p);
    }
  },

  // Filter Events
  filterApplied: (p: BaseEvent & { filterType: string; value: unknown }) => {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("filter_applied", p);
    }
  },
};

/**
 * Consent Helper
 * 
 * Reads consent from localStorage (set by DSGVO consent banner)
 * Returns { analytics: boolean, marketing: boolean }
 */
export function getConsent(): { analytics: boolean; marketing: boolean } {
  if (typeof window === "undefined") {
    return { analytics: false, marketing: false };
  }

  try {
    const consent = localStorage.getItem("flinkly_consent");
    if (!consent) return { analytics: false, marketing: false };

    const parsed = JSON.parse(consent);
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return { analytics: false, marketing: false };
  }
}

/**
 * Update consent and reinitialize PostHog if needed
 */
export function updateConsent(consent: { analytics: boolean; marketing: boolean }) {
  if (typeof window === "undefined") return;

  localStorage.setItem("flinkly_consent", JSON.stringify(consent));

  // Reinitialize PostHog based on consent
  if ((window as any).posthog) {
    if (consent.analytics) {
      (window as any).posthog.opt_in_capturing();
    } else {
      (window as any).posthog.opt_out_capturing();
    }
  }
}
