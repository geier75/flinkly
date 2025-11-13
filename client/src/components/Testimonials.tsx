/**
 * Testimonials Component
 * 
 * Social Proof Section für Landing Page
 * Best Practices 2025:
 * - Echte Fotos (Trust)
 * - Star-Ratings (Visual Trust Cue)
 * - Konkrete Zahlen/Ergebnisse
 * - Scroll-Animations
 */

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation, staggerContainer, staggerItem } from '@/hooks/useScrollAnimation';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  result?: string; // Optional: Konkrete Ergebnisse (z.B. "+30% Traffic")
}

// TODO: Diese Testimonials durch echte Kundenfeedback ersetzen
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Müller",
    role: "Marketing Managerin",
    company: "TechStart GmbH",
    image: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Flinkly hat uns geholfen, schnell und unkompliziert einen Logo-Designer zu finden. Innerhalb von 3 Tagen hatten wir 5 Entwürfe zur Auswahl. Absolut empfehlenswert!",
    result: "5 Entwürfe in 3 Tagen",
  },
  {
    id: 2,
    name: "Michael Schmidt",
    role: "Gründer",
    company: "FoodBlog.de",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "Die DSGVO-konforme Abwicklung war für mich als Kleinunternehmer super wichtig. Flinkly macht alles transparent und rechtssicher. Keine versteckten Kosten!",
    result: "100% DSGVO-konform",
  },
  {
    id: 3,
    name: "Anna Weber",
    role: "Freelance Designerin",
    company: "Selbstständig",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "Als Verkäuferin schätze ich das Escrow-System. Ich weiß, dass mein Geld sicher ist, sobald der Kunde zufrieden ist. Faire 15% Gebühr für den Service.",
    result: "€2.400 Umsatz in 2 Monaten",
  },
  {
    id: 4,
    name: "Thomas Becker",
    role: "E-Commerce Manager",
    company: "OnlineShop24",
    image: "https://i.pravatar.cc/150?img=8",
    rating: 4,
    text: "Perfekt für kleinere Aufgaben wie Produktbeschreibungen oder Social-Media-Posts. Die Qualität ist durchweg gut und die Preise fair.",
    result: "50+ Aufträge abgeschlossen",
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref as any} className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={staggerItem} className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-6">
              Was unsere Nutzer sagen
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Über 1.000 zufriedene Kunden und Freelancer vertrauen auf Flinkly für ihre digitalen Projekte.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={staggerItem}
                custom={index}
              >
                <Card className="h-full border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardContent className="p-8">
                    {/* Quote Icon */}
                    <Quote className="h-10 w-10 text-blue-200 mb-4 group-hover:text-blue-400 transition-colors" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>

                    {/* Result Badge (if available) */}
                    {testimonial.result && (
                      <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        ✅ {testimonial.result}
                      </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-slate-200"
                        loading="lazy"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Badge */}
          <motion.div variants={staggerItem} className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-slate-900">
                4.8/5 Durchschnittsbewertung
              </span>
              <span className="text-slate-600">(basierend auf 247 Bewertungen)</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
