# 🚀 Stripe Live-Mode Migration - Phase 2 (NACH Test-Mode)

**Ziel:** Von Test-Keys zu Live-Keys wechseln (echte Zahlungen aktivieren)  
**Aufwand:** 30-45 Minuten  
**Voraussetzung:** ✅ Alle Test-Szenarien erfolgreich (siehe STRIPE_TEST_MODE_GUIDE.md)

---

## ⚠️ WICHTIG: NUR NACH ERFOLGREICHEN TESTS!

**Wechsle NUR zu Live-Mode, wenn:**
- ✅ Alle 6 Test-Szenarien erfolgreich (STRIPE_TEST_MODE_GUIDE.md)
- ✅ Keine kritischen Bugs gefunden
- ✅ UX-Flow optimiert
- ✅ Team ist confident
- ✅ Geschäftsdaten in Stripe verifiziert
- ✅ Bankkonto hinterlegt und verifiziert

**Wenn NICHT alle Punkte erfüllt → BLEIB im Test-Mode!**

---

## 📋 MIGRATIONS-CHECKLISTE

### VOR der Migration

- [ ] **Alle Test-Szenarien erfolgreich** (STRIPE_TEST_MODE_GUIDE.md)
- [ ] **Stripe-Account vollständig verifiziert:**
  - [ ] Geschäftsdaten eingetragen
  - [ ] Bankkonto hinterlegt
  - [ ] Identity-Verification abgeschlossen
  - [ ] Micro-Deposits verifiziert (falls erforderlich)
- [ ] **Backup erstellen:**
  - [ ] Flinkly-Checkpoint gespeichert
  - [ ] Datenbank-Backup erstellt
- [ ] **Team informiert:**
  - [ ] Alle wissen, dass Live-Mode aktiviert wird
  - [ ] Support-Team bereit für echte Zahlungen

---

## 🔑 SCHRITT 1: Live-Keys abrufen (10 Min)

### 1.1 Test-Mode → Live-Mode umschalten

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Oben rechts "Viewing test data" Toggle finden**
3. **Toggle auf "Live" umschalten** (wird orange)
4. **Bestätigung:** Dashboard zeigt jetzt "Viewing live data" (orange Badge)

### 1.2 Live-Keys kopieren

1. **Zu "Developers" → "API keys" navigieren**
2. **Sicherstellen, dass "Live" Mode aktiv ist** (orange Toggle)
3. **Keys kopieren:**

   | Key-Typ | Format | Verwendung |
   |---------|--------|------------|
   | **Publishable Key** | `pk_live_...` | Frontend (Checkout) |
   | **Secret Key** | `sk_live_...` | Backend (Server) |

4. **Secret Key anzeigen:**
   - Klicke auf "Reveal live key token"
   - Kopiere den kompletten Key (beginnt mit `sk_live_`)
   - ⚠️ **NIEMALS in Git committen oder im Frontend verwenden!**

5. **Keys in Passwort-Manager speichern** (z.B. 1Password, Bitwarden)

---

## ⚙️ SCHRITT 2: Live-Keys in Flinkly eintragen (5 Min)

### 2.1 Management UI öffnen

1. Klicke auf das ⚙️ Icon in der Chatbox-Header
2. Oder öffne: https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

### 2.2 Test-Keys durch Live-Keys ersetzen

1. **Management UI → Settings → Payment**

2. **Alte Test-Keys (VORHER):**
   ```
   STRIPE_SECRET_KEY: sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY: pk_test_...
   ```

3. **Neue Live-Keys (NACHHER):**
   ```
   STRIPE_SECRET_KEY: sk_live_...
   VITE_STRIPE_PUBLISHABLE_KEY: pk_live_...
   ```

4. **"Save" Button klicken**

5. **Bestätigung:** "Payment settings saved successfully" Toast erscheint

### 2.3 Dev-Server neu starten

**Wichtig:** Server muss neu gestartet werden, damit neue Keys geladen werden!

```bash
cd /home/ubuntu/flinkly
pnpm dev
```

**Erwartete Ausgabe:**
```
[Stripe] Publishable key loaded: pk_live_...
[Stripe] Live mode ACTIVE ⚠️
```

---

## 🔗 SCHRITT 3: Live-Webhook konfigurieren (15 Min)

### 3.1 Warum neuer Webhook?

**Test-Mode und Live-Mode haben SEPARATE Webhooks!**
- Test-Webhook funktioniert NUR für Test-Zahlungen
- Live-Webhook funktioniert NUR für echte Zahlungen

