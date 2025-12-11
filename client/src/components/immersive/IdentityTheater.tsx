import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Heart,
  Star,
  TrendingUp,
  Clock,
  Award,
  Zap
} from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "order" | "message" | "favorite" | "review" | "login" | "profile_update";
  date: Date;
  description: string;
}

interface IdentityTheaterProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    memberSince: Date;
    level: "bronze" | "silver" | "gold" | "platinum";
  };
  activityHistory: ActivityEvent[];
  stats: {
    totalOrders: number;
    totalMessages: number;
    totalFavorites: number;
    averageRating: number;
  };
}

/**
 * IdentityTheater - Level 3: Identity Theater
 * 
 * User avatar appears at center (generated live)
 * Hover over "Edit Profile" shows account activity "lifelines"
 * Not text, but timelines
 */
export function IdentityTheater({
  user,
  activityHistory,
  stats,
}: IdentityTheaterProps) {
  const [showLifelines, setShowLifelines] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate member duration
  const memberDuration = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - user.memberSince.getTime();
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} Jahr${years > 1 ? 'e' : ''}`;
    if (months > 0) return `${months} Monat${months > 1 ? 'e' : ''}`;
    return `${days} Tag${days > 1 ? 'e' : ''}`;
  }, [user.memberSince]);

  // Level colors and icons
  const levelConfig = useMemo(() => ({
    bronze: { color: "amber", gradient: "from-amber-600 to-amber-800", icon: Award },
    silver: { color: "slate", gradient: "from-slate-400 to-slate-600", icon: Award },
    gold: { color: "yellow", gradient: "from-yellow-400 to-amber-500", icon: Star },
    platinum: { color: "violet", gradient: "from-violet-400 to-purple-600", icon: Zap },
  }), []);

  const currentLevel = levelConfig[user.level];

  // Generate avatar initials
  const initials = useMemo(() => {
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user.name]);

  // Activity type icons
  const activityIcons = {
    order: ShoppingBag,
    message: MessageSquare,
    favorite: Heart,
    review: Star,
    login: User,
    profile_update: User,
  };

  // Activity type colors
  const activityColors = {
    order: "emerald",
    message: "blue",
    favorite: "pink",
    review: "amber",
    login: "cyan",
    profile_update: "violet",
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Central Avatar Section */}
      <div className="flex flex-col items-center py-8">
        {/* Avatar with orbital rings */}
        <div className="relative">
          {/* Outer orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-slate-700/30"
          >
            {/* Orbital dots */}
            {[0, 90, 180, 270].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-2 h-2 rounded-full bg-violet-500/50"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateX(60px) translateY(-50%)`,
                }}
              />
            ))}
          </motion.div>

          {/* Inner orbital ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-violet-500/20"
          />

          {/* Avatar container */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setShowLifelines(true)}
            onHoverEnd={() => setShowLifelines(false)}
            className="relative cursor-pointer"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentLevel.gradient} blur-xl opacity-50`} />
            
            {/* Avatar */}
            <div className={`
              relative w-24 h-24 rounded-full 
              bg-gradient-to-br ${currentLevel.gradient}
              flex items-center justify-center
              border-2 border-white/20
              shadow-lg shadow-${currentLevel.color}-500/30
            `}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">{initials}</span>
              )}
            </div>

            {/* Level badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                absolute -bottom-1 -right-1 w-8 h-8 rounded-full
                bg-gradient-to-br ${currentLevel.gradient}
                flex items-center justify-center
                border-2 border-slate-900
                shadow-lg
              `}
            >
              <currentLevel.icon className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 text-sm mt-1">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-500">
              Mitglied seit {memberDuration}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-4 gap-4 mt-8 w-full max-w-md"
        >
          {[
            { icon: ShoppingBag, value: stats.totalOrders, label: "Bestellungen", color: "emerald" },
            { icon: MessageSquare, value: stats.totalMessages, label: "Nachrichten", color: "blue" },
            { icon: Heart, value: stats.totalFavorites, label: "Favoriten", color: "pink" },
            { icon: Star, value: stats.averageRating.toFixed(1), label: "Bewertung", color: "amber" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 text-${stat.color}-400`} />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lifelines - Activity Timeline */}
      <AnimatePresence>
        {showLifelines && activityHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500" />

              {/* Timeline events */}
              <div className="space-y-4">
                {activityHistory.slice(0, 5).map((event, index) => {
                  const Icon = activityIcons[event.type];
                  const color = activityColors[event.type];

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredEvent(event.id)}
                      onHoverEnd={() => setHoveredEvent(null)}
                      className="relative pl-14"
                    >
                      {/* Event dot */}
                      <motion.div
                        animate={hoveredEvent === event.id ? { scale: 1.3 } : { scale: 1 }}
                        className={`
                          absolute left-4 w-5 h-5 rounded-full
                          bg-gradient-to-br from-${color}-400 to-${color}-600
                          flex items-center justify-center
                          border-2 border-slate-900
                          shadow-lg shadow-${color}-500/30
                        `}
                      >
                        <Icon className="w-2.5 h-2.5 text-white" />
                      </motion.div>

                      {/* Event content */}
                      <motion.div
                        animate={hoveredEvent === event.id ? { x: 5 } : { x: 0 }}
                        className={`
                          p-3 rounded-xl transition-all duration-300
                          ${hoveredEvent === event.id 
                            ? `bg-${color}-500/10 border border-${color}-500/30` 
                            : 'bg-slate-800/30 border border-transparent'
                          }
                        `}
                      >
                        <p className="text-sm text-white">{event.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {event.date.toLocaleDateString('de-DE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Fade out indicator */}
              {activityHistory.length > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-slate-500">
                    +{activityHistory.length - 5} weitere Aktivitäten
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
