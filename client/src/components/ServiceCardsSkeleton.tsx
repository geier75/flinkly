/**
 * ServiceCardsSkeleton Component
 * 
 * Skeleton-Screen für Service-Cards während des Ladens
 * Verbessert Perceived Performance durch sofortiges visuelles Feedback
 */

export default function ServiceCardsSkeleton() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Skeleton Cards Container */}
      <div className="flex gap-8 items-center justify-center">
        {/* Left Card (smaller, faded) */}
        <div className="w-[240px] h-[340px] bg-slate-800/40 border-2 border-slate-700/30 rounded-2xl backdrop-blur-xl animate-pulse opacity-40 scale-90" />
        
        {/* Center Card (main, prominent) */}
        <div className="w-[320px] h-[400px] bg-slate-800/60 border-2 border-slate-600/50 rounded-2xl backdrop-blur-xl animate-pulse relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Card Content Skeleton */}
          <div className="p-8 space-y-6">
            {/* Image Placeholder */}
            <div className="w-full h-32 bg-slate-700/50 rounded-xl animate-pulse" />
            
            {/* Title Placeholder */}
            <div className="h-8 bg-slate-700/50 rounded-lg w-3/4 animate-pulse" />
            
            {/* List Items Placeholder */}
            <div className="space-y-3">
              <div className="h-4 bg-slate-700/40 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-700/40 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-700/40 rounded w-4/5 animate-pulse" />
            </div>
            
            {/* Price/Info Placeholder */}
            <div className="flex gap-4 pt-4">
              <div className="h-6 bg-slate-700/40 rounded w-1/3 animate-pulse" />
              <div className="h-6 bg-slate-700/40 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Right Card (smaller, faded) */}
        <div className="w-[240px] h-[340px] bg-slate-800/40 border-2 border-slate-700/30 rounded-2xl backdrop-blur-xl animate-pulse opacity-40 scale-90" />
      </div>
      
      {/* Navigation Arrows Skeleton */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <div className="w-12 h-12 bg-slate-800/40 border border-slate-700/30 rounded-full animate-pulse" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <div className="w-12 h-12 bg-slate-800/40 border border-slate-700/30 rounded-full animate-pulse" />
      </div>
      
      {/* Dots Indicator Skeleton */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-slate-700/40 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}
