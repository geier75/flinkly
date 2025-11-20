import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, User, Mail, MapPin, LogOut, Edit2, Save, X, Zap, Download, Trash2, Shield, Clock, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ImpressumCard } from "@/components/ImpressumCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const COUNTRIES = [
  { code: "DE", name: "Deutschland" },
  { code: "AT", name: "Österreich" },
  { code: "CH", name: "Schweiz" },
];

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "",
    country: "DE",
    // Commercial seller fields (§ 5 TMG)
    isCommercial: user?.isCommercial || false,
    companyName: user?.companyName || "",
    companyAddress: user?.companyAddress || "",
    taxId: user?.taxId || "",
    tradeRegister: user?.tradeRegister || "",
  });

  // DSGVO: Data Export
  const exportDataMutation = trpc.user.exportData.useMutation({
    onSuccess: (data) => {
      // Download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flinkly-datenexport-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Datenexport erfolgreich!", {
        description: "Deine Daten wurden als JSON-Datei heruntergeladen.",
      });
    },
    onError: (error) => {
      toast.error("Datenexport fehlgeschlagen", {
        description: error.message,
      });
    },
  });

  // DSGVO: Account Deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success("Account-Löschung beantragt", {
        description: "Dein Account wird in 30 Tagen gelöscht. Du kannst die Löschung jederzeit widerrufen.",
      });
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      toast.error("Account-Löschung fehlgeschlagen", {
        description: error.message,
      });
    },
  });

  const cancelDeletionMutation = trpc.user.cancelAccountDeletion.useMutation({
    onSuccess: () => {
      toast.success("Account-Löschung widerrufen", {
        description: "Dein Account bleibt aktiv.",
      });
    },
    onError: (error) => {
      toast.error("Widerruf fehlgeschlagen", {
        description: error.message,
      });
    },
  });

  const { data: deletionStatus } = trpc.user.getAccountDeletionStatus.useQuery();

  const handleDataExport = () => {
    exportDataMutation.mutate({
      includeProfile: true,
      includeGigs: true,
      includeOrders: true,
      includeMessages: true,
      includeReviews: true,
      includeTransactions: true,
    });
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate({ reason: "User requested account deletion" });
  };

  const handleCancelDeletion = () => {
    cancelDeletionMutation.mutate();
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <motion.div
          className="container mx-auto px-4 py-20 text-center max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cyber-glass-card border-2 border-accent/40 p-8 shadow-[0_0_60px_oklch(0.70_0.20_35_/_0.6)]">
            <AlertCircle className="h-16 w-16 text-accent mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold cyber-chrome-text mb-3">Authentifizierung erforderlich</h1>
            <p className="text-slate-300 mb-8 text-lg font-medium">Du musst angemeldet sein, um dein Profil zu sehen.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="cyber-neon-button text-white font-bold px-10 py-4 text-lg"
            >
              Zur Startseite
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Update profile mutation
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profil erfolgreich aktualisiert!");
      setIsEditing(false);
      // Refresh page to show updated data
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Fehler beim Speichern", {
        description: error.message,
      });
    },
  });

  const handleSave = () => {
    // Validate commercial seller fields
    if (formData.isCommercial && (!formData.companyName || !formData.companyAddress)) {
      toast.error("Pflichtfelder fehlen", {
        description: "Gewerbliche Anbieter müssen Firmenname und Adresse angeben (§ 5 TMG).",
      });
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Cyberpunk Header */}
      <div className="relative z-10 cyber-neon-border bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-extrabold mb-3 tracking-tight cyber-chrome-text flex items-center gap-4">
              <User className="h-12 w-12 text-primary animate-pulse" />
              MEIN <span className="cyber-neon-green">PROFIL</span>
            </h1>
            <p className="text-slate-300 text-xl font-light tracking-wide">
              Verwalte deine <span className="cyber-neon-orange font-semibold">Profilinformationen</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Profile Card */}
          <Card className="cyber-glass-card border-2 border-primary/40 hover:shadow-[0_0_60px_oklch(0.70_0.25_150_/_0.6)] transition-all duration-500 mb-8">
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-extrabold cyber-chrome-text flex items-center gap-3">
                    <Zap className="h-8 w-8 text-primary" />
                    Profilinformationen
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-2 text-lg font-medium">Deine persönlichen Daten</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-2 border-accent/30 hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_30px_oklch(0.70_0.20_35_/_0.4)] text-accent font-semibold transition-all duration-300 hover:scale-105 px-6 py-3"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 md:p-8">
              {isEditing ? (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dein Name"
                      className="bg-slate-900/60 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-4 focus:ring-primary/30 transition-all duration-300 text-lg py-6 backdrop-blur-xl"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-accent" />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Erzähle uns etwas über dich..."
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-900/60 border-2 border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30 transition-all duration-300 text-lg backdrop-blur-xl resize-none"
                    />
                  </div>

                  {/* Land */}
                  <div>
                    <label className="block text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Land
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/60 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/30 transition-all duration-300 text-lg backdrop-blur-xl"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} className="bg-slate-900">
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Commercial Seller Section (§ 5 TMG) */}
                  <div className="border-t-2 border-cyan-400/30 pt-6 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="h-6 w-6 text-cyan-400" />
                      <h3 className="text-xl font-bold text-white">Gewerbliche Angaben</h3>
                    </div>
                    
                    {/* Gewerblich Checkbox */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-slate-900/60 rounded-lg border-2 border-slate-700">
                      <Checkbox
                        id="isCommercial"
                        name="isCommercial"
                        checked={formData.isCommercial}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCommercial: checked as boolean }))}
                        className="border-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
                      />
                      <Label htmlFor="isCommercial" className="text-lg text-slate-200 cursor-pointer">
                        Ich bin <strong className="text-cyan-400">gewerblicher Anbieter</strong> und unterliege der Impressumspflicht (§ 5 TMG)
                      </Label>
                    </div>

                    {/* Conditional Impressum Fields */}
                    {formData.isCommercial && (
                      <div className="space-y-6 p-6 bg-cyan-400/5 border-2 border-cyan-400/20 rounded-lg">
                        <p className="text-sm text-cyan-300 mb-4">
                          ⚠️ Als gewerblicher Anbieter musst du gemäß § 5 TMG folgende Angaben machen:
                        </p>
                        
                        {/* Firmenname */}
                        <div>
                          <label className="block text-lg font-bold text-slate-200 mb-3">
                            Firmenname <span className="text-red-400">*</span>
                          </label>
                          <Input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="z.B. MiMi Tech Ai UG (haftungsbeschränkt)"
                            className="bg-slate-900/60 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 text-lg py-6 backdrop-blur-xl"
                            required
                          />
                        </div>

                        {/* Vollständige Adresse */}
                        <div>
                          <label className="block text-lg font-bold text-slate-200 mb-3">
                            Vollständige Adresse <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            name="companyAddress"
                            value={formData.companyAddress}
                            onChange={handleChange}
                            placeholder="Straße Hausnummer\nPLZ Ort\nLand"
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-900/60 border-2 border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 text-lg backdrop-blur-xl resize-none"
                            required
                          />
                          <p className="text-xs text-slate-400 mt-2">
                            Beispiel: Lindenplatz 23, 75378 Bad Liebenzell, Deutschland
                          </p>
                        </div>

                        {/* USt-IdNr. */}
                        <div>
                          <label className="block text-lg font-bold text-slate-200 mb-3">
                            Umsatzsteuer-ID (optional)
                          </label>
                          <Input
                            type="text"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            placeholder="z.B. DE123456789"
                            className="bg-slate-900/60 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 text-lg py-6 backdrop-blur-xl"
                          />
                        </div>

                        {/* Handelsregister */}
                        <div>
                          <label className="block text-lg font-bold text-slate-200 mb-3">
                            Handelsregister (optional)
                          </label>
                          <Input
                            type="text"
                            name="tradeRegister"
                            value={formData.tradeRegister}
                            onChange={handleChange}
                            placeholder="z.B. HRB 12345 B (Amtsgericht Charlottenburg)"
                            className="bg-slate-900/60 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 text-lg py-6 backdrop-blur-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-2 border-slate-600 text-white hover:border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] font-semibold transition-all duration-300 hover:scale-105 text-lg py-6"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 cyber-neon-button text-white font-bold text-lg py-6"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Speichere...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Speichern
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <div className="space-y-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-6 bg-slate-900/60 rounded-xl border-2 border-primary/40 backdrop-blur-xl hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] transition-all duration-300"
                    >
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-slate-400 font-medium">Name</p>
                        <p className="text-white font-bold text-lg cyber-neon-green">{user.name || "Nicht angegeben"}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-6 bg-slate-900/60 rounded-xl border-2 border-accent/40 backdrop-blur-xl hover:shadow-[0_0_30px_oklch(0.70_0.20_35_/_0.4)] transition-all duration-300"
                    >
                      <Mail className="h-6 w-6 text-accent" />
                      <div>
                        <p className="text-sm text-slate-400 font-medium">E-Mail</p>
                        <p className="text-white font-bold text-lg cyber-neon-orange">{user.email || "Nicht angegeben"}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-6 bg-slate-900/60 rounded-xl border-2 border-primary/40 backdrop-blur-xl hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] transition-all duration-300"
                    >
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-slate-400 font-medium">Land</p>
                        <p className="text-white font-bold text-lg">{COUNTRIES.find(c => c.code === formData.country)?.name || "Deutschland"}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* ImpressumCard (nur für gewerbliche Seller) */}
                  {user.isCommercial && user.companyName && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-6"
                    >
                      <ImpressumCard
                        companyName={user.companyName}
                        companyAddress={user.companyAddress || ""}
                        email={user.email || undefined}
                        phone={user.phone || undefined}
                        taxId={user.taxId || undefined}
                        tradeRegister={user.tradeRegister || undefined}
                        ownerName={user.name || undefined}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* DSGVO: Data Export Card */}
          <Card className="cyber-glass-card border-2 border-primary/40 hover:shadow-[0_0_60px_oklch(0.70_0.25_150_/_0.6)] transition-all duration-500 mb-8">
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <CardTitle className="text-3xl font-extrabold cyber-chrome-text flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Datenschutz (DSGVO)
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 text-lg font-medium">Deine Rechte nach Art. 20 DSGVO</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Data Export */}
              <div className="p-6 bg-slate-900/60 rounded-xl border-2 border-primary/40 backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-4">
                  <Download className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Datenexport</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Lade alle deine gespeicherten Daten als JSON-Datei herunter. Dies umfasst dein Profil, Bestellungen, Nachrichten und mehr.
                    </p>
                    <Button
                      onClick={handleDataExport}
                      disabled={exportDataMutation.isPending}
                      className="cyber-neon-button text-white font-bold px-6 py-3"
                    >
                      {exportDataMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Exportiere...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Daten exportieren
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Deletion */}
              <div className="p-6 bg-slate-900/60 rounded-xl border-2 border-red-500/40 backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-4">
                  <Trash2 className="h-6 w-6 text-red-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Account löschen</h3>
                    {deletionStatus?.scheduledDeletionAt ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-red-400" />
                            <p className="text-red-400 font-bold">Account-Löschung geplant</p>
                          </div>
                          <p className="text-slate-300 text-sm">
                            Dein Account wird am <span className="font-bold">{new Date(deletionStatus.scheduledDeletionAt).toLocaleDateString("de-DE")}</span> gelöscht.
                          </p>
                        </div>
                        <Button
                          onClick={handleCancelDeletion}
                          disabled={cancelDeletionMutation.isPending}
                          variant="outline"
                          className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-primary font-bold"
                        >
                          {cancelDeletionMutation.isPending ? "Widerrufe..." : "Löschung widerrufen"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-400 text-sm mb-4">
                          Lösche deinen Account dauerhaft. Du hast 30 Tage Zeit, um die Löschung zu widerrufen.
                        </p>
                        {!showDeleteConfirm ? (
                          <Button
                            onClick={() => setShowDeleteConfirm(true)}
                            variant="outline"
                            className="border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 font-bold"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Account löschen
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <p className="text-red-400 font-bold mb-2">⚠️ Bist du sicher?</p>
                              <p className="text-slate-300 text-sm">
                                Diese Aktion kann nicht rückgängig gemacht werden. Dein Account wird in 30 Tagen dauerhaft gelöscht.
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                variant="outline"
                                className="flex-1 border-2 border-slate-600 text-white hover:border-slate-400"
                              >
                                Abbrechen
                              </Button>
                              <Button
                                onClick={handleDeleteAccount}
                                disabled={deleteAccountMutation.isPending}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                              >
                                {deleteAccountMutation.isPending ? "Lösche..." : "Jetzt löschen"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="cyber-glass-card border-2 border-red-500/40 hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] transition-all duration-500">
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <CardTitle className="text-3xl font-extrabold cyber-chrome-text flex items-center gap-3">
                <Zap className="h-8 w-8 text-red-500" />
                Kontoeinstellungen
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 text-lg font-medium">Verwalte deine Kontosicherheit</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] text-red-400 hover:text-red-300 font-bold transition-all duration-300 hover:scale-105 text-lg py-6"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Abmelden
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
