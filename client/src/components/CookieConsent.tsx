import { useState, useEffect } from "react";
import CookieConsentBanner from "react-cookie-consent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Cookie, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * DSGVO/TDDDG-konformes Cookie-Consent-Banner
 * 
 * Implementiert nach GDPR/ePrivacy/TDDDG-Richtlinien 2024:
 * - Opt-in (keine Pre-Checked Boxes) - Art. 7 DSGVO
 * - Granulare Auswahl (Essential, Functional, Analytics, Marketing) - § 25 TDDDG
 * - Klare Sprache (keine Dark Patterns) - Art. 25 DSA
 * - Gleichwertige Buttons (Accept/Reject gleich prominent)
 * - Widerrufsmöglichkeit jederzeit - Art. 7 Abs. 3 DSGVO
 * - Keine Kopplung von Diensten an Cookie-Einwilligung
 * 
 * Cookies-Kategorien:
 * - Essential: Session, Auth, CSRF (immer aktiv, keine Zustimmung nötig gem. § 25 Abs. 2 TDDDG)
 * - Functional: Spracheinstellungen, Präferenzen (opt-in)
 * - Analytics: PostHog, Sentry (opt-in)
 * - Marketing: Keine (aktuell nicht verwendet)
 * 
 * Rechtsgrundlagen:
 * - Essential: § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich)
 * - Functional/Analytics/Marketing: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
 */

interface CookiePreferences {
  essential: boolean; // Always true - technisch erforderlich
  functional: boolean; // Spracheinstellungen, UI-Präferenzen
  analytics: boolean; // PostHog, Sentry
  marketing: boolean; // Aktuell nicht verwendet
}

export default function CookieConsent() {
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem("flinkly_cookie_preferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cookie preferences", e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("flinkly_cookie_preferences", JSON.stringify(prefs));
    setPreferences(prefs);
    
    // Initialize analytics if accepted
    if (prefs.analytics && window.posthog) {
      window.posthog.opt_in_capturing();
    } else if (window.posthog) {
      window.posthog.opt_out_capturing();
    }
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  return (
    <>
      <CookieConsentBanner
        location="bottom"
        buttonText="Alle akzeptieren"
        declineButtonText="Alle ablehnen"
        enableDeclineButton
        cookieName="flinkly_cookie_consent"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "20px",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
        }}
        buttonStyle={{
          background: "#2563eb",
          color: "#ffffff",
          fontSize: "14px",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: "600",
          border: "2px solid #2563eb",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          // DSA Art. 25: Gleichwertige Buttons - keine Dark Patterns
          // Ablehnen-Button ist gleich prominent wie Akzeptieren-Button
          background: "#dc2626",
          color: "#ffffff",
          fontSize: "14px",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: "600",
          border: "2px solid #dc2626",
          cursor: "pointer",
        }}
        expires={365}
        onAccept={acceptAll}
        onDecline={rejectAll}
      >
        <div className="flex items-start gap-4 max-w-5xl mx-auto">
          <Cookie className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Wir respektieren deine Privatsphäre
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Wir verwenden Cookies, um deine Erfahrung zu verbessern und unsere Website zu optimieren. 
              <strong className="text-white"> Essenzielle Cookies</strong> sind für die Funktionalität notwendig. 
              <strong className="text-white"> Analytics-Cookies</strong> helfen uns, die Nutzung zu verstehen (optional).
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 underline">
                    <Settings className="h-4 w-4" />
                    Einstellungen anpassen
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Cookie className="h-6 w-6 text-blue-600" />
                      Cookie-Einstellungen
                    </DialogTitle>
                    <DialogDescription>
                      Wähle, welche Cookies du zulassen möchtest. Du kannst deine Einstellungen jederzeit ändern.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Essential Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-base font-semibold">Essenzielle Cookies</Label>
                          <Badge className="bg-green-100 text-green-800 text-xs">Erforderlich</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Technisch notwendig für die Grundfunktionen der Website (Login, Session, CSRF-Schutz). 
                          Diese Cookies können nicht deaktiviert werden.
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich)
                        </p>
                      </div>
                      <Switch checked={true} disabled />
                    </div>

                    {/* Functional Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-base font-semibold mb-2 block">Funktionale Cookies</Label>
                        <p className="text-sm text-slate-600 mb-2">
                          Ermöglichen erweiterte Funktionen wie Spracheinstellungen, Theme-Präferenzen und personalisierte Inhalte.
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                        </p>
                      </div>
                      <Switch
                        checked={preferences.functional}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, functional: checked })
                        }
                      />
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-base font-semibold mb-2 block">Analytics-Cookies</Label>
                        <p className="text-sm text-slate-600 mb-2">
                          Helfen uns zu verstehen, wie Besucher unsere Website nutzen. 
                          Wir verwenden PostHog für anonymisierte Nutzungsstatistiken und Sentry für Fehleranalyse.
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                        </p>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, analytics: checked })
                        }
                      />
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-lg opacity-50">
                      <div className="flex-1">
                        <Label className="text-base font-semibold mb-2 block">Marketing-Cookies</Label>
                        <p className="text-sm text-slate-600 mb-2">
                          Aktuell nicht verwendet. Würden für personalisierte Werbung und Retargeting genutzt werden.
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                        </p>
                      </div>
                      <Switch checked={false} disabled />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={saveCustom}>
                      Einstellungen speichern
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <a
                href="/privacy"
                className="text-slate-400 hover:text-slate-300 text-sm underline"
              >
                Datenschutzerklärung
              </a>
            </div>
          </div>
        </div>
      </CookieConsentBanner>

      {/* Settings Button (always visible in footer) */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-4 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-200 hover:scale-110"
        aria-label="Cookie-Einstellungen"
      >
        <Cookie className="h-5 w-5" />
      </button>
    </>
  );
}

// Type declaration for PostHog (if not already declared)
declare global {
  interface Window {
    posthog?: {
      opt_in_capturing: () => void;
      opt_out_capturing: () => void;
    };
  }
}
