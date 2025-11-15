import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const services = [
  {
    id: 1,
    title: "Design & Kreation",
    description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    category: "design",
  },
  {
    id: 2,
    title: "Development",
    description: "Web-Development, App-Development, E-Commerce, WordPress",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    category: "development",
  },
  {
    id: 3,
    title: "Marketing",
    description: "Social Media, SEO, Content Marketing, Email Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    category: "marketing",
  },
  {
    id: 4,
    title: "Content & Text",
    description: "Copywriting, Blogartikel, Übersetzungen, Lektorat",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    category: "writing",
  },
  {
    id: 5,
    title: "Technologie",
    description: "Data Science, AI/ML, Blockchain, Cloud Services",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    category: "tech",
  },
  {
    id: 6,
    title: "Business",
    description: "Beratung, Projektmanagement, Virtuelle Assistenz",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    category: "business",
  },
];

/**
 * Horizontal Service Cards Carousel with better readability
 * Replaces vertical fan layout with flat horizontal cards
 */
export function ServiceCardsFan() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3; // Show 3 cards at once

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + cardsPerView >= services.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, services.length - cardsPerView) : prev - 1
    );
  };

  const visibleCards = services.slice(currentIndex, currentIndex + cardsPerView);
  // Fill remaining slots if at the end
  if (visibleCards.length < cardsPerView) {
    visibleCards.push(...services.slice(0, cardsPerView - visibleCards.length));
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl border-2 border-slate-700/50 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-primary/50"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl border-2 border-slate-700/50 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-primary/50"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
        {visibleCards.map((service, index) => (
          <motion.div
            key={`${service.id}-${currentIndex}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/marketplace?category=${service.category}`}>
              <motion.div
                className="group relative bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer"
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  borderColor: "rgba(139, 92, 246, 0.5)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
                  <div className="absolute inset-0 shadow-[0_0_80px_rgba(139,92,246,0.3)]" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(services.length / cardsPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * cardsPerView)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / cardsPerView) === index
                ? "bg-primary w-8"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
