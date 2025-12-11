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
  MessageSquare, 
  ArrowLeft,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  Info,
  Scale
} from "lucide-react";

/**
 * Verkäufer-Beschwerdeformular (P2B Art. 11)
 * 
 * Internes Beschwerdemanagementsystem für gewerbliche Nutzer
 * gemäß Verordnung (EU) 2019/1150
 * 
 * Anforderungen:
 * - Kostenlos und leicht zugänglich
 * - Angemessene Bearbeitungszeit
 * - Individuelle Prüfung jeder Beschwerde
 * - Schriftliche Mitteilung des Ergebnisses
 */

type ComplaintCategory = 
  | "ranking"
  | "account_restriction"
  | "account_suspension"
  | "agb_interpretation"
  | "technical_issues"
  | "buyer_dispute"
  | "payment_issues"
  | "other";

const complaintCategories: { value: ComplaintCategory; label: string; description: string }[] = [
  { 
    value: "ranking", 
    label: "Ranking-Entscheidungen",
    description: "Fragen zur Platzierung Ihrer Gigs in den Suchergebnissen"
  },
  { 
    value: "account_restriction", 
    label: "Kontoeinschränkung",
    description: "Einschränkungen bei bestimmten Funktionen Ihres Kontos"
  },
  { 
    value: "account_suspension", 
    label: "Kontosperrung",
    description: "Vollständige oder teilweise Sperrung Ihres Verkäuferkontos"
  },
  { 
    value: "agb_interpretation", 
    label: "AGB-Auslegung",
    description: "Fragen zur Interpretation oder Anwendung unserer AGB"
  },
  { 
    value: "technical_issues", 
    label: "Technische Probleme",
    description: "Technische Fehler mit Auswirkung auf Ihr Geschäft"
  },
  { 
    value: "buyer_dispute", 
    label: "Streitigkeit mit Käufer",
    description: "Ungelöste Konflikte mit Käufern"
  },
  { 
    value: "payment_issues", 
    label: "Zahlungsprobleme",
    description: "Probleme mit Auszahlungen oder Gebühren"
  },
  { 
    value: "other", 
    label: "Sonstiges",
    description: "Andere Anliegen, die nicht in die obigen Kategorien passen"
  },
];

