import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import posthog from "posthog-js";
import { initSentry } from "@/lib/sentry";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Initialize Sentry Error Monitoring
initSentry();

// Initialize PostHog (Consent-Aware)
const initializePostHog = () => {
  // Check if user has given analytics consent
  const cookiePreferences = localStorage.getItem("flinkly_cookie_preferences");
  let analyticsConsent = false;

  if (cookiePreferences) {
    try {
      const prefs = JSON.parse(cookiePreferences);
      analyticsConsent = prefs.analytics === true;
    } catch (e) {
      console.error("Failed to parse cookie preferences", e);
    }
  }

  // PostHog disabled until valid API key is configured
  // To enable: Replace phc_placeholder_key with real API key from PostHog dashboard
  // posthog.init("phc_placeholder_key", {
  //   api_host: "https://eu.i.posthog.com",
  //   person_profiles: "identified_only",
  //   autocapture: false,
  //   capture_pageview: false,
  //   opt_out_capturing_by_default: !analyticsConsent,
  //   loaded: (posthog) => {
  //     if (analyticsConsent) {
  //       posthog.opt_in_capturing();
  //     }
  //   },
  // });

  // PostHog disabled - set to undefined to prevent errors
  window.posthog = undefined;
};

initializePostHog();

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
