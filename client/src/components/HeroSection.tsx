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
    <section className="container mx-auto px-4 py-32 text-center bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-7xl font-black text-slate-900 mb-8 leading-tight"
        >
          Kleine Gigs, <span className="text-blue-600">große Wirkung</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-2xl text-slate-700 mb-12 leading-relaxed max-w-3xl mx-auto"
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
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
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
              className="text-lg px-10 py-7 rounded-xl border-2 border-slate-300 hover:border-green-600 hover:bg-green-50 transition-all duration-200"
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
