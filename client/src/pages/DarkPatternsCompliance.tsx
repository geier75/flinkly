import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MousePointer,
  Clock,
  CreditCard,
  UserX,
  Repeat,
  MessageSquare,
  Scale
} from "lucide-react";

/**
 * Dark Patterns Compliance-Seite
 * 
 * Dokumentiert die Einhaltung von:
 * - DSA Art. 25: Verbot von Dark Patterns
 * - DSGVO Art. 7: Einwilligung muss freiwillig sein
 * - Verbraucherschutzrichtlinien
 * 
 * Dark Patterns sind manipulative UI-Designs, die Nutzer zu 
 * unbeabsichtigten Handlungen verleiten.
 */

const darkPatternTypes = [
  {
    name: "Nagging",
    icon: Repeat,
    description: "Wiederholte Aufforderungen, die Nutzer zu einer Handlung drängen",
    status: "compliant",
    implementation: "Keine wiederholten Pop-ups oder Aufforderungen. Cookie-Banner erscheint nur einmal."
  },
  {
    name: "Obstruction",
    icon: XCircle,
    description: "Erschwerung von Abmeldungen oder Kündigungen",
    status: "compliant",
    implementation: "Kontolöschung ist einfach über das Privacy Dashboard möglich. Keine versteckten Schritte."
  },
  {
    name: "Sneaking",
    icon: Eye,
    description: "Versteckte Kosten oder automatische Verlängerungen",
    status: "compliant",
    implementation: "Alle Preise sind transparent. Keine automatischen Verlängerungen ohne explizite Zustimmung."
  },
  {
    name: "Interface Interference",
    icon: MousePointer,
    description: "Manipulative Button-Gestaltung (z.B. 'Akzeptieren' größer als 'Ablehnen')",
    status: "compliant",
    implementation: "Cookie-Banner: Beide Buttons sind gleich groß und prominent. Keine Farbmanipulation."
  },
  {
    name: "Forced Action",
    icon: UserX,
    description: "Zwang zur Registrierung oder Datenfreigabe für Basisfunktionen",
    status: "compliant",
    implementation: "Marketplace-Browsing ohne Registrierung möglich. Nur für Käufe ist ein Konto erforderlich."
  },
  {
    name: "Social Proof Manipulation",
    icon: MessageSquare,
    description: "Gefälschte Bewertungen oder Nutzerzahlen",
    status: "compliant",
    implementation: "Alle Bewertungen stammen von verifizierten Käufern. Keine gefälschten Testimonials."
  },
  {
    name: "Urgency",
    icon: Clock,
    description: "Künstliche Zeitdruckszenarien ('Nur noch 2 verfügbar!')",
    status: "compliant",
    implementation: "Keine falschen Countdown-Timer oder künstliche Knappheit. Echte Verfügbarkeit wird angezeigt."
  },
  {
    name: "Confirmshaming",
    icon: AlertTriangle,
    description: "Beschämende Formulierungen bei Ablehnung ('Nein, ich möchte kein Geld sparen')",
    status: "compliant",
    implementation: "Neutrale Formulierungen bei allen Optionen. 'Ablehnen' statt beschämender Alternativen."
  },
  {
    name: "Hidden Costs",
    icon: CreditCard,
    description: "Versteckte Gebühren, die erst im Checkout erscheinen",
    status: "compliant",
    implementation: "Alle Gebühren (inkl. Servicegebühr) sind von Anfang an sichtbar. Keine versteckten Kosten."
  },
  {
    name: "Pre-selection",
    icon: CheckCircle,
    description: "Vorab aktivierte Checkboxen für Newsletter oder Extras",
    status: "compliant",
    implementation: "Keine vorab aktivierten Checkboxen. Alle Opt-ins erfordern aktive Zustimmung."
  }
];

