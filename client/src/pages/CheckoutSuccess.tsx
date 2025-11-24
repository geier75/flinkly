import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * CheckoutSuccess Page
 * 
 * Handles redirect from Stripe Checkout after successful payment
 * Creates order in database using session metadata
 * Redirects to order confirmation page
 */
export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const sessionId = searchParams.get("session_id");
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create order from Stripe session
  const createOrderFromSession = trpc.orders.createFromStripeSession.useMutation({
    onSuccess: (order: { success: boolean; orderId: number }) => {
      setStatus('success');
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        setLocation(`/order/confirmation/${order.orderId}`);
      }, 2000);
    },
    onError: (error: { message?: string }) => {
      setStatus('error');
      setErrorMessage(error.message || 'Fehler beim Erstellen der Bestellung');
    },
  });

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Keine Session-ID gefunden');
      return;
    }

    // Create order from Stripe session
    createOrderFromSession.mutate({ sessionId });
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full mx-4">
          <div className="p-8 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-green-600 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Zahlung wird verarbeitet...</h1>
            <p className="text-slate-600">
              Bitte warten Sie, während wir Ihre Bestellung erstellen.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full mx-4">
          <div className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold mb-2">Fehler</h1>
            <p className="text-slate-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setLocation('/marketplace')}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Zurück zum Marktplatz
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="max-w-md w-full mx-4">
        <div className="p-8 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h1 className="text-2xl font-bold mb-2">Zahlung erfolgreich!</h1>
          <p className="text-slate-600">
            Sie werden zur Bestellbestätigung weitergeleitet...
          </p>
        </div>
      </Card>
    </div>
  );
}
