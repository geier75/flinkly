import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, RefreshCw, FileText, FolderOpen, Plus } from "lucide-react";

interface GigExtra {
  id: number;
  extraType: "express_delivery" | "extra_revisions" | "commercial_license" | "source_files" | "custom";
  name: string;
  description: string | null;
  price: number; // in cents
  deliveryDaysReduction: number | null;
  revisionsAdded: number | null;
}

interface GigExtrasSelectorProps {
  extras: GigExtra[];
  selectedExtras: number[];
  onToggleExtra: (extraId: number) => void;
}

/**
 * GigExtrasSelector Component
 * 
 * Displays optional add-ons that can be purchased with any package
 * Examples: Express delivery, extra revisions, commercial license, source files
 * 
 * Features:
 * - Checkbox-based selection
 * - Visual icons for each extra type
 * - Price display
 * - Benefit highlights (e.g., "-2 Tage Lieferzeit")
 */
export function GigExtrasSelector({
  extras,
  selectedExtras,
  onToggleExtra,
}: GigExtrasSelectorProps) {
  const getExtraIcon = (type: string) => {
    switch (type) {
      case "express_delivery":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "extra_revisions":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case "commercial_license":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "source_files":
        return <FolderOpen className="w-5 h-5 text-purple-500" />;
      case "custom":
        return <Plus className="w-5 h-5 text-slate-500" />;
      default:
        return null;
    }
  };

  const getExtraBadge = (extra: GigExtra) => {
    if (extra.deliveryDaysReduction && extra.deliveryDaysReduction > 0) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          -{extra.deliveryDaysReduction} Tage
        </Badge>
      );
    }
    if (extra.revisionsAdded && extra.revisionsAdded > 0) {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          +{extra.revisionsAdded} Revisionen
        </Badge>
      );
    }
    return null;
  };

  if (extras.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Extras hinzufügen</h3>
        <p className="text-slate-400 text-sm">
          Erweitere dein Paket mit optionalen Add-ons für noch bessere Ergebnisse
        </p>
      </div>

      <div className="space-y-3">
        {extras.map((extra) => {
          const isSelected = selectedExtras.includes(extra.id);

          return (
            <Card
              key={extra.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-2 border-accent bg-accent/10"
                  : "border border-slate-700 bg-slate-900/40 hover:border-accent/50"
              }`}
              onClick={() => onToggleExtra(extra.id)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleExtra(extra.id)}
                  className="mt-1"
                />

                {/* Icon */}
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isSelected ? "bg-accent/20" : "bg-slate-800"
                  }`}
                >
                  {getExtraIcon(extra.extraType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white">{extra.name}</h4>
                      {getExtraBadge(extra)}
                    </div>
                    <span className="text-lg font-bold text-white whitespace-nowrap">
                      +{(extra.price / 100).toFixed(0)}€
                    </span>
                  </div>

                  {extra.description && (
                    <p className="text-sm text-slate-400">{extra.description}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Total Extras Price */}
      {selectedExtras.length > 0 && (
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">
              {selectedExtras.length} Extra{selectedExtras.length !== 1 ? "s" : ""} ausgewählt
            </span>
            <span className="text-lg font-bold text-accent">
              +
              {(
                extras
                  .filter((e) => selectedExtras.includes(e.id))
                  .reduce((sum, e) => sum + e.price, 0) / 100
              ).toFixed(0)}
              €
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
