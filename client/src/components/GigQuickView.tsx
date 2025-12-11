import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, X } from "lucide-react";
import { Link } from "wouter";

interface GigQuickViewProps {
  gig: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    deliveryDays: number;
    imageUrl?: string | null;
    averageRating?: number | null;
    completedOrders?: number | null;
  };
  open: boolean;
  onClose: () => void;
}

/**
 * Quick-View-Modal für Marketplace-Gig-Cards
 * 
 * Features:
 * - Image + Title + Description + Pricing
 * - CTA-Button → GigDetail-Page
 * - Close-Button + ESC-Key-Handler + Backdrop-Click
 * - Smooth-Open/Close-Animation (Framer-Motion via Dialog)
 */
export default function GigQuickView({ gig, open, onClose }: GigQuickViewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900/95 border-2 border-slate-700/50 backdrop-blur-xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-5 w-5 text-white" />
          <span className="sr-only">Close</span>
        </button>

        {/* Image */}
        {gig.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden rounded-lg -mt-6 -mx-6 mb-4">
            <img
              src={gig.imageUrl}
              alt={gig.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/20 text-primary border-primary/40">
              {gig.category}
            </Badge>
            {gig.averageRating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-success fill-success" />
                <span className="text-white font-semibold">
                  {Number(gig.averageRating).toFixed(1)}
                </span>
                <span className="text-slate-400">
                  ({gig.completedOrders || 0})
                </span>
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {gig.title}
          </DialogTitle>
        </DialogHeader>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed line-clamp-4">
            {gig.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-y border-slate-700/50">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <span className="text-slate-300">
                {gig.deliveryDays} Tage Lieferzeit
              </span>
            </div>
            <div>
              <span className="text-3xl font-black text-white">
                {(gig.price / 100).toFixed(0)}€
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link href={`/gig/${gig.id}`} className="flex-1">
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/30"
              >
                Details ansehen
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={onClose}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700"
            >
              Schließen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
