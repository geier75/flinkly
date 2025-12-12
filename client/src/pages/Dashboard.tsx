import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gigsApi, ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, ShoppingCart, Star, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // ALL hooks must be called before any conditional returns
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

  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Show loading spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/60 shadow-md",
      in_progress: "bg-primary/20 text-primary border border-primary/60 shadow-md",
      completed: "bg-green-500/20 text-green-300 border border-green-500/60 shadow-md",
      cancelled: "bg-red-500/20 text-red-300 border border-red-500/60 shadow-md",
      disputed: "bg-accent/20 text-accent border border-accent/60 shadow-md",
    };
    return colors[status] || "bg-slate-700/50 text-slate-700 border border-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Cyberpunk Neon Header */}
      <div className="relative z-10 cyber-neon-border bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="flex justify-between items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-6xl font-extrabold mb-3 tracking-tight text-slate-900 font-bold flex items-center gap-4">
                <Zap className="h-12 w-12 text-primary animate-pulse" />
                Willkommen bei <span className="text-emerald-600">Flinkly</span>
              </h1>
              <p className="text-slate-700 text-xl font-light tracking-wide">
                Verwalte deine Gigs, Bestellungen und Verdienste
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/profile">
                <Button variant="outline" className="border-2 border-slate-600 text-slate-900 hover:border-primary hover:bg-primary/10 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
                  Profil
                </Button>
              </Link>
              <Link href="/create-gig">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-slate-900 font-bold px-8 py-3 text-lg">
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
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-2 border-slate-700 backdrop-blur-xl p-2 rounded-2xl shadow-md">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-emerald-600 hover:bg-emerald-700 text-slate-900 data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 text-slate-700 font-semibold text-lg"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="gigs" 
              className="data-[state=active]:bg-emerald-600 hover:bg-emerald-700 text-slate-900 data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 text-slate-700 font-semibold text-lg"
            >
              <Package className="h-5 w-5 mr-2" />
              Meine Gigs
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-emerald-600 hover:bg-emerald-700 text-slate-900 data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 text-slate-700 font-semibold text-lg"
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
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white border-0 shadow-xl shadow-emerald-500/10 group transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Aktive Gigs</CardTitle>
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <Package className="h-6 w-6 text-emerald-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-5xl font-black text-emerald-600 mb-2">{myGigs?.length || 0}</div>
                    <p className="text-sm text-slate-500 font-medium">
                      {myGigs?.filter((g) => g.active).length || 0} aktiv • {myGigs?.filter((g) => !g.active).length || 0} inaktiv
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Orders Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white border-0 shadow-xl shadow-orange-500/10 group transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-orange-700 uppercase tracking-wider">Bestellungen</CardTitle>
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <ShoppingCart className="h-6 w-6 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-5xl font-black text-orange-600 mb-2">
                      {(myPurchases?.length || 0) + (mySales?.length || 0)}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {myPurchases?.filter((o) => o.status === "completed").length || 0} abgeschlossen
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rating Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white border-0 shadow-xl shadow-amber-500/10 group transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wider">Bewertung</CardTitle>
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-5xl font-black text-amber-500 mb-2">4.8</div>
                    <p className="text-sm text-slate-500 font-medium">basierend auf 12 Bewertungen</p>
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
              <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white border-0 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-accent" />
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Schnellstart</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <Link href="/marketplace">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-3 group-hover:bg-emerald-500/20 transition-colors">
                        <Sparkles className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">Marktplatz erkunden</h3>
                      <p className="text-sm text-slate-500">Entdecke neue Services</p>
                    </motion.div>
                  </Link>
                  <Link href="/create-gig">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="p-3 bg-violet-500/10 rounded-xl w-fit mb-3 group-hover:bg-violet-500/20 transition-colors">
                        <Plus className="h-6 w-6 text-violet-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">Erster Gig erstellen</h3>
                      <p className="text-sm text-slate-500">Starte als Verkäufer</p>
                    </motion.div>
                  </Link>
                  <Link href="/profile">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-3 group-hover:bg-amber-500/20 transition-colors">
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">Profil bearbeiten</h3>
                      <p className="text-sm text-slate-500">Optimiere dein Profil</p>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-extrabold text-slate-900 font-bold">Meine Gigs</h2>
              <Link href="/create-gig">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-slate-900 font-bold px-8 py-4 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Neuer Gig
                </Button>
              </Link>
            </div>

            {!myGigs || myGigs.length === 0 ? (
              <Card className="bg-white shadow-sm border-2 border-slate-700/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Package className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                  <p className="text-slate-700 mb-6 text-xl font-medium">
                    Du hast noch keine Gigs erstellt
                  </p>
                  <Link href="/create-gig">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-slate-900 font-bold px-10 py-4 text-lg">
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
                    <Card className="bg-white shadow-sm border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-md">
                      <CardContent className="pt-8 pb-8">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-extrabold text-2xl mb-3 text-slate-900">{gig.title}</h3>
                            <p className="text-base text-slate-600 mb-4 leading-relaxed">
                              {gig.description.substring(0, 150)}...
                            </p>
                            <div className="flex gap-6 text-base">
                              <span className="text-orange-600 font-bold font-bold text-xl">
                                €{(gig.price / 100).toFixed(2)}
                              </span>
                              <span className="text-slate-600 font-medium">
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
                                  ? "bg-green-500/20 text-green-300 border-green-500/60 shadow-md"
                                  : "bg-slate-700/50 text-slate-700 border-slate-600"
                              }`}
                            >
                              {gig.active ? "Aktiv" : "Inaktiv"}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-2 border-slate-600 text-slate-900 hover:border-accent hover:bg-accent/10 hover:shadow-md font-semibold px-6"
                              onClick={() => setLocation(`/edit-gig/${gig.id}`)}
                            >
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
                  className="data-[state=active]:bg-emerald-600 hover:bg-emerald-700 text-slate-900 data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 text-slate-700 font-semibold text-lg"
                >
                  Meine Käufe
                </TabsTrigger>
                <TabsTrigger 
                  value="sales" 
                  className="data-[state=active]:bg-emerald-600 hover:bg-emerald-700 text-slate-900 data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 text-slate-700 font-semibold text-lg"
                >
                  Meine Verkäufe
                </TabsTrigger>
              </TabsList>

              {/* Purchases */}
              <TabsContent value="purchases" className="space-y-6 mt-8">
                {!myPurchases || myPurchases.length === 0 ? (
                  <Card className="bg-white shadow-sm border-2 border-slate-700/50">
                    <CardContent className="pt-12 pb-12 text-center">
                      <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                      <p className="text-slate-700 mb-6 text-xl font-medium">
                        Du hast noch keine Gigs gekauft
                      </p>
                      <Link href="/marketplace">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-slate-900 font-bold px-10 py-4 text-lg">
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
                      <Card className="bg-white shadow-sm border-2 border-accent/40 hover:border-accent/80 transition-all duration-500 hover:shadow-md">
                        <CardContent className="pt-8 pb-8">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold mb-3 text-slate-900 text-xl">Bestellung #{order.id}</h3>
                              <div className="space-y-2 text-base text-slate-600 font-medium">
                                <p className="text-orange-600 font-bold font-bold text-2xl">€{(order.totalPrice / 100).toFixed(2)}</p>
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
                  <Card className="bg-white shadow-sm border-2 border-slate-700/50">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Package className="h-24 w-24 mx-auto mb-6 text-slate-600" />
                      <p className="text-slate-700 mb-6 text-xl font-medium">
                        Du hast noch keine Gigs verkauft
                      </p>
                      <Link href="/create-gig">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-slate-900 font-bold px-10 py-4 text-lg">
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
                      <Card className="bg-white shadow-sm border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-md">
                        <CardContent className="pt-8 pb-8">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold mb-3 text-slate-900 text-xl">Bestellung #{order.id}</h3>
                              <div className="space-y-2 text-base text-slate-600 font-medium">
                                <p className="text-emerald-600 font-bold text-2xl">€{(order.totalPrice / 100).toFixed(2)}</p>
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
