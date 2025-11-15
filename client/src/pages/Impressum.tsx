import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Building2, Mail, Phone, MapPin, User, FileText } from "lucide-react";

export default function Impressum() {
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
                <Building2 className="h-12 w-12 text-emerald-500 animate-pulse" />
                IMPRES<span className="cyber-neon-green">SUM</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                Angaben gemäß <span className="cyber-neon-orange font-semibold">§ 5 TMG</span>
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
            {/* Section 1: Anbieter */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Building2 className="h-8 w-8 text-emerald-500" />
                AN<span className="cyber-neon-green">BIETER</span>
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <p className="text-2xl font-bold text-white mb-4 cyber-neon-green">
                    MiMi Tech Ai UG (haftungsbeschränkt)
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Adresse:</p>
                        <p>Lindenplatz 23</p>
                        <p>75378 Bad Liebenzell</p>
                        <p>Deutschland</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="h-6 w-6 text-emerald-500" />
                    Vertretungsberechtigte Person:
                  </h3>
                  <p className="text-lg">
                    <span className="cyber-neon-orange font-semibold">Michael Bemler</span> (Geschäftsführer)
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-emerald-500" />
                    Registereintrag:
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold text-white">Handelsregister:</span> <span className="cyber-neon-green">Amtsgericht Stuttgart</span>
                    </p>
                    <p>
                      <span className="font-semibold text-white">Registernummer:</span> <span className="cyber-neon-green">HRB [NUMMER EINTRAGEN]</span>
                    </p>
                    <p>
                      <span className="font-semibold text-white">Umsatzsteuer-Identifikationsnummer:</span> <span className="cyber-neon-orange">DE [UST-ID EINTRAGEN]</span>
                    </p>
                    <p className="text-sm text-slate-400 mt-3">
                      Gemäß § 27a Umsatzsteuergesetz (UStG)
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Kontakt */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                KON<span className="cyber-neon-orange">TAKT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-400">E-Mail:</p>
                        <a href="mailto:info@mimitechai.com" className="text-lg cyber-neon-green font-semibold hover:text-emerald-400 transition-colors">
                          info@mimitechai.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-6 w-6 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-400">Telefon:</p>
                        <a href="tel:+4915758805737" className="text-lg cyber-neon-orange font-semibold hover:text-orange-400 transition-colors">
                          +49 1575 8805737
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-400">Website:</p>
                        <a href="https://www.mimitechai.com" target="_blank" rel="noopener noreferrer" className="text-lg cyber-neon-green font-semibold hover:text-emerald-400 transition-colors">
                          www.mimitechai.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Verantwortlich für den Inhalt */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                VERANTWORTLICH FÜR DEN <span className="cyber-neon-green">INHALT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="text-lg mb-2">
                    <span className="cyber-neon-orange font-semibold">Michael Bemler</span>
                  </p>
                  <p>Lindenplatz 23</p>
                  <p>75378 Bad Liebenzell</p>
                  <p>Deutschland</p>
                </div>
              </div>
            </Card>

            {/* Section 4: Haftungsausschluss */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                HAFTUNGS<span className="cyber-neon-orange">AUSSCHLUSS</span>
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Haftung für Inhalte</h3>
                  <p className="mb-4">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                    Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen 
                    zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p>
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. 
                    Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. 
                    Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Haftung für Links</h3>
                  <p className="mb-4">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                    Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten 
                    ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                  <p className="mb-4">
                    Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                    Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                  <p>
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. 
                    Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Urheberrecht</h3>
                  <p className="mb-4">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. 
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                  <p className="mb-4">
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p>
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. 
                    Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
                    bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 5: Online-Streitbeilegung */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                ONLINE-<span className="cyber-neon-green">STREITBEILEGUNG</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter 
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="cyber-neon-orange font-semibold hover:text-orange-400 transition-colors ml-1">
                    https://ec.europa.eu/consumers/odr
                  </a> finden.
                </p>
                <p>
                  Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </Card>

            {/* Section 6: Flinkly-spezifische Hinweise */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                FLINKLY-<span className="cyber-neon-orange">PLATTFORM</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  <span className="cyber-neon-green font-semibold">Flinkly</span> ist ein Marktplatz für Mikrodienstleistungen, 
                  der von <span className="cyber-neon-orange font-semibold">MiMi Tech Ai UG (haftungsbeschränkt)</span> betrieben wird.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Plattform-Verantwortung:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Flinkly stellt die technische Infrastruktur für den Austausch von Dienstleistungen bereit</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Die auf der Plattform angebotenen Dienstleistungen werden von unabhängigen Verkäufern erbracht</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Flinkly übernimmt keine Haftung für die Qualität, Vollständigkeit oder Rechtmäßigkeit der angebotenen Dienstleistungen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Verträge kommen direkt zwischen Käufer und Verkäufer zustande</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Impressumspflicht für Verkäufer (§ 5 TMG):</h3>
                  <p className="mb-3">
                    <span className="cyber-neon-orange font-semibold">Gewerbliche Verkäufer</span> sind verpflichtet, ein vollständiges Impressum auf ihrem Profil anzugeben.
                  </p>
                  <p className="mb-3">
                    <span className="font-semibold text-white">Pflichtangaben:</span>
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Name und Anschrift (ladungsfähige Anschrift)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>E-Mail-Adresse und Telefonnummer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Handelsregister-Nummer (falls eingetragen)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Umsatzsteuer-Identifikationsnummer (bei Umsatz &gt; 22.000€/Jahr)</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-slate-400">
                    Private Verkäufer (Hobby-Seller) sind von der Impressumspflicht befreit, sofern sie keine gewerbliche Tätigkeit ausüben.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Payment-Processing:</h3>
                  <p className="mb-3">
                    Die Zahlungsabwicklung erfolgt über <span className="cyber-neon-orange font-semibold">Stripe</span>. 
                    Flinkly speichert keine Kreditkartendaten oder Zahlungsinformationen.
                  </p>
                  <p className="text-sm text-slate-400">
                    Weitere Informationen zur Zahlungsabwicklung finden Sie in unserer Datenschutzerklärung.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Section */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                FRAGEN ZUM <span className="cyber-neon-green">IMPRESSUM?</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Bei Fragen zu diesem Impressum oder rechtlichen Angaben kontaktieren Sie uns bitte:
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p>
                    E-Mail: <span className="cyber-neon-green font-semibold">info@mimitechai.com</span><br />
                    Telefon: <span className="cyber-neon-green font-semibold">+49 1575 8805737</span><br />
                    Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
                  </p>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                  Stand dieses Impressums: November 2025 | Version 1.0
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
