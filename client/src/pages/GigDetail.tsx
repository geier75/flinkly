import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoScene } from "@/components/webgl/VideoScene";
import MetaTags from "@/components/MetaTags";
import { SEO, generateProductSchema, generateBreadcrumbSchema } from "@/components/SEO";
import { 
  Star, 
  Clock, 
  TrendingUp, 
  Check, 
  Heart, 
  Share2, 
  MessageCircle,
  Shield,
  Zap,
  Award,
  X,
  ChevronDown,
  CheckCircle2,
  Timer,
  Target
} from "lucide-react";

export default function GigDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const gigId = id ? parseInt(id) : 0;

  const { data: gig, isLoading } = trpc.gigs.getById.useQuery({ id: gigId });
  const { data: reviews } = trpc.reviews.getGigReviews.useQuery({ gigId });

  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined;

  // Generate Schema.org Product markup
  const productSchema = gig ? generateProductSchema({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    price: gig.price,
    seller: { name: "Flinkly Seller" }, // TODO: Fetch seller name from sellerId
    rating: avgRating,
    reviewCount: reviews?.length || 0,
  }) : undefined;

  // Generate Breadcrumb schema
  const breadcrumbSchema = gig ? generateBreadcrumbSchema([
    { name: "Home", url: "https://flinkly.de" },
    { name: "Marketplace", url: "https://flinkly.de/marketplace" },
    { name: gig.category, url: `https://flinkly.de/marketplace?category=${gig.category}` },
    { name: gig.title, url: `https://flinkly.de/gig/${gig.id}` },
  ]) : undefined;

  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Wie läuft der Bestellprozess ab?",
      answer: "Nach der Bestellung erhältst du ein Briefing-Formular. Ich starte sofort mit der Arbeit und halte dich regelmäßig auf dem Laufenden. Du kannst jederzeit Feedback geben."
    },
    {
      question: "Kann ich Änderungen anfordern?",
      answer: "Ja! Je nach Paket hast du 2-5 Revisionen inklusive. Ich arbeite so lange, bis du 100% zufrieden bist. Premium-Paket bietet unbegrenzte Revisionen."
    },
    {
      question: "Welche Dateiformate erhalte ich?",
      answer: "Du erhältst alle Quelldateien (AI, PSD, PDF, PNG, JPG) sowie exportierte Versionen in verschiedenen Größen. Alle Dateien sind optimiert für Web und Print."
    },
    {
      question: "Was passiert, wenn ich nicht zufrieden bin?",
      answer: "Deine Zufriedenheit ist garantiert! Falls du nicht zufrieden bist, arbeite ich weiter bis es passt. Bei grundsätzlichen Problemen greift unser Käuferschutz."
    },
    {
      question: "Kann ich die Lieferzeit verkürzen?",
      answer: "Ja, gegen Aufpreis biete ich Express-Lieferung an. Kontaktiere mich vor der Bestellung, um die Verfügbarkeit zu prüfen."
    }
  ];

  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: gig?.price || 0,
      deliveryDays: gig?.deliveryDays || 3,
      features: [
        "1 Konzept",
        "2 Revisionen",
        "Quelldateien",
        "Kommerzielle Nutzung"
      ]
    },
    {
      id: "standard",
      name: "Standard",
      price: (gig?.price || 0) * 2,
      deliveryDays: Math.max((gig?.deliveryDays || 3) - 1, 1),
      features: [
        "3 Konzepte",
        "5 Revisionen",
        "Quelldateien",
        "Kommerzielle Nutzung",
        "Social Media Kit"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: (gig?.price || 0) * 3,
      deliveryDays: Math.max((gig?.deliveryDays || 3) - 2, 1),
      features: [
        "5 Konzepte",
        "Unbegrenzte Revisionen",
        "Quelldateien",
        "Kommerzielle Nutzung",
        "Social Media Kit",
        "Brand Guidelines",
        "Priority Support"
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl">Lädt...</div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Gig nicht gefunden</h1>
          <Link href="/marketplace">
            <Button className="bg-primary hover:bg-primary/90">Zurück zum Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedPkg = packages.find(p => p.id === selectedPackage) || packages[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <SEO
        title={gig.title}
        description={gig.description}
        image={gig.imageUrl || undefined}
        url={`https://flinkly.de/gig/${gig.id}`}
        type="product"
        schema={{
          "@graph": [productSchema, breadcrumbSchema],
        }}
      />
      <MetaTags 
        title={`${gig.title} | Flinkly`}
        description={gig.description}
        type="website"
      />

      {/* Full-Screen Video Background */}
      <div className="fixed inset-0 z-0">
        <VideoScene
          videoSrc="/videos/marketplace-luxury.mp4"
          blendMode="overlay"
          opacity={0.15}
          brightness={1.5}
          contrast={1.2}
          saturation={1.2}
          className="w-full h-full scale-110"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-violet-950/60 via-slate-900/80 to-slate-950/90 z-[1]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
                <span>/</span>
                <span className="text-white">{gig.title}</span>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Gig Image */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-96 overflow-hidden">
                        <img
                          src={gig.imageUrl || "/placeholder.jpg"}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70" />
                        
                        {/* Category Badge */}
                        <Badge className="absolute top-4 left-4 bg-primary/90 text-white border-0 backdrop-blur-sm">
                          {gig.category}
                        </Badge>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-slate-900/60 backdrop-blur-sm border-slate-700 hover:border-primary text-white"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-slate-900/60 backdrop-blur-sm border-slate-700 hover:border-primary text-white"
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Title & Description */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-6" style={{
                    textShadow: '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)'
                  }}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                      {gig.title}
                    </span>
                  </h1>

                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-success fill-success" />
                      <span className="text-white font-bold">
                        {gig.averageRating ? Number(gig.averageRating).toFixed(1) : "5.0"}
                      </span>
                      <span className="text-slate-400">({gig.completedOrders || 0} Bewertungen)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <TrendingUp className="h-5 w-5" />
                      <span>{gig.completedOrders || 0} Bestellungen</span>
                    </div>
                  </div>

                  <p className="text-lg text-slate-300 leading-relaxed">
                    {gig.description}
                  </p>
                </motion.div>

                {/* About This Gig */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6">Über dieses Gig</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed mb-4">
                          Ich erstelle professionelle Designs, die deine Marke zum Leben erwecken. Mit über 5 Jahren Erfahrung 
                          im Bereich Design & Kreation habe ich bereits hunderte zufriedene Kunden betreut.
                        </p>
                        <p className="text-slate-300 leading-relaxed mb-4">
                          Mein Prozess ist transparent und kollaborativ. Du erhältst regelmäßige Updates und kannst jederzeit 
                          Feedback geben. Ich arbeite so lange an deinem Projekt, bis du 100% zufrieden bist.
                        </p>
                        <h3 className="text-xl font-bold text-white mb-4">Was du erhältst:</h3>
                        <ul className="space-y-2 text-slate-300">
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                            <span>Professionelles Design nach deinen Wünschen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                            <span>Alle Quelldateien (AI, PSD, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                            <span>Kommerzielle Nutzungsrechte</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                            <span>Schnelle Kommunikation & Support</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6">Häufig gestellte Fragen</h2>
                      <div className="space-y-3">
                        {faqItems.map((faq, index) => (
                          <div key={index} className="border border-slate-700/50 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors duration-200"
                            >
                              <span className="font-bold text-white">{faq.question}</span>
                              <ChevronDown 
                                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                                  expandedFaq === index ? "rotate-180" : ""
                                }`} 
                              />
                            </button>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-4 pb-4"
                              >
                                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6">Bewertungen</h2>
                      <div className="space-y-6">
                        {reviews && reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                  U
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-bold text-white">User</p>
                                      <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star 
                                            key={star} 
                                            className={`h-4 w-4 ${
                                              star <= review.rating 
                                                ? "text-success fill-success" 
                                                : "text-slate-600"
                                            }`} 
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <span className="text-sm text-slate-400">
                                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("de-DE") : ""}
                                    </span>
                                  </div>
                                  <p className="text-slate-300">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-center py-4">Noch keine Bewertungen</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="sticky top-24 space-y-6"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Package Selection */}
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Paket auswählen</h3>
                      
                      {/* Package Tabs */}
                      <div className="flex gap-2 mb-6">
                        {packages.map((pkg) => (
                          <button
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg.id as any)}
                            className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
                              selectedPackage === pkg.id
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "bg-slate-800/50 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pkg.name}
                          </button>
                        ))}
                      </div>

                      {/* Package Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Preis</span>
                          <span className="text-3xl font-black text-white">{selectedPkg.price}€</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Lieferzeit</span>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-success" />
                            <span className="text-white font-bold">{selectedPkg.deliveryDays} Tage</span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {selectedPkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Button 
                          size="lg"
                          className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300"
                        >
                          Jetzt bestellen
                        </Button>
                      </motion.div>

                      <Button 
                        size="lg"
                        variant="outline"
                        className="w-full mt-3 border-slate-700 hover:border-primary text-white bg-slate-900/40 backdrop-blur-sm"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Nachricht senden
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Seller Stats */}
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Seller Performance</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Timer className="h-5 w-5 text-primary" />
                            <span className="text-slate-300">Antwortzeit</span>
                          </div>
                          <span className="font-bold text-white">&lt; 1 Std.</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-success" />
                            <span className="text-slate-300">Abschlussrate</span>
                          </div>
                          <span className="font-bold text-white">98%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span className="text-slate-300">Pünktliche Lieferung</span>
                          </div>
                          <span className="font-bold text-white">100%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            <span className="text-slate-300">Abgeschlossene Aufträge</span>
                          </div>
                          <span className="font-bold text-white">{gig.completedOrders || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badges */}
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Sicherheit & Vertrauen</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="font-bold text-white">Käuferschutz</p>
                            <p className="text-sm text-slate-400">Geld-zurück-Garantie</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-white">Schnelle Lieferung</p>
                            <p className="text-sm text-slate-400">Pünktlich oder kostenlos</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <Award className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-white">Top-Rated Seller</p>
                            <p className="text-sm text-slate-400">Verifizierter Experte</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
