import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  TrendingUp,
  Zap,
  Award,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";

type SellerLevel = "new" | "rising" | "level_one" | "top_rated";

interface SellerLevelProgressProps {
  currentLevel: SellerLevel;
  completedOrders: number;
  averageRating: number; // 0-500 (multiply by 100)
  responseTimeHours: number;
  onTimeDeliveryRate: number; // 0-100
}

const LEVEL_CONFIG = {
  new: {
    name: "Neu",
    icon: Star,
    color: "text-slate-500",
    bgColor: "bg-slate-500/20",
    borderColor: "border-slate-500/40",
    requirements: {
      orders: 0,
      rating: 0,
      responseTime: 24,
      onTimeRate: 0,
    },
    nextLevel: "rising" as SellerLevel,
  },
  rising: {
    name: "Aufsteigend",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/40",
    requirements: {
      orders: 10,
      rating: 4.5,
      responseTime: 24,
      onTimeRate: 85,
    },
    nextLevel: "level_one" as SellerLevel,
  },
  level_one: {
    name: "Level One",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/40",
    requirements: {
      orders: 50,
      rating: 4.7,
      responseTime: 12,
      onTimeRate: 90,
    },
    nextLevel: "top_rated" as SellerLevel,
  },
  top_rated: {
    name: "Top Rated",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/40",
    requirements: {
      orders: 200,
      rating: 4.9,
      responseTime: 6,
      onTimeRate: 95,
    },
    nextLevel: null,
  },
};

export default function SellerLevelProgress({
  currentLevel,
  completedOrders,
  averageRating,
  responseTimeHours,
  onTimeDeliveryRate,
}: SellerLevelProgressProps) {
  const config = LEVEL_CONFIG[currentLevel];
  const Icon = config.icon;
  const rating = averageRating / 100; // Convert to 0-5 scale
  
  // Calculate progress to next level
  const nextLevelConfig = config.nextLevel ? LEVEL_CONFIG[config.nextLevel] : null;
  
  const calculateProgress = () => {
    if (!nextLevelConfig) return 100; // Already at max level
    
    const requirements = nextLevelConfig.requirements;
    const current = {
      orders: completedOrders,
      rating,
      responseTime: responseTimeHours,
      onTimeRate: onTimeDeliveryRate,
    };
    
    // Calculate percentage for each requirement
    const ordersProgress = Math.min((current.orders / requirements.orders) * 100, 100);
    const ratingProgress = Math.min((current.rating / requirements.rating) * 100, 100);
    const responseTimeProgress = Math.min((requirements.responseTime / current.responseTime) * 100, 100);
    const onTimeProgress = Math.min((current.onTimeRate / requirements.onTimeRate) * 100, 100);
    
    // Average progress
    return Math.round((ordersProgress + ratingProgress + responseTimeProgress + onTimeProgress) / 4);
  };
  
  const progress = calculateProgress();
  
  // Check which requirements are met
  const checkRequirement = (type: "orders" | "rating" | "responseTime" | "onTimeRate") => {
    if (!nextLevelConfig) return true;
    
    const requirements = nextLevelConfig.requirements;
    
    switch (type) {
      case "orders":
        return completedOrders >= requirements.orders;
      case "rating":
        return rating >= requirements.rating;
      case "responseTime":
        return responseTimeHours <= requirements.responseTime;
      case "onTimeRate":
        return onTimeDeliveryRate >= requirements.onTimeRate;
    }
  };
  
  return (
    <Card className="bg-white shadow-sm border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 font-bold flex items-center gap-3">
          <Icon className={`h-6 w-6 ${config.color}`} />
          Dein Seller-Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            className={`${config.bgColor} ${config.color} border ${config.borderColor} px-6 py-3 text-lg font-bold`}
          >
            <Icon className="h-5 w-5 mr-2" />
            {config.name}
          </Badge>
        </motion.div>
        
        {/* Progress to Next Level */}
        {nextLevelConfig && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">
                Fortschritt zu <span className="text-emerald-600">{LEVEL_CONFIG[config.nextLevel!].name}</span>
              </span>
              <span className="text-slate-900 font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}
        
        {/* Requirements */}
        {nextLevelConfig ? (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Anforderungen für {LEVEL_CONFIG[config.nextLevel!].name}:</h4>
            
            <div className="space-y-2">
              {/* Orders */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {checkRequirement("orders") ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Target className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-700">Abgeschlossene Aufträge</span>
                </div>
                <span className={`text-sm font-bold ${checkRequirement("orders") ? "text-emerald-600" : "text-slate-900"}`}>
                  {completedOrders} / {nextLevelConfig.requirements.orders}
                </span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {checkRequirement("rating") ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Star className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-700">Durchschnittsbewertung</span>
                </div>
                <span className={`text-sm font-bold ${checkRequirement("rating") ? "text-emerald-600" : "text-slate-900"}`}>
                  {rating.toFixed(1)} / {nextLevelConfig.requirements.rating.toFixed(1)} ⭐
                </span>
              </div>
              
              {/* Response Time */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {checkRequirement("responseTime") ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-700">Antwortzeit (max.)</span>
                </div>
                <span className={`text-sm font-bold ${checkRequirement("responseTime") ? "text-emerald-600" : "text-slate-900"}`}>
                  {responseTimeHours}h / {nextLevelConfig.requirements.responseTime}h
                </span>
              </div>
              
              {/* On-Time Delivery */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {checkRequirement("onTimeRate") ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Award className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-700">Pünktliche Lieferung (min.)</span>
                </div>
                <span className={`text-sm font-bold ${checkRequirement("onTimeRate") ? "text-emerald-600" : "text-slate-900"}`}>
                  {onTimeDeliveryRate}% / {nextLevelConfig.requirements.onTimeRate}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/40">
            <p className="text-sm text-amber-700 font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Du hast das höchste Level erreicht! 🎉
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
