import { useAuth } from "@/_core/hooks/useAuth";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { CheckoutSkeleton } from "@/components/SkeletonUI";
import ProgressIndicator from "@/components/ProgressIndicator";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import {
  CheckCircle,
  Upload,
  Shield,
  FileText,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Clock,
  Banknote,
  Smartphone,
} from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showExitIntent, setShowExitIntent] = useState(true);

  const { data: gig, isLoading } = trpc.gigs.getById.useQuery({ id: parseInt(id!) });

  // Form states
  const [briefing, setBriefing] = useState({
    projectName: "",
    description: "",
    targetAudience: "",
    colorPreferences: "",
    files: [] as File[],
  });

  const [payment, setPayment] = useState({
    method: "sepa",
    acceptEscrow: false,
  });

  const [legal, setLegal] = useState({
    needsAVV: false,
    acceptTerms: false,
    companyName: "",
    dataProcessing: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (order) => {
      toast.success("Auftrag erfolgreich erstellt!");
      setLocation(`/dashboard`); // Redirect to dashboard after order creation
    },
    onError: () => {
      toast.error("Fehler beim Erstellen des Auftrags");
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Bitte melde dich an");
      return;
    }

    if (!gig) return;

    createOrderMutation.mutate({
      gigId: gig.id,
      buyerMessage: JSON.stringify(briefing),
    });
  };

  if (!isAuthenticated) {
    return (
    <PremiumPageLayout>
        <PremiumCard className="max-w-md">
          <CardContent className="pt-6 text-center p-6 md:p-8 p-6 md:p-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Bitte melde dich an, um fortzufahren</p>
            <Button onClick={() => setLocation("/")}>Zur Startseite</Button>
          </CardContent>
        </PremiumCard>
      </PremiumPageLayout>
    );
  }

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!gig) {
    return (
    <PremiumPageLayout>
        <PremiumCard className="max-w-md">
          <CardContent className="pt-6 text-center p-6 md:p-8 p-6 md:p-8">
            <p className="text-slate-600 mb-4">Gig nicht gefunden</p>
            <Button onClick={() => setLocation("/marketplace")}>
              Zurück zum Marktplatz
            </Button>
          </CardContent>
        </PremiumCard>
      </PremiumPageLayout>
    );
  }

  const steps = [
    { id: 1, title: "Briefing", description: "Projektdetails & Anforderungen" },
    { id: 2, title: "Zahlung", description: "Zahlungsmethode wählen" },
    { id: 3, title: "Rechtliches", description: "AGB & Datenschutz" },
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return briefing.projectName.length >= 5 && briefing.description.length >= 20;
      case 2:
        return payment.acceptEscrow;
      case 3:
        return legal.acceptTerms && (!legal.needsAVV || (legal.companyName && legal.dataProcessing));
      default:
        return false;
    }
  };

  return (
    <PremiumPageLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs (H3: User-Kontrolle & Freiheit) */}
        <Breadcrumbs
          items={[
            { label: 'Marktplatz', href: '/marketplace' },
            { label: gig.title, href: `/gig/${gig.id}` },
            { label: 'Checkout', href: `/checkout/${gig.id}` },
          ]}
          className="mb-6"
        />

        {/* Progress Indicator (H1: System-Status sichtbar machen) */}
        <PremiumCard className="mb-6">
          <CardContent className="pt-6 p-6 md:p-8 p-6 md:p-8">
            <ProgressIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={(stepId) => setCurrentStep(stepId)}
              allowClickPrevious={true}
            />
          </CardContent>
        </PremiumCard>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Briefing */}
            {currentStep === 1 && (
              <PremiumCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Projekt-Briefing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
                  <div>
                    <Label htmlFor="projectName">
                      Projektname <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="projectName"
                      placeholder="z.B. Startup Logo für Tech-Firma"
                      value={briefing.projectName}
                      onChange={(e) =>
                        setBriefing({ ...briefing, projectName: e.target.value })
                      }
                      className={briefing.projectName.length > 0 && briefing.projectName.length < 5 ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {briefing.projectName.length > 0 && briefing.projectName.length < 5 && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Projektname muss mindestens 5 Zeichen lang sein
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">
                      Detaillierte Beschreibung <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Beschreibe dein Projekt so detailliert wie möglich..."
                      rows={6}
                      value={briefing.description}
                      onChange={(e) =>
                        setBriefing({ ...briefing, description: e.target.value })
                      }
                      className={briefing.description.length > 0 && briefing.description.length < 20 ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {briefing.description.length > 0 && briefing.description.length < 20 ? (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Beschreibung muss mindestens 20 Zeichen lang sein ({briefing.description.length}/20)
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Je detaillierter, desto besser das Ergebnis
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Zielgruppe (optional)</Label>
                    <Input
                      id="targetAudience"
                      placeholder="z.B. Tech-Startups, B2B-Kunden"
                      value={briefing.targetAudience}
                      onChange={(e) =>
                        setBriefing({ ...briefing, targetAudience: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="colorPreferences">Farbpräferenzen (optional)</Label>
                    <Input
                      id="colorPreferences"
                      placeholder="z.B. Blau, Grün, modern"
                      value={briefing.colorPreferences}
                      onChange={(e) =>
                        setBriefing({ ...briefing, colorPreferences: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Referenzen hochladen (optional)</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        Klicke oder ziehe Dateien hierher
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Max. 10MB pro Datei
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setLocation(`/gig/${gig.id}`)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepComplete(1)}
                    >
                      Weiter zur Zahlung
                    </Button>
                  </div>
                </CardContent>
              </PremiumCard>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <PremiumCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Zahlungsmethode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Wähle deine Zahlungsmethode</Label>
                      <p className="text-sm text-slate-600 mb-4">Alle Zahlungen sind sicher und verschlüsselt</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { id: "sepa", name: "SEPA-Lastschrift", icon: Banknote, description: "Direkte Banküberweisung" },
                        { id: "klarna", name: "Klarna", icon: CreditCard, description: "Flexible Zahlungsoptionen" },
                        { id: "twint", name: "TWINT", icon: Smartphone, description: "Schnelle Mobile Zahlung" },
                      ].map((method) => (
                        <div
                          key={method.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            payment.method === method.id
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          onClick={() => setPayment({ ...payment, method: method.id })}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                payment.method === method.id
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300"
                              }`}
                            >
                              {payment.method === method.id && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <method.icon className="h-5 w-5 text-primary" />
                                <span className="font-semibold text-slate-900">{method.name}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-transparent border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">Preisaufschlüsselung</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Gig-Preis:</span>
                        <span className="font-semibold">{Number(gig.price)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Flinkly-Gebühr (3%):</span>
                        <span className="font-semibold">{(Number(gig.price) * 0.03).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Zahlungsgebühr:</span>
                        <span className="font-semibold">0€ (kostenlos)</span>
                      </div>
                      <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-slate-900">Gesamtbetrag:</span>
                        <span className="font-bold text-lg text-primary">{(Number(gig.price) + Number(gig.price) * 0.03).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Escrow Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          Treuhand-Zahlung (Escrow)
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
                          Dein Geld wird sicher verwahrt und erst nach erfolgreicher Abnahme
                          an den Verkäufer ausgezahlt.
                        </p>
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="acceptEscrow"
                            checked={payment.acceptEscrow}
                            onCheckedChange={(checked) =>
                              setPayment({ ...payment, acceptEscrow: checked as boolean })
                            }
                          />
                          <Label
                            htmlFor="acceptEscrow"
                            className="text-sm text-blue-900 cursor-pointer"
                          >
                            Ich verstehe und akzeptiere die Treuhand-Zahlung
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Zurück
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepComplete(2)}
                    >
                      Weiter zu Rechtlichem
                    </Button>
                  </div>
                </CardContent>
              </PremiumCard>
            )}

            {/* Step 3: Legal */}
            {currentStep === 3 && (
              <PremiumCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Rechtliche Hinweise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
                  {/* AVV Check */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900 mb-2">
                          Verarbeitung personenbezogener Daten?
                        </h4>
                        <p className="text-sm text-amber-800 mb-3">
                          Wenn der Verkäufer personenbezogene Daten verarbeitet (z.B. Namen,
                          E-Mails), wird automatisch eine Auftragsverarbeitungsvereinbarung
                          (AVV) erstellt.
                        </p>
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="needsAVV"
                            checked={legal.needsAVV}
                            onCheckedChange={(checked) =>
                              setLegal({ ...legal, needsAVV: checked as boolean })
                            }
                          />
                          <Label
                            htmlFor="needsAVV"
                            className="text-sm text-amber-900 cursor-pointer"
                          >
                            Ja, es werden personenbezogene Daten verarbeitet
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {legal.needsAVV && (
                    <>
                      <div>
                        <Label htmlFor="companyName">Firmenname</Label>
                        <Input
                          id="companyName"
                          placeholder="Deine Firma GmbH"
                          value={legal.companyName}
                          onChange={(e) =>
                            setLegal({ ...legal, companyName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataProcessing">Art der Datenverarbeitung</Label>
                        <Textarea
                          id="dataProcessing"
                          placeholder="z.B. Verarbeitung von Kundennamen und E-Mail-Adressen"
                          rows={3}
                          value={legal.dataProcessing}
                          onChange={(e) =>
                            setLegal({ ...legal, dataProcessing: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={legal.acceptTerms}
                      onCheckedChange={(checked) =>
                        setLegal({ ...legal, acceptTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                      Ich akzeptiere die{" "}
                      <button
                        onClick={() => setLocation("/terms")}
                        className="text-primary hover:underline"
                      >
                        AGB
                      </button>{" "}
                      und{" "}
                      <button
                        onClick={() => setLocation("/privacy")}
                        className="text-primary hover:underline"
                      >
                        Datenschutzerklärung
                      </button>
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Zurück
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!isStepComplete(3) || createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending
                        ? "Wird erstellt..."
                        : "Auftrag verbindlich erstellen"}
                    </Button>
                  </div>
                </CardContent>
              </PremiumCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PremiumCard>
                <CardHeader>
                  <CardTitle className="text-base">Bestellübersicht</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{gig.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{gig.deliveryDays} Tage Lieferzeit</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Gig-Preis</span>
                      <span className="font-semibold">{Number(gig.price)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Servicegebühr</span>
                      <span className="font-semibold">0€</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Gesamt</span>
                    <span className="text-2xl font-bold text-primary">
                      {Number(gig.price)}€
                    </span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-green-800">
                        Geld-zurück-Garantie bei nicht erfolgreicher Abnahme
                      </p>
                    </div>
                  </div>
                </CardContent>
              </PremiumCard>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal 
        inCheckout={showExitIntent} 
        onContinue={() => {
          // Continue to payment
          setCurrentStep(3);
        }} 
      />
    </PremiumPageLayout>
  );
}

