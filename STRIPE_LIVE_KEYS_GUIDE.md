# 🔐 Stripe Live-Keys Konfiguration - Anleitung

**Task:** Stripe Live-Keys konfigurieren (2h)  
**Priorität:** P0 (Kritisch - Blockiert echte Zahlungen)  
**Status:** Manuelle Konfiguration erforderlich

---

## ✅ Voraussetzungen

- Stripe-Account erstellt (https://dashboard.stripe.com)
- Geschäftsdaten verifiziert (Name, Adresse, Steuernummer)
- Bankkonto für Auszahlungen hinterlegt

---

## 📋 Schritt-für-Schritt-Anleitung

### 1. Stripe Live-Keys abrufen (5 Min)

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Zu "Developers" → "API keys" navigieren**
3. **"Viewing test data" Toggle auf "Live" umschalten**
4. **Live-Keys kopieren:**
   - `STRIPE_SECRET_KEY` (sk_live_...)
   - `STRIPE_PUBLISHABLE_KEY` (pk_live_...)

⚠️ **Wichtig:** Niemals Secret-Keys im Frontend oder in Git committen!

---

### 2. Live-Keys in Flinkly Management UI eintragen (10 Min)

1. **Flinkly Management UI öffnen:**
   - Klicke auf das ⚙️ Icon in der Chatbox-Header
   - Oder öffne direkt: https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

2. **Zu "Settings" → "Payment" navigieren**

3. **Live-Keys eintragen:**
   - `STRIPE_SECRET_KEY`: sk_live_...
   - `VITE_STRIPE_PUBLISHABLE_KEY`: pk_live_...

4. **Speichern** klicken

---

### 3. Webhook-URL in Stripe Dashboard eintragen (15 Min)

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Zu "Developers" → "Webhooks" navigieren**
3. **"Add endpoint" klicken**
4. **Webhook-URL eintragen:**
   ```
   https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/api/webhooks/stripe
   ```

5. **Events auswählen:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `checkout.session.completed`
   - `payout.paid`
   - `payout.failed`

6. **Webhook-Secret kopieren:**
   - Nach dem Erstellen wird ein `whsec_...` Secret angezeigt
   - Dieses Secret in Flinkly Management UI unter `STRIPE_WEBHOOK_SECRET` eintragen

---

### 4. Test-Checkout mit echten Karten durchführen (30 Min)

⚠️ **Wichtig:** Verwende kleine Beträge (1-5€) für Tests!

#### Test-Szenario 1: Erfolgreiche Zahlung

1. **Gig auswählen** (z.B. "Logo-Design" für 49€)
2. **Checkout-Flow durchlaufen:**
   - Briefing ausfüllen
   - Zahlungsmethode: Kreditkarte
   - Echte Kreditkarte verwenden (NICHT Test-Cards!)
3. **Zahlung abschließen**
4. **Prüfen:**
   - ✅ Order in Flinkly Dashboard sichtbar?
   - ✅ Zahlung in Stripe Dashboard sichtbar?
   - ✅ Webhook-Event empfangen? (Stripe Dashboard → Webhooks → Events)
   - ✅ E-Mail-Bestätigung erhalten?

#### Test-Szenario 2: Fehlgeschlagene Zahlung

1. **Gig auswählen**
2. **Checkout-Flow durchlaufen**
3. **Zahlungsmethode:** Kreditkarte mit unzureichendem Guthaben
4. **Prüfen:**
   - ✅ Fehler-Message angezeigt?
   - ✅ Order-Status: "pending" oder "failed"?
   - ✅ Webhook-Event `payment_intent.payment_failed` empfangen?

#### Test-Szenario 3: Refund (Rückerstattung)

1. **Bestehende Order auswählen**
2. **In Stripe Dashboard:**
   - Payment Intent öffnen
   - "Refund" klicken
   - Betrag eingeben (z.B. 49€)
   - Refund bestätigen
3. **Prüfen:**
   - ✅ Webhook-Event `charge.refunded` empfangen?
   - ✅ Order-Status aktualisiert?
   - ✅ Buyer erhält E-Mail-Benachrichtigung?

---

### 5. Payout-Flow testen (30 Min)

⚠️ **Wichtig:** Payouts erfolgen automatisch nach 7 Tagen (Standard-Einstellung).

#### Manuelle Payout-Auslösung (für Tests):

1. **Stripe Dashboard öffnen:** https://dashboard.stripe.com
2. **Zu "Balance" navigieren**
3. **"Payout now" klicken** (falls verfügbar)
4. **Prüfen:**
   - ✅ Payout in Stripe Dashboard sichtbar?
   - ✅ Webhook-Event `payout.paid` empfangen?
   - ✅ Seller erhält E-Mail-Benachrichtigung?
   - ✅ Bankkonto erhält Überweisung (1-3 Werktage)?

#### Automatische Payout-Einstellungen:

1. **Stripe Dashboard → Settings → Payouts**
2. **Payout-Schedule konfigurieren:**
   - **Daily:** Täglich (empfohlen für hohe Transaktionsvolumen)
   - **Weekly:** Wöchentlich (Standard)
   - **Monthly:** Monatlich
3. **Minimum-Payout-Betrag:** 10€ (empfohlen)

---

### 6. Sicherheits-Checkliste (15 Min)

- [ ] **HTTPS erzwingen:** Production-Deployment nur über HTTPS
- [ ] **Webhook-Signature-Verification aktiviert:** (bereits im Code implementiert)
- [ ] **Rate-Limiting aktiviert:** (bereits im Code implementiert)
- [ ] **Secret-Keys niemals im Frontend:** (bereits korrekt implementiert)
- [ ] **Stripe Radar aktiviert:** (optional, für Fraud-Detection)
- [ ] **3D Secure aktiviert:** (optional, für EU-Compliance)

---

## 🔍 Troubleshooting

### Problem: Webhook-Events werden nicht empfangen

**Lösung:**
1. Prüfe Webhook-URL in Stripe Dashboard (muss öffentlich erreichbar sein)
2. Prüfe Webhook-Secret in Flinkly Management UI
3. Prüfe Logs in Stripe Dashboard → Webhooks → Events → "View logs"
4. Prüfe Server-Logs: `pnpm logs` (im Flinkly-Projekt)

### Problem: Zahlung schlägt fehl mit "Invalid API Key"

**Lösung:**
1. Prüfe, ob Live-Keys korrekt eingetragen sind (nicht Test-Keys!)
2. Prüfe, ob "Viewing test data" Toggle auf "Live" steht
3. Prüfe, ob Keys mit `sk_live_` und `pk_live_` beginnen

### Problem: Payout schlägt fehl

**Lösung:**
1. Prüfe Bankkonto-Daten in Stripe Dashboard → Settings → Bank accounts
2. Prüfe, ob Geschäftsdaten verifiziert sind
3. Prüfe, ob Minimum-Payout-Betrag erreicht ist (Standard: 10€)
4. Prüfe Stripe-Balance: Stripe Dashboard → Balance

---

## 📊 Monitoring & Logs

### Stripe Dashboard

- **Payments:** https://dashboard.stripe.com/payments
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Logs:** https://dashboard.stripe.com/logs
- **Balance:** https://dashboard.stripe.com/balance

### Flinkly Server-Logs

```bash
cd /home/ubuntu/flinkly
pnpm logs
```

**Wichtige Log-Messages:**
- `[Stripe] Payment successful: pi_...` → Zahlung erfolgreich
- `[Stripe] Webhook verified: payment_intent.succeeded` → Webhook empfangen
- `[Stripe] Refund successful: re_...` → Rückerstattung erfolgreich

---

## ✅ Task abgeschlossen, wenn:

- [x] Live-Keys in Flinkly Management UI eingetragen
- [x] Webhook-URL in Stripe Dashboard eingetragen
- [x] Test-Checkout mit echten Karten erfolgreich
- [x] Payout-Flow getestet (manuell oder automatisch)
- [x] Sicherheits-Checkliste abgehakt
- [x] Monitoring & Logs überprüft

---

## 🚀 Nächste Schritte

Nach erfolgreicher Konfiguration:
1. **Soft-Launch** mit 50 Beta-Testern
2. **Monitoring** der ersten echten Transaktionen
3. **Feedback** sammeln und Bugs fixen
4. **Public-Launch** nach 1-2 Wochen

---

**Geschätzte Gesamtdauer:** 2 Stunden  
**Schwierigkeitsgrad:** Mittel  
**Erforderliche Skills:** Stripe-Grundkenntnisse, Zugang zu Stripe-Dashboard