### 3.2 Live-Webhook erstellen

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Sicherstellen, dass "Live" Mode aktiv ist** (orange Toggle)
3. **Zu "Developers" → "Webhooks" navigieren**
4. **"Add endpoint" Button klicken**

5. **Webhook-Konfiguration:**

   | Feld | Wert |
   |------|------|
   | **Endpoint URL** | `https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/api/webhooks/stripe` |
   | **Description** | "Flinkly Production Webhook" |
   | **Events to send** | Siehe unten |

6. **Events auswählen (KRITISCH):**

   **Payment-Events:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
   - ✅ `charge.dispute.created`
   - ✅ `charge.dispute.closed`

   **Payout-Events:**
   - ✅ `payout.paid`
   - ✅ `payout.failed`
   - ✅ `payout.canceled`

   **Stripe Connect Events (für Seller-Payouts):**
   - ✅ `account.updated`
   - ✅ `account.external_account.created`
   - ✅ `transfer.created`
   - ✅ `transfer.failed`

7. **"Add endpoint" klicken**

### 3.3 Live-Webhook-Secret kopieren

1. **Nach dem Erstellen:** Webhook-Detail-Seite öffnet sich
2. **"Signing secret" Abschnitt finden**
3. **"Reveal" klicken**
4. **Secret kopieren** (beginnt mit `whsec_...`)

5. **In Flinkly Management UI eintragen:**
   - Settings → Payment → `STRIPE_WEBHOOK_SECRET`
   - **Altes Test-Secret ERSETZEN durch Live-Secret**
   - "Save" klicken

