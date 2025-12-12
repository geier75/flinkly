// @ts-nocheck
import { useState, useEffect } from "react";
import { paymentMethodsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Trash2, Check, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

interface SavedPaymentMethodsProps {
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  selectedPaymentMethodId: string | null;
}

// ============ Add Payment Method Form ============

interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function AddPaymentMethodFormInner({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePaymentMethodMutation = useMutation({
    mutationFn: (paymentMethodId: string) => paymentMethodsApi.save(paymentMethodId),
    onSuccess: () => {
      toast.success("Zahlungsmethode erfolgreich hinzugefügt!");
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message || "Fehler beim Speichern");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe ist noch nicht geladen");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirm the SetupIntent
      const { error: stripeError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href, // Not used for redirect: 'if_required'
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || "Fehler bei der Kartenverifizierung");
        setIsLoading(false);
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        // Save the payment method to our database
        savePaymentMethodMutation.mutate(setupIntent.payment_method as string);
      }
    } catch (err: any) {
      setError(err.message || "Ein unerwarteter Fehler ist aufgetreten");
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-slate-900/40 border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white">Neue Karte hinzufügen</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-400"
            disabled={isLoading}
          >
            Abbrechen
          </Button>
        </div>

        {/* Stripe Payment Element */}
        <div className="p-4 bg-white rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird gespeichert...</>
          ) : (
            "Karte speichern"
          )}
        </Button>
      </form>
    </Card>
  );
}

function AddPaymentMethodForm({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const data = await paymentMethodsApi.getSetupIntent();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Fehler beim Initialisieren");
        setIsLoading(false);
      }
    };
    fetchSetupIntent();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 bg-slate-900/40 border-slate-700">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Card>
    );
  }

  if (error || !clientSecret || !stripePromise) {
    return (
      <Card className="p-6 bg-slate-900/40 border-slate-700">
        <div className="text-center py-4">
          <p className="text-red-400 mb-4">{error || "Stripe konnte nicht geladen werden"}</p>
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        </div>
      </Card>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#10b981',
            colorBackground: '#1e293b',
            colorText: '#f1f5f9',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <AddPaymentMethodFormInner onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}

/**
 * SavedPaymentMethods Component
 * 
 * Displays saved payment methods and allows user to:
 * - Select a saved payment method for checkout
 * - Delete saved payment methods
 * - Add new payment method (triggers Stripe Elements)
 * 
 * Used in Checkout.tsx for faster checkout experience
 */
export function SavedPaymentMethods({
  onSelectPaymentMethod,
  selectedPaymentMethodId,
}: SavedPaymentMethodsProps) {
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const queryClient = useQueryClient();
  
  // Fetch saved payment methods
  const { data: paymentMethods, isLoading, refetch } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => paymentMethodsApi.list(),
  });

  // Delete payment method mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.delete(id),
    onSuccess: () => {
      toast.success("Zahlungsmethode gelöscht");
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Fehler beim Löschen");
    },
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.setDefault(id),
    onSuccess: () => {
      toast.success("Standard-Zahlungsmethode aktualisiert");
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Fehler beim Aktualisieren");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Möchten Sie diese Zahlungsmethode wirklich löschen?")) {
      deletePaymentMethodMutation.mutate(id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };

  const getCardBrandIcon = (brand: string) => {
    // Map card brands to icons (simplified)
    const brandMap: Record<string, string> = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
    };
    return brandMap[brand.toLowerCase()] || "💳";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-slate-800/50 rounded-lg animate-pulse" />
        <div className="h-20 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  const hasSavedMethods = paymentMethods && paymentMethods.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Zahlungsmethoden</h3>
        {hasSavedMethods && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewCardForm(!showNewCardForm)}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Neue Karte
          </Button>
        )}
      </div>

      {/* Saved Payment Methods */}
      {hasSavedMethods ? (
        <div className="space-y-3">
          {paymentMethods.map((pm: any) => {
            const isSelected = selectedPaymentMethodId === pm.stripePaymentMethodId;
            const isDefault = pm.isDefault;

            return (
              <Card
                key={pm.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-accent bg-accent/10"
                    : "border border-slate-700 bg-slate-900/40 hover:border-accent/50"
                }`}
                onClick={() => onSelectPaymentMethod(pm.stripePaymentMethodId)}
              >
                <div className="flex items-center justify-between">
                  {/* Card Info */}
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className="text-3xl">{getCardBrandIcon(pm.brand)}</div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white capitalize">
                          {pm.brand} •••• {pm.last4}
                        </p>
                        {isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                            Standard
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
                        Gültig bis {pm.expiryMonth.toString().padStart(2, "0")}/{pm.expiryYear}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Set Default Button */}
                    {!isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(pm.id);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        Als Standard
                      </Button>
                    )}

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pm.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-900/40 rounded-lg border border-slate-700">
          <CreditCard className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 mb-4">Keine gespeicherten Zahlungsmethoden</p>
          <Button
            variant="outline"
            onClick={() => setShowNewCardForm(true)}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Zahlungsmethode hinzufügen
          </Button>
        </div>
      )}

      {/* New Card Form with Stripe Elements */}
      {showNewCardForm && (
        <AddPaymentMethodForm 
          onSuccess={() => {
            setShowNewCardForm(false);
            refetch();
          }}
          onCancel={() => setShowNewCardForm(false)}
        />
      )}

      {/* Info Text */}
      <p className="text-xs text-slate-500 flex items-center space-x-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>
          Ihre Zahlungsinformationen werden sicher bei Stripe gespeichert. Wir
          speichern keine vollständigen Kartendaten.
        </span>
      </p>
    </div>
  );
}
