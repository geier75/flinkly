import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const services = [
  {
    image: "/images/service-design.jpg",
    title: "Design & Kreation",
    description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing",
    color: "from-purple-500 to-pink-500",
    category: "design"
  },
  {
    image: "/images/service-development.jpg",
    title: "Development",
    description: "Web-Development, App-Development, WordPress, Shopify",
    color: "from-blue-500 to-cyan-500",
    category: "development"
  },
  {
    image: "/images/service-marketing.jpg",
    title: "Marketing",
    description: "Social Media, SEO, Content-Marketing, Google Ads",
    color: "from-orange-500 to-red-500",
    category: "marketing"
  },
  {
    image: "/images/service-content.jpg",
    title: "Content & Text",
    description: "Copywriting, Blog-Artikel, Übersetzungen, Lektorat",
    color: "from-green-500 to-teal-500",
    category: "content"
  },
  {
    image: "/images/service-business.jpg",
    title: "Business",
    description: "Virtuelle Assistenz, Buchhaltung, Projektmanagement",
    color: "from-violet-500 to-purple-500",
    category: "business"
  },
  {
    image: "/images/service-technology.jpg",
    title: "Technologie",
    description: "Data Science, AI/ML, Blockchain, Cloud-Services",
    color: "from-yellow-500 to-orange-500",
    category: "technology"
  }
];

/**
 * ServiceCardsFan - Auto-Sliding-Carousel von links nach rechts
 * Cards gleiten automatisch mit Premium-Effekten
 */
export function ServiceCardsFan() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const cardsPerView = 3; // Show 3 cards at once

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // Loop back to start when reaching the end
        if (next >= services.length) {
          return 0;
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Get visible cards with wrapping
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < cardsPerView; i++) {
      const index = (currentIndex + i) % services.length;
      cards.push({ ...services[index], key: `${index}-${currentIndex}` });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ 
                opacity: 0, 
                x: 100,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: -100,
                scale: 0.9
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96] // Custom easing
              }}
            >
              <Card 
                className="group relative bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 hover:border-primary rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(139,92,246,0.5),0_0_100px_rgba(139,92,246,0.3)] transition-all duration-500"
                onClick={() => window.location.href = `/marketplace?category=${service.category}`}
              >
                {/* Animated Gradient Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <CardContent className="p-0 relative z-10">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {service.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <motion.div 
                      className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: 0 }}
                      whileHover={{ x: 8 }}
                    >
                      <span className="text-sm font-bold">Mehr erfahren</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-slate-700 w-2 hover:bg-slate-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-primary text-sm font-bold bg-slate-900/80 px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm"
        >
          Pausiert - Bewege Maus weg zum Fortsetzen
        </motion.div>
      )}
    </div>
  );
}
