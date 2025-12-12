// @ts-nocheck
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { favoritesApi, type Favorite } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import {
  Heart,
  HeartOff,
  Star,
  ShoppingCart,
  Eye,
  Grid,
  List,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Gift,
} from "lucide-react";

/**
 * FavoritesNexus - Immersive Favorites View (Favoriten)
 * 
 * Visual collection of saved items
 * Emotional connection through animations
 */
export default function FavoritesNexus() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "price" | "rating">("recent");
  const queryClient = useQueryClient();

  const { data: favoritesData, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
    enabled: isAuthenticated,
  });
  const favorites = favoritesData?.favorites || [];

  const removeFavoriteMutation = useMutation({
    mutationFn: (gigId: number) => favoritesApi.remove(gigId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const sortedFavorites = useMemo(() => {
    if (!favorites) return [];
    return [...favorites].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.gig?.startingPrice || 0) - (b.gig?.startingPrice || 0);
        case "rating":
          return (b.gig?.averageRating || 0) - (a.gig?.averageRating || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [favorites, sortBy]);

  const handleRemoveFavorite = (gigId: number) => {
    removeFavoriteMutation.mutate({ gigId });
  };

  // Calculate stats
  const avgPrice = sortedFavorites.length > 0 
    ? sortedFavorites.reduce((sum, f) => sum + (f.gig?.startingPrice || 0), 0) / sortedFavorites.length 
    : 0;
  const avgRating = sortedFavorites.length > 0
    ? sortedFavorites.reduce((sum, f) => sum + (f.gig?.averageRating || 0), 0) / sortedFavorites.length
    : 0;

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="favorites">
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 mb-4"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rose-300">Schatz-Sammlung</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Favoriten</h1>
            <p className="text-slate-400">Deine gespeicherten Schätze an einem Ort</p>
          </motion.div>

          {/* Stats Orbs */}
          <div className="flex flex-wrap justify-center gap-6">
            <DataOrb value={favorites?.length || 0} label="Favoriten" color="rose" size="lg" />
            <DataOrb value={`€${avgPrice.toFixed(0)}`} label="Ø Preis" color="cyan" size="md" />
            <DataOrb value={avgRating.toFixed(1)} label="Ø Bewertung" color="amber" size="md" />
          </div>

          {/* Controls */}
          <HolographicCard glowColor="rose" intensity="low">
            <div className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Sort */}
                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                  {[
                    { id: "recent", label: "Neueste", icon: Clock },
                    { id: "price", label: "Preis", icon: TrendingUp },
                    { id: "rating", label: "Bewertung", icon: Star },
                  ].map((sort) => (
                    <motion.button
                      key={sort.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy(sort.id as typeof sortBy)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${sortBy === sort.id
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <sort.icon className="w-4 h-4" />
                      {sort.label}
                    </motion.button>
                  ))}
                </div>

                {/* View Mode */}
                <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Favorites Grid/List */}
          <AnimatePresence mode="popLayout">
            {sortedFavorites.length > 0 ? (
              <motion.div
                layout
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }
              >
                {sortedFavorites.map((fav, index) => {
                  const gig = fav.gig;
                  if (!gig) return null;

                  return (
                    <HolographicCard
                      key={fav.id}
                      glowColor="rose"
                      intensity="low"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group ${viewMode === "list" ? "flex" : ""}`}
                      >
                        {/* Image */}
                        <div className={`
                          relative overflow-hidden
                          ${viewMode === "grid" ? "aspect-video rounded-t-xl" : "w-48 h-32 flex-shrink-0 rounded-l-xl"}
                        `}>
                          {gig.images?.[0] ? (
                            <img
                              src={gig.images[0]}
                              alt={gig.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-rose-400" />
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Quick Actions */}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveFavorite(gig.id);
                              }}
                              className="p-2 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            >
                              <HeartOff className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {/* Heart Badge */}
                          <div className="absolute top-2 left-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="p-2 rounded-full bg-rose-500/30 backdrop-blur-sm border border-rose-500/50"
                            >
                              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                          <div>
                            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-rose-400 transition-colors">
                              {gig.title}
                            </h3>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs text-amber-400 font-medium">
                                  {gig.averageRating?.toFixed(1) || "Neu"}
                                </span>
                              </div>
                              <span className="text-slate-500 text-xs">
                                ({gig.reviewCount || 0})
                              </span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <div>
                              <p className="text-xs text-slate-500">Ab</p>
                              <p className="text-xl font-bold text-white">
                                €{gig.startingPrice?.toFixed(2)}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/gig/${gig.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/50 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                              </Link>
                              <Link href={`/checkout/${gig.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(244, 63, 94, 0.5)" }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </motion.button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </HolographicCard>
                  );
                })}
              </motion.div>
            ) : (
              <HolographicCard glowColor="rose" intensity="medium">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      boxShadow: ["0 0 20px rgba(244, 63, 94, 0.2)", "0 0 40px rgba(244, 63, 94, 0.4)", "0 0 20px rgba(244, 63, 94, 0.2)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-28 h-28 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6 border border-rose-500/30"
                  >
                    <Heart className="w-14 h-14 text-rose-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Noch keine Favoriten</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Entdecke tolle Services und speichere sie hier, um sie später wiederzufinden.
                  </p>
                  <Link href="/marketplace">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(244, 63, 94, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30"
                    >
                      <Sparkles className="w-5 h-5" />
                      Marketplace entdecken
                      <Zap className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              </HolographicCard>
            )}
          </AnimatePresence>
        </div>
      </CommandCenter>
    </>
  );
}
