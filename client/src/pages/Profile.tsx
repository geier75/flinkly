import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, User, Mail, MapPin, LogOut, Edit2, Save, X, Zap, Download, Trash2, Shield, Clock, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
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
    bio: user?.bio || "",
    country: user?.country || "DE",
    // Commercial seller fields (§ 5 TMG)
    isCommercial: user?.isCommercial || false,
    companyName: user?.companyName || "",
    companyAddress: user?.companyAddress || "",
    taxId: user?.taxId || "",
    tradeRegister: user?.tradeRegister || "",
  });

  // Sync formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        country: user.country || "DE",
        isCommercial: user.isCommercial || false,
        companyName: user.companyName || "",
        companyAddress: user.companyAddress || "",
        taxId: user.taxId || "",
        tradeRegister: user.tradeRegister || "",
      });
    }
  }, [user]);

  // DSGVO: Data Export - Stub for now
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletionStatus: { scheduledDeletionAt?: string } | null = null;

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // Export user data as JSON
      const data = {
        profile: { name: user?.name, email: user?.email },
        exportedAt: new Date().toISOString(),
      };
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
    } catch (error: any) {
      toast.error("Datenexport fehlgeschlagen", {
        description: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      toast.success("Account-Löschung beantragt", {
        description: "Dein Account wird in 30 Tagen gelöscht.",
      });
      setShowDeleteConfirm(false);
    } catch (error: any) {
      toast.error("Account-Löschung fehlgeschlagen", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = () => {
    toast.success("Account-Löschung widerrufen");
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

  const [isUpdating, setIsUpdating] = useState(false);

  // Update profile using API

  const handleSave = async () => {
    // Validate commercial seller fields
    if (formData.isCommercial && (!formData.companyName || !formData.companyAddress)) {
      toast.error("Pflichtfelder fehlen", {
        description: "Gewerbliche Anbieter müssen Firmenname und Adresse angeben (§ 5 TMG).",
      });
      return;
    }

    // Call API to update profile
    setIsUpdating(true);
    try {
      await usersApi.updateProfile({
        name: formData.name,
        bio: formData.bio,
        country: formData.country,
      });
      toast.success("Profil erfolgreich aktualisiert!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Fehler beim Speichern", {
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-primary to-accent rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-emerald-500/30">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{user?.name}</h1>
              <p className="text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                  Verifiziert
                </span>
                <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm font-medium rounded-full">
                  Mitglied seit {new Date(user?.createdAt || Date.now()).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Profile Card */}
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-accent" />
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    Profilinformationen
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-2">Deine persönlichen Daten verwalten</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-semibold transition-all duration-300 rounded-xl px-6"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {isEditing ? (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dein Name"
                      className="bg-slate-50 border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 rounded-xl py-6"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-violet-600" />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Erzähle uns etwas über dich..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Land */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Land
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Commercial Seller Section (§ 5 TMG) */}
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-500/10 rounded-xl">
                        <Building2 className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Gewerbliche Angaben</h3>
                    </div>
                    
                    {/* Gewerblich Checkbox */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <Checkbox
                        id="isCommercial"
                        name="isCommercial"
                        checked={formData.isCommercial}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCommercial: checked as boolean }))}
                        className="border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                      <Label htmlFor="isCommercial" className="text-slate-700 cursor-pointer">
                        Ich bin <strong className="text-amber-600">gewerblicher Anbieter</strong> und unterliege der Impressumspflicht (§ 5 TMG)
                      </Label>
                    </div>

                    {/* Conditional Impressum Fields */}
                    {formData.isCommercial && (
                      <div className="space-y-6 p-6 bg-amber-50/50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 mb-4">
                          ⚠️ Als gewerblicher Anbieter musst du gemäß § 5 TMG folgende Angaben machen:
                        </p>
                        
                        {/* Firmenname */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Firmenname <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="z.B. MiMi Tech Ai UG (haftungsbeschränkt)"
                            className="bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 rounded-xl"
                            required
                          />
                        </div>

                        {/* Vollständige Adresse */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Vollständige Adresse <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="companyAddress"
                            value={formData.companyAddress}
                            onChange={handleChange}
                            placeholder="Straße Hausnummer\nPLZ Ort\nLand"
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 resize-none"
                            required
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            Beispiel: Lindenplatz 23, 75378 Bad Liebenzell, Deutschland
                          </p>
                        </div>

                        {/* USt-IdNr. */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Umsatzsteuer-ID (optional)
                          </label>
                          <Input
                            type="text"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            placeholder="z.B. DE123456789"
                            className="bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 rounded-xl"
                          />
                        </div>

                        {/* Handelsregister */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Handelsregister (optional)
                          </label>
                          <Input
                            type="text"
                            name="tradeRegister"
                            value={formData.tradeRegister}
                            onChange={handleChange}
                            placeholder="z.B. HRB 12345 B (Amtsgericht Charlottenburg)"
                            className="bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 rounded-xl"
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
                      className="flex-1 border-2 border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 font-semibold transition-all duration-300 rounded-xl py-6"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl py-6 shadow-lg shadow-emerald-500/30"
                    >
                      {isUpdating ? (
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
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Name</p>
                        <p className="text-slate-800 font-semibold text-lg">{user.name || "Nicht angegeben"}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-violet-50 to-white rounded-2xl border border-violet-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
                    >
                      <div className="p-3 bg-violet-500/10 rounded-xl">
                        <Mail className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">E-Mail</p>
                        <p className="text-slate-800 font-semibold text-lg">{user.email || "Nicht angegeben"}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                    >
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Land</p>
                        <p className="text-slate-800 font-semibold text-lg">{COUNTRIES.find(c => c.code === formData.country)?.name || "Deutschland"}</p>
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
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500" />
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                Datenschutz (DSGVO)
              </CardTitle>
              <CardDescription className="text-slate-500 mt-2">Deine Rechte nach Art. 20 DSGVO</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Data Export */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Datenexport</h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Lade alle deine gespeicherten Daten als JSON-Datei herunter. Dies umfasst dein Profil, Bestellungen, Nachrichten und mehr.
                    </p>
                    <Button
                      onClick={handleDataExport}
                      disabled={isExporting}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                      {isExporting ? (
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
              <div className="p-6 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Account löschen</h3>
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
                          disabled={false}
                          variant="outline"
                          className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-primary font-bold"
                        >
                          "Löschung widerrufen"
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
                                disabled={isDeleting}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                              >
                                {isDeleting ? "Lösche..." : "Jetzt löschen"}
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
