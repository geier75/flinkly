import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { RotateCcw, AlertTriangle, Clock, FileText } from "lucide-react";

export default function Widerruf() {
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
                <RotateCcw className="h-12 w-12 text-emerald-500 animate-pulse" />
                WIDERRUFS<span className="cyber-neon-green">BELEHRUNG</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                Ihr Recht auf Widerruf gemäß <span className="cyber-neon-orange font-semibold">§ 312g BGB</span> | EU-konform
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
                    Diese Widerrufsbelehrung wurde mit größter Sorgfalt erstellt, ersetzen jedoch <span className="cyber-neon-orange font-semibold">keine rechtliche Beratung</span>. 
                    Für rechtsverbindliche Widerrufsbelehrungen konsultieren Sie bitte einen auf Verbraucherrecht spezialisierten Anwalt. 
                    Diese Version basiert auf dem <span className="cyber-neon-green font-semibold">EU-Musterformular</span> und muss ggf. an Ihre spezifischen Geschäftsanforderungen angepasst werden.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1: Widerrufsrecht */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                WIDERRUFS<span className="cyber-neon-green">RECHT</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Sie haben das Recht, binnen <span className="cyber-neon-orange font-semibold">vierzehn Tagen</span> ohne Angabe von Gründen 
                  diesen Vertrag zu widerrufen.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-emerald-500" />
                    Widerrufsfrist:
                  </h3>
                  <p className="mb-3">
                    Die Widerrufsfrist beträgt <span className="cyber-neon-green font-semibold">14 Tage</span> ab dem Tag des Vertragsschlusses 
                    (d.h. ab dem Tag, an dem Sie das Gig bestellt und bezahlt haben).
                  </p>
                  <p className="text-sm text-slate-400">
                    Beispiel: Bestellen Sie ein Gig am 1. November, läuft die Widerrufsfrist bis zum 15. November (24:00 Uhr).
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">So üben Sie Ihr Widerrufsrecht aus:</h3>
                
                <p>
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Flinkly) mittels einer eindeutigen Erklärung 
                  (z.B. per E-Mail, Brief oder über das Kontaktformular) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6 mt-4">
                  <p className="font-semibold text-white mb-3">Kontaktdaten für Widerruf:</p>
                  <p>
                    <span className="cyber-neon-green font-semibold">Flinkly</span><br />
                    [FIRMENNAME EINTRAGEN]<br />
                    [STRASSE UND HAUSNUMMER]<br />
                    [PLZ UND ORT]<br />
                    [LAND]<br />
                    <br />
                    E-Mail: <span className="cyber-neon-orange font-semibold">widerruf@flinkly.de</span><br />
                    Telefon: <span className="cyber-neon-orange font-semibold">[TELEFONNUMMER EINTRAGEN]</span>
                  </p>
                </div>

                <p className="mt-6">
                  Sie können dafür das beigefügte <span className="cyber-neon-green font-semibold">Muster-Widerrufsformular</span> verwenden, 
                  das jedoch nicht vorgeschrieben ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die 
                  Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                </p>
              </div>
            </Card>

            {/* Section 2: Folgen des Widerrufs */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                FOLGEN DES <span className="cyber-neon-orange">WIDERRUFS</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, 
                  <span className="cyber-neon-green font-semibold"> unverzüglich und spätestens binnen vierzehn Tagen</span> ab dem Tag 
                  zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Rückzahlungsmodalitäten:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Rückzahlung erfolgt über <span className="font-semibold">Stripe</span> auf die ursprüngliche Zahlungsmethode</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Keine zusätzlichen Gebühren für die Rückzahlung</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-green font-bold">•</span>
                      <span>Bearbeitungszeit: <span className="cyber-neon-orange font-semibold">2-7 Werktage</span> (abhängig von Ihrer Bank)</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Wertersatz bei bereits erbrachten Dienstleistungen:</h3>
                
                <p>
                  Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, 
                  so haben Sie uns einen <span className="cyber-neon-orange font-semibold">angemessenen Betrag</span> zu zahlen, 
                  der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags 
                  unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
                </p>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6 mt-4">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Beispiel für Wertersatz:
                  </h4>
                  <p className="text-sm">
                    Sie bestellen ein Logo-Design für 100€. Der Verkäufer beginnt sofort mit der Arbeit (mit Ihrer Zustimmung). 
                    Nach 7 Tagen widerrufen Sie den Vertrag. Der Verkäufer hat bereits 50% der Arbeit erledigt (Entwürfe geliefert). 
                    Sie erhalten 50€ zurück, zahlen 50€ als Wertersatz für die bereits erbrachte Leistung.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 3: Vorzeitiges Erlöschen */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
                VORZEITIGES ERLÖSCHEN DES <span className="cyber-neon-green">WIDERRUFSRECHTS</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Erbringung von Dienstleistungen, 
                  wenn der Unternehmer die Dienstleistung <span className="cyber-neon-orange font-semibold">vollständig erbracht</span> hat und 
                  mit der Ausführung der Dienstleistung erst begonnen hat, nachdem der Verbraucher dazu seine 
                  <span className="cyber-neon-green font-semibold"> ausdrückliche Zustimmung</span> gegeben hat und gleichzeitig seine 
                  Kenntnis davon bestätigt hat, dass er sein Widerrufsrecht bei vollständiger Vertragserfüllung durch den Unternehmer verliert.
                </p>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                    Praktische Bedeutung für Flinkly:
                  </h3>
                  <p className="mb-3">
                    Wenn Sie ein Gig bestellen und der Verkäufer sofort mit der Arbeit beginnt (z.B. Logo-Design, Texterstellung), 
                    stimmen Sie durch die Bestätigung des Briefings der <span className="cyber-neon-orange font-semibold">sofortigen Ausführung</span> zu.
                  </p>
                  <p className="mb-3">
                    Ihr Widerrufsrecht bleibt bestehen, bis der Verkäufer die Dienstleistung 
                    <span className="cyber-neon-green font-semibold"> vollständig erbracht</span> hat (d.h. finale Dateien geliefert und von Ihnen abgenommen wurden).
                  </p>
                  <p className="text-sm text-slate-400">
                    Wichtig: Solange die Dienstleistung noch nicht vollständig erbracht ist, können Sie jederzeit widerrufen. 
                    Sie zahlen dann ggf. einen Wertersatz für bereits erbrachte Teilleistungen.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Ausnahmen vom Widerrufsrecht:</h3>
                
                <p>
                  Das Widerrufsrecht besteht gemäß § 312g Abs. 2 BGB nicht bei folgenden Verträgen:
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Dienstleistungen, die vollständig erbracht wurden (mit ausdrücklicher Zustimmung des Verbrauchers)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Digitale Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden (z.B. Downloads), 
                      wenn der Verbraucher ausdrücklich zugestimmt hat</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>Verträge zur Lieferung von Waren, die nach Kundenspezifikation angefertigt wurden (z.B. individuelles Logo-Design)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Section 4: Muster-Widerrufsformular */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-500" />
                MUSTER-<span className="cyber-neon-green">WIDERRUFSFORMULAR</span>
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden 
                  (nicht verpflichtend, aber empfohlen):
                </p>

                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-8 mt-6">
                  <p className="text-white font-semibold mb-6 text-center">
                    — Muster-Widerrufsformular —
                  </p>
                  
                  <div className="space-y-4 text-slate-300">
                    <p>
                      An:<br />
                      <span className="cyber-neon-green font-semibold">Flinkly</span><br />
                      [FIRMENNAME EINTRAGEN]<br />
                      [STRASSE UND HAUSNUMMER]<br />
                      [PLZ UND ORT]<br />
                      [LAND]<br />
                      E-Mail: <span className="cyber-neon-orange font-semibold">widerruf@flinkly.de</span>
                    </p>

                    <p className="pt-6">
                      Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:
                    </p>

                    <p className="pl-6">
                      — [Gig-Titel eintragen, z.B. "Logo-Design für Startup"] —
                    </p>

                    <p>
                      Bestellt am (*) / erhalten am (*): <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p>
                      Name des/der Verbraucher(s): <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p>
                      Anschrift des/der Verbraucher(s): <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p>
                      E-Mail-Adresse: <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p className="pt-6">
                      Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p>
                      Datum: <span className="border-b border-slate-600 px-4">______________</span>
                    </p>

                    <p className="text-sm text-slate-400 pt-6">
                      (*) Unzutreffendes streichen.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6 mt-6">
                  <h4 className="font-bold text-white mb-3">So senden Sie das Formular:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Per E-Mail:</span> Formular ausfüllen und an widerruf@flinkly.de senden</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Per Post:</span> Formular ausdrucken, ausfüllen, unterschreiben und per Brief senden</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span><span className="font-semibold">Über Account:</span> Widerruf direkt in Ihrem Flinkly-Account unter "Meine Bestellungen" einreichen</span>
                    </li>
                  </ul>
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
                  Bei Fragen zum Widerrufsrecht oder zur Rückabwicklung kontaktieren Sie uns bitte:
                </p>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <p className="font-semibold text-white mb-3">Flinkly Widerrufs-Support:</p>
                  <p>
                    E-Mail: <span className="cyber-neon-green font-semibold">widerruf@flinkly.de</span><br />
                    Telefon: <span className="cyber-neon-green font-semibold">[TELEFONNUMMER EINTRAGEN]</span><br />
                    Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
                  </p>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                  Stand dieser Widerrufsbelehrung: November 2025 | Version 1.0
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
