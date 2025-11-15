/**
 * TestimonialsSkeleton Component
 * 
 * Skeleton-Screen für Testimonials/Value-Cards während des Ladens
 * Verbessert Perceived Performance durch sofortiges visuelles Feedback
 */

export default function TestimonialsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="relative bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.3)] animate-pulse"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-slate-800/50 animate-pulse" />
          
          {/* Content Placeholder */}
          <div className="p-8 space-y-4">
            {/* Title Placeholder */}
            <div className="h-7 bg-slate-700/50 rounded-lg w-2/3 animate-pulse" />
            
            {/* Badge Placeholder */}
            <div className="inline-block h-8 bg-slate-700/40 rounded-full w-1/2 animate-pulse" />
            
            {/* Text Lines Placeholder */}
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-slate-700/40 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-700/40 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-700/40 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
