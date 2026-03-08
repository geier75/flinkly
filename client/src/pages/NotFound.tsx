import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.70_0.25_150_/_0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.70_0.25_150_/_0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
      <motion.div className="relative z-10 text-center px-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <motion.div className="relative mb-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <span className="text-[9rem] md:text-[12rem] font-black leading-none bg-gradient-to-br from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent select-none">404</span>
          <div className="absolute inset-0 text-[9rem] md:text-[12rem] font-black leading-none text-emerald-500/20 blur-2xl select-none">404</div>
        </motion.div>
        <motion.h1 className="text-2xl md:text-3xl font-bold text-white mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>Seite nicht gefunden</motion.h1>
        <motion.p className="text-slate-400 text-lg mb-10 leading-relaxed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          Die gesuchte Seite existiert nicht oder wurde verschoben.
          <br className="hidden sm:block" />
          Vielleicht findest du, was du suchst, auf unserer Startseite.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Button onClick={() => setLocation("/")} size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-xl shadow-[0_0_24px_oklch(0.70_0.25_150_/_0.4)] hover:shadow-[0_0_32px_oklch(0.70_0.25_150_/_0.6)] transition-all duration-200 gap-2"><Home className="w-5 h-5" />Zur Startseite</Button>
          <Button onClick={() => setLocation("/marketplace")} variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 px-8 py-3 rounded-xl transition-all duration-200 gap-2"><Search className="w-5 h-5" />Marketplace erkunden</Button>
        </motion.div>
        <motion.button onClick={() => window.history.back()} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors duration-200 mx-auto text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}><ArrowLeft className="w-4 h-4" />Zurueck zur vorherigen Seite</motion.button>
      </motion.div>
    </div>
  );
}
