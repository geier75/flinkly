import { ReactNode } from "react";
import { motion } from "framer-motion";
import { VideoScene } from "@/components/webgl/VideoScene";

interface PremiumPageLayoutProps {
  children: ReactNode;
  videoSrc?: string;
  title?: string;
  subtitle?: string;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{ label: string; href: string }>;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "full";
  className?: string;
}

/**
 * PremiumPageLayout - Wiederverwendbares Layout für alle Seiten
 * Enthält: Video-Background, Glassmorphism, Gradient-Overlays, Premium-Animations
 */
export function PremiumPageLayout({
  children,
  videoSrc = "/videos/marketplace-luxury.mp4",
  title,
  subtitle,
  showBreadcrumbs = false,
  breadcrumbs = [],
  maxWidth = "7xl",
  className = "",
}: PremiumPageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className="min-h-screen relative bg-[#0f0c1f]">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <VideoScene
          videoSrc={videoSrc}
          blendMode="overlay"
          opacity={0.15}
          brightness={1.5}
          contrast={1.2}
          saturation={1.2}
          className="w-full h-full scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/60 via-slate-900/80 to-slate-950/90" />
      </div>

      {/* Content Container */}
      <div className={`relative z-10 ${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24 ${className}`}>
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-slate-500">/</span>}
                  <a
                    href={crumb.href}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* Page Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            {title && (
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span
                  className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                  style={{
                    textShadow: "0 0 60px rgba(139, 92, 246, 0.4)",
                  }}
                >
                  {title}
                </span>
              </h1>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * PremiumCard - Wiederverwendbare Glassmorphism-Card
 */
interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function PremiumCard({
  children,
  className = "",
  hover = true,
  glow = true,
}: PremiumCardProps) {
  return (
    <div
      className={`
        relative bg-slate-900/40 backdrop-blur-xl 
        border-2 border-slate-700/50 
        ${hover ? "hover:border-primary" : ""}
        rounded-2xl overflow-hidden
        shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)]
        ${hover ? "hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(139,92,246,0.5),0_0_100px_rgba(139,92,246,0.3)]" : ""}
        transition-all duration-500
        group
        ${className}
      `}
    >
      {/* Shimmer Effect */}
      {hover && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover Glow Effect */}
      {glow && hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        </div>
      )}
    </div>
  );
}

/**
 * PremiumSection - Wiederverwendbare Section mit Spacing
 */
interface PremiumSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

export function PremiumSection({
  children,
  className = "",
  spacing = "md",
}: PremiumSectionProps) {
  const spacingClasses = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
  };

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}
