import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { gigsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Loader2, Edit3, DollarSign, Clock, ImageIcon, Tag, FileText, AlertTriangle } from "lucide-react";

export default function EditGig() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const gigId = params.id ? parseInt(params.id, 10) : null;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

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
    }
  }, [gig]);

  const updateGig = useMutation({
    mutationFn: (data: { id: number; title: string; description: string; category: string; price: number; deliveryDays: number; imageUrl: string }) => 
      gigsApi.update(data.id, { title: data.title, description: data.description, category: data.category, price: data.price, deliveryDays: data.deliveryDays, imageUrl: data.imageUrl }),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGig.mutate({
      id: gigId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: Math.round(formData.price * 100),
      deliveryDays: formData.deliveryDays,
      imageUrl: formData.imageUrl || "",
    });
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
                    placeholder="https://example.com/image.jpg"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 h-12"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700">
                  <Button
                    type="submit"
                    disabled={updateGig.isPending}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg"
                  >
                    {updateGig.isPending ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Speichern...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-2" />
                        Änderungen speichern
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    className="h-12 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-red-950/20 border border-red-500/30 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Gefahrenzone</h3>
                  <p className="text-slate-400 mb-4">
                    Das Löschen eines Gigs kann nicht rückgängig gemacht werden.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Gig löschen
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteGig.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {deleteGig.isPending ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Löschen...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Ja, endgültig löschen
                          </span>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Abbrechen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

