# 🎯 Flinkly - Master TODO (Konsolidiert & Dedupliziert)

**Erstellt:** 19. Januar 2025  
**Status:** Alle Listen zusammengeführt, Duplikate entfernt  
**Quellen:** todo.md, REMAINING_TODOS.md, TODO_STATUS_REPORT.md, LAUNCH_READY.md

---

## ✅ KOMPLETT ABGESCHLOSSEN

### Phase 0: Pre-Launch Blocker
- [x] Stripe-Integration (Connect, Checkout, Webhooks, Refunds, Split-Payment 85/15)
- [x] Cookie-Consent & DSGVO (Banner, Datenexport Art. 20, Account-Löschung Art. 17)
- [x] Widerrufsbelehrung & AGB (DACH-konform, Checkbox im Checkout)
- [x] Messaging-System (Real-time Socket.io, File-Sharing, Push-Notifications)
- [x] Seller-Verifizierung (Email/Phone, Badges, Admin-Approval-Queue)
- [x] Input-Validation & Security (Zod, CSRF, Rate-Limiting, CSP)
- [x] SEO & Analytics (Meta-Tags, Schema.org, PostHog, Sentry)
- [x] Performance-Optimization (Lazy-Loading, Code-Splitting, Font-Optimization)

### Phase 1: MVP Launch
- [x] Fraud-Detection (IP-Fingerprinting, Anomalie-Detection)
- [x] Dispute-Resolution (3-Stufen-Prozess, Evidence-Upload, Admin-Queue)
- [x] Content-Moderation (AWS Rekognition, Keyword-Blacklist)
- [x] Favoriten/Wishlist (Heart-Icon, Optimistic Updates, /favorites Page)
- [x] Gig-Erstellung verbessert (Live-Vorschau, 40 Templates, SEO-Score, Pricing-Calculator)
- [x] Gig-Detail verbessert (Ähnliche Gigs, Seller-Stats, FAQ, Sticky Bottom Bar)
- [x] Mobile-Optimierung (Touch-Targets 44×44px, Hamburger-Menü, Swipe-Gestures)
- [x] Accessibility (Keyboard-Navigation, ARIA-Labels, Kontrast WCAG 2.1 AA)

### Backend-Optimierung
- [x] Database-Optimierung (Indizes, Cursor-based Pagination)
- [x] Redis Caching (Gig-Liste TTL 5 Min, Seller-Profile TTL 10 Min)

### Aktuelle Session (19. Jan 2025)
- [x] Stripe Payment Methods (Save/List/Delete/SetDefault + SavedPaymentMethods Component)
- [x] Checkout Review-Step (Käuferschutz-Banner, prominente AGB/Widerruf-Links)
- [x] AVV-Tooltip (Art. 28 DSGVO mit Hover-Erklärung)
- [x] GigPackageSelector Component (3-Spalten-Grid, Basic/Standard/Premium)
- [x] GigExtrasSelector Component (Checkbox-basierte Add-on-Auswahl)

---

## 🔴 KRITISCH (Blockiert Produktion)

### 1. Order-Model erweitern (4h)
- [ ] selectedPackage Feld hinzufügen (enum: basic, standard, premium)
- [ ] selectedExtras JSON-Feld hinzufügen (Array von Extra-IDs)
- [ ] Migration erstellen und pushen
- [ ] Checkout-Submit-Logic anpassen

### 2. GigDetail-Integration abschließen (6h)
- [ ] GigPackageSelector in GigDetail.tsx integrieren
- [ ] GigExtrasSelector in GigDetail.tsx integrieren
- [ ] Preisberechnung mit Paketen + Extras aktualisieren
- [ ] SessionStorage für Package/Extras-Selection
- [ ] Checkout.tsx: Package/Extras aus SessionStorage lesen
- [ ] Testing: End-to-End-Flow

### 3. Stripe Live-Keys konfigurieren (2h)
- [ ] Stripe Live-Keys in Settings → Payment hinzufügen
- [ ] Webhook-URL in Stripe Dashboard eintragen
- [ ] Test-Checkout mit echten Karten
- [ ] Payout-Flow testen

