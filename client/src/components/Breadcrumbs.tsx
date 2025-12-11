/**
 * Breadcrumbs Component
 * 
 * Best Practices 2025 (H3: User-Kontrolle & Freiheit):
 * - Zeigt aktuellen Standort in der Hierarchie
 * - Ermöglicht schnelle Navigation zurück
 * - Accessibility (ARIA, Keyboard-Navigation)
 * - Responsive (Mobile: nur letzter Schritt)
 */

import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-slate-600', className)}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        aria-label="Zur Startseite"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Start</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            
            {isLast ? (
              <span
                className="font-medium text-slate-900"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Compact Breadcrumbs (Mobile-optimized)
 * Shows only: Home → ... → Current
 */
export function CompactBreadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const lastItem = items[items.length - 1];
  const hasMultipleSteps = items.length > 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-slate-600', className)}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Zur Startseite"
      >
        <Home className="h-4 w-4" />
      </Link>

      {hasMultipleSteps && (
        <>
          <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span className="text-slate-400">...</span>
        </>
      )}

      <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
      <span className="font-medium text-slate-900" aria-current="page">
        {lastItem.label}
      </span>
    </nav>
  );
}

/**
 * Hook to generate breadcrumbs from current route
 */
export function useBreadcrumbs(location: string): BreadcrumbItem[] {
  const segments = location.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Build breadcrumbs from URL segments
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Skip dynamic segments (e.g., /gig/123)
    if (/^\d+$/.test(segment)) {
      continue;
    }

    // Map segments to labels
    const label = segmentToLabel(segment);
    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return breadcrumbs;
}

/**
 * Map URL segment to human-readable label
 */
function segmentToLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    marketplace: 'Marktplatz',
    gig: 'Gig',
    checkout: 'Checkout',
    dashboard: 'Dashboard',
    profile: 'Profil',
    settings: 'Einstellungen',
    messages: 'Nachrichten',
    orders: 'Aufträge',
    create: 'Erstellen',
    edit: 'Bearbeiten',
    about: 'Über uns',
    contact: 'Kontakt',
    faq: 'FAQ',
    'how-it-works': 'So funktioniert\'s',
    terms: 'AGB',
    privacy: 'Datenschutz',
    impressum: 'Impressum',
  };

  return labelMap[segment] || capitalize(segment);
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
