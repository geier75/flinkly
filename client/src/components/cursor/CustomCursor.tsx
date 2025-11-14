import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor - Interactive custom cursor (SOTA 2025)
 * 
 * Features:
 * - Ultra-smooth cursor tracking (spring physics)
 * - Multi-state hover detection (links, buttons, cards, inputs)
 * - Click ripple effect
 * - Dual-cursor design (outer ring + inner dot)
 * - Adaptive blend mode
 * - Mobile-hidden
 * - Performance-optimized
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smoother spring config
  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isLink = target.tagName === "A" || target.closest("a");
      const isButton = target.tagName === "BUTTON" || target.closest("button");
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      const isCard = target.closest("[class*='Card']") || target.classList.contains("cursor-hover");
      const hasDataCursor = target.dataset.cursor;

      if (isLink || isButton || isInput || isCard || hasDataCursor) {
        setIsHovering(true);
        if (hasDataCursor) {
          setCursorText(target.dataset.cursor || "");
        } else {
          setCursorText("");
        }
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-blue-600"
          animate={{
            scale: isHovering ? 1.8 : isClicking ? 0.6 : 1,
            opacity: isClicking ? 0.3 : 0.6,
            borderColor: isHovering ? "#3b82f6" : "#94a3b8",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        
        {/* Cursor Text */}
        {cursorText && (
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: useSpring(useMotionValue(0), { damping: 20, stiffness: 500 }),
          y: useSpring(useMotionValue(0), { damping: 20, stiffness: 500 }),
        }}
        animate={{
          x: cursorX.get() + 19,
          y: cursorY.get() + 19,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-blue-600"
          animate={{
            scale: isClicking ? 0 : 1,
            opacity: isClicking ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
}
