import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Custom Login Background with colorful patterns and floating "FLINKLY" text
 * Appears behind Manus OAuth modal
 */
export function LoginBackground() {
  const [dots, setDots] = useState<Array<{ x: number; y: number; size: number; color: string; delay: number }>>([]);

  useEffect(() => {
    // Generate 150 random colorful dots
    const colors = [
      "rgba(139, 92, 246, 0.6)", // Violett
      "rgba(251, 146, 60, 0.6)", // Orange
      "rgba(20, 184, 166, 0.6)", // Türkis
      "rgba(236, 72, 153, 0.6)", // Pink
      "rgba(59, 130, 246, 0.6)", // Blau
    ];

    const newDots = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2, // 2-8px
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
    }));

    setDots(newDots);
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Colorful Dots Pattern */}
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating "FLINKLY" Words */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-9xl font-black opacity-10"
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #f97316 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 80px rgba(139, 92, 246, 0.5)",
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        FLINKLY
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-8xl font-black opacity-10"
        style={{
          background: "linear-gradient(135deg, #14b8a6 0%, #ec4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 80px rgba(20, 184, 166, 0.5)",
        }}
        animate={{
          y: [0, 30, 0],
          rotate: [2, -2, 2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        FLINKLY
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-7xl font-black opacity-10"
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 80px rgba(251, 146, 60, 0.5)",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 20, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        FLINKLY
      </motion.div>

      {/* Radial Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
    </div>
  );
}
