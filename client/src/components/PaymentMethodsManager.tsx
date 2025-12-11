import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Trash2, Check, Plus, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

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

  const savePaymentMethodMutation = trpc.paymentMethods.save.useMutation({
    onSuccess: () => {
      toast.success("Zahlungsmethode erfolgreich hinzugefügt!");
      onSuccess();
    },
    onError: (err) => {
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
      const { error: stripeError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || "Fehler bei der Kartenverifizierung");
        setIsLoading(false);
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        savePaymentMethodMutation.mutate({
          stripePaymentMethodId: setupIntent.payment_method as string,
          setAsDefault: true,
        });
      }
    } catch (err: any) {
      setError(err.message || "Ein unerwarteter Fehler ist aufgetreten");
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-slate-50 border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-slate-800">Neue Karte hinzufügen</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-500"
            disabled={isLoading}
          >
            Abbrechen
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden border border-slate-200">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
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

  const createSetupIntentMutation = trpc.paymentMethods.createSetupIntent.useMutation({
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
      setIsLoading(false);
    },
    onError: (err) => {
      setError(err.message || "Fehler beim Initialisieren");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    createSetupIntentMutation.mutate();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </Card>
    );
  }

  if (error || !clientSecret || !stripePromise) {
    return (
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="text-center py-4">
          <p className="text-red-500 mb-4">{error || "Stripe konnte nicht geladen werden. Bitte prüfe deine Konfiguration."}</p>
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
          theme: 'stripe',
          variables: {
            colorPrimary: '#06b6d4',
            colorBackground: '#ffffff',
            colorText: '#1e293b',
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

// ============ Payment Methods Manager ============

export function PaymentMethodsManager() {
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: paymentMethods, isLoading, refetch } = trpc.paymentMethods.list.useQuery();

  const deletePaymentMethodMutation = trpc.paymentMethods.delete.useMutation({
    onSuccess: () => {
      toast.success("Zahlungsmethode gelöscht");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Löschen");
    },
  });

  const setDefaultMutation = trpc.paymentMethods.setDefault.useMutation({
    onSuccess: () => {
      toast.success("Standard-Zahlungsmethode aktualisiert");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Aktualisieren");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Möchten Sie diese Zahlungsmethode wirklich löschen?")) {
      deletePaymentMethodMutation.mutate({ id });
    }
  };

  const handleSetDefault = (id: number) => {
    setDefaultMutation.mutate({ id });
  };

  const getCardBrandLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower === 'visa') return '💳 Visa';
    if (brandLower === 'mastercard') return '💳 Mastercard';
    if (brandLower === 'amex') return '💳 Amex';
    return '💳 ' + brand;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const hasSavedMethods = paymentMethods && paymentMethods.length > 0;

  return (
    <div className="space-y-4">
      {/* Saved Payment Methods */}
      {hasSavedMethods ? (
        <div className="space-y-3">
          {paymentMethods.map((pm: any) => (
            <div
              key={pm.id}
              className={`p-4 rounded-xl border transition-all ${
                pm.isDefault 
                  ? "bg-cyan-50 border-cyan-200" 
                  : "bg-slate-50 border-slate-200 hover:border-cyan-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 capitalize">
                        {getCardBrandLogo(pm.brand)} •••• {pm.last4}
                      </p>
                      {pm.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Standard
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      Gültig bis {pm.expiryMonth?.toString().padStart(2, "0")}/{pm.expiryYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(pm.id)}
                      className="text-slate-600 hover:text-cyan-600"
                    >
                      Als Standard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pm.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showAddForm ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
          <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <p className="text-slate-600 mb-4">Keine gespeicherten Zahlungsmethoden</p>
        </div>
      ) : null}

      {/* Add New Payment Method */}
      {showAddForm ? (
        <AddPaymentMethodForm 
          onSuccess={() => {
            setShowAddForm(false);
            refetch();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowAddForm(true)}
          className="w-full border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 text-slate-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Zahlungsmethode hinzufügen
        </Button>
      )}

      {/* Security Info */}
      <p className="text-xs text-slate-500 flex items-center gap-2 pt-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Deine Zahlungsinformationen werden sicher bei Stripe gespeichert.
      </p>
    </div>
  );
}
