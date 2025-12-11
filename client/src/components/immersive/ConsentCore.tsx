import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Lock, 
  Unlock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ConsentCoreProps {
  isOpen: boolean;
  onClose: () => void;
  onExportData: () => Promise<void>;
  onDeleteData: () => Promise<void>;
  consentSettings: {
    tracking: boolean;
    analytics: boolean;
    marketing: boolean;
    thirdParty: boolean;
  };
  onConsentChange: (key: string, value: boolean) => void;
}

/**
 * ConsentCore - Level 4: Consent Orchestration
 * 
 * DSGVO settings as an animated hologram with sections:
 * - Tracking
 * - Export
 * - Deletion
 * - Transparency
 * 
 * Clicking "Export Data" starts a ritual visualization
 */
export function ConsentCore({
  isOpen,
  onClose,
  onExportData,
  onDeleteData,
  consentSettings,
  onConsentChange,
}: ConsentCoreProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate ritual progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    try {
      await onExportData();
      toast.success("Datenkerne erfolgreich geborgen", {
        description: "Deine Daten wurden sicher exportiert.",
      });
    } catch (error) {
      toast.error("Export fehlgeschlagen");
    } finally {
      clearInterval(progressInterval);
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [onExportData]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDeleteData();
      toast.success("Daten erfolgreich gelöscht", {
        description: "Alle deine persönlichen Daten wurden entfernt.",
      });
    } catch (error) {
      toast.error("Löschung fehlgeschlagen");
    } finally {
      setIsDeleting(false);
    }
  }, [onDeleteData]);

  const sections = [
    {
      id: "tracking",
      icon: Eye,
      label: "Tracking",
      description: "Kontrolliere, wie deine Aktivitäten verfolgt werden",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "export",
      icon: Download,
      label: "Export",
      description: "Lade alle deine Daten herunter (DSGVO Art. 20)",
      color: "from-emerald-500 to-green-500",
    },
    {
      id: "deletion",
      icon: Trash2,
      label: "Löschung",
      description: "Lösche deine Daten unwiderruflich (DSGVO Art. 17)",
      color: "from-red-500 to-orange-500",
    },
    {
      id: "transparency",
      icon: Shield,
      label: "Transparenz",
      description: "Erfahre, wie deine Daten verwendet werden",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Holographic frame */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            
            <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 p-0.5"
                    >
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-cyan-400" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Consent Core</h2>
                      <p className="text-cyan-400/80 text-sm">DSGVO-Kontrollzentrum</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Section Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className={`
                      relative p-4 rounded-2xl border transition-all duration-300
                      ${activeSection === section.id 
                        ? `border-transparent bg-gradient-to-br ${section.color} text-white shadow-lg shadow-${section.color.split('-')[1]}-500/30`
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                      }
                    `}
                  >
                    <section.icon className="w-8 h-8 mb-3 mx-auto" />
                    <p className="font-medium text-sm">{section.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* Active Section Content */}
              <AnimatePresence mode="wait">
                {activeSection && (
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-cyan-500/20"
                  >
                    <div className="p-6">
                      {activeSection === "tracking" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Tracking-Einstellungen</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div>
                                <p className="font-medium text-white">Analytics</p>
                                <p className="text-sm text-slate-400">Anonyme Nutzungsstatistiken</p>
                              </div>
                              <Switch
                                checked={consentSettings.analytics}
                                onCheckedChange={(checked) => onConsentChange("analytics", checked)}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div>
                                <p className="font-medium text-white">Marketing</p>
                                <p className="text-sm text-slate-400">Personalisierte Empfehlungen</p>
                              </div>
                              <Switch
                                checked={consentSettings.marketing}
                                onCheckedChange={(checked) => onConsentChange("marketing", checked)}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div>
                                <p className="font-medium text-white">Drittanbieter</p>
                                <p className="text-sm text-slate-400">Externe Dienste & Integrationen</p>
                              </div>
                              <Switch
                                checked={consentSettings.thirdParty}
                                onCheckedChange={(checked) => onConsentChange("thirdParty", checked)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === "export" && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-white">Datenexport</h3>
                          <p className="text-slate-400">
                            Gemäß DSGVO Art. 20 hast du das Recht, alle deine Daten in einem maschinenlesbaren Format zu erhalten.
                          </p>

                          {isExporting ? (
                            <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-emerald-500/30 overflow-hidden">
                              {/* Export ritual visualization */}
                              <div className="absolute inset-0 overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                                    initial={{ 
                                      x: Math.random() * 100 + "%", 
                                      y: "100%",
                                      opacity: 0 
                                    }}
                                    animate={{ 
                                      y: "0%",
                                      opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.1,
                                    }}
                                  />
                                ))}
                              </div>

                              <div className="relative text-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="w-16 h-16 mx-auto mb-4"
                                >
                                  <Download className="w-full h-full text-emerald-400" />
                                </motion.div>
                                <p className="text-emerald-400 font-medium mb-2">
                                  Datenkerne werden geborgen...
                                </p>
                                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                                    style={{ width: `${exportProgress}%` }}
                                  />
                                </div>
                                <p className="text-sm text-slate-500 mt-2">{exportProgress}%</p>
                              </div>
                            </div>
                          ) : (
                            <Button
                              onClick={handleExport}
                              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-6 text-lg"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Datenexport starten
                            </Button>
                          )}
                        </div>
                      )}

                      {activeSection === "deletion" && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-white">Datenlöschung</h3>
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                              <div>
                                <p className="text-red-400 font-medium">Achtung: Unwiderrufliche Aktion</p>
                                <p className="text-sm text-slate-400 mt-1">
                                  Gemäß DSGVO Art. 17 hast du das Recht auf Löschung. Diese Aktion kann nicht rückgängig gemacht werden.
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            variant="destructive"
                            className="w-full py-6 text-lg"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Lösche Daten...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-5 h-5 mr-2" />
                                Alle Daten löschen
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {activeSection === "transparency" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Transparenzbericht</h3>
                          
                          <div className="grid gap-4">
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <p className="font-medium text-white">Datenspeicherung</p>
                              </div>
                              <p className="text-sm text-slate-400">
                                Deine Daten werden verschlüsselt in der EU gespeichert (DSGVO-konform).
                              </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-cyan-400" />
                                <p className="font-medium text-white">Verschlüsselung</p>
                              </div>
                              <p className="text-sm text-slate-400">
                                AES-256 Verschlüsselung für alle sensiblen Daten.
                              </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                              <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-violet-400" />
                                <p className="font-medium text-white">Keine Weitergabe</p>
                              </div>
                              <p className="text-sm text-slate-400">
                                Deine Daten werden niemals an Dritte verkauft.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
