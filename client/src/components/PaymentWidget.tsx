// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CreditCard, Building2, Smartphone, ShoppingBag, Info } from "lucide-react";
import { PAYMENT_METHODS, formatPrice } from "@/const";
import { checkoutApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaymentWidgetProps {
  gigId: number;
  gigTitle: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentWidget({ gigId, gigTitle, amount, onSuccess, onError }: PaymentWidgetProps) {
  const [acceptEscrow, setAcceptEscrow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckoutMutation = useMutation({
    mutationFn: (gigId: number) => checkoutApi.createSession({ gigId, selectedPackage: 'basic' }),
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      toast.success("🚀 Weiterleitung zu Stripe Checkout...");
      window.open(data.url, '_blank');
      setIsProcessing(false);
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast.error("❌ Fehler bei der Zahlung");
      onError?.(error.message);
    },
  });

  const handlePayment = () => {
    if (!acceptEscrow) {
      toast.error("Bitte akzeptieren Sie die Escrow-Bedingungen");
      return;
    }

    setIsProcessing(true);
    createCheckoutMutation.mutate(gigId);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'sepa':
        return <Building2 className="h-5 w-5" />;
      case 'klarna':
        return <ShoppingBag className="h-5 w-5" />;
      case 'twint':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Sichere Zahlung
        </CardTitle>
        <CardDescription>
          Wählen Sie Ihre bevorzugte Zahlungsmethode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Zu zahlender Betrag:</span>
          <span className="text-2xl font-bold">{formatPrice(amount)}</span>
        </div>

        {/* Payment Methods Info */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Verfügbare Zahlungsmethoden</Label>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.value}
                className="flex items-center space-x-3 border rounded-lg p-3 bg-muted/30"
              >
                <RadioGroupItem value={method.value} id={method.value} />
                <Label
                  htmlFor={method.value}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{method.label}</div>
                    {method.value === 'sepa' && (
                      <div className="text-xs text-muted-foreground">
                        DACH-Region: DE, AT, CH
                      </div>
                    )}
                    {method.value === 'klarna' && (
                      <div className="text-xs text-muted-foreground">
                        Jetzt kaufen, später zahlen
                      </div>
                    )}
                    {method.value === 'twint' && (
                      <div className="text-xs text-muted-foreground">
                        Nur für Schweiz verfügbar
                      </div>
                    )}
                  </div>
                  {getPaymentIcon(method.value)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Escrow-System (Treuhand):</strong> Ihr Geld wird sicher verwahrt und erst nach
            erfolgreicher Lieferung und Ihrer Freigabe an den Verkäufer ausgezahlt.
          </AlertDescription>
        </Alert>

        {/* Escrow Acceptance */}
        <div className="flex items-start space-x-3 border rounded-lg p-4 bg-muted/30">
          <Checkbox
            id="escrow"
            checked={acceptEscrow}
            onCheckedChange={(checked) => setAcceptEscrow(checked as boolean)}
          />
          <div className="space-y-1 leading-none">
            <Label
              htmlFor="escrow"
              className="text-sm font-medium cursor-pointer"
            >
              Ich akzeptiere die Escrow-Bedingungen
            </Label>
            <p className="text-xs text-muted-foreground">
              Die Zahlung wird treuhänderisch verwahrt bis zur erfolgreichen Abnahme der Leistung.
            </p>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!acceptEscrow || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Zahlung wird verarbeitet...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Jetzt sicher bezahlen {formatPrice(amount)}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>🔒 Alle Zahlungen sind SSL-verschlüsselt</p>
          <p>✓ PCI-DSS konform | ✓ DSGVO-konform</p>
        </div>
      </CardContent>
    </Card>
  );
}
