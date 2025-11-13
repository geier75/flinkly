/**
 * Skeleton UI Components
 * 
 * Best Practices 2025 (H1: System-Status sichtbar machen):
 * - Zeigt Struktur der Seite während Loading
 * - Reduziert wahrgenommene Ladezeit
 * - Verhindert Layout-Shifts (CLS)
 * - Accessibility (aria-busy, aria-label)
 */

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

/**
 * Generic Skeleton Component
 */
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      aria-busy="true"
      aria-label="Lädt..."
      {...props}
    />
  );
}

/**
 * Gig Card Skeleton (für Marketplace)
 */
export function GigCardSkeleton() {
  return (
    <Card className="h-full border-2 border-slate-200 rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardHeader className="pb-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="pb-4 space-y-3">
        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Tags Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Seller Skeleton */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-12" />
      </CardFooter>
    </Card>
  );
}

/**
 * Checkout Page Skeleton
 */
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Skeleton */}
        <Skeleton className="h-10 w-64 mb-8" />

        {/* Progress Steps Skeleton */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Profile Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <GigCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Form Skeleton
 */
export function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
