import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  ArrowLeft,
  Lock,
  Server,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle,
  Globe,
  Database,
  FileText,
  Users,
  Clock,
  Fingerprint,
  ShieldCheck,
  Bug
} from "lucide-react";

/**
 * Sicherheitsrichtlinien-Seite
 * 
 * Dokumentiert technische und organisatorische Maßnahmen (TOMs)
 * gemäß Art. 32 DSGVO
 * 
 * Inhalte:
 * - Verschlüsselung
 * - Zugriffskontrolle
 * - Datensicherung
 * - Incident Response
 * - Responsible Disclosure
 */

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link href="/privacy">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Datenschutzerklärung
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sicherheitsrichtlinien</h1>
              <p className="text-slate-400">
                Technische und organisatorische Maßnahmen (Art. 32 DSGVO)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border-emerald-500/30">
              <CardContent className="p-6">
                <p className="text-slate-300">
                  Flinkly implementiert umfassende technische und organisatorische Maßnahmen (TOMs) 
                  zum Schutz Ihrer personenbezogenen Daten gemäß Art. 32 DSGVO. Diese Seite 
                  dokumentiert unsere Sicherheitsmaßnahmen transparent.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Encryption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Lock className="h-6 w-6 text-emerald-400" />
                  1. Verschlüsselung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-400" />
                      Transport-Verschlüsselung
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        TLS 1.3 für alle Verbindungen
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        HSTS (HTTP Strict Transport Security)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Perfect Forward Secrecy (PFS)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Certificate Transparency
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4 text-emerald-400" />
                      Datenspeicher-Verschlüsselung
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        AES-256 für Datenbank-Verschlüsselung
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Verschlüsselte Backups
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Sichere Schlüsselverwaltung (KMS)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Passwort-Hashing (bcrypt/Argon2)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Access Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Key className="h-6 w-6 text-blue-400" />
                  2. Zugriffskontrolle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-blue-400" />
                      Authentifizierung
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Sichere Passwort-Anforderungen
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Zwei-Faktor-Authentifizierung (2FA) optional
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        JWT-basierte Session-Verwaltung
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Automatische Session-Timeouts
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Autorisierung
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Rollenbasierte Zugriffskontrolle (RBAC)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Prinzip der minimalen Rechte
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Regelmäßige Zugriffsüberprüfungen
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Audit-Logs für alle Zugriffe
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Infrastructure Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Server className="h-6 w-6 text-purple-400" />
                  3. Infrastruktur-Sicherheit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Hosting</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• EU-Rechenzentren (Frankfurt)</li>
                      <li>• ISO 27001 zertifiziert</li>
                      <li>• SOC 2 Type II</li>
                      <li>• Redundante Systeme</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Netzwerk</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Web Application Firewall</li>
                      <li>• DDoS-Schutz</li>
                      <li>• Intrusion Detection</li>
                      <li>• Rate Limiting</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Monitoring</h4>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• 24/7 Überwachung</li>
                      <li>• Anomalie-Erkennung</li>
                      <li>• Automatische Alerts</li>
                      <li>• Performance-Monitoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Database className="h-6 w-6 text-amber-400" />
                  4. Datensicherung & Wiederherstellung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Backup-Strategie</h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Tägliche automatische Backups
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Point-in-Time Recovery (PITR)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Geo-redundante Speicherung
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        30 Tage Aufbewahrung
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Disaster Recovery</h4>
                    <ul className="text-sm space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        RTO: 4 Stunden
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        RPO: 1 Stunde
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Regelmäßige DR-Tests
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        Dokumentierter Notfallplan
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Incident Response */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  5. Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Im Falle eines Sicherheitsvorfalls folgen wir einem strukturierten 
                  Incident-Response-Prozess:
                </p>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">1</div>
                    <p className="text-sm font-medium text-white">Erkennung</p>
                    <p className="text-xs text-slate-400 mt-1">Automatisierte Alerts</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 text-center">
                    <div className="text-2xl font-bold text-amber-400 mb-1">2</div>
                    <p className="text-sm font-medium text-white">Eindämmung</p>
                    <p className="text-xs text-slate-400 mt-1">Sofortige Isolation</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
                    <p className="text-sm font-medium text-white">Behebung</p>
                    <p className="text-xs text-slate-400 mt-1">Root Cause Analysis</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">4</div>
                    <p className="text-sm font-medium text-white">Nachbereitung</p>
                    <p className="text-xs text-slate-400 mt-1">Lessons Learned</p>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-300">Meldepflicht (Art. 33 DSGVO)</p>
                      <p className="text-sm text-slate-300 mt-1">
                        Bei Datenschutzverletzungen informieren wir die zuständige Aufsichtsbehörde 
                        innerhalb von 72 Stunden. Betroffene Personen werden unverzüglich informiert, 
                        wenn ein hohes Risiko für ihre Rechte besteht.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Responsible Disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Bug className="h-6 w-6 text-purple-400" />
                  6. Responsible Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Wir schätzen die Arbeit von Sicherheitsforschern und bieten ein 
                  Responsible Disclosure Programm an.
                </p>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-3">Sicherheitslücke melden</h4>
                  <p className="text-sm text-slate-300 mb-4">
                    Wenn Sie eine Sicherheitslücke entdeckt haben, kontaktieren Sie uns bitte:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong className="text-white">E-Mail:</strong>{" "}
                      <a href="mailto:security@mimitechai.com" className="text-purple-400 hover:underline">
                        security@mimitechai.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-white">PGP-Key:</strong>{" "}
                      <span className="text-slate-400">Auf Anfrage verfügbar</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Unsere Zusagen</h4>
                  <ul className="text-sm space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      Bestätigung des Eingangs innerhalb von 24 Stunden
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      Keine rechtlichen Schritte bei verantwortungsvoller Offenlegung
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      Regelmäßige Updates zum Behebungsstatus
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      Anerkennung in unserer Hall of Fame (optional)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  7. Compliance & Zertifizierungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">DSGVO</p>
                    <p className="text-xs text-slate-400">Vollständig konform</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <Lock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">PCI-DSS</p>
                    <p className="text-xs text-slate-400">Via Stripe</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">DSA</p>
                    <p className="text-xs text-slate-400">Vollständig konform</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Fragen zur Sicherheit?
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Kontaktieren Sie unser Security-Team für Fragen zu unseren 
                      Sicherheitsmaßnahmen.
                    </p>
                    <a href="mailto:security@mimitechai.com">
                      <Button className="bg-primary hover:bg-primary/90">
                        security@mimitechai.com
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Info */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
            <p>Stand: Dezember 2024 | Version 1.0</p>
            <p className="mt-1">
              Rechtsgrundlage: Art. 32 DSGVO - Sicherheit der Verarbeitung
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
