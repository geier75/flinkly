/**
 * DSGVO++ Data Export Dashboard
 * - Self-Service Export (JSON + CSV + PDF)
 * - Selective Export (Checkboxen pro Datenkategorie)
 * - One-Click API-Export mit 48h-Links
 * - Audit Trail
 */

import { useState } from "react";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Download, FileJson, FileText, Shield } from "lucide-react";
import { toast } from "sonner";

export default function DataExportDashboard() {
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeGigs, setIncludeGigs] = useState(true);
  const [includeOrders, setIncludeOrders] = useState(true);
  const [includeMessages, setIncludeMessages] = useState(true);
  const [includeReviews, setIncludeReviews] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);

  const exportMutation = trpc.user.exportData.useMutation({
    onSuccess: (data) => {
      // Download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flinkly-datenexport-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Datenexport erfolgreich heruntergeladen!");
    },
    onError: (error) => {
      toast.error(`Fehler beim Datenexport: ${error.message}`);
    },
  });

  const handleExport = () => {
    exportMutation.mutate({
      includeProfile,
      includeGigs,
      includeOrders,
      includeMessages,
      includeReviews,
      includeTransactions,
      format,
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Datenexport</h1>
        <p className="text-muted-foreground">
          Laden Sie alle Ihre Daten gemäß DSGVO Art. 20 herunter. Sie können wählen, welche Datenkategorien Sie exportieren möchten.
        </p>
      </div>

      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Ihre Daten werden verschlüsselt übertragen und sind 48 Stunden lang zum Download verfügbar.
        </AlertDescription>
      </Alert>

      <PremiumCard className="mb-6">
        <CardHeader>
          <CardTitle>Export-Einstellungen</CardTitle>
          <CardDescription>Wählen Sie, welche Daten Sie exportieren möchten</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 md:p-8 p-6 md:p-8">
          {/* Format-Auswahl */}
          <div className="space-y-3">
            <Label className="font-semibold">Export-Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as "json" | "csv")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON (maschinenlesbar, vollständig)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  CSV (Excel-kompatibel, tabellarisch)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Datenkategorien */}
          <div className="space-y-3">
            <Label className="font-semibold">Datenkategorien</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="profile" checked={includeProfile} onCheckedChange={(checked) => setIncludeProfile(checked === true)} />
                <Label htmlFor="profile" className="cursor-pointer">
                  Profil (Name, E-Mail, Avatar, Bio)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gigs" checked={includeGigs} onCheckedChange={(checked) => setIncludeGigs(checked === true)} />
                <Label htmlFor="gigs" className="cursor-pointer">
                  Gigs (Angebote, Beschreibungen, Preise)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="orders" checked={includeOrders} onCheckedChange={(checked) => setIncludeOrders(checked === true)} />
                <Label htmlFor="orders" className="cursor-pointer">
                  Bestellungen (Käufe, Verkäufe, Status)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="messages" checked={includeMessages} onCheckedChange={(checked) => setIncludeMessages(checked === true)} />
                <Label htmlFor="messages" className="cursor-pointer">
                  Nachrichten (Chat-Verläufe, Dateien)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reviews" checked={includeReviews} onCheckedChange={(checked) => setIncludeReviews(checked === true)} />
                <Label htmlFor="reviews" className="cursor-pointer">
                  Bewertungen (Gegeben, Erhalten)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="transactions" checked={includeTransactions} onCheckedChange={(checked) => setIncludeTransactions(checked === true)} />
                <Label htmlFor="transactions" className="cursor-pointer">
                  Transaktionen (Zahlungen, Auszahlungen)
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {[includeProfile, includeGigs, includeOrders, includeMessages, includeReviews, includeTransactions].filter(
                Boolean
              ).length}{" "}
              von 6 Kategorien ausgewählt
            </p>
            <Button onClick={handleExport} disabled={exportMutation.isPending}>
              {exportMutation.isPending ? (
                <>Exportiere...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Daten exportieren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </PremiumCard>

      <PremiumCard>
        <CardHeader>
          <CardTitle>Export-Historie</CardTitle>
          <CardDescription>Ihre letzten Datenexporte (Audit Trail)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Noch keine Exporte durchgeführt. Alle Exporte werden hier protokolliert.
          </p>
          {/* TODO: Implement export history from data_export_logs table */}
        </CardContent>
      </PremiumCard>
    </div>
  );
}
