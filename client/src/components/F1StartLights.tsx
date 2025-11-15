import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🏎️ FORMEL-1-START-AMPEL-ANIMATION
 * 
 * Authentische F1-Start-Sequenz:
 * 1. 5 rote Lichter erscheinen nacheinander (0.5s delay)
 * 2. Alle Lichter gehen aus (GO!-Moment)
 * 3. Grünes Licht + "START!"-Text
 * 4. Geschwindigkeits-Effekte (Zoom, Motion-Blur, Shake)
 * 5. Content erscheint nach Animation
 */

interface F1StartLightsProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export function F1StartLights({ onComplete, autoStart = true }: F1StartLightsProps) {
  const [stage, setStage] = useState<"idle" | "red1" | "red2" | "red3" | "red4" | "red5" | "go" | "complete">("idle");
  const [showGreen, setShowGreen] = useState(false);

  useEffect(() => {
    if (!autoStart) return;

    // F1-Start-Sequenz
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("red1");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("red2");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("red3");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("red4");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("red5");
      
      // Zufällige Pause (wie echte F1: 1-3 Sekunden)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // GO! - Alle Lichter aus
      setStage("go");
      setShowGreen(true);
      
      // Grünes Licht verschwindet nach 1s
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowGreen(false);
      
      // Animation complete
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("complete");
      onComplete?.();
    };

    sequence();
  }, [autoStart, onComplete]);

  if (stage === "complete") {
    return null; // Animation fertig, Content wird angezeigt
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
      {/* F1-Ampel-Container */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: stage === "go" ? 1.2 : 1, 
          opacity: 1,
          y: stage === "go" ? [0, -20, 0] : 0 
        }}
        transition={{ 
          duration: 0.3,
          y: { duration: 0.2, repeat: stage === "go" ? 3 : 0 }
        }}
      >
        {/* Ampel-Hintergrund */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white/20 shadow-2xl">
          {/* 5 Rote Lichter */}
          <div className="flex gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((light) => {
              const isActive = 
                (stage === "red1" && light === 1) ||
                (stage === "red2" && light <= 2) ||
                (stage === "red3" && light <= 3) ||
                (stage === "red4" && light <= 4) ||
                (stage === "red5" && light <= 5);

              return (
                <motion.div
                  key={light}
                  className={`w-20 h-20 rounded-full border-4 ${
                    isActive
                      ? "bg-red-500 border-red-300 shadow-[0_0_40px_rgba(239,68,68,0.8)]"
                      : "bg-slate-800 border-slate-700"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isActive ? [1, 1.1, 1] : 1,
                    opacity: stage === "go" ? 0 : 1
                  }}
                  transition={{ 
                    scale: { duration: 0.3, repeat: isActive ? Infinity : 0, repeatDelay: 0.5 },
                    opacity: { duration: 0.1 }
                  }}
                />
              );
            })}
          </div>

          {/* Grünes Licht (GO!) */}
          <AnimatePresence>
            {showGreen && (
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: 1
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 rounded-full bg-green-500 border-4 border-green-300 shadow-[0_0_80px_rgba(34,197,94,1)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* "START!" Text */}
        <AnimatePresence>
          {showGreen && (
            <motion.div
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap"
              initial={{ scale: 0, opacity: 0, y: -50 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: 1,
                y: 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 
                className="text-9xl font-black uppercase"
                style={{
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  textShadow: "0 0 40px rgba(34, 197, 94, 1), 0 0 80px rgba(34, 197, 94, 0.8)",
                  background: "linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                START!
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Geschwindigkeits-Linien (Motion-Blur-Effekt) */}
        <AnimatePresence>
          {stage === "go" && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  style={{
                    height: "4px",
                    top: `${Math.random() * 100}%`,
                    left: "50%",
                  }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ 
                    x: [0, -1000],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: i * 0.02,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen-Glow-Effekt bei GO! */}
      <AnimatePresence>
        {stage === "go" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)"
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
