import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Euro,
  Calendar
} from "lucide-react";
import { formatPrice, formatDate } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function EarningsDashboard() {
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const { data: earnings, isLoading: earningsLoading } = trpc.payout.getEarnings.useQuery();
  const { data: payouts, isLoading: payoutsLoading } = trpc.payout.getPayouts.useQuery();

  const requestPayoutMutation = trpc.payout.requestPayout.useMutation({
    onSuccess: () => {
      toast.success("Auszahlung erfolgreich beantragt!");
      setIsRequestingPayout(false);
    },
    onError: (error) => {
      toast.error(error.message || "Fehler bei der Auszahlung");
      setIsRequestingPayout(false);
    },
  });

  const handleRequestPayout = () => {
    if (!earnings || earnings.available < 2000) {
      toast.error("Mindestbetrag für Auszahlung: 20€");
      return;
    }

    setIsRequestingPayout(true);
    requestPayoutMutation.mutate({
      amount: earnings.available,
    });
  };

  if (earningsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalEarnings = earnings?.total || 0;
  const availableBalance = earnings?.available || 0;
  const pendingBalance = earnings?.pending || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Ausgezahlt</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Fehlgeschlagen</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Earnings */}
        <Card className="earnings-card">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <TrendingUp className="h-4 w-4" />
              Gesamt-Einnahmen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="earnings-value">{formatPrice(totalEarnings)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Alle abgeschlossenen Aufträge
            </p>
          </CardContent>
        </Card>

        {/* Available Balance */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <Wallet className="h-4 w-4" />
              Verfügbar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {formatPrice(availableBalance)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Bereit zur Auszahlung
            </p>
          </CardContent>
        </Card>

        {/* Pending Balance */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <Clock className="h-4 w-4" />
              In Bearbeitung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {formatPrice(pendingBalance)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Auszahlungen in Bearbeitung
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Request Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Auszahlung beantragen
          </CardTitle>
          <CardDescription>
            Mindestbetrag: 20€ | Auszahlung per SEPA-Überweisung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verfügbarer Betrag:</span>
              <span className="text-2xl font-bold">{formatPrice(availableBalance)}</span>
            </div>
            {availableBalance < 2000 && (
              <div className="flex items-start gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>
                  Noch {formatPrice(2000 - availableBalance)} bis zur Mindestauszahlung
                </span>
              </div>
            )}
          </div>

          <Button
            onClick={handleRequestPayout}
            disabled={availableBalance < 2000 || isRequestingPayout}
            className="w-full"
            size="lg"
          >
            {isRequestingPayout ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Wird beantragt...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Auszahlung beantragen
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Bearbeitungszeit: 2-5 Werktage</p>
            <p>✓ Gebührenfrei ab 20€</p>
            <p>✓ Direkt auf Ihr Bankkonto</p>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Auszahlungs-Historie
          </CardTitle>
          <CardDescription>
            Alle bisherigen Auszahlungen im Überblick
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payoutsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : payouts && payouts.length > 0 ? (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      payout.status === 'paid' 
                        ? 'bg-green-100' 
                        : payout.status === 'processing'
                        ? 'bg-blue-100'
                        : 'bg-yellow-100'
                    }`}>
                      {payout.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {formatPrice(payout.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payout.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(payout.status || 'pending')}
                    {payout.status === 'paid' && payout.paidAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(payout.paidAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Noch keine Auszahlungen</p>
              <p className="text-sm mt-1">
                Ihre erste Auszahlung erscheint hier
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Wichtige Hinweise zur Auszahlung:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Auszahlungen erfolgen nur per SEPA-Überweisung</li>
                <li>• Mindestbetrag: 20€ (2000 Cent)</li>
                <li>• Bearbeitungszeit: 2-5 Werktage</li>
                <li>• Plattformgebühr wird automatisch abgezogen</li>
                <li>• Steuerpflichtige Einnahmen müssen selbst versteuert werden</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
