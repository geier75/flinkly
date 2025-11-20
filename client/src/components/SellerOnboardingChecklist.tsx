import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ChevronRight, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface SellerOnboardingChecklistProps {
  hasCreatedGig: boolean;
  hasCompletedProfile: boolean;
  hasReceivedFirstOrder: boolean;
  hasReceivedFirstReview: boolean;
}

export default function SellerOnboardingChecklist({
  hasCreatedGig,
  hasCompletedProfile,
  hasReceivedFirstOrder,
  hasReceivedFirstReview,
}: SellerOnboardingChecklistProps) {
  const [, setLocation] = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const checklist: ChecklistItem[] = [
    {
      id: "profile",
      title: "Profil vervollständigen",
      description: "Füge ein Profilbild und eine Beschreibung hinzu",
      completed: hasCompletedProfile,
      action: {
        label: "Profil bearbeiten",
        href: "/settings",
      },
    },
    {
      id: "first_gig",
      title: "Erstes Gig erstellen",
      description: "Erstelle dein erstes Gig-Angebot",
      completed: hasCreatedGig,
      action: {
        label: "Gig erstellen",
        href: "/create-gig",
      },
    },
    {
      id: "first_order",
      title: "Ersten Auftrag erhalten",
      description: "Warte auf deinen ersten Kunden",
      completed: hasReceivedFirstOrder,
    },
    {
      id: "first_review",
      title: "Erste Bewertung erhalten",
      description: "Erhalte deine erste 5-Sterne-Bewertung",
      completed: hasReceivedFirstReview,
    },
  ];

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = (completedCount / totalCount) * 100;
  const isComplete = completedCount === totalCount;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Onboarding abgeschlossen! 🎉
            </h3>
            <p className="text-green-700">
              Du bist jetzt bereit, auf Flinkly durchzustarten!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="bg-white border-2 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Seller-Onboarding
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </Button>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>
              {completedCount} von {totalCount} abgeschlossen
            </span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          {checklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                item.completed
                  ? "bg-green-50 border border-green-200"
                  : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-semibold ${
                    item.completed ? "text-green-900" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-sm ${
                    item.completed ? "text-green-700" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </p>
                {!item.completed && item.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-8 text-xs"
                    onClick={() => setLocation(item.action!.href)}
                  >
                    {item.action.label}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
