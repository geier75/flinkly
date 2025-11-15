import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Plus, Package, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const { data: myGigs } = trpc.gigs.myGigs.useQuery();
  const { data: myPurchases } = trpc.orders.myPurchases.useQuery();
  const { data: mySales } = trpc.orders.mySales.useQuery();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.4)]",
      in_progress: "bg-primary/20 text-primary border border-primary/60 shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.4)]",
      completed: "bg-green-500/20 text-green-300 border border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.4)]",
      cancelled: "bg-red-500/20 text-red-300 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
      disputed: "bg-accent/20 text-accent border border-accent/60 shadow-[0_0_20px_oklch(0.70_0.20_35_/_0.4)]",
    };
    return colors[status] || "bg-slate-700/50 text-slate-300 border border-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Cyberpunk Neon Header */}
      <div className="relative z-10 cyber-neon-border bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="flex justify-between items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-6xl font-extrabold mb-3 tracking-tight cyber-chrome-text flex items-center gap-4">
                <Zap className="h-12 w-12 text-primary animate-pulse" />
                Willkommen bei <span className="cyber-neon-green">Flinkly</span>
              </h1>
              <p className="text-slate-300 text-xl font-light tracking-wide">
                Verwalte deine Gigs, Bestellungen und Verdienste
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/profile">
                <Button variant="outline" className="border-2 border-slate-600 text-white hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] transition-all duration-300 backdrop-blur-xl">
                  Profil
                </Button>
              </Link>
              <Link href="/create-gig">
                <Button className="cyber-neon-button text-white font-bold px-8 py-3 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Neuer Gig
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-2 border-slate-700 backdrop-blur-xl p-2 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:cyber-neon-button data-[state=active]:text-white rounded-xl transition-all duration-300 text-slate-300 font-semibold text-lg"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="gigs" 
              className="data-[state=active]:cyber-neon-button data-[state=active]:text-white rounded-xl transition-all duration-300 text-slate-300 font-semibold text-lg"
            >
              <Package className="h-5 w-5 mr-2" />
              Meine Gigs
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:cyber-neon-button data-[state=active]:text-white rounded-xl transition-all duration-300 text-slate-300 font-semibold text-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Bestellungen
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Active Gigs Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="cyber-glass-card border-2 border-primary/40 group transition-all duration-500 hover:shadow-[0_0_60px_oklch(0.70_0.25_150_/_0.6)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg font-bold text-slate-200">Aktive Gigs</CardTitle>
                    <Package className="h-8 w-8 text-primary animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-extrabold cyber-neon-green mb-2">{myGigs?.length || 0}</div>
                    <p className="text-sm text-slate-400 font-medium">
                      {myGigs?.filter((g) => g.active).length || 0} aktiv • {myGigs?.filter((g) => !g.active).length || 0} inaktiv
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Orders Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="cyber-glass-card border-2 border-accent/40 group transition-all duration-500 hover:shadow-[0_0_60px_oklch(0.70_0.20_35_/_0.6)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg font-bold text-slate-200">Bestellungen</CardTitle>
                    <ShoppingCart className="h-8 w-8 text-accent animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-extrabold cyber-neon-orange mb-2">
                      {(myPurchases?.length || 0) + (mySales?.length || 0)}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      {myPurchases?.filter((o) => o.status === "completed").length || 0} abgeschlossen
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rating Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="cyber-glass-card border-2 border-yellow-500/40 group transition-all duration-500 hover:shadow-[0_0_60px_rgba(234,179,8,0.6)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg font-bold text-slate-200">Bewertung</CardTitle>
                    <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-extrabold text-yellow-400 mb-2" style={{textShadow: '0 0 20px rgba(234, 179, 8, 0.8)'}}>4.8</div>
                    <p className="text-sm text-slate-400 font-medium">basierend auf 12 Bewertungen</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="cyber-glass-card border-2 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold cyber-chrome-text">Schnellstart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full justify-start text-lg border-2 border-slate-600 text-white hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] transition-all duration-300 py-6">
                      <Zap className="h-5 w-5 mr-3 text-primary" />
                      Marketplace erkunden
                    </Button>
                  </Link>
                  <Link href="/create-gig">
                    <Button variant="outline" className="w-full justify-start text-lg border-2 border-slate-600 text-white hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_30px_oklch(0.70_0.20_35_/_0.4)] transition-all duration-300 py-6">
                      <Plus className="h-5 w-5 mr-3 text-accent" />
                      Erstes Gig erstellen
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-lg border-2 border-slate-600 text-white hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] transition-all duration-300 py-6">
                    <Star className="h-5 w-5 mr-3 text-yellow-500" />
                    Profil bearbeiten
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-extrabold cyber-chrome-text">Meine Gigs</h2>
              <Link href="/create-gig">
                <Button className="cyber-neon-button text-white font-bold px-8 py-4 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Neuer Gig
                </Button>
              </Link>
            </div>

            {!myGigs || myGigs.length === 0 ? (
              <Card className="cyber-glass-card border-2 border-slate-700/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Package className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                  <p className="text-slate-300 mb-6 text-xl font-medium">
                    Du hast noch keine Gigs erstellt
                  </p>
                  <Link href="/create-gig">
                    <Button className="cyber-neon-button text-white font-bold px-10 py-4 text-lg">
                      Erstes Gig erstellen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {myGigs.map((gig, index) => (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <Card className="cyber-glass-card border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-[0_0_60px_oklch(0.70_0.25_150_/_0.6)]">
                      <CardContent className="pt-8 pb-8">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-extrabold text-2xl mb-3 text-white">{gig.title}</h3>
                            <p className="text-base text-slate-400 mb-4 leading-relaxed">
                              {gig.description.substring(0, 150)}...
                            </p>
                            <div className="flex gap-6 text-base">
                              <span className="cyber-neon-orange font-bold text-xl">
                                €{(gig.price / 100).toFixed(2)}
                              </span>
                              <span className="text-slate-400 font-medium">
                                {gig.completedOrders} Bestellungen
                              </span>
                              {gig.averageRating && (
                                <span className="text-yellow-400 font-semibold" style={{textShadow: '0 0 10px rgba(234, 179, 8, 0.6)'}}>
                                  ⭐ {parseFloat(gig.averageRating.toString()).toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                                gig.active
                                  ? "bg-green-500/20 text-green-300 border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                  : "bg-slate-700/50 text-slate-300 border-slate-600"
                              }`}
                            >
                              {gig.active ? "Aktiv" : "Inaktiv"}
                            </span>
                            <Button variant="outline" size="sm" className="border-2 border-slate-600 text-white hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_20px_oklch(0.70_0.20_35_/_0.4)] font-semibold px-6">
                              Bearbeiten
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8">
            <Tabs defaultValue="purchases" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-2 border-slate-700 backdrop-blur-xl p-2 rounded-2xl">
                <TabsTrigger 
                  value="purchases" 
                  className="data-[state=active]:cyber-neon-button data-[state=active]:text-white rounded-xl transition-all duration-300 text-slate-300 font-semibold text-lg"
                >
                  Meine Käufe
                </TabsTrigger>
                <TabsTrigger 
                  value="sales" 
                  className="data-[state=active]:cyber-neon-button data-[state=active]:text-white rounded-xl transition-all duration-300 text-slate-300 font-semibold text-lg"
                >
                  Meine Verkäufe
                </TabsTrigger>
              </TabsList>

              {/* Purchases */}
              <TabsContent value="purchases" className="space-y-6 mt-8">
                {!myPurchases || myPurchases.length === 0 ? (
                  <Card className="cyber-glass-card border-2 border-slate-700/50">
                    <CardContent className="pt-12 pb-12 text-center">
                      <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                      <p className="text-slate-300 mb-6 text-xl font-medium">
                        Du hast noch keine Gigs gekauft
                      </p>
                      <Link href="/marketplace">
                        <Button className="cyber-neon-button text-white font-bold px-10 py-4 text-lg">
                          Marketplace erkunden
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  myPurchases.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="cyber-glass-card border-2 border-accent/40 hover:border-accent/80 transition-all duration-500 hover:shadow-[0_0_60px_oklch(0.70_0.20_35_/_0.6)]">
                        <CardContent className="pt-8 pb-8">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold mb-3 text-white text-xl">Bestellung #{order.id}</h3>
                              <div className="space-y-2 text-base text-slate-400 font-medium">
                                <p className="cyber-neon-orange font-bold text-2xl">€{(order.totalPrice / 100).toFixed(2)}</p>
                                <p>Erstellt: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("de-DE") : "N/A"}</p>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(order.status || "pending")}`}>
                              {order.status === "pending" && "Ausstehend"}
                              {order.status === "in_progress" && "In Bearbeitung"}
                              {order.status === "completed" && "Abgeschlossen"}
                              {order.status === "cancelled" && "Storniert"}
                              {order.status === "disputed" && "Umstritten"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              {/* Sales */}
              <TabsContent value="sales" className="space-y-6 mt-8">
                {!mySales || mySales.length === 0 ? (
                  <Card className="cyber-glass-card border-2 border-slate-700/50">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Package className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                      <p className="text-slate-300 mb-6 text-xl font-medium">
                        Du hast noch keine Gigs verkauft
                      </p>
                      <Link href="/create-gig">
                        <Button className="cyber-neon-button text-white font-bold px-10 py-4 text-lg">
                          Gig erstellen
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  mySales.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="cyber-glass-card border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-[0_0_60px_oklch(0.70_0.25_150_/_0.6)]">
                        <CardContent className="pt-8 pb-8">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold mb-3 text-white text-xl">Bestellung #{order.id}</h3>
                              <div className="space-y-2 text-base text-slate-400 font-medium">
                                <p className="cyber-neon-green font-bold text-2xl">€{(order.totalPrice / 100).toFixed(2)}</p>
                                <p>Erstellt: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("de-DE") : "N/A"}</p>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(order.status || "pending")}`}>
                              {order.status === "pending" && "Ausstehend"}
                              {order.status === "in_progress" && "In Bearbeitung"}
                              {order.status === "completed" && "Abgeschlossen"}
                              {order.status === "cancelled" && "Storniert"}
                              {order.status === "disputed" && "Umstritten"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
