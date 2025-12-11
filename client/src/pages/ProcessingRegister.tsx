import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Database, Shield, Clock, Globe, Users, Server, CreditCard, MessageSquare, BarChart3, AlertTriangle } from "lucide-react";

/**
 * Verarbeitungsverzeichnis gemäß Art. 30 DSGVO
 * 
 * Dieses Verzeichnis dokumentiert alle Verarbeitungstätigkeiten
 * der Flinkly-Plattform (MiMi Tech Ai UG).
 */

interface ProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  legalBasis: string;
  dataCategories: string[];
  dataSubjects: string[];
  recipients: string[];
  thirdCountryTransfer: string | null;
  retentionPeriod: string;
  technicalMeasures: string[];
}

const processingActivities: ProcessingActivity[] = [
  {
    id: "VA-001",
    name: "Nutzerregistrierung und Kontoverwaltung",
    purpose: "Erstellung und Verwaltung von Nutzerkonten, Authentifizierung, Zugriffskontrolle",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["Name", "E-Mail-Adresse", "Passwort (gehasht)", "Profilbild (optional)", "Telefonnummer (optional)"],
    dataSubjects: ["Registrierte Nutzer (Käufer und Verkäufer)"],
    recipients: ["Supabase Inc. (Auftragsverarbeiter)"],
    thirdCountryTransfer: "Nein - EU-Server (Frankfurt)",
    retentionPeriod: "Bis zur Kontolöschung + 30 Tage Wartezeit",
    technicalMeasures: ["Passwort-Hashing (bcrypt)", "JWT-Authentifizierung", "Row Level Security", "TLS-Verschlüsselung"]
  },
  {
    id: "VA-002",
    name: "Zahlungsabwicklung",
    purpose: "Abwicklung von Zahlungen für Gig-Bestellungen, Auszahlungen an Verkäufer",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["Name", "E-Mail", "Zahlungsdaten (Kreditkarte/SEPA)", "Rechnungsadresse", "Transaktionshistorie"],
    dataSubjects: ["Käufer", "Verkäufer mit Stripe Connect"],
    recipients: ["Stripe Payments Europe Ltd. (Joint Controller)", "Stripe Inc. (Sub-Processor)"],
    thirdCountryTransfer: "USA - Standardvertragsklauseln (SCC)",
    retentionPeriod: "10 Jahre (§ 147 AO steuerrechtliche Aufbewahrungspflicht)",
    technicalMeasures: ["PCI-DSS Level 1 Compliance", "Tokenisierung", "3D Secure", "Keine Speicherung von Kartendaten bei Flinkly"]
  },
  {
    id: "VA-003",
    name: "Gig-Erstellung und -Verwaltung",
    purpose: "Erstellung, Bearbeitung und Veröffentlichung von Dienstleistungsangeboten",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["Gig-Titel", "Beschreibung", "Preis", "Lieferzeit", "Bilder/Medien", "Kategorien"],
    dataSubjects: ["Verkäufer"],
    recipients: ["Supabase Inc. (Auftragsverarbeiter)", "Cloudflare (CDN für Medien)"],
    thirdCountryTransfer: "Nein - EU-Server",
    retentionPeriod: "Bis zur Löschung durch Nutzer oder 3 Jahre nach letzter Aktivität",
    technicalMeasures: ["Inhaltsmoderation", "Spam-Filter", "Manuelle Prüfung vor Veröffentlichung"]
  },
  {
    id: "VA-004",
    name: "Bestellabwicklung",
    purpose: "Verarbeitung von Gig-Bestellungen, Kommunikation zwischen Käufer und Verkäufer",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["Bestelldetails", "Briefing", "Lieferdateien", "Kommunikationsverlauf", "Bewertungen"],
    dataSubjects: ["Käufer", "Verkäufer"],
    recipients: ["Supabase Inc. (Auftragsverarbeiter)"],
    thirdCountryTransfer: "Nein - EU-Server",
    retentionPeriod: "10 Jahre (steuerrechtliche Aufbewahrungspflicht)",
    technicalMeasures: ["Verschlüsselte Speicherung", "Zugriffskontrolle", "Audit-Logs"]
  },
  {
    id: "VA-005",
    name: "Messaging-System",
    purpose: "Direkte Kommunikation zwischen Käufern und Verkäufern",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["Nachrichteninhalt", "Zeitstempel", "Anhänge", "Lesebestätigungen"],
    dataSubjects: ["Käufer", "Verkäufer"],
    recipients: ["Supabase Inc. (Auftragsverarbeiter)"],
    thirdCountryTransfer: "Nein - EU-Server",
    retentionPeriod: "3 Jahre nach Abschluss der Bestellung",
    technicalMeasures: ["Ende-zu-Ende-Verschlüsselung (geplant)", "Spam-Filter", "Missbrauchserkennung"]
  },
  {
    id: "VA-006",
    name: "Bewertungssystem",
    purpose: "Erfassung und Anzeige von Nutzerbewertungen zur Qualitätssicherung",
    legalBasis: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)",
    dataCategories: ["Sternebewertung", "Textbewertung", "Nutzername", "Zeitstempel"],
    dataSubjects: ["Käufer (als Bewertende)", "Verkäufer (als Bewertete)"],
    recipients: ["Öffentlich sichtbar auf der Plattform"],
    thirdCountryTransfer: "Nein",
    retentionPeriod: "Dauerhaft (bis zur Löschung durch Nutzer oder Admin)",
    technicalMeasures: ["Verifizierung der Bestellung vor Bewertung", "Missbrauchserkennung"]
  },
  {
    id: "VA-007",
    name: "Analytics und Fehlerüberwachung",
    purpose: "Analyse der Websitenutzung, Fehlererkennung und -behebung",
    legalBasis: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) / Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse für Sentry)",
    dataCategories: ["IP-Adresse (anonymisiert)", "Browsertyp", "Seitenaufrufe", "Klicks", "Error-Logs", "Session-Replays"],
    dataSubjects: ["Alle Website-Besucher"],
    recipients: ["PostHog Inc. (Auftragsverarbeiter)", "Functional Software Inc. / Sentry (Auftragsverarbeiter)"],
    thirdCountryTransfer: "USA - Standardvertragsklauseln (SCC)",
    retentionPeriod: "PostHog: 14 Monate, Sentry: 90 Tage",
    technicalMeasures: ["IP-Anonymisierung", "Opt-in für Analytics", "Datenmaskierung bei Sentry"]
  },
  {
    id: "VA-008",
    name: "E-Mail-Kommunikation",
    purpose: "Transaktions-E-Mails, Benachrichtigungen, Support-Kommunikation",
    legalBasis: "Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)",
    dataCategories: ["E-Mail-Adresse", "Name", "Nachrichteninhalt"],
    dataSubjects: ["Registrierte Nutzer"],
    recipients: ["E-Mail-Dienstleister (zu konfigurieren)"],
    thirdCountryTransfer: "Abhängig vom Dienstleister",
    retentionPeriod: "3 Jahre nach letzter Kommunikation",
    technicalMeasures: ["TLS-Verschlüsselung", "SPF/DKIM/DMARC"]
  },
  {
    id: "VA-009",
    name: "KYBC - Verkäuferverifizierung",
    purpose: "Identitätsprüfung gewerblicher Verkäufer gemäß DSA Art. 30",
    legalBasis: "Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)",
    dataCategories: ["Vollständiger Name", "Anschrift", "Telefonnummer", "E-Mail", "Gewerbeanmeldung", "USt-IdNr.", "Ausweisdokument"],
    dataSubjects: ["Gewerbliche Verkäufer"],
    recipients: ["Interne Prüfung", "Ggf. Identitätsprüfungsdienstleister"],
    thirdCountryTransfer: "Nein",
    retentionPeriod: "6 Monate nach Beendigung der Geschäftsbeziehung + gesetzliche Aufbewahrungsfristen",
    technicalMeasures: ["Verschlüsselte Speicherung", "Zugriffsbeschränkung", "Audit-Logs"]
  },
  {
    id: "VA-010",
    name: "DSA-Meldeverfahren",
    purpose: "Entgegennahme und Bearbeitung von Meldungen illegaler Inhalte",
    legalBasis: "Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung - DSA)",
    dataCategories: ["Kontaktdaten des Meldenden", "Beschreibung des gemeldeten Inhalts", "Beweise", "Bearbeitungsstatus"],
    dataSubjects: ["Meldende Personen", "Betroffene Nutzer"],
    recipients: ["Interne Bearbeitung", "Ggf. Behörden bei Straftaten"],
    thirdCountryTransfer: "Nein",
    retentionPeriod: "5 Jahre nach Abschluss des Verfahrens",
    technicalMeasures: ["Vertrauliche Bearbeitung", "Dokumentation aller Schritte"]
  }
];

