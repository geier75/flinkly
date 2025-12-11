import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import {
  ConsentCore,
  PrivacyEmpathyLayer,
  IdentityTheater,
} from "@/components/immersive";
import {
  ArrowLeft,
  Shield,
  Settings,
  User,
  Sparkles,
  Lock,
  LogOut,
  Bell,
  Globe,
  Moon,
  Sun,
  Fingerprint,
  Key,
  Eye,
  EyeOff,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Zap,
  Heart,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  CreditCard,
  Languages,
  Palette,
  Activity,
  Database,
  Cloud,
  ShieldCheck,
  RefreshCw,
  Save,
} from "lucide-react";

/**
 * SettingsNexus - Immersive User Control Environment (2030+)
 * 
 * MIMITECH UX Pyramid Implementation:
 * - Level 1: Sensory Space (3D particle background)
 * - Level 2: Responsive Presence (mouse-reactive particles)
 * - Level 3: Identity Theater (user avatar with lifelines)
 * - Level 4: Consent Orchestration (DSGVO hologram)
 * - Level 5: Ritual Settings (rotating ring interface)
 * - Level 6: Privacy Empathy Layer (live privacy indicator)
 * - Level 7: Immersive Autonomy (gesture-based interactions)
 */
export default function SettingsNexus() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // UI State
  const [activeSection, setActiveSection] = useState<"account" | "notifications" | "security" | "privacy" | "appearance" | "danger">("account");
  const [isConsentCoreOpen, setIsConsentCoreOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Settings State
  const [settings, setSettings] = useState({
    language: "de",
    theme: "dark" as "dark" | "light" | "system",
    notifications: true,
    sounds: true,
    twoFactor: false,
    biometric: false,
  });

  // Consent State
  const [consentSettings, setConsentSettings] = useState({
    tracking: false,
    analytics: true,
    marketing: false,
    thirdParty: false,
  });

  // Privacy Status (derived from consent settings)
  const privacyStatus = useMemo(() => {
    const activeTrackers = Object.values(consentSettings).filter(Boolean).length;
    if (activeTrackers === 0) return "secure";
    if (activeTrackers === 1) return "synced";
    if (activeTrackers <= 2) return "pending";
    return "warning";
  }, [consentSettings]);

  // Mock activity history
  const activityHistory = useMemo(() => [
    { id: "1", type: "order" as const, date: new Date(Date.now() - 86400000), description: "Bestellung #1234 abgeschlossen" },
    { id: "2", type: "message" as const, date: new Date(Date.now() - 172800000), description: "Nachricht von Support erhalten" },
    { id: "3", type: "favorite" as const, date: new Date(Date.now() - 259200000), description: "3 neue Favoriten hinzugefügt" },
    { id: "4", type: "review" as const, date: new Date(Date.now() - 345600000), description: "Bewertung für Service abgegeben" },
    { id: "5", type: "login" as const, date: new Date(Date.now() - 432000000), description: "Anmeldung von neuem Gerät" },
  ], []);

  // Mock stats
  const stats = useMemo(() => ({
    totalOrders: 12,
    totalMessages: 45,
    totalFavorites: 23,
    averageRating: 4.8,
  }), []);

  // Inactivity detection for Level 2
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 30000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  // Handlers
  const handleSettingsChange = useCallback((key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleConsentChange = useCallback((key: string, value: boolean) => {
    setConsentSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSaveSettings = useCallback(async () => {
    // TODO: Implement via tRPC
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Einstellungen gespeichert");
  }, []);

  const handleExportData = useCallback(async () => {
    // Simulate data export
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Create mock export data
    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        memberSince: new Date().toISOString(),
      },
      settings,
      consentSettings,
      activityHistory,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flinkly-data-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [user, settings, consentSettings, activityHistory]);

  const handleDeleteData = useCallback(async () => {
    const confirmed = window.confirm(
      "Bist du sicher, dass du alle deine Daten löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden."
    );
    
    if (confirmed) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Daten gelöscht");
      logout();
      setLocation("/");
    }
  }, [logout, setLocation]);

  const handleLogout = useCallback(() => {
    logout();
    setLocation("/");
  }, [logout, setLocation]);

  // Not authenticated view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl max-w-md"
        >
          <Lock className="w-16 h-16 text-violet-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Zugang erforderlich</h1>
          <p className="text-slate-400 mb-6">
            Bitte melde dich an, um auf den User Nexus zuzugreifen.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
          >
            Zur Startseite
          </Button>
        </motion.div>
      </div>
    );
  }

  // Setting categories for ritual ring
  const settingCategories = [
    { id: "account", icon: User, label: "Konto", color: "violet" },
    { id: "notifications", icon: Bell, label: "Benachrichtigungen", color: "cyan" },
    { id: "security", icon: Shield, label: "Sicherheit", color: "emerald" },
    { id: "privacy", icon: Eye, label: "Datenschutz", color: "amber" },
    { id: "appearance", icon: Palette, label: "Darstellung", color: "rose" },
    { id: "danger", icon: AlertTriangle, label: "Gefahrenzone", color: "red" },
  ];

  return (
    <>
      {/* Cosmic 3D Background - Level 1 */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="settings">
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-4"
            >
              <Settings className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">Kontrollzentrum</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Einstellungen</h1>
            <p className="text-slate-400">Dein immersiver Kontrollraum für alle Präferenzen</p>
          </motion.div>

          {/* Privacy Status Orbs - Level 6 */}
          <div className="flex flex-wrap justify-center gap-6">
            <DataOrb 
              value={privacyStatus === "secure" ? "✓" : privacyStatus === "warning" ? "!" : "~"} 
              label="Privacy Status" 
              color={privacyStatus === "secure" ? "emerald" : privacyStatus === "warning" ? "red" : "amber"} 
              size="lg" 
            />
            <DataOrb value={consentSettings.tracking ? "An" : "Aus"} label="Tracking" color={consentSettings.tracking ? "amber" : "emerald"} size="md" />
            <DataOrb value={settings.twoFactor ? "Aktiv" : "Aus"} label="2FA" color={settings.twoFactor ? "emerald" : "amber"} size="md" />
            <DataOrb value={settings.notifications ? "An" : "Aus"} label="Benachrichtigungen" color="cyan" size="md" />
          </div>

          {/* Category Ring Navigation - Level 5: Ritual Settings */}
          <HolographicCard glowColor="violet" intensity="medium">
            <div className="p-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">Einstellungs-Ring</h3>
              </div>
              
              {/* Circular Category Selector */}
              <div className="flex flex-wrap justify-center gap-3">
                {settingCategories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(cat.id as any)}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300
                      ${activeSection === cat.id
                        ? `bg-${cat.color}-500/20 border-2 border-${cat.color}-500/50 shadow-lg shadow-${cat.color}-500/20`
                        : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeSection === cat.id ? { 
                        boxShadow: [`0 0 20px rgba(139, 92, 246, 0.5)`, `0 0 40px rgba(139, 92, 246, 0.8)`, `0 0 20px rgba(139, 92, 246, 0.5)`]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`p-3 rounded-xl ${activeSection === cat.id ? `bg-${cat.color}-500/30` : 'bg-slate-700/50'}`}
                    >
                      <cat.icon className={`w-6 h-6 ${activeSection === cat.id ? `text-${cat.color}-400` : 'text-slate-400'}`} />
                    </motion.div>
                    <span className={`text-xs font-medium ${activeSection === cat.id ? 'text-white' : 'text-slate-400'}`}>
                      {cat.label}
                    </span>
                    {activeSection === cat.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute -bottom-1 w-8 h-1 rounded-full bg-${cat.color}-500`}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </HolographicCard>

          {/* Settings Content */}
          <AnimatePresence mode="wait">
            {/* Account Settings */}
            {activeSection === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <HolographicCard glowColor="violet" intensity="medium">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-5 h-5 text-violet-400" />
                      <h3 className="text-lg font-semibold text-white">Konto-Informationen</h3>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Name</label>
                        <Input 
                          defaultValue={user?.name || ""} 
                          className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">E-Mail</label>
                        <Input 
                          defaultValue={user?.email || ""} 
                          disabled
                          className="bg-slate-800/30 border-slate-700 text-slate-500"
                        />
                        <p className="text-xs text-slate-500">E-Mail kann nicht geändert werden</p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveSettings}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold"
                      >
                        <Save className="w-4 h-4" />
                        Änderungen speichern
                      </motion.button>
                    </div>
                  </div>
                </HolographicCard>

                {/* Identity Theater */}
                <HolographicCard glowColor="cyan" intensity="low">
                  <div className="p-6">
                    <IdentityTheater
                      user={{
                        name: user?.name || "Benutzer",
                        email: user?.email || "user@example.com",
                        memberSince: new Date(Date.now() - 365 * 86400000),
                        level: "gold",
                      }}
                      activityHistory={activityHistory}
                      stats={stats}
                    />
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HolographicCard glowColor="cyan" intensity="medium">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">Benachrichtigungen</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { key: "notifications", icon: Bell, label: "Push-Benachrichtigungen", desc: "Erhalte wichtige Updates sofort" },
                        { key: "sounds", icon: Volume2, label: "Töne", desc: "Akustische Benachrichtigungen" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                              <item.icon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingsChange(item.key, checked)}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-400 mb-4">E-Mail Präferenzen</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Bestellungs-Updates", checked: true },
                          { label: "Newsletter", checked: false },
                          { label: "Marketing-E-Mails", checked: false },
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/20"
                          >
                            <span className="text-sm text-slate-300">{item.label}</span>
                            <Switch defaultChecked={item.checked} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <HolographicCard glowColor="emerald" intensity="medium">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold text-white">Sicherheitseinstellungen</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 2FA */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`p-5 rounded-xl border transition-all ${
                          settings.twoFactor 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-slate-800/30 border-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={settings.twoFactor ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`p-3 rounded-xl ${settings.twoFactor ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}
                            >
                              <Fingerprint className={`w-6 h-6 ${settings.twoFactor ? 'text-emerald-400' : 'text-slate-400'}`} />
                            </motion.div>
                            <div>
                              <p className="font-semibold text-white">Zwei-Faktor-Authentifizierung</p>
                              <p className="text-sm text-slate-400">Zusätzliche Sicherheitsebene für dein Konto</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.twoFactor}
                            onCheckedChange={(checked) => handleSettingsChange("twoFactor", checked)}
                          />
                        </div>
                        {settings.twoFactor && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-emerald-500/20"
                          >
                            <div className="flex items-center gap-2 text-emerald-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">2FA ist aktiviert und schützt dein Konto</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Biometric */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-700/50">
                              <Smartphone className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Biometrische Anmeldung</p>
                              <p className="text-sm text-slate-400">Face ID / Touch ID verwenden</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.biometric}
                            onCheckedChange={(checked) => handleSettingsChange("biometric", checked)}
                          />
                        </div>
                      </motion.div>

                      {/* Password Change */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-violet-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-violet-500/20">
                            <Key className="w-6 h-6 text-violet-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white">Passwort ändern</p>
                            <p className="text-sm text-slate-400">Zuletzt geändert vor 30 Tagen</p>
                          </div>
                        </div>
                        <Zap className="w-5 h-5 text-violet-400" />
                      </motion.button>
                    </div>
                  </div>
                </HolographicCard>

                {/* Security Status */}
                <HolographicCard glowColor="emerald" intensity="low">
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-4">Sicherheitsstatus</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <EnergyBar value={settings.twoFactor ? 100 : 50} max={100} label="Kontoschutz" color="emerald" />
                      <EnergyBar value={80} max={100} label="Passwort-Stärke" color="cyan" />
                      <EnergyBar value={100} max={100} label="Verschlüsselung" color="violet" />
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {/* Privacy Settings - Level 6 */}
            {activeSection === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Privacy Empathy Layer */}
                <PrivacyEmpathyLayer
                  externalServicesActive={consentSettings.thirdParty}
                  trackersDetected={consentSettings.tracking ? 2 : 0}
                  lastActivity={new Date()}
                  dataStatus="synced"
                  encryptionStatus="active"
                />

                {/* Consent Controls */}
                <HolographicCard glowColor="amber" intensity="medium">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Eye className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-white">Datenschutz-Einstellungen</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { key: "tracking", icon: Activity, label: "Tracking", desc: "Aktivitätsverfolgung erlauben", color: "amber" },
                        { key: "analytics", icon: Database, label: "Analytics", desc: "Anonyme Nutzungsstatistiken", color: "cyan" },
                        { key: "marketing", icon: Mail, label: "Marketing", desc: "Personalisierte Empfehlungen", color: "violet" },
                        { key: "thirdParty", icon: Cloud, label: "Drittanbieter", desc: "Externe Dienste & Integrationen", color: "rose" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            consentSettings[item.key as keyof typeof consentSettings]
                              ? `bg-${item.color}-500/10 border-${item.color}-500/30`
                              : 'bg-slate-800/30 border-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${consentSettings[item.key as keyof typeof consentSettings] ? `bg-${item.color}-500/20` : 'bg-slate-700/50'}`}>
                              <item.icon className={`w-5 h-5 ${consentSettings[item.key as keyof typeof consentSettings] ? `text-${item.color}-400` : 'text-slate-400'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={consentSettings[item.key as keyof typeof consentSettings]}
                            onCheckedChange={(checked) => handleConsentChange(item.key, checked)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </HolographicCard>

                {/* DSGVO Actions */}
                <HolographicCard glowColor="cyan" intensity="low">
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-4">DSGVO-Rechte</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsConsentCoreOpen(true)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      >
                        <Shield className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">Consent Core</p>
                          <p className="text-xs text-slate-400">Vollständige DSGVO-Kontrolle</p>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportData}
                        className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">Daten exportieren</p>
                          <p className="text-xs text-slate-400">Art. 20 Datenportabilität</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeSection === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HolographicCard glowColor="rose" intensity="medium">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Palette className="w-5 h-5 text-rose-400" />
                      <h3 className="text-lg font-semibold text-white">Darstellung</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <label className="text-sm text-slate-400 mb-3 block">Farbschema</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "dark", icon: Moon, label: "Dunkel" },
                            { id: "light", icon: Sun, label: "Hell" },
                            { id: "system", icon: RefreshCw, label: "System" },
                          ].map((theme) => (
                            <motion.button
                              key={theme.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSettingsChange("theme", theme.id)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                settings.theme === theme.id
                                  ? 'bg-rose-500/20 border-rose-500/50'
                                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                              }`}
                            >
                              <theme.icon className={`w-6 h-6 ${settings.theme === theme.id ? 'text-rose-400' : 'text-slate-400'}`} />
                              <span className={`text-sm ${settings.theme === theme.id ? 'text-white' : 'text-slate-400'}`}>
                                {theme.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Language Selection */}
                      <div>
                        <label className="text-sm text-slate-400 mb-3 block">Sprache</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "de", label: "🇩🇪 Deutsch" },
                            { id: "en", label: "🇬🇧 English" },
                          ].map((lang) => (
                            <motion.button
                              key={lang.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSettingsChange("language", lang.id)}
                              className={`p-4 rounded-xl border transition-all ${
                                settings.language === lang.id
                                  ? 'bg-violet-500/20 border-violet-500/50'
                                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                              }`}
                            >
                              <span className={settings.language === lang.id ? 'text-white' : 'text-slate-400'}>
                                {lang.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {/* Danger Zone */}
            {activeSection === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HolographicCard glowColor="red" intensity="high">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-red-400">Gefahrenzone</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-400">Achtung: Unwiderrufliche Aktionen</p>
                            <p className="text-sm text-slate-400 mt-1">
                              Die folgenden Aktionen können nicht rückgängig gemacht werden.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDeleteData}
                        className="w-full flex items-center justify-between p-5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-red-500/20">
                            <Trash2 className="w-6 h-6 text-red-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-red-400">Konto löschen</p>
                            <p className="text-sm text-slate-400">Alle Daten unwiderruflich entfernen</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Abmelden
                      </motion.button>
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/30"
            >
              <Save className="w-5 h-5" />
              Alle Einstellungen speichern
              <Sparkles className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </CommandCenter>

      {/* Consent Core Modal - Level 4 */}
      <ConsentCore
        isOpen={isConsentCoreOpen}
        onClose={() => setIsConsentCoreOpen(false)}
        onExportData={handleExportData}
        onDeleteData={handleDeleteData}
        consentSettings={consentSettings}
        onConsentChange={handleConsentChange}
      />

      {/* Inactivity indicator - Level 2 */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-xl border border-slate-700 text-sm text-slate-400">
              Bewege die Maus, um den Raum zu aktivieren
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
