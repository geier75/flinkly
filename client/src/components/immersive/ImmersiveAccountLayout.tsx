import { useState, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserNexusScene } from "./UserNexusScene";
import { PrivacyEmpathyLayer } from "./PrivacyEmpathyLayer";
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
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";

interface ImmersiveAccountLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  activeSection: "dashboard" | "orders" | "messages" | "favorites" | "settings" | "profile";
  showPrivacyLayer?: boolean;
}

/**
 * ImmersiveAccountLayout - Unified immersive layout for all account sections
 * 
 * MIMITECH UX Pyramid Implementation across all account areas:
 * - Level 1-2: 3D particle background with privacy-aware colors
 * - Level 6: Privacy empathy layer (optional)
 * - Consistent navigation and visual language
 */
export function ImmersiveAccountLayout({
  children,
  title,
  subtitle,
  activeSection,
  showPrivacyLayer = false,
}: ImmersiveAccountLayoutProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isActive, setIsActive] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Privacy status based on section
  const privacyStatus = useMemo(() => {
    switch (activeSection) {
      case "settings":
        return "secure";
      case "messages":
        return "synced";
      case "orders":
        return "synced";
      default:
        return "secure";
    }
  }, [activeSection]);

  // Inactivity detection
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 30000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Armaturenbrett", href: "/dashboard-nexus" },
    { id: "orders", icon: ShoppingBag, label: "Bestellungen", href: "/orders-nexus" },
    { id: "messages", icon: MessageSquare, label: "Nachrichten", href: "/messages-nexus", badge: 3 },
    { id: "favorites", icon: Heart, label: "Favoriten", href: "/favorites-nexus" },
    { id: "profile", icon: User, label: "Profil", href: "/profile-nexus" },
    { id: "settings", icon: Settings, label: "Einstellungen", href: "/settings-nexus" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* 3D Background */}
      <UserNexusScene privacyStatus={privacyStatus} isActive={isActive} />

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex flex-col w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800/50"
        >
          {/* Logo/Brand */}
          <div className="p-6 border-b border-slate-800/50">
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">Flinkly</h1>
                  <p className="text-xs text-slate-500">User Nexus</p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-800/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{user?.name || "Benutzer"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                      transition-all duration-300 group relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-violet-500 text-white">
                        {item.badge}
                      </span>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-violet-500"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <Link href="/privacy-dashboard">
              <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                <Shield className="w-4 h-4 mr-3" />
                Datenschutz-Center
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Abmelden
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-2xl border-b border-slate-800/50"
          >
            <div className="flex items-center justify-between px-6 py-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 text-slate-400"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>

              {/* Page Title */}
              <div className="flex-1 lg:flex-none">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-slate-500">{subtitle}</p>
                )}
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
                </Button>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-6 pb-3 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/">
                <span className="hover:text-white cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{title}</span>
            </div>
          </motion.header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Privacy Layer (optional) */}
            {showPrivacyLayer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <PrivacyEmpathyLayer
                  externalServicesActive={false}
                  trackersDetected={0}
                  lastActivity={new Date()}
                  dataStatus="synced"
                  encryptionStatus="active"
                />
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 lg:hidden"
            >
              {/* Mobile nav content - same as sidebar */}
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white">Flinkly</h1>
                    <p className="text-xs text-slate-500">User Nexus</p>
                  </div>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMobileNav(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                        ${activeSection === item.id 
                          ? 'bg-violet-500/20 text-white' 
                          : 'text-slate-400'
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Inactivity indicator */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-xl border border-slate-700 text-sm text-slate-400">
              Bewege die Maus, um den Raum zu aktivieren
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
