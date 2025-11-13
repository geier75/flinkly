# Flinkly TODO

## ✅ Abgeschlossen (v1.0.0)

- [x] Projekt-Dateien aus vorherigem Account integrieren
- [x] Datenbank-Schema vollständig implementieren (7 Tabellen)
- [x] Alle Frontend-Seiten wiederherstellen (18 Seiten)
- [x] Backend-Router und DB-Queries implementiert
- [x] TypeScript-Fehler behoben
- [x] Payment-Widget im Checkout erstellt
- [x] Earnings-Dashboard für Seller erstellt
- [x] Umfassende Cognitive Walkthrough-Analyse durchgeführt (165 Findings von 20-köpfigem Expertenteam)

---

## 🔴 PHASE 0: PRE-LAUNCH BLOCKER (Kritisch - Muss vor Launch)

**Zeitrahmen:** 6 Wochen | **Aufwand:** 256h | **Kosten:** €20,480

### Payment & Legal (Woche 1-2)

- [x] **Stripe-Integration finalisieren** (40h)
  - [x] Stripe Connect für Seller-Payouts
  - [x] Stripe Checkout für Käufer-Zahlungen
  - [x] Webhook-Handling für Status-Updates
  - [x] Refund-API
  - [x] Split-Payment (85% Seller, 15% Plattform)

- [x] **Cookie-Consent & DSGVO** (16h)
  - [x] Cookie-Banner mit Opt-in/Opt-out
  - [ ] Datenschutzerklärung aktualisieren
  - [ ] Datenexport-Funktion (Art. 20 DSGVO)
  - [ ] Account-Löschung mit 30-Tage-Wartezeit

- [ ] **Widerrufsbelehrung & AGB** (24h)
  - [ ] AGB erstellen (Anwalt konsultieren)
  - [ ] Widerrufsbelehrung mit Muster-Formular
  - [ ] Anzeige vor Checkout
  - [ ] Impressumspflicht für gewerbliche Seller

### Core Features (Woche 3-4)

- [ ] **Messaging-System** (60h)
  - [ ] Real-time Chat (Socket.io)
  - [ ] Order-bezogene Threads
  - [ ] File-Sharing
  - [ ] Push-Notifications
  - [ ] Read-Receipts

- [ ] **Seller-Verifizierung** (32h)
  - [ ] E-Mail + Telefon-Verifizierung
  - [ ] Verifizierungs-Badges
  - [ ] Admin-Approval-Queue
  - [ ] ID-Verifizierung (IDnow) optional

- [ ] **Input-Validation & Security** (24h)
  - [ ] Zod-Schemas für alle tRPC-Procedures
  - [ ] CSRF-Protection
  - [ ] Rate-Limiting (100 req/min auth, 20 anon)
  - [ ] Content-Security-Policy
  - [ ] File-Upload-Validation

### SEO & Analytics (Woche 5-6)

- [ ] **Meta-Tags & SEO** (20h)
  - [ ] Dynamic Meta-Tags pro Seite
  - [ ] Schema.org-Markup (Product, Review, FAQ)
  - [ ] Sitemap-Generation
  - [ ] Canonical-Tags
  - [ ] Alt-Texte-Pflichtfeld

- [ ] **Analytics-Integration** (16h)
  - [ ] PostHog oder Google Analytics
  - [ ] Event-Tracking (Conversion-Funnel)
  - [ ] Error-Tracking (Sentry)

- [ ] **Performance-Optimization** (24h)
  - [ ] Image-Optimization (WebP, Lazy-Loading)
  - [ ] Code-Splitting
  - [ ] Font-Optimization

---

## 🟡 PHASE 1: MVP LAUNCH (Nach Phase 0)

**Zeitrahmen:** 4 Wochen | **Aufwand:** 156h | **Kosten:** €12,480

### Trust & Safety

