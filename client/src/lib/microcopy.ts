/**
 * Microcopy & UX Writing für DACH-Region
 * 
 * Best Practices 2025 (H2: Match System & Realität):
 * - Vertraute Sprache & Metaphern
 * - Klare, präzise Formulierungen
 * - Positive Framing (statt Negationen)
 * - Handlungsorientiert (Verben statt Nomen)
 * - Konsistente Terminologie
 */

/**
 * CTA (Call-to-Action) Texte
 */
export const CTA = {
  // Primary Actions
  gigErstellen: 'Gig erstellen',
  gigVeroeffentlichen: 'Jetzt veröffentlichen',
  gigBearbeiten: 'Gig bearbeiten',
  gigBuchen: 'Jetzt buchen',
  
  // Secondary Actions
  mehrErfahren: 'Mehr erfahren',
  zurueck: 'Zurück',
  weiter: 'Weiter',
  abbrechen: 'Abbrechen',
  speichern: 'Speichern',
  
  // Auth
  anmelden: 'Anmelden',
  registrieren: 'Kostenlos registrieren',
  abmelden: 'Abmelden',
  
  // Payment
  jetztBezahlen: 'Jetzt sicher bezahlen',
  zahlungBestaetigen: 'Zahlung bestätigen',
  
  // Seller
  auszahlungAnfordern: 'Auszahlung anfordern',
  auftragAnnehmen: 'Auftrag annehmen',
  auftragAbschliessen: 'Auftrag abschließen',
} as const;

/**
 * Status-Nachrichten
 */
export const STATUS = {
  // Success
  gigErstellt: 'Gig erfolgreich erstellt! 🎉',
  gigVeroeffentlicht: 'Dein Gig ist jetzt live!',
  auftragErhalten: 'Neuer Auftrag erhalten!',
  zahlungErfolgreich: 'Zahlung erfolgreich! ✓',
  auszahlungErfolgreich: 'Auszahlung wird bearbeitet',
  
  // Loading
  laedt: 'Lädt...',
  verarbeitet: 'Wird verarbeitet...',
  speichert: 'Speichert...',
  
  // Error
  fehlerAufgetreten: 'Ein Fehler ist aufgetreten',
  netzwerkfehler: 'Verbindungsfehler. Bitte versuche es erneut.',
  validierungsfehler: 'Bitte überprüfe deine Eingaben',
  
  // Empty States
  keineGigs: 'Noch keine Gigs vorhanden',
  keineAuftraege: 'Noch keine Aufträge',
  keineNachrichten: 'Keine neuen Nachrichten',
} as const;

/**
 * Form-Labels & Placeholders
 */
export const FORM = {
  // Gig Creation
  gigTitel: {
    label: 'Gig-Titel',
    placeholder: 'z.B. "Professionelles Logo-Design in 24h"',
    hint: 'Beschreibe kurz und präzise, was du anbietest',
  },
  gigBeschreibung: {
    label: 'Beschreibung',
    placeholder: 'Erkläre detailliert, was im Gig enthalten ist...',
    hint: 'Je detaillierter, desto besser! Mindestens 100 Zeichen.',
  },
  gigPreis: {
    label: 'Preis',
    placeholder: '49',
    hint: 'Preis in Euro (max. 250€)',
  },
  gigLieferzeit: {
    label: 'Lieferzeit',
    placeholder: '3',
    hint: 'In Tagen (1-30)',
  },
  gigKategorie: {
    label: 'Kategorie',
    placeholder: 'Wähle eine Kategorie',
  },
  
  // Checkout
  projektName: {
    label: 'Projektname',
    placeholder: 'z.B. "Mein Startup-Logo"',
  },
  projektBeschreibung: {
    label: 'Projektbeschreibung',
    placeholder: 'Beschreibe dein Projekt und deine Anforderungen...',
    hint: 'Je mehr Details, desto besser das Ergebnis!',
  },
  zielgruppe: {
    label: 'Zielgruppe',
    placeholder: 'z.B. "Junge Erwachsene 18-35"',
  },
  
  // Profile
  bio: {
    label: 'Über mich',
    placeholder: 'Erzähle etwas über dich und deine Expertise...',
    hint: 'Zeige, warum Kunden dir vertrauen können',
  },
  skills: {
    label: 'Skills',
    placeholder: 'z.B. "Photoshop, Illustrator, Figma"',
  },
} as const;

/**
 * Error-Messages (spezifisch & hilfreich)
 */
export const ERRORS = {
  // Validation
  required: (field: string) => `${field} ist erforderlich`,
  minLength: (field: string, min: number) => `${field} muss mindestens ${min} Zeichen lang sein`,
  maxLength: (field: string, max: number) => `${field} darf maximal ${max} Zeichen lang sein`,
  minValue: (field: string, min: number) => `${field} muss mindestens ${min} sein`,
  maxValue: (field: string, max: number) => `${field} darf maximal ${max} sein`,
  invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein',
  invalidUrl: 'Bitte gib eine gültige URL ein (mit https://)',
  
  // Auth
  notAuthenticated: 'Bitte melde dich an, um fortzufahren',
  notAuthorized: 'Du hast keine Berechtigung für diese Aktion',
  
  // Payment
  paymentFailed: 'Zahlung fehlgeschlagen. Bitte versuche es erneut oder wähle eine andere Zahlungsmethode.',
  insufficientFunds: 'Nicht genügend Guthaben verfügbar',
  
  // File Upload
  fileTooLarge: (maxSize: number) => `Datei ist zu groß (max. ${maxSize}MB)`,
  invalidFileType: (allowed: string[]) => `Nur folgende Dateitypen erlaubt: ${allowed.join(', ')}`,
  
  // Generic
  somethingWentWrong: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
  tryAgainLater: 'Bitte versuche es später erneut.',
} as const;

/**
 * Trust & Safety Messages
 */
export const TRUST = {
  escrowInfo: 'Dein Geld ist sicher! Wir halten die Zahlung bis zur erfolgreichen Lieferung zurück.',
  buyerProtection: '100% Käuferschutz: Geld-zurück-Garantie bei Nichtlieferung',
  sellerProtection: 'Verkäuferschutz: Zahlung garantiert nach erfolgreicher Lieferung',
  dataPrivacy: 'Deine Daten sind sicher und DSGVO-konform geschützt',
  securePayment: 'Sichere Zahlung über Stripe (SSL-verschlüsselt)',
  verifiedSeller: 'Verifizierter Verkäufer',
  moneyBackGuarantee: '14 Tage Geld-zurück-Garantie',
} as const;

/**
 * Tooltips & Help Texts
 */
export const HELP = {
  escrow: 'Das Geld wird erst nach erfolgreicher Lieferung an den Verkäufer ausgezahlt. So bist du als Käufer geschützt.',
  deliveryTime: 'Die Lieferzeit beginnt, sobald der Verkäufer den Auftrag annimmt.',
  revision: 'Kostenlose Änderungswünsche innerhalb von 7 Tagen nach Lieferung.',
  payout: 'Auszahlungen werden innerhalb von 2-3 Werktagen auf dein Bankkonto überwiesen.',
  commission: 'Flinkly behält 15% Provision ein. Du erhältst 85% des Gig-Preises.',
  rating: 'Bewertungen helfen anderen Nutzern, vertrauenswürdige Anbieter zu finden.',
} as const;

/**
 * Time & Date Formatting (DACH-Style)
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
  
  return formatDate(date);
};

/**
 * Currency Formatting (DACH-Style)
 */
export const formatPrice = (cents: number): string => {
  const euros = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros);
};

/**
 * Number Formatting (DACH-Style)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num);
};
