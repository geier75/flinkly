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
    // Initialize PostHog (only if API key is set)
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        autocapture: false, // Disable automatic event capture (we'll track manually)
        capture_pageview: false, // Disable automatic pageview tracking
        disable_session_recording: true, // Disable session recording by default
      });

      console.log('[PostHog] Initialized');
    } else {
      console.warn('[PostHog] Not configured - set VITE_POSTHOG_API_KEY in environment');
    }

    return () => {
      // Cleanup on unmount
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
