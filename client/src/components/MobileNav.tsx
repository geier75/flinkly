/**
 * Mobile Navigation - Hamburger Menu
 * 
 * Responsive navigation for mobile devices with slide-in menu
 */

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, Search, PlusCircle, MessageCircle, User, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_TITLE } from "@/const";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/marketplace", label: "Marketplace", icon: Search },
    { href: "/create-gig", label: "Gig erstellen", icon: PlusCircle, authRequired: true },
    { href: "/favorites", label: "Favoriten", icon: Heart, authRequired: true },
    { href: "/messages", label: "Nachrichten", icon: MessageCircle, authRequired: true },
    { href: "/profile", label: "Profil", icon: User, authRequired: true },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          aria-label="Menü öffnen"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] bg-slate-950 border-slate-800 p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {APP_TITLE}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/10"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                // Hide auth-required items if not logged in
                if (item.authRequired && !isAuthenticated) return null;

                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 h-12"
                        onClick={() => setOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {isAuthenticated && user && (
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
