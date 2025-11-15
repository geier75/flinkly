import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertTriangle } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Neon Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b-2 border-emerald-500/30 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8">
            <Link href="/">
              <Button 
                variant="outline" 
                className="mb-6 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300"
              >
                ← Zurück zur Startseite
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl font-extrabold mb-4 tracking-tight cyber-chrome-text flex items-center gap-4">
                <Shield className="h-12 w-12 text-emerald-500 animate-pulse" />
                DATENSCHUTZ<span className="cyber-neon-green">ERKLÄRUNG</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                Informationen zum Schutz Ihrer personenbezogenen Daten gemäß <span className="cyber-neon-orange font-semibold">DSGVO</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Important Notice */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-12 p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-orange-500 cyber-neon-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 cyber-chrome-text">
                    WICHTIGER HINWEIS
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Diese Datenschutzerklärung wurde mit größter Sorgfalt erstellt, ersetzt jedoch <span className="cyber-neon-orange font-semibold">keine rechtliche Beratung</span>. 
                    Für rechtsverbindliche Datenschutzerklärungen konsultieren Sie bitte einen auf Datenschutzrecht spezialisierten Anwalt. 
                    Diese Version basiert auf den <span className="cyber-neon-green font-semibold">DSGVO-Anforderungen</span> und muss ggf. an Ihre spezifischen Geschäftsanforderungen angepasst werden.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1: Datenschutz auf einen Blick */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Eye className="h-8 w-8 text-emerald-500" />
                DATENSCHUTZ AUF EINEN <span className="cyber-neon-green">BLICK</span>
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Allgemeine Hinweise</h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                    wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3">Wer ist verantwortlich für die Datenerfassung?</h4>
                  <p className="mb-3">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber:
                  </p>
                  <p>
                    <span className="cyber-neon-green font-semibold">MiMi Tech Ai UG (haftungsbeschränkt)</span><br />
                    Michael Bemler<br />
                    Lindenplatz 23<br />
                    75378 Bad Liebenzell<br />
                    Deutschland<br />
                    <br />
                    E-Mail: <span className="cyber-neon-orange font-semibold">info@mimitechai.com</span><br />
                    Telefon: <span className="cyber-neon-orange font-semibold">+49 1575 8805737</span>
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3">Wie erfassen wir Ihre Daten?</h4>
                  <p className="mb-3">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.B. Kontaktformular, Gig-Bestellung). 
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (z.B. Browsertyp, IP-Adresse).
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3">Wofür nutzen wir Ihre Daten?</h4>
                  <p>
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                    Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden oder zur Abwicklung von Transaktionen (Gig-Käufe, Seller-Payouts).
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 2: Verantwortliche Stelle */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-emerald-500" />
                VERANTWORTLICHE <span className="cyber-neon-orange">STELLE</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <p className="text-lg mb-2">
                    <span className="cyber-neon-green font-semibold">MiMi Tech Ai UG (haftungsbeschränkt)</span>
                  </p>
                  <p>
                    Michael Bemler (Geschäftsführer)<br />
                    Lindenplatz 23<br />
                    75378 Bad Liebenzell<br />
                    Deutschland<br />
                    <br />
                    E-Mail: <span className="cyber-neon-orange font-semibold">info@mimitechai.com</span><br />
                    Telefon: <span className="cyber-neon-orange font-semibold">+49 1575 8805737</span>
                  </p>
                </div>

                <p className="text-sm text-slate-400">
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen 
                  über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
                </p>
              </div>
            </Card>

            {/* Section 3: Datenerfassung */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Database className="h-8 w-8 text-emerald-500" />
                DATEN<span className="cyber-neon-green">ERFASSUNG</span>
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Server-Log-Dateien</h3>
                  <p className="mb-3">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien:
                  </p>
                  <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>Browsertyp und Browserversion</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>Verwendetes Betriebssystem</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>Referrer URL (zuvor besuchte Seite)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>Hostname des zugreifenden Rechners</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>Uhrzeit der Serveranfrage</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="cyber-neon-green font-bold">•</span>
                        <span>IP-Adresse</span>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an technisch fehlerfreier Darstellung)
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Kontaktformular & Anfragen</h3>
                  <p className="mb-3">
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben zwecks Bearbeitung der Anfrage gespeichert.
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                    Flinkly-spezifische Datenverarbeitung:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Gig-Bestellungen:</span> Name, E-Mail, Zahlungsinformationen (via Stripe), Bestelldetails</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Seller-Accounts:</span> Name, E-Mail, Stripe-Account-ID, Gig-Daten, Earnings-History</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Messaging:</span> Chat-Nachrichten zwischen Käufer und Verkäufer (verschlüsselt gespeichert)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Reviews:</span> Bewertungen, Kommentare, Ratings (öffentlich sichtbar)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Section 4: Zahlungsdienstleister (Stripe) */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                ZAHLUNGS<span className="cyber-neon-orange">DIENSTLEISTER</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Stripe</h3>
                  <p className="mb-3">
                    Wir nutzen <span className="cyber-neon-orange font-semibold">Stripe</span> für die Zahlungsabwicklung. 
                    Stripe ist ein PCI-DSS Level 1 zertifizierter Zahlungsdienstleister.
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Anbieter:</span> Stripe, Inc., 510 Townsend Street, San Francisco, CA 94103, USA<br />
                    <span className="font-semibold">EU-Niederlassung:</span> Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin 2, Irland
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Verarbeitete Daten:</span> Kreditkartendaten, Name, E-Mail, Rechnungsadresse, IP-Adresse, Transaktionsdaten
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Joint-Controllership:</span> Flinkly und Stripe sind gemeinsam Verantwortliche (Art. 26 DSGVO) für die Zahlungsabwicklung. Die Verantwortlichkeiten sind in einer Vereinbarung geregelt.
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Drittlandübermittlung:</span> Stripe verarbeitet Daten teilweise in den USA. Die Übermittlung erfolgt auf Grundlage von <span className="cyber-neon-orange font-semibold">Standardvertragsklauseln (SCC)</span> der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Speicherfrist:</span> 10 Jahre (steuerrechtliche Aufbewahrungspflicht gem. § 147 AO)
                  </p>
                  <p className="text-sm text-slate-400">
                    Weitere Informationen: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="cyber-neon-green hover:text-emerald-400 transition-colors">https://stripe.com/de/privacy</a>
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-orange-500" />
                    Wichtig:
                  </h4>
                  <p>
                    Flinkly speichert <span className="cyber-neon-orange font-semibold">keine Kreditkartendaten</span>. 
                    Alle Zahlungsinformationen werden direkt von Stripe verarbeitet und gespeichert.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 5: Cookies */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                COO<span className="cyber-neon-green">KIES</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Notwendige Cookies:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Session-Cookie:</span> Zur Authentifizierung (Login-Status)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Cookie-Consent:</span> Speichert Ihre Cookie-Einstellungen</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-slate-400">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (technisch notwendig)
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Analyse-Cookies (optional):</h3>
                  <p className="mb-3">
                    Wir verwenden Analyse-Tools (z.B. Google Analytics, PostHog) nur mit Ihrer ausdrücklichen Einwilligung.
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, jederzeit widerrufbar)
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 5.5: Analytics & Error-Monitoring */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                ANALYTICS & <span className="cyber-neon-orange">ERROR-MONITORING</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">PostHog (Analytics)</h3>
                  <p className="mb-3">
                    Wir nutzen <span className="cyber-neon-orange font-semibold">PostHog</span> für Webanalyse und Conversion-Tracking (nur mit Ihrer Einwilligung).
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Anbieter:</span> PostHog Inc., 2261 Market Street #4008, San Francisco, CA 94114, USA
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Verarbeitete Daten:</span> IP-Adresse (anonymisiert), Seitenaufrufe, Klicks, Gerätetyp, Browser, Conversion-Events
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, jederzeit widerrufbar)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Drittlandübermittlung:</span> PostHog verarbeitet Daten in den USA. Die Übermittlung erfolgt auf Grundlage von <span className="cyber-neon-orange font-semibold">Standardvertragsklauseln (SCC)</span> der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Speicherfrist:</span> 14 Monate (PostHog-Default)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Widerspruchsrecht:</span> Sie können Ihre Einwilligung jederzeit in den Cookie-Einstellungen widerrufen.
                  </p>
                  <p className="text-sm text-slate-400">
                    Weitere Informationen: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="cyber-neon-green hover:text-emerald-400 transition-colors">https://posthog.com/privacy</a>
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Sentry (Error-Monitoring)</h3>
                  <p className="mb-3">
                    Wir nutzen <span className="cyber-neon-orange font-semibold">Sentry</span> für Error-Monitoring und Performance-Tracking (nur in Production).
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Anbieter:</span> Functional Software, Inc. (Sentry), 132 Hawthorne Street, San Francisco, CA 94107, USA
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Verarbeitete Daten:</span> Error-Logs, Stack-Traces, IP-Adresse (anonymisiert), Browser, Gerätetyp, Session-Replays (nur bei Errors)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Fehleranalyse und Verbesserung der Website-Stabilität)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Drittlandübermittlung:</span> Sentry verarbeitet Daten in den USA. Die Übermittlung erfolgt auf Grundlage von <span className="cyber-neon-orange font-semibold">Standardvertragsklauseln (SCC)</span> der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Speicherfrist:</span> 90 Tage (Error-Logs), 30 Tage (Session-Replays)
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold">Datenschutzmaßnahmen:</span> Alle Texte und Eingaben werden maskiert (GDPR-Compliance). Nur Error-Kontext wird gespeichert.
                  </p>
                  <p className="text-sm text-slate-400">
                    Weitere Informationen: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="cyber-neon-green hover:text-emerald-400 transition-colors">https://sentry.io/privacy/</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 6: Ihre Rechte */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-500" />
                IHRE <span className="cyber-neon-orange">RECHTE</span>
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p>
                  Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Auskunftsrecht (Art. 15 DSGVO)</h3>
                  <p>
                    Sie haben das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recht auf Berichtigung (Art. 16 DSGVO)</h3>
                  <p>
                    Sie haben das Recht, die Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten zu verlangen.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recht auf Löschung (Art. 17 DSGVO)</h3>
                  <p>
                    Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                  <p>
                    Sie haben das Recht, Ihre Daten in einem gängigen, maschinenlesbaren Format zu erhalten (z.B. JSON, CSV).
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Widerrufsrecht (Art. 7 Abs. 3 DSGVO)</h3>
                  <p>
                    Sie können eine erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt unberührt.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Widerspruchsrecht (Art. 21 DSGVO)</h3>
                  <p className="mb-3">
                    Sie haben das Recht, <span className="cyber-neon-orange font-semibold">jederzeit Widerspruch</span> gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen, die auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) erfolgt.
                  </p>
                  <p>
                    <span className="font-semibold">Betrifft:</span> Analytics (PostHog), Error-Monitoring (Sentry), Direktmarketing
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Beschwerderecht (Art. 77 DSGVO)</h3>
                  <p className="mb-3">
                    Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
                  </p>
                  <p className="text-sm text-slate-400">
                    Zuständige Behörde für Baden-Württemberg:<br />
                    Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
                    Lautenschlagerstraße 20, 70173 Stuttgart<br />
                    <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer" className="cyber-neon-green hover:text-emerald-400 transition-colors">
                      www.baden-wuerttemberg.datenschutz.de
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 7: SSL-Verschlüsselung */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Lock className="h-8 w-8 text-emerald-500" />
                SSL-<span className="cyber-neon-green">VERSCHLÜSSELUNG</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 
                  <span className="cyber-neon-green font-semibold"> SSL- bzw. TLS-Verschlüsselung</span>.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <p className="mb-3">
                    Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf 
                    <span className="cyber-neon-orange font-semibold"> "https://"</span> wechselt und an dem 
                    <span className="cyber-neon-green font-semibold"> Schloss-Symbol</span> in Ihrer Browserzeile.
                  </p>
                  <p>
                    Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, 
                    nicht von Dritten mitgelesen werden.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 8: Speicherdauer */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                SPEICHER<span className="cyber-neon-orange">DAUER</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
                  verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Flinkly-spezifische Speicherfristen:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">User-Daten:</span> 3 Jahre nach letzter Aktivität (oder bis zur Account-Löschung)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Gig-Bestellungen:</span> 10 Jahre (steuerrechtliche Aufbewahrungspflicht gem. § 147 AO)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Chat-Nachrichten:</span> 3 Jahre nach Abschluss der Bestellung</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Reviews:</span> Dauerhaft (bis zur Löschung durch Nutzer oder Admin)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Analytics (PostHog):</span> 14 Monate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Error-Logs (Sentry):</span> 90 Tage (Session-Replays: 30 Tage)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Stripe-Zahlungsdaten:</span> 10 Jahre (steuerrechtliche Aufbewahrungspflicht)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Contact Section */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                KONTAKT UND <span className="cyber-neon-orange">ANFRAGEN</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte:
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="font-semibold text-white mb-3">Datenschutz-Kontakt:</p>
                  <p>
                    <span className="cyber-neon-green font-semibold">MiMi Tech Ai UG (haftungsbeschränkt)</span><br />
                    Michael Bemler<br />
                    Lindenplatz 23<br />
                    75378 Bad Liebenzell<br />
                    Deutschland<br />
                    <br />
                    E-Mail: <span className="cyber-neon-green font-semibold">info@mimitechai.com</span><br />
                    Telefon: <span className="cyber-neon-green font-semibold">+49 1575 8805737</span><br />
                    Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
                  </p>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                  Stand dieser Datenschutzerklärung: November 2025 | Version 1.0
                </p>
              </div>
            </Card>

            {/* Back to Top */}
            <div className="mt-12 text-center">
              <Link href="/">
                <Button 
                  className="cyber-neon-button px-12 py-6 text-lg"
                >
                  ← Zurück zur Startseite
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
