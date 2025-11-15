import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    image: "/images/service-design.jpg",
    title: "Design & Kreation",
    description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing",
    category: "design"
  },
  {
    image: "/images/service-development.jpg",
    title: "Development",
    description: "Web-Development, App-Development, WordPress, Shopify",
    category: "development"
  },
  {
    image: "/images/service-marketing.jpg",
    title: "Marketing",
    description: "Social Media, SEO, Content-Marketing, Google Ads",
    category: "marketing"
  },
  {
    image: "/images/service-content.jpg",
    title: "Content & Text",
    description: "Copywriting, Blog-Artikel, Übersetzungen, Lektorat",
    category: "content"
  },
  {
    image: "/images/service-business.jpg",
    title: "Business",
    description: "Virtuelle Assistenz, Buchhaltung, Projektmanagement",
    category: "business"
  },
  {
    image: "/images/service-technology.jpg",
    title: "Technologie",
    description: "Data Science, AI/ML, Blockchain, Cloud-Services",
    category: "technology"
  }
];

/**
 * 🎠 ECHTES 3D-KARUSSELL mit GRAFFITI-STYLE
 * 
 * - MEHRERE Cards gleichzeitig sichtbar (3-4 Cards)
 * - Schnellere Rotation (3 Sekunden)
 * - FLINKLY-Graffiti UNTER den Karten
 * - Pausieren nur bei Card-Hover
 */
export function ServiceCardsFan() {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [manualControl, setManualControl] = useState(false);
  
  const rotateLeft = () => {
    setRotation((prev) => prev - (360 / services.length));
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000); // Resume auto-rotation after 5s
  };
  
  const rotateRight = () => {
    setRotation((prev) => prev + (360 / services.length));
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000); // Resume auto-rotation after 5s
  };
  
  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (isPaused || manualControl) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev + (360 / services.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-24">
      {/* FLINKLY GRAFFITI - ALS HINTERGRUND UNTER DEN CARDS */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
      >
        <motion.img
          src="/images/flinkly-graffiti.png"
          alt="FLINKLY"
          className="w-[288000px] h-auto opacity-40"
          style={{
            filter: "drop-shadow(0 0 60px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 80px rgba(78, 205, 196, 0.8)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.9))"
          }}
          animate={{
            filter: [
              "drop-shadow(0 0 60px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 80px rgba(78, 205, 196, 0.8)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.9))",
              "drop-shadow(0 0 80px rgba(255, 107, 53, 1)) drop-shadow(0 0 100px rgba(78, 205, 196, 1)) drop-shadow(0 0 120px rgba(139, 92, 246, 1))",
              "drop-shadow(0 0 60px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 80px rgba(78, 205, 196, 0.8)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.9))"
            ],
            scale: [1, 1.02, 1],
            opacity: [0.4, 0.5, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* 3D Carousel Container - SCHWEBT ÜBER FLINKLY */}
      <div 
        className="relative h-[550px] flex items-center justify-center z-10"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%"
        }}
      >
        {/* Rotating Carousel */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: rotation
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
        >
          {services.map((service, index) => {
            const totalCards = services.length;
            const anglePerCard = 360 / totalCards;
            const angle = index * anglePerCard;
            const angleRad = (angle * Math.PI) / 180;
            
            // Radius: distance from center
            const radius = 500;
            
            // Calculate 3D position
            const x = Math.sin(angleRad) * radius;
            const z = Math.cos(angleRad) * radius;
            
            return (
              <motion.div
                key={service.category}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${-angle}deg)`,
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Card 
                  className="w-[240px] h-[340px] overflow-hidden backdrop-blur-xl bg-slate-900/40 border-2 border-white/10 hover:border-primary/50 transition-all duration-500 group cursor-pointer shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Simple Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    
                    {/* Glow Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>

                  <CardContent className="p-5 relative">
                    {/* Title with GRAFFITI-STYLE */}
                    <h3 
                      className="text-2xl font-black uppercase mb-3 transition-all duration-500"
                      style={{
                        fontFamily: "'Impact', 'Arial Black', sans-serif",
                        textShadow: "2px 2px 0 rgba(139, 92, 246, 0.3)",
                        background: "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #8B5CF6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Shimmer Effect on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  </CardContent>

                  {/* Multi-Layer Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `
                        0 0 20px rgba(255, 107, 53, 0.4),
                        0 0 40px rgba(78, 205, 196, 0.4),
                        0 0 60px rgba(139, 92, 246, 0.4)
                      `
                    }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* MANUELLE STEUERUNG - Links/Rechts-Pfeile */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <Button
          onClick={rotateLeft}
          size="icon"
          className="w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 hover:bg-slate-900/80 border-2 border-white/20 hover:border-primary/50 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          aria-label="Vorherige Card"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <Button
          onClick={rotateRight}
          size="icon"
          className="w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 hover:bg-slate-900/80 border-2 border-white/20 hover:border-primary/50 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          aria-label="Nächste Card"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Progress Dots with GLOW - DIREKT UNTER CAROUSEL */}
      <div className="flex justify-center gap-3 mt-8">
        {services.map((_, index) => {
          const currentCard = Math.round((rotation / (360 / services.length)) % services.length);
          return (
            <motion.button
              key={index}
              onClick={() => setRotation(index * (360 / services.length))}
              className={`transition-all duration-300 rounded-full ${
                index === currentCard
                  ? "w-12 h-3"
                  : "w-3 h-3 bg-white/30 hover:bg-white/50"
              }`}
              style={
                index === currentCard
                  ? {
                      background: "linear-gradient(90deg, #FF6B35 0%, #4ECDC4 50%, #8B5CF6 100%)",
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)"
                    }
                  : {}
              }
              animate={
                index === currentCard
                  ? {
                      boxShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.6)",
                        "0 0 30px rgba(139, 92, 246, 0.8)",
                        "0 0 20px rgba(139, 92, 246, 0.6)"
                      ]
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              aria-label={`Go to service ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Pause Indicator with GLOW - nur wenn pausiert */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #8B5CF6 100%)",
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
          }}
        >
          ⏸️ PAUSIERT
        </motion.div>
      )}

      {/* Floating Background Glow - HELLER */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(78, 205, 196, 0.15) 40%, transparent 70%)",
          filter: "blur(80px)"
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