6. **Dev-Server neu starten:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm dev
   ```

### 3.4 Live-Webhook testen

**Wichtig:** Teste SOFORT, ob Webhook funktioniert!

1. **Stripe Dashboard → Webhooks → Live-Webhook auswählen**
2. **"Send test webhook" Button klicken**
3. **Event auswählen:** `payment_intent.succeeded`
4. **"Send test webhook" klicken**

5. **Response prüfen:**
   - ✅ **Status: 200 OK** → Webhook funktioniert!
   - ❌ **Status: 4xx/5xx** → Siehe Troubleshooting

6. **Flinkly Server-Logs prüfen:**
   ```bash
   pnpm logs | grep Webhook
   ```

   **Erwartete Ausgabe:**
   ```
   [Stripe] Webhook received: payment_intent.succeeded
   [Stripe] Webhook signature verified ✓
   [Stripe] Live mode ACTIVE ⚠️
   ```

---

## 🧪 SCHRITT 4: Live-Mode Test-Zahlung (10 Min)

### 4.1 Erste echte Zahlung (KLEIN!)

**Wichtig:** Verwende KLEINE Beträge für erste Tests (1-5€)!

**Schritte:**

1. **Flinkly öffnen:** https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

2. **Marketplace → Gig auswählen:**
   - Gig mit KLEINEM Preis auswählen (z.B. 5€)
   - Oder: Erstelle Test-Gig mit 1€ Preis

3. **Checkout-Flow durchlaufen:**
   - Briefing: "Live-Mode Test"
   - Zahlungsmethode: **ECHTE Kreditkarte** (NICHT Test-Karte!)
   - Review: AGB akzeptieren
   - **"Jetzt kaufen" klicken**

4. **Zahlung abschließen:**
   - Stripe Checkout öffnet sich
   - Kreditkartendaten eingeben
   - 3D Secure (falls erforderlich)
   - **"Pay" klicken**

5. **Erfolg-Seite:**
   - ✅ "Bestellung erfolgreich!" Message
   - ✅ Order-ID angezeigt

**Prüfungen:**

| Check | Wo prüfen? | Erwartetes Ergebnis |
|-------|-----------|---------------------|
| **Order in Flinkly** | Dashboard → Orders | Status: "in_progress", Amount: 5€ |
| **Payment in Stripe** | Stripe Dashboard → Payments | Status: "succeeded", Amount: 5€, **KEIN "TEST" Badge** |
| **Webhook empfangen** | Stripe Dashboard → Webhooks → Events | Event: `checkout.session.completed` |
| **Server-Logs** | `pnpm logs \| grep Stripe` | `[Stripe] Payment successful: pi_...` |
| **Bankkonto** | Stripe Dashboard → Balance | Available balance: 4,25€ (5€ - 15% Fee) |

**✅ Test erfolgreich, wenn:**
- Order in Flinkly sichtbar
- Payment in Stripe Dashboard sichtbar (**OHNE** "TEST" Badge)
- Webhook empfangen (200 OK)
- Balance in Stripe Dashboard aktualisiert

### 4.2 Refund testen (WICHTIG!)

**Wichtig:** Teste Refund SOFORT, um sicherzustellen, dass es funktioniert!

1. **Stripe Dashboard → Payments → Test-Payment auswählen**
2. **"Refund" Button klicken**
3. **Amount:** 5€ (Full Refund)
4. **Reason:** "Test"
5. **"Refund" klicken**

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **Stripe Dashboard** | Refund: Status "succeeded", Amount: 5€ |
| **Webhook empfangen** | Event: `charge.refunded` |
| **Flinkly Order** | Status: "refunded" |
| **Bankkonto** | 5€ zurück (3-5 Werktage) |

**✅ Refund erfolgreich → Live-Mode funktioniert!**

---

## 🔒 SCHRITT 5: Sicherheits-Check (5 Min)

### 5.1 Kritische Sicherheitsmaßnahmen prüfen

- [ ] **HTTPS erzwungen** (Production-Deployment)
- [ ] **Webhook-Signature-Verification aktiv** (bereits implementiert)
- [ ] **Rate-Limiting aktiv** (bereits implementiert)
- [ ] **Secret-Keys NICHT im Frontend** (bereits korrekt)
- [ ] **Live-Keys in Passwort-Manager gespeichert**
- [ ] **Test-Keys deaktiviert** (optional, für Sicherheit)

### 5.2 Stripe Radar aktivieren (Optional, empfohlen)

**Warum?** Fraud-Detection (Machine Learning) schützt vor betrügerischen Zahlungen.

1. **Stripe Dashboard → Settings → Radar**
2. **"Enable Radar" klicken**
3. **Kosten:** 0,05€ pro Transaktion
4. **Empfehlung:** Aktivieren für Live-Mode

### 5.3 Monitoring aktivieren

- [ ] **Stripe Dashboard Alerts:**
  - Settings → Notifications
  - ✅ "Failed payments" Alert aktivieren
  - ✅ "Disputes" Alert aktivieren
  - ✅ "Payouts failed" Alert aktivieren

- [ ] **Sentry Error-Tracking:**
  - Prüfe Sentry-Dashboard auf Stripe-Errors

- [ ] **PostHog Analytics:**
  - Conversion-Funnel: Marketplace → Checkout → Success

---

## 📊 SCHRITT 6: Monitoring einrichten (5 Min)

### 6.1 Stripe Dashboard Monitoring

**Wichtige Dashboards (LIVE-Mode):**

| Dashboard | URL | Zweck |
|-----------|-----|-------|
| **Payments** | https://dashboard.stripe.com/payments | Alle echten Zahlungen |
| **Webhooks** | https://dashboard.stripe.com/webhooks | Webhook-Events, Logs |
| **Balance** | https://dashboard.stripe.com/balance | Available Balance, Payouts |
| **Radar** | https://dashboard.stripe.com/radar | Fraud-Detection |

**Wichtig:** URLs enthalten KEIN `/test/` → Live-Mode!

### 6.2 Flinkly Server-Logs

```bash
cd /home/ubuntu/flinkly
pnpm logs | grep Stripe
```

**Wichtige Log-Messages (LIVE-Mode):**

| Log-Message | Bedeutung |
|-------------|-----------|
| `[Stripe] Live mode ACTIVE ⚠️` | Live-Mode aktiv |
| `[Stripe] Payment successful: pi_...` | Echte Zahlung erfolgreich |
| `[Stripe] Webhook verified: payment_intent.succeeded` | Webhook empfangen |

---

## ✅ MIGRATIONS-CHECKLISTE

**Migration abgeschlossen, wenn:**

- [x] Live-Keys in Flinkly eingetragen
- [x] Live-Webhook konfiguriert
- [x] Live-Webhook-Secret eingetragen
- [x] Dev-Server neu gestartet
- [x] Erste echte Zahlung erfolgreich (1-5€)
- [x] Refund getestet
- [x] Sicherheits-Check abgeschlossen
- [x] Monitoring aktiviert
- [x] Team informiert

**✅ Wenn ALLE Punkte erfüllt → Live-Mode AKTIV!**

---

## 🚨 ROLLBACK-PLAN (Falls Probleme auftreten)

### Wann Rollback?

**Rollback zu Test-Mode, wenn:**
- ❌ Erste echte Zahlung schlägt fehl
- ❌ Webhooks funktionieren nicht
- ❌ Kritische Bugs gefunden
- ❌ Team ist nicht confident

### Rollback-Schritte

1. **Management UI → Settings → Payment**
2. **Live-Keys ERSETZEN durch Test-Keys:**
   ```
   STRIPE_SECRET_KEY: sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY: pk_test_...
   STRIPE_WEBHOOK_SECRET: whsec_... (Test-Webhook-Secret)
   ```
3. **"Save" klicken**
4. **Dev-Server neu starten:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm dev
   ```
