/**
 * Progress Indicator Component
 * 
 * Best Practices 2025 (H1: System-Status sichtbar machen):
 * - Zeigt aktuellen Schritt in Multi-Step-Forms
 * - Visuelles Feedback für Fortschritt
 * - Accessibility (ARIA, Keyboard-Navigation)
 * - Motion-Design (Framer Motion)
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  allowClickPrevious?: boolean; // Allow clicking on previous steps
}

export default function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
  allowClickPrevious = true,
}: ProgressIndicatorProps) {
  const handleStepClick = (step: Step) => {
    if (!onStepClick) return;
    
    // Only allow clicking on previous steps if enabled
    if (allowClickPrevious && step.id < currentStep) {
      onStepClick(step.id);
    }
  };

  return (
    <nav aria-label="Fortschrittsanzeige" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = allowClickPrevious && isCompleted && onStepClick;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-3",
                index !== steps.length - 1 && "flex-1"
              )}
            >
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(step)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-green-600 border-green-600",
                  isCurrent && "bg-blue-600 border-blue-600 ring-4 ring-blue-100",
                  !isCompleted && !isCurrent && "bg-white border-slate-300",
                  isClickable && "cursor-pointer hover:border-blue-400",
                  !isClickable && "cursor-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Schritt ${step.id}: ${step.title}${isCompleted ? ' (abgeschlossen)' : ''}${isCurrent ? ' (aktuell)' : ''}`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="h-6 w-6 text-white" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <span
                    className={cn(
                      "text-lg font-bold",
                      isCurrent && "text-white",
                      !isCurrent && "text-slate-500"
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </button>

              {/* Step Label */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCurrent && "text-blue-600",
                    isCompleted && "text-green-600",
                    !isCompleted && !isCurrent && "text-slate-500"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-slate-200 relative overflow-hidden">
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 bg-green-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Compact Progress Indicator (Mobile-optimized)
 */
export function CompactProgressIndicator({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full" aria-label="Fortschrittsanzeige">
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Current Step Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-slate-900">
          Schritt {currentStep} von {steps.length}: {steps[currentStep - 1]?.title}
        </p>
        {steps[currentStep - 1]?.description && (
          <p className="text-xs text-slate-500 mt-1">
            {steps[currentStep - 1].description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Circular Progress Indicator (for single-step progress)
 */
export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
}: {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-600"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">
          {Math.round(progress)}%
        </span>
        {label && (
          <span className="text-xs text-slate-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}
