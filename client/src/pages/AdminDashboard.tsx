import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Users, 
  Package, 
  AlertTriangle,
  TrendingUp,
  FileText,
  DollarSign,
  Search,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Download,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Mock platform stats
  const platformStats = {
    totalUsers: 1247,
    activeGigs: 342,
    totalOrders: 1893,
    totalRevenue: 94650,
    disputeRate: 3.2,
    avgRating: 4.6,
    newUsersToday: 23,
    ordersToday: 47,
  };

  // Mock pending moderation items
  const [pendingGigs] = useState([
    {
      id: "1",
      title: "Logo Design Premium",
      seller: "Anna Designer",
      price: 250,
      status: "pending",
      flagged: false,
      createdAt: new Date("2025-10-20"),
    },
    {
      id: "2",
      title: "SEO Optimization",
      seller: "Max Marketing",
      price: 180,
      status: "pending",
      flagged: true,
      flagReason: "Verdächtige Keywords",
      createdAt: new Date("2025-10-20"),
    },
  ]);

  // Mock disputes
  const [disputes] = useState([
    {
      id: "1",
      orderId: "ORD-123",
      gigTitle: "Logo Design",
      buyer: "Peter K.",
      seller: "Anna D.",
      reason: "Lieferung entspricht nicht dem Briefing",
      status: "open",
      createdAt: new Date("2025-10-19"),
      priority: "high",
    },
    {
      id: "2",
      orderId: "ORD-124",
      gigTitle: "Social Media Bundle",
      buyer: "Maria S.",
      seller: "Tom M.",
      reason: "Verspätete Lieferung",
      status: "in_mediation",
      createdAt: new Date("2025-10-18"),
      priority: "medium",
    },
  ]);

  // Mock compliance reports
  const [complianceReports] = useState([
    {
      id: "1",
      type: "AVV",
      count: 234,
      status: "archived",
    },
    {
      id: "2",
      type: "Rechnungen",
      count: 1893,
      status: "ready",
    },
    {
      id: "3",
      type: "Umsatzreport DE",
      count: 1247,
      status: "ready",
    },
  ]);

  const handleApproveGig = (gigId: string) => {
    toast.success("Gig genehmigt!");
    // TODO: Implement via tRPC
  };

  const handleRejectGig = (gigId: string) => {
    toast.error("Gig abgelehnt!");
    // TODO: Implement via tRPC
  };

  const handleResolveDispute = (disputeId: string, resolution: string) => {
    toast.success(`Streitfall gelöst: ${resolution}`);
    // TODO: Implement via tRPC
  };

  const handleExportReport = (reportType: string) => {
    toast.info(`Export wird vorbereitet: ${reportType}`);
    // TODO: Implement via tRPC
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="max-w-md cyber-glass-card border-2 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="cyber-chrome-text">Anmeldung erforderlich</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Bitte melde dich an, um auf das Admin-Dashboard zuzugreifen.
            </p>
            <Button onClick={() => setLocation("/")} className="cyber-neon-button">
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="max-w-md cyber-glass-card border-2 border-red-500/30">
          <CardHeader>
            <CardTitle className="cyber-chrome-text">Zugriff verweigert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Du hast keine Berechtigung, auf das Admin-Dashboard zuzugreifen.
            </p>
            <Button onClick={() => setLocation("/")} className="cyber-neon-button">
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    <Shield className="h-12 w-12 text-emerald-500 animate-pulse" />
                    ADMIN <span className="cyber-neon-green">BACKOFFICE</span>
                  </h1>
                  <p className="text-slate-300 text-xl font-light tracking-wide">
                    Plattform-Management & <span className="cyber-neon-orange font-semibold">Compliance</span>
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white px-6 py-3 text-lg shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.4)] border-0">
                  <Shield className="h-5 w-5 mr-2" />
                  Administrator
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Platform Overview */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 cyber-chrome-text">
              PLATTFORM-<span className="cyber-neon-green">ÜBERSICHT</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="cyber-glass-card border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.70_0.25_150_/_0.3)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gesamt-Nutzer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black cyber-chrome-text">
                        {platformStats.totalUsers.toLocaleString()}
                      </p>
                      <p className="text-xs cyber-neon-green mt-2 font-semibold">
                        +{platformStats.newUsersToday} heute
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-emerald-500 cyber-neon-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-glass-card border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.70_0.25_150_/_0.3)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Aktive Gigs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black cyber-chrome-text">
                        {platformStats.activeGigs}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {pendingGigs.length} warten auf Freigabe
                      </p>
                    </div>
                    <Package className="h-10 w-10 text-emerald-500 cyber-neon-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-glass-card border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.20_35_/_0.3)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gesamt-Umsatz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black cyber-chrome-text">
                        {platformStats.totalRevenue.toLocaleString()}€
                      </p>
                      <p className="text-xs cyber-neon-orange mt-2 font-semibold">
                        +{platformStats.ordersToday} Bestellungen heute
                      </p>
                    </div>
                    <DollarSign className="h-10 w-10 text-orange-500 cyber-neon-orange" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-glass-card border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.20_35_/_0.3)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Dispute Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black cyber-chrome-text">
                        {platformStats.disputeRate}%
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {disputes.length} aktive Streitfälle
                      </p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-orange-500 cyber-neon-orange" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="moderation" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 p-2">
                <TabsTrigger 
                  value="moderation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.4)]"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Moderation
                </TabsTrigger>
                <TabsTrigger 
                  value="disputes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.75_0.20_35_/_0.4)]"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Streitfälle ({disputes.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="compliance"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.4)]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_oklch(0.75_0.20_35_/_0.4)]"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Moderation Tab */}
              <TabsContent value="moderation" className="space-y-6">
                <Card className="cyber-glass-card border-2 border-emerald-500/30">
                  <CardHeader>
                    <CardTitle className="cyber-chrome-text text-2xl">GIG-<span className="cyber-neon-green">MODERATION</span></CardTitle>
                    <div className="flex gap-2 mt-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Gigs durchsuchen..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.3)]"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingGigs.map((gig) => (
                        <div
                          key={gig.id}
                          className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                                {gig.flagged && (
                                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/40">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Gemeldet
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm mb-1">
                                Seller: <span className="text-emerald-400 font-semibold">{gig.seller}</span>
                              </p>
                              <p className="text-slate-400 text-sm">
                                Preis: <span className="cyber-neon-orange font-bold">{gig.price}€</span>
                              </p>
                              {gig.flagged && gig.flagReason && (
                                <p className="text-red-400 text-sm mt-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                                  Grund: {gig.flagReason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApproveGig(gig.id)}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.3)] hover:shadow-[0_0_30px_oklch(0.70_0.25_150_/_0.5)] transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Genehmigen
                            </Button>
                            <Button
                              onClick={() => handleRejectGig(gig.id)}
                              variant="outline"
                              className="flex-1 border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Ablehnen
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Disputes Tab */}
              <TabsContent value="disputes" className="space-y-6">
                <Card className="cyber-glass-card border-2 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="cyber-chrome-text text-2xl">STREIT<span className="cyber-neon-orange">FÄLLE</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {disputes.map((dispute) => (
                        <div
                          key={dispute.id}
                          className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{dispute.gigTitle}</h3>
                                <Badge className={
                                  dispute.priority === "high" 
                                    ? "bg-red-500/20 text-red-400 border border-red-500/40" 
                                    : "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                }>
                                  {dispute.priority === "high" ? "Hohe Priorität" : "Mittlere Priorität"}
                                </Badge>
                                <Badge className={
                                  dispute.status === "open"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                                }>
                                  {dispute.status === "open" ? "Offen" : "In Mediation"}
                                </Badge>
                              </div>
                              <p className="text-slate-400 text-sm mb-1">
                                Order-ID: <span className="text-emerald-400 font-mono">{dispute.orderId}</span>
                              </p>
                              <p className="text-slate-400 text-sm mb-1">
                                Käufer: <span className="text-white font-semibold">{dispute.buyer}</span> vs. Seller: <span className="text-white font-semibold">{dispute.seller}</span>
                              </p>
                              <p className="text-slate-300 text-sm mt-3 bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50">
                                <span className="text-orange-400 font-semibold">Grund:</span> {dispute.reason}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleResolveDispute(dispute.id, "Käufer")}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.3)] transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Für Käufer
                            </Button>
                            <Button
                              onClick={() => handleResolveDispute(dispute.id, "Seller")}
                              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_0_20px_oklch(0.75_0.20_35_/_0.3)] transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Für Seller
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <Card className="cyber-glass-card border-2 border-emerald-500/30">
                  <CardHeader>
                    <CardTitle className="cyber-chrome-text text-2xl">COMPLIANCE-<span className="cyber-neon-green">REPORTS</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{report.type}</h3>
                              <p className="text-slate-400 text-sm">
                                Anzahl: <span className="cyber-neon-orange font-bold">{report.count.toLocaleString()}</span>
                              </p>
                              <Badge className={
                                report.status === "ready"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mt-2"
                                  : "bg-slate-500/20 text-slate-400 border border-slate-500/40 mt-2"
                              }>
                                {report.status === "ready" ? "Bereit" : "Archiviert"}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => handleExportReport(report.type)}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_0_20px_oklch(0.70_0.25_150_/_0.3)] transition-all duration-300"
                              disabled={report.status !== "ready"}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportieren
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <Card className="cyber-glass-card border-2 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="cyber-chrome-text text-2xl">PLATTFORM-<span className="cyber-neon-orange">ANALYTICS</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white">Durchschnittsbewertung</h3>
                          <TrendingUp className="h-6 w-6 text-emerald-500" />
                        </div>
                        <p className="text-5xl font-black cyber-chrome-text">{platformStats.avgRating}</p>
                        <p className="text-slate-400 text-sm mt-2">von 5.0 Sternen</p>
                      </div>

                      <div className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white">Gesamt-Bestellungen</h3>
                          <Package className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-5xl font-black cyber-chrome-text">{platformStats.totalOrders.toLocaleString()}</p>
                        <p className="text-slate-400 text-sm mt-2">Alle Zeiten</p>
                      </div>

                      <div className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 md:col-span-2">
                        <div className="text-center py-12">
                          <Zap className="h-16 w-16 text-emerald-500 mx-auto mb-4 cyber-neon-green" />
                          <h3 className="text-2xl font-bold text-white mb-2">Analytics-Dashboard</h3>
                          <p className="text-slate-400">
                            Erweiterte Analytics werden bald verfügbar sein
                          </p>
                        </div>
                      </div>
                    </div>
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
