# 🧪 Stripe Test-Mode Setup - Phase 1 (VOR Live-Launch)

**Ziel:** Alle Stripe-Features mit Test-Keys testen (KEIN echtes Geld)  
**Aufwand:** 1-2 Stunden  
**Status:** ✅ **JETZT STARTEN** (vor Live-Mode)

---

## 🎯 WARUM TEST-MODE ZUERST?

**Test-Mode ermöglicht:**
- ✅ **Keine echten Zahlungen** - Kein Risiko, kein echtes Geld
- ✅ **Unbegrenzte Tests** - So oft testen wie nötig
- ✅ **Test-Kreditkarten** - Stripe stellt Test-Karten bereit (4242 4242 4242 4242)
- ✅ **Alle Features testen** - Payments, Refunds, Webhooks, Payouts
- ✅ **Bugs finden** - Vor dem Live-Launch
- ✅ **Flow optimieren** - UX-Probleme identifizieren

**Live-Mode ERST NACH:**
- ✅ Alle Test-Szenarien erfolgreich
- ✅ Keine kritischen Bugs
- ✅ UX-Flow optimiert
- ✅ Team ist confident

---

## 📋 SCHRITT-FÜR-SCHRITT ANLEITUNG

### ✅ SCHRITT 1: Stripe Test-Keys abrufen (5 Min)

**Wichtig:** Flinkly ist bereits mit Test-Keys vorkonfiguriert! Du musst nur prüfen.

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Sicherstellen, dass "Viewing test data" Toggle AKTIV ist** (blau/grau, NICHT orange)
3. **Zu "Developers" → "API keys" navigieren**
4. **Test-Keys kopieren:**

   | Key-Typ | Format | Bereits konfiguriert? |
   |---------|--------|-----------------------|
   | **Publishable Key** | `pk_test_...` | ✅ Ja (in Flinkly) |
   | **Secret Key** | `sk_test_...` | ✅ Ja (in Flinkly) |

5. **Prüfen, ob Keys in Flinkly korrekt sind:**
   - Management UI → Settings → Payment
   - `STRIPE_SECRET_KEY`: Sollte mit `sk_test_` beginnen
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Sollte mit `pk_test_` beginnen

**✅ Wenn Keys mit `sk_test_` und `pk_test_` beginnen → Alles korrekt!**

---

### ✅ SCHRITT 2: Webhook für Test-Mode konfigurieren (10 Min)

**Wichtig:** Webhooks müssen auch im Test-Mode konfiguriert werden.

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Sicherstellen, dass "Viewing test data" Toggle AKTIV ist**
3. **Zu "Developers" → "Webhooks" navigieren**
4. **"Add endpoint" Button klicken**

5. **Webhook-Konfiguration:**

   | Feld | Wert |
   |------|------|
   | **Endpoint URL** | `https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/api/webhooks/stripe` |
   | **Description** | "Flinkly Test Webhook" |
   | **Events to send** | Siehe unten |

6. **Events auswählen (MINIMUM):**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`

7. **"Add endpoint" klicken**

8. **Webhook-Secret kopieren:**
   - Nach dem Erstellen wird ein `whsec_...` Secret angezeigt
   - **"Reveal" klicken**
   - Secret kopieren (beginnt mit `whsec_`)

9. **In Flinkly Management UI eintragen:**
   - Settings → Payment → `STRIPE_WEBHOOK_SECRET`
   - Secret einfügen
   - **"Save" klicken**

10. **Dev-Server neu starten:**
    ```bash
    cd /home/ubuntu/flinkly
    pnpm dev
    ```

---

### ✅ SCHRITT 3: Test-Webhook senden (5 Min)

**Wichtig:** Prüfe, ob Webhooks funktionieren, BEVOR du echte Tests machst.

1. **Stripe Dashboard → Webhooks → Dein Webhook auswählen**
2. **"Send test webhook" Button klicken**
3. **Event auswählen:** `payment_intent.succeeded`
4. **"Send test webhook" klicken**

5. **Response prüfen:**
   - ✅ **Status: 200 OK** → Webhook funktioniert!
   - ❌ **Status: 4xx/5xx** → Siehe Troubleshooting

6. **Flinkly Server-Logs prüfen:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm logs | grep Webhook
   ```

   **Erwartete Ausgabe:**
   ```
   [Stripe] Webhook received: payment_intent.succeeded
   [Stripe] Webhook signature verified ✓
   ```

