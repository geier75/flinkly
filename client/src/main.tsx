import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { initSentry } from "@/lib/sentry";
import { migrateAuthTokenFromLocalStorage } from "@/lib/supabase";
import { initConsentFromCookie } from "@/components/CookieConsent";
import App from "./App";
import "./index.css";
import React from "react";

// Error Boundary to catch React DOM errors (often caused by browser extensions)
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Etwas ist schiefgelaufen</h2>
          <p style={{ color: '#666' }}>
            {this.state.error?.message || 'Unbekannter Fehler'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: 20, 
              padding: '10px 20px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Seite neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * SECURITY BOOT SEQUENCE
 * Order is critical - execute before React renders
 */

// 1. Initialize Sentry Error Monitoring
initSentry();

// 2. Migrate auth tokens from localStorage to sessionStorage (one-time cleanup)
migrateAuthTokenFromLocalStorage();

// 3. Initialize analytics only if user has previously given consent
initConsentFromCookie();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>
);
