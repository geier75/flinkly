/**
 * Skip-Link Component - WCAG 2.1 AA Accessibility
 * 
 * Allows keyboard and screen-reader users to skip repetitive navigation
 * and jump directly to main content.
 * 
 * Usage:
 * - Place at the very top of the page (before header)
 * - Links to #main-content anchor
 * - Visible only on keyboard focus (Tab key)
 * - Screen-reader accessible
 */

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium transition-all"
    >
      Skip to main content
    </a>
  );
}
