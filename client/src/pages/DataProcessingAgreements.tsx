import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Shield, CheckCircle, AlertTriangle, ExternalLink, Building2 } from "lucide-react";

/**
 * AVV-Übersicht (Auftragsverarbeitungsverträge)
 * Gemäß Art. 28 DSGVO
 * 
 * Dokumentation aller Dienstleister, mit denen AVVs abgeschlossen wurden.
 */

interface DataProcessor {
  id: string;
  name: string;
  service: string;
  location: string;
  avvStatus: "active" | "pending" | "not_required";
  avvDate: string | null;
  sccRequired: boolean;
  dataCategories: string[];
  privacyPolicyUrl: string;
  dpaUrl: string | null;
  notes: string;
}

const dataProcessors: DataProcessor[] = [
  {
    id: "AVV-001",
    name: "Supabase Inc.",
    service: "Datenbank, Authentifizierung, Storage",
    location: "EU (Frankfurt) / USA (Hauptsitz)",
    avvStatus: "active",
    avvDate: "2024-12-01",
    sccRequired: false,
    dataCategories: ["Nutzerdaten", "Gig-Daten", "Bestellungen", "Nachrichten", "Dateien"],
    privacyPolicyUrl: "https://supabase.com/privacy",
    dpaUrl: "https://supabase.com/legal/dpa",
    notes: "EU-Server in Frankfurt. DPA automatisch bei Nutzung akzeptiert. SOC 2 Type II zertifiziert."
  },
  {
    id: "AVV-002",
    name: "Stripe Payments Europe Ltd.",
    service: "Zahlungsabwicklung, Stripe Connect",
    location: "Irland (EU) / USA",
    avvStatus: "active",
    avvDate: "2024-12-01",
    sccRequired: true,
    dataCategories: ["Zahlungsdaten", "Transaktionen", "Bankverbindungen", "Identitätsdaten"],
    privacyPolicyUrl: "https://stripe.com/de/privacy",
    dpaUrl: "https://stripe.com/de/legal/dpa",
    notes: "Joint Controller Agreement für Zahlungsabwicklung. PCI-DSS Level 1 zertifiziert. SCC für US-Datenübermittlung."
  },
  {
    id: "AVV-003",
    name: "PostHog Inc.",
    service: "Web Analytics, Product Analytics",
    location: "USA",
    avvStatus: "active",
    avvDate: "2024-12-01",
    sccRequired: true,
    dataCategories: ["Nutzungsstatistiken", "Events", "IP-Adressen (anonymisiert)", "Gerätedaten"],
    privacyPolicyUrl: "https://posthog.com/privacy",
    dpaUrl: "https://posthog.com/dpa",
    notes: "Opt-in erforderlich. IP-Anonymisierung aktiviert. EU-Hosting-Option verfügbar (zu prüfen)."
  },
  {
    id: "AVV-004",
    name: "Functional Software Inc. (Sentry)",
    service: "Error Monitoring, Performance Tracking",
    location: "USA",
    avvStatus: "active",
    avvDate: "2024-12-01",
    sccRequired: true,
    dataCategories: ["Error-Logs", "Stack-Traces", "Session-Replays", "Gerätedaten"],
    privacyPolicyUrl: "https://sentry.io/privacy/",
    dpaUrl: "https://sentry.io/legal/dpa/",
    notes: "GDPR-Compliance aktiviert. Datenmaskierung für sensible Felder. SOC 2 Type II zertifiziert."
  },
  {
    id: "AVV-005",
    name: "Vercel Inc.",
    service: "Hosting, CDN, Edge Functions",
    location: "USA / Global Edge",
    avvStatus: "pending",
    avvDate: null,
    sccRequired: true,
    dataCategories: ["Server-Logs", "IP-Adressen", "Request-Daten"],
    privacyPolicyUrl: "https://vercel.com/legal/privacy-policy",
    dpaUrl: "https://vercel.com/legal/dpa",
    notes: "DPA muss noch abgeschlossen werden. Edge-Funktionen in EU verfügbar."
  },
  {
    id: "AVV-006",
    name: "Cloudflare Inc.",
    service: "CDN, DDoS-Schutz, DNS",
    location: "USA / Global Edge",
    avvStatus: "pending",
    avvDate: null,
    sccRequired: true,
    dataCategories: ["IP-Adressen", "Request-Daten", "Cached Content"],
    privacyPolicyUrl: "https://www.cloudflare.com/privacypolicy/",
    dpaUrl: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    notes: "DPA muss noch abgeschlossen werden. EU-Rechenzentren verfügbar."
  },
  {
    id: "AVV-007",
    name: "GitHub Inc. (Microsoft)",
    service: "Code-Repository, CI/CD",
    location: "USA",
    avvStatus: "not_required",
    avvDate: null,
    sccRequired: false,
    dataCategories: ["Quellcode", "Entwickler-Daten"],
    privacyPolicyUrl: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
    dpaUrl: null,
    notes: "Keine personenbezogenen Nutzerdaten. Nur Entwicklungsdaten."
  }
];

