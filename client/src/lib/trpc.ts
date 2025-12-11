/**
 * STUB: tRPC wurde durch Supabase Edge Functions ersetzt.
 * Diese Datei existiert nur für Abwärtskompatibilität während der Migration.
 * Alle Calls geben leere Daten zurück oder sind no-ops.
 */

// Stub query that returns empty data
const createStubQuery = () => ({
  useQuery: (_input?: any, _opts?: any) => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => Promise.resolve({ data: undefined }),
  }),
});

// Stub mutation that does nothing
const createStubMutation = () => ({
  useMutation: (_opts?: any) => ({
    mutate: (_input?: any) => {},
    mutateAsync: (_input?: any) => Promise.resolve({}),
    isPending: false,
    isLoading: false,
    isError: false,
    error: null,
    reset: () => {},
  }),
});

// Stub infinite query
const createStubInfiniteQuery = () => ({
  useInfiniteQuery: (_input?: any, _opts?: any) => ({
    data: { pages: [], pageParams: [] },
    isLoading: false,
    isError: false,
    error: null,
    hasNextPage: false,
    fetchNextPage: () => Promise.resolve({ data: { pages: [], pageParams: [] } }),
    isFetchingNextPage: false,
  }),
});

// Create stub trpc object with all commonly used paths
export const trpc = {
  useUtils: () => ({
    gigs: { list: { invalidate: () => {} } },
    favorites: { list: { invalidate: () => {} } },
    orders: { list: { invalidate: () => {} } },
    user: { me: { invalidate: () => {} } },
  }),
  
  // Gigs
  gigs: {
    list: createStubQuery(),
    getById: createStubQuery(),
    create: createStubMutation(),
    update: createStubMutation(),
    delete: createStubMutation(),
    search: createStubQuery(),
  },
  
  // Auth / User
  user: {
    me: createStubQuery(),
    update: createStubMutation(),
    getProfile: createStubQuery(),
    updateProfile: createStubMutation(),
    requestDataExport: createStubMutation(),
    deleteAccount: createStubMutation(),
  },
  
  // Favorites
  favorites: {
    list: createStubQuery(),
    add: createStubMutation(),
    remove: createStubMutation(),
  },
  
  // Orders
  orders: {
    list: createStubQuery(),
    getById: createStubQuery(),
    create: createStubMutation(),
    updateStatus: createStubMutation(),
  },
  
  // Reviews
  reviews: {
    getGigReviews: createStubQuery(),
    create: createStubMutation(),
  },
  
  // Messages
  messages: {
    list: createStubQuery(),
    getConversation: createStubQuery(),
    send: createStubMutation(),
    markAsRead: createStubMutation(),
  },
  conversations: {
    list: createStubQuery(),
    getOrCreate: createStubMutation(),
  },
  
  // Gig Packages & Extras
  gigPackages: {
    list: createStubQuery(),
    create: createStubMutation(),
    update: createStubMutation(),
    delete: createStubMutation(),
  },
  gigExtras: {
    list: createStubQuery(),
    create: createStubMutation(),
    update: createStubMutation(),
    delete: createStubMutation(),
  },
  
  // Seller
  seller: {
    dashboard: createStubQuery(),
    earnings: createStubQuery(),
    analytics: createStubQuery(),
    verify: createStubMutation(),
  },
  
  // Admin
  admin: {
    users: createStubQuery(),
    gigs: createStubQuery(),
    orders: createStubQuery(),
    stats: createStubQuery(),
    updateUser: createStubMutation(),
    deleteUser: createStubMutation(),
  },
  
  // Similar Gigs
  similarGigs: {
    byGigId: createStubQuery(),
  },
  
  // Checkout / Payments
  checkout: {
    createSession: createStubMutation(),
    verifyPayment: createStubQuery(),
  },
  payments: {
    createIntent: createStubMutation(),
    confirm: createStubMutation(),
  },
  
  // Privacy / GDPR
  privacy: {
    getConsent: createStubQuery(),
    updateConsent: createStubMutation(),
    exportData: createStubMutation(),
    deleteData: createStubMutation(),
  },
  
  // Verification
  verification: {
    status: createStubQuery(),
    submit: createStubMutation(),
  },
  
  // Analytics
  analytics: {
    platform: createStubQuery(),
    seller: createStubQuery(),
  },
};
