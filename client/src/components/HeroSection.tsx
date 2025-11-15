/**
 * Hero Section Component
 * 
 * Optimized Landing Page Hero mit:
 * - Scroll-Animations (Framer Motion)
 * - Performance-optimierte Gradients
 * - Accessibility (ARIA, reduced motion)
 * - Trust-Cues
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { getLoginUrl } from '@/const';
import { fadeInUp, fadeIn, staggerContainer, staggerItem } from '@/hooks/useScrollAnimation';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-32 text-center bg-gradient-to-b from-blue-50 to-white relative z-50">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight"
        >
          Kleine Gigs, <span className="text-blue-600">große Wirkung</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
        >
          Dein Marktplatz für schnelle, kreative & digitale Mikrodienstleistungen in der DACH-Region. Vertrauen, Einfachheit, Rechtssicherheit.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeIn}
          className="flex gap-6 justify-center flex-wrap"
        >
          <Link href="/marketplace">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 font-semibold"
              aria-label="Gig finden - Durchsuche unseren Marktplatz"
            >
              <span aria-hidden="true">🔍</span> Gig finden
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <a href={getLoginUrl()}>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-xl border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
              aria-label="Gig anbieten - Starte als Verkäufer"
            >
              <span aria-hidden="true">⭐</span> Gig anbieten
            </Button>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
