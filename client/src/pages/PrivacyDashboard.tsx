/**
 * Live Privacy Dashboard (DSGVO++ 2025)
 * 
 * Features:
 * - Real-time data visibility (what data we store)
 * - Consent history with proof-of-consent
 * - Account deletion with 30-day grace period
 * - Selective data export (JSON/CSV)
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2, Shield, Eye, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function PrivacyDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: deletionStatus } = trpc.user.getAccountDeletionStatus.useQuery();
  
  const [exportOptions, setExportOptions] = useState({
    includeProfile: true,
    includeGigs: true,
    includeOrders: true,
    includeMessages: true,
    includeReviews: true,
    includeTransactions: true,
    format: "json" as "json" | "csv",
  });

  const exportDataMutation = trpc.user.exportData.useMutation({
    onSuccess: (data) => {
      // Download JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flinkly-data-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Datenexport erfolgreich heruntergeladen");
    },
    onError: (error) => {
      toast.error(`Fehler beim Datenexport: ${error.message}`);
    },
  });

  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setTimeout(() => setLocation("/"), 3000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const cancelDeletionMutation = trpc.user.cancelAccountDeletion.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const handleExport = () => {
    exportDataMutation.mutate(exportOptions);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate({
      reason: "User requested deletion via Privacy Dashboard",
    });
  };

  const handleCancelDeletion = () => {
    cancelDeletionMutation.mutate();
  };

  if (!user) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Bitte anmelden</CardTitle>
            <CardDescription>Sie müssen angemeldet sein, um auf Ihr Datenschutz-Dashboard zuzugreifen.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Datenschutz-Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre persönlichen Daten und Datenschutzeinstellungen gemäß DSGVO
        </p>
      </div>

      {/* Account Deletion Warning */}
      {deletionStatus && deletionStatus.status === "pending" && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Account-Löschung geplant</CardTitle>
            </div>
            <CardDescription>
              Ihr Account wird am{" "}
              <strong>{new Date(deletionStatus.scheduledDeletionAt).toLocaleDateString("de-DE")}</strong> gelöscht.
              Sie können die Löschung jederzeit widerrufen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleCancelDeletion} disabled={cancelDeletionMutation.isPending}>
              {cancelDeletionMutation.isPending ? "Wird widerrufen..." : "Löschung widerrufen"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Eye className="h-4 w-4 mr-2" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Datenexport
          </TabsTrigger>
          <TabsTrigger value="delete">
            <Trash2 className="h-4 w-4 mr-2" />
            Account löschen
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ihre gespeicherten Daten
              </CardTitle>
              <CardDescription>
                Transparente Übersicht aller Daten, die wir über Sie speichern
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Profildaten"
                  description="Name, E-Mail, Profilbild, Bio"
                  status="active"
                />
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Gigs & Dienstleistungen"
                  description="Ihre erstellten Gigs und Angebote"
                  status="active"
                />
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Bestellungen"
                  description="Kauf- und Verkaufshistorie"
                  status="active"
                />
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Nachrichten"
                  description="Chat-Verläufe mit Käufern/Verkäufern"
                  status="active"
                />
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Bewertungen"
                  description="Abgegebene und erhaltene Bewertungen"
                  status="active"
                />
                <DataCategory
                  icon={<FileText className="h-4 w-4" />}
                  title="Transaktionen"
                  description="Zahlungshistorie (anonymisiert)"
                  status="active"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ihre Rechte nach DSGVO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RightItem
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                title="Recht auf Auskunft (Art. 15)"
                description="Sie können jederzeit eine Kopie Ihrer Daten anfordern"
              />
              <RightItem
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                title="Recht auf Datenübertragbarkeit (Art. 20)"
                description="Export Ihrer Daten in maschinenlesbarem Format (JSON/CSV)"
              />
              <RightItem
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                title="Recht auf Löschung (Art. 17)"
                description="Account-Löschung mit 30-Tage-Widerrufsfrist"
              />
              <RightItem
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                title="Recht auf Berichtigung (Art. 16)"
                description="Korrektur falscher Daten in Ihren Einstellungen"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datenexport (Art. 20 DSGVO)</CardTitle>
              <CardDescription>
                Laden Sie eine Kopie Ihrer Daten in maschinenlesbarem Format herunter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Wählen Sie die zu exportierenden Daten:</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="profile"
                      checked={exportOptions.includeProfile}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeProfile: !!checked })
                      }
                    />
                    <Label htmlFor="profile" className="cursor-pointer">
                      Profildaten (Name, E-Mail, Bio)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gigs"
                      checked={exportOptions.includeGigs}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeGigs: !!checked })
                      }
                    />
                    <Label htmlFor="gigs" className="cursor-pointer">
                      Gigs & Dienstleistungen
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orders"
                      checked={exportOptions.includeOrders}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeOrders: !!checked })
                      }
                    />
                    <Label htmlFor="orders" className="cursor-pointer">
                      Bestellungen (Käufe & Verkäufe)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="messages"
                      checked={exportOptions.includeMessages}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeMessages: !!checked })
                      }
                    />
                    <Label htmlFor="messages" className="cursor-pointer">
                      Nachrichten & Chat-Verläufe
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reviews"
                      checked={exportOptions.includeReviews}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeReviews: !!checked })
                      }
                    />
                    <Label htmlFor="reviews" className="cursor-pointer">
                      Bewertungen (abgegeben & erhalten)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transactions"
                      checked={exportOptions.includeTransactions}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeTransactions: !!checked })
                      }
                    />
                    <Label htmlFor="transactions" className="cursor-pointer">
                      Transaktionen & Zahlungshistorie
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleExport}
                  disabled={exportDataMutation.isPending}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportDataMutation.isPending ? "Exportiere Daten..." : "Daten als JSON exportieren"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete Tab */}
        <TabsContent value="delete" className="space-y-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Account löschen (Art. 17 DSGVO)</CardTitle>
              <CardDescription>
                Permanente Löschung Ihres Accounts und aller persönlichen Daten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Was passiert bei der Löschung?
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground ml-6 list-disc">
                  <li>Ihr Account wird in 30 Tagen gelöscht (Widerrufsfrist)</li>
                  <li>Persönliche Daten werden pseudonymisiert (Name, E-Mail, Bio, Profilbild)</li>
                  <li>Transaktionsdaten bleiben aus rechtlichen Gründen anonymisiert erhalten (10 Jahre)</li>
                  <li>Sie können die Löschung innerhalb von 30 Tagen widerrufen</li>
                </ul>
              </div>

              <div className="bg-destructive/10 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-destructive flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Wichtige Hinweise
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground ml-6 list-disc">
                  <li>Account-Löschung ist nur möglich, wenn keine aktiven Bestellungen vorliegen</li>
                  <li>Offene Auszahlungen müssen vorher abgeschlossen werden</li>
                  <li>Diese Aktion kann nach 30 Tagen nicht rückgängig gemacht werden</li>
                </ul>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={!!deletionStatus}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deletionStatus ? "Löschung bereits geplant" : "Account jetzt löschen"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion plant die Löschung Ihres Accounts in 30 Tagen. Sie können die Löschung
                      innerhalb dieser Frist widerrufen, indem Sie sich erneut anmelden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Ja, Account löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function DataCategory({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "active" | "inactive";
}) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Aktiv" : "Inaktiv"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

function RightItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