---

## 🧪 TEST-SZENARIEN (MIT TEST-KARTEN)

### 📋 Stripe Test-Karten Übersicht

**Wichtig:** Diese Karten funktionieren NUR im Test-Mode!

| Karte | Nummer | Zweck |
|-------|--------|-------|
| **Erfolg** | `4242 4242 4242 4242` | Zahlung erfolgreich |
| **Declined** | `4000 0000 0000 0002` | Karte abgelehnt (insufficient funds) |
| **3D Secure** | `4000 0027 6000 3184` | Erfordert 3D Secure Authentication |
| **Refund** | `4242 4242 4242 4242` | Für Refund-Tests |

**Weitere Test-Karten:** https://stripe.com/docs/testing

**CVV:** Beliebig (z.B. 123)  
**Ablaufdatum:** Beliebig in der Zukunft (z.B. 12/25)  
**Postleitzahl:** Beliebig (z.B. 10115)

---

### ✅ TEST 1: Erfolgreiche Zahlung (Basic Package)

**Ziel:** End-to-End-Flow mit erfolgreicher Zahlung testen.

**Schritte:**

1. **Flinkly öffnen:** https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

2. **Marketplace → Gig auswählen:**
   - Beliebigen Gig auswählen (z.B. "Logo-Design")
   - **"Jetzt kaufen" Button klicken**

3. **Package auswählen:**
   - **Basic Package** (z.B. 49€) auswählen
   - Keine Extras
   - **"Weiter zum Checkout" klicken**

4. **Checkout-Flow:**
   - **Step 1: Briefing**
     - Projektbeschreibung: "Test-Order für Stripe Test-Mode"
     - **"Weiter" klicken**
   
   - **Step 2: Zahlungsmethode**
     - **"Kreditkarte" auswählen**
     - **Test-Karte eingeben:**
       - Kartennummer: `4242 4242 4242 4242`
       - Ablaufdatum: `12/25`
       - CVV: `123`
       - Postleitzahl: `10115`
     - **"Weiter" klicken**
   
   - **Step 3: Review**
     - AGB + Widerruf akzeptieren
     - **"Jetzt kaufen (49€)" klicken**

5. **Stripe Checkout:**
   - Checkout öffnet sich
   - Kreditkartendaten sind vorausgefüllt
   - **"Pay" Button klicken**

6. **Erfolg-Seite:**
   - ✅ "Bestellung erfolgreich!" Message
   - ✅ Order-ID angezeigt
   - ✅ "Zu meinen Bestellungen" Button

**Prüfungen:**

| Check | Wo prüfen? | Erwartetes Ergebnis |
|-------|-----------|---------------------|
| **Order in Flinkly** | Dashboard → Orders | Status: "in_progress", Amount: 49€ |
| **Payment in Stripe** | Stripe Dashboard → Payments | Status: "succeeded", Amount: 49€, Mode: TEST |
| **Webhook empfangen** | Stripe Dashboard → Webhooks → Events | Event: `checkout.session.completed` |
| **Server-Logs** | `pnpm logs \| grep Stripe` | `[Stripe] Payment successful: pi_...` |
| **Email** | Posteingang (falls SMTP konfiguriert) | Subject: "Bestellung bestätigt" |

**✅ Test erfolgreich, wenn:**
- Order in Flinkly sichtbar
- Payment in Stripe Dashboard sichtbar (mit "TEST" Badge)
- Webhook empfangen (200 OK)

