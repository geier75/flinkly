// @ts-nocheck
import { useState, useEffect } from "react";
import { gigsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, RefreshCw, FileText, FolderOpen } from "lucide-react";

interface GigExtrasCardProps {
  gigId: number;
  onExtrasChange: (selectedIds: number[], total: number) => void;
}

const EXTRA_ICONS = {
  express_delivery: Zap,
  extra_revisions: RefreshCw,
  commercial_license: FileText,
  source_files: FolderOpen,
  custom: FileText,
};

export default function GigExtrasCard({ gigId, onExtrasChange }: GigExtrasCardProps) {
  const { data: extras } = useQuery({
    queryKey: ['gigExtras', gigId],
    queryFn: () => gigsApi.getExtras(gigId),
    enabled: !!gigId,
  });
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  useEffect(() => {
    if (!extras) return;
    const total = extras
      .filter((e) => selectedExtras.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0);
    onExtrasChange(selectedExtras, total / 100); // Convert cents to euros
  }, [selectedExtras, extras, onExtrasChange]);

  if (!extras || extras.length === 0) {
    return null; // Don't show card if no extras available
  }

  const toggleExtra = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Extras hinzufügen</h3>
        <p className="text-sm text-slate-400 mb-4">
          Erweitere dein Paket mit zusätzlichen Leistungen
        </p>

        <div className="space-y-3">
          {extras.map((extra) => {
            const Icon = EXTRA_ICONS[extra.extraType] || FileText;
            const isSelected = selectedExtras.includes(extra.id);
            
            return (
              <div
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                    : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleExtra(extra.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-bold text-white">{extra.name}</span>
                  </div>
                  {extra.description && (
                    <p className="text-sm text-slate-400 mb-2">{extra.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    {(extra.deliveryDaysReduction ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {extra.deliveryDaysReduction ?? 0} Tage schneller
                      </span>
                    )}
                    {(extra.revisionsAdded ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        +{extra.revisionsAdded ?? 0} Revisionen
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">
                    +{(extra.price / 100).toFixed(0)}€
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedExtras.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Extras gesamt:</span>
              <span className="text-xl font-bold text-primary">
                +{(
                  extras
                    .filter((e) => selectedExtras.includes(e.id))
                    .reduce((sum, e) => sum + e.price, 0) / 100
                ).toFixed(0)}€
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
