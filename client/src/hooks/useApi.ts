/**
 * React Hooks für API-Aufrufe
 * Ersetzt die tRPC-Hooks mit direkten API-Calls
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  gigsApi, 
  authApi, 
  ordersApi, 
  usersApi,
  type Gig,
  type GigWithDetails,
  type GigListParams,
  type GigListResponse,
  type User,
  type Order,
  type PublicUser,
  type ProfileUpdate,
} from '../lib/api';

// Generic hook for data fetching
interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// Generic hook for mutations
interface UseMutationResult<TInput, TOutput> {
  mutate: (input: TInput) => Promise<TOutput>;
  mutateAsync: (input: TInput) => Promise<TOutput>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

function useMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<TOutput>
): UseMutationResult<TInput, TOutput> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (input: TInput): Promise<TOutput> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutator(input);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = mutateAsync;
  const reset = () => setError(null);

  return { mutate, mutateAsync, isLoading, error, reset };
}

// ============ GIGS HOOKS ============

export function useGigsList(params?: GigListParams) {
  return useQuery(
    () => gigsApi.list(params),
    [params?.limit, params?.cursor, params?.category, params?.minPrice, params?.maxPrice, params?.sortBy]
  );
}

export function useGig(id: number | undefined) {
  return useQuery(
    () => id ? gigsApi.get(id) : Promise.resolve(undefined as unknown as GigWithDetails),
    [id]
  );
}

// ============ AUTH HOOKS ============

export function useCurrentUser() {
  return useQuery(() => authApi.me(), []);
}

export function useLogout() {
  return useMutation(() => authApi.logout());
}

// ============ ORDERS HOOKS ============

export function useOrders(role: 'buyer' | 'seller' = 'buyer') {
  return useQuery(() => ordersApi.list(role), [role]);
}

export function useOrder(id: number | undefined) {
  return useQuery(
    () => id ? ordersApi.get(id) : Promise.resolve(undefined as unknown as Order),
    [id]
  );
}

// ============ USERS HOOKS ============

export function usePublicUser(id: number | undefined) {
  return useQuery(
    () => id ? usersApi.get(id) : Promise.resolve(undefined as unknown as PublicUser),
    [id]
  );
}

export function useUpdateProfile() {
  return useMutation((updates: ProfileUpdate) => usersApi.updateProfile(updates));
}

// ============ INFINITE SCROLL HOOK ============

interface UseInfiniteGigsResult {
  gigs: Gig[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useInfiniteGigs(params?: Omit<GigListParams, 'cursor'>): UseInfiniteGigsResult {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGigs = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setCursor(undefined);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    try {
      const result = await gigsApi.list({
        ...params,
        cursor: reset ? undefined : cursor,
      });

      if (reset) {
        setGigs(result.gigs);
      } else {
        setGigs(prev => [...prev, ...result.gigs]);
      }

      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [params?.limit, params?.category, params?.minPrice, params?.maxPrice, params?.sortBy, cursor]);

  useEffect(() => {
    fetchGigs(true);
  }, [params?.limit, params?.category, params?.minPrice, params?.maxPrice, params?.sortBy]);

  const loadMore = useCallback(async () => {
    if (!isFetchingMore && hasMore) {
      await fetchGigs(false);
    }
  }, [fetchGigs, isFetchingMore, hasMore]);

  const refetch = useCallback(async () => {
    await fetchGigs(true);
  }, [fetchGigs]);

  return { gigs, isLoading, isFetchingMore, error, hasMore, loadMore, refetch };
}

// Re-export types
export type { Gig, GigWithDetails, GigListParams, User, Order, PublicUser, ProfileUpdate };
