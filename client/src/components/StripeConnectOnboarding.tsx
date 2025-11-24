/**
 * Stripe Connect Onboarding Component
 * 
 * Allows sellers to connect their Stripe account to receive payouts
 * 
 * Flow:
 * 1. Check if seller has Stripe Connect account
 * 2. If not: Show "Connect Stripe" button
 * 3. Create Connect account → Redirect to Stripe onboarding
 * 4. After onboarding: Show account status
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function StripeConnectOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: status, isLoading: statusLoading, refetch } = trpc.payment.getConnectAccountStatus.useQuery();
  const createAccountMutation = trpc.payment.createConnectAccount.useMutation();
  const refreshLinkMutation = trpc.payment.refreshOnboardingLink.useMutation();

  const handleConnectStripe = async () => {
    setIsLoading(true);
    try {
      const result = await createAccountMutation.mutateAsync({ country: 'DE' });
      
      // Redirect to Stripe onboarding
      window.location.href = result.onboardingUrl;
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Erstellen des Stripe-Kontos');
      setIsLoading(false);
    }
  };

  const handleRefreshOnboarding = async () => {
    setIsLoading(true);
    try {
      const result = await refreshLinkMutation.mutateAsync();
      
      // Redirect to Stripe onboarding
      window.location.href = result.url;
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Aktualisieren des Onboarding-Links');
      setIsLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>Lade Status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No Stripe account yet
  if (!status?.hasAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auszahlungen aktivieren</CardTitle>
          <CardDescription>
            Verbinde dein Stripe-Konto, um Zahlungen von Käufern zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Wichtig:</strong> Du benötigst ein Stripe-Konto, um Geld von Käufern zu erhalten.
              Flinkly behält automatisch 15% Plattform-Gebühr ein, du erhältst 85%.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold">Was du benötigst:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
              <li>Personalausweis oder Reisepass</li>
              <li>Bankverbindung (IBAN)</li>
              <li>Adresse</li>
              <li>Geburtsdatum</li>
            </ul>
          </div>

          <Button 
            onClick={handleConnectStripe}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Wird erstellt...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Stripe-Konto verbinden
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Du wirst zu Stripe weitergeleitet, um die Verifizierung abzuschließen
          </p>
        </CardContent>
      </Card>
    );
  }

  // Has account but onboarding incomplete
  if (!status.onboardingComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifizierung ausstehend</CardTitle>
          <CardDescription>
            Schließe die Stripe-Verifizierung ab, um Zahlungen zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deine Stripe-Verifizierung ist noch nicht abgeschlossen.
              Bitte schließe den Onboarding-Prozess ab.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleRefreshOnboarding}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Wird geladen...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Verifizierung fortsetzen
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Account fully set up
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Connect</CardTitle>
        <CardDescription>
          Dein Auszahlungs-Konto ist aktiv
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-emerald-500/50 bg-emerald-500/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-900">
            <strong>Aktiv:</strong> Du kannst jetzt Zahlungen von Käufern erhalten.
            Flinkly behält automatisch 15% Plattform-Gebühr ein.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-500">Zahlungen empfangen</p>
            <p className="font-semibold flex items-center gap-1">
              {status.chargesEnabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Aktiviert
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Ausstehend
                </>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-500">Auszahlungen</p>
            <p className="font-semibold flex items-center gap-1">
              {status.payoutsEnabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Aktiviert
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Ausstehend
                </>
              )}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-slate-500">
            Account ID: <code className="bg-slate-100 px-1 rounded">{status.accountId}</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
