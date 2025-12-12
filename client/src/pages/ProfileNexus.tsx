// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { usersApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import { IdentityTheater } from "@/components/immersive";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Save,
  Shield,
  Award,
  Star,
  Calendar,
  Edit3,
  Check,
  Sparkles,
  Zap,
  Trophy,
  Target,
  Heart,
  MessageSquare,
  ShoppingBag,
  Crown,
  Flame,
  Gem,
  Lock,
  Unlock,
} from "lucide-react";

/**
 * ProfileNexus - Immersive Profile View
 * 
 * Identity Theater with editable profile
 * Visual representation of user journey
 */
export default function ProfileNexus() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "",
    phone: "",
    location: "",
    website: "",
  });

  // Mock activity for Identity Theater
  const activityHistory = useMemo(() => [
    { id: "1", type: "order" as const, date: new Date(Date.now() - 86400000), description: "Erste Bestellung abgeschlossen" },
    { id: "2", type: "review" as const, date: new Date(Date.now() - 172800000), description: "5-Sterne Bewertung erhalten" },
    { id: "3", type: "profile_update" as const, date: new Date(Date.now() - 259200000), description: "Profil aktualisiert" },
    { id: "4", type: "favorite" as const, date: new Date(Date.now() - 345600000), description: "10 Favoriten erreicht" },
  ], []);

  const stats = useMemo(() => ({
    totalOrders: 15,
    totalMessages: 42,
    totalFavorites: 23,
    averageRating: 4.9,
  }), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const handleSave = () => {
    // TODO: Implement via tRPC
    toast.success("Profil gespeichert!");
    setIsEditing(false);
  };

  // Achievements with more detail
  const achievements = [
    { icon: Star, label: "Top Bewertet", description: "4.9+ Durchschnitt", unlocked: true, color: "amber", progress: 100 },
    { icon: Award, label: "Verifiziert", description: "Identität bestätigt", unlocked: true, color: "emerald", progress: 100 },
    { icon: Shield, label: "Trusted", description: "50+ Transaktionen", unlocked: false, color: "cyan", progress: 30 },
    { icon: Calendar, label: "Veteran", description: "1 Jahr Mitglied", unlocked: false, color: "violet", progress: 50 },
    { icon: Crown, label: "Elite", description: "Top 1% Verkäufer", unlocked: false, color: "rose", progress: 15 },
    { icon: Flame, label: "Streak", description: "30 Tage aktiv", unlocked: true, color: "orange", progress: 100 },
    { icon: Gem, label: "Premium", description: "Premium Mitglied", unlocked: false, color: "purple", progress: 0 },
    { icon: Trophy, label: "Champion", description: "100 Verkäufe", unlocked: false, color: "yellow", progress: 45 },
  ];

  // Calculate profile level
  const profileLevel = useMemo(() => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    if (unlockedCount >= 6) return { name: "Legendary", color: "from-amber-500 to-orange-500", icon: Crown };
    if (unlockedCount >= 4) return { name: "Gold", color: "from-yellow-500 to-amber-500", icon: Trophy };
    if (unlockedCount >= 2) return { name: "Silber", color: "from-slate-300 to-slate-400", icon: Award };
    return { name: "Bronze", color: "from-orange-700 to-orange-800", icon: Star };
  }, []);

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="profile">
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Profile Header */}
            <HolographicCard glowColor="violet" intensity="high">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar with Rings */}
                  <div className="relative">
                    {/* Outer rotating ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 rounded-full border-2 border-dashed border-violet-500/30"
                    />
                    {/* Middle pulsing ring */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-2 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20"
                    />
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl"
                      style={{ boxShadow: "0 0 60px rgba(139, 92, 246, 0.5)" }}
                    >
                      {user?.name?.charAt(0) || "U"}
                      {/* Status indicator */}
                      <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-900" />
                    </motion.div>
                    {/* Camera button */}
                    {isEditing && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-0 right-0 p-3 rounded-full bg-violet-500 text-white shadow-lg hover:bg-violet-400 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                          {user?.name || "Benutzer"}
                        </h1>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${profileLevel.color} text-white text-sm font-bold flex items-center gap-1`}
                        >
                          <profileLevel.icon className="w-4 h-4" />
                          {profileLevel.name}
                        </motion.div>
                      </div>
                      <p className="text-slate-400 mb-4">{user?.email}</p>
                      
                      {/* Quick Stats */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                          <p className="text-xs text-slate-500">Bestellungen</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                          <p className="text-xs text-slate-500">Nachrichten</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{stats.totalFavorites}</p>
                          <p className="text-xs text-slate-500">Favoriten</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                          </div>
                          <p className="text-xs text-slate-500">Bewertung</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Edit Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`
                        px-6 py-3 rounded-xl font-semibold transition-all
                        ${isEditing 
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600" 
                          : "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                        }
                      `}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Speichern
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-5 h-5 mr-2" />
                          Bearbeiten
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </HolographicCard>
          </motion.div>

          {/* Floating Data Orbs */}
          <div className="flex flex-wrap justify-center gap-6">
            <DataOrb value={stats.totalOrders} label="Bestellungen" color="cyan" size="md" />
            <DataOrb value={stats.totalMessages} label="Nachrichten" color="emerald" size="md" />
            <DataOrb value={stats.totalFavorites} label="Favoriten" color="rose" size="md" />
            <DataOrb value={stats.averageRating} label="Bewertung" color="amber" size="md" />
          </div>

          {/* Achievements Section */}
          <HolographicCard glowColor="amber" intensity="medium">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="w-6 h-6 text-amber-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white">Errungenschaften</h3>
                <span className="ml-auto text-sm text-slate-400">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length} freigeschaltet
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`
                      relative p-4 rounded-2xl text-center cursor-pointer transition-all
                      ${achievement.unlocked
                        ? `bg-gradient-to-br from-${achievement.color}-500/20 to-${achievement.color}-600/10 border border-${achievement.color}-500/40`
                        : 'bg-slate-800/30 border border-slate-700/50'
                      }
                    `}
                  >
                    {/* Lock/Unlock indicator */}
                    <div className="absolute top-2 right-2">
                      {achievement.unlocked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1 rounded-full bg-emerald-500/20"
                        >
                          <Unlock className="w-3 h-3 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <div className="p-1 rounded-full bg-slate-700/50">
                          <Lock className="w-3 h-3 text-slate-500" />
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <motion.div
                      animate={achievement.unlocked ? { 
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`
                        w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center
                        ${achievement.unlocked 
                          ? `bg-gradient-to-br from-${achievement.color}-500/30 to-${achievement.color}-600/20` 
                          : 'bg-slate-700/30'
                        }
                      `}
                    >
                      <achievement.icon className={`w-7 h-7 ${achievement.unlocked ? `text-${achievement.color}-400` : 'text-slate-500'}`} />
                    </motion.div>

                    {/* Label */}
                    <p className={`font-semibold text-sm mb-1 ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                      {achievement.label}
                    </p>
                    <p className="text-xs text-slate-500 mb-3">{achievement.description}</p>

                    {/* Progress bar */}
                    {!achievement.unlocked && (
                      <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r from-${achievement.color}-500 to-${achievement.color}-400`}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </HolographicCard>

          {/* Profile Stats Energy Bars */}
          <HolographicCard glowColor="cyan" intensity="low">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Profil-Fortschritt</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnergyBar value={85} max={100} label="Profil-Vollständigkeit" color="violet" />
                <EnergyBar value={stats.totalOrders} max={50} label="Bestellungen bis Trusted" color="cyan" />
                <EnergyBar value={180} max={365} label="Tage bis Veteran" color="emerald" />
                <EnergyBar value={45} max={100} label="Verkäufe bis Champion" color="amber" />
              </div>
            </div>
          </HolographicCard>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Form */}
            <HolographicCard glowColor="violet" intensity="medium">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Persönliche Daten</h3>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Name
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-50 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      E-Mail
                    </Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-slate-800/50 border-slate-700 text-white opacity-50"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      E-Mail kann nicht geändert werden
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      Telefon
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Optional"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 disabled:opacity-50 focus:border-violet-500"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      Standort
                    </Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="z.B. Berlin, Deutschland"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 disabled:opacity-50 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* Additional Info */}
            <HolographicCard glowColor="emerald" intensity="medium">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Zusätzliche Infos</h3>
                </div>

                <div className="space-y-4">
                  {/* Website */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://..."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 disabled:opacity-50 focus:border-emerald-500"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Über mich</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Erzähle etwas über dich..."
                      rows={6}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 disabled:opacity-50 resize-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>

          {/* Identity Theater */}
          <HolographicCard glowColor="violet" intensity="high">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Identitäts-Theater</h3>
              </div>
              <IdentityTheater
                user={{
                  name: user?.name || "Benutzer",
                  email: user?.email || "",
                  memberSince: new Date(Date.now() - 180 * 86400000),
                  level: "gold",
                }}
                activityHistory={activityHistory}
                stats={stats}
              />
            </div>
          </HolographicCard>
        </div>
      </CommandCenter>
    </>
  );
}