export default function DarkPatternsCompliance() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link href="/terms">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu den AGB
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dark Patterns Compliance</h1>
              <p className="text-slate-400">
                Transparenz über unsere UI/UX-Praktiken gemäß DSA Art. 25
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border-emerald-500/30">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Was sind Dark Patterns?</h2>
                <p className="text-slate-300 mb-4">
                  Dark Patterns sind manipulative Designpraktiken, die Nutzer zu unbeabsichtigten 
                  Handlungen verleiten – etwa zum Kauf ungewollter Produkte, zur Preisgabe persönlicher 
                  Daten oder zur Zustimmung zu unvorteilhaften Bedingungen.
                </p>
                <p className="text-slate-300">
                  Der <strong className="text-white">Digital Services Act (DSA) Art. 25</strong> verbietet 
                  Online-Plattformen ausdrücklich die Verwendung von Dark Patterns. Flinkly verpflichtet 
                  sich zur vollständigen Einhaltung dieser Vorschrift.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Basis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Scale className="h-6 w-6 text-blue-400" />
                  Rechtsgrundlagen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">DSA Art. 25</h4>
                    <p className="text-sm text-slate-400">
                      Verbot von Dark Patterns auf Online-Plattformen. Nutzer dürfen nicht durch 
                      irreführende Gestaltung zu Entscheidungen verleitet werden.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">DSGVO Art. 7</h4>
                    <p className="text-sm text-slate-400">
                      Einwilligung muss freiwillig, spezifisch, informiert und unmissverständlich sein. 
                      Keine Kopplung an andere Dienste.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dark Pattern Audit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  UI/UX-Audit: Dark Pattern Prüfung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6">
                  Wir haben unsere Plattform auf alle bekannten Dark Pattern-Typen geprüft. 
                  Hier ist das Ergebnis unserer Selbstprüfung:
                </p>
                
                <div className="space-y-4">
                  {darkPatternTypes.map((pattern, index) => {
                    const Icon = pattern.icon;
                    return (
                      <motion.div
                        key={pattern.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            pattern.status === "compliant" 
                              ? "bg-emerald-500/20" 
                              : "bg-red-500/20"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              pattern.status === "compliant" 
                                ? "text-emerald-400" 
                                : "text-red-400"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">{pattern.name}</h4>
                              {pattern.status === "compliant" ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                  ✓ Konform
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  ✗ Nicht konform
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mb-2">{pattern.description}</p>
                            <p className="text-sm text-slate-300">
                              <strong className="text-emerald-400">Unsere Umsetzung:</strong> {pattern.implementation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specific Implementations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Eye className="h-6 w-6 text-purple-400" />
                  Konkrete Maßnahmen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Cookie-Banner</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• "Alle akzeptieren" und "Alle ablehnen" gleich groß</li>
                      <li>• Beide Buttons gleich prominent (farbig)</li>
                      <li>• Granulare Einstellungen leicht zugänglich</li>
                      <li>• Keine vorab aktivierten Optionen</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Checkout-Prozess</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Alle Kosten von Anfang an sichtbar</li>
                      <li>• Keine versteckten Servicegebühren</li>
                      <li>• Keine vorab ausgewählten Extras</li>
                      <li>• Klare Stornierungsmöglichkeit</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Kontoverwaltung</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Kontolöschung in 3 Klicks möglich</li>
                      <li>• Keine versteckten Kündigungsschritte</li>
                      <li>• Datenexport jederzeit verfügbar</li>
                      <li>• Klare Abmeldelinks in E-Mails</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Kommunikation</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Neutrale Formulierungen überall</li>
                      <li>• Kein "Confirmshaming"</li>
                      <li>• Keine künstliche Dringlichkeit</li>
                      <li>• Ehrliche Verfügbarkeitsanzeigen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Report Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Dark Pattern entdeckt?
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Wenn Sie auf unserer Plattform ein manipulatives Design-Element entdecken, 
                      melden Sie es uns bitte. Wir nehmen solche Hinweise sehr ernst.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="mailto:feedback@mimitechai.com?subject=Dark%20Pattern%20Meldung">
                        <Button className="bg-primary hover:bg-primary/90">
                          Dark Pattern melden
                        </Button>
                      </a>
                      <Link href="/report">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                          Allgemeine Meldung
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Info */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
            <p>Stand: Dezember 2024 | Version 1.0</p>
            <p className="mt-1">
              Rechtsgrundlage: DSA Art. 25 - Verbot von Dark Patterns
            </p>
            <p className="mt-2">
              Letztes UI/UX-Audit: Dezember 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