### 4. AGB/Widerruf prominent anzeigen (2h)
- [ ] AGB/Widerruf-Links VOR Checkout-Button anzeigen
- [ ] "Mit dem Kauf akzeptierst du..." Text prominent
- [ ] Links öffnen in neuem Tab

### 5. Impressumspflicht für gewerbliche Seller (4h)
- [ ] isCommercial Boolean-Feld zu users-Tabelle
- [ ] Seller-Onboarding: "Gewerblich?" Checkbox
- [ ] Impressum-Pflichtfelder
- [ ] Impressum auf Seller-Profil anzeigen

---

## 🟡 WICHTIG (UX-Verbesserungen)

### 6. Filter-State in URL (3h)
- [ ] useSearchParams Hook in Marketplace.tsx
- [ ] URL-Sync für category, maxPrice, searchQuery
- [ ] Browser-Back-Button-Support

### 7. Sortierung "Beliebtheit" (4h)
- [ ] Popularity-Algorithm (Views × 0.3 + Orders × 0.5 + Rating × 0.2)
- [ ] Backend-Procedure gigs.listByPopularity
- [ ] Frontend-Sort-Dropdown erweitern

### 8. Level-Up-Notifications (6h)
- [ ] Push-Notification bei Level-Upgrade
- [ ] E-Mail-Notification bei Level-Upgrade
- [ ] In-App-Badge für neue Level

### 9. Email-Config & SMTP (4h)
- [ ] Nodemailer installieren
- [ ] SMTP-ENV-Vars konfigurieren
- [ ] sendEmail-Function testen
- [ ] Weekly-Digest-Email testen

### 10. Skip-Links (2h)
- [ ] Skip-to-Content-Link am Seitenanfang
- [ ] Keyboard-Navigation testen

---

## 🟢 NICE-TO-HAVE

### 11. Favoriten-Email-Reminder (6h)
### 12. Soft Deletes (8h)
### 13. ID-Verifizierung (IDnow) (16h)

---

## 🔵 PHASE 2: GROWTH FEATURES

### 14. Seller-Tiers/Levels UI (40h)
### 15. Quality-Control (32h)
### 16. Personalisierung (40h)
### 17. A/B-Testing (24h)

---

## 🔵 PHASE 3: SCALE & MONETIZATION

### 18. Subscription/Membership (40h)
### 19. Referral-Programm (32h)
### 20. Multi-Currency (24h)
### 21. Invoice-PDF-Generation (20h)

---

## 📊 AUFWANDS-ÜBERSICHT

| Kategorie | Aufwand | Priorität |
|-----------|---------|-----------|
| Kritisch (P0) | 18h | Muss vor Launch |
| Wichtig (P1) | 19h | Sollte vor Launch |
| Nice-to-Have (P2) | 22h | Nach Launch |
| Phase 2 (P2) | 136h | 1-2 Monate nach Launch |
| Phase 3 (P3) | 116h | 3-6 Monate nach Launch |
| Total | 311h | |

---

## 🎯 EMPFOHLENE REIHENFOLGE (Nächste 2 Wochen)

### Woche 1: Kritische Features (18h)
1. Order-Model erweitern (4h)
2. GigDetail-Integration (6h)
3. Stripe Live-Keys (2h)
4. AGB/Widerruf prominent (2h)
5. Impressumspflicht (4h)

### Woche 2: Wichtige Features (19h)
6. Filter-State in URL (3h)
7. Sortierung "Beliebtheit" (4h)
8. Level-Up-Notifications (6h)
9. Email-Config & SMTP (4h)
10. Skip-Links (2h)

---

## 🚀 LAUNCH-BEREIT NACH WOCHE 1

Nach Abschluss der Kritischen Features (18h) ist Flinkly produktionsbereit:
- ✅ Alle rechtlichen Anforderungen erfüllt
- ✅ Stripe Live-Zahlungen aktiviert
- ✅ Tiered Pricing + Add-ons funktionieren
- ✅ DSGVO-konform
- ✅ Security-Standards erfüllt

**Empfehlung:** Soft-Launch mit 50 Beta-Testern nach Woche 1, Public-Launch nach Woche 2.
