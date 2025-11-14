import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Custom hook for parallax scroll effects
 * Returns scroll-based transform values for creating depth and motion
 */
export function useParallaxScroll() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  return { ref, scrollYProgress };
}

/**
 * Create parallax transform values based on scroll progress
 * @param scrollYProgress - Scroll progress value (0-1)
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @returns Object with transform values
 */
export function useParallaxTransform(
  scrollYProgress: MotionValue<number>,
  speed: number = 0.5
) {
  // Y-axis translation (moves element vertically)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
  // Opacity fade (fades out as user scrolls)
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  
  // Scale (subtle zoom effect)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return { y, opacity, scale };
}

/**
 * Multi-layer parallax with different speeds for depth effect
 */
export function useMultiLayerParallax(scrollYProgress: MotionValue<number>) {
  return {
    // Background layer (slowest)
    background: {
      y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]),
      opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.15, 0.05]),
    },
    // Middle layer (medium speed)
    middle: {
      y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]),
      opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.7, 0.4]),
    },
    // Foreground layer (fastest)
    foreground: {
      y: useTransform(scrollYProgress, [0, 1], ["0%", "80%"]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [1, 0.95, 0.7, 0.3]),
      scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]),
    }
  };
}
