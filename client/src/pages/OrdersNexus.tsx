import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  User,
  MessageSquare,
  Star,
  Download,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowRight,
  Eye,
  Receipt,
  Truck,
  CreditCard,
} from "lucide-react";

type OrderStatus = "all" | "pending" | "in_progress" | "completed" | "cancelled";

/**
 * OrdersNexus - Immersive Orders View (Bestellungen)
 * 
 * Visual order timeline with status indicators
 * Ritual-based order tracking
 */
export default function OrdersNexus() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"purchases" | "sales">("purchases");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const { data: myPurchases } = trpc.orders.myPurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: mySales } = trpc.orders.mySales.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const orders = activeTab === "purchases" ? myPurchases : mySales;
  const filteredOrders = orders?.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const statusConfig = {
    pending: { icon: Clock, color: "amber", label: "Ausstehend" },
    in_progress: { icon: Package, color: "blue", label: "In Bearbeitung" },
    completed: { icon: CheckCircle, color: "emerald", label: "Abgeschlossen" },
    cancelled: { icon: XCircle, color: "red", label: "Storniert" },
    disputed: { icon: AlertCircle, color: "orange", label: "Streitfall" },
  };

  const statusFilters: { id: OrderStatus; label: string }[] = [
    { id: "all", label: "Alle" },
    { id: "pending", label: "Ausstehend" },
    { id: "in_progress", label: "In Bearbeitung" },
    { id: "completed", label: "Abgeschlossen" },
    { id: "cancelled", label: "Storniert" },
  ];

  // Calculate stats
  const totalRevenue = mySales?.reduce((sum, o) => sum + (o.totalPrice || 0), 0) || 0;
  const totalSpent = myPurchases?.reduce((sum, o) => sum + (o.totalPrice || 0), 0) || 0;
  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const completedCount = orders?.filter(o => o.status === "completed").length || 0;

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="orders">
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Transaktions-Zentrale</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Bestellungen</h1>
            <p className="text-slate-400">Verfolge alle deine Transaktionen in Echtzeit</p>
          </motion.div>

          {/* Floating Data Orbs */}
          <div className="flex flex-wrap justify-center gap-6">
            <DataOrb value={`€${totalRevenue.toFixed(0)}`} label="Einnahmen" color="emerald" size="lg" />
            <DataOrb value={myPurchases?.length || 0} label="Käufe" color="cyan" size="md" />
            <DataOrb value={mySales?.length || 0} label="Verkäufe" color="violet" size="md" />
            <DataOrb value={`€${totalSpent.toFixed(0)}`} label="Ausgaben" color="rose" size="lg" />
          </div>

          {/* Stats Energy Bars */}
          <HolographicCard glowColor="cyan" intensity="low">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Transaktions-Übersicht</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EnergyBar value={completedCount} max={(orders?.length || 1)} label="Abgeschlossen" color="emerald" />
                <EnergyBar value={pendingCount} max={(orders?.length || 1)} label="Ausstehend" color="amber" />
                <EnergyBar value={myPurchases?.length || 0} max={20} label="Käufe diesen Monat" color="cyan" />
                <EnergyBar value={mySales?.length || 0} max={20} label="Verkäufe diesen Monat" color="violet" />
              </div>
            </div>
          </HolographicCard>

          {/* Tab Switcher */}
          <HolographicCard glowColor="violet" intensity="medium">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                  {[
                    { id: "purchases", label: "Meine Käufe", icon: ShoppingBag, count: myPurchases?.length || 0, color: "cyan" },
                    { id: "sales", label: "Meine Verkäufe", icon: Receipt, count: mySales?.length || 0, color: "emerald" },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id as "purchases" | "sales")}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((filter) => {
                    const filterConfig = filter.id !== "all" ? statusConfig[filter.id] : null;
                    return (
                      <motion.button
                        key={filter.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStatusFilter(filter.id)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                          ${statusFilter === filter.id
                            ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                          }
                        `}
                      >
                        {filterConfig && <filterConfig.icon className="w-3 h-3" />}
                        {filter.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Orders List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders?.length ? (
                filteredOrders.map((order, index) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const isSelected = selectedOrder === String(order.id);

                  return (
                    <HolographicCard
                      key={order.id}
                      glowColor={status.color as any}
                      intensity={isSelected ? "high" : "low"}
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedOrder(isSelected ? null : String(order.id))}
                        className="cursor-pointer"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Status Icon with Animation */}
                            <motion.div
                              animate={order.status === "pending" ? {
                                scale: [1, 1.1, 1],
                                opacity: [1, 0.7, 1]
                              } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`relative p-4 rounded-2xl bg-gradient-to-br from-${status.color}-500/30 to-${status.color}-600/20`}
                            >
                              <StatusIcon className={`w-7 h-7 text-${status.color}-400`} />
                              {order.status === "pending" && (
                                <motion.div
                                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className={`absolute inset-0 rounded-2xl bg-${status.color}-500/30`}
                                />
                              )}
                            </motion.div>

                            {/* Order Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">
                                  Bestellung #{String(order.id).slice(0, 8)}
                                </h3>
                                <motion.span
                                  animate={{ opacity: [1, 0.7, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={`
                                    px-3 py-1 text-xs font-bold rounded-full
                                    bg-${status.color}-500/20 text-${status.color}-400 border border-${status.color}-500/30
                                  `}
                                >
                                  {status.label}
                                </motion.span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(order.createdAt).toLocaleDateString('de-DE', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <User className="w-4 h-4" />
                                  {activeTab === "purchases" ? "Verkäufer" : "Käufer"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <CreditCard className="w-4 h-4" />
                                  Bezahlt
                                </span>
                              </div>
                            </div>

                            {/* Price & Arrow */}
                            <div className="text-right">
                              <motion.p
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-bold text-white"
                              >
                                €{order.totalPrice?.toFixed(2)}
                              </motion.p>
                              <motion.div
                                animate={{ rotate: isSelected ? 90 : 0, x: isSelected ? 5 : 0 }}
                                className="mt-2 flex justify-end"
                              >
                                <ArrowRight className={`w-5 h-5 ${isSelected ? 'text-violet-400' : 'text-slate-500'}`} />
                              </motion.div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-white/10"
                              >
                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                  <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300 hover:border-violet-400 transition-colors"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                    Nachricht
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-colors"
                                  >
                                    <Star className="w-4 h-4" />
                                    Bewerten
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    Rechnung
                                  </motion.button>
                                </div>

                                {/* Order Timeline */}
                                <div className="bg-slate-800/30 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-cyan-400" />
                                    Bestellverlauf
                                  </h4>
                                  <div className="relative pl-8">
                                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-slate-700" />
                                    {[
                                      { label: "Bestellung aufgegeben", date: order.createdAt, done: true, icon: ShoppingBag },
                                      { label: "Zahlung bestätigt", date: order.createdAt, done: true, icon: CreditCard },
                                      { label: "In Bearbeitung", date: null, done: order.status !== "pending", icon: Package },
                                      { label: "Abgeschlossen", date: null, done: order.status === "completed", icon: CheckCircle },
                                    ].map((step, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative flex items-center gap-4 pb-4"
                                      >
                                        <motion.div
                                          animate={step.done ? {} : { opacity: [0.5, 1, 0.5] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                          className={`
                                            absolute left-0 w-6 h-6 rounded-full flex items-center justify-center
                                            ${step.done 
                                              ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' 
                                              : 'bg-slate-700 border-2 border-slate-600'
                                            }
                                          `}
                                        >
                                          <step.icon className={`w-3 h-3 ${step.done ? 'text-white' : 'text-slate-500'}`} />
                                        </motion.div>
                                        <div className="ml-4">
                                          <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-slate-500'}`}>
                                            {step.label}
                                          </p>
                                          {step.date && (
                                            <p className="text-xs text-slate-500">
                                              {new Date(step.date).toLocaleString('de-DE')}
                                            </p>
                                          )}
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </HolographicCard>
                  );
                })
              ) : (
                <HolographicCard glowColor="violet" intensity="low">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <ShoppingBag className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Keine Bestellungen</h3>
                    <p className="text-slate-500 mb-6">
                      {activeTab === "purchases" 
                        ? "Du hast noch keine Käufe getätigt" 
                        : "Du hast noch keine Verkäufe"
                      }
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold"
                    >
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Jetzt entdecken
                    </motion.button>
                  </motion.div>
                </HolographicCard>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CommandCenter>
    </>
  );
}
