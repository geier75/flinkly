// @ts-nocheck
import { gigsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import GigCard from "@/components/GigCard";
import { Loader2 } from "lucide-react";
import { A } from "@/lib/analytics";
import { useEffect } from "react";

interface SimilarGigsProps {
  gigId: number;
  k?: number;
  excludeSameSeller?: boolean;
}

/**
 * Similar Gigs Component
 * 
 * Displays a grid of similar gigs based on content similarity
 * Uses Content-Based Filtering Algorithm (category, tags, price, delivery, trust)
 */
export function SimilarGigs({ gigId, k = 8, excludeSameSeller = true }: SimilarGigsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['similarGigs', gigId, k, excludeSameSeller],
    queryFn: () => gigsApi.getSimilar(gigId, k, excludeSameSeller),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Track similar gigs rendered
  useEffect(() => {
    if (data && data.length > 0) {
      A.similarGigsRendered({ v: 1, gigId, count: data.length });
    }
  }, [data, gigId]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Keine ähnlichen Gigs gefunden</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((gig: Parameters<typeof GigCard>[0]['gig']) => (
        <GigCard 
          key={gig.id} 
          gig={gig} 
        />
      ))}
    </div>
  );
}
