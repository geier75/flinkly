import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Package } from "lucide-react";

type PackageData = {
  name: string;
  description: string;
  price: string;
  deliveryDays: string;
  revisions: string;
  features: string[];
};

type PackagesData = {
  basic: PackageData;
  standard: PackageData;
  premium: PackageData;
};

interface PackagePricingFormProps {
  packages: PackagesData;
  setPackages: (packages: PackagesData) => void;
}

export function PackagePricingForm({ packages, setPackages }: PackagePricingFormProps) {
  const updatePackage = (tier: keyof PackagesData, field: keyof PackageData, value: string | string[]) => {
    setPackages({
      ...packages,
      [tier]: {
        ...packages[tier],
        [field]: value,
      },
    });
  };

  const addFeature = (tier: keyof PackagesData) => {
    const currentFeatures = packages[tier].features;
    updatePackage(tier, 'features', [...currentFeatures, '']);
  };

  const removeFeature = (tier: keyof PackagesData, index: number) => {
    const currentFeatures = packages[tier].features;
    updatePackage(tier, 'features', currentFeatures.filter((_, i) => i !== index));
  };

  const updateFeature = (tier: keyof PackagesData, index: number, value: string) => {
    const currentFeatures = [...packages[tier].features];
    currentFeatures[index] = value;
    updatePackage(tier, 'features', currentFeatures);
  };

  const renderPackageForm = (tier: keyof PackagesData, icon: string, color: string) => {
    const pkg = packages[tier];
    
    return (
      <Card key={tier} className={`bg-slate-800/50 border-${color}-500/30`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className={`w-5 h-5 text-${color}-400`} />
            <span className="text-white">{pkg.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor={`${tier}-name`} className="text-slate-200">
              Paket-Name
            </Label>
            <Input
              id={`${tier}-name`}
              value={pkg.name}
              onChange={(e) => updatePackage(tier, 'name', e.target.value)}
              placeholder="z.B. Basic Logo"
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor={`${tier}-description`} className="text-slate-200">
              Beschreibung
            </Label>
            <Textarea
              id={`${tier}-description`}
              value={pkg.description}
              onChange={(e) => updatePackage(tier, 'description', e.target.value)}
              placeholder="Was ist in diesem Paket enthalten?"
              className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor={`${tier}-price`} className="text-slate-200">
              Preis (€)
            </Label>
            <div className="relative">
              <Input
                id={`${tier}-price`}
                type="number"
                value={pkg.price}
                onChange={(e) => updatePackage(tier, 'price', e.target.value)}
                placeholder={tier === 'basic' ? '50' : tier === 'standard' ? '100' : '200'}
                className="bg-slate-900/50 border-slate-700 text-white pl-8"
                min="10"
                max="500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
            </div>
          </div>

          {/* Delivery Days */}
          <div className="space-y-2">
            <Label htmlFor={`${tier}-delivery`} className="text-slate-200">
              Lieferzeit (Tage)
            </Label>
            <Input
              id={`${tier}-delivery`}
              type="number"
              value={pkg.deliveryDays}
              onChange={(e) => updatePackage(tier, 'deliveryDays', e.target.value)}
              placeholder="3"
              className="bg-slate-900/50 border-slate-700 text-white"
              min="1"
              max="30"
            />
          </div>

          {/* Revisions */}
          <div className="space-y-2">
            <Label htmlFor={`${tier}-revisions`} className="text-slate-200">
              Revisionen
            </Label>
            <Input
              id={`${tier}-revisions`}
              type="number"
              value={pkg.revisions}
              onChange={(e) => updatePackage(tier, 'revisions', e.target.value)}
              placeholder="2"
              className="bg-slate-900/50 border-slate-700 text-white"
              min="0"
              max="999"
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label className="text-slate-200">Features</Label>
            {pkg.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(tier, index, e.target.value)}
                  placeholder="z.B. Quelldateien inklusive"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
                {pkg.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(tier, index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFeature(tier)}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Feature hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {renderPackageForm('basic', '📦', 'blue')}
        {renderPackageForm('standard', '⭐', 'purple')}
        {renderPackageForm('premium', '👑', 'amber')}
      </div>
    </div>
  );
}