export default function ProcessingRegister() {
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
              <h1 className="text-5xl font-extrabold mb-4 tracking-tight cyber-chrome-text flex items-center gap-4">
                <Database className="h-12 w-12 text-emerald-500 animate-pulse" />
                VERARBEITUNGS<span className="cyber-neon-green">VERZEICHNIS</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                Gemäß <span className="cyber-neon-orange font-semibold">Art. 30 DSGVO</span> | Stand: Dezember 2024
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Verantwortlicher */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-500" />
                VERANTWORTLICHER
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-3">Angaben zum Verantwortlichen:</h3>
                  <p className="text-slate-300">
                    <span className="cyber-neon-green font-semibold">MiMi Tech Ai UG (haftungsbeschränkt)</span><br />
                    Lindenplatz 23<br />
                    75378 Bad Liebenzell<br />
                    Deutschland<br /><br />
                    <span className="font-semibold">Geschäftsführer:</span> Michael Bemler<br />
                    <span className="font-semibold">E-Mail:</span> datenschutz@mimitechai.com<br />
                    <span className="font-semibold">Telefon:</span> +49 1575 8805737
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-3">Datenschutzbeauftragter:</h3>
                  <p className="text-slate-300 mb-4">
                    <span className="text-orange-400">Kein externer DSB bestellt</span><br />
                    (Nicht erforderlich gem. Art. 37 DSGVO - weniger als 20 Mitarbeiter mit regelmäßiger Datenverarbeitung)
                  </p>
                  <p className="text-sm text-slate-400">
                    Datenschutz-Kontakt:<br />
                    <span className="cyber-neon-green">datenschutz@mimitechai.com</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Übersicht */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-500" />
                ÜBERSICHT DER <span className="cyber-neon-orange">VERARBEITUNGSTÄTIGKEITEN</span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Users className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-001</p>
                    <p className="text-sm text-slate-400">Nutzerregistrierung</p>
                  </div>
                </div>
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-002</p>
                    <p className="text-sm text-slate-400">Zahlungsabwicklung</p>
                  </div>
                </div>
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Server className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-003</p>
                    <p className="text-sm text-slate-400">Gig-Verwaltung</p>
                  </div>
                </div>
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-004</p>
                    <p className="text-sm text-slate-400">Bestellabwicklung</p>
                  </div>
                </div>
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-005</p>
                    <p className="text-sm text-slate-400">Messaging</p>
                  </div>
                </div>
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Globe className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">VA-007</p>
                    <p className="text-sm text-slate-400">Analytics</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detaillierte Verarbeitungstätigkeiten */}
            {processingActivities.map((activity, index) => (
              <Card key={activity.id} className="cyber-glass-card border-2 border-emerald-500/30 mb-6 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-mono mb-2">
                      {activity.id}
                    </span>
                    <h3 className="text-xl font-bold text-white">{activity.name}</h3>
                  </div>
                  {activity.thirdCountryTransfer && activity.thirdCountryTransfer !== "Nein" && activity.thirdCountryTransfer !== "Nein - EU-Server" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                      <Globe className="h-4 w-4" />
                      Drittland
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Zweck der Verarbeitung:</p>
                      <p className="text-slate-300">{activity.purpose}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Rechtsgrundlage:</p>
                      <p className="text-emerald-400">{activity.legalBasis}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Kategorien betroffener Personen:</p>
                      <ul className="text-slate-300">
                        {activity.dataSubjects.map((subject, i) => (
                          <li key={i}>• {subject}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Kategorien personenbezogener Daten:</p>
                      <ul className="text-slate-300">
                        {activity.dataCategories.map((cat, i) => (
                          <li key={i}>• {cat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Empfänger:</p>
                      <ul className="text-slate-300">
                        {activity.recipients.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Drittlandübermittlung:</p>
                      <p className={activity.thirdCountryTransfer?.includes("USA") ? "text-orange-400" : "text-emerald-400"}>
                        {activity.thirdCountryTransfer || "Keine"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Speicherdauer:</p>
                      <p className="text-slate-300">{activity.retentionPeriod}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Technische & organisatorische Maßnahmen:</p>
                      <ul className="text-slate-300">
                        {activity.technicalMeasures.map((measure, i) => (
                          <li key={i}>• {measure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Hinweis */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Hinweis zur Dokumentation</h3>
                  <p className="text-slate-300 mb-3">
                    Dieses Verarbeitungsverzeichnis wird regelmäßig aktualisiert und ist auf Anfrage der zuständigen 
                    Aufsichtsbehörde vorzulegen.
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold">Letzte Aktualisierung:</span> Dezember 2024<br />
                    <span className="font-semibold">Nächste Überprüfung:</span> März 2025<br />
                    <span className="font-semibold">Verantwortlich:</span> Michael Bemler (Geschäftsführer)
                  </p>
                </div>
              </div>
            </Card>

            {/* Back to Top */}
            <div className="mt-12 text-center">
              <Link href="/privacy">
                <Button className="cyber-neon-button px-12 py-6 text-lg mr-4">
                  → Datenschutzerklärung
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline"
                  className="border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-12 py-6 text-lg"
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
