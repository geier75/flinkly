import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Activity,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface PrivacyEmpathyLayerProps {
  externalServicesActive: boolean;
  trackersDetected: number;
  lastActivity: Date | null;
  dataStatus: "synced" | "pending" | "error";
  encryptionStatus: "active" | "inactive";
}

/**
 * PrivacyEmpathyLayer - Level 6: Privacy Empathy Layer
 * 
 * Live indicator showing privacy status:
 * - "No external services active" with calming pulse
 * - If trackers present: layer vibrates, color shifts to red
 * - User understands intuitively through visual feedback
 */
export function PrivacyEmpathyLayer({
  externalServicesActive,
  trackersDetected,
  lastActivity,
  dataStatus,
  encryptionStatus,
}: PrivacyEmpathyLayerProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate overall privacy score
  const privacyScore = useMemo(() => {
    let score = 100;
    if (externalServicesActive) score -= 20;
    if (trackersDetected > 0) score -= trackersDetected * 15;
    if (dataStatus === "error") score -= 10;
    if (encryptionStatus === "inactive") score -= 30;
    return Math.max(0, score);
  }, [externalServicesActive, trackersDetected, dataStatus, encryptionStatus]);

  // Determine status color and message
  const status = useMemo(() => {
    if (privacyScore >= 90) {
      return {
        color: "emerald",
        gradient: "from-emerald-500 to-green-500",
        bgGradient: "from-emerald-500/10 to-green-500/10",
        borderColor: "border-emerald-500/30",
        icon: ShieldCheck,
        message: "Maximaler Datenschutz aktiv",
        description: "Keine externen Dienste aktiv",
        pulse: "animate-pulse-slow",
      };
    } else if (privacyScore >= 70) {
      return {
        color: "cyan",
        gradient: "from-cyan-500 to-blue-500",
        bgGradient: "from-cyan-500/10 to-blue-500/10",
        borderColor: "border-cyan-500/30",
        icon: Shield,
        message: "Datenschutz aktiv",
        description: "Einige Dienste aktiv",
        pulse: "",
      };
    } else if (privacyScore >= 50) {
      return {
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-500/10 to-orange-500/10",
        borderColor: "border-amber-500/30",
        icon: ShieldAlert,
        message: "Eingeschränkter Datenschutz",
        description: "Überprüfe deine Einstellungen",
        pulse: "",
      };
    } else {
      return {
        color: "red",
        gradient: "from-red-500 to-rose-500",
        bgGradient: "from-red-500/10 to-rose-500/10",
        borderColor: "border-red-500/30",
        icon: AlertTriangle,
        message: "Datenschutz gefährdet",
        description: "Sofortige Aktion empfohlen",
        pulse: "animate-shake",
      };
    }
  }, [privacyScore]);

  // Heartbeat effect for secure status
  useEffect(() => {
    if (privacyScore >= 90) {
      const interval = setInterval(() => {
        setPulseIntensity((prev) => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [privacyScore]);

  const StatusIcon = status.icon;

  // Format last activity
  const formatLastActivity = (date: Date | null) => {
    if (!date) return "Keine Aktivität";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Gerade eben";
    if (minutes < 60) return `Vor ${minutes} Minuten`;
    if (hours < 24) return `Vor ${hours} Stunden`;
    if (days < 30) return `Vor ${days} Tagen`;
    return `Vor ${Math.floor(days / 30)} Monaten`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Main Status Card */}
      <motion.div
        animate={privacyScore < 50 ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.5, repeat: privacyScore < 50 ? Infinity : 0, repeatDelay: 2 }}
        onClick={() => setShowDetails(!showDetails)}
        className={`
          relative p-6 rounded-2xl cursor-pointer
          bg-gradient-to-br ${status.bgGradient}
          border ${status.borderColor}
          backdrop-blur-xl
          transition-all duration-500
          hover:scale-[1.02]
        `}
      >
        {/* Animated background pulse for secure status */}
        {privacyScore >= 90 && (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${status.gradient}`}
          />
        )}

        <div className="relative flex items-center gap-4">
          {/* Status Icon with pulse */}
          <div className="relative">
            <motion.div
              animate={privacyScore >= 90 ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                bg-gradient-to-br ${status.gradient}
                shadow-lg shadow-${status.color}-500/30
              `}
            >
              <StatusIcon className="w-8 h-8 text-white" />
            </motion.div>

            {/* Heartbeat ring */}
            {privacyScore >= 90 && (
              <motion.div
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className={`absolute inset-0 rounded-full border-2 border-${status.color}-500`}
              />
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {status.message}
            </h3>
            <p className={`text-sm text-${status.color}-400/80`}>
              {status.description}
            </p>
          </div>

          {/* Privacy Score */}
          <div className="text-right">
            <motion.div
              key={privacyScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-bold bg-gradient-to-r ${status.gradient} bg-clip-text text-transparent`}
            >
              {privacyScore}%
            </motion.div>
            <p className="text-xs text-slate-400">Datenschutz-Score</p>
          </div>
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: showDetails ? 180 : 0 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
        >
          <div className="w-8 h-1 rounded-full bg-slate-600" />
        </motion.div>
      </motion.div>

      {/* Detailed Status Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* External Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`
                  p-4 rounded-xl border backdrop-blur-xl
                  ${externalServicesActive 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-emerald-500/10 border-emerald-500/30'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {externalServicesActive ? (
                    <Wifi className="w-5 h-5 text-amber-400" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-sm font-medium text-white">Externe Dienste</span>
                </div>
                <p className={`text-xs ${externalServicesActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {externalServicesActive ? 'Aktiv' : 'Inaktiv'}
                </p>
              </motion.div>

              {/* Trackers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`
                  p-4 rounded-xl border backdrop-blur-xl
                  ${trackersDetected > 0 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-emerald-500/10 border-emerald-500/30'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {trackersDetected > 0 ? (
                    <Eye className="w-5 h-5 text-red-400" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-sm font-medium text-white">Tracker</span>
                </div>
                <p className={`text-xs ${trackersDetected > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {trackersDetected > 0 ? `${trackersDetected} erkannt` : 'Keine erkannt'}
                </p>
              </motion.div>

              {/* Data Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`
                  p-4 rounded-xl border backdrop-blur-xl
                  ${dataStatus === 'synced' 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : dataStatus === 'pending'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {dataStatus === 'synced' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : dataStatus === 'pending' ? (
                    <Activity className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-white">Datenstatus</span>
                </div>
                <p className={`text-xs ${
                  dataStatus === 'synced' ? 'text-emerald-400' 
                  : dataStatus === 'pending' ? 'text-amber-400' 
                  : 'text-red-400'
                }`}>
                  {dataStatus === 'synced' ? 'Synchronisiert' 
                   : dataStatus === 'pending' ? 'Ausstehend' 
                   : 'Fehler'}
                </p>
              </motion.div>

              {/* Encryption */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`
                  p-4 rounded-xl border backdrop-blur-xl
                  ${encryptionStatus === 'active' 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {encryptionStatus === 'active' ? (
                    <Lock className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Unlock className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-white">Verschlüsselung</span>
                </div>
                <p className={`text-xs ${encryptionStatus === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {encryptionStatus === 'active' ? 'AES-256 aktiv' : 'Inaktiv'}
                </p>
              </motion.div>
            </div>

            {/* Last Activity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Info className="w-4 h-4" />
                <span className="text-sm">
                  Letzte Aktivität: {formatLastActivity(lastActivity)}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
