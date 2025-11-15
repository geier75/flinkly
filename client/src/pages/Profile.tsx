import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, User, Mail, MapPin, LogOut, Edit2, Save, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

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
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <motion.div
          className="container mx-auto px-4 py-20 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-slate-900/60 border-2 border-accent/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-accent/20">
            <AlertCircle className="h-16 w-16 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-3">Authentifizierung erforderlich</h1>
            <p className="text-slate-300 mb-8">Du musst angemeldet sein, um dein Profil zu sehen.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-accent/50 hover:scale-105 transition-all duration-300"
            >
              Zur Startseite
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you would call an API to save the profile
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Cyberpunk Header */}
      <div className="relative bg-slate-900/60 border-b-2 border-accent/30 backdrop-blur-xl">
        {/* Neon Glow Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-80" />
        
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3" style={{
              textShadow: '0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 107, 53, 0.2)'
            }}>
              MEIN PROFIL
            </h1>
            <p className="text-xl text-slate-300">Verwalte deine Profilinformationen</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Profile Card */}
          <Card className="bg-slate-900/60 border-2 border-slate-700/50 hover:border-accent/50 backdrop-blur-xl shadow-2xl shadow-black/40 transition-all duration-300 mb-8">
            {/* Gradient Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/10 to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10" />
            
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <User className="h-6 w-6 text-accent" />
                    Profilinformationen
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-2">Deine persönlichen Daten</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-2 border-accent/30 hover:border-accent hover:bg-accent/10 text-accent font-semibold transition-all duration-300 hover:scale-105"
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
                    <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-accent" />
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dein Name"
                      className="bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent focus:ring-4 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-accent" />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Erzähle uns etwas über dich..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>

                  {/* Land */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Land
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30 transition-all duration-300"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} className="bg-slate-900">
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <User className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm text-slate-400">Name</p>
                        <p className="text-white font-semibold">{user.name || "Nicht angegeben"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <Mail className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm text-slate-400">E-Mail</p>
                        <p className="text-white font-semibold">{user.email || "Nicht angegeben"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <MapPin className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm text-slate-400">Land</p>
                        <p className="text-white font-semibold">{COUNTRIES.find(c => c.code === formData.country)?.name || "Deutschland"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="bg-slate-900/60 border-2 border-slate-700/50 hover:border-red-500/50 backdrop-blur-xl shadow-2xl shadow-black/40 transition-all duration-300">
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <CardTitle className="text-2xl font-bold text-white">Kontoeinstellungen</CardTitle>
              <CardDescription className="text-slate-400 mt-2">Verwalte deine Kontosicherheit</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-bold transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
