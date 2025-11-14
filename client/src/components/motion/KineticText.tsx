import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KineticTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "word" | "letter";
}

/**
 * KineticText - Animated text reveal
 * 
 * Features:
 * - Word-by-word or letter-by-letter reveal
 * - Staggered animation
 * - Smooth fade + slide
 * - Configurable delay
 */
export default function KineticText({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  type = "word",
}: KineticTextProps) {
  const items = type === "word" ? children.split(" ") : children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96] as any,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.span key={index} variants={child} className="inline-block">
          {item}
          {type === "word" && index < items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}
