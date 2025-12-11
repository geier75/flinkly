import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Building2, Mail, Phone, MapPin, User, FileText, ArrowLeft, Scale, Globe } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Startseite
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl shadow-emerald-500/30">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Impressum</h1>
                <p className="text-slate-400 mt-1">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>
                <p className="text-emerald-400 text-sm mt-1 font-medium">Gültig für: flinkly.eu</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Section 1: Anbieter */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              Anbieter
            </h2>
            
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
                <p className="text-xl font-bold text-slate-800 mb-2">
                  MiMi Tech Ai UG (haftungsbeschränkt)
                </p>
                <p className="text-sm text-emerald-600 mb-4 font-medium bg-emerald-50 inline-block px-3 py-1 rounded-full">
                  Betreiber der Plattform flinkly.eu
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Adresse:</p>
                      <p>Lindenplatz 23</p>
                      <p>75378 Bad Liebenzell</p>
                      <p>Deutschland</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  Vertretungsberechtigte Person:
                </h3>
                <p className="text-lg">
                  <span className="font-semibold text-emerald-600">Michael Bemler</span> (Geschäftsführer)
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  Registereintrag:
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-slate-800">Handelsregister:</span> <span className="text-emerald-600">Amtsgericht Stuttgart</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Registernummer:</span> <span className="text-emerald-600">HRB [NUMMER EINTRAGEN]</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Umsatzsteuer-ID:</span> <span className="text-emerald-600">DE [UST-ID EINTRAGEN]</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-3">
                    Gemäß § 27a Umsatzsteuergesetz (UStG)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Kontakt */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              Kontakt
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">E-Mail:</p>
                    <a href="mailto:info@mimitechai.com" className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      info@mimitechai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Telefon:</p>
                    <a href="tel:+4915758805737" className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                      +49 1575 8805737
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Globe className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Website:</p>
                    <a href="https://www.mimitechai.com" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                      www.mimitechai.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Verantwortlich für den Inhalt */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-xl">
                <User className="h-6 w-6 text-violet-600" />
              </div>
              Verantwortlich für den Inhalt
            </h2>
            
            <div className="bg-gradient-to-r from-violet-50 to-white rounded-2xl p-6 border border-violet-100">
              <p className="text-lg mb-2">
                <span className="font-semibold text-violet-600">Michael Bemler</span>
              </p>
              <p className="text-slate-600">Lindenplatz 23</p>
              <p className="text-slate-600">75378 Bad Liebenzell</p>
              <p className="text-slate-600">Deutschland</p>
            </div>
          </Card>

          {/* Section 4: Haftungsausschluss */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Scale className="h-6 w-6 text-amber-600" />
              </div>
              Haftungsausschluss
            </h2>
            
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Haftung für Inhalte</h3>
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

              <div className="bg-gradient-to-r from-amber-50 to-white rounded-2xl p-6 border border-amber-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Haftung für Links</h3>
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

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Urheberrecht</h3>
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

          {/* Section 5: DSA - Digital Services Act Kontaktstellen */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <FileText className="h-6 w-6 text-rose-600" />
              </div>
              DSA-Kontaktstellen
            </h2>
            <p className="text-slate-500 mb-6 ml-14">Gemäß Art. 11 & 12 Digital Services Act (EU) 2022/2065</p>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Kontaktstelle für Behörden (Art. 11 DSA)</h3>
                <p className="mb-3">
                  Für die Kommunikation mit Behörden der Mitgliedstaaten, der Kommission und dem Gremium für digitale Dienste:
                </p>
                <p>
                  <span className="font-semibold text-slate-800">E-Mail:</span> <span className="text-emerald-600">dsa-behoerden@mimitechai.com</span><br />
                  <span className="font-semibold text-slate-800">Sprachen:</span> Deutsch, Englisch
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Kontaktstelle für Nutzer (Art. 12 DSA)</h3>
                <p className="mb-3">
                  Für direkte und schnelle Kommunikation mit Nutzern unserer Plattform:
                </p>
                <p>
                  <span className="font-semibold text-slate-800">E-Mail:</span> <span className="text-blue-600">support@mimitechai.com</span><br />
                  <span className="font-semibold text-slate-800">Telefon:</span> <span className="text-emerald-600">+49 1575 8805737</span><br />
                  <span className="font-semibold text-slate-800">Erreichbarkeit:</span> Mo-Fr 9:00-18:00 Uhr<br />
                  <span className="font-semibold text-slate-800">Sprachen:</span> Deutsch, Englisch
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-white rounded-2xl p-6 border border-amber-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Meldung illegaler Inhalte (Art. 16 DSA)</h3>
                <p className="mb-3">
                  Zur Meldung von mutmaßlich rechtswidrigen Inhalten auf unserer Plattform:
                </p>
                <p>
                  <span className="font-semibold text-slate-800">E-Mail:</span> <span className="text-amber-600">meldung@mimitechai.com</span><br />
                  <span className="font-semibold text-slate-800">Online-Formular:</span> <a href="/report" className="text-emerald-600 hover:text-emerald-700">Meldeformular</a>
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  Wir bearbeiten alle Meldungen unverzüglich und informieren Sie über getroffene Maßnahmen.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 6: Online-Streitbeilegung (VSBG) */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Scale className="h-6 w-6 text-cyan-600" />
              </div>
              Online-Streitbeilegung
            </h2>
            <p className="text-slate-500 mb-6 ml-14">Gemäß § 36 Verbraucherstreitbeilegungsgesetz (VSBG)</p>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <div className="bg-gradient-to-r from-cyan-50 to-white rounded-2xl p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">EU-Plattform zur Online-Streitbeilegung</h3>
                <p className="mb-3">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                </p>
                <p>
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  Unsere E-Mail-Adresse: info@mimitechai.com
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Teilnahme an Streitbeilegungsverfahren</h3>
                <p>
                  Wir sind <span className="font-semibold text-emerald-600">bereit</span>, an Streitbeilegungsverfahren vor folgender Verbraucherschlichtungsstelle teilzunehmen:
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-cyan-600">Allgemeine Verbraucherschlichtungsstelle des Zentrums für Schlichtung e.V.</span><br />
                  Straßburger Straße 8<br />
                  77694 Kehl<br />
                  <a href="https://www.verbraucher-schlichter.de" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700">www.verbraucher-schlichter.de</a>
                </p>
              </div>
            </div>
          </Card>

          {/* Section 7: Flinkly-Plattform-spezifische Hinweise */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              Flinkly-Plattform
            </h2>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <span className="font-semibold text-emerald-600">Flinkly</span> ist ein Marktplatz für Freelancer-Dienstleistungen, 
                der von <span className="font-semibold text-slate-800">MiMi Tech Ai UG (haftungsbeschränkt)</span> betrieben wird.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Plattform-Verantwortung:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Flinkly stellt die technische Infrastruktur für den Austausch von Dienstleistungen bereit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Die auf der Plattform angebotenen Dienstleistungen werden von unabhängigen Verkäufern erbracht</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Flinkly übernimmt keine Haftung für die Qualität, Vollständigkeit oder Rechtmäßigkeit der angebotenen Dienstleistungen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Verträge kommen direkt zwischen Käufer und Verkäufer zustande</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-white rounded-2xl p-6 border border-amber-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Impressumspflicht für Verkäufer (§ 5 DDG):</h3>
                <p className="mb-3">
                  <span className="font-semibold text-amber-600">Gewerbliche Verkäufer</span> sind verpflichtet, ein vollständiges Impressum auf ihrem Profil anzugeben.
                </p>
                <p className="mb-3">
                  <span className="font-semibold text-slate-800">Pflichtangaben:</span>
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Name und Anschrift (ladungsfähige Anschrift)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>E-Mail-Adresse und Telefonnummer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Handelsregister-Nummer (falls eingetragen)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Umsatzsteuer-Identifikationsnummer (bei Umsatz &gt; 22.000€/Jahr)</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-slate-500">
                  Private Verkäufer (Hobby-Seller) sind von der Impressumspflicht befreit, sofern sie keine gewerbliche Tätigkeit ausüben.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Payment-Processing:</h3>
                <p className="mb-3">
                  Die Zahlungsabwicklung erfolgt über <span className="font-semibold text-violet-600">Stripe</span>. 
                  Flinkly speichert keine Kreditkartendaten oder Zahlungsinformationen.
                </p>
                <p className="text-sm text-slate-500">
                  Weitere Informationen zur Zahlungsabwicklung finden Sie in unserer Datenschutzerklärung.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              Fragen zum Impressum?
            </h2>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Bei Fragen zu diesem Impressum oder rechtlichen Angaben kontaktieren Sie uns bitte:
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
                <p>
                  E-Mail: <span className="font-semibold text-blue-600">info@mimitechai.com</span><br />
                  Telefon: <span className="font-semibold text-emerald-600">+49 1575 8805737</span><br />
                  Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
                </p>
              </div>

              <p className="text-sm text-slate-500 mt-6">
                Stand dieses Impressums: Dezember 2024 | Version 2.0 (DSA-konform)
              </p>
            </div>
          </Card>

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
