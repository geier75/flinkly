import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton-Loading-State für GigDetail-Page
 * 
 * Includes:
 * - Hero Section
 * - Sidebar
 * - Reviews Section
 * - Similar Gigs Section
 */
export default function GigDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section Skeleton */}
            <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8">
                {/* Image Skeleton */}
                <div className="w-full h-96 bg-slate-800/50 rounded-lg animate-pulse mb-6" />

                {/* Category Badge Skeleton */}
                <div className="w-24 h-6 bg-slate-800/50 rounded-full animate-pulse mb-4" />

                {/* Title Skeleton */}
                <div className="space-y-3 mb-6">
                  <div className="h-8 bg-slate-800/50 rounded animate-pulse w-full" />
                  <div className="h-8 bg-slate-800/50 rounded animate-pulse w-3/4" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-32 h-6 bg-slate-800/50 rounded animate-pulse" />
                  <div className="w-32 h-6 bg-slate-800/50 rounded animate-pulse" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 bg-slate-800/50 rounded animate-pulse w-full" />
                  <div className="h-5 bg-slate-800/50 rounded animate-pulse w-full" />
                  <div className="h-5 bg-slate-800/50 rounded animate-pulse w-5/6" />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section Skeleton */}
            <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="h-7 bg-slate-800/50 rounded animate-pulse w-48 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-slate-800/50 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section Skeleton */}
            <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="h-7 bg-slate-800/50 rounded animate-pulse w-40 mb-6" />
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-slate-700/50 last:border-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-slate-800/50 rounded-full animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        {/* Name + Rating */}
                        <div className="flex items-center justify-between">
                          <div className="w-32 h-5 bg-slate-800/50 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-slate-800/50 rounded animate-pulse" />
                        </div>
                        {/* Comment */}
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-800/50 rounded animate-pulse w-full" />
                          <div className="h-4 bg-slate-800/50 rounded animate-pulse w-4/5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card Skeleton */}
              <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-6 space-y-4">
                  {/* Package Tabs Skeleton */}
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-10 bg-slate-800/50 rounded animate-pulse" />
                    ))}
                  </div>

                  {/* Price Skeleton */}
                  <div className="h-10 bg-slate-800/50 rounded animate-pulse w-32" />

                  {/* Features Skeleton */}
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-5 bg-slate-800/50 rounded animate-pulse" />
                    ))}
                  </div>

                  {/* CTA Button Skeleton */}
                  <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
                </CardContent>
              </Card>

              {/* Seller Card Skeleton */}
              <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-800/50 rounded animate-pulse w-32" />
                      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-24" />
                    </div>
                  </div>

                  {/* Stats Skeleton */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-slate-800/50 rounded animate-pulse w-24" />
                        <div className="h-4 bg-slate-800/50 rounded animate-pulse w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Gigs Section Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-slate-800/50 rounded animate-pulse w-48 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                <div className="h-48 bg-slate-800/50 animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="w-20 h-5 bg-slate-800/50 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-800/50 rounded animate-pulse w-full" />
                    <div className="h-5 bg-slate-800/50 rounded animate-pulse w-3/4" />
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="w-20 h-5 bg-slate-800/50 rounded animate-pulse" />
                    <div className="w-16 h-6 bg-slate-800/50 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
