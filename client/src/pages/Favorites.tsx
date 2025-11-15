import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
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

  const { data: favoritesList, isLoading } = trpc.favorites.list.useQuery();
  const utils = trpc.useUtils();

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.list.invalidate();
      toast.success("Aus Favoriten entfernt", {
        description: "Das Gig wurde erfolgreich aus deinen Favoriten entfernt.",
      });
    },
    onError: (error) => {
      toast.error("Fehler beim Entfernen", {
        description: error.message,
      });
    },
  });

  const handleRemoveFavorite = (e: React.MouseEvent, gigId: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteMutation.mutate({ gigId });
  };

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <motion.div
          className="container mx-auto px-4 py-20 text-center max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cyber-glass-card border-2 border-accent/40 p-8 shadow-[0_0_60px_oklch(0.70_0.20_35_/_0.6)]">
            <Heart className="h-16 w-16 text-accent mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold cyber-chrome-text mb-3">Authentifizierung erforderlich</h1>
            <p className="text-slate-300 mb-8 text-lg font-medium">Du musst angemeldet sein, um deine Favoriten zu sehen.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="cyber-neon-button text-white font-bold px-10 py-4 text-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <MetaTags 
        title="Meine Favoriten | Flinkly"
        description="Verwalte deine gespeicherten Gigs und finde schnell die perfekte Dienstleistung."
        type="website"
      />

      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Header */}
      <div className="relative z-10 cyber-neon-border bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-extrabold mb-3 tracking-tight cyber-chrome-text flex items-center gap-4">
              <Heart className="h-12 w-12 text-accent animate-pulse fill-accent" />
              MEINE <span className="cyber-neon-orange">FAVORITEN</span>
            </h1>
            <p className="text-slate-300 text-xl font-light tracking-wide">
              {sortedFavorites.length} gespeicherte Gigs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-slate-700 bg-slate-900/40 backdrop-blur-sm text-white">
                <Filter className="h-4 w-4 mr-2" />
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
            <SelectTrigger className="w-full md:w-[200px] border-slate-700 bg-slate-900/40 backdrop-blur-sm text-white">
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
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-96" />
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
            <div className="inline-flex items-center justify-center w-32 h-32 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-full mb-6">
              <Heart className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Keine Favoriten gespeichert</h3>
            <p className="text-slate-400 mb-8 text-lg">
              Entdecke spannende Gigs und speichere sie mit einem Klick auf das Herz-Icon
            </p>
            <Button
              onClick={() => setLocation("/marketplace")}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg shadow-accent/30 hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
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
                  key={favorite.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link href={`/gig/${gig.id}`}>
                    <Card className="group relative bg-slate-900/40 border-2 border-slate-700/50 hover:border-accent/80 backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(255,107,53,0.4),0_0_100px_rgba(255,107,53,0.2)]">
                      {/* Gradient Border Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={gig.imageUrl || "/placeholder.jpg"}
                            alt={gig.title}
                            className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                          
                          {/* Category Badge */}
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-accent to-primary text-white border-0 backdrop-blur-sm shadow-lg shadow-accent/30">
                            {gig.category}
                          </Badge>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => handleRemoveFavorite(e, gig.id)}
                            disabled={removeFavoriteMutation.isPending}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl border-2 border-red-500/50 rounded-full hover:border-red-500 hover:bg-red-500/20 transition-all duration-300 hover:scale-110 z-10 disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5 text-red-400" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                            {gig.title}
                          </h3>
                          
                          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                            {gig.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-success fill-success" />
                              <span className="text-white font-bold">5.0</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{gig.deliveryDays}d</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>Neu</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                            <span className="text-slate-400 text-sm">Ab</span>
                            <div className="text-right">
                              <span className="text-3xl font-black text-white group-hover:text-success transition-colors duration-300">
                                {gig.price}€
                              </span>
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
