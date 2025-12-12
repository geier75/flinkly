import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { gigsApi, ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import { IdentityTheater } from "@/components/immersive";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Zap,
  Activity,
  Target,
  Rocket,
  Sparkles,
  Eye,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

/**
 * DashboardNexus - Immersive Dashboard (Armaturenbrett)
 * 
 * Level 3: Identity Theater with stats
 * Real-time data visualization
 */
export default function DashboardNexus() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: myGigs } = useQuery({
    queryKey: ['myGigs'],
    queryFn: () => gigsApi.myGigs(),
    enabled: isAuthenticated,
  });
  const { data: myPurchasesData } = useQuery({
    queryKey: ['myPurchases'],
    queryFn: () => ordersApi.list('buyer'),
    enabled: isAuthenticated,
  });
  const { data: mySalesData } = useQuery({
    queryKey: ['mySales'],
    queryFn: () => ordersApi.list('seller'),
    enabled: isAuthenticated,
  });
  
  const myPurchases = myPurchasesData?.orders || [];
  const mySales = mySalesData?.orders || [];

  // Mock activity for Identity Theater
  const activityHistory = useMemo(() => [
    { id: "1", type: "order" as const, date: new Date(Date.now() - 86400000), description: "Neue Bestellung erhalten" },
    { id: "2", type: "message" as const, date: new Date(Date.now() - 172800000), description: "Nachricht von Kunde" },
    { id: "3", type: "review" as const, date: new Date(Date.now() - 259200000), description: "5-Sterne Bewertung erhalten" },
  ], []);

  const stats = useMemo(() => ({
    totalOrders: mySales?.length || 0,
    totalMessages: 12,
    totalFavorites: 8,
    averageRating: 4.8,
  }), [mySales]);

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

  // Calculate stats
  const totalEarnings = mySales?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;
  const pendingOrders = mySales?.filter(o => o.status === "pending").length || 0;
  const completedOrders = mySales?.filter(o => o.status === "completed").length || 0;

  const statCards = [
    {
      title: "Gesamteinnahmen",
      value: `€${totalEarnings.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Aktive Gigs",
      value: myGigs?.length || 0,
      change: "+2",
      trend: "up",
      icon: Package,
      color: "violet",
    },
    {
      title: "Bestellungen",
      value: mySales?.length || 0,
      change: "+5",
      trend: "up",
      icon: ShoppingBag,
      color: "cyan",
    },
    {
      title: "Bewertung",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "amber",
    },
  ];

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="dashboard">
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Section with Floating Orbs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-4"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-300">Willkommen zurück, Commander</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {user?.name || "Benutzer"}
              </h1>
              <p className="text-slate-400">Dein persönliches Kommandozentrum</p>
            </div>

            {/* Floating Data Orbs */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <DataOrb value={`€${totalEarnings.toFixed(0)}`} label="Einnahmen" color="emerald" size="lg" />
              <DataOrb value={myGigs?.length || 0} label="Aktive Gigs" color="violet" size="md" />
              <DataOrb value={mySales?.length || 0} label="Bestellungen" color="cyan" size="md" />
              <DataOrb value="4.8" label="Bewertung" color="amber" size="lg" />
            </div>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <HolographicCard
                key={stat.title}
                glowColor={stat.color}
                intensity="medium"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5"
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span className="font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <motion.p
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-white mb-1"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                </motion.div>
              </HolographicCard>
            ))}
          </div>

          {/* Energy Bars Section */}
          <HolographicCard glowColor="violet" intensity="low">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">System-Metriken</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnergyBar value={completedOrders} max={mySales?.length || 10} label="Abgeschlossene Bestellungen" color="emerald" />
                <EnergyBar value={pendingOrders} max={mySales?.length || 10} label="Ausstehende Bestellungen" color="amber" />
                <EnergyBar value={myGigs?.length || 0} max={20} label="Gig-Kapazität" color="violet" />
                <EnergyBar value={85} max={100} label="Profil-Vollständigkeit" color="cyan" />
              </div>
            </div>
          </HolographicCard>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <HolographicCard glowColor="cyan" intensity="medium">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Rocket className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Schnellstart</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/create-gig">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 cursor-pointer group"
                    >
                      <div className="p-3 rounded-lg bg-violet-500/20 w-fit mb-3 group-hover:bg-violet-500/30 transition-colors">
                        <Plus className="w-5 h-5 text-violet-400" />
                      </div>
                      <p className="font-medium text-white">Neuer Gig</p>
                      <p className="text-xs text-slate-500">Service erstellen</p>
                    </motion.div>
                  </Link>
                  <Link href="/orders-nexus">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 cursor-pointer group"
                    >
                      <div className="p-3 rounded-lg bg-cyan-500/20 w-fit mb-3 group-hover:bg-cyan-500/30 transition-colors">
                        <ShoppingBag className="w-5 h-5 text-cyan-400" />
                      </div>
                      <p className="font-medium text-white">Bestellungen</p>
                      <p className="text-xs text-slate-500">Transaktionen verwalten</p>
                    </motion.div>
                  </Link>
                  <Link href="/messages-nexus">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 cursor-pointer group"
                    >
                      <div className="p-3 rounded-lg bg-emerald-500/20 w-fit mb-3 group-hover:bg-emerald-500/30 transition-colors relative">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] flex items-center justify-center font-bold">3</span>
                      </div>
                      <p className="font-medium text-white">Nachrichten</p>
                      <p className="text-xs text-slate-500">3 ungelesen</p>
                    </motion.div>
                  </Link>
                  <Link href="/seller-dashboard">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 cursor-pointer group"
                    >
                      <div className="p-3 rounded-lg bg-amber-500/20 w-fit mb-3 group-hover:bg-amber-500/30 transition-colors">
                        <BarChart3 className="w-5 h-5 text-amber-400" />
                      </div>
                      <p className="font-medium text-white">Analytics</p>
                      <p className="text-xs text-slate-500">Statistiken ansehen</p>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </HolographicCard>

            {/* Recent Activity */}
            <HolographicCard glowColor="emerald" intensity="medium">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Letzte Aktivitäten</h3>
                  </div>
                  <Link href="/orders-nexus">
                    <span className="text-sm text-violet-400 hover:text-violet-300 cursor-pointer">Alle anzeigen →</span>
                  </Link>
                </div>
                <div className="space-y-3">
                  {mySales?.slice(0, 4).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className={`
                        relative p-2 rounded-lg
                        ${order.status === 'completed' ? 'bg-emerald-500/20' : 
                          order.status === 'pending' ? 'bg-amber-500/20' : 'bg-slate-500/20'}
                      `}>
                        {order.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : order.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-amber-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-slate-400" />
                        )}
                        {/* Pulse effect */}
                        {order.status === 'pending' && (
                          <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg bg-amber-500/30"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                          Bestellung #{String(order.id).slice(0, 8)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('de-DE', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          €{order.totalPrice?.toFixed(2)}
                        </p>
                        <p className={`text-xs capitalize ${
                          order.status === 'completed' ? 'text-emerald-400' :
                          order.status === 'pending' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {order.status === 'completed' ? 'Abgeschlossen' :
                           order.status === 'pending' ? 'Ausstehend' : order.status}
                        </p>
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      </motion.div>
                      <p className="text-slate-500">Keine Aktivitäten vorhanden</p>
                    </div>
                  )}
                </div>
              </div>
            </HolographicCard>
          </div>

          {/* Identity Theater */}
          <HolographicCard glowColor="violet" intensity="high">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-violet-400" />
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
