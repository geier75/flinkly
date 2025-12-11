import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Shield, AlertTriangle, ArrowLeft, Scale, Users, CreditCard, Ban, MessageSquare, Globe } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Startseite
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Allgemeine Geschäftsbedingungen</h1>
                <p className="text-slate-400 mt-1">Stand: Dezember 2024 | DSA/P2B-konform | EU-weit gültig</p>
                <p className="text-emerald-400 text-sm mt-1 font-medium">Gültig für: flinkly.eu – Marktplatz für digitale Dienstleistungen</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Wichtiger Hinweis */}
          <Card className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Wichtiger Hinweis</h3>
                <p className="text-slate-300 leading-relaxed">
                  Diese AGB regeln die Nutzung der Plattform flinkly.eu. Mit der Registrierung und Nutzung 
                  erklären Sie sich mit diesen Bedingungen einverstanden.
                </p>
              </div>
            </div>
          </Card>

          {/* § 1 Geltungsbereich */}
          <Card className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 1 Geltungsbereich und Vertragspartner</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Online-Plattform 
                <span className="text-emerald-400 font-semibold"> flinkly.eu</span> (nachfolgend "Plattform").
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <p className="font-semibold text-white mb-2">Betreiber der Plattform:</p>
                <p>MiMi Tech Ai UG (haftungsbeschränkt)</p>
                <p>Lindenplatz 23, 75378 Bad Liebenzell, Deutschland</p>
                <p>Vertreten durch: Michael Bemler (Geschäftsführer)</p>
                <p>E-Mail: info@mimitechai.com</p>
              </div>
              <p>
                Die Plattform vermittelt digitale Dienstleistungen zwischen Anbietern (Verkäufern) 
                und Auftraggebern (Käufern). Der Betreiber ist selbst nicht Vertragspartner der 
                zwischen Nutzern geschlossenen Verträge.
              </p>
            </div>
          </Card>

          {/* § 2 Registrierung */}
          <Card className="bg-slate-800/50 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 2 Registrierung und Nutzerkonto</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">2.1</span> Die Nutzung der Plattform erfordert 
                eine Registrierung. Nutzer müssen mindestens 18 Jahre alt sein.
              </p>
              <p>
                <span className="font-semibold text-white">2.2</span> Bei der Registrierung sind wahrheitsgemäße 
                Angaben zu machen. Änderungen sind unverzüglich mitzuteilen.
              </p>
              <p>
                <span className="font-semibold text-white">2.3</span> Jeder Nutzer darf nur ein Konto führen. 
                Die Zugangsdaten sind vertraulich zu behandeln.
              </p>
              <p>
                <span className="font-semibold text-white">2.4</span> Gewerbliche Verkäufer müssen ihre 
                Unternehmensangaben vollständig hinterlegen (Impressumspflicht).
              </p>
            </div>
          </Card>

          {/* § 3 Leistungen */}
          <Card className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-violet-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 3 Leistungen der Plattform</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">3.1</span> Flinkly stellt eine technische 
                Infrastruktur zur Vermittlung digitaler Dienstleistungen bereit.
              </p>
              <p>
                <span className="font-semibold text-white">3.2</span> Die Plattform bietet:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Erstellung und Verwaltung von Gig-Angeboten</li>
                <li>Sichere Kommunikation zwischen Nutzern</li>
                <li>Zahlungsabwicklung über Stripe</li>
                <li>Bewertungssystem für Qualitätssicherung</li>
                <li>Streitbeilegungsverfahren</li>
              </ul>
              <p>
                <span className="font-semibold text-white">3.3</span> Der Betreiber garantiert keine 
                ununterbrochene Verfügbarkeit der Plattform.
              </p>
            </div>
          </Card>

          {/* § 4 Gebühren */}
          <Card className="bg-slate-800/50 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-cyan-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 4 Gebühren und Zahlungen</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">4.1</span> Die Registrierung und Erstellung 
                von Gigs ist kostenlos.
              </p>
              <p>
                <span className="font-semibold text-white">4.2</span> Bei erfolgreicher Vermittlung 
                erhebt Flinkly eine Servicegebühr von <span className="text-emerald-400 font-semibold">10%</span> des 
                Auftragswertes vom Verkäufer.
              </p>
              <p>
                <span className="font-semibold text-white">4.3</span> Zahlungen werden über den 
                Zahlungsdienstleister Stripe abgewickelt. Es gelten zusätzlich die AGB von Stripe.
              </p>
              <p>
                <span className="font-semibold text-white">4.4</span> Die Auszahlung an Verkäufer erfolgt 
                nach Abschluss des Auftrags und Ablauf der Widerrufsfrist.
              </p>
            </div>
          </Card>

          {/* § 5 Pflichten */}
          <Card className="bg-slate-800/50 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Scale className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 5 Pflichten der Nutzer</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">5.1 Verkäufer verpflichten sich:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Leistungen wie beschrieben zu erbringen</li>
                <li>Vereinbarte Fristen einzuhalten</li>
                <li>Professionell zu kommunizieren</li>
                <li>Keine Urheberrechte Dritter zu verletzen</li>
              </ul>
              <p>
                <span className="font-semibold text-white">5.2 Käufer verpflichten sich:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Klare Anforderungen zu kommunizieren</li>
                <li>Zeitnah Feedback zu geben</li>
                <li>Vereinbarte Zahlungen zu leisten</li>
              </ul>
            </div>
          </Card>

          {/* § 6 Verbotene Inhalte */}
          <Card className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Ban className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 6 Verbotene Inhalte und Aktivitäten</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>Auf der Plattform sind untersagt:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Illegale Dienstleistungen oder Inhalte</li>
                <li>Betrug, Täuschung oder Manipulation</li>
                <li>Spam, unerwünschte Werbung</li>
                <li>Umgehung der Plattform-Zahlungssysteme</li>
                <li>Hassrede, Diskriminierung, Belästigung</li>
                <li>Verletzung von Urheberrechten</li>
                <li>Mehrfachkonten oder Fake-Bewertungen</li>
              </ul>
              <p className="text-amber-400">
                Verstöße können zur sofortigen Sperrung des Kontos führen.
              </p>
            </div>
          </Card>

          {/* § 7 Haftung */}
          <Card className="bg-slate-800/50 border border-slate-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 7 Haftung</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">7.1</span> Der Betreiber haftet nicht für 
                die zwischen Nutzern erbrachten Leistungen.
              </p>
              <p>
                <span className="font-semibold text-white">7.2</span> Die Haftung des Betreibers ist 
                auf Vorsatz und grobe Fahrlässigkeit beschränkt.
              </p>
              <p>
                <span className="font-semibold text-white">7.3</span> Für Schäden aus der Verletzung 
                von Leben, Körper oder Gesundheit haftet der Betreiber unbeschränkt.
              </p>
            </div>
          </Card>

          {/* § 8 Streitbeilegung */}
          <Card className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 8 Streitbeilegung (P2B-Verordnung)</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">8.1</span> Bei Streitigkeiten zwischen 
                Nutzern bietet Flinkly ein internes Schlichtungsverfahren an.
              </p>
              <p>
                <span className="font-semibold text-white">8.2</span> Gewerbliche Nutzer können sich 
                an folgende Schlichtungsstelle wenden:
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <p className="font-semibold text-white">Schlichtungsstelle für digitale Rechte e.V.</p>
                <p>Neue Grünstraße 17, 10179 Berlin</p>
                <p>
                  <a href="https://www.s-d-r.org" target="_blank" rel="noopener noreferrer" 
                     className="text-emerald-400 hover:underline">
                    www.s-d-r.org
                  </a>
                </p>
              </div>
              <p>
                <span className="font-semibold text-white">8.3</span> Die EU-Kommission stellt eine 
                Plattform zur Online-Streitbeilegung bereit: 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                   className="text-emerald-400 hover:underline ml-1">
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>
          </Card>

          {/* § 9 Kündigung */}
          <Card className="bg-slate-800/50 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 9 Kündigung</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">9.1</span> Nutzer können ihr Konto jederzeit 
                ohne Angabe von Gründen kündigen.
              </p>
              <p>
                <span className="font-semibold text-white">9.2</span> Der Betreiber kann bei Verstößen 
                gegen diese AGB das Konto mit einer Frist von 30 Tagen kündigen.
              </p>
              <p>
                <span className="font-semibold text-white">9.3</span> Bei schwerwiegenden Verstößen ist 
                eine fristlose Kündigung möglich.
              </p>
              <p>
                <span className="font-semibold text-white">9.4</span> Laufende Aufträge sind auch nach 
                Kündigung ordnungsgemäß abzuwickeln.
              </p>
            </div>
          </Card>

          {/* § 10 Schlussbestimmungen */}
          <Card className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <FileText className="h-5 w-5 text-violet-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">§ 10 Schlussbestimmungen</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">10.1</span> Es gilt deutsches Recht unter 
                Ausschluss des UN-Kaufrechts.
              </p>
              <p>
                <span className="font-semibold text-white">10.2</span> Gerichtsstand ist, soweit 
                gesetzlich zulässig, Bad Liebenzell.
              </p>
              <p>
                <span className="font-semibold text-white">10.3</span> Sollten einzelne Bestimmungen 
                unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
              <p>
                <span className="font-semibold text-white">10.4</span> Änderungen dieser AGB werden 
                den Nutzern 30 Tage vor Inkrafttreten mitgeteilt.
              </p>
            </div>
          </Card>

          {/* Kontakt */}
          <Card className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Kontakt</h2>
            <div className="text-slate-300">
              <p>Bei Fragen zu diesen AGB kontaktieren Sie uns:</p>
              <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <p><span className="font-semibold text-white">E-Mail:</span> support@mimitechai.com</p>
                <p><span className="font-semibold text-white">Telefon:</span> +49 1575 8805737</p>
                <p><span className="font-semibold text-white">Geschäftszeiten:</span> Mo-Fr 9:00-18:00 Uhr</p>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Stand dieser AGB: Dezember 2024 | Version 2.0 (DSA/P2B-konform)
              </p>
            </div>
          </Card>

          {/* Zurück Button */}
          <div className="text-center pt-8">
            <Link href="/">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-3">
                ← Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
