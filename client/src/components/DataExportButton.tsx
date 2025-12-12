// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { dataExportApi } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Data Export Button (DSGVO Art. 20)
 * 
 * Allows users to download all their personal data in JSON format
 * as required by GDPR Article 20 (Right to Data Portability).
 */

export function DataExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("Datenexport wird vorbereitet...");

      // Request export
      const result = await dataExportApi.request();

      if (!result.success) {
        throw new Error("Export failed");
      }

      // Create JSON file
      const jsonString = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Download file
      const link = document.createElement("a");
      link.href = url;
      link.download = `flinkly-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Datenexport erfolgreich! Datei wurde heruntergeladen.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Datenexport fehlgeschlagen. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
      className="border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exportiere Daten...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Meine Daten exportieren (DSGVO Art. 20)
        </>
      )}
    </Button>
  );
}
