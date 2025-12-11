import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Scale, 
  Clock, 
  Shield, 
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  CheckCircle,
  Info,
  ArrowLeft,
  Building2,
  Gavel,
  MessageSquare
} from "lucide-react";

/**
 * P2B-Transparenzseite (Platform-to-Business Verordnung)
 * 
 * Gemäß Verordnung (EU) 2019/1150 über Fairness und Transparenz
 * für gewerbliche Nutzer von Online-Vermittlungsdiensten
 * 
 * Pflichtinhalte:
 * - Art. 5: Ranking-Transparenz
 * - Art. 3: AGB-Anforderungen und Änderungsfristen
 * - Art. 4: Einschränkung, Aussetzung und Beendigung
 * - Art. 11: Internes Beschwerdemanagementsystem
 * - Art. 12: Mediation
 */

export default function P2BTransparency() {
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
            <div className="p-3 bg-primary/20 rounded-xl">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">P2B-Transparenz</h1>
              <p className="text-slate-400">
                Platform-to-Business Verordnung (EU) 2019/1150
              </p>
            </div>
          </div>
          <p className="text-slate-300 max-w-3xl">
            Diese Seite informiert gewerbliche Nutzer (Verkäufer) über ihre Rechte gemäß der 
            EU-Verordnung über Fairness und Transparenz für gewerbliche Nutzer von Online-Vermittlungsdiensten.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Ranking-Transparenz - Art. 5 P2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  1. Ranking-Transparenz (Art. 5 P2B-VO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">
                      Gemäß Art. 5 der P2B-Verordnung sind wir verpflichtet, die Hauptparameter 
                      für das Ranking von Gigs transparent darzulegen.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Wie wird das Ranking auf Flinkly berechnet?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-400" />
                        Hauptparameter für "Beliebt" und Standardsortierung
                      </h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Bewertungsdurchschnitt (30%)</strong>
                            <p className="text-slate-400">Durchschnittliche Sternebewertung aller abgeschlossenen Aufträge</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Abschlussrate (25%)</strong>
                            <p className="text-slate-400">Verhältnis erfolgreich abgeschlossener zu gestarteten Aufträgen</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Antwortzeit (15%)</strong>
                            <p className="text-slate-400">Durchschnittliche Zeit bis zur ersten Antwort auf Kundenanfragen</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Pünktliche Lieferung (15%)</strong>
                            <p className="text-slate-400">Prozentsatz der innerhalb der vereinbarten Frist gelieferten Aufträge</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Aktualität (10%)</strong>
                            <p className="text-slate-400">Zeitpunkt der letzten Aktivität und Gig-Aktualisierung</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong className="text-white">Profilqualität (5%)</strong>
                            <p className="text-slate-400">Vollständigkeit des Profils, Verifizierungsstatus, Beschreibungsqualität</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Scale className="h-5 w-5 text-blue-400" />
                        Keine bezahlte Bevorzugung
                      </h4>
                      <p className="text-sm text-slate-300">
                        Flinkly bietet <strong className="text-white">keine bezahlte Ranking-Bevorzugung</strong> an. 
                        Alle Verkäufer werden nach denselben objektiven Kriterien bewertet. 
                        Es gibt keine Möglichkeit, durch Zahlungen an Flinkly ein besseres Ranking zu erhalten.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        Personalisierung für Käufer
                      </h4>
                      <p className="text-sm text-slate-300">
                        Für eingeloggte Käufer kann das Ranking zusätzlich durch folgende Faktoren 
                        personalisiert werden:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-400">
                        <li>• Frühere Interaktionen mit Verkäufern</li>
                        <li>• Bevorzugte Kategorien basierend auf Suchhistorie</li>
                        <li>• Standort (für lokale Relevanz)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AGB-Änderungen - Art. 3 P2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FileText className="h-6 w-6 text-blue-400" />
                  2. AGB-Änderungen (Art. 3 P2B-VO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-white">Änderungsfrist</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">15 Tage</p>
                    <p className="text-sm text-slate-400">
                      Vorlaufzeit bei AGB-Änderungen. Sie werden mindestens 15 Tage vor 
                      Inkrafttreten über Änderungen informiert.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-white">Ihre Rechte</h4>
                    </div>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li>• Kündigung vor Inkrafttreten möglich</li>
                      <li>• Detaillierte Änderungsmitteilung per E-Mail</li>
                      <li>• Archiv aller AGB-Versionen verfügbar</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-300">Ausnahme bei kürzerer Frist</p>
                      <p className="text-sm text-slate-300 mt-1">
                        Eine kürzere Frist ist nur zulässig bei: gesetzlichen Verpflichtungen, 
                        Sicherheitsbedrohungen oder wenn Sie der kürzeren Frist ausdrücklich zustimmen.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kontosperrung - Art. 4 P2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Gavel className="h-6 w-6 text-red-400" />
                  3. Einschränkung, Aussetzung und Kündigung (Art. 4 P2B-VO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-red-400" />
                      <h4 className="font-semibold text-white">Kündigungsfrist</h4>
                    </div>
                    <p className="text-3xl font-bold text-red-400 mb-2">30 Tage</p>
                    <p className="text-sm text-slate-400">
                      Vorlaufzeit bei Kontosperrung oder Kündigung durch Flinkly. 
                      Sie erhalten eine schriftliche Begründung.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-white">Begründungspflicht</h4>
                    </div>
                    <p className="text-sm text-slate-400">
                      Bei jeder Einschränkung, Aussetzung oder Beendigung erhalten Sie:
                    </p>
                    <ul className="mt-2 text-sm space-y-1 text-slate-400">
                      <li>• Konkrete Gründe für die Maßnahme</li>
                      <li>• Verweis auf die verletzten AGB-Klauseln</li>
                      <li>• Hinweis auf Beschwerdemöglichkeiten</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-300">Sofortige Sperrung nur bei:</p>
                      <ul className="text-sm text-slate-300 mt-2 space-y-1">
                        <li>• Wiederholten schwerwiegenden Verstößen</li>
                        <li>• Gesetzlichen Verpflichtungen</li>
                        <li>• Betrugsverdacht oder Sicherheitsbedrohungen</li>
                        <li>• Illegalen Inhalten gemäß DSA</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Beschwerdemanagement - Art. 11 P2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                  4. Internes Beschwerdesystem (Art. 11 P2B-VO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Flinkly betreibt ein internes Beschwerdemanagementsystem für gewerbliche Nutzer. 
                  Dieses System ist kostenlos, leicht zugänglich und ermöglicht eine faire Behandlung 
                  von Beschwerden.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-3xl font-bold text-purple-400">48h</p>
                    <p className="text-sm text-slate-400 mt-1">Eingangsbestätigung</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-3xl font-bold text-purple-400">14 Tage</p>
                    <p className="text-sm text-slate-400 mt-1">Bearbeitungszeit</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-3xl font-bold text-purple-400">100%</p>
                    <p className="text-sm text-slate-400 mt-1">Schriftliche Antwort</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">Beschwerde einreichen</h4>
                  <p className="text-sm text-slate-300 mb-3">
                    Gewerbliche Nutzer können Beschwerden zu folgenden Themen einreichen:
                  </p>
                  <ul className="text-sm text-slate-400 space-y-1 mb-4">
                    <li>• Ranking-Entscheidungen</li>
                    <li>• Kontoeinschränkungen oder -sperrungen</li>
                    <li>• AGB-Auslegung und -Anwendung</li>
                    <li>• Technische Probleme mit Auswirkung auf Geschäft</li>
                    <li>• Streitigkeiten mit Käufern</li>
                  </ul>
                  <Link href="/seller-complaint">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Beschwerde einreichen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mediation - Art. 12 P2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Scale className="h-6 w-6 text-amber-400" />
                  5. Mediation (Art. 12 P2B-VO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Wenn eine Streitigkeit nicht durch unser internes Beschwerdesystem gelöst werden kann, 
                  sind wir bereit, an einer Mediation teilzunehmen.
                </p>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Benannte Mediatoren</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-600">
                      <p className="font-medium text-white">Centre for Effective Dispute Resolution (CEDR)</p>
                      <p className="text-sm text-slate-400">70 Fleet Street, London EC4Y 1EU, UK</p>
                      <a href="https://www.cedr.com" className="text-sm text-primary hover:underline">
                        www.cedr.com
                      </a>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-600">
                      <p className="font-medium text-white">Handelskammer Hamburg - Mediationszentrum</p>
                      <p className="text-sm text-slate-400">Adolphsplatz 1, 20457 Hamburg, Deutschland</p>
                      <a href="https://www.hk24.de/mediation" className="text-sm text-primary hover:underline">
                        www.hk24.de/mediation
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-400 mt-0.5" />
                    <p className="text-sm text-slate-300">
                      Die Kosten der Mediation werden zu gleichen Teilen getragen, sofern nicht 
                      anders vereinbart. Flinkly ist verpflichtet, sich in gutem Glauben an 
                      Mediationsversuchen zu beteiligen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transparenzbericht */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                  6. Jährlicher Transparenzbericht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Gemäß Art. 11 Abs. 4 P2B-VO veröffentlichen wir jährlich einen Bericht über 
                  die Funktionsweise unseres Beschwerdemanagementsystems.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Berichtsinhalte</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Gesamtzahl eingegangener Beschwerden</li>
                      <li>• Beschwerden nach Kategorie</li>
                      <li>• Durchschnittliche Bearbeitungszeit</li>
                      <li>• Ergebnisse der Beschwerden</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Veröffentlichung</h4>
                    <p className="text-sm text-slate-400">
                      Der Bericht wird jährlich zum 31. März für das Vorjahr veröffentlicht 
                      und ist auf dieser Seite sowie in unserem Transparenzbericht einsehbar.
                    </p>
                    <Link href="/transparency-report">
                      <Button variant="outline" className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-800">
                        Zum Transparenzbericht
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kontakt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Fragen zur P2B-Verordnung?
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Unser Business-Support-Team hilft Ihnen gerne bei allen Fragen 
                      zu Ihren Rechten als gewerblicher Nutzer.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="mailto:business@mimitechai.com">
                        <Button className="bg-primary hover:bg-primary/90">
                          business@mimitechai.com
                        </Button>
                      </a>
                      <Link href="/seller-complaint">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                          Beschwerde einreichen
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
              Rechtsgrundlage: Verordnung (EU) 2019/1150 des Europäischen Parlaments und des Rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
