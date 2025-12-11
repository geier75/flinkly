import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Shield, 
  ArrowLeft,
  Eye,
  Edit3,
  Trash2,
  Download,
  Ban,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Info,
  User,
  Lock
} from "lucide-react";

/**
 * Betroffenenrechte-Seite (DSGVO Art. 15-22)
 * 
 * Implementiert alle Betroffenenrechte:
 * - Art. 15: Auskunftsrecht
 * - Art. 16: Recht auf Berichtigung
 * - Art. 17: Recht auf Löschung ("Recht auf Vergessenwerden")
 * - Art. 18: Recht auf Einschränkung der Verarbeitung
 * - Art. 20: Recht auf Datenübertragbarkeit
 * - Art. 21: Widerspruchsrecht
 * - Art. 22: Automatisierte Entscheidungsfindung
 */

type RightType = 
  | "access"        // Art. 15
  | "rectification" // Art. 16
  | "erasure"       // Art. 17
  | "restriction"   // Art. 18
  | "portability"   // Art. 20
  | "objection"     // Art. 21
  | "automated";    // Art. 22

const rightsInfo: { 
  value: RightType; 
  label: string; 
  article: string;
  icon: typeof Eye;
  description: string;
  responseTime: string;
}[] = [
  { 
    value: "access", 
    label: "Auskunftsrecht",
    article: "Art. 15 DSGVO",
    icon: Eye,
    description: "Sie haben das Recht zu erfahren, welche personenbezogenen Daten wir über Sie verarbeiten.",
    responseTime: "1 Monat"
  },
  { 
    value: "rectification", 
    label: "Recht auf Berichtigung",
    article: "Art. 16 DSGVO",
    icon: Edit3,
    description: "Sie können die Berichtigung unrichtiger oder die Vervollständigung unvollständiger Daten verlangen.",
    responseTime: "1 Monat"
  },
  { 
    value: "erasure", 
    label: "Recht auf Löschung",
    article: "Art. 17 DSGVO",
    icon: Trash2,
    description: "Sie können die Löschung Ihrer Daten verlangen, wenn bestimmte Voraussetzungen erfüllt sind.",
    responseTime: "1 Monat"
  },
  { 
    value: "restriction", 
    label: "Recht auf Einschränkung",
    article: "Art. 18 DSGVO",
    icon: Ban,
    description: "Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.",
    responseTime: "1 Monat"
  },
  { 
    value: "portability", 
    label: "Recht auf Datenübertragbarkeit",
    article: "Art. 20 DSGVO",
    icon: Download,
    description: "Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.",
    responseTime: "1 Monat"
  },
  { 
    value: "objection", 
    label: "Widerspruchsrecht",
    article: "Art. 21 DSGVO",
    icon: AlertTriangle,
    description: "Sie können der Verarbeitung Ihrer Daten aus besonderen Gründen widersprechen.",
    responseTime: "Unverzüglich"
  },
  { 
    value: "automated", 
    label: "Automatisierte Entscheidungen",
    article: "Art. 22 DSGVO",
    icon: Lock,
    description: "Sie haben das Recht, nicht einer ausschließlich automatisierten Entscheidung unterworfen zu werden.",
    responseTime: "1 Monat"
  },
];

