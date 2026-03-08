import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { gigsApi, gigPackagesApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Loader2, Edit3, DollarSign, Clock, ImageIcon, Tag, FileText, AlertTriangle, Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface GigPackage {
  id?: number;
  packageType: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number; // in cents
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export default function EditGig() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const gigId = params.id ? parseInt(params.id, 10) : null;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();
  const [pricingMode, setPricingMode] = useState<'simple' | 'packages'>('simple');

  const { data: gig, isLoading } = useQuery({
    queryKey: ['gig', gigId],
    queryFn: () => gigsApi.get(gigId as number),
    enabled: !!gigId && !isNaN(gigId),
  });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    deliveryDays: 3,
    imageUrl: "",
  });

  const [packages, setPackages] = useState<GigPackage[]>([
    {
      packageType: 'basic',
      name: 'Basic',
      description: '',
      price: 5000, // 50€
      deliveryDays: 3,
      revisions: 2,
      features: [],
    },
    {
      packageType: 'standard',
      name: 'Standard',
      description: '',
      price: 10000, // 100€
      deliveryDays: 5,
      revisions: 5,
      features: [],
    },
    {
      packageType: 'premium',
      name: 'Premium',
      description: '',
      price: 20000, // 200€
      deliveryDays: 7,
      revisions: 10,
      features: [],
    },
  ]);

  useEffect(() => {
    if (gig) {
      setFormData({
        title: gig.title || "",
        description: gig.description || "",
        category: gig.category || "",
        price: Number(gig.price) / 100,
        deliveryDays: gig.deliveryDays || 3,
        imageUrl: gig.imageUrl || "",
      });

      // Load packages from gig data (gig_packages table)
      if (gig.packages && gig.packages.length > 0) {
        setPricingMode('packages');
        setPackages(gig.packages.map((p: any) => ({
          id: p.id,
          packageType: p.packageType,
          name: p.name,
          description: p.description || '',
          price: p.price,
          deliveryDays: p.deliveryDays,
          revisions: p.revisions ?? 2,
          features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : [],
        })));
      }
    }
  }, [gig]);

  const updateGig = useMutation({
    mutationFn: (data: any) => gigsApi.update(data.id, data),
    onSuccess: () => {
      toast.success("Gig erfolgreich aktualisiert!");
      queryClient.invalidateQueries({ queryKey: ['myGigs'] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const deleteGig = useMutation({
    mutationFn: (id: number) => gigsApi.delete(id),
    onSuccess: () => {
      toast.success("Gig erfolgreich gelöscht!");
      queryClient.invalidateQueries({ queryKey: ['myGigs'] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast.error(`Fehler beim Löschen: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border border-slate-700 p-8 text-center">
          <CardContent>
            <p className="text-white mb-4">Bitte melde dich an</p>
            <Button onClick={() => setLocation("/login")}>Zur Anmeldung</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gigId || !gig) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border border-slate-700 p-8 text-center">
          <CardContent>
            <p className="text-white mb-4">Gig nicht gefunden</p>
            <Button onClick={() => setLocation("/dashboard")}>Zurück zum Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pricingMode === 'simple') {
      // Simple pricing mode
      const priceInCents = Math.round(formData.price * 100);
      if (priceInCents < 100) {
        toast.error("Preis muss mindestens 1€ betragen");
        return;
      }
      
      updateGig.mutate({
        id: gigId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: priceInCents,
        deliveryDays: formData.deliveryDays,
        imageUrl: formData.imageUrl || "",
      });
    } else {
      // Package pricing mode - upsert all 3 packages
      const existingPackages: Record<string, number> = {};
      if (gig?.packages) {
        for (const p of gig.packages as any[]) {
          existingPackages[p.packageType] = p.id;
        }
      }
      for (const pkg of packages) {
        const featuresArray = Array.isArray(pkg.features) ? pkg.features : [];
        const existingId = existingPackages[pkg.packageType];
        if (existingId) {
          await gigPackagesApi.update(existingId, {
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            deliveryDays: pkg.deliveryDays,
            revisions: pkg.revisions,
            features: featuresArray,
          });
        } else {
          await gigPackagesApi.create({
            gigId: gigId as number,
            packageType: pkg.packageType,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            deliveryDays: pkg.deliveryDays,
            revisions: pkg.revisions,
            features: featuresArray,
          });
        }
      }
      toast.success("Pakete erfolgreich gespeichert!");
      queryClient.invalidateQueries({ queryKey: ['gig', gigId] });
      setLocation("/dashboard");
    }
  };

  const handleDelete = () => {
    if (gigId) deleteGig.mutate(gigId);
  };

  const categories = [
    { value: "design", label: "Design" },
    { value: "writing", label: "Texterstellung" },
    { value: "marketing", label: "Marketing" },
    { value: "development", label: "Entwicklung" },
    { value: "video", label: "Video & Animation" },
    { value: "music", label: "Musik & Audio" },
    { value: "business", label: "Business" },
    { value: "lifestyle", label: "Lifestyle" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            className="mb-4 text-slate-400 hover:text-white hover:bg-white/10"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Dashboard
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gig bearbeiten</h1>
              <p className="text-slate-400 mt-1">Aktualisiere dein Angebot</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Titel
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    minLength={5}
                    maxLength={255}
                    placeholder="z.B. Professionelles Logo-Design"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 h-12 text-lg"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Beschreibung
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    minLength={20}
                    rows={6}
                    placeholder="Beschreibe deine Dienstleistung im Detail..."
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 text-base"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-500" />
                    Kategorie
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full h-12 px-4 bg-slate-900/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="" className="bg-slate-800">Kategorie wählen</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-slate-800">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Mode Toggle */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald-500" />
                    Preisgestaltung
                  </Label>
                  <Tabs value={pricingMode} onValueChange={(v) => setPricingMode(v as 'simple' | 'packages')}>
                    <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                      <TabsTrigger value="simple">Einzelpreis</TabsTrigger>
                      <TabsTrigger value="packages">3 Pakete (nach Migration)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="simple" className="space-y-6 mt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-white font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            Preis (€)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            required
                            min={1}
                            max={250}
                            step={0.01}
                            placeholder="z.B. 50"
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 h-12 text-lg"
                          />
                          <p className="text-xs text-slate-500">Max. 250€ (Micro-Gigs)</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deliveryDays" className="text-white font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-500" />
                            Lieferzeit (Tage)
                          </Label>
                          <Input
                            id="deliveryDays"
                            type="number"
                            value={formData.deliveryDays}
                            onChange={(e) => setFormData({ ...formData, deliveryDays: parseInt(e.target.value) || 1 })}
                            required
                            min={1}
                            max={30}
                            placeholder="z.B. 3"
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 h-12 text-lg"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="packages" className="mt-6">
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-amber-200 text-sm">
                          ⚠️ Paket-Bearbeitung wird verfügbar, sobald die Migration ausgeführt wurde.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-white font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-emerald-500" />
                    Bild-URL (optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 h-12"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <Button
                    type="submit"
                    disabled={updateGig.isPending}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 h-12 text-lg font-semibold"
                  >
                    {updateGig.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Speichert...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Änderungen speichern
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 h-12"
                  >
                    Abbrechen
                  </Button>
                </div>

                {/* Delete Button */}
                <div className="pt-6 border-t border-slate-700">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">Gefahrenzone</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Das Löschen eines Gigs ist endgültig und kann nicht rückgängig gemacht werden.
                        </p>
                        {!showDeleteConfirm ? (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Gig löschen
                          </Button>
                        ) : (
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={deleteGig.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteGig.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Löscht...
                                </>
                              ) : (
                                "Ja, endgültig löschen"
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(false)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              Abbrechen
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
