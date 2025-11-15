import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CheckCircle,
  FileText,
  DollarSign,
  Settings,
  Eye,
  Clock,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoScene } from "@/components/webgl/VideoScene";
import { PopOutLogo } from "@/components/3d/PopOutLogo";

export default function CreateGig() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryDays: "3",
    imageUrl: "",
  });

  const createGigMutation = trpc.gigs.create.useMutation({
    onSuccess: () => {
      toast.success("✓ Gig erfolgreich erstellt!", {
        description: `Dein Gig "${formData.title}" wurde gespeichert.`,
        duration: 3000,
      });
      setTimeout(() => {
        setLocation(`/seller-dashboard`);
      }, 1500);
    },
    onError: (error) => {
      let errorMessage = "Bitte versuche es später erneut.";
      
      if (error.message.includes("title")) {
        errorMessage = "Bitte gib einen gültigen Titel ein (10-100 Zeichen).";
      } else if (error.message.includes("price")) {
        errorMessage = "Preis muss zwischen 10€ und 250€ liegen.";
      } else if (error.message.includes("description")) {
        errorMessage = "Beschreibung muss mindestens 50 Zeichen lang sein.";
      } else if (error.message.includes("category")) {
        errorMessage = "Bitte wähle eine Kategorie aus.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error("✗ Fehler beim Erstellen des Gigs", {
        description: errorMessage,
        duration: 4000,
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 mb-4">Bitte melde dich an</p>
            <Button onClick={() => setLocation("/")}>Zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { id: 1, title: "Grundlagen", icon: FileText },
    { id: 2, title: "Preisgestaltung", icon: DollarSign },
    { id: 3, title: "Details", icon: Settings },
  ];

  const categories = [
    { value: "design", label: "Design & Kreation" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
    { value: "content", label: "Content & Text" },
    { value: "business", label: "Business" },
    { value: "tech", label: "Technologie" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || formData.title.length < 10) {
      toast.error("Titel muss mindestens 10 Zeichen lang sein");
      return;
    }
    if (!formData.description || formData.description.length < 50) {
      toast.error("Beschreibung muss mindestens 50 Zeichen lang sein");
      return;
    }
    if (!formData.category) {
      toast.error("Bitte wähle eine Kategorie");
      return;
    }
    const price = parseInt(formData.price);
    if (!price || price < 10 || price > 250) {
      toast.error("Preis muss zwischen 10€ und 250€ liegen");
      return;
    }

    await createGigMutation.mutateAsync({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: price,
      deliveryDays: parseInt(formData.deliveryDays),
      imageUrl: formData.imageUrl || undefined,
    });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.title.length >= 10 && formData.description.length >= 50 && formData.category;
    }
    if (currentStep === 2) {
      const price = parseInt(formData.price);
      return price >= 10 && price <= 250;
    }
    return true;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* 4K Video Background */}
      <VideoScene
        videoSrc="/videos/create-gig-flinkly.mp4"
        className="fixed inset-0 w-full h-full"
        opacity={0.2}
        brightness={1.4}
        contrast={1.3}
        saturation={1.3}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/60 via-slate-900/80 to-slate-950/90 pointer-events-none" />

      {/* 3D Pop-Out Logo */}
      <PopOutLogo 
        className="top-32 left-24 z-20" 
        size={140} 
        delay={0.8}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 60px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)",
            }}
          >
            ERSTELLE DEIN GIG
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Teile deine Expertise mit tausenden Kunden. Erstelle dein erstes Gig in nur 3 Schritten.
          </p>

          {/* Premium Badge */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-success/20 border border-success/30 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-success" />
            <span className="text-success font-semibold text-sm">
              Premium-Seller-Programm
            </span>
          </motion.div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-accent to-primary shadow-lg shadow-accent/30 border-2 border-accent"
                          : isCompleted
                          ? "bg-success shadow-lg shadow-success/30 border-2 border-success"
                          : "bg-slate-800/50 border-2 border-slate-700/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-400"}`} />
                      )}
                    </motion.div>
                    <span className={`text-sm font-medium ${isActive ? "text-primary" : isCompleted ? "text-success" : "text-slate-400"}`}>
                      {step.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mb-8 transition-all duration-300 ${
                      isCompleted ? "bg-success" : "bg-slate-700/50"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content - 2 Columns */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit}>
              <Card className="bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl shadow-slate-900/50">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Grundlagen */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="w-6 h-6 text-primary" />
                          <h2 className="text-2xl font-bold text-white">Grundlagen</h2>
                        </div>

                        {/* Gig-Titel */}
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-slate-200 font-medium">
                            Gig-Titel <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="z.B. Ich erstelle ein professionelles Logo für dein Startup"
                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            maxLength={80}
                          />
                          <p className="text-sm text-slate-400">
                            {formData.title.length}/80 Zeichen
                          </p>
                        </div>

                        {/* Beschreibung */}
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-slate-200 font-medium">
                            Beschreibung <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Beschreibe dein Gig so detailliert wie möglich..."
                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all min-h-[200px]"
                          />
                          <p className="text-sm text-slate-400">
                            Mindestens 20 Zeichen (aktuell: {formData.description.length})
                          </p>
                        </div>

                        {/* Kategorie */}
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-slate-200 font-medium">
                            Kategorie <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-accent focus:ring-2 focus:ring-accent/20">
                              <SelectValue placeholder="Wähle eine Kategorie" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Preisgestaltung */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <DollarSign className="w-6 h-6 text-primary" />
                          <h2 className="text-2xl font-bold text-white">Preisgestaltung</h2>
                        </div>

                        {/* Preis */}
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-slate-200 font-medium">
                            Preis <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="price"
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              placeholder="299"
                              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all pl-8"
                              min="10"
                              max="250"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              €
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Empfohlener Preisbereich: 50€ - 200€
                          </p>
                        </div>

                        {/* Lieferzeit */}
                        <div className="space-y-2">
                          <Label htmlFor="deliveryDays" className="text-slate-200 font-medium">
                            Lieferzeit
                          </Label>
                          <Select
                            value={formData.deliveryDays}
                            onValueChange={(value) => setFormData({ ...formData, deliveryDays: value })}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-accent focus:ring-2 focus:ring-accent/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="1" className="text-white hover:bg-slate-700">1 Tag</SelectItem>
                              <SelectItem value="3" className="text-white hover:bg-slate-700">3 Tage</SelectItem>
                              <SelectItem value="7" className="text-white hover:bg-slate-700">7 Tage</SelectItem>
                              <SelectItem value="14" className="text-white hover:bg-slate-700">14 Tage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Pricing Info Card */}
                        <Card className="bg-accent/10 border-accent/30">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-primary mb-1">
                                  Premium-Tipp
                                </p>
                                <p className="text-sm text-slate-300">
                                  Gigs zwischen 100€ und 200€ haben die höchste Conversion-Rate. Biete mehrere Pakete an für mehr Flexibilität.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Step 3: Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <Settings className="w-6 h-6 text-primary" />
                          <h2 className="text-2xl font-bold text-white">Details</h2>
                        </div>

                        {/* Bild-URL */}
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl" className="text-slate-200 font-medium">
                            Bild-URL (optional)
                          </Label>
                          <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                          <p className="text-sm text-slate-400">
                            Füge ein Bild hinzu, um dein Gig attraktiver zu machen
                          </p>
                        </div>

                        {/* Summary Card */}
                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Zusammenfassung</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Titel:</span>
                                <span className="text-white font-medium">{formData.title || "—"}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Kategorie:</span>
                                <span className="text-white font-medium">
                                  {categories.find(c => c.value === formData.category)?.label || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Preis:</span>
                                <span className="text-white font-medium">{formData.price ? `${formData.price}€` : "—"}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Lieferzeit:</span>
                                <span className="text-white font-medium">{formData.deliveryDays} Tage</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700/50">
                    <Button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Zurück
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 disabled:opacity-50"
                      >
                        Weiter
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Button
                          type="submit"
                          disabled={createGigMutation.isPending || !canProceed()}
                          className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30 disabled:opacity-50"
                        >
                          {createGigMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Wird erstellt...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Gig erstellen
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>

          {/* Live Preview Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <Card className="bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl shadow-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-white">Live-Vorschau</h3>
                  </div>

                  {/* Preview Card */}
                  <div className="space-y-4">
                    {/* Image */}
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Gig preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-800/50 rounded-lg flex items-center justify-center">
                        <p className="text-slate-500 text-sm">Kein Bild</p>
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="text-xl font-bold text-white line-clamp-2">
                      {formData.title || "Dein Gig-Titel"}
                    </h4>

                    {/* Description */}
                    <p className="text-slate-400 text-sm line-clamp-3">
                      {formData.description || "Deine Beschreibung erscheint hier..."}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Star className="w-4 h-4 text-success fill-success" />
                        <span>5.0</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4 text-success" />
                        <span>{formData.deliveryDays} Tage</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Preis</span>
                        <span className="text-3xl font-black text-white">
                          {formData.price ? `${formData.price}€` : "0€"}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Button className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30">
                        Jetzt buchen
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
