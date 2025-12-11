import { ReactNode, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
}

/**
 * HolographicCard - 3D holographic card with parallax effect
 * 
 * Creates a floating, glowing card that responds to mouse movement
 */
export function HolographicCard({
  children,
  className = "",
  glowColor = "violet",
  intensity = "medium",
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const glowIntensity = {
    low: { blur: 20, opacity: 0.3 },
    medium: { blur: 40, opacity: 0.5 },
    high: { blur: 60, opacity: 0.7 },
  };

  const glowColors = {
    violet: "from-violet-500/30 via-purple-500/20 to-fuchsia-500/30",
    cyan: "from-cyan-500/30 via-blue-500/20 to-teal-500/30",
    emerald: "from-emerald-500/30 via-green-500/20 to-teal-500/30",
    amber: "from-amber-500/30 via-orange-500/20 to-yellow-500/30",
    rose: "from-rose-500/30 via-pink-500/20 to-red-500/30",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? glowIntensity[intensity].opacity : glowIntensity[intensity].opacity * 0.5,
          scale: isHovered ? 1.02 : 1,
        }}
        className={`
          absolute -inset-1 rounded-3xl blur-xl
          bg-gradient-to-br ${glowColors[glowColor as keyof typeof glowColors] || glowColors.violet}
        `}
        style={{ filter: `blur(${glowIntensity[intensity].blur}px)` }}
      />

      {/* Holographic border */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(
              45deg,
              transparent 30%,
              rgba(139, 92, 246, 0.3) 50%,
              transparent 70%
            )`,
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Card content */}
      <div
        className={`
          relative rounded-2xl overflow-hidden
          bg-slate-900/60 backdrop-blur-2xl
          border border-white/10
          shadow-2xl
        `}
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Scanline effect */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent pointer-events-none"
        />

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

        {children}
      </div>
    </motion.div>
  );
}

/**
 * DataOrb - Floating data visualization orb
 */
export function DataOrb({
  value,
  label,
  color = "violet",
  size = "md",
}: {
  value: string | number;
  label: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const colorClasses = {
    violet: "from-violet-500 to-purple-600",
    cyan: "from-cyan-500 to-blue-600",
    emerald: "from-emerald-500 to-green-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
  };

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotateY: [0, 360],
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
      }}
      className={`relative ${sizes[size]} flex items-center justify-center`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 rounded-full border-2 border-dashed opacity-30`}
        style={{ borderColor: color === "violet" ? "#8b5cf6" : color }}
      />

      {/* Inner orb */}
      <div
        className={`
          relative ${sizes[size]} rounded-full
          bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.violet}
          flex flex-col items-center justify-center
          shadow-2xl
        `}
        style={{
          boxShadow: `0 0 60px ${color === "violet" ? "rgba(139, 92, 246, 0.5)" : `${color}50`}`,
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* Content */}
        <span className="text-2xl font-bold text-white drop-shadow-lg">{value}</span>
        <span className="text-xs text-white/80 mt-1">{label}</span>
      </div>
    </motion.div>
  );
}

/**
 * EnergyBar - Animated progress bar with energy effect
 */
export function EnergyBar({
  value,
  max = 100,
  label,
  color = "violet",
}: {
  value: number;
  max?: number;
  label: string;
  color?: string;
}) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    violet: "from-violet-500 via-purple-500 to-fuchsia-500",
    cyan: "from-cyan-500 via-blue-500 to-indigo-500",
    emerald: "from-emerald-500 via-green-500 to-teal-500",
    amber: "from-amber-500 via-orange-500 to-red-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}/{max}</span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-800/50 overflow-hidden">
        {/* Background glow */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} blur-sm opacity-50`}
        />
        
        {/* Main bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`relative h-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} rounded-full`}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>

        {/* Energy particles */}
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg"
          style={{ left: `calc(${percentage}% - 4px)` }}
        />
      </div>
    </div>
  );
}
