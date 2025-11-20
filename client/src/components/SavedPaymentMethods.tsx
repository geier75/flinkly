import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Trash2, Check, Plus } from "lucide-react";
import { toast } from "sonner";

interface SavedPaymentMethodsProps {
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  selectedPaymentMethodId: string | null;
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

  // Fetch saved payment methods
  const { data: paymentMethods, isLoading, refetch } = trpc.paymentMethods.list.useQuery();

  // Delete payment method mutation
  const deletePaymentMethodMutation = trpc.paymentMethods.delete.useMutation({
    onSuccess: () => {
      toast.success("Zahlungsmethode gelöscht");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Löschen");
    },
  });

  // Set default payment method mutation
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

      {/* New Card Form Placeholder */}
      {showNewCardForm && (
        <Card className="p-6 bg-slate-900/40 border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">Neue Karte hinzufügen</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCardForm(false)}
                className="text-slate-400"
              >
                Abbrechen
              </Button>
            </div>

            {/* Stripe Elements will be mounted here */}
            <div
              id="stripe-payment-element"
              className="p-4 bg-white rounded-lg"
            >
              {/* Placeholder - Stripe Elements will replace this */}
              <p className="text-sm text-slate-600">
                Stripe Payment Element wird hier geladen...
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="save-card"
                className="w-4 h-4 rounded border-slate-600"
              />
              <label htmlFor="save-card" className="text-sm text-slate-300">
                Diese Karte für zukünftige Zahlungen speichern
              </label>
            </div>
          </div>
        </Card>
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
