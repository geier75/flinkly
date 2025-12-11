import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  UserCheck, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  User,
  ArrowRight,
  Info,
  Loader2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

/**
 * DSGVO/ISO 27001 konforme Login & Registrierung
 * 
 * Compliance Features:
 * - Art. 6 DSGVO: Rechtmäßigkeit der Verarbeitung (Einwilligung)
 * - Art. 7 DSGVO: Bedingungen für die Einwilligung
 * - Art. 12-14 DSGVO: Transparente Informationen
 * - Art. 17 DSGVO: Recht auf Löschung (Hinweis)
 * - Art. 20 DSGVO: Recht auf Datenübertragbarkeit (Hinweis)
 * - ISO 27001: Informationssicherheit
 */

type AuthMode = "login" | "register";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  
  // Form State
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // DSGVO Consent State
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const [acceptedDataProcessing, setAcceptedDataProcessing] = useState(false);

  // Password Strength
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score <= 2) return { score, label: "Schwach", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Mittel", color: "bg-yellow-500" };
    return { score, label: "Stark", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (mode === "register" && password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
    }
    
    // Registration specific
    if (mode === "register") {
      if (!name || name.length < 2) {
        newErrors.name = "Name muss mindestens 2 Zeichen lang sein";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwörter stimmen nicht überein";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSubmit = mode === "login" 
    ? acceptedPrivacy && acceptedTerms && email && password
    : acceptedPrivacy && acceptedTerms && acceptedDataProcessing && email && password && confirmPassword && name;

  // Handle Login with Supabase
  const handleLogin = async () => {
    if (!validateForm() || !canSubmit) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("E-Mail oder Passwort ist falsch");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Bitte bestätige zuerst deine E-Mail-Adresse");
        }
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Sync user to our database
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
          }),
        });
        
        setLocation("/dashboard");
      }
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Login fehlgeschlagen" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration with Supabase
  const handleRegister = async () => {
    if (!validateForm() || !canSubmit) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            consents: {
              privacy: acceptedPrivacy,
              terms: acceptedTerms,
              marketing: acceptedMarketing,
              dataProcessing: acceptedDataProcessing,
              timestamp: new Date().toISOString(),
            },
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          throw new Error("Diese E-Mail-Adresse ist bereits registriert");
        }
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          throw new Error("Diese E-Mail-Adresse ist bereits registriert");
        }
        
        setRegistrationSuccess(true);
      }
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Registrierung fehlgeschlagen" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset
  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: "Bitte gib deine E-Mail-Adresse ein" });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setErrors({ general: "✓ Passwort-Reset E-Mail wurde gesendet!" });
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Fehler beim Senden" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Flinkly
            </span>
          </Link>
          <p className="text-slate-400 mt-2">Dein Marktplatz für digitale Dienstleistungen</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <Tabs value={mode} onValueChange={(v) => setMode(v as AuthMode)}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Anmelden
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Registrieren
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-white text-xl">Willkommen zurück</CardTitle>
                <CardDescription className="text-slate-400">
                  Melde dich sicher an
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.general}
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-300">E-Mail-Adresse</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="deine@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="login-password" className="text-slate-300">Passwort</Label>
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:underline"
                    >
                      Passwort vergessen?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                </div>

                {/* DSGVO Consent - Premium Design */}
                <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-slate-700/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Datenschutz & Einwilligung</p>
                      <p className="text-xs text-slate-500">DSGVO Art. 6 & 7</p>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="p-4 space-y-3">
                    {/* Privacy Checkbox */}
                    <label 
                      htmlFor="login-privacy" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedPrivacy 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="login-privacy"
                        checked={acceptedPrivacy}
                        onCheckedChange={(c) => setAcceptedPrivacy(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={`text-sm leading-relaxed transition-colors ${
                        acceptedPrivacy ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        Ich habe die{" "}
                        <Link href="/privacy" className="text-primary hover:underline font-medium">Datenschutzerklärung</Link>{" "}
                        gelesen und stimme der Verarbeitung meiner Daten zu.
                      </span>
                    </label>

                    {/* Terms Checkbox */}
                    <label 
                      htmlFor="login-terms" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedTerms 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="login-terms"
                        checked={acceptedTerms}
                        onCheckedChange={(c) => setAcceptedTerms(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={`text-sm leading-relaxed transition-colors ${
                        acceptedTerms ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        Ich akzeptiere die{" "}
                        <Link href="/terms" className="text-primary hover:underline font-medium">AGB</Link> und{" "}
                        <Link href="/nutzungsbedingungen" className="text-primary hover:underline font-medium">Nutzungsbedingungen</Link>.
                      </span>
                    </label>
                  </div>

                  {/* Footer Hint */}
                  <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-700/30">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                      Beide Felder sind erforderlich
                    </p>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  disabled={!canSubmit || isLoading}
                  className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold py-6 shadow-lg shadow-primary/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Wird angemeldet...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Sicher anmelden
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-0">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-white text-xl">Konto erstellen</CardTitle>
                <CardDescription className="text-slate-400">
                  Werde Teil der Flinkly-Community
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Registration Success */}
                {registrationSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Registrierung erfolgreich!</h3>
                    <p className="text-slate-400 mb-4">
                      Wir haben dir eine Bestätigungs-E-Mail an <strong className="text-white">{email}</strong> gesendet.
                    </p>
                    <p className="text-sm text-slate-500">
                      Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
                    </p>
                    <Button
                      onClick={() => setMode("login")}
                      variant="outline"
                      className="mt-6 border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Zurück zum Login
                    </Button>
                  </div>
                ) : (
                  <>
                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.general}
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-slate-300">Vollständiger Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Max Mustermann"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-slate-300">E-Mail-Adresse</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="deine@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-slate-300">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mindestens 8 Zeichen"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i <= passwordStrength.score ? passwordStrength.color : "bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Passwortstärke: {passwordStrength.label}</p>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-slate-300">Passwort bestätigen</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="register-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Passwort wiederholen"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                    {confirmPassword && password === confirmPassword && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
                </div>

                {/* DSGVO Consent - Premium Design for Registration */}
                <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-slate-700/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Datenschutz & Einwilligung</p>
                      <p className="text-xs text-slate-500">DSGVO Art. 6, 7 & 13</p>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="mx-4 mt-4 flex items-start gap-2.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-300 leading-relaxed">
                      Wir informieren dich transparent über die Verarbeitung deiner Daten. 
                      Du hast jederzeit das Recht auf Auskunft, Berichtigung und Löschung.
                    </p>
                  </div>

                  {/* Checkboxes */}
                  <div className="p-4 space-y-2">
                    {/* Privacy Checkbox */}
                    <label 
                      htmlFor="reg-privacy" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedPrivacy 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="reg-privacy"
                        checked={acceptedPrivacy}
                        onCheckedChange={(c) => setAcceptedPrivacy(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={`text-sm leading-relaxed transition-colors ${
                        acceptedPrivacy ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        Ich habe die{" "}
                        <Link href="/privacy" className="text-primary hover:underline font-medium">Datenschutzerklärung</Link>{" "}
                        gelesen und verstanden.
                      </span>
                    </label>

                    {/* Terms Checkbox */}
                    <label 
                      htmlFor="reg-terms" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedTerms 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="reg-terms"
                        checked={acceptedTerms}
                        onCheckedChange={(c) => setAcceptedTerms(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={`text-sm leading-relaxed transition-colors ${
                        acceptedTerms ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        Ich akzeptiere die{" "}
                        <Link href="/terms" className="text-primary hover:underline font-medium">AGB</Link> und{" "}
                        <Link href="/nutzungsbedingungen" className="text-primary hover:underline font-medium">Nutzungsbedingungen</Link>.
                      </span>
                    </label>

                    {/* Data Processing Checkbox */}
                    <label 
                      htmlFor="reg-data" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedDataProcessing 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="reg-data"
                        checked={acceptedDataProcessing}
                        onCheckedChange={(c) => setAcceptedDataProcessing(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={`text-sm leading-relaxed transition-colors ${
                        acceptedDataProcessing ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        Ich willige in die Verarbeitung meiner Daten zur Vertragserfüllung ein.
                      </span>
                    </label>

                    {/* Marketing Checkbox - Optional */}
                    <label 
                      htmlFor="reg-marketing" 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        acceptedMarketing 
                          ? 'bg-emerald-500/10 border border-emerald-500/30' 
                          : 'bg-slate-800/20 border border-dashed border-slate-700/50 hover:bg-slate-800/40 hover:border-slate-600/50'
                      }`}
                    >
                      <Checkbox
                        id="reg-marketing"
                        checked={acceptedMarketing}
                        onCheckedChange={(c) => setAcceptedMarketing(c === true)}
                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <div className="flex-1">
                        <span className={`text-sm leading-relaxed transition-colors ${
                          acceptedMarketing ? 'text-slate-200' : 'text-slate-400'
                        }`}>
                          Ich möchte Newsletter und Produktupdates erhalten.
                        </span>
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700/50 text-slate-400">
                          Optional
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-700/30 flex items-center justify-between">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                      Die ersten 3 Felder sind erforderlich
                    </p>
                  </div>
                </div>

                {/* Register Button */}
                <Button
                  onClick={handleRegister}
                  disabled={!canSubmit || isLoading}
                  className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold py-6 shadow-lg shadow-primary/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Wird registriert...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Kostenlos registrieren
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                  </>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-800/30 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>DSGVO-konform</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/30 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>SSL-verschlüsselt</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/30 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span>ISO 27001</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors">
            Datenschutz
          </Link>
          <Link href="/terms" className="text-slate-500 hover:text-primary transition-colors">
            AGB
          </Link>
          <Link href="/imprint" className="text-slate-500 hover:text-primary transition-colors">
            Impressum
          </Link>
          <Link href="/cookies" className="text-slate-500 hover:text-primary transition-colors">
            Cookie-Einstellungen
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Flinkly. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
}
