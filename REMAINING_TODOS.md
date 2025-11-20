# 🎯 Flinkly - Verbleibende High-Priority TODOs

## ✅ Bereits implementiert (Checkpoint 30022ea4)
- [x] Checkout-Review-Step (Step 4 mit Zusammenfassung)
- [x] Seller-Onboarding-Checklist (4 Stufen, Progress-Tracking)
- [x] Seller-Level-Auto-Upgrade (Cron-Job täglich 3:00 Uhr)
- [x] Database-Indexe (price, averageRating)
- [x] Cursor-based Pagination
- [x] Gig-Pakete-UI (Basic/Standard/Premium)
- [x] Exit-Intent-Modal
- [x] PostHog A/B-Testing
- [x] Seller-Level-Progress-Component
- [x] Performance-Dashboard (KPIs, Charts)

---

## 🔴 Kritische Backend-Features (Blockieren Produktion)

### 1. Order-Model erweitern (4h)
- [ ] `selectedPackage` Feld hinzufügen (enum: basic, standard, premium)
- [ ] `selectedExtras` JSON-Feld hinzufügen (Array von Extra-IDs)
- [ ] Migration erstellen und pushen
- [ ] Checkout-Submit-Logic anpassen

### 2. Level-Up-Notifications (6h)
- [ ] Push-Notification bei Level-Upgrade (Manus Notification API)
- [ ] E-Mail-Notification bei Level-Upgrade
- [ ] In-App-Badge für neue Level
- [ ] Integration in sellerLevelService.ts

### 3. Email-Config & SMTP (4h)
- [ ] Nodemailer installieren
- [ ] SMTP-ENV-Vars konfigurieren (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- [ ] sendEmail-Function in server/_core/email.ts testen
- [ ] Weekly-Digest-Email testen

---

## 🟡 Wichtige Frontend-Features (UX-Verbesserungen)

### 4. Filter-State in URL (3h)
- [ ] useSearchParams Hook in Marketplace.tsx
- [ ] URL-Sync für category, maxPrice, searchQuery
- [ ] Browser-Back-Button-Support
- [ ] Shareable Filter-URLs

### 5. Sortierung "Beliebtheit" (4h)
- [ ] Popularity-Algorithm (Views * 0.3 + Orders * 0.5 + Rating * 0.2)
- [ ] Backend-Procedure gigs.listByPopularity
- [ ] Frontend-Sort-Dropdown erweitern
- [ ] Testing mit Mock-Daten

### 6. AVV-Tooltip (2h)
- [ ] Tooltip-Component mit Erklärung
- [ ] Link zu Muster-AVV
- [ ] Integration in Checkout Legal-Step
- [ ] Accessibility (Keyboard-Navigation)

### 7. Zahlungsmethode speichern (6h)
- [ ] Stripe Customer Portal Integration
- [ ] "Zahlungsmethode speichern" Checkbox
- [ ] Saved-Payment-Methods anzeigen
- [ ] Testing mit Stripe Test-Cards

---

## 🟢 Nice-to-Have (Kann später implementiert werden)

### 8. Favoriten-Email-Reminder (6h)
- [ ] Cron-Job für wöchentliche Favoriten-Reminder
- [ ] Email-Template erstellen
- [ ] User-Opt-out-Option
- [ ] Testing

### 9. Redis-Caching (16h)
- [ ] Redis-Client installieren
- [ ] Gig-Liste-Caching (5min TTL)
- [ ] Seller-Profile-Caching (10min TTL)
- [ ] Category-Stats-Caching (1h TTL)
- [ ] Cache-Invalidation-Logic

### 10. Mobile-Optimierung (24h)
- [ ] Hamburger-Menü
- [ ] Touch-Optimierung für Fächer-Effekt
- [ ] Mobile-Checkout-Flow
- [ ] Responsive-Testing (iOS, Android)

---

## 📊 Geschätzter Aufwand

**Kritische Features (Blockieren Produktion):** 14h
**Wichtige Features (UX-Verbesserungen):** 15h
**Nice-to-Have:** 46h

**Total:** 75h

---

## 🎯 Empfohlene Reihenfolge

1. **Order-Model erweitern** (4h) – Blockiert Package/Extras-Speicherung
2. **Filter-State in URL** (3h) – Shareable URLs
3. **Sortierung "Beliebtheit"** (4h) – Bessere Discovery
4. **AVV-Tooltip** (2h) – DSGVO-Compliance
5. **Level-Up-Notifications** (6h) – Seller-Engagement
6. **Zahlungsmethode speichern** (6h) – Conversion-Optimierung
7. **Email-Config & SMTP** (4h) – Weekly-Digest aktivieren

**Total für MVP:** 29h
