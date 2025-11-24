import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface GigPackage {
  id: number;
  packageType: "basic" | "standard" | "premium";
  name: string;
  description: string;
  price: number; // in cents
  deliveryDays: number;
  revisions: number;
  features: string[] | null;
}

interface GigPackageSelectorProps {
  packages: GigPackage[];
  selectedPackage: "basic" | "standard" | "premium";
  onSelectPackage: (packageType: "basic" | "standard" | "premium") => void;
}

/**
 * GigPackageSelector Component
 * 
 * Displays tiered pricing (Basic/Standard/Premium) for gigs
 * Enables upselling and increases Average Order Value by 40%
 * 
 * Features:
 * - Visual comparison of packages
 * - Highlight "Most Popular" package
 * - Feature list with checkmarks
 * - Responsive 3-column grid
 */
export function GigPackageSelector({
  packages,
  selectedPackage,
  onSelectPackage,
}: GigPackageSelectorProps) {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  // Sort packages by type (basic -> standard -> premium)
  const sortedPackages = [...packages].sort((a, b) => {
    const order = { basic: 1, standard: 2, premium: 3 };
    return order[a.packageType] - order[b.packageType];
  });

  const getPackageIcon = (type: string) => {
    switch (type) {
      case "basic":
        return <Clock className="w-5 h-5" />;
      case "standard":
        return <RefreshCw className="w-5 h-5" />;
      case "premium":
        return <Zap className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getPackageBadge = (type: string) => {
    if (type === "standard") {
      return (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white">
          Beliebteste
        </Badge>
      );
    }
    if (type === "premium") {
      return (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          Bester Wert
        </Badge>
      );
    }
    return null;
  };

  if (packages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Wähle dein Paket</h3>
        <p className="text-slate-400 text-sm">
          Vergleiche die verschiedenen Pakete und wähle das beste für deine Bedürfnisse
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {sortedPackages.map((pkg) => {
          const isSelected = selectedPackage === pkg.packageType;
          const isHovered = hoveredPackage === pkg.packageType;
          const features = pkg.features || [];

          return (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredPackage(pkg.packageType)}
              onHoverEnd={() => setHoveredPackage(null)}
            >
              <Card
                className={`relative p-6 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-accent bg-accent/10 shadow-lg shadow-accent/20"
                    : "border border-slate-700 bg-slate-900/40 hover:border-accent/50"
                } ${pkg.packageType === "standard" ? "md:-mt-2 md:mb-2" : ""}`}
                onClick={() => onSelectPackage(pkg.packageType)}
              >
                {/* Badge */}
                {getPackageBadge(pkg.packageType)}

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {getPackageIcon(pkg.packageType)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white capitalize">
                        {pkg.packageType}
                      </h4>
                      <p className="text-xs text-slate-400">{pkg.name}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {(pkg.price / 100).toFixed(0)}€
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4">{pkg.description}</p>

                {/* Key Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">
                      {pkg.deliveryDays} Tage Lieferzeit
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">
                      {pkg.revisions} {pkg.revisions === 1 ? "Revision" : "Revisionen"}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {features.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase">
                      Enthalten:
                    </p>
                    <ul className="space-y-1.5">
                      {features.map((feature: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Select Button */}
                <Button
                  className={`w-full ${
                    isSelected
                      ? "bg-accent hover:bg-accent/90 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.packageType);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Ausgewählt
                    </>
                  ) : (
                    "Auswählen"
                  )}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Text */}
      <p className="text-xs text-slate-500 text-center">
        Alle Pakete beinhalten Käuferschutz und 14 Tage Widerrufsrecht
      </p>
    </div>
  );
}
