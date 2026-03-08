/**
 * PostHog-Context für Frontend-Analytics
 * 
 * Initialisiert PostHog-JS und stellt Analytics-Functions bereit.
 */

import { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';

interface PostHogContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (path: string) => void;
  identifyUser: (userId: string, properties?: Record<string, any>) => void;
  getFeatureFlag: (flagKey: string) => boolean | string | undefined;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

interface PostHogProviderProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    // SECURITY: Only initialize PostHog AFTER user consent (GDPR Art. 7)
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      // Check if user has given consent
      const savedPrefs = localStorage.getItem("flinkly_cookie_preferences");
      let hasConsent = false;
      
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          hasConsent = prefs.analytics === true;
        } catch (e) {
          console.error('[PostHog] Failed to parse cookie preferences', e);
        }
      }

      // Only initialize if consent is given
      if (hasConsent) {
        posthog.init(apiKey, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          disable_session_recording: true,
          opt_out_capturing_by_default: false, // User has opted in
        });
        console.log('[PostHog] Initialized with user consent');
      } else {
        // Initialize in opt-out mode (no tracking until consent)
        posthog.init(apiKey, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          disable_session_recording: true,
          opt_out_capturing_by_default: true, // Wait for consent
        });
        console.log('[PostHog] Initialized in opt-out mode (waiting for consent)');
      }
    } else {
      console.warn('[PostHog] Not configured - set VITE_POSTHOG_API_KEY in environment');
    }

    return () => {
      if (apiKey) {
        posthog.reset();
      }
    };
  }, []);

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (!import.meta.env.VITE_POSTHOG_API_KEY) return;
    posthog.capture(event, properties);
  };

  const trackPageView = (path: string) => {
    if (!import.meta.env.VITE_POSTHOG_API_KEY) return;
    posthog.capture('$pageview', {
      $current_url: path,
    });
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (!import.meta.env.VITE_POSTHOG_API_KEY) return;
    posthog.identify(userId, properties);
  };

  const getFeatureFlag = (flagKey: string): boolean | string | undefined => {
    if (!import.meta.env.VITE_POSTHOG_API_KEY) return undefined;
    return posthog.getFeatureFlag(flagKey);
  };

  const value: PostHogContextType = {
    trackEvent,
    trackPageView,
    identifyUser,
    getFeatureFlag,
  };

  return (
    <PostHogContext.Provider value={value}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog(): PostHogContextType {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within PostHogProvider');
  }
  return context;
}
