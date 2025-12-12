// @ts-nocheck
import { gigsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function MarketplaceSimple() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gigs', 'simple'],
    queryFn: () => gigsApi.list({ limit: 100 }),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;
  if (!data) return <div className="p-8 text-white">No data</div>;

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Marketplace (Simple Test)</h1>
      <p className="text-white mb-4">Found {data.gigs.length} gigs</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gigs.map((gig: any) => (
          <div key={gig.id} className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-white font-bold">{gig.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{gig.description}</p>
            <p className="text-green-400 mt-2">{(gig.price / 100).toFixed(2)}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
