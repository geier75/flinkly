import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CreditCard, 
  ArrowLeft,
  Shield,
  CheckCircle,
  Building2,
  Scale,
  FileText,
  AlertTriangle,
  Lock,
  Banknote,
  Users
} from "lucide-react";

/**
 * Payment Compliance Seite
 * 
 * Dokumentiert die rechtliche Einordnung bezüglich:
 * - ZAG (Zahlungsdiensteaufsichtsgesetz)
 * - PSD2 (Payment Services Directive 2)
 * - Stripe als lizenzierter Zahlungsdienstleister
 * 
 * Wichtig: Flinkly ist KEIN Zahlungsdienst, sondern nutzt
 * Stripe als lizenzierten Zahlungsdienstleister.
 */

export default function PaymentCompliance() {
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
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Zahlungsabwicklung & Compliance</h1>
              <p className="text-slate-400">
                ZAG, PSD2 und Stripe als Zahlungsdienstleister
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-primary/10 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-blue-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Wichtige Klarstellung</h2>
                    <p className="text-slate-300">
                      <strong className="text-white">Flinkly ist kein Zahlungsdienst</strong> im Sinne des 
                      Zahlungsdiensteaufsichtsgesetzes (ZAG). Wir nutzen <strong className="text-blue-400">Stripe</strong> als 
                      lizenzierten Zahlungsdienstleister für alle Zahlungsvorgänge auf unserer Plattform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Classification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Scale className="h-6 w-6 text-amber-400" />
                  Rechtliche Einordnung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Flinkly als Vermittlungsplattform</h4>
                  <p className="text-sm mb-4">
                    Flinkly ist ein <strong className="text-emerald-400">Online-Marktplatz</strong>, der Käufer und 
                    Verkäufer von Freelancer-Dienstleistungen zusammenbringt. Wir sind:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Vermittler</strong> zwischen Käufer und Verkäufer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Nicht</strong> Vertragspartei der Dienstleistungsverträge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Nicht</strong> Zahlungsdienstleister im Sinne des ZAG</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">Warum ist das wichtig?</h4>
                      <p className="text-sm text-slate-300">
                        Das ZAG regelt, wer Zahlungsdienste erbringen darf. Nur lizenzierte Institute 
                        dürfen Gelder entgegennehmen und weiterleiten. Flinkly erfüllt diese Kriterien 
                        nicht und benötigt daher keine ZAG-Lizenz, da alle Zahlungen direkt über Stripe 
                        abgewickelt werden.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stripe as Payment Provider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Building2 className="h-6 w-6 text-blue-400" />
                  Stripe als Zahlungsdienstleister
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      Stripe Lizenzen
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        E-Geld-Institut (Irland)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        PSD2-lizenziert in der EU
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        BaFin-registriert für Deutschland
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        PCI-DSS Level 1 zertifiziert
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-emerald-400" />
                      Stripe Connect
                    </h4>
                    <p className="text-sm text-slate-400 mb-3">
                      Wir nutzen <strong className="text-white">Stripe Connect</strong> für:
                    </p>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li>• Sichere Zahlungsabwicklung</li>
                      <li>• Automatische Auszahlung an Verkäufer</li>
                      <li>• Escrow/Treuhand-Funktion</li>
                      <li>• Compliance mit PSD2/ZAG</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Stripe Payments Europe, Limited</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Adresse:</p>
                      <p className="text-white">1 Grand Canal Street Lower</p>
                      <p className="text-white">Grand Canal Dock, Dublin, D02 H210, Irland</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Regulierung:</p>
                      <p className="text-white">Central Bank of Ireland</p>
                      <p className="text-slate-400 text-xs mt-1">Registrierungsnummer: C187865</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FileText className="h-6 w-6 text-purple-400" />
                  Zahlungsfluss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  So funktioniert die Zahlungsabwicklung auf Flinkly:
                </p>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
                    <p className="text-sm font-medium text-white">Käufer bestellt</p>
                    <p className="text-xs text-slate-400 mt-1">Zahlung über Stripe Checkout</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">2</div>
                    <p className="text-sm font-medium text-white">Stripe verwahrt</p>
                    <p className="text-xs text-slate-400 mt-1">Geld im Escrow/Treuhand</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 text-center">
                    <div className="text-2xl font-bold text-amber-400 mb-2">3</div>
                    <p className="text-sm font-medium text-white">Lieferung</p>
                    <p className="text-xs text-slate-400 mt-1">Verkäufer liefert Arbeit</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">4</div>
                    <p className="text-sm font-medium text-white">Auszahlung</p>
                    <p className="text-xs text-slate-400 mt-1">Stripe zahlt an Verkäufer</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-300">Käuferschutz</p>
                      <p className="text-sm text-slate-300 mt-1">
                        Das Geld wird erst nach erfolgreicher Abnahme der Arbeit an den Verkäufer 
                        ausgezahlt. Bei Problemen greift unser Streitbeilegungsverfahren.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Lock className="h-6 w-6 text-emerald-400" />
                  Datenschutz bei Zahlungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Was Flinkly NICHT speichert:</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>❌ Kreditkartennummern</li>
                      <li>❌ CVV/CVC-Codes</li>
                      <li>❌ IBAN-Nummern</li>
                      <li>❌ Bankzugangsdaten</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Was Stripe verarbeitet:</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>✓ Zahlungsdaten (verschlüsselt)</li>
                      <li>✓ Transaktionshistorie</li>
                      <li>✓ Betrugsprävention</li>
                      <li>✓ Compliance-Prüfungen</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-sm text-slate-400">
                  Weitere Informationen finden Sie in unserer{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Datenschutzerklärung</Link>{" "}
                  und der{" "}
                  <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Stripe Datenschutzerklärung
                  </a>.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal References */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Scale className="h-6 w-6 text-slate-400" />
                  Rechtliche Grundlagen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">ZAG</h4>
                    <p className="text-slate-400">
                      Zahlungsdiensteaufsichtsgesetz - Regelt die Erbringung von Zahlungsdiensten in Deutschland
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">PSD2</h4>
                    <p className="text-slate-400">
                      Payment Services Directive 2 (EU) 2015/2366 - EU-Richtlinie für Zahlungsdienste
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">E-Geld-Richtlinie</h4>
                    <p className="text-slate-400">
                      Richtlinie 2009/110/EG - Regelt die Ausgabe von E-Geld
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">BaFin</h4>
                    <p className="text-slate-400">
                      Bundesanstalt für Finanzdienstleistungsaufsicht - Zuständige Aufsichtsbehörde
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Fragen zur Zahlungsabwicklung?
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Bei Fragen zu Zahlungen, Auszahlungen oder Compliance kontaktieren Sie uns.
                    </p>
                    <a href="mailto:payment@mimitechai.com">
                      <Button className="bg-primary hover:bg-primary/90">
                        payment@mimitechai.com
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Info */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
            <p>Stand: Dezember 2024 | Version 1.0</p>
            <p className="mt-1">
              Rechtsgrundlagen: ZAG, PSD2 (EU) 2015/2366, E-Geld-Richtlinie 2009/110/EG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