export default function SellerComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  
  // Form state
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [previousContact, setPreviousContact] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataProcessing, setAcceptedDataProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !subject || !description || !desiredOutcome) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }
    
    if (!acceptedTerms || !acceptedDataProcessing) {
      toast.error("Bitte akzeptieren Sie die erforderlichen Bedingungen");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - in production, this would be a real tRPC call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate ticket number
      const ticket = `BSW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setTicketNumber(ticket);
      setIsSubmitted(true);
      
      toast.success("Beschwerde erfolgreich eingereicht");
    } catch (error) {
      toast.error("Fehler beim Einreichen der Beschwerde");
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
                    Beschwerde erfolgreich eingereicht
                  </h1>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6">
                    <p className="text-sm text-slate-400 mb-1">Ihre Ticketnummer</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">{ticketNumber}</p>
                  </div>
                  
                  <div className="space-y-4 text-left mb-8">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Eingangsbestätigung</p>
                        <p className="text-sm text-slate-400">
                          Sie erhalten innerhalb von 48 Stunden eine Bestätigung per E-Mail.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Bearbeitung</p>
                        <p className="text-sm text-slate-400">
                          Ihre Beschwerde wird innerhalb von 14 Tagen bearbeitet.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Ergebnis</p>
                        <p className="text-sm text-slate-400">
                          Sie erhalten eine schriftliche Mitteilung über das Ergebnis.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/seller-dashboard">
                      <Button className="bg-primary hover:bg-primary/90">
                        Zum Seller Dashboard
                      </Button>
                    </Link>
                    <Link href="/p2b-transparency">
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        P2B-Informationen
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
          <Link href="/p2b-transparency">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur P2B-Transparenz
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Verkäufer-Beschwerde</h1>
              <p className="text-slate-400">
                Internes Beschwerdesystem gemäß P2B-Verordnung Art. 11
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Ihre Rechte als gewerblicher Nutzer</h3>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Kostenlose Nutzung des Beschwerdesystems</li>
                      <li>• Eingangsbestätigung innerhalb von 48 Stunden</li>
                      <li>• Bearbeitung innerhalb von 14 Tagen</li>
                      <li>• Schriftliche Mitteilung des Ergebnisses mit Begründung</li>
                      <li>• Bei Unzufriedenheit: Recht auf Mediation (Art. 12 P2B-VO)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complaint Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Beschwerdeformular</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300">
                      Kategorie der Beschwerde *
                    </Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as ComplaintCategory)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Bitte wählen Sie eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {complaintCategories.map((cat) => (
                          <SelectItem 
                            key={cat.value} 
                            value={cat.value}
                            className="text-white hover:bg-slate-700"
                          >
                            <div>
                              <p className="font-medium">{cat.label}</p>
                              <p className="text-xs text-slate-400">{cat.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-300">
                      Betreff *
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Kurze Zusammenfassung Ihres Anliegens"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      maxLength={200}
                    />
                    <p className="text-xs text-slate-500">{subject.length}/200 Zeichen</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">
                      Detaillierte Beschreibung *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Beschreiben Sie Ihr Anliegen so detailliert wie möglich. Nennen Sie relevante Daten, Gig-IDs, Bestellnummern etc."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px]"
                      maxLength={5000}
                    />
                    <p className="text-xs text-slate-500">{description.length}/5000 Zeichen</p>
                  </div>

                  {/* Previous Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="previousContact" className="text-slate-300">
                      Bisherige Kontaktaufnahmen (optional)
                    </Label>
                    <Textarea
                      id="previousContact"
                      value={previousContact}
                      onChange={(e) => setPreviousContact(e.target.value)}
                      placeholder="Haben Sie bereits den Support kontaktiert? Wenn ja, wann und mit welchem Ergebnis?"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                      maxLength={1000}
                    />
                  </div>

                  {/* Desired Outcome */}
                  <div className="space-y-2">
                    <Label htmlFor="desiredOutcome" className="text-slate-300">
                      Gewünschtes Ergebnis *
                    </Label>
                    <Textarea
                      id="desiredOutcome"
                      value={desiredOutcome}
                      onChange={(e) => setDesiredOutcome(e.target.value)}
                      placeholder="Was erwarten Sie als Lösung? Wie sollte die Situation aus Ihrer Sicht gelöst werden?"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                      maxLength={1000}
                    />
                  </div>

                  {/* File Upload Info */}
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white text-sm">Anhänge</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Falls Sie Belege (Screenshots, E-Mails, etc.) haben, können Sie diese 
                          nach Einreichung der Beschwerde per E-Mail an{" "}
                          <a href="mailto:beschwerde@mimitechai.com" className="text-primary hover:underline">
                            beschwerde@mimitechai.com
                          </a>{" "}
                          senden. Bitte geben Sie Ihre Ticketnummer an.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(c) => setAcceptedTerms(c === true)}
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                        Ich bestätige, dass die Angaben wahrheitsgemäß sind und ich berechtigt bin, 
                        diese Beschwerde im Namen meines Unternehmens einzureichen. *
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="dataProcessing"
                        checked={acceptedDataProcessing}
                        onCheckedChange={(c) => setAcceptedDataProcessing(c === true)}
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="dataProcessing" className="text-sm text-slate-400 cursor-pointer">
                        Ich stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Beschwerde 
                        gemäß der{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Datenschutzerklärung
                        </Link>{" "}
                        zu. *
                      </Label>
                    </div>
                  </div>

                  {/* Mediation Info */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-300 text-sm">Hinweis zur Mediation</p>
                        <p className="text-xs text-slate-300 mt-1">
                          Sollte Ihre Beschwerde nicht zu Ihrer Zufriedenheit gelöst werden, 
                          haben Sie das Recht, eine Mediation gemäß Art. 12 P2B-VO zu beantragen. 
                          Informationen zu den benannten Mediatoren finden Sie auf unserer{" "}
                          <Link href="/p2b-transparency" className="text-primary hover:underline">
                            P2B-Transparenzseite
                          </Link>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !acceptedTerms || !acceptedDataProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Wird eingereicht...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Beschwerde einreichen
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
        </div>
      </div>
    </div>
  );
}
