import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CheckCircle, Shield, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/const";

interface GigCardProps {
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
    sellerId: number;
    sellerLevel?: "new" | "rising" | "pro" | "top" | null;
    sellerVerified?: boolean | null;
  };
}

export default function GigCard({ gig }: GigCardProps) {
  const rating = gig.averageRating ? gig.averageRating / 100 : 0;
  const orders = gig.completedOrders || 0;

  // Trust-Cue: Seller-Level-Badge
  const getSellerLevelBadge = () => {
    if (!gig.sellerLevel) return null;
    
    const levelConfig = {
      new: { icon: null, label: "Neu", color: "bg-slate-100 text-slate-700" },
      rising: { icon: TrendingUp, label: "Rising Star", color: "bg-blue-100 text-blue-700" },
      pro: { icon: Award, label: "Pro", color: "bg-purple-100 text-purple-700" },
      top: { icon: Shield, label: "Top Seller", color: "bg-yellow-100 text-yellow-700" },
    };

    const config = levelConfig[gig.sellerLevel];
    const Icon = config.icon;

    return (
      <Badge className={`absolute top-2 left-2 ${config.color} font-semibold text-xs px-2 py-1 flex items-center gap-1`}>
        {Icon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  // Trust-Cue: High-Demand-Indicator
  const isHighDemand = orders >= 10;
  const isPopular = orders >= 5 && rating >= 4.5;

  return (
    <Link href={`/gig/${gig.id}`}>
      <Card className="gig-card cursor-pointer h-full flex flex-col hover:shadow-xl transition-all duration-300 group">
        <div className="relative overflow-hidden">
          {gig.imageUrl ? (
            <img 
              src={gig.imageUrl} 
              alt={gig.title}
              className="gig-card-image group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="gig-card-image bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-4xl">🎨</span>
            </div>
          )}
          
          {/* Trust-Cue: Seller-Level-Badge */}
          {getSellerLevelBadge()}
          
          {/* Trust-Cue: Category-Badge */}
          <Badge className="absolute top-2 right-2 bg-white/95 text-foreground backdrop-blur-sm font-medium">
            {gig.category}
          </Badge>

          {/* Trust-Cue: High-Demand-Indicator */}
          {isHighDemand && (
            <Badge className="absolute bottom-2 left-2 bg-red-500 text-white font-semibold text-xs px-2 py-1 flex items-center gap-1 animate-pulse">
              🔥 Hohe Nachfrage
            </Badge>
          )}

          {/* Trust-Cue: Popular-Indicator */}
          {isPopular && !isHighDemand && (
            <Badge className="absolute bottom-2 left-2 bg-green-500 text-white font-semibold text-xs px-2 py-1 flex items-center gap-1">
              ⭐ Beliebt
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {gig.title}
          </h3>
        </CardHeader>
        
        <CardContent className="flex-1 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {gig.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-4 border-t">
          {/* Trust-Cues: Rating + Orders + Verified */}
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-3">
              {rating > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-xs">({orders})</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Noch keine Bewertungen</span>
              )}
              
              {/* Trust-Cue: Verified-Badge */}
              {gig.sellerVerified && (
                <div className="flex items-center gap-1 text-green-600" title="Verifizierter Seller">
                  <CheckCircle className="h-4 w-4 fill-green-600" />
                  <span className="text-xs font-medium">Verifiziert</span>
                </div>
              )}
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">{gig.deliveryDays}d</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">Ab</span>
            <div className="price-display-small font-bold text-lg">
              {formatPrice(gig.price)}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
