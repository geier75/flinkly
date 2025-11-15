import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ValueCardCarouselProps {
  images: string[];
  icon: string;
  title: string;
}

export function ValueCardCarousel({ images, icon, title }: ValueCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  return (
    <div 
      className="relative aspect-[16/9] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Carousel with Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - Bild ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none" />

      {/* Icon Overlay */}
      <div className="absolute top-4 left-4 text-5xl opacity-90 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
        {icon}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Gehe zu Bild ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
