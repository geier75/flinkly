import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Star, CheckCircle, ArrowRight, Play, Sparkles } from "lucide-react";
import MetaTags from "@/components/MetaTags";
import { OrganizationSchema, WebSiteSchema, AggregateRatingSchema } from "@/components/SchemaOrg";
import { VideoScene } from "@/components/webgl/VideoScene";
import { useParallaxScroll, useMultiLayerParallax } from "@/hooks/useParallaxScroll";
import { motion } from "framer-motion";
import ServiceCardsFan from "@/components/ServiceCardsFan";
import { ValueCardCarousel } from "@/components/ValueCardCarousel";
import F1RaceStart from "@/components/F1RaceStart";


function HeroSection() {
  const { ref, scrollYProgress } = useParallaxScroll();
  const parallax = useMultiLayerParallax(scrollYProgress);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* WebGL Video Background Layer (Slowest Parallax) */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y: parallax.background.y,
          opacity: parallax.background.opacity,
          willChange: 'transform, opacity',
        }}
      >
        <VideoScene
          videoSrc="/videos/hero-collaboration.mp4"
          blendMode="overlay"
          opacity={0.7}
          brightness={1.8}
          contrast={1.25}
          saturation={1.3}
          className="w-full h-full scale-110"
        />
      </motion.div>

      {/* Gradient Overlay Layer (Medium Parallax) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-violet-950/25 via-violet-900/15 to-violet-950/30 z-0"
        style={{
          y: parallax.middle.y,
          opacity: parallax.middle.opacity,
          willChange: 'transform, opacity',
        }}
      />



      {/* Content Layer (Fastest Parallax) */}
      <motion.div 
        className="container mx-auto px-4 relative z-10 text-center"
        style={{
          y: parallax.foreground.y,
          opacity: parallax.foreground.opacity,
          scale: parallax.foreground.scale,
          willChange: 'transform, opacity',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            <span className="animated-gradient-text">
              DIGITALE EXPERTISE.
            </span>
            <br />
            <span className="animated-gradient-text">
              SOFORT VERFÜGBAR.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Verbinde dich mit <span className="font-bold text-accent">verifizierten Experten</span> für digitale Dienstleistungen. 
            Von Webdesign bis Social Media Marketing – <span className="font-bold text-accent">schnell, sicher, transparent</span>.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/marketplace">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 font-bold"
              >
                Jetzt Experten finden
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <a href={getLoginUrl()}>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-12 py-8 rounded-2xl border-2 border-primary/50 hover:border-primary hover:bg-primary/20 text-white transition-all duration-300 font-bold backdrop-blur-sm"
              >
                Als Experte registrieren
              </Button>
            </a>
          </div>

          {/* Trust Bar */}
          <div className="mt-16 flex justify-center items-center gap-12 text-slate-400 flex-wrap">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-base">🚀 Beta-Phase - Sei einer der Ersten!</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-success fill-success" />
              <span className="text-base">100% DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-secondary" />
              <span className="text-base">Made in Germany 🇩🇪</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <OrganizationSchema
        name="Flinkly"
        url="https://flinkly.com"
        logo="https://flinkly.com/logo.png"
        description="Deutschlands führender Marktplatz für digitale Mikrodienstleistungen"
      />
      <WebSiteSchema
        name="Flinkly"
        url="https://flinkly.com"
      />
      <AggregateRatingSchema
        ratingValue={4.8}
        reviewCount={247}
      />

      {/* Meta Tags */}
      <MetaTags
        title="Flinkly - Dein Marktplatz für digitale Expertise"
        description="Finde qualifizierte Experten für digitale Dienstleistungen. Von Webdesign bis Social Media Marketing. Schnell, sicher, transparent."
      />

      {/* Hero Section with WebGL Video Background + Parallax */}
      <HeroSection />

      {/* Services Section with WebGL Video Background */}
      <section className="relative py-32 overflow-hidden -mt-48">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <VideoScene
            videoSrc="/videos/services-expertise.mp4"
            blendMode="overlay"
            opacity={0.1}
            className="w-full h-full"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              DEINE EXPERTISE.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                UNSER MARKTPLATZ.
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Von Webdesign bis Social Media Marketing - finde die perfekte Lösung für dein Projekt.
            </p>
          </div>

          <ServiceCardsFan />

          {/* "Alle Kategorien entdecken" Button */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button
              onClick={() => window.location.href = '/marketplace'}
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg">Alle Kategorien entdecken</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section with FLINKLY Video Background */}
      <section className="relative py-32 overflow-hidden -mt-48">
        {/* FLINKLY Video Background (HELLER!) */}
        <div className="absolute inset-0 z-0">
          <VideoScene
            videoSrc="/videos/testimonials-flinkly.mp4"
            blendMode="overlay"
            opacity={0.25}
            brightness={1.4}
            contrast={1.15}
            saturation={1.25}
            className="w-full h-full scale-110"
          />
        </div>

        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/80 z-[1]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-6 py-3 rounded-full mb-8 backdrop-blur-sm">
              <span className="text-2xl">🚀</span>
              <span className="text-primary font-bold">Beta-Phase - Sei dabei von Anfang an!</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6" style={{
              textShadow: '0 0 40px rgba(20, 184, 166, 0.3), 0 0 80px rgba(20, 184, 166, 0.2)'
            }}>
              WARUM FLINKLY
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400">
                ANDERS IST
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ehrlich, transparent und fair - das sind unsere Werte von Tag 1.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "",
                title: "Faire Gebühren",
                text: "Nur 15% Provision statt 20% wie bei Fiverr. Mehr Geld für deine Arbeit.",
                highlight: "15% statt 20%",
                images: [
                  "/images/value-fair-fees-1.jpg",
                  "/images/value-fair-fees-2.jpg",
                  "/images/value-fair-fees-3.jpg"
                ]
              },
              {
                icon: "",
                title: "DACH-Fokus",
                text: "Deutsch, Qualität, DSGVO-konform. Für den deutschsprachigen Markt gebaut.",
                highlight: "DACH-Region",
                images: [
                  "/images/value-dach-focus-1.jpg",
                  "/images/dach-switzerland.jpg",
                  "/images/dach-austria.jpg"
                ]
              },
              {
                icon: "",
                title: "Transparenz",
                text: "Keine versteckten Kosten, ehrliche Kommunikation. Was du siehst, ist was du bekommst.",
                highlight: "100% Ehrlich",
                images: [
                  "/images/value-transparency-1.jpg",
                  "/images/value-transparency-2.jpg",
                  "/images/value-transparency-3.jpg"
                ]
              }
            ].map((value, index) => (
              <Card 
                key={index}
                className="relative bg-slate-900/40 border-2 border-slate-700/50 hover:border-teal-500/80 backdrop-blur-xl group overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(20,184,166,0.5),0_0_100px_rgba(20,184,166,0.3)] cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                {/* Animated Gradient Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <CardContent className="p-0 relative z-10 overflow-hidden">
                  {/* Image Carousel */}
                  <ValueCardCarousel
                    images={value.images}
                    icon={value.icon}
                    title={value.title}
                  />
                  
                  {/* Content */}
                  <div className="p-8">
                  
                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight group-hover:text-accent transition-colors duration-300">
                    {value.title}
                  </h3>
                  
                  {/* Highlight Badge */}
                  <div className="inline-block bg-accent/20 border border-accent/40 px-4 py-2 rounded-full mb-4">
                    <span className="text-accent font-bold text-sm">{value.highlight}</span>
                  </div>
                  
                  {/* Text */}
                  <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {value.text}
                  </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with F1 Start Animation */}
      <CTASection />

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Über Flinkly</h3>
              <p className="text-slate-400 text-sm">
                Deutschlands führender Marktplatz für digitale Mikrodienstleistungen in der DACH-Region.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Kategorien</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/marketplace?category=design">Design & Kreation</Link></li>
                <li><Link href="/marketplace?category=development">Development</Link></li>
                <li><Link href="/marketplace?category=marketing">Marketing</Link></li>
                <li><Link href="/marketplace?category=content">Content & Text</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/how-it-works">So funktioniert's</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Rechtliches</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/impressum">Impressum</Link></li>
                <li><Link href="/privacy">Datenschutz</Link></li>
                <li><Link href="/terms">AGB</Link></li>
                <li><Link href="/widerruf">Widerrufsbelehrung</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
            © 2025 Flinkly. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * CTA Section with F1 Video Background
 */
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* F1-Canvas-Animation-Hintergrund */}
      <div className="absolute inset-0 z-0">
        <F1RaceStart />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-green-500/10 z-0" />
      
      {/* Content DARÜBER */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-5xl md:text-6xl font-black text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            BEREIT ZU STARTEN?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Werde Teil von Deutschlands führendem Marktplatz für digitale Expertise.
          </motion.p>
          
          <motion.div 
            className="flex gap-6 justify-center flex-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/marketplace">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 font-bold"
              >
                Jetzt Experten finden
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <a href={getLoginUrl()}>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-12 py-8 rounded-2xl border-2 border-primary/50 hover:border-primary hover:bg-primary/20 text-white transition-all duration-300 font-bold backdrop-blur-sm"
              >
                Als Experte registrieren
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
