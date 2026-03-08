import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('[Flinkly] Supabase environment variables are not configured.');
}

/**
 * SECURITY: Secure storage using sessionStorage instead of localStorage
 * 
 * Rationale:
 * - localStorage persists across browser sessions and tabs (XSS risk)
 * - sessionStorage is cleared on tab close (limited XSS exposure)
 * - PKCE flow provides additional security vs implicit flow
 * 
 * Compliance: OWASP A07:2021 (Auth Failures), ISO 27001 A.9.4
 */
const secureStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      console.warn('[Flinkly] sessionStorage not available – session will not persist.');
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore errors on cleanup
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorage,           // ✅ sessionStorage instead of localStorage
    flowType: 'pkce',                  // ✅ PKCE instead of Implicit Flow (SotA 2026)
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Migration helper: Move existing auth tokens from localStorage to sessionStorage
 * 
 * IMPORTANT: Call this once at app startup (in main.tsx)
 * 
 * @returns {void}
 */
export function migrateAuthTokenFromLocalStorage(): void {
  const supabaseProjectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
  if (!supabaseProjectRef) return;

  const lsKey = `sb-${supabaseProjectRef}-auth-token`;
  const existingToken = localStorage.getItem(lsKey);

  if (existingToken) {
    try {
      // Migrate to sessionStorage
      sessionStorage.setItem(lsKey, existingToken);
      // Remove from localStorage (security cleanup)
      localStorage.removeItem(lsKey);
      console.info('[Flinkly] Auth token migrated from localStorage to sessionStorage.');
    } catch (e) {
      console.error('[Flinkly] Failed to migrate auth token:', e);
    }
  }
}
