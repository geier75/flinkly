import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Clock,
  AlertTriangle,
  Star,
  CheckCircle,
  Package,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Zap,
  Eye,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import GigViewsChart from "@/components/charts/GigViewsChart";
import RevenueChart from "@/components/charts/RevenueChart";
import ConversionRateChart from "@/components/charts/ConversionRateChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DraftCard({ gig }: { gig: any }) {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const publishGig = trpc.gigs.publish.useMutation({
    onSuccess: () => {
      toast.success("Gig veröffentlicht!");
      utils.gigs.myGigs.invalidate();
      utils.gigs.getDrafts.invalidate();
    },
    onError: () => {
      toast.error("Fehler beim Veröffentlichen");
    },
  });

  const deleteGig = trpc.gigs.delete.useMutation({
    onSuccess: () => {
      toast.success("Entwurf gelöscht");
      utils.gigs.getDrafts.invalidate();
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast.error("Fehler beim Löschen");
    },
  });

  return (
    <Card className="cyber-glass-card border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.20_35_/_0.3)]">
      <CardContent className="pt-6">
        <Badge className="mb-3 bg-orange-500/20 text-orange-400 border border-orange-500/40">
          Entwurf
        </Badge>
        <h3 className="font-bold text-white text-lg mb-2">{gig.title}</h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {gig.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black cyber-neon-orange">
            {(Number(gig.price) / 100).toFixed(2)}€
          </span>
          <Badge className="bg-slate-800/50 text-emerald-400 border border-emerald-500/30">
            {gig.category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.3)]"
            onClick={() => publishGig.mutate({ id: gig.id })}
            disabled={publishGig.isPending}
          >
            Veröffentlichen
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="cyber-glass-card border-2 border-red-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="cyber-chrome-text">Entwurf löschen?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">
                Bist du sicher, dass du den Entwurf "{gig.title}" löschen möchtest?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3">
              <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Abbrechen
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteGig.mutate({ id: gig.id })}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                disabled={deleteGig.isPending}
              >
                {deleteGig.isPending ? "Löschen..." : "Entwurf löschen"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

function GigCard({ gig }: { gig: any }) {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const utils = trpc.useUtils();
  const deleteGig = trpc.gigs.delete.useMutation({
    onSuccess: () => {
      toast.success("Gig gelöscht");
      utils.gigs.myGigs.invalidate();
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast.error("Fehler beim Löschen");
    },
  });

  return (
    <Card className="cyber-glass-card border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.70_0.25_150_/_0.3)]">
      <CardContent className="pt-6">
        <h3 className="font-bold text-white text-lg mb-2">{gig.title}</h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {gig.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black cyber-neon-orange">
            {(Number(gig.price) / 100).toFixed(2)}€
          </span>
          <Badge className="bg-slate-800/50 text-emerald-400 border border-emerald-500/30">
            {gig.category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500"
            onClick={() => setLocation(`/gig/${gig.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Bearbeiten
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="cyber-glass-card border-2 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="cyber-chrome-text">Gig löschen?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Bist du sicher, dass du das Gig "{gig.title}" löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGig.mutate({ id: gig.id })}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              disabled={deleteGig.isPending}
            >
              {deleteGig.isPending ? "Lösche..." : "Gig löschen"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("published");
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  // Analytics queries
  const { data: revenueData } = trpc.analytics.getRevenue.useQuery({ timeRange });
  const { data: performanceData } = trpc.analytics.getPerformance.useQuery();
  const { data: topGigs } = trpc.analytics.getTopGigs.useQuery({ limit: 5 });

  const { data: orders = [], isLoading } = trpc.orders.mySales.useQuery();
  const { data: gigs = [] } = trpc.gigs.myGigs.useQuery();
  const { data: drafts = [] } = trpc.gigs.getDrafts.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="max-w-md cyber-glass-card border-2 border-emerald-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-300 mb-4">Bitte melde dich an</p>
            <Button onClick={() => setLocation("/")} className="cyber-neon-button">
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 cyber-neon-green"></div>
      </div>
    );
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const onTimeRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100;
  const firstPassRate = 85;
  const disputeRate = 2;
  const avgRating = 4.8;

  // Kanban columns
  const kanbanColumns = [
    { id: "pending", title: "Neu", status: "pending", icon: Package },
    { id: "in_progress", title: "In Arbeit", status: "in_progress", icon: Clock },
    { id: "completed", title: "Abgeschlossen", status: "completed", icon: CheckCircle },
  ];

  const getOrdersByStatus = (status: string) => {
    return orders.filter((o) => o.status === status);
  };

  const getSLAWarning = (createdAt: Date | null) => {
    if (!createdAt) return null;
    const now = new Date();
    const hoursSinceCreated = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreated > 24) {
      return <Badge className="bg-red-500/20 text-red-400 border border-red-500/40">⚠️ Überfällig</Badge>;
    } else if (hoursSinceCreated > 18) {
      return <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40">⏰ Bald fällig</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Neon Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b-2 border-emerald-500/30 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-6xl font-extrabold mb-3 tracking-tight cyber-chrome-text flex items-center gap-4">
                    <TrendingUp className="h-12 w-12 text-emerald-500 animate-pulse" />
                    VERKÄUFER-<span className="cyber-neon-green">DASHBOARD</span>
                  </h1>
                  <p className="text-slate-300 text-xl font-light tracking-wide">
                    Verwalte deine <span className="cyber-neon-orange font-semibold">Gigs</span> und Aufträge
                  </p>
                </div>
                <Button 
                  onClick={() => setLocation("/create-gig")}
                  className="cyber-neon-button px-8 py-6 text-lg"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Neues Gig erstellen
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Performance Metrics */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="cyber-glass-card border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.70_0.25_150_/_0.3)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">On-Time Rate</p>
                    <p className="text-4xl font-black cyber-chrome-text">{onTimeRate}%</p>
                  </div>
                  <div className={`p-4 rounded-full ${onTimeRate >= 90 ? "bg-emerald-500/20" : "bg-orange-500/20"}`}>
                    <Clock className={`h-8 w-8 ${onTimeRate >= 90 ? "text-emerald-500 cyber-neon-green" : "text-orange-500 cyber-neon-orange"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glass-card border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.70_0.25_150_/_0.3)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">First-Pass Rate</p>
                    <p className="text-4xl font-black cyber-chrome-text">{firstPassRate}%</p>
                  </div>
                  <div className={`p-4 rounded-full ${firstPassRate >= 80 ? "bg-emerald-500/20" : "bg-orange-500/20"}`}>
                    <CheckCircle className={`h-8 w-8 ${firstPassRate >= 80 ? "text-emerald-500 cyber-neon-green" : "text-orange-500 cyber-neon-orange"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glass-card border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.20_35_/_0.3)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Dispute Rate</p>
                    <p className="text-4xl font-black cyber-chrome-text">{disputeRate}%</p>
                  </div>
                  <div className="p-4 rounded-full bg-emerald-500/20">
                    <AlertTriangle className="h-8 w-8 text-emerald-500 cyber-neon-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glass-card border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.20_35_/_0.3)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Durchschnitt</p>
                    <p className="text-4xl font-black cyber-chrome-text">{avgRating}</p>
                  </div>
                  <div className="p-4 rounded-full bg-orange-500/20">
                    <Star className="h-8 w-8 text-orange-500 cyber-neon-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 p-2">
                <TabsTrigger 
                  value="published"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.4)]"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Veröffentlicht ({gigs.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="drafts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.75_0.20_35_/_0.4)]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Entwürfe ({drafts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.4)]"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Aufträge ({orders.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.60_0.25_300_/_0.4)]"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Published Gigs Tab */}
              <TabsContent value="published">
                {gigs.length === 0 ? (
                  <Card className="cyber-glass-card border-2 border-emerald-500/30">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Package className="h-16 w-16 text-emerald-500 mx-auto mb-4 cyber-neon-green" />
                      <h3 className="text-2xl font-bold text-white mb-2">Noch keine Gigs</h3>
                      <p className="text-slate-400 mb-6">
                        Erstelle dein erstes Gig und starte durch!
                      </p>
                      <Button onClick={() => setLocation("/create-gig")} className="cyber-neon-button">
                        <Package className="h-4 w-4 mr-2" />
                        Erstes Gig erstellen
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Drafts Tab */}
              <TabsContent value="drafts">
                {drafts.length === 0 ? (
                  <Card className="cyber-glass-card border-2 border-orange-500/30">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Edit className="h-16 w-16 text-orange-500 mx-auto mb-4 cyber-neon-orange" />
                      <h3 className="text-2xl font-bold text-white mb-2">Keine Entwürfe</h3>
                      <p className="text-slate-400">
                        Alle deine Gigs sind veröffentlicht
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {drafts.map((gig) => (
                      <DraftCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="grid md:grid-cols-3 gap-6">
                  {kanbanColumns.map((column) => {
                    const columnOrders = getOrdersByStatus(column.status);
                    const Icon = column.icon;
                    
                    return (
                      <Card 
                        key={column.id} 
                        className="cyber-glass-card border-2 border-emerald-500/30"
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 cyber-chrome-text text-xl">
                            <Icon className="h-5 w-5 text-emerald-500" />
                            {column.title}
                            <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              {columnOrders.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {columnOrders.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">
                              Keine Aufträge
                            </p>
                          ) : (
                            columnOrders.map((order) => (
                              <div
                                key={order.id}
                                className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
                                onClick={() => setLocation(`/order/${order.id}`)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-white text-sm">
                                    Order #{order.id}
                                  </h4>
                                  {getSLAWarning(order.createdAt)}
                                </div>
                                <p className="text-xs text-slate-400 mb-2">
                                  Käufer: {order.buyerId}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold cyber-neon-orange">
                                    Order-Details
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(order.createdAt || "").toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                {/* Time-Range-Selector */}
                <div className="flex justify-end mb-6">
                  <Select value={timeRange} onValueChange={(value: "7" | "30" | "90") => setTimeRange(value)}>
                    <SelectTrigger className="w-40 bg-slate-900/60 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Letzte 7 Tage</SelectItem>
                      <SelectItem value="30">Letzte 30 Tage</SelectItem>
                      <SelectItem value="90">Letzte 90 Tage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stats-Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="cyber-glass-card border-2 border-purple-500/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Total-Views</p>
                          <p className="text-3xl font-bold text-white">{(topGigs?.reduce((sum, g) => sum + (g.completedOrders || 0) * 10, 0) || 0).toLocaleString()}</p>
                        </div>
                        <Eye className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cyber-glass-card border-2 border-emerald-500/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Total-Orders</p>
                          <p className="text-3xl font-bold text-white">{revenueData?.totalOrders || 0}</p>
                        </div>
                        <ShoppingCart className="h-8 w-8 text-emerald-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cyber-glass-card border-2 border-orange-500/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Total-Umsatz</p>
                          <p className="text-3xl font-bold text-white">{((revenueData?.totalRevenue || 0) / 100).toFixed(2)}€</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cyber-glass-card border-2 border-blue-500/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Conversion-Rate</p>
                          <p className="text-3xl font-bold text-white">
                            {revenueData && topGigs ? 
                              ((revenueData.totalOrders / (topGigs.reduce((sum, g) => sum + (g.completedOrders || 0) * 10, 0) || 1)) * 100).toFixed(2) 
                              : "0.00"}%
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {revenueData && <RevenueChart data={revenueData.dailyRevenue} />}
                  {topGigs && topGigs.length > 0 && (
                    <ConversionRateChart 
                      data={topGigs.map(g => ({
                        gigTitle: g.title,
                        views: (g.completedOrders || 0) * 10,
                        orders: g.completedOrders || 0,
                        conversionRate: ((g.completedOrders || 0) / ((g.completedOrders || 0) * 10 || 1)) * 100
                      }))}
                    />
                  )}
                </div>

                {/* Top-Performing-Gigs */}
                <Card className="cyber-glass-card border-2 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Top-Performing-Gigs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topGigs && topGigs.length > 0 ? (
                      <div className="space-y-4">
                        {topGigs.map((gig, index) => (
                          <div key={gig.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer" onClick={() => setLocation(`/gig/${gig.id}`)}>
                            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <span className="text-purple-500 font-bold">#{index + 1}</span>
                            </div>
                            {gig.imageUrl && (
                              <img src={gig.imageUrl} alt={gig.title} className="w-16 h-16 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{gig.title}</h4>
                              <p className="text-sm text-slate-400">
                                {gig.completedOrders} Bestellungen · {(gig.revenue / 100).toFixed(2)}€ Umsatz
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                              <span className="text-white font-semibold">{((gig.averageRating || 0) / 100).toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">Noch keine Gigs vorhanden.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
