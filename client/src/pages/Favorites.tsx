// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { favoritesApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetaTags from "@/components/MetaTags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Star, Clock, TrendingUp, Trash2, ShoppingBag, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Favorites() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "delivery">("date");
  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
    enabled: isAuthenticated,
  });
  const favoritesList = favoritesData?.favorites || [];

  const removeFavoriteMutation = useMutation({
    mutationFn: (gigId: number) => favoritesApi.remove(gigId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success("Aus Favoriten entfernt", {
        description: "Das Gig wurde erfolgreich aus deinen Favoriten entfernt.",
      });
    },
    onError: (error: any) => {
      toast.error("Fehler beim Entfernen", {
        description: error.message,
      });
    },
  });

  const handleRemoveFavorite = (e: React.MouseEvent, gigId: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteMutation.mutate(gigId);
  };

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <motion.div
          className="container mx-auto px-4 py-20 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Authentifizierung erforderlich</h1>
            <p className="text-slate-500 mb-8">Du musst angemeldet sein, um deine Favoriten zu sehen.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-rose-500/20"
            >
              Zur Startseite
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter favorites
  const filteredFavorites = favoritesList?.filter((fav) => {
    if (!fav.gig) return false;
    const matchesCategory = category === "all" || fav.gig.category === category;
    return matchesCategory;
  }) || [];

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (!a.gig || !b.gig) return 0;
    switch (sortBy) {
      case "price":
        return a.gig.price - b.gig.price;
      case "delivery":
        return a.gig.deliveryDays - b.gig.deliveryDays;
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const categories = [
    "Design & Kreation",
    "Development",
    "Marketing",
    "Content & Text",
    "Business",
    "Technologie",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <MetaTags 
        title="Meine Favoriten | Flinkly"
        description="Verwalte deine gespeicherten Gigs und finde schnell die perfekte Dienstleistung."
        type="website"
      />

      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <div className="p-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-2xl shadow-rose-500/30">
              <Heart className="h-10 w-10 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Meine Favoriten</h1>
              <p className="text-slate-400 mt-1">
                {sortedFavorites.length} gespeicherte Gigs
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg shadow-slate-200/50"
        >
          <div className="flex-1">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-slate-200 bg-slate-50 text-slate-800 rounded-xl">
                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[200px] border-slate-200 bg-slate-50 text-slate-800 rounded-xl">
              <TrendingUp className="h-4 w-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Zuletzt hinzugefügt</SelectItem>
              <SelectItem value="price">Preis</SelectItem>
              <SelectItem value="delivery">Lieferzeit</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Favorites Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-3xl shadow-lg h-96" />
              </div>
            ))}
          </div>
        ) : sortedFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-rose-50 rounded-3xl mb-6">
              <Heart className="h-16 w-16 text-rose-300" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Keine Favoriten gespeichert</h3>
            <p className="text-slate-500 mb-8 text-lg max-w-md mx-auto">
              Entdecke spannende Gigs und speichere sie mit einem Klick auf das Herz-Icon
            </p>
            <Button
              onClick={() => setLocation("/marketplace")}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/20 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg rounded-xl"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Zum Marketplace
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedFavorites.map((favorite, index) => {
              const gig = favorite.gig;
              if (!gig) return null;

              return (
                <motion.div
                  key={favorite.gigId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link href={`/gig/${gig.id}`}>
                    <Card className="group relative bg-gradient-to-br from-white via-white to-rose-50/30 border border-slate-200/80 hover:border-rose-300 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] rounded-3xl">
                      {/* Luxury Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent z-10 pointer-events-none" />
                      
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={gig.imageUrl || "/placeholder.jpg"}
                            alt={gig.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                          
                          {/* Premium Badge Overlay */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400" />
                          
                          {/* Category Badge */}
                          <Badge className="absolute top-5 left-5 bg-white/95 text-slate-700 border-0 shadow-lg backdrop-blur-sm font-semibold px-3 py-1">
                            {gig.category}
                          </Badge>

                          {/* Favorite Heart */}
                          <div className="absolute bottom-4 left-5">
                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                              <span className="text-xs font-semibold text-slate-700">Favorit</span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => handleRemoveFavorite(e, gig.id)}
                            disabled={removeFavoriteMutation.isPending}
                            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl hover:bg-rose-50 transition-all duration-300 hover:scale-110 z-20 disabled:opacity-50 shadow-lg group/btn"
                          >
                            <Trash2 className="h-5 w-5 text-slate-400 group-hover/btn:text-rose-500 transition-colors" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-gradient-to-b from-white to-slate-50/50">
                          {/* Seller Info */}
                          {gig.seller && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                {gig.seller.name?.charAt(0).toUpperCase() || "S"}
                              </div>
                              <span className="text-sm text-slate-600 font-medium">{gig.seller.name}</span>
                            </div>
                          )}
                          
                          <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                            {gig.title}
                          </h3>
                          
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {gig.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              <span className="text-slate-700 font-bold text-sm">5.0</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-600 text-sm">{gig.deliveryDays}d</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              <span className="text-emerald-600 text-sm font-medium">Neu</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-slate-400 text-sm">Preis ab</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
                                {(gig.price / 100).toFixed(0)}
                              </span>
                              <span className="text-xl font-bold text-rose-500">€</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
