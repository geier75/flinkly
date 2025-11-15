/**
 * GigPreview Component
 * 
 * Live preview of gig during creation
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Shield } from "lucide-react";

interface GigPreviewProps {
  title: string;
  description: string;
  category: string;
  price: string;
  deliveryDays: string;
  imageUrl: string;
  imageAlt: string;
}

export function GigPreview({
  title,
  description,
  category,
  price,
  deliveryDays,
  imageUrl,
  imageAlt,
}: GigPreviewProps) {
  return (
    <div className="sticky top-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Live-Vorschau</h3>
        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
          Preview
        </Badge>
      </div>

      <Card className="bg-slate-900/60 border-slate-700/50 overflow-hidden">
        {/* Image */}
        {imageUrl ? (
          <div className="relative h-48 bg-slate-800">
            <img
              src={imageUrl}
              alt={imageAlt || "Gig preview"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-slate-800 flex items-center justify-center">
            <p className="text-slate-500 text-sm">Kein Bild hochgeladen</p>
          </div>
        )}

        <CardHeader>
          {/* Category Badge */}
          {category && (
            <Badge className="w-fit mb-2 bg-primary/20 text-primary border-primary/40">
              {category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {title || "Dein Gig-Titel erscheint hier..."}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-slate-300 text-sm line-clamp-3">
            {description || "Deine Gig-Beschreibung erscheint hier..."}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryDays || "3"} Tage</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>Neu</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Verifiziert</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div>
              <p className="text-xs text-slate-400">Ab</p>
              <p className="text-2xl font-bold text-white">
                {price ? `${price}€` : "0€"}
              </p>
            </div>
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600">
              Projekt starten
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SEO Score Widget */}
      <Card className="mt-4 bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <h4 className="text-sm font-bold text-white">SEO-Score</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Title Length */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Titel-Länge</span>
                <span className={
                  title.length >= 10 && title.length <= 100
                    ? "text-emerald-400"
                    : "text-orange-400"
                }>
                  {title.length}/100
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    title.length >= 10 && title.length <= 100
                      ? "bg-emerald-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min((title.length / 100) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Description Length */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Beschreibung</span>
                <span className={
                  description.length >= 50
                    ? "text-emerald-400"
                    : "text-orange-400"
                }>
                  {description.length}/500
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    description.length >= 50
                      ? "bg-emerald-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min((description.length / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Overall Score */}
            <div className="pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Gesamt-Score</span>
                <span className={`text-lg font-bold ${
                  title.length >= 10 && description.length >= 50 && category && price
                    ? "text-emerald-400"
                    : "text-orange-400"
                }`}>
                  {[
                    title.length >= 10 && title.length <= 100,
                    description.length >= 50,
                    category,
                    price,
                  ].filter(Boolean).length * 25}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Calculator */}
      <Card className="mt-4 bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <h4 className="text-sm font-bold text-white">Pricing-Calculator</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Dein Preis:</span>
              <span className="text-white font-medium">{price || "0"}€</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Plattform-Gebühr (15%):</span>
              <span className="text-orange-400 font-medium">
                -{(parseFloat(price || "0") * 0.15).toFixed(2)}€
              </span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-700/50">
              <span className="font-bold text-white">Du erhältst:</span>
              <span className="text-emerald-400 font-bold text-lg">
                {(parseFloat(price || "0") * 0.85).toFixed(2)}€
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