- [ ] **Fraud-Detection** (32h)
  - [ ] Stripe Radar
  - [ ] IP/Device-Fingerprinting
  - [ ] Verhaltens-Anomalie-Detection

- [ ] **Dispute-Resolution** (40h)
  - [ ] 3-Stufen-Prozess
  - [ ] Evidence-Upload
  - [ ] Admin-Mediation-Queue

- [ ] **Content-Moderation** (32h)
  - [ ] Keyword-Blacklist
  - [ ] Image-Moderation (AWS Rekognition)
  - [ ] Review-Queue

### UX Improvements

- [ ] **Favoriten/Wishlist** (16h)
  - [ ] Heart-Icon auf Gig-Cards
  - [ ] "Meine Favoriten" Seite
  - [ ] E-Mail-Reminder

- [ ] **Gig-Erstellung verbessern** (24h)
  - [ ] Live-Vorschau
  - [ ] 10 Templates pro Kategorie
  - [ ] Pricing-Calculator
  - [ ] SEO-Score

- [ ] **Gig-Detail verbessern** (20h)
  - [ ] "Frage stellen" Button
  - [ ] "Ähnliche Gigs" Sektion
  - [ ] Portfolio-Sektion
  - [ ] Sticky Bottom Bar (Mobile)

- [ ] **Checkout verbessern** (16h)
  - [ ] Review-Schritt vor Zahlung
  - [ ] Exit-Intent-Modal
  - [ ] Zahlungsmethode speichern
  - [ ] AVV-Tooltip

### Mobile & Accessibility

- [ ] **Mobile-Optimierung** (24h)
  - [ ] Touch-Targets 44x44px
  - [ ] Hamburger-Menü
  - [ ] List-View für Kanban (Mobile)
  - [ ] Multi-Step-Forms

- [ ] **Accessibility** (20h)
  - [ ] Keyboard-Navigation
  - [ ] ARIA-Labels
  - [ ] Skip-Links
  - [ ] Kontrast-Fixes

---

## 🟢 PHASE 2: GROWTH FEATURES (1-2 Monate nach Launch)

**Zeitrahmen:** 5 Wochen | **Aufwand:** 208h | **Kosten:** €16,640

### Monetization

- [ ] **Gig-Pakete/Tiers** (32h)
  - [ ] Basic/Standard/Premium
  - [ ] Upsell-UI

- [ ] **Gig-Extras/Add-ons** (24h)
  - [ ] Express-Lieferung
  - [ ] Extra Revisionen
  - [ ] Commercial License

- [ ] **Seller-Tiers/Levels** (40h)
  - [ ] 4 Level-System
  - [ ] Gamification-Badges
  - [ ] Performance-Dashboard

### Conversion-Optimization

- [ ] **Quality-Control** (32h)
  - [ ] Review-Queue
  - [ ] Spam-Detection
  - [ ] Community-Flagging

- [ ] **Personalisierung** (40h)
  - [ ] Returning-User-Homepage
  - [ ] Geo-Location-Empfehlungen
  - [ ] Browsing-History

- [ ] **Exit-Intent-Strategie** (16h)
  - [ ] Exit-Intent-Popups
  - [ ] Cart-Abandonment-Recovery

- [ ] **A/B-Testing** (24h)
  - [ ] PostHog Feature-Flags
  - [ ] A/B-Test-Dashboard

### Backend-Optimierung

- [ ] **Database-Optimierung** (20h)
  - [ ] Indizes hinzufügen
  - [ ] Pagination
  - [ ] Soft Deletes

- [ ] **Caching** (20h)
  - [ ] Redis für Gig-Liste
  - [ ] Redis für Seller-Profile

---

## 🔵 PHASE 3: SCALE & MONETIZATION (3-6 Monate nach Launch)

**Zeitrahmen:** 5 Wochen | **Aufwand:** 208h | **Kosten:** €16,640

### Marketing & Growth