const getStatusBadge = (status: DataProcessor["avvStatus"]) => {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
          <CheckCircle className="h-4 w-4" />
          AVV aktiv
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
          <AlertTriangle className="h-4 w-4" />
          AVV ausstehend
        </span>
      );
    case "not_required":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-sm">
          Nicht erforderlich
        </span>
      );
  }
};

export default function DataProcessingAgreements() {
  const activeCount = dataProcessors.filter(p => p.avvStatus === "active").length;
  const pendingCount = dataProcessors.filter(p => p.avvStatus === "pending").length;

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
                <FileText className="h-12 w-12 text-emerald-500 animate-pulse" />
                AUFTRAGSVERARBEITUNGS<span className="cyber-neon-green">VERTRÄGE</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                AVV-Übersicht gemäß <span className="cyber-neon-orange font-semibold">Art. 28 DSGVO</span> | Stand: Dezember 2024
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
            {/* Status-Übersicht */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 mb-8 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-500" />
                STATUS-ÜBERSICHT
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-emerald-400 mb-2">{activeCount}</p>
                  <p className="text-slate-300">AVVs aktiv</p>
                </div>
                <div className="bg-slate-900/40 border-2 border-orange-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-orange-400 mb-2">{pendingCount}</p>
                  <p className="text-slate-300">AVVs ausstehend</p>
                </div>
                <div className="bg-slate-900/40 border-2 border-slate-700/50 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-slate-400 mb-2">{dataProcessors.length}</p>
                  <p className="text-slate-300">Dienstleister gesamt</p>
                </div>
              </div>
            </Card>

            {/* Rechtliche Grundlage */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                Rechtliche Grundlage
              </h2>
              
              <div className="text-slate-300 space-y-3">
                <p>
                  Gemäß <span className="cyber-neon-orange font-semibold">Art. 28 DSGVO</span> muss der Verantwortliche mit jedem 
                  Auftragsverarbeiter einen Vertrag schließen, der die Verarbeitung personenbezogener Daten regelt.
                </p>
                <p>
                  Bei Datenübermittlungen in <span className="cyber-neon-orange font-semibold">Drittländer</span> (z.B. USA) 
                  sind zusätzlich geeignete Garantien erforderlich, typischerweise 
                  <span className="cyber-neon-green font-semibold"> Standardvertragsklauseln (SCC)</span> der EU-Kommission.
                </p>
              </div>
            </Card>

            {/* Dienstleister-Liste */}
            <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text flex items-center gap-3">
              <Building2 className="h-8 w-8 text-emerald-500" />
              DIENSTLEISTER-<span className="cyber-neon-green">ÜBERSICHT</span>
            </h2>

            {dataProcessors.map((processor) => (
              <Card key={processor.id} className="cyber-glass-card border-2 border-emerald-500/30 mb-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm font-mono mb-2">
                      {processor.id}
                    </span>
                    <h3 className="text-xl font-bold text-white">{processor.name}</h3>
                    <p className="text-slate-400">{processor.service}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(processor.avvStatus)}
                    {processor.sccRequired && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        SCC erforderlich
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Standort:</p>
                      <p className="text-slate-300">{processor.location}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Verarbeitete Datenkategorien:</p>
                      <ul className="text-slate-300">
                        {processor.dataCategories.map((cat, i) => (
                          <li key={i}>• {cat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">AVV-Datum:</p>
                      <p className="text-slate-300">
                        {processor.avvDate 
                          ? new Date(processor.avvDate).toLocaleDateString('de-DE') 
                          : <span className="text-orange-400">Ausstehend</span>
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400 mb-1">Hinweise:</p>
                      <p className="text-slate-300">{processor.notes}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a 
                        href={processor.privacyPolicyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-300 rounded hover:bg-slate-700 transition-colors text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Datenschutz
                      </a>
                      {processor.dpaUrl && (
                        <a 
                          href={processor.dpaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors text-sm"
                        >
                          <ExternalLink className="h-3 w-3" />
                          DPA/AVV
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Aktionspunkte */}
            {pendingCount > 0 && (
              <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  Offene Aktionspunkte
                </h2>
                
                <ul className="space-y-3 text-slate-300">
                  {dataProcessors.filter(p => p.avvStatus === "pending").map((processor) => (
                    <li key={processor.id} className="flex items-start gap-3">
                      <span className="cyber-neon-orange font-bold">•</span>
                      <span>
                        <span className="font-semibold">{processor.name}:</span> AVV/DPA abschließen
                        {processor.dpaUrl && (
                          <a 
                            href={processor.dpaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-emerald-400 hover:text-emerald-300"
                          >
                            → DPA-Link
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Back to Top */}
            <div className="mt-12 text-center">
              <Link href="/processing-register">
                <Button className="cyber-neon-button px-12 py-6 text-lg mr-4">
                  → Verarbeitungsverzeichnis
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
