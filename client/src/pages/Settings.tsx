import { useAuth } from "@/_core/hooks/useAuth";
import { PremiumCard } from "@/components/PremiumPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Trash2, ArrowLeft, Mail, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PaymentMethodsManager } from "@/components/PaymentMethodsManager";

export default function Settings() {
  const { user, isAuthenticated, refresh } = useAuth();
  const [, setLocation] = useLocation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profil erfolgreich aktualisiert!");
      refresh?.();
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Speichern");
    },
  });

  const handleSaveProfile = () => {
    const name = nameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    
    updateProfileMutation.mutate({
      ...(name && { name }),
      ...(email && { email }),
    });
  };

  const handleSaveSettings = () => {
    // TODO: Implement notification settings via tRPC
    toast.success("Einstellungen gespeichert!");
  };

  const handleDeleteAccount = () => {
    if (confirm("Möchtest du dein Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      // TODO: Implement via tRPC
      toast.success("Konto gelöscht.");
      setLocation("/");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <PremiumCard className="max-w-md">
          <CardHeader>
            <CardTitle>Anmeldung erforderlich</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Bitte melde dich an, um auf die Einstellungen zuzugreifen.
            </p>
            <Button onClick={() => setLocation("/")}>Zur Startseite</Button>
          </CardContent>
        </PremiumCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-2xl shadow-violet-500/30">
                <SettingsIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Einstellungen</h1>
                <p className="text-slate-400 mt-1">Verwalte deine Konto-Einstellungen</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Account Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-primary" />
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  Konto-Informationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Name</Label>
                  <Input id="name" defaultValue={user?.name || ""} className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">E-Mail</Label>
                  {user?.email ? (
                    <>
                      <Input id="email" type="email" defaultValue={user.email} disabled className="border-slate-200 bg-slate-50 rounded-xl" />
                      <p className="text-sm text-slate-500">
                        E-Mail-Adresse kann nicht geändert werden
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">E-Mail-Adresse fehlt</p>
                            <p className="text-sm text-amber-700 mt-1">
                              Für Stripe Connect und wichtige Benachrichtigungen benötigst du eine E-Mail-Adresse.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Input 
                        ref={emailInputRef}
                        id="email" 
                        type="email" 
                        placeholder="deine@email.de"
                        className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl" 
                      />
                      <p className="text-sm text-slate-500">
                        Bitte gib deine E-Mail-Adresse ein und speichere die Änderungen.
                      </p>
                    </>
                  )}
                </div>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {updateProfileMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Speichern...</>
                  ) : (
                    "Änderungen speichern"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  Benachrichtigungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="email-notifications" className="text-slate-800 font-medium">E-Mail-Benachrichtigungen</Label>
                      <p className="text-sm text-slate-500">Erhalte wichtige Updates per E-Mail</p>
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Bell className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <Label htmlFor="order-updates" className="text-slate-800 font-medium">Bestellungs-Updates</Label>
                      <p className="text-sm text-slate-500">Benachrichtigungen über Bestellstatus-Änderungen</p>
                    </div>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) => setSettings({ ...settings, orderUpdates: checked })}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-lg">
                      <Mail className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <Label htmlFor="marketing-emails" className="text-slate-800 font-medium">Marketing-E-Mails</Label>
                      <p className="text-sm text-slate-500">Erhalte Neuigkeiten und Angebote</p>
                    </div>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                    className="data-[state=checked]:bg-violet-500"
                  />
                </div>

                <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                  Einstellungen speichern
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  Sicherheit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Shield className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <Label htmlFor="two-factor" className="text-slate-800 font-medium">Zwei-Faktor-Authentifizierung</Label>
                      <p className="text-sm text-slate-500">Zusätzliche Sicherheit für dein Konto</p>
                    </div>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Lock className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <Label className="text-slate-800 font-medium">Passwort ändern</Label>
                      <p className="text-sm text-slate-500">Ändere dein Passwort regelmäßig für mehr Sicherheit</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 rounded-xl">
                    Passwort ändern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Methods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-xl">
                    <CreditCard className="h-5 w-5 text-cyan-600" />
                  </div>
                  Zahlungsmethoden
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <PaymentMethodsManager />
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-red-100/50 rounded-3xl border border-red-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500" />
              <CardHeader className="pb-4 border-b border-red-100">
                <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  Gefahrenbereich
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Konto löschen</h3>
                      <p className="text-sm text-slate-600">
                        Sobald du dein Konto löschst, gibt es kein Zurück mehr. Bitte sei dir sicher.
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600 rounded-xl">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Konto löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