- [ ] **Subscription/Membership** (40h)
  - [ ] "Flinkly Pro" für Seller (€29/Monat)
  - [ ] 0% Gebühren
  - [ ] Featured Listings

- [ ] **Referral-Programm** (32h)
  - [ ] "10€ für dich + Freund"
  - [ ] Referral-Tracking
  - [ ] Payout-Logik

- [ ] **Content-Marketing** (60h)
  - [ ] Blog-System
  - [ ] 20 SEO-Artikel
  - [ ] Lead-Magnets

### Advanced Features

- [ ] **Multi-Currency** (24h)
  - [ ] CHF-Support
  - [ ] Auto-Conversion

- [ ] **Invoice-PDF-Generation** (20h)
  - [ ] PDF-Template
  - [ ] MwSt.-Ausweisung
  - [ ] Download + E-Mail

- [ ] **Advanced Analytics** (32h)
  - [ ] Cohort-Analyse
  - [ ] Revenue-Forecasting
  - [ ] CSV-Export

---

## 🚀 QUICK WINS (Sofort - Hoher Impact, geringer Aufwand)

**Total:** 22h (~3 Tage)

- [x] Onboarding-Modal erst nach Scroll zeigen (2h) → -30% Bounce-Rate
- [x] Trust-Bar hinzufügen (4h) → +15% Conversion
- [x] CTA-Texte optimieren (2h) → +10% Click-Rate
- [x] Sticky Bottom Bar CTA optimiert (1h) → +20% Mobile-Conversion
- [x] Error-Messages verbessern (4h) → -50% Form-Abandonment
- [x] Alt-Texte-Pflichtfeld (2h) → +Accessibility, +SEO
- [x] Meta-Tags für Top-3-Seiten (3h) → +30% Organic Traffic

---

## 📋 BACKLOG (Niedrige Priorität)

- [ ] Video-Tutorials
- [ ] FAQ durchsuchbar
- [ ] Live-Chat (Intercom/Zendesk)
- [ ] WhatsApp-Business
- [ ] Service Worker (Offline)
- [ ] Prefetching
- [ ] User-Banning
- [ ] Review-Moderation
- [ ] Auto-Release nach 7 Tagen
- [ ] Quick-Responses für Seller
- [ ] Bulk-Actions
- [ ] Quick View Modal
- [ ] Filter-State in URL
- [ ] Empty-State
- [ ] Sortierung "Beliebtheit"

---

## 📊 METRIKEN ZUM TRACKEN

### North Stars
- Time-to-First-Gig: <24h
- Fulfillment-Rate: >92%
- Dispute-Rate: <4%
- NPS: ≥55

### Seller Health
- On-Time Rate: >90%
- First-Pass Rate: >90%
- Dispute Rate: <5%
- Retention: >60% nach 6 Monaten

### Käufer Health
- Conversion-Rate: >2%
- Repeat-Purchase: >40% nach 6 Monaten
- Cart-Abandonment: <70%

### Platform Health
- MAU (Monthly Active Users)
- GMV (Gross Merchandise Volume)
- Take-Rate: 15%
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- LTV/CAC: >3

---

## 💰 KOSTEN-ÜBERSICHT

| Phase | Zeitrahmen | Aufwand | Kosten (€80/h) |
|-------|-----------|---------|----------------|
| Phase 0 (Pre-Launch) | 6 Wochen | 256h | €20,480 |
| Phase 1 (MVP Launch) | 4 Wochen | 156h | €12,480 |
| Phase 2 (Growth) | 5 Wochen | 208h | €16,640 |
| Phase 3 (Scale) | 5 Wochen | 208h | €16,640 |
| **TOTAL** | **20 Wochen** | **828h** | **€66,240** |

**Break-Even:** Monat 5-6  
**Jahr 1 Revenue-Projektion:** ~€150,000

---

**Letzte Aktualisierung:** 13. November 2025  
**Nächste Review:** Nach Phase 0 Completion  
**Verantwortlich:** MiMi Tech Ai UG
