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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { CheckoutSkeleton } from "@/components/SkeletonUI";
import ProgressIndicator from "@/components/ProgressIndicator";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { useFormTracking } from "@/hooks/useAnalytics";
import { trackEvent } from "@/hooks/useAnalytics";
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
  Gift,
} from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showExitIntent, setShowExitIntent] = useState(true);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  
  // Analytics
  const { trackFocus, trackBlur, trackSubmit, trackError } = useFormTracking('checkout_form');

  const { data: gig, isLoading } = trpc.gigs.getById.useQuery({ id: parseInt(id!) });
  
  // Track checkout started event
  useEffect(() => {
    if (gig) {
      trackEvent('checkout_started', {
        gig_id: gig.id,
        gig_title: gig.title,
        price: gig.price,
      });
    }
  }, [gig]);

  // Load discount code and package/extras from sessionStorage
  useEffect(() => {
    const code = sessionStorage.getItem('exit_intent_discount_code');
    if (code) {
      setDiscountCode(code);
      setDiscountAmount(500); // 5€ in cents
      console.log('[Checkout] Discount code loaded from sessionStorage:', code);
    }
    
    const pkg = sessionStorage.getItem('checkout_package');
    if (pkg && (pkg === 'basic' || pkg === 'standard' || pkg === 'premium')) {
      setSelectedPackage(pkg);
      console.log('[Checkout] Package loaded from sessionStorage:', pkg);
    }
    
    const extras = sessionStorage.getItem('checkout_extras');
    if (extras) {
      try {
        const parsed = JSON.parse(extras);
        if (Array.isArray(parsed)) {
          setSelectedExtras(parsed);
          console.log('[Checkout] Extras loaded from sessionStorage:', parsed);
        }
      } catch (e) {
        console.error('[Checkout] Failed to parse extras:', e);
      }
    }
  }, []);

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
      setLocation(`/order/confirmation/${order.orderId}`); // Redirect to order confirmation page
    },
    onError: () => {
      toast.error("Fehler beim Erstellen des Auftrags");
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Bitte melde dich an");
      trackError('authentication', 'User not authenticated');
      return;
    }

    if (!gig) return;
    
    // Track form submission
    trackSubmit({
      gig_id: gig.id,
      payment_method: payment.method,
      needs_avv: legal.needsAVV,
    });

    createOrderMutation.mutate({
      gigId: gig.id,
      buyerMessage: JSON.stringify(briefing),
      selectedPackage,
      selectedExtras,
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
    { id: 4, title: "Überprüfung", description: "Bestellung überprüfen" },
  ];

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return briefing.projectName.length >= 5 && briefing.description.length >= 20;
      case 2:
        return payment.acceptEscrow;
      case 3:
        return legal.acceptTerms && (!legal.needsAVV || (!!legal.companyName && !!legal.dataProcessing));
      case 4:
        return isStepComplete(1) && isStepComplete(2) && isStepComplete(3);
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
                  {/* DSGVO-Hinweis */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 flex items-start gap-2">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Datenschutz:</strong> Deine Daten werden DSGVO-konform verarbeitet und nur zur Auftragsabwicklung verwendet. 
                        <a href="/datenschutz" className="text-primary hover:underline">Mehr erfahren</a>
                      </span>
                    </p>
                  </div>

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
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>256-Bit SSL-Verschlüsselung</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Powered by Stripe</span>
                        </div>
                      </div>
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
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-amber-900">
                            Verarbeitung personenbezogener Daten?
                          </h4>
                          <div className="group relative">
                            <button
                              type="button"
                              className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center hover:bg-amber-700 transition-colors"
                              aria-label="AVV-Erklärung"
                            >
                              ?
                            </button>
                            <div className="absolute left-0 top-6 w-80 bg-white border-2 border-amber-600 rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <h5 className="font-semibold text-slate-900 mb-2">
                                Was ist eine AVV?
                              </h5>
                              <p className="text-sm text-slate-700 mb-3">
                                Eine <strong>Auftragsverarbeitungsvereinbarung (AVV)</strong> ist gemäß Art. 28 DSGVO erforderlich, 
                                wenn ein Dienstleister personenbezogene Daten im Auftrag verarbeitet.
                              </p>
                              <p className="text-sm text-slate-700 mb-2">
                                <strong>Beispiele:</strong>
                              </p>
                              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                                <li>Newsletter-Erstellung mit Kundendaten</li>
                                <li>Webdesign mit Kontaktformularen</li>
                                <li>Social Media Management mit Nutzerdaten</li>
                              </ul>
                              <p className="text-xs text-slate-500 mt-3">
                                Die AVV wird automatisch generiert und per E-Mail zugestellt.
                              </p>
                            </div>
                          </div>
                        </div>
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
                      </button>
                      , die{" "}
                      <button
                        onClick={() => setLocation("/widerruf")}
                        className="text-primary hover:underline"
                      >
                        Widerrufsbelehrung
                      </button>{" "}
                      und die{" "}
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
                      onClick={() => setCurrentStep(4)}
                      disabled={!isStepComplete(3)}
                    >
                      Weiter zur Überprüfung
                    </Button>
                  </div>
                </CardContent>
              </PremiumCard>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <PremiumCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Bestellung überprüfen
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    Bitte überprüfe alle Angaben sorgfältig, bevor du die Bestellung abschließt.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 p-6 md:p-8 p-6 md:p-8">
                  {/* Order Summary Header */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Käuferschutz aktiv
                        </h4>
                        <p className="text-sm text-blue-800">
                          Dein Geld wird erst nach erfolgreicher Abnahme ausgezahlt. 
                          Du hast 14 Tage Widerrufsrecht gemäß §312g BGB.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Briefing Summary */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Projekt-Briefing</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-sm text-slate-600">Projektname:</span>
                        <p className="font-medium">{briefing.projectName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Beschreibung:</span>
                        <p className="text-sm">{briefing.description}</p>
                      </div>
                      {briefing.targetAudience && (
                        <div>
                          <span className="text-sm text-slate-600">Zielgruppe:</span>
                          <p className="text-sm">{briefing.targetAudience}</p>
                        </div>
                      )}
                      {briefing.colorPreferences && (
                        <div>
                          <span className="text-sm text-slate-600">Farbpräferenzen:</span>
                          <p className="text-sm">{briefing.colorPreferences}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Zahlung</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        {payment.method === "sepa" && <Banknote className="h-5 w-5 text-slate-600" />}
                        {payment.method === "card" && <CreditCard className="h-5 w-5 text-slate-600" />}
                        {payment.method === "paypal" && <Smartphone className="h-5 w-5 text-slate-600" />}
                        <span className="font-medium">
                          {payment.method === "sepa" && "SEPA-Lastschrift"}
                          {payment.method === "card" && "Kreditkarte"}
                          {payment.method === "paypal" && "PayPal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legal Summary */}
                  {legal.needsAVV && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Rechtliches</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                        <div>
                          <span className="text-sm text-slate-600">Unternehmen:</span>
                          <p className="font-medium">{legal.companyName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600">Datenverarbeitung:</span>
                          <p className="text-sm">{legal.dataProcessing}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Legal Notice before Purchase */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Rechtliche Hinweise
                    </h4>
                    <div className="space-y-2 text-sm text-amber-900">
                      <p>
                        • <strong>AGB:</strong> Mit dem Kauf akzeptierst du unsere{" "}
                        <a href="/terms" target="_blank" className="text-primary hover:underline font-semibold">
                          Allgemeinen Geschäftsbedingungen
                        </a>
                      </p>
                      <p>
                        • <strong>Widerrufsrecht:</strong> Du hast 14 Tage Widerrufsrecht. Details in der{" "}
                        <a href="/widerruf" target="_blank" className="text-primary hover:underline font-semibold">
                          Widerrufsbelehrung
                        </a>
                      </p>
                      <p>
                        • <strong>Datenschutz:</strong> Deine Daten werden DSGVO-konform verarbeitet. Siehe{" "}
                        <a href="/privacy" target="_blank" className="text-primary hover:underline font-semibold">
                          Datenschutzerklärung
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      Zurück
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleSubmit}
                      disabled={!isStepComplete(4) || createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending
                        ? "Wird erstellt..."
                        : "✓ Jetzt verbindlich bestellen"}
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
                    {discountCode && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <Gift className="h-4 w-4" />
                          Rabatt ({discountCode})
                        </span>
                        <span className="font-semibold text-green-600">-{(discountAmount / 100).toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Servicegebühr</span>
                      <span className="font-semibold">0€</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Gesamt</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.max(Number(gig.price) - (discountAmount / 100), 0).toFixed(2)}€
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
        gigId={gig?.id}
        gigPrice={gig?.price}
        onContinue={() => {
          // Continue to payment
          setCurrentStep(3);
        }} 
      />
    </PremiumPageLayout>
  );
}

