import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitIntent } from "@/hooks/useExitIntent";
import { Gift, X } from "lucide-react";
import { A } from "@/lib/analytics";
import { trpc } from "@/lib/trpc";

interface ExitIntentModalProps {
  inCheckout: boolean;
  gigId?: number;
  gigPrice?: number;
  onContinue?: () => void;
}

/**
 * Exit Intent Modal Component
 * 
 * Triggers when user shows exit intention (mouse leaving top, inactivity)
 * Shows discount offer (5€) or generic retention message
 * 
 * Features:
 * - Fires only once per session (sessionStorage)
 * - A/B testing ready (variant: "control" | "discount")
 * - Telemetry events: triggered, shown, accepted, dismissed
 */
export function ExitIntentModal({ inCheckout, gigId, gigPrice, onContinue }: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);
  const [variant] = useState<"control" | "discount">("discount"); // TODO: A/B testing with feature flags
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [isCreatingDiscount, setIsCreatingDiscount] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const createDiscountMutation = trpc.discount.createExitIntentDiscount.useMutation();

  useExitIntent(
    inCheckout && sessionStorage.getItem("exit_intent_done") !== "1",
    () => {
      // Mark as triggered in session
      sessionStorage.setItem("exit_intent_done", "1");
      
      // Track exit intent triggered
      A.exitIntentTriggered({ v: 1, inCheckout });
      
      setOpen(true);
    }
  );

  useEffect(() => {
    if (open) {
      // Track exit intent shown
      A.exitIntentShown({ v: 1, variant });
    }
  }, [open, variant]);

  const handleAccept = async () => {
    // Track exit intent accepted
    A.exitIntentAccepted({ v: 1, variant, hasCode: variant === "discount" });
    
    if (variant === "discount" && !discountCode) {
      // Create discount code
      setIsCreatingDiscount(true);
      try {
        const result = await createDiscountMutation.mutateAsync({
          gigId: gigId || 0,
          gigPrice: gigPrice || 0,
        });
        
        setDiscountCode(result.code);
        
        // Store discount code in sessionStorage for Checkout
        sessionStorage.setItem("exit_intent_discount_code", result.code);
        
        console.log("[Exit Intent] Discount code created:", result.code);
      } catch (error) {
        console.error("[Exit Intent] Failed to create discount code:", error);
      } finally {
        setIsCreatingDiscount(false);
      }
      return; // Don't close modal yet, show discount code first
    }
    
    setOpen(false);
    onContinue?.();
  };

  const handleDismiss = () => {
    if (!showEmailCapture && variant === "discount") {
      // Show email capture before dismissing
      setShowEmailCapture(true);
      return;
    }

    // Track exit intent dismissed
    A.exitIntentDismissed({ v: 1, variant });
    
    // Store email for remarketing
    if (email) {
      sessionStorage.setItem('exit_intent_email', email);
      console.log('[Exit Intent] Email captured for remarketing:', email);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {variant === "discount" ? (
              <>
                <Gift className="h-6 w-6 text-blue-600" />
                Fast fertig – 5€ Rabatt sichern!
              </>
            ) : (
              <>
                Fast fertig – nicht verlieren!
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {variant === "discount" ? (
              <>
                Bleib im Checkout und sichere dir <strong>5€ Rabatt</strong> auf deine Bestellung. 
                Dein Fortschritt wird automatisch gespeichert.
              </>
            ) : (
              <>
                Bleib im Checkout – dein Fortschritt wird automatisch gespeichert. 
                Du kannst jederzeit zurückkehren.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {showEmailCapture ? (
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-sm text-slate-600">
              Kein Problem! Wir senden dir den Rabatt-Code per E-Mail, damit du später weitermachen kannst.
            </p>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleDismiss}
              disabled={!email || !email.includes('@')}
            >
              Rabatt-Code per E-Mail senden
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Nein danke
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleAccept}
            >
              {variant === "discount" ? "Rabatt einlösen & weiter" : "Weiter zur Zahlung"}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4 mr-2" />
              Später fortsetzen
            </Button>
          </div>
        )}

        {variant === "discount" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              💰 <strong>Einmaliges Angebot:</strong> 5€ Rabatt nur für dich!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
