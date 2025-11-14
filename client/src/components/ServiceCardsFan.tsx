import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { VideoScene } from "@/components/webgl/VideoScene";

const services = [
  {
    image: "/images/service-design.jpg",
    title: "Design & Kreation",
    description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing",
    color: "from-purple-500 to-pink-500"
  },
  {
    image: "/images/service-development.jpg",
    title: "Development",
    description: "Web-Development, App-Development, WordPress, Shopify",
    color: "from-blue-500 to-cyan-500"
  },
  {
    image: "/images/service-marketing.jpg",
    title: "Marketing",
    description: "Social Media, SEO, Content-Marketing, Google Ads",
    color: "from-orange-500 to-red-500"
  },
  {
    image: "/images/service-content.jpg",
    title: "Content & Text",
    description: "Copywriting, Blog-Artikel, Übersetzungen, Lektorat",
    color: "from-green-500 to-teal-500"
  },
  {
    image: "/images/service-business.jpg",
    title: "Business",
    description: "Virtuelle Assistenz, Buchhaltung, Projektmanagement",
    color: "from-violet-500 to-purple-500"
  },
  {
    image: "/images/service-technology.jpg",
    title: "Technologie",
    description: "Data Science, AI/ML, Blockchain, Cloud-Services",
    color: "from-yellow-500 to-orange-500"
  }
];

/**
 * ServiceCardsFan - Fächer-Effekt für Service-Cards
 * Cards liegen gestapelt und fächern sich beim Hover radial auf
 */
export function ServiceCardsFan() {
  const [isFanned, setIsFanned] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Calculate fan-out positions
  const getFanTransform = (index: number, totalCards: number) => {
    if (!isFanned) {
      // Stacked state - slight offset for depth
      return {
        rotate: 0,
        x: 0,
        y: index * 8, // Slight vertical offset
        scale: 1 - index * 0.02, // Slight scale decrease for depth
        zIndex: totalCards - index
      };
    }

    // Fanned state - radial spread
    const totalAngle = 200; // Total spread angle (increased for more space)
    const angleStep = totalAngle / (totalCards - 1);
    const angle = -100 + (index * angleStep); // -100° to +100° (wider spread)
    
    // Calculate position on arc
    const radius = 350; // Distance from center (increased)
    const radians = (angle * Math.PI) / 180;
    const x = Math.sin(radians) * radius;
    const y = -Math.abs(Math.cos(radians)) * 180; // Upward arc (higher)

    return {
      rotate: angle * 0.7, // More rotation for dramatic effect
      x,
      y,
      scale: hoveredCard === index ? 1.15 : 1, // Bigger scale on hover
      zIndex: hoveredCard === index ? totalCards + 1 : index
    };
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-[600px] max-w-5xl mx-auto"
      onMouseEnter={() => setIsFanned(true)}
      onMouseLeave={() => {
        setIsFanned(false);
        setHoveredCard(null);
      }}
    >
      {/* WebGL Video Background (visible when stacked) */}
      <motion.div 
        className="absolute inset-0 -z-10 rounded-3xl overflow-hidden"
        animate={{
          opacity: isFanned ? 0.05 : 0.2,
        }}
        transition={{ duration: 0.6 }}
      >
        <VideoScene
          videoSrc="/videos/services-expertise.mp4"
          blendMode="overlay"
          opacity={0.3}
          className="w-full h-full scale-110"
        />
      </motion.div>

      {/* 3D FLINKLY Logo Background (visible when stacked) */}
      <AnimatePresence>
        {!isFanned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotateY: [0, 10, -10, 0],
            }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            transition={{ 
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 flex items-center justify-center -z-5 pointer-events-none"
            style={{
              perspective: '1000px',
            }}
          >
            <div 
              className="text-[160px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400/40 via-emerald-400/40 to-teal-400/40 backdrop-blur-3xl"
              style={{
                textShadow: '0 0 100px rgba(20, 184, 166, 0.5), 0 0 150px rgba(20, 184, 166, 0.3), 0 0 200px rgba(20, 184, 166, 0.2)',
                WebkitTextStroke: '1.5px rgba(20, 184, 166, 0.3)',
              }}
            >
              FLINKLY
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Text */}
      <AnimatePresence>
        {!isFanned && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 text-teal-400 text-base font-bold flex items-center gap-2 bg-slate-900/80 px-6 py-3 rounded-full border border-teal-500/30 backdrop-blur-sm z-10"
          >
            <span>Bewege die Maus über die Cards</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Stack */}
      <div className="relative w-full max-w-md">
        {services.map((service, index) => {
          const transform = getFanTransform(index, services.length);
          
          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{
                width: '100%',
                maxWidth: '400px',
                marginLeft: '-200px',
                marginTop: '-200px',
              }}
              animate={{
                rotate: transform.rotate,
                x: transform.x,
                y: transform.y,
                scale: transform.scale,
                zIndex: transform.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: isFanned ? index * 0.05 : 0, // Stagger on fan-out
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className="relative bg-slate-900/90 border-2 border-slate-700/50 hover:border-teal-500 backdrop-blur-xl group overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(20,184,166,0.5),0_0_100px_rgba(20,184,166,0.3)] cursor-pointer transition-all duration-500"
              >
                {/* Animated Gradient Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <CardContent className="p-0 relative z-10">
                  {/* Image Container */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight group-hover:text-teal-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {service.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <div className="mt-4 flex items-center gap-2 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-sm font-bold">Mehr erfahren</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
