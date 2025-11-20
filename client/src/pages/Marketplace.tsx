import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MetaTags from "@/components/MetaTags";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VideoScene } from "@/components/webgl/VideoScene";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Star, Clock, TrendingUp, Sparkles, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { ParticleSystem } from "@/components/3d/ParticleSystem";
import { MagneticButton } from "@/components/3d/MagneticButton";
import { TiltCard } from "@/components/3d/TiltCard";
import GigCardSkeleton from "@/components/GigCardSkeleton";
import GigQuickView from "@/components/GigQuickView";
import { useFilterTracking, useSearchTracking, useNavigationClick } from "@/hooks/useAnalytics";
import { usePricingFormat } from "@/hooks/useFeatureFlags";

export default function Marketplace() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  
  // Analytics
  const trackFilter = useFilterTracking();
  const trackSearch = useSearchTracking();
  const trackNav = useNavigationClick();
  
  // A/B-Tests
  const formatPrice = usePricingFormat();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [sortBy, setSortBy] = useState<"relevance" | "price" | "delivery" | "rating">("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewGig, setQuickViewGig] = useState<any | null>(null);
  const [displayCount, setDisplayCount] = useState(12); // Infinite-Scroll: Start with 12 gigs
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Sync filter state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category) params.set('category', category);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    
    const newUrl = params.toString() ? `/marketplace?${params.toString()}` : '/marketplace';
    if (newUrl !== location) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchQuery, category, sortBy]);

  const { data: gigs, isLoading } = trpc.gigs.list.useQuery({ limit: 100 });
  const utils = trpc.useUtils();

  // Favorites
  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      utils.favorites.list.invalidate();
    },
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.list.invalidate();
    },
  });

  const { data: favoritesList } = trpc.favorites.list.useQuery();
  const favoriteGigIds = new Set(favoritesList?.map(f => f.gigId) || []);

  const toggleFavorite = (e: React.MouseEvent, gigId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (favoriteGigIds.has(gigId)) {
      removeFavoriteMutation.mutate({ gigId });
    } else {
      addFavoriteMutation.mutate({ gigId });
    }
  };

  // Dynamic category counts from database
  const categoryMapping: Record<string, string> = {
    "Design & Kreation": "design",
    "Development": "development",
    "Marketing": "marketing",
    "Content & Text": "content",
    "Business": "business",
    "Technologie": "technology",
  };

  // Reverse mapping for filtering (DB category → Display name)
  const reverseCategoryMapping: Record<string, string> = {
    "design": "Design & Kreation",
    "development": "Development",
    "marketing": "Marketing",
    "content": "Content & Text",
    "business": "Business",
    "technology": "Technologie",
  };

  const getCategoryCount = (categoryName: string) => {
    const dbCategory = categoryMapping[categoryName];
    const allGigs = gigs?.gigs || [];
    return allGigs.filter((g: any) => g.category === dbCategory).length || 0;
  };

  const categories = [
    { name: "Design & Kreation", icon: "🎨", count: getCategoryCount("Design & Kreation") },
    { name: "Development", icon: "💻", count: getCategoryCount("Development") },
    { name: "Marketing", icon: "📱", count: getCategoryCount("Marketing") },
    { name: "Content & Text", icon: "✍️", count: getCategoryCount("Content & Text") },
    { name: "Business", icon: "💼", count: getCategoryCount("Business") },
    { name: "Technologie", icon: "🤖", count: getCategoryCount("Technologie") },
  ];

  // Filter gigs
  const allGigs = gigs?.gigs || [];
  const filteredGigs = allGigs.filter((gig: any) => {
    const matchesSearch = !searchQuery || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map display category name to DB category
    const dbCategory = category ? categoryMapping[category] || category.toLowerCase() : null;
    const matchesCategory = !dbCategory || gig.category === dbCategory;
    
    const matchesPrice = gig.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];

  // Sort gigs
  const sortedGigs = [...filteredGigs].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "delivery":
        return a.deliveryDays - b.deliveryDays;
      case "rating":
        return 0; // Rating sorting disabled (no rating field in schema)
      default:
        return 0;
    }
  });

  // Infinite-Scroll: Display limited gigs
  const displayedGigs = sortedGigs.slice(0, displayCount);
  const hasMoreGigs = sortedGigs.length > displayCount;

  // Intersection Observer for Infinite-Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreGigs) {
          setDisplayCount((prev) => prev + 12);
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMoreGigs]);

  // Scroll-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <MetaTags 
        title="Marketplace - 500+ digitale Dienstleistungen ab 10€ | Flinkly"
        description="Durchsuche 500+ Gigs von verifizierten Experten. Webdesign, Logo-Design, Social Media Marketing, SEO, Content Creation. Filter nach Kategorie, Preis, Bewertung. DACH-Region. DSGVO-konform. Geld-zurück-Garantie."
        type="website"
      />

      {/* Full-Screen Video Background */}
      <div className="fixed inset-0 z-0">
        <VideoScene
          videoSrc="/videos/marketplace-luxury.mp4"
          blendMode="overlay"
          opacity={0.15}
          brightness={1.5}
          contrast={1.2}
          saturation={1.2}
          className="w-full h-full scale-110"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-violet-950/60 via-slate-900/80 to-slate-950/90 z-[1]" />

      {/* Particle System */}
      <ParticleSystem 
        count={60} 
        colors={["#8B5CF6", "#F97316", "#14B8A6"]} 
        className="fixed inset-0 z-[2]"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              {/* Premium Badge with Floating Animation */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-6 py-3 rounded-full mb-8 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-5 w-5 text-success" />
                <span className="text-success font-bold">{gigs?.gigs?.length || 0} Premium-Experten verfügbar</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-black text-white mb-6" style={{
                textShadow: '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)'
              }}>
                FINDE DEINE
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  DIGITALE EXPERTISE
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                Premium-Freelancer aus der DACH-Region. Transparent, fair, DSGVO-konform.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-3xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-2xl p-2 flex gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex-1 flex items-center gap-3 px-4">
                      <Search className="h-5 w-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Suche nach Dienstleistungen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 text-lg"
                      />
                    </div>
                    <MagneticButton 
                      intensity={0.4}
                      className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 text-lg"
                      onClick={() => {
                        const resultsCount = filteredGigs.length;
                        trackSearch(searchQuery, resultsCount);
                      }}
                    >
                      Suchen
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Pills with Stagger Animation */}
            <div className="flex gap-3 justify-center flex-wrap max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <Button
                  variant={!category ? "default" : "outline"}
                  onClick={() => {
                    setCategory("");
                    trackFilter('category', 'all');
                  }}
                  className={!category ? "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg shadow-accent/30" : "border-slate-700 hover:border-accent text-slate-300 hover:text-white bg-slate-900/40 backdrop-blur-sm"}
                >
                  Alle Kategorien
                </Button>
              </motion.div>
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <Button
                    variant={category === cat.name ? "default" : "outline"}
                    onClick={() => {
                      setCategory(cat.name);
                      trackFilter('category', cat.name);
                    }}
                    className={category === cat.name ? "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg shadow-accent/30" : "border-slate-700 hover:border-accent text-slate-300 hover:text-white bg-slate-900/40 backdrop-blur-sm"}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                    <Badge className="ml-2 bg-success/20 text-success border-success/40">{cat.count}</Badge>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gigs Grid */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-slate-700 hover:border-accent text-slate-300 hover:text-white bg-slate-900/40 backdrop-blur-sm"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <span className="text-slate-400">
                  {sortedGigs.length} Gigs gefunden
                </span>
              </div>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[200px] border-slate-700 bg-slate-900/40 backdrop-blur-sm text-white">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevanz</SelectItem>
                  <SelectItem value="price">Preis</SelectItem>
                  <SelectItem value="delivery">Lieferzeit</SelectItem>
                  <SelectItem value="rating">Bewertung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gigs Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <GigCardSkeleton key={i} />
                ))}
              </div>
            ) : displayedGigs.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-full mb-6">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Keine Gigs gefunden</h3>
                <p className="text-slate-400 mb-8">Versuche andere Suchbegriffe oder Filter</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("");
                  }}
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg shadow-accent/30 hover:scale-105 transition-all duration-300"
                >
                  Filter zurücksetzen
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {displayedGigs.map((gig, index) => (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Link 
                      href={`/gig/${gig.id}`}
                      onClick={() => trackNav(`gig_${gig.id}`, 'marketplace')}
                    >
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

                          {/* Trust Badges (Seller Verification) */}
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            {gig.seller?.emailVerified && (
                              <Badge className="bg-success/20 text-success border-success/40 backdrop-blur-sm text-xs flex items-center gap-1">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verifiziert
                              </Badge>
                            )}
                            {(gig.completedOrders || 0) > 0 && (
                              <Badge className="bg-primary/20 text-primary border-primary/40 backdrop-blur-sm text-xs">
                                {gig.completedOrders} Aufträge
                              </Badge>
                            )}
                          </div>

                          {/* Favorite Heart Icon */}
                          <button
                            onClick={(e) => toggleFavorite(e, gig.id)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-full hover:border-accent hover:bg-accent/20 transition-all duration-300 hover:scale-110 z-10"
                          >
                            <Heart
                              className={`h-5 w-5 transition-all duration-300 ${
                                favoriteGigIds.has(gig.id)
                                  ? "text-accent fill-accent"
                                  : "text-slate-400 hover:text-accent"
                              }`}
                            />
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

                          {/* Seller Info */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
                              {gig.seller?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{gig.seller?.name || "Unbekannt"}</p>
                              <p className="text-xs text-slate-400">
                                {(gig.completedOrders || 0) > 10 ? "Top Seller" : (gig.completedOrders || 0) > 5 ? "Pro" : (gig.completedOrders || 0) > 0 ? "Rising" : "Neu"}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-success fill-success" />
                              <span className="text-white font-bold">{gig.averageRating ? (gig.averageRating / 100).toFixed(1) : "Neu"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{gig.deliveryDays}d</span>
                            </div>
                            {(gig.completedOrders || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{gig.completedOrders} Orders</span>
                              </div>
                            )}
                          </div>

                          {/* Price + Quick-View-Button */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-sm">Ab</span>
                              <span className="text-3xl font-black text-white group-hover:text-success transition-colors duration-300">
                                {formatPrice(gig.price)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickViewGig(gig);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800/50 border-slate-700 hover:bg-accent hover:border-accent text-xs"
                            >
                              Quick View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Infinite-Scroll Sentinel */}
            {!isLoading && hasMoreGigs && (
              <div id="scroll-sentinel" className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            )}

            {/* All Gigs Loaded Message */}
            {!isLoading && !hasMoreGigs && displayedGigs.length > 0 && (
              <div className="text-center py-12 text-slate-400">
                Alle Gigs geladen ({displayedGigs.length})
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30"
          size="icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </Button>
      )}

      {/* Quick-View-Modal */}
      {quickViewGig && (
        <GigQuickView
          gig={quickViewGig}
          open={!!quickViewGig}
          onClose={() => setQuickViewGig(null)}
        />
      )}
    </main>
  );
}
