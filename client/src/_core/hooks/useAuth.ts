import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);
  const initializedRef = useRef(false);

  // TRPC queries - always called unconditionally
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  // Listen to Supabase auth state changes - after all hooks
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setSupabaseLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSupabaseUser(session?.user ?? null);
        
        // Sync with backend on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await fetch("/api/auth/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
              }),
            });
            // Refresh TRPC user data
            utils.auth.me.invalidate();
          } catch (e) {
            console.error("[Auth] Failed to sync user:", e);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          utils.auth.me.setData(undefined, null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [utils]);

  const logout = useCallback(async () => {
    try {
      // Sign out from Supabase first
      await supabase.auth.signOut();
      
      // Then sign out from backend
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      // Still sign out from Supabase even if backend fails
      await supabase.auth.signOut();
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      setSupabaseUser(null);
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      supabaseUser,
      loading: supabaseLoading || meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data) || Boolean(supabaseUser),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    supabaseUser,
    supabaseLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (supabaseLoading || meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user || supabaseUser) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    if (window.location.pathname === "/login") return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    supabaseLoading,
    state.user,
    supabaseUser,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
