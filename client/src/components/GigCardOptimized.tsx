/**
 * Optimized Gig Card Component
 * 
 * Verbesserungen 2025:
 * - Trust-Cues (Badges, Ratings, Completed Orders)
 * - Hover-States (Micro-Interactions)
 * - Performance (Lazy-Loading Images)
 * - Accessibility (ARIA, Semantic HTML)
 * - Conversion-Optimierung (Clear CTAs)
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'wouter';
import { formatPrice } from '@/const';
import { fadeInUp } from '@/hooks/useScrollAnimation';

interface GigCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  category: string;
  seller: {
    name: string;
    image?: string;
    isVerified?: boolean;
    level?: 'new' | 'rising' | 'pro' | 'top';
  };
  stats: {
    rating: number;
    reviewCount: number;
    completedOrders: number;
  };
  image?: string;
  tags?: string[];
}

const SELLER_LEVEL_CONFIG = {
  new: { label: 'Neu', color: 'bg-slate-100 text-slate-700', icon: null },
  rising: { label: 'Aufsteigend', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
  pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700', icon: Star },
  top: { label: 'Top-Seller', color: 'bg-yellow-100 text-yellow-700', icon: Star },
};

export default function GigCardOptimized({
  id,
  title,
  description,
  price,
  deliveryDays,
  category,
  seller,
  stats,
  image,
  tags = [],
}: GigCardProps) {
  const levelConfig = SELLER_LEVEL_CONFIG[seller.level || 'new'];
  const LevelIcon = levelConfig.icon;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={`/gig/${id}`}>
        <Card className="h-full border-2 border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer group">
          {/* Image */}
          {image && (
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Category Badge */}
              <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold">
                {category}
              </Badge>
              {/* Seller Level Badge */}
              {seller.level && seller.level !== 'new' && (
                <Badge className={`absolute top-3 right-3 ${levelConfig.color} font-semibold flex items-center gap-1`}>
                  {LevelIcon && <LevelIcon className="h-3 w-3" />}
                  {levelConfig.label}
                </Badge>
              )}
            </div>
          )}

          <CardHeader className="pb-3">
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </CardHeader>

          <CardContent className="pb-4 space-y-3">
            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2">
              {description}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Trust Cues */}
            <div className="flex items-center gap-4 text-sm">
              {/* Rating */}
              {stats.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-slate-900">{stats.rating.toFixed(1)}</span>
                  <span className="text-slate-500">({stats.reviewCount})</span>
                </div>
              )}

              {/* Completed Orders */}
              {stats.completedOrders > 0 && (
                <div className="flex items-center gap-1 text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{stats.completedOrders} Aufträge</span>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {seller.image ? (
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="h-8 w-8 rounded-full object-cover border-2 border-slate-200"
                  loading="lazy"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {seller.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-slate-900 truncate">{seller.name}</span>
                  {seller.isVerified && (
                    <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" aria-label="Verifizierter Verkäufer" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Price */}
            <div>
              <div className="text-sm text-slate-500">Ab</div>
              <div className="text-2xl font-black text-slate-900">{formatPrice(price)}</div>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{deliveryDays}d</span>
            </div>
          </CardFooter>

          {/* Hover CTA */}
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
        </Card>
      </Link>
    </motion.div>
  );
}
