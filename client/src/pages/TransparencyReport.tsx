import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BarChart3, 
  ArrowLeft,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Scale,
  Download,
  Calendar,
  Globe
} from "lucide-react";

/**
 * Transparenzbericht
 * 
 * Gemäß:
 * - DSA Art. 15: Transparenzberichtspflichten für Anbieter von Vermittlungsdiensten
 * - DSA Art. 24: Zusätzliche Transparenzpflichten für Online-Plattformen
 * - P2B Art. 11 Abs. 4: Jährlicher Bericht über Beschwerdemanagement
 * 
 * Inhalte:
 * - Inhaltsmoderation und Meldungen
 * - Beschwerdestatistiken
 * - Automatisierte Entscheidungen
 * - Nutzerzahlen
 */

export default function TransparencyReport() {
  // Mock data - in production, this would come from the database
  const reportData = {
    period: "2024",
    publishDate: "31. März 2025",
    
    // DSA Content Moderation
    contentModeration: {
      totalReports: 127,
      byCategory: {
        illegalContent: 23,
        intellectualProperty: 45,
        fraud: 31,
        harassment: 18,
        other: 10
      },
      actionsTaken: {
        removed: 67,
        restricted: 12,
        noAction: 48
      },
      averageResponseTime: "18 Stunden",
      appealsFiled: 15,
      appealsSuccessful: 4
    },
    
    // P2B Complaints
    sellerComplaints: {
      total: 34,
      byCategory: {
        ranking: 8,
        accountRestriction: 6,
        accountSuspension: 4,
        agbInterpretation: 5,
        technicalIssues: 7,
        paymentIssues: 3,
        other: 1
      },
      resolved: 31,
      pending: 3,
      averageResolutionTime: "9 Tage",
      mediationRequested: 2
    },
    
    // Platform Statistics
    platformStats: {
      activeUsers: "12.500+",
      activeSellers: "2.100+",
      gigsListed: "8.400+",
      ordersCompleted: "15.200+",
      countriesServed: 27
    },
    
    // Automated Decisions
    automatedDecisions: {
      fraudDetection: 156,
      spamFiltering: 892,
      contentFiltering: 234,
      humanReviewRate: "100% bei Kontosperrungen"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Startseite
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <BarChart3 className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Transparenzbericht {reportData.period}</h1>
              <p className="text-slate-400">
                Gemäß DSA Art. 15, 24 und P2B Art. 11
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Veröffentlicht: {reportData.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Berichtszeitraum: Januar - Dezember {reportData.period}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border-emerald-500/30">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Zusammenfassung</h2>
                <p className="text-slate-300 mb-4">
                  Dieser Transparenzbericht dokumentiert unsere Maßnahmen zur Inhaltsmoderation, 
                  unser Beschwerdemanagement für gewerbliche Nutzer sowie relevante Plattformstatistiken 
                  für das Jahr {reportData.period}.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-400">{reportData.contentModeration.totalReports}</p>
                    <p className="text-xs text-slate-400">Inhaltsmeldungen</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">{reportData.sellerComplaints.total}</p>
                    <p className="text-xs text-slate-400">Verkäufer-Beschwerden</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">{reportData.platformStats.activeSellers}</p>
                    <p className="text-xs text-slate-400">Aktive Verkäufer</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-400">{reportData.platformStats.ordersCompleted}</p>
                    <p className="text-xs text-slate-400">Abgeschl. Aufträge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* DSA Content Moderation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  1. Inhaltsmoderation (DSA Art. 15)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300">
                  Übersicht über eingegangene Meldungen und ergriffene Maßnahmen gemäß 
                  Digital Services Act.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Reports by Category */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-4">Meldungen nach Kategorie</h4>
                    <div className="space-y-3">
                      {Object.entries(reportData.contentModeration.byCategory).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          illegalContent: "Illegale Inhalte",
                          intellectualProperty: "Urheberrechtsverletzungen",
                          fraud: "Betrug/Täuschung",
                          harassment: "Belästigung",
                          other: "Sonstige"
                        };
                        const total = reportData.contentModeration.totalReports;
                        const percentage = Math.round((value / total) * 100);
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">{labels[key]}</span>
                              <span className="text-slate-400">{value} ({percentage}%)</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Taken */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-4">Ergriffene Maßnahmen</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <span className="text-slate-300">Entfernt</span>
                        </div>
                        <span className="text-xl font-bold text-red-400">
                          {reportData.contentModeration.actionsTaken.removed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-400" />
                          <span className="text-slate-300">Eingeschränkt</span>
                        </div>
                        <span className="text-xl font-bold text-amber-400">
                          {reportData.contentModeration.actionsTaken.restricted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-slate-400" />
                          <span className="text-slate-300">Keine Maßnahme</span>
                        </div>
                        <span className="text-xl font-bold text-slate-400">
                          {reportData.contentModeration.actionsTaken.noAction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time & Appeals */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {reportData.contentModeration.averageResponseTime}
                    </p>
                    <p className="text-xs text-slate-400">Ø Reaktionszeit</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Scale className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-400">
                      {reportData.contentModeration.appealsFiled}
                    </p>
                    <p className="text-xs text-slate-400">Einsprüche eingereicht</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-400">
                      {reportData.contentModeration.appealsSuccessful}
                    </p>
                    <p className="text-xs text-slate-400">Erfolgreiche Einsprüche</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* P2B Seller Complaints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                  2. Verkäufer-Beschwerden (P2B Art. 11)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300">
                  Statistiken zum internen Beschwerdemanagementsystem für gewerbliche Nutzer 
                  gemäß Platform-to-Business Verordnung.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Complaints by Category */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-4">Beschwerden nach Kategorie</h4>
                    <div className="space-y-3">
                      {Object.entries(reportData.sellerComplaints.byCategory).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          ranking: "Ranking-Entscheidungen",
                          accountRestriction: "Kontoeinschränkung",
                          accountSuspension: "Kontosperrung",
                          agbInterpretation: "AGB-Auslegung",
                          technicalIssues: "Technische Probleme",
                          paymentIssues: "Zahlungsprobleme",
                          other: "Sonstige"
                        };
                        const total = reportData.sellerComplaints.total;
                        const percentage = Math.round((value / total) * 100);
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">{labels[key]}</span>
                              <span className="text-slate-400">{value} ({percentage}%)</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resolution Stats */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-4">Bearbeitungsstatistik</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <span className="text-slate-300">Abgeschlossen</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-400">
                          {reportData.sellerComplaints.resolved}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-400" />
                          <span className="text-slate-300">In Bearbeitung</span>
                        </div>
                        <span className="text-xl font-bold text-amber-400">
                          {reportData.sellerComplaints.pending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-2">
                          <Scale className="h-5 w-5 text-blue-400" />
                          <span className="text-slate-300">Mediation beantragt</span>
                        </div>
                        <span className="text-xl font-bold text-blue-400">
                          {reportData.sellerComplaints.mediationRequested}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-400">
                        {reportData.sellerComplaints.averageResolutionTime}
                      </p>
                      <p className="text-xs text-slate-400">Ø Bearbeitungszeit</p>
                    </div>
                    <div className="flex-1 text-sm text-slate-300">
                      <p>
                        Die durchschnittliche Bearbeitungszeit liegt deutlich unter der 
                        gesetzlichen Frist von 14 Tagen. Wir sind bestrebt, alle Beschwerden 
                        so schnell wie möglich zu bearbeiten.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  3. Plattformstatistiken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-400">
                      {reportData.platformStats.activeUsers}
                    </p>
                    <p className="text-xs text-slate-400">Aktive Nutzer</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-400">
                      {reportData.platformStats.activeSellers}
                    </p>
                    <p className="text-xs text-slate-400">Aktive Verkäufer</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <FileText className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-400">
                      {reportData.platformStats.gigsListed}
                    </p>
                    <p className="text-xs text-slate-400">Gigs gelistet</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <CheckCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-400">
                      {reportData.platformStats.ordersCompleted}
                    </p>
                    <p className="text-xs text-slate-400">Aufträge abgeschl.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {reportData.platformStats.countriesServed}
                    </p>
                    <p className="text-xs text-slate-400">EU-Länder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Automated Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-amber-400" />
                  4. Automatisierte Entscheidungen (DSA Art. 15)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Übersicht über den Einsatz automatisierter Systeme zur Inhaltsmoderation.
                </p>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-amber-400">
                      {reportData.automatedDecisions.fraudDetection}
                    </p>
                    <p className="text-xs text-slate-400">Betrugserkennung</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-amber-400">
                      {reportData.automatedDecisions.spamFiltering}
                    </p>
                    <p className="text-xs text-slate-400">Spam-Filterung</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-amber-400">
                      {reportData.automatedDecisions.contentFiltering}
                    </p>
                    <p className="text-xs text-slate-400">Inhaltsfilterung</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
                    <p className="text-lg font-bold text-emerald-400">
                      {reportData.automatedDecisions.humanReviewRate}
                    </p>
                    <p className="text-xs text-slate-400">Menschliche Prüfung</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400">
                    <strong className="text-white">Hinweis:</strong> Alle automatisierten Entscheidungen, 
                    die zu einer Kontosperrung oder erheblichen Einschränkung führen können, werden 
                    vor Umsetzung von einem Menschen überprüft. Nutzer haben das Recht, gegen 
                    automatisierte Entscheidungen Einspruch einzulegen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Download & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Vollständiger Bericht
                    </h3>
                    <p className="text-sm text-slate-300">
                      Laden Sie den vollständigen Transparenzbericht als PDF herunter.
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Download className="h-4 w-4 mr-2" />
                    PDF herunterladen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Info */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
            <p>Transparenzbericht {reportData.period} | Veröffentlicht: {reportData.publishDate}</p>
            <p className="mt-1">
              Rechtsgrundlagen: DSA (EU) 2022/2065 Art. 15, 24 | P2B (EU) 2019/1150 Art. 11
            </p>
            <p className="mt-2">
              <Link href="/p2b-transparency" className="text-primary hover:underline">
                P2B-Transparenz
              </Link>
              {" | "}
              <Link href="/report" className="text-primary hover:underline">
                Inhalt melden
              </Link>
              {" | "}
              <Link href="/seller-complaint" className="text-primary hover:underline">
                Beschwerde einreichen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
