import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Lock, 
  Bell, 
  Palette, 
  CreditCard, 
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Fingerprint,
  Smartphone,
  Mail,
  Languages,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RitualSettingsProps {
  settings: {
    language: string;
    theme: "dark" | "light" | "system";
    notifications: boolean;
    sounds: boolean;
    twoFactor: boolean;
    biometric: boolean;
  };
  onSettingsChange: (key: string, value: any) => void;
  onSave: () => Promise<void>;
}

/**
 * RitualSettings - Level 5: Ritual Settings
 * 
 * Settings open as a rotating ring layer with symbols
 * Each symbol has animated states (selected = glowing)
 */
export function RitualSettings({
  settings,
  onSettingsChange,
  onSave,
}: RitualSettingsProps) {
  const [activeRing, setActiveRing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const rings = [
    {
      id: "language",
      icon: Globe,
      label: "Sprache",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "security",
      icon: Lock,
      label: "Sicherheit",
      color: "violet",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Benachrichtigungen",
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: "appearance",
      icon: Palette,
      label: "Erscheinung",
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "payment",
      icon: CreditCard,
      label: "Zahlung",
      color: "emerald",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      id: "profile",
      icon: User,
      label: "Profil",
      color: "blue",
      gradient: "from-blue-500 to-indigo-500",
    },
  ];

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast.success("Einstellungen gesichert", {
        description: "Deine Präferenzen wurden aktualisiert.",
      });
    } catch (error) {
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  const languages = [
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  return (
    <div className="relative">
      {/* Rotating Ring Container */}
      <div className="relative flex justify-center items-center py-8">
        <div className="relative w-80 h-80">
          {/* Outer ring decoration */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-slate-700/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-slate-600/30"
          />

          {/* Ring items */}
          {rings.map((ring, index) => {
            const angle = (index / rings.length) * 360 - 90;
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isActive = activeRing === ring.id;

            return (
              <motion.button
                key={ring.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: x + 140 - 28,
                  y: y + 140 - 28,
                }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveRing(isActive ? null : ring.id)}
                className={`
                  absolute w-14 h-14 rounded-full flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? `bg-gradient-to-br ${ring.gradient} shadow-lg shadow-${ring.color}-500/50` 
                    : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <ring.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                
                {/* Glow effect when active */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${ring.gradient}`}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                boxShadow: activeRing 
                  ? "0 0 40px rgba(139, 92, 246, 0.5)" 
                  : "0 0 20px rgba(139, 92, 246, 0.2)"
              }}
              className="w-20 h-20 rounded-full bg-slate-900 border border-violet-500/30 flex items-center justify-center"
            >
              {activeRing ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <p className="text-xs text-violet-400 font-medium">
                    {rings.find(r => r.id === activeRing)?.label}
                  </p>
                </motion.div>
              ) : (
                <Languages className="w-8 h-8 text-violet-400" />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence mode="wait">
        {activeRing && (
          <motion.div
            key={activeRing}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-xl"
          >
            {activeRing === "language" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Spracheinstellungen
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSettingsChange("language", lang.code)}
                      className={`
                        p-4 rounded-xl border transition-all duration-300 flex items-center gap-3
                        ${settings.language === lang.code
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }
                      `}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {settings.language === lang.code && (
                        <Check className="w-4 h-4 text-cyan-400 ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {activeRing === "security" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-violet-400" />
                  Sicherheitseinstellungen
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="font-medium text-white">Zwei-Faktor-Authentifizierung</p>
                        <p className="text-sm text-slate-400">Zusätzliche Sicherheit per SMS/App</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.twoFactor}
                      onCheckedChange={(checked) => onSettingsChange("twoFactor", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="font-medium text-white">Biometrische Anmeldung</p>
                        <p className="text-sm text-slate-400">Face ID / Touch ID verwenden</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.biometric}
                      onCheckedChange={(checked) => onSettingsChange("biometric", checked)}
                    />
                  </div>

                  <Button variant="outline" className="w-full border-violet-500/50 text-violet-400 hover:bg-violet-500/10">
                    <Lock className="w-4 h-4 mr-2" />
                    Passwort ändern
                  </Button>
                </div>
              </div>
            )}

            {activeRing === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  Benachrichtigungen
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-medium text-white">E-Mail-Benachrichtigungen</p>
                        <p className="text-sm text-slate-400">Updates zu Bestellungen & Nachrichten</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => onSettingsChange("notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      {settings.sounds ? (
                        <Volume2 className="w-5 h-5 text-amber-400" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-slate-500" />
                      )}
                      <div>
                        <p className="font-medium text-white">Sound-Effekte</p>
                        <p className="text-sm text-slate-400">Akustisches Feedback</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.sounds}
                      onCheckedChange={(checked) => onSettingsChange("sounds", checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeRing === "appearance" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Erscheinungsbild
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "dark", icon: Moon, label: "Dunkel" },
                    { id: "light", icon: Sun, label: "Hell" },
                    { id: "system", icon: Palette, label: "System" },
                  ].map((theme) => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSettingsChange("theme", theme.id)}
                      className={`
                        p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2
                        ${settings.theme === theme.id
                          ? 'border-pink-500 bg-pink-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }
                      `}
                    >
                      <theme.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {activeRing === "payment" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Zahlungsmethoden
                </h3>
                
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-center">
                  <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">Keine Zahlungsmethode hinterlegt</p>
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Zahlungsmethode hinzufügen
                  </Button>
                </div>
              </div>
            )}

            {activeRing === "profile" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Profil bearbeiten
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Dein Name"
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">E-Mail</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="deine@email.de"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      disabled
                    />
                    <p className="text-xs text-slate-500">E-Mail kann nicht geändert werden</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 pt-4 border-t border-slate-700"
            >
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Einstellungen sichern
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