---

### ✅ TEST 2: Erfolgreiche Zahlung (Premium Package + Extras)

**Ziel:** Tiered Pricing + Add-ons testen.

**Schritte:**

1. **Gig auswählen:** "Logo-Design"

2. **Package auswählen:**
   - **Premium Package** (z.B. 149€)
   - **Extras hinzufügen:**
     - ✅ "Express-Lieferung (24h)" (+29€)
     - ✅ "Quelldateien" (+19€)
   - **Gesamt:** 149€ + 29€ + 19€ = **197€**

3. **Checkout-Flow durchlaufen** (wie Test 1)

4. **Test-Karte verwenden:** `4242 4242 4242 4242`

5. **Zahlung abschließen**

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **Order-Total** | 197€ (Premium + 2 Extras) |
| **Order-Details** | selectedPackage: "premium", selectedExtras: [1, 2] |
| **Stripe Payment** | Amount: 197€, Mode: TEST |
| **Platform-Fee** | 15% von 197€ = 29,55€ |
| **Seller-Payout** | 85% von 197€ = 167,45€ |

**✅ Test erfolgreich, wenn:**
- Order-Total korrekt berechnet (197€)
- Extras in Order-Details gespeichert
- Platform-Fee korrekt (29,55€)

---

### ❌ TEST 3: Fehlgeschlagene Zahlung (Declined Card)

**Ziel:** Error-Handling testen.

**Schritte:**

1. **Gig auswählen**

2. **Checkout-Flow durchlaufen**

3. **Test-Karte für Declined Payment verwenden:**
   - Kartennummer: `4000 0000 0000 0002`
   - Ablaufdatum: `12/25`
   - CVV: `123`

4. **Zahlung versuchen**

**Erwartetes Verhalten:**

- ❌ Stripe zeigt Error: "Your card was declined"
- ❌ Checkout bleibt auf Step 2 (Zahlungsmethode)
- ✅ User kann andere Zahlungsmethode wählen
- ✅ Order-Status: "pending" (NICHT "in_progress")

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **Stripe Dashboard** | Payment Intent: Status "requires_payment_method" |
| **Webhook empfangen** | Event: `payment_intent.payment_failed` |
| **Flinkly Order** | Status: "pending" oder "failed" |
| **User-Feedback** | Error-Message: "Zahlung fehlgeschlagen. Bitte andere Zahlungsmethode verwenden." |

**✅ Test erfolgreich, wenn:**
- Error-Message angezeigt
- User kann neue Zahlungsmethode eingeben
- Order bleibt "pending"

---

### 🔄 TEST 4: Refund (Rückerstattung)

**Ziel:** Refund-Flow testen.

**Schritte:**

1. **Bestehende Order auswählen** (aus Test 1)

2. **In Stripe Dashboard:**
   - **Sicherstellen, dass "Viewing test data" Toggle AKTIV ist**
   - Payments → Order finden
   - Payment Intent öffnen
   - **"Refund" Button klicken**

3. **Refund-Details:**
   - **Amount:** 49€ (Full Refund)
   - **Reason:** "Requested by customer"
   - **"Refund" Button klicken**

4. **Bestätigung:** "Refund successful"

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **Stripe Dashboard** | Refund: Status "succeeded", Amount: 49€, Mode: TEST |
| **Webhook empfangen** | Event: `charge.refunded` |
| **Flinkly Order** | Status: "refunded" |
| **Server-Logs** | `[Stripe] Refund successful: re_...` |

**✅ Test erfolgreich, wenn:**
- Refund in Stripe Dashboard sichtbar
- Webhook empfangen
- Order-Status aktualisiert auf "refunded"

---

### 🔐 TEST 5: 3D Secure Authentication

**Ziel:** 3D Secure (PSD2-Compliance) testen.

**Schritte:**

1. **Gig auswählen**

