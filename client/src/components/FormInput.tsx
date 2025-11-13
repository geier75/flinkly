/**
 * Form Input Component with Inline Validation
 * 
 * Best Practices 2025 (H5: Error-Prevention):
 * - Real-time validation feedback
 * - Visual indicators (icons, colors)
 * - Accessible error messages (ARIA)
 * - Smooth animations (Framer Motion)
 * - Character counter for max-length fields
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string | null;
  valid?: boolean;
  isValidating?: boolean;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  valid,
  isValidating,
  placeholder,
  hint,
  required,
  disabled,
  maxLength,
  className,
}: FormInputProps) {
  const hasError = !!error;
  const hasSuccess = valid && !error;
  const showCharCount = maxLength && String(value).length > maxLength * 0.7;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500" aria-label="Pflichtfeld">*</span>}
        {hint && (
          <span className="group relative">
            <Info className="h-4 w-4 text-slate-400 cursor-help" />
            <span className="absolute left-6 top-0 w-64 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {hint}
            </span>
          </span>
        )}
      </Label>

      {/* Input Container */}
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            'pr-10 transition-all',
            hasError && 'border-red-500 focus:ring-red-500',
            hasSuccess && 'border-green-500 focus:ring-green-500'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />

        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {isValidating && (
              <motion.div
                key="validating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              </motion.div>
            )}
            {!isValidating && hasError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
            {!isValidating && hasSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Check className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character Counter */}
      {showCharCount && (
        <div className="text-xs text-right text-slate-500">
          {String(value).length} / {maxLength}
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            id={`${name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint (when no error) */}
      {!hasError && hint && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

/**
 * Form Textarea with Inline Validation
 */
interface FormTextareaProps extends Omit<FormInputProps, 'type'> {
  rows?: number;
  minLength?: number;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  valid,
  isValidating,
  placeholder,
  hint,
  required,
  disabled,
  maxLength,
  minLength,
  rows = 4,
  className,
}: FormTextareaProps) {
  const hasError = !!error;
  const hasSuccess = valid && !error;
  const charCount = String(value).length;
  const showCharCount = maxLength || minLength;
  const isNearLimit = maxLength && charCount > maxLength * 0.7;
  const isUnderMin = minLength && charCount < minLength;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500" aria-label="Pflichtfeld">*</span>}
        {hint && (
          <span className="group relative">
            <Info className="h-4 w-4 text-slate-400 cursor-help" />
            <span className="absolute left-6 top-0 w-64 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {hint}
            </span>
          </span>
        )}
      </Label>

      {/* Textarea Container */}
      <div className="relative">
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange as any}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            'resize-none transition-all',
            hasError && 'border-red-500 focus:ring-red-500',
            hasSuccess && 'border-green-500 focus:ring-green-500'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />

        {/* Status Icon */}
        <div className="absolute right-3 top-3">
          <AnimatePresence mode="wait">
            {isValidating && (
              <motion.div
                key="validating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              </motion.div>
            )}
            {!isValidating && hasError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
            {!isValidating && hasSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Check className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character Counter */}
      {showCharCount && (
        <div
          className={cn(
            'text-xs text-right transition-colors',
            isNearLimit && 'text-amber-600',
            isUnderMin && 'text-slate-400',
            !isNearLimit && !isUnderMin && 'text-slate-500'
          )}
        >
          {charCount}
          {minLength && ` / ${minLength} min.`}
          {maxLength && ` / ${maxLength} max.`}
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            id={`${name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint (when no error) */}
      {!hasError && hint && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
