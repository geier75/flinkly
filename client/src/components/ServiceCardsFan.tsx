import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Sparkles, X, Check, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGigsList } from "@/hooks/useApi";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

// Category display names and icons (fallback for unknown categories)
const categoryMeta: Record<string, { title: string; icon: string; image: string }> = {
  design: { title: "Design & Kreation", icon: "🎨", image: "/images/service-design.jpg" },
  development: { title: "Development", icon: "💻", image: "/images/service-development.jpg" },
  marketing: { title: "Marketing", icon: "📱", image: "/images/service-marketing.jpg" },
  content: { title: "Content & Text", icon: "✍️", image: "/images/service-content.jpg" },
  business: { title: "Business", icon: "💼", image: "/images/service-business.jpg" },
  technology: { title: "Technologie", icon: "🤖", image: "/images/service-technology.jpg" },
};

// Generate a consistent color for a category
const getCategoryColor = (category: string): string => {
  const colors = [
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-amber-500",
    "from-emerald-500 to-teal-500",
    "from-violet-500 to-purple-500",
    "from-indigo-500 to-blue-500",
    "from-red-500 to-orange-500",
    "from-green-500 to-emerald-500",
  ];
  // Simple hash to get consistent color
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get icon for category
const getCategoryIcon = (category: string): string => {
  if (categoryMeta[category]) return categoryMeta[category].icon;
  // Generate icon based on first letter
  const icons = ["📌", "⭐", "💡", "🚀", "🎯", "🔥", "🌟", "💠"];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return icons[Math.abs(hash) % icons.length];
};

// Format category name for display
const formatCategoryName = (category: string): string => {
  if (categoryMeta[category]) return categoryMeta[category].title;
  // Capitalize first letter and replace underscores/hyphens
  return category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

interface GigData {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  category: string | null;
}

interface CategoryData {
  category: string;
  title: string;
  icon: string;
  color: string;
  gigCount: number;
  sampleGigs: Array<{ title: string; imageUrl: string | null; id: number; description: string; price: number }>;
}

export default function ServiceCardsFan() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [manualControl, setManualControl] = useState(false);
  const [selectedGig, setSelectedGig] = useState<GigData | null>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Fetch all gigs from database
  const { data: gigsData, isLoading } = useGigsList({ limit: 100 });

  // Extract unique categories from gigs and build category data
  const categories: CategoryData[] = useMemo(() => {
    if (!gigsData?.gigs || gigsData.gigs.length === 0) return [];

    const categoryMap = new Map<string, { gigs: typeof gigsData.gigs }>(); 

    // Group gigs by category
    gigsData.gigs.forEach((gig) => {
      const cat = gig.category || "other";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { gigs: [] });
      }
      categoryMap.get(cat)!.gigs.push(gig);
    });

    // Convert to array and sort by gig count
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        title: formatCategoryName(category),
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
        gigCount: data.gigs.length,
        sampleGigs: data.gigs.slice(0, 4).map((g) => ({
          title: g.title,
          imageUrl: g.imageUrl,
          id: g.id,
          description: g.description,
          price: g.price,
        })),
      }))
      .sort((a, b) => b.gigCount - a.gigCount); // Most popular first
  }, [gigsData]);

  const goLeft = useCallback(() => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000);
  }, [categories.length]);
  
  const goRight = useCallback(() => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000);
  }, [categories.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goLeft();
      else if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goLeft, goRight]);
  
  // Auto-advance every 4 seconds
  useEffect(() => {
    if (isPaused || manualControl || categories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, manualControl, categories.length]);

  // Calculate card position relative to current index
  const getCardOffset = (index: number) => {
    if (categories.length === 0) return 0;
    let offset = index - currentIndex;
    // Handle wrap-around for smooth infinite scroll
    if (offset > categories.length / 2) offset -= categories.length;
    if (offset < -categories.length / 2) offset += categories.length;
    return offset;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-400">Kategorien werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  // No categories found
  if (categories.length === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <Sparkles className="w-12 h-12 text-primary/50" />
            <p className="text-slate-400">Noch keine Gigs verfügbar</p>
            <p className="text-sm text-slate-500">Sobald Gigs erstellt werden, erscheinen hier die Kategorien</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-24">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
      >
        <motion.img
          src="/images/flinkly-graffiti-v2.png"
          alt="Flinkly" translate="no"
          className="w-[4000000px] h-auto opacity-60"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div 
        className="relative h-[450px] flex items-center justify-center z-10 overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {categories.map((cat, index) => {
            const offset = getCardOffset(index);
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            
            // Horizontal position: 280px per card
            const xPosition = offset * 280;
            // Scale: center = 1, sides = smaller
            const scale = isCenter ? 1 : 0.85 - Math.abs(offset) * 0.05;
            // Opacity: center = 1, fade out on sides
            const opacity = isCenter ? 1 : Math.max(0.4, 1 - Math.abs(offset) * 0.3);
            // Z-index: center on top
            const zIndex = 10 - Math.abs(offset);
            
            if (!isVisible) return null;

            // Get first gig image or fallback
            const coverImage = cat.sampleGigs[0]?.imageUrl || 
              categoryMeta[cat.category]?.image || 
              "/images/service-design.jpg";
            
            return (
              <motion.div
                key={cat.category}
                className="absolute"
                initial={false}
                animate={{
                  x: xPosition,
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Card 
                  onClick={() => {
                    if (isAuthenticated) {
                      // Angemeldete User -> direkt zum Marketplace
                      setLocation(`/marketplace?category=${cat.category}`);
                    } else {
                      // Nicht angemeldete User -> zeige ersten Gig als Detail-Modal
                      const firstGig = cat.sampleGigs[0];
                      if (firstGig) {
                        setSelectedGig({
                          id: firstGig.id,
                          title: firstGig.title,
                          description: firstGig.description,
                          imageUrl: firstGig.imageUrl,
                          price: firstGig.price,
                          category: cat.category,
                        });
                      }
                    }
                  }}
                  className={`w-[260px] h-[360px] overflow-hidden cursor-pointer transition-all duration-500 group shadow-2xl ${
                    isCenter 
                      ? "border-2 border-primary/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]" 
                      : "border border-white/10 hover:border-primary/30"
                  } backdrop-blur-xl bg-slate-900/40`}
                >
                  {/* Image Grid - 2x2 of sample gigs */}
                  <div className="relative w-full h-[160px] overflow-hidden">
                    {cat.sampleGigs.length >= 4 ? (
                      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                        {cat.sampleGigs.slice(0, 4).map((gig, i) => (
                          <div key={i} className="overflow-hidden">
                            <img
                              src={gig.imageUrl || "/images/service-design.jpg"}
                              alt={gig.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <img
                        src={coverImage}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    
                    
                    {/* Gig Count Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/20">
                      <span className="text-xs font-bold text-white">{cat.gigCount} Gigs</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 space-y-3">
                    <h3 
                      className="text-xl font-black uppercase tracking-tight group-hover:scale-105 transition-transform duration-300"
                      style={{
                        fontFamily: "'Impact', 'Arial Black', sans-serif",
                        background: "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #8B5CF6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                      }}
                    >
                      {cat.title}
                    </h3>
                    
                    {/* Sample Gig Titles with Prices */}
                    <div className="space-y-1.5">
                      {cat.sampleGigs.slice(0, 3).map((gig, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 flex-1">
                            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                            {gig.title}
                          </p>
                          <span className="text-xs font-semibold text-primary whitespace-nowrap">
                            {(() => {
                              const price = gig.price;
                              // Parse price - handle string or number
                              let numPrice: number;
                              if (typeof price === 'string') {
                                const cleaned = price.replace(/[€\s]/g, '').replace(',', '.');
                                numPrice = parseFloat(cleaned);
                              } else {
                                numPrice = price;
                              }
                              if (isNaN(numPrice)) return price;
                              // Price is stored in cents, convert to euros
                              const euros = numPrice / 100;
                              return `${Math.round(euros).toLocaleString('de-DE')} €`;
                            })()}
                          </span>
                        </div>
                      ))}
                      {cat.gigCount > 3 && (
                        <p className="text-xs text-primary/70 font-medium">
                          +{cat.gigCount - 3} weitere Gigs
                        </p>
                      )}
                    </div>
                    
                    {/* CTA */}
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-primary group-hover:text-primary/80 transition-colors flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {isAuthenticated ? "Kategorie entdecken →" : "Details ansehen →"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 border-2 border-white/10 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          onClick={goLeft}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 border-2 border-white/10 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          onClick={goRight}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8 z-20 relative">
        {categories.map((cat, index) => {
          const isActive = index === currentIndex;
          
          return (
            <motion.button
              key={cat.category}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-8 bg-gradient-to-r from-primary via-secondary to-accent' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setManualControl(true);
                setTimeout(() => setManualControl(false), 5000);
              }}
              animate={isActive ? {
                boxShadow: [
                  "0 0 10px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.8)",
                  "0 0 10px rgba(139, 92, 246, 0.5)"
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              title={cat.title}
            />
          );
        })}
      </div>

      {/* Category Count Info */}
      <div className="text-center mt-4 z-20 relative">
        <p className="text-xs text-slate-500">
          {categories.length} Kategorien • {gigsData?.gigs?.length || 0} Gigs verfügbar
        </p>
      </div>

      {/* Gig Detail Modal für nicht angemeldete User */}
      <AnimatePresence>
        {selectedGig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedGig(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedGig(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>

              {/* Gig Image */}
              {selectedGig.imageUrl && (
                <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={selectedGig.imageUrl}
                    alt={selectedGig.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Title & Price */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">{selectedGig.title}</h2>
                  <div className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30">
                    <span className="text-lg font-bold text-primary">
                      {(() => {
                        const price = selectedGig.price;
                        let numPrice: number;
                        if (typeof price === 'string') {
                          const cleaned = price.replace(/[€\s]/g, '').replace(',', '.');
                          numPrice = parseFloat(cleaned);
                        } else {
                          numPrice = price;
                        }
                        if (isNaN(numPrice)) return price;
                        // Price is stored in cents, convert to euros
                        const euros = numPrice / 100;
                        return `${Math.round(euros).toLocaleString('de-DE')} €`;
                      })()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Über dieses Gig</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedGig.description || "Keine Beschreibung verfügbar."}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Was du erhältst:</h3>
                  <div className="space-y-2">
                    {["Professionelle Qualität", "Alle Quelldateien", "Kommerzielle Nutzungsrechte", "Schnelle Kommunikation & Support"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Login CTA */}
                <div className="pt-4 border-t border-slate-700/50 space-y-3">
                  <p className="text-sm text-slate-400 text-center">
                    Melde dich an, um diesen Gig zu kaufen oder den Verkäufer zu kontaktieren.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setLocation(`/login?redirect=/gig/${selectedGig.id}`)}
                      className="flex-1 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Anmelden
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setLocation(`/register?redirect=/gig/${selectedGig.id}`)}
                      className="flex-1 border-slate-600 hover:bg-slate-800"
                    >
                      Registrieren
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