2. **Checkout-Flow durchlaufen**

3. **Test-Karte für 3D Secure verwenden:**
   - Kartennummer: `4000 0027 6000 3184`
   - Ablaufdatum: `12/25`
   - CVV: `123`

4. **Zahlung starten**

5. **3D Secure Modal öffnet sich:**
   - **"Complete authentication" Button klicken**
   - (Im Test-Mode: Automatisch erfolgreich)

6. **Zahlung abschließen**

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **3D Secure Modal** | Modal öffnet sich, "Complete authentication" Button |
| **Stripe Dashboard** | Payment Intent: Status "succeeded", 3D Secure: "authenticated" |
| **Order-Status** | "in_progress" |

**✅ Test erfolgreich, wenn:**
- 3D Secure Modal öffnet sich
- Authentication erfolgreich
- Zahlung abgeschlossen

---

### 💳 TEST 6: Saved Payment Methods

**Ziel:** Wiederkehrende Zahlungen testen.

**Schritte:**

1. **Erste Zahlung:**
   - Checkout-Flow durchlaufen
   - Test-Karte: `4242 4242 4242 4242`
   - ✅ **"Zahlungsmethode für zukünftige Käufe speichern" Checkbox aktivieren**
   - Zahlung abschließen

2. **Prüfen:**
   - Dashboard → Settings → Payment Methods
   - ✅ Gespeicherte Karte sichtbar (z.B. "Visa •••• 4242")

3. **Zweite Zahlung:**
   - Neuen Gig kaufen
   - Checkout-Flow starten
   - **Step 2: Zahlungsmethode**
     - ✅ Gespeicherte Karte wird angezeigt
     - **"Gespeicherte Karte verwenden" auswählen**
     - **KEIN** erneutes Eingeben der Kartendaten erforderlich
   - Zahlung abschließen

**Prüfungen:**

| Check | Erwartetes Ergebnis |
|-------|---------------------|
| **Stripe Dashboard** | Customer: 1 Payment Method gespeichert |
| **Flinkly Dashboard** | Settings → Payment Methods: Karte sichtbar |
| **Checkout-Zeit** | -30% (keine Karteneingabe erforderlich) |

**✅ Test erfolgreich, wenn:**
- Karte wird gespeichert
- Zweite Zahlung ohne erneute Karteneingabe
- Checkout-Zeit deutlich kürzer

---

## ✅ TEST-CHECKLISTE

**Alle Tests durchgeführt?**

- [ ] **Test 1:** Erfolgreiche Zahlung (Basic Package) ✅
- [ ] **Test 2:** Erfolgreiche Zahlung (Premium + Extras) ✅
- [ ] **Test 3:** Fehlgeschlagene Zahlung (Declined Card) ✅
- [ ] **Test 4:** Refund (Rückerstattung) ✅
- [ ] **Test 5:** 3D Secure Authentication ✅
- [ ] **Test 6:** Saved Payment Methods ✅

**Alle Prüfungen erfolgreich?**

- [ ] Orders in Flinkly Dashboard sichtbar
- [ ] Payments in Stripe Dashboard sichtbar (mit "TEST" Badge)
- [ ] Webhooks empfangen (200 OK)
- [ ] Server-Logs zeigen erfolgreiche Payments
- [ ] Error-Handling funktioniert (Declined Card)
- [ ] Refunds funktionieren
- [ ] 3D Secure funktioniert
- [ ] Saved Payment Methods funktionieren

**✅ Wenn ALLE Tests erfolgreich → Bereit für Live-Mode!**

---

## 🔍 TROUBLESHOOTING (TEST-MODE)

### Problem 1: Webhook-Events werden nicht empfangen

**Symptome:**
- Order-Status wird nicht aktualisiert
- Stripe Dashboard → Webhooks → Events zeigt "Failed"

**Lösungen:**

