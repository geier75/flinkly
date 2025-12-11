import { motion } from "framer-motion";
import { APP_LOGO } from "@/const";

interface PopOutLogoProps {
  className?: string;
  size?: number; // Logo size in pixels, default 120
  delay?: number; // Animation delay in seconds, default 0.5
}

export function PopOutLogo({ 
  className = "", 
  size = 120,
  delay = 0.5 
}: PopOutLogoProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      initial={{
        scale: 0.3,
        z: -300,
        opacity: 0,
        rotateY: -45,
      }}
      animate={{
        scale: [0.3, 1.3, 1],
        z: [-300, 150, 0],
        opacity: [0, 1, 1],
        rotateY: [-45, 15, 0],
      }}
      transition={{
        duration: 2,
        delay,
        times: [0, 0.6, 1],
        ease: [0.34, 1.56, 0.64, 1], // Elastic ease-out
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-primary via-secondary to-accent p-4 rounded-2xl shadow-2xl"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: "0 0 60px rgba(139, 92, 246, 0.8), 0 0 100px rgba(249, 115, 22, 0.4)",
        }}
        animate={{
          boxShadow: [
            "0 0 60px rgba(139, 92, 246, 0.8), 0 0 100px rgba(249, 115, 22, 0.4)",
            "0 0 80px rgba(139, 92, 246, 1), 0 0 120px rgba(249, 115, 22, 0.6)",
            "0 0 60px rgba(139, 92, 246, 0.8), 0 0 100px rgba(249, 115, 22, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={APP_LOGO}
          alt="Flinkly"
          className="w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
          }}
        />
      </motion.div>

      {/* Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
            y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: 1.5,
            delay: delay + 1 + i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}
