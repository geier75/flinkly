import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton-Loading-State für Marketplace-Gig-Cards
 * 
 * Custom Shimmer-Animation mit Tailwind CSS
 */
export default function GigCardSkeleton() {
  return (
    <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-slate-800/50 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent shimmer" />
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Category Badge Skeleton */}
        <div className="w-20 h-5 bg-slate-800/50 rounded-full animate-pulse" />

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-800/50 rounded animate-pulse w-full" />
          <div className="h-5 bg-slate-800/50 rounded animate-pulse w-3/4" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/50 rounded animate-pulse w-full" />
          <div className="h-4 bg-slate-800/50 rounded animate-pulse w-5/6" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          {/* Rating Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-5 bg-slate-800/50 rounded animate-pulse" />
            <div className="w-16 h-4 bg-slate-800/50 rounded animate-pulse" />
          </div>

          {/* Price Skeleton */}
          <div className="w-16 h-6 bg-slate-800/50 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