5. **Prüfen:**
   - Browser-Console: `[Stripe] Publishable key loaded: pk_test_...`
   - Stripe Dashboard: Toggle auf "Viewing test data"

**✅ Rollback erfolgreich → Zurück zu Test-Mode**

---

## 🔧 TROUBLESHOOTING (LIVE-MODE)

### Problem 1: Live-Webhook funktioniert nicht

**Symptome:**
- Order-Status wird nicht aktualisiert
- Stripe Dashboard → Webhooks → Events zeigt "Failed"

**Lösungen:**

1. **Live-Webhook-Secret prüfen:**
   - Management UI → Settings → Payment
   - `STRIPE_WEBHOOK_SECRET` muss mit Live-Webhook übereinstimmen (NICHT Test-Webhook!)

2. **Dev-Server neu starten:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm dev
   ```

3. **Test-Webhook senden:**
   - Stripe Dashboard → Webhooks → Live-Webhook → "Send test webhook"

---

### Problem 2: Erste echte Zahlung schlägt fehl

**Symptome:**
- Error: "Payment failed"
- Stripe Dashboard zeigt keine Payment

**Lösungen:**

1. **Live-Keys prüfen:**
   - Management UI → Settings → Payment
   - `STRIPE_SECRET_KEY` muss mit `sk_live_` beginnen
   - `VITE_STRIPE_PUBLISHABLE_KEY` muss mit `pk_live_` beginnen

2. **Stripe Dashboard prüfen:**
   - Toggle muss auf "Live" stehen (orange)

3. **Browser-Cache löschen:**
   - F12 → Application → Clear storage → "Clear site data"

---

### Problem 3: Kreditkarte wird abgelehnt (Live-Mode)

**Symptome:**
- Error: "Your card was declined"
- Aber Karte sollte funktionieren

**Lösungen:**

1. **Karte hat Guthaben?**
   - Prüfe Kontostand

2. **Karte ist aktiviert?**
   - Manche Banken blockieren Online-Zahlungen standardmäßig

3. **3D Secure funktioniert?**
   - Prüfe Bank-App für Push-Notification

4. **Stripe Radar blockiert Zahlung?**
   - Stripe Dashboard → Radar → Prüfe, ob Zahlung als "Fraud" markiert

---

## 🎯 NÄCHSTE SCHRITTE (NACH LIVE-MODE)

**Nach erfolgreicher Migration:**

1. **Soft-Launch starten** (50 Beta-Tester)
   - Einladungs-Emails versenden
   - Feedback sammeln
   - Bugs fixen

2. **Monitoring täglich prüfen:**
   - Stripe Dashboard → Payments
   - PostHog → Conversion-Funnel
   - Sentry → Error-Tracking

3. **Erste echte Payouts überwachen:**
   - Stripe Dashboard → Balance
   - Payout-Schedule: 7 Tage (Standard)
   - Seller-Benachrichtigungen prüfen

4. **Optimierungen:**
   - Checkout-Flow vereinfachen (falls Drop-off hoch)
   - Alternative Zahlungsmethoden hinzufügen (SEPA, PayPal)
   - Express-Checkout (Apple Pay, Google Pay)

5. **Public-Launch** (nach 1-2 Wochen Beta-Testing)

---

## 📞 SUPPORT

**Stripe-Support (Live-Mode):**
- Dashboard → Help → "Contact support"
- Live-Chat: Mo-Fr 9-18 Uhr
- Email: support@stripe.com
- **Wichtig:** Erwähne "Live-Mode Issue"

**Flinkly-Support:**
- Email: support@flinkly.de

---

## 🎉 GLÜCKWUNSCH!

**Du hast erfolgreich von Test-Mode zu Live-Mode migriert!**

**Flinkly ist jetzt LIVE und kann echte Zahlungen empfangen! 🚀**

**Nächste Schritte:**
1. ✅ Soft-Launch mit 50 Beta-Testern
2. ✅ Monitoring täglich prüfen
3. ✅ Feedback sammeln
4. ✅ Public-Launch nach 1-2 Wochen

**Viel Erfolg! 🎊**

---

**Geschätzte Dauer:** 30-45 Minuten  
**Schwierigkeitsgrad:** Mittel  
**Erforderliche Skills:** Stripe-Grundkenntnisse, Zugang zu Stripe-Dashboard

**Erstellt von:** Manus AI Agent  
**Datum:** 19. Januar 2025  
**Version:** d79ad4b0