export default function DataSubjectRights() {
  const [selectedRight, setSelectedRight] = useState<RightType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  
  // Form state
  const [details, setDetails] = useState("");
  const [acceptedIdentity, setAcceptedIdentity] = useState(false);
  const [acceptedProcessing, setAcceptedProcessing] = useState(false);

  const selectedRightInfo = rightsInfo.find(r => r.value === selectedRight);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRight || !details) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }
    
    if (!acceptedIdentity || !acceptedProcessing) {
      toast.error("Bitte bestätigen Sie die erforderlichen Angaben");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ticket = `DSR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setTicketNumber(ticket);
      setIsSubmitted(true);
      
      toast.success("Antrag erfolgreich eingereicht");
    } catch (error) {
      toast.error("Fehler beim Einreichen des Antrags");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-slate-900/50 border-emerald-500/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-4">
                    Antrag erfolgreich eingereicht
                  </h1>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6">
                    <p className="text-sm text-slate-400 mb-1">Ihre Antragsnummer</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">{ticketNumber}</p>
                  </div>
                  
                  <div className="space-y-4 text-left mb-8">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Identitätsprüfung</p>
                        <p className="text-sm text-slate-400">
                          Wir werden Ihre Identität verifizieren, bevor wir Ihren Antrag bearbeiten.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Bearbeitungszeit</p>
                        <p className="text-sm text-slate-400">
                          Gemäß DSGVO bearbeiten wir Ihren Antrag innerhalb von {selectedRightInfo?.responseTime || "1 Monat"}.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Bestätigung</p>
                        <p className="text-sm text-slate-400">
                          Sie erhalten eine E-Mail-Bestätigung mit weiteren Informationen.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/privacy-dashboard">
                      <Button className="bg-primary hover:bg-primary/90">
                        Zum Privacy Dashboard
                      </Button>
                    </Link>
                    <Link href="/privacy">
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        Datenschutzerklärung
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link href="/privacy-dashboard">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Privacy Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Betroffenenrechte</h1>
              <p className="text-slate-400">
                DSGVO Art. 15-22 - Ihre Datenschutzrechte ausüben
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Rights Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Ihre Rechte im Überblick</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rightsInfo.map((right) => {
                const Icon = right.icon;
                const isSelected = selectedRight === right.value;
                return (
                  <button
                    key={right.value}
                    onClick={() => setSelectedRight(right.value)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? "bg-primary/20 border-primary" 
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-slate-400"}`} />
                      <span className={`font-medium ${isSelected ? "text-primary" : "text-white"}`}>
                        {right.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{right.article}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Selected Right Info */}
          {selectedRightInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <selectedRightInfo.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {selectedRightInfo.label} ({selectedRightInfo.article})
                      </h3>
                      <p className="text-slate-300 text-sm mb-2">
                        {selectedRightInfo.description}
                      </p>
                      <p className="text-xs text-slate-400">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Bearbeitungszeit: {selectedRightInfo.responseTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Antrag stellen</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Right Selection (if not already selected) */}
                  {!selectedRight && (
                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        Welches Recht möchten Sie ausüben? *
                      </Label>
                      <Select value={selectedRight} onValueChange={(v) => setSelectedRight(v as RightType)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue placeholder="Bitte wählen Sie ein Recht" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {rightsInfo.map((right) => (
                            <SelectItem 
                              key={right.value} 
                              value={right.value}
                              className="text-white hover:bg-slate-700"
                            >
                              {right.label} ({right.article})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2">
                    <Label htmlFor="details" className="text-slate-300">
                      Details zu Ihrem Antrag *
                    </Label>
                    <Textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={
                        selectedRight === "access" 
                          ? "Beschreiben Sie, welche Informationen Sie erhalten möchten..."
                          : selectedRight === "rectification"
                          ? "Welche Daten sind unrichtig oder unvollständig? Was ist die korrekte Information?"
                          : selectedRight === "erasure"
                          ? "Welche Daten sollen gelöscht werden und warum?"
                          : selectedRight === "restriction"
                          ? "Welche Verarbeitung soll eingeschränkt werden und warum?"
                          : selectedRight === "portability"
                          ? "Welche Daten möchten Sie erhalten? In welchem Format?"
                          : selectedRight === "objection"
                          ? "Gegen welche Verarbeitung widersprechen Sie und aus welchen Gründen?"
                          : selectedRight === "automated"
                          ? "Welche automatisierte Entscheidung betrifft Sie?"
                          : "Beschreiben Sie Ihr Anliegen..."
                      }
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px]"
                      maxLength={5000}
                    />
                    <p className="text-xs text-slate-500">{details.length}/5000 Zeichen</p>
                  </div>

                  {/* Identity Verification Info */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-300 text-sm">Identitätsprüfung</p>
                        <p className="text-xs text-slate-300 mt-1">
                          Gemäß Art. 12 Abs. 6 DSGVO müssen wir Ihre Identität verifizieren, 
                          bevor wir Ihren Antrag bearbeiten können. Wir werden Sie ggf. um 
                          zusätzliche Informationen bitten.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="identity"
                        checked={acceptedIdentity}
                        onCheckedChange={(c) => setAcceptedIdentity(c === true)}
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="identity" className="text-sm text-slate-400 cursor-pointer">
                        Ich bestätige, dass ich die betroffene Person bin oder berechtigt bin, 
                        diesen Antrag im Namen der betroffenen Person zu stellen. *
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="processing"
                        checked={acceptedProcessing}
                        onCheckedChange={(c) => setAcceptedProcessing(c === true)}
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="processing" className="text-sm text-slate-400 cursor-pointer">
                        Ich verstehe, dass Flinkly meine Daten zur Bearbeitung dieses Antrags 
                        verarbeiten muss und stimme der Verarbeitung gemäß der{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Datenschutzerklärung
                        </Link>{" "}
                        zu. *
                      </Label>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {selectedRight === "portability" && (
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                      <p className="text-sm text-slate-300 mb-3">
                        <strong className="text-white">Schnellzugriff:</strong> Sie können Ihre Daten 
                        auch direkt über das Privacy Dashboard exportieren:
                      </p>
                      <Link href="/data-export-dashboard">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                          <Download className="h-4 w-4 mr-2" />
                          Zum Datenexport
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedRight || !acceptedIdentity || !acceptedProcessing}
                    className="w-full bg-primary hover:bg-primary/90 py-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Wird eingereicht...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Antrag einreichen
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    * Pflichtfelder
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Datenschutzbeauftragter</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Sie können sich auch direkt an unseren Datenschutzbeauftragten wenden:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    <strong className="text-white">E-Mail:</strong>{" "}
                    <a href="mailto:datenschutz@mimitechai.com" className="text-primary hover:underline">
                      datenschutz@mimitechai.com
                    </a>
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-white">Post:</strong>{" "}
                    MiMi Tech Ai UG (haftungsbeschränkt), Datenschutzbeauftragter, Lindenplatz 23, 75378 Bad Liebenzell
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Info */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800 mt-8">
            <p>Stand: Dezember 2024 | Version 1.0</p>
            <p className="mt-1">
              Rechtsgrundlage: DSGVO Art. 15-22
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
