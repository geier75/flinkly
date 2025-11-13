export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "https://placehold.co/128x128/3B82F6/FFFFFF?text=Flinkly";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Flinkly specific constants
export const CATEGORIES = [
  { value: "design", label: "Design & Kreativ", icon: "🎨" },
  { value: "writing", label: "Text & Übersetzung", icon: "✍️" },
  { value: "marketing", label: "Marketing & PR", icon: "📢" },
  { value: "development", label: "Programmierung", icon: "💻" },
  { value: "video", label: "Video & Animation", icon: "🎬" },
  { value: "music", label: "Musik & Audio", icon: "🎵" },
  { value: "business", label: "Business & Beratung", icon: "💼" },
] as const;

export const MAX_GIG_PRICE = 25000; // 250€ in cents
export const MIN_GIG_PRICE = 100; // 1€ in cents
export const MIN_PAYOUT_AMOUNT = 2000; // 20€ in cents

export const ORDER_STATUS_LABELS = {
  pending: "Ausstehend",
  in_progress: "In Bearbeitung",
  preview: "Vorschau",
  delivered: "Geliefert",
  revision: "Revision",
  completed: "Abgeschlossen",
  disputed: "Streitfall",
  cancelled: "Storniert",
} as const;

export const PAYMENT_METHODS = [
  { value: "card", label: "Kreditkarte", icon: "💳" },
  { value: "sepa", label: "SEPA Lastschrift", icon: "🏦" },
  { value: "klarna", label: "Klarna", icon: "🛍️" },
  { value: "twint", label: "TWINT", icon: "📱" },
] as const;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `vor ${days} Tagen`;
  if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`;
  if (days < 365) return `vor ${Math.floor(days / 30)} Monaten`;
  return `vor ${Math.floor(days / 365)} Jahren`;
}

export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
