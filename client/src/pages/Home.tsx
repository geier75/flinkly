import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Star, CheckCircle, ArrowRight, Play } from "lucide-react";
import MetaTags from "@/components/MetaTags";
import { OrganizationSchema, WebSiteSchema, AggregateRatingSchema } from "@/components/SchemaOrg";
import { VideoScene } from "@/components/webgl/VideoScene";

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

      {/* Hero Section with WebGL Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* WebGL Video Background */}
        <div className="absolute inset-0 z-0">
          <VideoScene
            videoSrc="/videos/hero-collaboration.mp4"
            blendMode="overlay"
            opacity={0.2}
            className="w-full h-full"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 z-0" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
              DIGITALE EXPERTISE.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 animate-gradient">
                SOFORT VERFÜGBAR.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Verbinde dich mit <span className="font-bold text-teal-400">verifizierten Experten</span> für digitale Dienstleistungen. 
              Von Webdesign bis Social Media Marketing – <span className="font-bold text-emerald-400">schnell, sicher, transparent</span>.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/marketplace">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 font-bold"
                >
                  Jetzt Experten finden
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-12 py-8 rounded-2xl border-2 border-slate-700 hover:border-teal-500 hover:bg-teal-500/10 text-white transition-all duration-300 font-bold backdrop-blur-sm"
                >
                  Als Experte registrieren
                </Button>
              </a>
            </div>

            {/* Trust Bar */}
            <div className="mt-16 flex justify-center items-center gap-12 text-slate-400 flex-wrap">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-teal-400" />
                <span className="text-base">2.000+ erfolgreiche Projekte</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-teal-400 fill-teal-400" />
                <span className="text-base">4.8/5 Durchschnittsbewertung</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-teal-400" />
                <span className="text-base">DSGVO-konform & sicher</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with WebGL Video Background */}
      <section className="relative py-32 overflow-hidden">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                image: "/images/service-design.jpg",
                title: "Design & Kreation",
                description: "Logo-Design, Branding, UI/UX, Illustration, Video-Editing"
              },
              {
                image: "/images/service-development.jpg",
                title: "Development",
                description: "Web-Development, App-Development, WordPress, Shopify"
              },
              {
                image: "/images/service-marketing.jpg",
                title: "Marketing",
                description: "Social Media, SEO, Content-Marketing, Google Ads"
              },
              {
                image: "/images/service-content.jpg",
                title: "Content & Text",
                description: "Copywriting, Blog-Artikel, Übersetzungen, Lektorat"
              },
              {
                image: "/images/service-business.jpg",
                title: "Business",
                description: "Virtuelle Assistenz, Buchhaltung, Projektmanagement"
              },
              {
                image: "/images/service-technology.jpg",
                title: "Technologie",
                description: "Data Science, AI/ML, Blockchain, Cloud-Services"
              }
            ].map((service, index) => (
              <Card 
                key={index}
                className="relative bg-slate-900/30 border-2 border-slate-700/50 hover:border-teal-500/50 transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 backdrop-blur-xl group overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.2),0_20px_25px_rgba(0,0,0,0.15),0_0_40px_rgba(20,184,166,0.1)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.2),0_30px_40px_rgba(0,0,0,0.3),0_50px_60px_rgba(0,0,0,0.25),0_0_80px_rgba(20,184,166,0.4)] cursor-pointer"
              >
                {/* Animated Gradient Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 group-hover:from-teal-500/30 group-hover:via-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-700 -z-10 animate-pulse" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                {/* Radial Glow on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.1) 0%, transparent 70%)' }} />
                
                <CardContent className="p-0 relative z-10">
                  {/* Image Container with Advanced Ken Burns + 3D Tilt Effect */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.15] group-hover:brightness-[1.15] group-hover:contrast-[1.05] group-hover:saturate-[1.1]"
                      style={{
                        transformOrigin: 'center center'
                      }}
                    />
                    {/* Dynamic Overlay Gradient with Color Shift */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-30 group-hover:from-teal-900/50 group-hover:via-slate-900/40 transition-all duration-700" />
                    
                    {/* Glowing Edge Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_60px_rgba(20,184,166,0.3)]" />
                  </div>
                  
                  {/* Content with Staggered Animation */}
                  <div className="p-8">
                    <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300">{service.title}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-all duration-300 delay-75">{service.description}</p>
                    
                    {/* Hover Arrow Indicator */}
                    <div className="mt-6 flex items-center gap-2 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 delay-100">
                      <span className="text-sm font-bold">Mehr erfahren</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/marketplace">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-lg px-12 py-7 rounded-2xl shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 font-bold"
              >
                Alle Kategorien entdecken
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Video Background */}
      <section className="relative py-32 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <VideoScene
            videoSrc="/videos/testimonials-success.mp4"
            blendMode="overlay"
            opacity={0.15}
            className="w-full h-full"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              ERFOLGSGESCHICHTEN
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                UNSERER KUNDEN
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Über 2.000 erfolgreiche Projekte. Höre, was unsere Kunden sagen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Sarah M.",
                role: "Gründerin, TechStart GmbH",
                text: "Flinkly hat uns geholfen, innerhalb von 2 Wochen einen professionellen Webauftritt zu launchen. Die Qualität war hervorragend!",
                rating: 5
              },
              {
                name: "Michael K.",
                role: "Marketing Manager, E-Commerce",
                text: "Die Auswahl an Experten ist beeindruckend. Wir haben schnell den perfekten Social Media Manager gefunden.",
                rating: 5
              },
              {
                name: "Lisa W.",
                role: "Freelance Designerin",
                text: "Als Seller liebe ich die Plattform. Faire Gebühren, schnelle Auszahlungen und tolle Kunden.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-slate-900/70 border-slate-800 backdrop-blur-md hover:border-teal-500/50 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-teal-400 text-teal-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              BEREIT ZU STARTEN?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Werde Teil von Deutschlands führendem Marktplatz für digitale Expertise.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/marketplace">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 font-bold"
                >
                  Jetzt Experten finden
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-12 py-8 rounded-2xl border-2 border-slate-700 hover:border-teal-500 hover:bg-teal-500/10 text-white transition-all duration-300 font-bold backdrop-blur-sm"
                >
                  Als Experte registrieren
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

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