1. **Webhook-Secret prüfen:**
   - Management UI → Settings → Payment
   - `STRIPE_WEBHOOK_SECRET` muss mit Stripe Dashboard übereinstimmen

2. **Dev-Server neu starten:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm dev
   ```

3. **Test-Webhook senden:**
   - Stripe Dashboard → Webhooks → "Send test webhook"
   - Event: `payment_intent.succeeded`

4. **Server-Logs prüfen:**
   ```bash
   pnpm logs | grep Webhook
   ```

---

### Problem 2: Test-Karte wird abgelehnt

**Symptome:**
- Error: "Your card was declined"
- Aber Test-Karte `4242 4242 4242 4242` sollte funktionieren

**Lösungen:**

1. **Prüfe, ob Test-Mode aktiv ist:**
   - Stripe Dashboard: Toggle muss auf "Viewing test data" stehen (NICHT orange)

2. **Prüfe Test-Keys in Flinkly:**
   - Management UI → Settings → Payment
   - `STRIPE_SECRET_KEY` muss mit `sk_test_` beginnen

3. **Browser-Cache löschen:**
   - F12 → Application → Clear storage → "Clear site data"

---

### Problem 3: Stripe Checkout öffnet sich nicht

**Symptome:**
- Nach "Jetzt kaufen" Button: Nichts passiert
- Keine Fehlermeldung

**Lösungen:**

1. **Browser-Console prüfen:**
   - F12 → Console-Tab
   - Fehler-Messages?

2. **Publishable Key prüfen:**
   - Management UI → Settings → Payment
   - `VITE_STRIPE_PUBLISHABLE_KEY` muss mit `pk_test_` beginnen

3. **Dev-Server neu starten:**
   ```bash
   cd /home/ubuntu/flinkly
   pnpm dev
   ```

---

## 📊 MONITORING (TEST-MODE)

### Stripe Dashboard

**Wichtige Dashboards:**

| Dashboard | URL | Zweck |
|-----------|-----|-------|
| **Payments** | https://dashboard.stripe.com/test/payments | Alle Test-Zahlungen |
| **Webhooks** | https://dashboard.stripe.com/test/webhooks | Webhook-Events, Logs |
| **Logs** | https://dashboard.stripe.com/test/logs | API-Requests, Errors |

**Wichtig:** Alle URLs enthalten `/test/` → Test-Mode!

### Flinkly Server-Logs

```bash
cd /home/ubuntu/flinkly
pnpm logs | grep Stripe
```

**Wichtige Log-Messages:**

| Log-Message | Bedeutung |
|-------------|-----------|
| `[Stripe] Payment successful: pi_...` | Zahlung erfolgreich |
| `[Stripe] Webhook verified: payment_intent.succeeded` | Webhook empfangen |
| `[Stripe] Order updated: order_123` | Order-Status aktualisiert |
| `[Stripe] Refund successful: re_...` | Rückerstattung erfolgreich |

---

## 🎯 NÄCHSTE SCHRITTE

**Nach erfolgreichen Tests:**

1. ✅ **Alle 6 Test-Szenarien erfolgreich**
2. ✅ **Keine kritischen Bugs**
3. ✅ **UX-Flow optimiert**
4. ✅ **Team ist confident**

**→ JETZT bereit für Live-Mode!**

**Nächster Guide:**
- 📄 **STRIPE_LIVE_MODE_MIGRATION.md** - Wechsel von Test → Live

---

## 📞 SUPPORT

**Stripe-Support (Test-Mode):**
- Dashboard → Help → "Contact support"
- Erwähne: "Test-Mode Issue"

**Flinkly-Support:**
- Email: support@flinkly.de

---

**Geschätzte Dauer:** 1-2 Stunden  
**Schwierigkeitsgrad:** Einfach  
**Erforderliche Skills:** Keine (Test-Karten sind vorgegeben)

**Erstellt von:** Manus AI Agent  
**Datum:** 19. Januar 2025  
**Version:** d79ad4b0
