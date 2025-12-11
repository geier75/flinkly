import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, HelpCircle, ArrowLeft, Send, Clock, Phone } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission via tRPC
    toast.success("Nachricht gesendet! Wir melden uns in Kürze bei dir.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl shadow-blue-500/30">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Kontakt</h1>
                <p className="text-slate-400 mt-1">Wir sind für dich da – schreib uns!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl h-full hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">E-Mail Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-4">
                  Schreib uns eine E-Mail und wir antworten innerhalb von 24 Stunden.
                </p>
                <a href="mailto:support@mimitechai.com" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  support@mimitechai.com
                </a>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl h-full hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
              <CardHeader className="pb-2">
                <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-4">
                  <MessageSquare className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-4">
                  Mo-Fr 9:00-18:00 Uhr stehen wir dir im Live Chat zur Verfügung.
                </p>
                <Button variant="outline" className="w-full border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded-xl">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat starten
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl h-full hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardHeader className="pb-2">
                <div className="p-3 bg-violet-500/10 rounded-xl w-fit mb-4">
                  <HelpCircle className="h-8 w-8 text-violet-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-4">
                  Viele Antworten findest du bereits in unseren häufig gestellten Fragen.
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="w-full border-violet-200 hover:border-violet-300 hover:bg-violet-50 text-violet-700 rounded-xl">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Zum FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
          <Card className="relative overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Send className="h-5 w-5 text-emerald-600" />
                </div>
                Kontaktformular
              </CardTitle>
              <p className="text-slate-500">
                Fülle das Formular aus und wir melden uns schnellstmöglich bei dir.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dein Name"
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="deine@email.de"
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700 font-medium">Betreff *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Worum geht es?"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-medium">Nachricht *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Beschreibe dein Anliegen..."
                    rows={6}
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                  <Send className="h-5 w-5 mr-2" />
                  Nachricht senden
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Weitere Informationen</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Geschäftszeiten</h3>
              <p className="text-sm text-slate-600">
                Montag - Freitag: 9:00 - 18:00 Uhr<br />
                Samstag - Sonntag: Geschlossen
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Antwortzeit</h3>
              <p className="text-sm text-slate-600">
                E-Mail: Innerhalb von 24 Stunden<br />
                Live Chat: Sofort (während Geschäftszeiten)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

