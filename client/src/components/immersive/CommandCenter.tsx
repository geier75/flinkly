import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Heart,
  Settings,
  User,
  Shield,
  LogOut,
  Sparkles,
  Bell,
  Search,
  Menu,
  X,
  Zap,
  Activity,
  Globe,
} from "lucide-react";

interface CommandCenterProps {
  children: ReactNode;
  activeSection: string;
}

/**
 * CommandCenter - Futuristic navigation hub
 * 
 * Holographic command interface with animated elements
 */
export function CommandCenter({ children, activeSection }: CommandCenterProps) {
  const { user, logout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({
    connection: "optimal",
    security: "active",
    sync: "complete",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Kommandozentrale", href: "/dashboard-nexus", color: "violet" },
    { id: "orders", icon: ShoppingBag, label: "Transaktionen", href: "/orders-nexus", color: "cyan" },
    { id: "messages", icon: MessageSquare, label: "Kommunikation", href: "/messages-nexus", color: "emerald", badge: 3 },
    { id: "favorites", icon: Heart, label: "Favoriten", href: "/favorites-nexus", color: "rose" },
    { id: "profile", icon: User, label: "Identität", href: "/profile-nexus", color: "amber" },
    { id: "settings", icon: Settings, label: "Systemkontrolle", href: "/settings-nexus", color: "slate" },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Top Command Bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl border border-white/10" />
            
            {/* Animated border */}
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl opacity-50"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
                backgroundSize: "200% 100%",
              }}
            />

            <div className="relative px-6 py-4 flex items-center justify-between">
              {/* Left: Logo & Status */}
              <div className="flex items-center gap-6">
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      {/* Pulse ring */}
                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl border-2 border-violet-500"
                      />
                    </div>
                    <div className="hidden sm:block">
                      <h1 className="font-bold text-lg text-white">FLINKLY</h1>
                      <p className="text-xs text-violet-400">NEXUS v2.0</p>
                    </div>
                  </motion.div>
                </Link>

                {/* System Status */}
                <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-white/10">
                  <StatusIndicator
                    icon={Globe}
                    label="Verbindung"
                    status={systemStatus.connection}
                    color="emerald"
                  />
                  <StatusIndicator
                    icon={Shield}
                    label="Sicherheit"
                    status={systemStatus.security}
                    color="cyan"
                  />
                  <StatusIndicator
                    icon={Activity}
                    label="Sync"
                    status={systemStatus.sync}
                    color="violet"
                  />
                </div>
              </div>

              {/* Center: Time Display */}
              <div className="hidden md:flex flex-col items-center">
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-mono font-bold text-white"
                >
                  {currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </motion.div>
                <p className="text-xs text-slate-500">
                  {currentTime.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>

              {/* Right: Actions & User */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
                </motion.button>

                {/* User Avatar */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name || "Benutzer"}</p>
                    <p className="text-xs text-slate-500">Commander</p>
                  </div>
                </motion.div>

                {/* Mobile Menu */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="lg:hidden p-2 rounded-xl bg-white/5"
                >
                  {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Side Navigation */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed left-4 top-28 bottom-4 w-20 z-40 hidden lg:block"
      >
        <div className="relative h-full rounded-2xl overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl border border-white/10" />

          <div className="relative h-full flex flex-col items-center py-6 gap-2">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative p-3 rounded-xl cursor-pointer transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 border border-violet-500/50' 
                        : 'hover:bg-white/5'
                      }
                    `}
                  >
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-500 text-xs flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-8 rounded-r-full bg-violet-500"
                      />
                    )}

                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-slate-800 text-sm text-white opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap">
                      {item.label}
                    </div>
                  </motion.div>
                </Link>
              );
            })}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => logout()}
              className="p-3 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 lg:hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white">FLINKLY</h1>
                    <p className="text-xs text-violet-400">NEXUS</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.id} href={item.href}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsNavOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                          ${activeSection === item.id 
                            ? 'bg-violet-500/20 text-white' 
                            : 'text-slate-400 hover:bg-white/5'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-violet-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-8 lg:pl-28 px-4">
        {children}
      </main>
    </div>
  );
}

function StatusIndicator({
  icon: Icon,
  label,
  status,
  color,
}: {
  icon: typeof Globe;
  label: string;
  status: string;
  color: string;
}) {
  const colorClasses = {
    emerald: "text-emerald-400 bg-emerald-500/20",
    cyan: "text-cyan-400 bg-cyan-500/20",
    violet: "text-violet-400 bg-violet-500/20",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xs font-medium text-white capitalize">{status}</p>
      </div>
    </div>
  );
}
