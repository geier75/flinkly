import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { AlertTriangle, Shield, Send, CheckCircle, FileText, User, Mail, Link as LinkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * DSA-Meldeformular für illegale Inhalte
 * Gemäß Art. 16 Digital Services Act (EU) 2022/2065
 * 
 * Ermöglicht Nutzern die Meldung von:
 * - Rechtswidrigen Inhalten
 * - Verstößen gegen AGB
 * - Urheberrechtsverletzungen
 * - Betrug/Scam
 */

type ReportCategory = 
  | "illegal_content"
  | "copyright"
  | "fraud"
  | "harassment"
  | "spam"
  | "fake_profile"
  | "other";

interface ReportFormData {
  category: ReportCategory | "";
  contentUrl: string;
  contentId: string;
  description: string;
  legalBasis: string;
  reporterName: string;
  reporterEmail: string;
  isRightsHolder: boolean;
  agreeToProcess: boolean;
}

const categoryLabels: Record<ReportCategory, string> = {
  illegal_content: "Rechtswidriger Inhalt",
  copyright: "Urheberrechtsverletzung",
  fraud: "Betrug / Scam",
  harassment: "Belästigung / Hassrede",
  spam: "Spam / Unerwünschte Werbung",
  fake_profile: "Fake-Profil / Identitätsbetrug",
  other: "Sonstiges"
};

export default function Report() {
  const [formData, setFormData] = useState<ReportFormData>({
    category: "",
    contentUrl: "",
    contentId: "",
    description: "",
    legalBasis: "",
    reporterName: "",
    reporterEmail: "",
    isRightsHolder: false,
    agreeToProcess: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuliere API-Call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generiere Ticket-ID
    const newTicketId = `DSA-${Date.now().toString(36).toUpperCase()}`;
    setTicketId(newTicketId);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof ReportFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg mx-auto p-8"
        >
          <Card className="cyber-glass-card border-2 border-emerald-500/30 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Meldung eingegangen</h2>
            <p className="text-slate-300 mb-6">
              Vielen Dank für Ihre Meldung. Wir werden den gemeldeten Inhalt prüfen und Sie über das Ergebnis informieren.
            </p>
            
            <div className="bg-slate-900/40 border-2 border-emerald-500/30 rounded-xl p-6 mb-6">
              <p className="text-slate-400 mb-2">Ihre Ticket-Nummer:</p>
              <p className="text-2xl font-mono text-emerald-400 font-bold">{ticketId}</p>
            </div>

            <div className="text-sm text-slate-400 mb-6">
              <p className="mb-2"><strong>Bearbeitungszeit:</strong> In der Regel innerhalb von 24-48 Stunden</p>
              <p><strong>Benachrichtigung:</strong> Sie erhalten eine E-Mail an {formData.reporterEmail}</p>
            </div>

            <Link href="/">
              <Button className="cyber-neon-button px-8 py-4">
                ← Zurück zur Startseite
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Neon Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b-2 border-orange-500/30 bg-slate-950/80 backdrop-blur-xl">
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
                <AlertTriangle className="h-12 w-12 text-orange-500 animate-pulse" />
                INHALT <span className="cyber-neon-orange">MELDEN</span>
              </h1>
              <p className="text-slate-300 text-xl font-light">
                DSA-Meldeverfahren gemäß <span className="cyber-neon-orange font-semibold">Art. 16 Digital Services Act</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Info-Box */}
            <Card className="cyber-glass-card border-2 border-orange-500/30 mb-8 p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Wichtige Hinweise</h3>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Nutzen Sie dieses Formular zur Meldung von <strong>rechtswidrigen Inhalten</strong> auf Flinkly</li>
                    <li>• Wir bearbeiten alle Meldungen <strong>innerhalb von 24-48 Stunden</strong></li>
                    <li>• Sie werden über das Ergebnis per E-Mail informiert</li>
                    <li>• Falsche Meldungen können rechtliche Konsequenzen haben</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Meldeformular */}
            <Card className="cyber-glass-card border-2 border-emerald-500/30 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-500" />
                Meldeformular
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kategorie */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Art des Verstoßes <span className="text-red-400">*</span>
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* URL des Inhalts */}
                <div className="space-y-2">
                  <Label htmlFor="contentUrl" className="text-white flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL des gemeldeten Inhalts <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="contentUrl"
                    type="url"
                    placeholder="https://flinkly.de/gig/..."
                    value={formData.contentUrl}
                    onChange={(e) => handleChange("contentUrl", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    required
                  />
                </div>

                {/* Gig-ID oder Nutzer-ID */}
                <div className="space-y-2">
                  <Label htmlFor="contentId" className="text-white">
                    Gig-ID oder Nutzer-ID (falls bekannt)
                  </Label>
                  <Input
                    id="contentId"
                    placeholder="z.B. GIG-12345 oder USER-67890"
                    value={formData.contentId}
                    onChange={(e) => handleChange("contentId", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>

                {/* Beschreibung */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Beschreibung des Verstoßes <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Beschreiben Sie den gemeldeten Inhalt und warum Sie ihn für rechtswidrig halten..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white min-h-[120px]"
                    required
                  />
                </div>

                {/* Rechtsgrundlage */}
                <div className="space-y-2">
                  <Label htmlFor="legalBasis" className="text-white">
                    Rechtsgrundlage (optional)
                  </Label>
                  <Input
                    id="legalBasis"
                    placeholder="z.B. § 184 StGB, Art. 17 UrhG, etc."
                    value={formData.legalBasis}
                    onChange={(e) => handleChange("legalBasis", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">
                    Falls Sie die verletzte Rechtsnorm kennen, geben Sie diese bitte an.
                  </p>
                </div>

                {/* Trennlinie */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-500" />
                    Ihre Kontaktdaten
                  </h3>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="reporterName" className="text-white">
                    Ihr Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="reporterName"
                    placeholder="Max Mustermann"
                    value={formData.reporterName}
                    onChange={(e) => handleChange("reporterName", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    required
                  />
                </div>

                {/* E-Mail */}
                <div className="space-y-2">
                  <Label htmlFor="reporterEmail" className="text-white flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Ihre E-Mail-Adresse <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    placeholder="max@beispiel.de"
                    value={formData.reporterEmail}
                    onChange={(e) => handleChange("reporterEmail", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    required
                  />
                </div>

                {/* Rechteinhaber */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="isRightsHolder"
                    checked={formData.isRightsHolder}
                    onChange={(e) => handleChange("isRightsHolder", e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="isRightsHolder" className="text-slate-300 text-sm">
                    Ich bin der Rechteinhaber oder dessen bevollmächtigter Vertreter (bei Urheberrechtsverletzungen)
                  </Label>
                </div>

                {/* Einwilligung */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToProcess"
                    checked={formData.agreeToProcess}
                    onChange={(e) => handleChange("agreeToProcess", e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="agreeToProcess" className="text-slate-300 text-sm">
                    Ich bestätige, dass die Angaben wahrheitsgemäß sind und stimme der Verarbeitung meiner Daten 
                    zur Bearbeitung dieser Meldung zu. <span className="text-red-400">*</span>
                  </Label>
                </div>

                {/* Hinweis */}
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
                  <p className="mb-2">
                    <strong>Hinweis gemäß Art. 16 Abs. 3 DSA:</strong>
                  </p>
                  <p>
                    Wir werden Ihre Meldung unverzüglich prüfen und Sie über unsere Entscheidung informieren. 
                    Bei Entfernung des Inhalts wird auch der betroffene Nutzer benachrichtigt. 
                    Beide Parteien haben das Recht, gegen die Entscheidung Beschwerde einzulegen.
                  </p>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  className="cyber-neon-button w-full py-6 text-lg"
                  disabled={isSubmitting || !formData.agreeToProcess || !formData.category}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Wird gesendet...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Meldung absenden
                    </span>
                  )}
                </Button>
              </form>
            </Card>

            {/* Kontakt-Alternative */}
            <Card className="cyber-glass-card border-2 border-slate-700/50 mt-8 p-6">
              <h3 className="text-lg font-bold text-white mb-3">Alternative Kontaktmöglichkeiten</h3>
              <p className="text-slate-300 text-sm mb-3">
                Sie können Meldungen auch direkt per E-Mail einreichen:
              </p>
              <p className="text-slate-300">
                <span className="font-semibold">E-Mail:</span>{" "}
                <a href="mailto:meldung@mimitechai.com" className="cyber-neon-green hover:text-emerald-300">
                  meldung@mimitechai.com
                </a>
              </p>
              <p className="text-slate-300">
                <span className="font-semibold">Betreff:</span>{" "}
                <span className="text-slate-400">"DSA-Meldung: [Kurzbeschreibung]"</span>
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
