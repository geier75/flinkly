import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    image: "/images/service-design.jpg",
    title: "Design & Kreation",
    description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing",
    category: "design",
    backInfo: {
      features: ["Professionelle Logos", "Corporate Design", "UI/UX Prototypen", "Illustrationen"],
      priceRange: "ab 50€",
      deliveryTime: "2-5 Tage",
      experts: "500+ Designer"
    }
  },
  {
    image: "/images/service-development.jpg",
    title: "Development",
    description: "Web-Development, App-Development, WordPress, Shopify",
    category: "development",
    backInfo: {
      features: ["Responsive Websites", "Mobile Apps", "E-Commerce", "Custom Solutions"],
      priceRange: "ab 200€",
      deliveryTime: "5-14 Tage",
      experts: "800+ Entwickler"
    }
  },
  {
    image: "/images/service-marketing.jpg",
    title: "Marketing",
    description: "Social Media, SEO, Content-Marketing, Google Ads",
    category: "marketing",
    backInfo: {
      features: ["Social Media Kampagnen", "SEO-Optimierung", "Google Ads", "Analytics"],
      priceRange: "ab 100€",
      deliveryTime: "3-7 Tage",
      experts: "600+ Marketer"
    }
  },
  {
    image: "/images/service-content.jpg",
    title: "Content & Text",
    description: "Copywriting, Blog-Artikel, Übersetzungen, Lektorat",
    category: "content",
    backInfo: {
      features: ["SEO-Texte", "Blog-Artikel", "Übersetzungen", "Lektorat"],
      priceRange: "ab 30€",
      deliveryTime: "1-3 Tage",
      experts: "400+ Texter"
    }
  },
  {
    image: "/images/service-business.jpg",
    title: "Business",
    description: "Virtuelle Assistenz, Buchhaltung, Projektmanagement",
    category: "business",
    backInfo: {
      features: ["Virtuelle Assistenz", "Buchhaltung", "Projektmanagement", "Admin-Support"],
      priceRange: "ab 25€/h",
      deliveryTime: "Sofort verfügbar",
      experts: "300+ Assistenten"
    }
  },
  {
    image: "/images/service-technology.jpg",
    title: "Technologie",
    description: "Data Science, AI/ML, Blockchain, Cloud-Services",
    category: "technology",
    backInfo: {
      features: ["AI/ML Modelle", "Data Analysis", "Blockchain", "Cloud Migration"],
      priceRange: "ab 300€",
      deliveryTime: "7-21 Tage",
      experts: "200+ Spezialisten"
    }
  }
];

export default function ServiceCardsFan() {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [manualControl, setManualControl] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") rotateLeft();
      else if (e.key === "ArrowRight") rotateRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const rotateLeft = () => {
    setRotation((prev) => prev - (360 / services.length));
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000);
  };
  
  const rotateRight = () => {
    setRotation((prev) => prev + (360 / services.length));
    setManualControl(true);
    setTimeout(() => setManualControl(false), 5000);
  };

  const toggleFlip = (category: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };
  
  useEffect(() => {
    if (isPaused || manualControl) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev + (360 / services.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, manualControl]);

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
          alt="FLINKLY"
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
        className="relative h-[550px] flex items-center justify-center z-10"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%"
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: rotation }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {services.map((service, index) => {
            const anglePerCard = 360 / services.length;
            const angle = index * anglePerCard;
            const angleRad = (angle * Math.PI) / 180;
            const radius = 500;
            const x = Math.sin(angleRad) * radius;
            const z = Math.cos(angleRad) * radius;
            const isFlipped = flippedCards.has(service.category);
            
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
                <motion.div
                  className="w-[240px] h-[340px] cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  onClick={() => toggleFlip(service.category)}
                >
                  <Card 
                    className="absolute inset-0 overflow-hidden backdrop-blur-xl bg-slate-900/40 border-2 border-white/10 hover:border-primary/50 transition-all duration-500 group shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <div className="relative w-full h-[180px] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    </div>
                    <CardContent className="p-6 space-y-3">
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
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>
                      <p className="text-xs text-primary/70 italic">Klick für Details →</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="absolute inset-0 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/20 to-slate-900/60 border-2 border-primary/50 shadow-2xl shadow-primary/30"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <CardContent className="p-6 space-y-4 h-full flex flex-col justify-between">
                      <h3 
                        className="text-lg font-black uppercase tracking-tight"
                        style={{
                          fontFamily: "'Impact', 'Arial Black', sans-serif",
                          background: "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #8B5CF6 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}
                      >
                        {service.title}
                      </h3>
                      <div className="space-y-2">
                        {service.backInfo.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-200">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                        <div>
                          <p className="text-xs text-slate-400">Preis</p>
                          <p className="text-sm font-bold text-primary">{service.backInfo.priceRange}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Lieferzeit</p>
                          <p className="text-sm font-bold text-white">{service.backInfo.deliveryTime}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-400">Verfügbar</p>
                          <p className="text-sm font-bold text-primary">{service.backInfo.experts}</p>
                        </div>
                      </div>
                      <p className="text-xs text-primary/70 italic text-center">Klick zum Zurückdrehen</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 border-2 border-white/10 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          onClick={rotateLeft}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto w-14 h-14 rounded-full backdrop-blur-xl bg-slate-900/60 border-2 border-white/10 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          onClick={rotateRight}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-3 mt-12 z-20 relative">
        {services.map((service, index) => {
          const normalizedRotation = ((rotation % 360) + 360) % 360;
          const targetRotation = (index * (360 / services.length)) % 360;
          const isActive = Math.abs(normalizedRotation - targetRotation) < 10 || 
                          Math.abs(normalizedRotation - targetRotation) > 350;
          
          return (
            <motion.button
              key={service.category}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-12 bg-gradient-to-r from-primary via-secondary to-accent' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => {
                const targetAngle = index * (360 / services.length);
                setRotation(targetAngle);
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
            />
          );
        })}
      </div>

      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-xl bg-slate-900/80 border border-white/20 text-sm text-white z-20"
        >
          ⏸️ Pausiert
        </motion.div>
      )}
    </div>
  );
}
