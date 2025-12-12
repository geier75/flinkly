// @ts-nocheck
/**
 * Datenexport-Seite (DSGVO Art. 20 - Recht auf Datenübertragbarkeit)
 */

import { useState } from "react";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { dataExportApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Download, FileJson, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MetaTags from "@/components/MetaTags";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function DataExport() {
  const { user, isAuthenticated } = useAuth();
  const [selectedData, setSelectedData] = useState({
    profile: true,
    gigs: true,
    orders: true,
    messages: true,
    reviews: true,
    transactions: true,
  });
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const exportDataMutation = useMutation({
    mutationFn: () => dataExportApi.request(),
    onSuccess: (data: any) => {
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flinkly-datenexport-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportSuccess(true);
      toast.success("Daten erfolgreich exportiert!");
    },
    onError: (error: any) => {
      setIsExporting(false);
      toast.error(`Fehler beim Export: ${error.message}`);
    },
  });

  const handleExport = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    exportDataMutation.mutate({
      includeProfile: selectedData.profile,
      includeGigs: selectedData.gigs,
      includeOrders: selectedData.orders,
      includeMessages: selectedData.messages,
      includeReviews: selectedData.reviews,
      includeTransactions: selectedData.transactions,
      format,
    });
  };

  if (!isAuthenticated) {
    return (
    <PremiumPageLayout>
        <PremiumCard className="max-w-md">
          <CardHeader>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>
              Sie müssen angemeldet sein, um Ihre Daten zu exportieren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
              Jetzt anmelden
            </Button>
          </CardContent>
        </PremiumCard>
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout>
      <MetaTags
        title="Datenexport - Flinkly"
        description="Exportieren Sie Ihre personenbezogenen Daten gemäß DSGVO Art. 20."
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Datenexport
          </h1>
          <p className="text-slate-300">
            Exportieren Sie Ihre personenbezogenen Daten gemäß Art. 20 DSGVO (Recht auf Datenübertragbarkeit).
          </p>
        </div>

        {/* Info Card */}
        <PremiumCard className="mb-8 bg-emerald-900/30 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-emerald-500" />
              Was wird exportiert?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">
              Der Export enthält alle Daten, die Sie uns zur Verfügung gestellt haben oder die im Rahmen
              der Nutzung unserer Dienste erhoben wurden. Die Daten werden in einem maschinenlesbaren
              Format (JSON oder CSV) bereitgestellt.
            </p>
          </CardContent>
        </PremiumCard>

        {/* Data Selection */}
        <PremiumCard className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Wählen Sie die zu exportierenden Daten</CardTitle>
            <CardDescription className="text-slate-400">
              Sie können auswählen, welche Datenkategorien exportiert werden sollen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="profile"
                checked={selectedData.profile}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, profile: checked as boolean })
                }
              />
              <label
                htmlFor="profile"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Profildaten (Name, E-Mail, Bio, Avatar)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="gigs"
                checked={selectedData.gigs}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, gigs: checked as boolean })
                }
              />
              <label
                htmlFor="gigs"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Gigs (Titel, Beschreibung, Preis, Bilder)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="orders"
                checked={selectedData.orders}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, orders: checked as boolean })
                }
              />
              <label
                htmlFor="orders"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Bestellungen (Käufe und Verkäufe)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="messages"
                checked={selectedData.messages}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, messages: checked as boolean })
                }
              />
              <label
                htmlFor="messages"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Nachrichten (Konversationen mit anderen Nutzern)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="reviews"
                checked={selectedData.reviews}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, reviews: checked as boolean })
                }
              />
              <label
                htmlFor="reviews"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Bewertungen (Abgegebene und erhaltene Reviews)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="transactions"
                checked={selectedData.transactions}
                onCheckedChange={(checked) =>
                  setSelectedData({ ...selectedData, transactions: checked as boolean })
                }
              />
              <label
                htmlFor="transactions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
              >
                Transaktionen (Zahlungshistorie, Auszahlungen)
              </label>
            </div>
          </CardContent>
        </PremiumCard>

        {/* Format Selection */}
        <PremiumCard className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Exportformat</CardTitle>
            <CardDescription className="text-slate-400">
              Wählen Sie das Format, in dem Ihre Daten exportiert werden sollen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="json"
                checked={format === "json"}
                onCheckedChange={() => setFormat("json")}
              />
              <label
                htmlFor="json"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 text-white"
              >
                <FileJson className="h-4 w-4 text-emerald-500" />
                JSON (empfohlen für technische Nutzer)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="csv"
                checked={format === "csv"}
                onCheckedChange={() => setFormat("csv")}
              />
              <label
                htmlFor="csv"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 text-white"
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                CSV (für Excel/Spreadsheets)
              </label>
            </div>
          </CardContent>
        </PremiumCard>

        {/* Export Button */}
        <PremiumCard className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 p-6 md:p-8">
            {exportSuccess ? (
              <div className="flex items-center justify-center gap-3 text-emerald-400 mb-4">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-semibold">Export erfolgreich!</span>
              </div>
            ) : null}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Exportiere Daten...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Daten jetzt exportieren
                </>
              )}
            </Button>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Der Export kann je nach Datenmenge einige Sekunden dauern.
              Die Datei wird automatisch heruntergeladen.
            </p>
          </CardContent>
        </PremiumCard>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-400">
            <strong className="text-white">Rechtlicher Hinweis:</strong> Dieser Export erfolgt gemäß Art. 20 DSGVO (Recht auf Datenübertragbarkeit).
            Die exportierten Daten enthalten alle personenbezogenen Daten, die Sie uns zur Verfügung gestellt haben.
            Bitte beachten Sie, dass der Export keine Daten Dritter (z.B. Nachrichten anderer Nutzer) enthält.
          </p>
        </div>
      </div>
    </PremiumPageLayout>
  );
}
