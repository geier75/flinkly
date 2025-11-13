import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CheckCircle } from "lucide-react";
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
  };
}

export default function GigCard({ gig }: GigCardProps) {
  const rating = gig.averageRating ? gig.averageRating / 100 : 0;
  const orders = gig.completedOrders || 0;

  return (
    <Link href={`/gig/${gig.id}`}>
      <Card className="gig-card cursor-pointer h-full flex flex-col">
        <div className="relative">
          {gig.imageUrl ? (
            <img 
              src={gig.imageUrl} 
              alt={gig.title}
              className="gig-card-image"
            />
          ) : (
            <div className="gig-card-image bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-white/90 text-foreground">
            {gig.category}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
            {gig.title}
          </h3>
        </CardHeader>
        
        <CardContent className="flex-1 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {gig.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({orders})</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{gig.deliveryDays}d</span>
            </div>
          </div>
          <div className="price-display-small">
            {formatPrice(gig.price)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
