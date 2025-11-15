import { useAuth } from "@/_core/hooks/useAuth";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Plus, Package, ShoppingCart, Star } from "lucide-react";
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
      pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
      in_progress: "bg-accent/20 text-accent border border-accent/40",
      completed: "bg-green-500/20 text-green-300 border border-green-500/40",
      cancelled: "bg-red-500/20 text-red-300 border border-red-500/40",
      disputed: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
    };
    return colors[status] || "bg-slate-700/50 text-slate-300 border border-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header with Cyberpunk Neon Border */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b-2 border-transparent bg-gradient-to-r from-accent via-primary to-purple-500 bg-clip-border" style={{backgroundClip: 'border-box', borderImage: 'linear-gradient(90deg, rgb(249 115 22), rgb(20 184 166), rgb(168 85 247)) 1'}}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight" style={{textShadow: '0 0 20px rgba(249, 115, 22, 0.5)'}}>
                Willkommen, {user?.name || "Nutzer"}!
              </h1>
              <p className="text-slate-300 text-lg">
                Verwalte deine Gigs, Bestellungen und Verdienste
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/profile">
                <Button variant="outline" className="border-slate-600 text-white hover:border-accent hover:bg-accent/10 transition-all">Profil</Button>
              </Link>
                <Link href="/create-gig">
                  <Button className="gap-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/30 border border-accent/50 transition-all hover:scale-105">
                    <Plus className="h-4 w-4" />
                    Neuer Gig
                  </Button>
                </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white">Übersicht</TabsTrigger>
            <TabsTrigger value="gigs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white">Meine Gigs</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white">Bestellungen</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-accent/80 backdrop-blur-xl group transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Aktive Gigs</CardTitle>
                  <Package className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{myGigs?.length || 0}</div>
                  <p className="text-xs text-slate-400">
                    {myGigs?.filter((g) => g.active).length || 0} aktiv
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-primary/80 backdrop-blur-xl group transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Bestellungen</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {(myPurchases?.length || 0) + (mySales?.length || 0)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {myPurchases?.filter((o) => o.status === "completed").length || 0} abgeschlossen
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-yellow-500/80 backdrop-blur-xl group transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Bewertung</CardTitle>
                  <Star className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">4.8</div>
                  <p className="text-xs text-slate-400">basierend auf 12 Bewertungen</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Schnellstart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-white hover:border-accent hover:bg-accent/10 transition-all">
                    Marketplace erkunden
                  </Button>
                </Link>
                <Link href="/create-gig">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-white hover:border-accent hover:bg-accent/10 transition-all">
                    Erstes Gig erstellen
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-white hover:border-accent hover:bg-accent/10 transition-all">
                  Profil bearbeiten
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Meine Gigs</h2>
              <Link href="/create-gig">
                <Button className="gap-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/30 border border-accent/50 transition-all hover:scale-105">
                  <Plus className="h-4 w-4" />
                  Neuer Gig
                </Button>
              </Link>
            </div>

            {!myGigs || myGigs.length === 0 ? (
              <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-300 mb-4">
                    Du hast noch keine Gigs erstellt
                  </p>
                  <Link href="/create-gig">
                    <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/30">Erstes Gig erstellen</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myGigs.map((gig) => (
                  <Card key={gig.id} className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-accent/80 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-white">{gig.title}</h3>
                          <p className="text-sm text-slate-400 mb-3">
                            {gig.description.substring(0, 100)}...
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-accent font-semibold">
                              €{(gig.price / 100).toFixed(2)}
                            </span>
                            <span className="text-slate-400">
                              {gig.completedOrders} Bestellungen
                            </span>
                            {gig.averageRating && (
                              <span className="text-yellow-500">
                                ⭐ {parseFloat(gig.averageRating.toString()).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              gig.active
                                ? "bg-green-500/20 text-green-300 border-green-500/40"
                                : "bg-slate-700/50 text-slate-300 border-slate-600"
                            }`}
                          >
                            {gig.active ? "Aktiv" : "Inaktiv"}
                          </span>
                          <Button variant="outline" size="sm" className="border-slate-600 text-white hover:border-accent hover:bg-accent/10">
                            Bearbeiten
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Tabs defaultValue="purchases" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
                <TabsTrigger value="purchases" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white">Meine Käufe</TabsTrigger>
                <TabsTrigger value="sales" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white">Meine Verkäufe</TabsTrigger>
              </TabsList>

              {/* Purchases */}
              <TabsContent value="purchases" className="space-y-4 mt-6">
                {!myPurchases || myPurchases.length === 0 ? (
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="pt-6 text-center">
                      <p className="text-slate-300 mb-4">
                        Du hast noch keine Gigs gekauft
                      </p>
                      <Link href="/marketplace">
                        <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/30">Marketplace erkunden</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  myPurchases.map((order) => (
                    <Card key={order.id} className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-primary/80 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold mb-2 text-white">Bestellung {order.id}</h3>
                            <div className="space-y-1 text-sm text-slate-400">
                              <p className="text-accent font-semibold">€{(order.totalPrice / 100).toFixed(2)}</p>
                              <p>Erstellt: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("de-DE") : "N/A"}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status || "pending")}`}>
                            {order.status === "pending" && "Ausstehend"}
                            {order.status === "in_progress" && "In Bearbeitung"}
                            {order.status === "completed" && "Abgeschlossen"}
                            {order.status === "cancelled" && "Storniert"}
                            {order.status === "disputed" && "Umstritten"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Sales */}
              <TabsContent value="sales" className="space-y-4 mt-6">
                {!mySales || mySales.length === 0 ? (
                  <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
                    <CardContent className="pt-6 text-center">
                      <p className="text-slate-300 mb-4">
                        Du hast noch keine Gigs verkauft
                      </p>
                      <Link href="/create-gig">
                        <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/30">Gig erstellen</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  mySales.map((order) => (
                    <Card key={order.id} className="bg-slate-900/40 border-2 border-slate-700/50 hover:border-primary/80 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold mb-2 text-white">Bestellung {order.id}</h3>
                            <div className="space-y-1 text-sm text-slate-400">
                              <p className="text-accent font-semibold">€{(order.totalPrice / 100).toFixed(2)}</p>
                              <p>Erstellt: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("de-DE") : "N/A"}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status || "pending")}`}>
                            {order.status === "pending" && "Ausstehend"}
                            {order.status === "in_progress" && "In Bearbeitung"}
                            {order.status === "completed" && "Abgeschlossen"}
                            {order.status === "cancelled" && "Storniert"}
                            {order.status === "disputed" && "Umstritten"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
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
