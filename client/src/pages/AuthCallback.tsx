import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Auth Callback Handler
 * Handles email confirmation and password reset redirects from Supabase
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (accessToken && refreshToken) {
          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          if (type === "recovery") {
            // Password reset flow
            setStatus("success");
            setMessage("Du kannst jetzt dein neues Passwort setzen.");
            setTimeout(() => setLocation("/settings/password"), 2000);
          } else {
            // Email confirmation flow
            setStatus("success");
            setMessage("Deine E-Mail wurde erfolgreich bestätigt!");
            
            // Sync user to backend
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await fetch("/api/auth/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name || user.email?.split("@")[0],
                }),
              });
            }
            
            setTimeout(() => setLocation("/dashboard"), 2000);
          }
        } else {
          // Check for error in URL
          const errorDescription = hashParams.get("error_description");
          if (errorDescription) {
            throw new Error(errorDescription);
          }
          throw new Error("Ungültiger Bestätigungslink");
        }
      } catch (error) {
        console.error("[AuthCallback] Error:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten");
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="pt-8 pb-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Wird verarbeitet...</h2>
              <p className="text-slate-400">Bitte warte einen Moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Erfolgreich!</h2>
              <p className="text-slate-400 mb-4">{message}</p>
              <p className="text-sm text-slate-500">Du wirst gleich weitergeleitet...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Fehler</h2>
              <p className="text-red-400 mb-6">{message}</p>
              <div className="flex gap-3 justify-center">
                <Link href="/login">
                  <Button variant="outline" className="border-slate-700 text-slate-300">
                    Zum Login
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    Zur Startseite
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
