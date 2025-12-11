import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Heart,
  User,
  Shield
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GlobalHeader() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Design", value: "design" },
    { name: "Marketing", value: "marketing" },
    { name: "Video", value: "video" },
    { name: "Music & Audio", value: "music" },
    { name: "Business", value: "business" },
    { name: "Tech", value: "tech" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/marketplace?q=${encodeURIComponent(searchQuery.trim())}`;
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        setLocation(`/login?redirect=${encodeURIComponent(searchUrl)}`);
        setSearchQuery("");
        return;
      }
      // Force navigation even if already on marketplace
      if (location.startsWith('/marketplace')) {
        window.location.href = searchUrl;
      } else {
        setLocation(searchUrl);
      }
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 backdrop-blur-xl bg-slate-950/80 border-b border-primary/30 z-40 shadow-lg shadow-primary/10">
      {/* Neon Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-3">
                {APP_LOGO ? (
                  <img src={APP_LOGO} alt={APP_TITLE} className="h-12 drop-shadow-[0_0_20px_rgba(255,107,53,0.7)]" />
                ) : (
                  <div className="relative w-12 h-12 bg-gradient-to-br from-accent via-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/50">
                    <span className="relative z-10">F</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-primary/50 rounded-lg blur-md" />
                  </div>
                )}
                <span translate="no" className="font-black text-2xl bg-gradient-to-r from-accent via-primary to-purple-500 bg-clip-text text-transparent tracking-tight notranslate">
                  Flinkly
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 mx-8">
            {/* Gig finden Link */}
            <Button 
              variant="ghost" 
              className="text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
              onClick={() => {
                if (isAuthenticated) {
                  setLocation("/marketplace");
                } else {
                  setLocation("/login?redirect=/marketplace");
                }
              }}
            >
              Gig finden
            </Button>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-1 text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
                >
                  Kategorien
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.value}
                    onClick={() => {
                      if (isAuthenticated) {
                        setLocation(`/marketplace?category=${encodeURIComponent(category.value)}`);
                      } else {
                        setLocation(`/login?redirect=/marketplace?category=${encodeURIComponent(category.value)}`);
                      }
                    }}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-accent transition-colors duration-300" />
                <Input
                  type="text"
                  placeholder="Gigs durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch(e as any);
                    }
                  }}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-primary focus:ring-primary/30 focus:shadow-[0_0_20px_rgba(78,205,196,0.3)] transition-all duration-300"
                />
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setLocation("/marketplace")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Gig anbieten Button */}
                <Link href="/create-gig">
                  <Button className="hidden sm:flex bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300 border border-primary/30">
                    Gig anbieten
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/40">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="hidden md:block">{user?.name}</span>
                      <ChevronDown className="h-4 w-4 hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 shadow-2xl shadow-black/50 rounded-2xl p-2 backdrop-blur-xl">
                    {/* User Info Header - Premium Style */}
                    <div className="px-4 py-4 mb-2 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-accent/10 rounded-xl border border-slate-700/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-primary to-accent rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-slate-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Navigation */}
                    <div className="space-y-1">
                      <DropdownMenuItem onClick={() => setLocation("/dashboard")} className="text-slate-200 focus:bg-emerald-500/10 focus:text-emerald-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-emerald-500/10 rounded-lg mr-3">
                          <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/dashboard?tab=orders")} className="text-slate-200 focus:bg-orange-500/10 focus:text-orange-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-orange-500/10 rounded-lg mr-3">
                          <ShoppingBag className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="font-medium">Meine Bestellungen</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/messages")} className="text-slate-200 focus:bg-blue-500/10 focus:text-blue-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium">Nachrichten</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/favorites")} className="text-slate-200 focus:bg-rose-500/10 focus:text-rose-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-rose-500/10 rounded-lg mr-3">
                          <Heart className="h-4 w-4 text-rose-500" />
                        </div>
                        <span className="font-medium">Favoriten</span>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-slate-700/50 my-2" />
                    
                    {/* Account Settings */}
                    <div className="space-y-1">
                      <DropdownMenuItem onClick={() => setLocation("/profile")} className="text-slate-200 focus:bg-violet-500/10 focus:text-violet-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-violet-500/10 rounded-lg mr-3">
                          <User className="h-4 w-4 text-violet-500" />
                        </div>
                        <span className="font-medium">Profil bearbeiten</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/settings")} className="text-slate-200 focus:bg-slate-500/10 focus:text-slate-300 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                        <div className="p-2 bg-slate-500/10 rounded-lg mr-3">
                          <Settings className="h-4 w-4 text-slate-400" />
                        </div>
                        <span className="font-medium">Einstellungen</span>
                      </DropdownMenuItem>
                    </div>
                    
                    {user?.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-700/50 my-2" />
                        <DropdownMenuItem onClick={() => setLocation("/admin")} className="text-slate-200 focus:bg-amber-500/10 focus:text-amber-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                          <div className="p-2 bg-amber-500/10 rounded-lg mr-3">
                            <Shield className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="font-medium">Admin-Bereich</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="bg-slate-700/50 my-2" />
                    
                    {/* DSGVO Links - Compact */}
                    <div className="px-3 py-2 flex items-center justify-between text-xs">
                      <button onClick={() => setLocation("/privacy")} className="text-slate-500 hover:text-primary transition-colors">
                        Datenschutz
                      </button>
                      <span className="text-slate-700">•</span>
                      <button onClick={() => setLocation("/data-export")} className="text-slate-500 hover:text-primary transition-colors">
                        Daten exportieren
                      </button>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-slate-700/50 my-2" />
                    
                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-xl py-3 px-3 cursor-pointer transition-all duration-200 hover:translate-x-1">
                      <div className="p-2 bg-red-500/10 rounded-lg mr-3">
                        <LogOut className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="font-medium">Abmelden</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300">
                    Anmelden
                  </Button>
                </Link>
                <Button 
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300 border border-primary/30"
                  onClick={() => setLocation("/login?redirect=/create-gig")}
                >
                  Gig anbieten
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700 py-4 space-y-4">
            {/* Gig finden Link - Mobile */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-200 hover:text-primary hover:bg-primary/10"
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAuthenticated) {
                  setLocation("/marketplace");
                } else {
                  setLocation("/login?redirect=/marketplace");
                }
              }}
            >
              Gig finden
            </Button>

            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Gigs durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-200"
                />
              </div>
            </form>

            {/* Mobile Categories */}
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">Kategorien</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (isAuthenticated) {
                        setLocation(`/marketplace?category=${encodeURIComponent(category.value)}`);
                      } else {
                        setLocation(`/login?redirect=/marketplace?category=${encodeURIComponent(category.value)}`);
                      }
                    }}
                    className="block w-full text-left px-3 py-2 text-slate-200 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Anmelden
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

