import { getLoginUrl } from "@/const";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// User type from Supabase
interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  role: 'user' | 'admin';
  avatarUrl: string | null;
  // Extended profile fields (may be undefined until loaded from DB)
  bio?: string | null;
  country?: string | null;
  createdAt?: string | null;
  // Commercial seller fields
  isCommercial?: boolean;
  companyName?: string | null;
  companyAddress?: string | null;
  taxId?: string | null;
  tradeRegister?: string | null;
  phone?: string | null;
  // Seller stats fields
  sellerLevel?: 'new' | 'rising' | 'level_one' | 'top_rated' | null;
  completedOrders?: number;
  averageRating?: number | null;
  responseTimeHours?: number;
  onTimeDeliveryRate?: number;
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initializedRef = useRef(false);

  // Listen to Supabase auth state changes
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Sync session with backend to set session cookie
    const syncSession = async (user: any) => {
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split("@")[0],
          }),
        });
      } catch (e) {
        console.error('[Auth] Session sync failed:', e);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || null,
          role: 'user',
          avatarUrl: session.user.user_metadata?.avatar_url || null,
        });
        // Sync with backend to set session cookie
        await syncSession(session.user);
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || null,
            role: 'user',
            avatarUrl: session.user.user_metadata?.avatar_url || null,
          });
          // Sync with backend on auth state change
          await syncSession(session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Logout failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setSupabaseUser(session.user);
      setUser({
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || null,
        role: 'user',
        avatarUrl: session.user.user_metadata?.avatar_url || null,
      });
    }
  }, []);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(user)
    );
    return {
      user,
      supabaseUser,
      loading,
      error,
      isAuthenticated: Boolean(user) || Boolean(supabaseUser),
    };
  }, [user, supabaseUser, loading, error]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (state.user || supabaseUser) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    if (window.location.pathname === "/login") return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    loading,
    state.user,
    supabaseUser,
  ]);

  return {
    ...state,
    refresh,
    logout,
  };
}
