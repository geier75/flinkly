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
  LayoutDashboard
} from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
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
    "Logo Design",
    "Social Media",
    "SEO",
    "Content Writing",
    "Video Editing",
    "Web Development",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
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
              {APP_LOGO ? (
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10 drop-shadow-[0_0_15px_rgba(255,107,53,0.6)]" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-gradient-to-br from-accent via-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/50">
                    <span className="relative z-10">F</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-primary/50 rounded-lg blur-md" />
                  </div>
                  <span className="font-black text-2xl bg-gradient-to-r from-accent via-primary to-purple-500 bg-clip-text text-transparent hidden sm:block tracking-tight">
                    {APP_TITLE}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 mx-8">
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
                    key={category}
                    onClick={() => setLocation(`/marketplace?category=${encodeURIComponent(category)}`)}
                  >
                    {category}
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
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/profile")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" className="hidden sm:flex text-slate-200 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300">
                    Anmelden
                  </Button>
                </a>
                <Link href="/create-gig">
                  <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-bold shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300 border border-primary/30">
                    Gig anbieten
                  </Button>
                </Link>
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
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Gigs durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Mobile Categories */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Kategorien</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setLocation(`/marketplace?category=${encodeURIComponent(category)}`);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <a href={getLoginUrl()}>
                <Button variant="outline" className="w-full">
                  Anmelden
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

