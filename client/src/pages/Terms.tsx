import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Shield, AlertTriangle } from "lucide-react";

export default function Terms() {
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
                <FileText className="h-12 w-12 text-emerald-500 animate-pulse" />
                ALLGEMEINE <span className="cyber-neon-green">GESCHÄFTSBEDINGUNGEN</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                Stand: <span className="cyber-neon-orange font-semibold">November 2025</span> | Gültig für die DACH-Region
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
                    Diese AGB wurden mit größter Sorgfalt erstellt, ersetzen jedoch <span className="cyber-neon-orange font-semibold">keine rechtliche Beratung</span>. 
                    Für rechtsverbindliche Nutzungsbedingungen konsultieren Sie bitte einen auf IT-Recht spezialisierten Anwalt. 
                    Diese Version dient als <span className="cyber-neon-green font-semibold">Vorlage</span> und muss an Ihre spezifischen Geschäftsanforderungen angepasst werden.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                1. GELTUNGSBEREICH UND <span className="cyber-neon-green">VERTRAGSPARTNER</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für die Nutzung der Online-Plattform 
                  <span className="cyber-neon-orange font-semibold"> Flinkly</span> (nachfolgend "Plattform") und regeln das Vertragsverhältnis zwischen:
                </p>
                
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6 my-6">
                  <p className="font-semibold text-white mb-3">Betreiber der Plattform:</p>
                  <p className="text-slate-300">
                    [FIRMENNAME EINTRAGEN]<br />
                    [STRASSE UND HAUSNUMMER]<br />
                    [PLZ UND ORT]<br />
                    [LAND]<br />
                    <br />
                    Vertreten durch: [GESCHÄFTSFÜHRER NAME]<br />
                    Handelsregister: [HRB-NUMMER, REGISTERGERICHT]<br />
                    USt-IdNr.: [UMSATZSTEUER-IDENTIFIKATIONSNUMMER]
                  </p>
                </div>

                <p>
                  und den Nutzern der Plattform (nachfolgend "Nutzer", "Käufer" oder "Verkäufer").
                </p>

                <p>
                  Durch die Registrierung auf Flinkly und die Nutzung der Plattform erklären Sie sich mit diesen AGB 
                  <span className="cyber-neon-green font-semibold"> ausdrücklich einverstanden</span>. 
                  Abweichende, entgegenstehende oder ergänzende AGB des Nutzers werden nicht Vertragsbestandteil, 
                  es sei denn, ihrer Geltung wird ausdrücklich zugestimmt.
                </p>
              </div>
            </Card>

            {/* Section 2 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                2. LEISTUNGSBESCHREIBUNG UND <span className="cyber-neon-orange">PLATTFORM-FUNKTION</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Flinkly ist ein <span className="cyber-neon-green font-semibold">Online-Marktplatz für digitale Mikrodienstleistungen</span> mit 
                  Fokus auf den deutschsprachigen Raum (Deutschland, Österreich, Schweiz - "DACH-Region"). 
                  Die Plattform ermöglicht es Verkäufern, ihre Dienstleistungen anzubieten, und Käufern, diese zu erwerben.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Kernfunktionen der Plattform:</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Gig-Erstellung</h4>
                    <p className="text-sm">Verkäufer können Dienstleistungen ("Gigs") mit Beschreibung, Preis und Lieferzeit einstellen</p>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Treuhand-System</h4>
                    <p className="text-sm">Sichere Zahlungsabwicklung via Stripe mit Käuferschutz (Escrow)</p>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Bewertungssystem</h4>
                    <p className="text-sm">Transparente 5-Sterne-Bewertungen für Qualitätssicherung</p>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Messaging-System</h4>
                    <p className="text-sm">Direkte Kommunikation zwischen Käufer und Verkäufer</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Plattform-Beschränkungen:</h3>
                
                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Maximaler Preis:</span> 250€ pro Gig (inkl. MwSt.)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Nur digitale Dienstleistungen:</span> Keine physischen Produkte oder Vor-Ort-Services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">DACH-Fokus:</span> Plattform primär für deutschsprachige Nutzer</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-6">
                  Flinkly tritt <span className="cyber-neon-green font-semibold">nicht als Vertragspartei</span> der zwischen Käufer und Verkäufer 
                  geschlossenen Verträge auf, sondern stellt lediglich die technische Infrastruktur bereit. 
                  Die Verantwortung für die Erfüllung der Verträge liegt ausschließlich bei den jeweiligen Verkäufern.
                </p>
              </div>
            </Card>

            {/* Section 3 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                3. REGISTRIERUNG UND <span className="cyber-neon-green">NUTZER-KONTO</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Die Nutzung der Plattform erfordert eine <span className="cyber-neon-orange font-semibold">Registrierung</span>. 
                  Zur Registrierung sind nur volljährige, geschäftsfähige Personen berechtigt.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Registrierungsprozess:</h3>
                
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6 space-y-3">
                  <p><span className="cyber-neon-green font-semibold">1.</span> Angabe wahrheitsgemäßer und vollständiger Daten (Name, E-Mail, ggf. Telefonnummer)</p>
                  <p><span className="cyber-neon-green font-semibold">2.</span> Bestätigung der E-Mail-Adresse via Verifizierungslink</p>
                  <p><span className="cyber-neon-green font-semibold">3.</span> Zustimmung zu diesen AGB und der Datenschutzerklärung</p>
                  <p><span className="cyber-neon-green font-semibold">4.</span> Für Verkäufer: Zusätzliche Verifizierung (E-Mail, ggf. Telefon, Admin-Approval)</p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Pflichten des Nutzers:</h3>
                
                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Geheimhaltung der Zugangsdaten:</span> Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Keine Mehrfach-Accounts:</span> Pro Person ist nur ein Account zulässig</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Aktualität der Daten:</span> Änderungen der Kontaktdaten sind unverzüglich mitzuteilen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Missbrauchsmeldung:</span> Bei Verdacht auf unbefugte Nutzung ist Flinkly sofort zu informieren</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-6">
                  Flinkly behält sich das Recht vor, Registrierungen ohne Angabe von Gründen abzulehnen oder 
                  Nutzerkonten bei Verstoß gegen diese AGB zu <span className="cyber-neon-orange font-semibold">sperren oder zu löschen</span>.
                </p>
              </div>
            </Card>

            {/* Section 4 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                4. VERTRAGSSCHLUSS UND <span className="cyber-neon-orange">ZAHLUNGSABWICKLUNG</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <h3 className="text-xl font-bold text-white mb-4">Vertragsschluss zwischen Käufer und Verkäufer:</h3>
                
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6 space-y-3">
                  <p><span className="cyber-neon-green font-semibold">1.</span> Der Verkäufer erstellt ein Gig-Angebot (verbindliches Angebot gem. § 145 BGB)</p>
                  <p><span className="cyber-neon-green font-semibold">2.</span> Der Käufer bestellt das Gig und gibt ein Briefing ab (Annahme des Angebots)</p>
                  <p><span className="cyber-neon-green font-semibold">3.</span> Der Käufer zahlt den Gig-Preis via Stripe (Treuhand-System)</p>
                  <p><span className="cyber-neon-green font-semibold">4.</span> Der Verkäufer erhält eine Benachrichtigung und beginnt mit der Arbeit</p>
                  <p><span className="cyber-neon-green font-semibold">5.</span> Nach Lieferung und Abnahme wird der Betrag an den Verkäufer ausgezahlt</p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Zahlungsabwicklung (Escrow-System):</h3>
                
                <p>
                  Alle Zahlungen werden über <span className="cyber-neon-orange font-semibold">Stripe</span> abgewickelt. 
                  Der Kaufpreis wird zunächst auf einem Treuhandkonto verwahrt und erst nach erfolgreicher Lieferung und 
                  Abnahme durch den Käufer an den Verkäufer ausgezahlt.
                </p>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6 mt-4">
                  <h4 className="font-bold text-white mb-3">Plattform-Gebühr:</h4>
                  <p className="mb-2">
                    Flinkly erhebt eine Provision von <span className="cyber-neon-orange font-semibold">15% des Gig-Preises</span> (zzgl. MwSt.), 
                    die vom Verkäufer getragen wird.
                  </p>
                  <p className="text-sm text-slate-400">
                    Beispiel: Bei einem Gig-Preis von 100€ erhält der Verkäufer 85€ (abzgl. Stripe-Gebühren), 
                    Flinkly erhält 15€ (zzgl. MwSt.).
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Auszahlung an Verkäufer:</h3>
                
                <p>
                  Die Auszahlung erfolgt via <span className="cyber-neon-green font-semibold">Stripe Connect</span> auf das vom Verkäufer 
                  hinterlegte Bankkonto. Auszahlungen werden in der Regel innerhalb von 
                  <span className="cyber-neon-orange font-semibold"> 2-7 Werktagen</span> nach Abnahme durch den Käufer veranlasst.
                </p>
              </div>
            </Card>

            {/* Section 5 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                5. WIDERRUFSRECHT UND <span className="cyber-neon-green">RÜCKGABERECHT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Käufer haben gemäß § 312g BGB ein <span className="cyber-neon-orange font-semibold">14-tägiges Widerrufsrecht</span> 
                  ab Vertragsschluss. Detaillierte Informationen finden Sie in unserer 
                  <Link href="/widerruf">
                    <span className="cyber-neon-green font-semibold underline cursor-pointer hover:text-emerald-300 transition-colors"> Widerrufsbelehrung</span>
                  </Link>.
                </p>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Wichtiger Hinweis zum Widerrufsrecht:
                  </h4>
                  <p className="mb-3">
                    Das Widerrufsrecht erlischt vorzeitig, wenn der Verkäufer mit der Ausführung der Dienstleistung 
                    <span className="cyber-neon-orange font-semibold"> vor Ablauf der Widerrufsfrist</span> begonnen hat und 
                    der Käufer dem ausdrücklich zugestimmt hat.
                  </p>
                  <p className="text-sm text-slate-400">
                    Durch die Bestätigung des Briefings und die Zahlung stimmt der Käufer der sofortigen Ausführung zu.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Rückgaberecht bei Mängeln:</h3>
                
                <p>
                  Bei Mängeln der gelieferten Dienstleistung hat der Käufer Anspruch auf 
                  <span className="cyber-neon-green font-semibold"> Nachbesserung</span> (Revision). 
                  Der Verkäufer ist verpflichtet, die Mängel innerhalb einer angemessenen Frist zu beheben.
                </p>

                <p>
                  Ist die Nachbesserung nicht möglich oder wird sie verweigert, kann der Käufer vom Vertrag zurücktreten und 
                  eine <span className="cyber-neon-orange font-semibold">vollständige Rückerstattung</span> verlangen.
                </p>
              </div>
            </Card>

            {/* Section 6 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                6. PFLICHTEN DER <span className="cyber-neon-orange">VERKÄUFER</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Verkäufer verpflichten sich zur Einhaltung folgender Grundsätze:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-3">✓ Qualitätsstandards</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Professionelle Ausführung der Dienstleistung</li>
                      <li>• Einhaltung der angegebenen Lieferzeit</li>
                      <li>• Kommunikation mit dem Käufer</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-emerald-400 mb-3">✓ Rechtliche Vorgaben</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Keine urheberrechtsverletzenden Inhalte</li>
                      <li>• Keine illegalen oder sittenwidrigen Angebote</li>
                      <li>• Einhaltung der DSGVO</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-orange-400 mb-3">✓ Impressumspflicht</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Gewerbliche Verkäufer müssen ein Impressum angeben</li>
                      <li>• Vollständige Anbieterdaten erforderlich</li>
                      <li>• Umsatzsteuer-ID bei Umsatz &gt; 22.000€/Jahr</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-orange-400 mb-3">✓ Steuerpflichten</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Eigenverantwortliche Versteuerung der Einnahmen</li>
                      <li>• Kleinunternehmerregelung (§ 19 UStG) möglich</li>
                      <li>• Flinkly erstellt keine Rechnungen für Verkäufer</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-xl p-6 mt-6">
                  <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verbotene Inhalte und Dienstleistungen:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Illegale Dienstleistungen (Hacking, Betrug, Urheberrechtsverletzungen)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Gewaltverherrlichende, rassistische oder diskriminierende Inhalte</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Verkauf von Fake-Bewertungen, Follower-Käufe oder ähnliche Manipulationen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>Phishing, Spam oder andere betrügerische Aktivitäten</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Section 7 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                7. HAFTUNG UND <span className="cyber-neon-green">GEWÄHRLEISTUNG</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <h3 className="text-xl font-bold text-white mb-4">Haftung von Flinkly:</h3>
                
                <p>
                  Flinkly haftet <span className="cyber-neon-orange font-semibold">nicht</span> für die Qualität, Rechtmäßigkeit oder 
                  Vollständigkeit der von Verkäufern angebotenen Dienstleistungen. Die Verantwortung für die Erfüllung der Verträge 
                  liegt ausschließlich bei den jeweiligen Verkäufern.
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="mb-3">
                    Flinkly haftet nur für <span className="cyber-neon-green font-semibold">Vorsatz und grobe Fahrlässigkeit</span>. 
                    Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit nicht wesentliche Vertragspflichten 
                    (Kardinalpflichten) verletzt werden.
                  </p>
                  <p className="text-sm text-slate-400">
                    Kardinalpflichten sind solche Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags 
                    überhaupt erst ermöglicht und auf deren Einhaltung der Nutzer regelmäßig vertrauen darf.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Haftung der Verkäufer:</h3>
                
                <p>
                  Verkäufer haften gegenüber Käufern für die <span className="cyber-neon-orange font-semibold">ordnungsgemäße Erfüllung</span> 
                  der vereinbarten Dienstleistungen. Bei Mängeln oder Verzug gelten die gesetzlichen Gewährleistungsrechte.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Streitbeilegung:</h3>
                
                <p>
                  Bei Streitigkeiten zwischen Käufer und Verkäufer bietet Flinkly ein 
                  <span className="cyber-neon-green font-semibold"> internes Mediationsverfahren</span> an. 
                  Beide Parteien können einen Streitfall melden, woraufhin ein Admin-Mediator die Angelegenheit prüft und 
                  eine Lösung vorschlägt.
                </p>
              </div>
            </Card>

            {/* Section 8 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                8. DATENSCHUTZ UND <span className="cyber-neon-orange">DSGVO-COMPLIANCE</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Flinkly verarbeitet alle Daten 
                  <span className="cyber-neon-green font-semibold"> DSGVO-konform</span> und ausschließlich zu den in der 
                  <Link href="/privacy">
                    <span className="cyber-neon-green font-semibold underline cursor-pointer hover:text-emerald-300 transition-colors"> Datenschutzerklärung</span>
                  </Link> genannten Zwecken.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3">Ihre Rechte gemäß DSGVO:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Auskunftsrecht (Art. 15):</span> Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Berichtigungsrecht (Art. 16):</span> Fehlerhafte Daten können korrigiert werden</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Löschungsrecht (Art. 17):</span> Sie können die Löschung Ihrer Daten verlangen (30-Tage-Frist)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span><span className="font-semibold">Datenportabilität (Art. 20):</span> Export Ihrer Daten in maschinenlesbarem Format (JSON/CSV)</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  Zur Ausübung Ihrer Rechte nutzen Sie bitte unser 
                  <Link href="/privacy-dashboard">
                    <span className="cyber-neon-orange font-semibold underline cursor-pointer hover:text-orange-300 transition-colors"> Privacy-Dashboard</span>
                  </Link> oder kontaktieren Sie unseren Datenschutzbeauftragten.
                </p>
              </div>
            </Card>

            {/* Section 9 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                9. ÄNDERUNGEN DER AGB UND <span className="cyber-neon-green">KÜNDIGUNG</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <h3 className="text-xl font-bold text-white mb-4">Änderungen der AGB:</h3>
                
                <p>
                  Flinkly behält sich das Recht vor, diese AGB jederzeit zu ändern. 
                  Nutzer werden über Änderungen <span className="cyber-neon-orange font-semibold">mindestens 30 Tage im Voraus</span> per 
                  E-Mail informiert. Widerspricht der Nutzer den Änderungen nicht innerhalb dieser Frist, gelten die neuen AGB als akzeptiert.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Kündigung des Nutzerkontos:</h3>
                
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="mb-3">
                    Nutzer können ihr Konto jederzeit <span className="cyber-neon-green font-semibold">ohne Angabe von Gründen</span> kündigen. 
                    Die Kündigung erfolgt über die Account-Einstellungen oder per E-Mail an support@flinkly.de.
                  </p>
                  <p className="text-sm text-slate-400">
                    Hinweis: Bei Kündigung werden Ihre Daten nach einer 30-tägigen Wartezeit gelöscht. 
                    Laufende Aufträge müssen vor der Kündigung abgeschlossen werden.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Sperrung durch Flinkly:</h3>
                
                <p>
                  Flinkly kann Nutzerkonten bei Verstoß gegen diese AGB <span className="cyber-neon-orange font-semibold">sperren oder löschen</span>. 
                  Gründe für eine Sperrung sind u.a.:
                </p>

                <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-xl p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Wiederholte Verstöße gegen die Qualitätsstandards</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Betrügerische Aktivitäten oder Manipulation von Bewertungen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Belästigung oder Diskriminierung anderer Nutzer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Verstoß gegen gesetzliche Vorschriften</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Section 10 */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                10. SCHLUSSBESTIMMUNGEN UND <span className="cyber-neon-orange">ANWENDBARES RECHT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <h3 className="text-xl font-bold text-white mb-4">Anwendbares Recht:</h3>
                
                <p>
                  Es gilt das Recht der <span className="cyber-neon-green font-semibold">Bundesrepublik Deutschland</span> unter 
                  Ausschluss des UN-Kaufrechts (CISG). Für Verbraucher gilt diese Rechtswahl nur insoweit, als dadurch keine 
                  zwingenden gesetzlichen Bestimmungen des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, 
                  eingeschränkt werden.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Gerichtsstand:</h3>
                
                <p>
                  Gerichtsstand für alle Streitigkeiten aus und im Zusammenhang mit diesen AGB ist 
                  <span className="cyber-neon-orange font-semibold"> [ORT DES FIRMENSITZES]</span>, 
                  sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Salvatorische Klausel:</h3>
                
                <p>
                  Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, 
                  bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. 
                  Anstelle der unwirksamen oder undurchführbaren Bestimmung tritt eine Regelung, 
                  die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6 mt-6">
                  <h4 className="font-bold text-white mb-3">Online-Streitbeilegung (OS-Plattform):</h4>
                  <p className="mb-2">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  </p>
                  <a 
                    href="https://ec.europa.eu/consumers/odr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cyber-neon-green font-semibold underline hover:text-emerald-300 transition-colors"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                  <p className="mt-3 text-sm text-slate-400">
                    Flinkly ist nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren 
                    vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Section */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                KONTAKT UND <span className="cyber-neon-orange">SUPPORT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Bei Fragen zu diesen AGB oder zur Plattform kontaktieren Sie uns bitte:
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="font-semibold text-white mb-3">Flinkly Support:</p>
                  <p>
                    E-Mail: <span className="cyber-neon-green font-semibold">support@flinkly.de</span><br />
                    Telefon: <span className="cyber-neon-green font-semibold">[TELEFONNUMMER EINTRAGEN]</span><br />
                    Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
                  </p>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                  Stand dieser AGB: November 2025 | Version 1.0
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
