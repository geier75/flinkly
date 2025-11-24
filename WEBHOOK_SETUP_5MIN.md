# ⚡ Webhook-Setup in 5 Minuten

**Ziel:** Stripe-Webhooks konfigurieren, damit Flinkly über Zahlungen benachrichtigt wird.

**Dauer:** 5 Minuten

---

## 🎯 SCHRITT 1: Stripe Dashboard öffnen (30 Sek)

1. **Browser öffnen**
2. **URL:** https://dashboard.stripe.com/test/webhooks
3. **Einloggen** (falls nicht eingeloggt)
4. **Test-Mode aktivieren** (Toggle oben rechts: "Viewing test data")

✅ **Checkpoint:** Du siehst die Webhooks-Seite mit "Add endpoint" Button

---

## 🎯 SCHRITT 2: Webhook-Endpoint erstellen (2 Min)

1. **"Add endpoint" Button klicken** (oben rechts, blau)

2. **Endpoint URL eingeben:**
   ```
   https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/api/webhooks/stripe
   ```
   ⚠️ **WICHTIG:** Diese URL ist für Development! Für Production musst du die Live-URL verwenden.

3. **"Select events to listen to" klicken**

4. **Events auswählen** (8 Events):
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
   - ✅ `charge.dispute.created`
   - ✅ `charge.dispute.closed`
   - ✅ `payout.paid`
   - ✅ `payout.failed`

   **Schnell-Tipp:** Nutze die Suchfunktion (Ctrl+F) um Events schnell zu finden!

5. **"Add events" Button klicken** (unten rechts)

6. **"Add endpoint" Button klicken** (ganz unten)

✅ **Checkpoint:** Webhook-Endpoint wurde erstellt, du siehst die Detail-Seite

---

## 🎯 SCHRITT 3: Webhook-Secret kopieren (1 Min)

1. **Auf der Webhook-Detail-Seite:** Scrolle nach unten zu **"Signing secret"**

2. **"Reveal" klicken** (neben "Signing secret")

3. **Secret kopieren** (beginnt mit `whsec_...`)
   - Klicke auf das Copy-Icon (📋)
   - ODER: Markiere den Text und drücke Ctrl+C

✅ **Checkpoint:** Du hast das Webhook-Secret in der Zwischenablage (whsec_...)

---

## 🎯 SCHRITT 4: Secret in Flinkly eintragen (1,5 Min)

1. **Flinkly Management UI öffnen:**
   - Klicke auf ⚙️ Icon (oben rechts)
   - ODER: Öffne direkt: https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

2. **Settings → Secrets öffnen:**
   - Linke Sidebar: "Settings" klicken
   - Dann: "Secrets" klicken

3. **Webhook-Secret eintragen:**
   - Suche nach: `STRIPE_WEBHOOK_SECRET`
   - Falls NICHT vorhanden: "Add Secret" klicken
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (aus Zwischenablage einfügen)
   - **"Save" klicken**

4. **Dev-Server neu starten:**
   - Terminal öffnen
   - `cd /home/ubuntu/flinkly`
   - `pnpm dev`
   - Warte 5 Sekunden

✅ **Checkpoint:** Secret ist gespeichert, Server läuft

---

## 🎯 SCHRITT 5: Webhook testen (30 Sek)

1. **Zurück zu Stripe Dashboard → Webhook-Detail-Seite**

2. **"Send test webhook" Button klicken** (oben rechts)

3. **Event auswählen:** `checkout.session.completed`

4. **"Send test webhook" klicken**

5. **Ergebnis prüfen:**
   - ✅ **Erfolg:** "200 OK" (grün)
   - ❌ **Fehler:** "500" oder "404" (rot)

✅ **Checkpoint:** Webhook funktioniert! (200 OK)

---

## ✅ FERTIG!

**Du hast erfolgreich Webhooks konfiguriert!** 🎉

**Was jetzt passiert:**
- Stripe sendet Events an Flinkly
- Flinkly verarbeitet Zahlungen automatisch
- Order-Status wird aktualisiert
- Emails werden versendet

---

## 🔧 TROUBLESHOOTING

### Problem: "404 Not Found"

**Ursache:** Endpoint-URL ist falsch

**Lösung:**
1. Prüfe URL: `https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/api/webhooks/stripe`
2. Stelle sicher, dass Dev-Server läuft (`pnpm dev`)
3. Teste URL im Browser: https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer/

---

### Problem: "500 Internal Server Error"

**Ursache:** Webhook-Secret ist falsch oder nicht gesetzt

**Lösung:**
1. Prüfe Secret in Settings → Secrets
2. Stelle sicher, dass `STRIPE_WEBHOOK_SECRET` gesetzt ist
3. Secret muss mit `whsec_` beginnen
4. Dev-Server neu starten (`pnpm dev`)

---

### Problem: "401 Unauthorized"

**Ursache:** Signature-Verification fehlgeschlagen

**Lösung:**
1. Prüfe, dass Webhook-Secret korrekt ist
2. Stelle sicher, dass du den Secret vom RICHTIGEN Webhook kopiert hast (Test-Mode vs Live-Mode)
3. Dev-Server neu starten

---

## 📋 CHECKLISTE

- [ ] Stripe Dashboard geöffnet (Test-Mode)
- [ ] Webhook-Endpoint erstellt
- [ ] 8 Events ausgewählt
- [ ] Webhook-Secret kopiert (whsec_...)
- [ ] Secret in Flinkly Secrets eingetragen
- [ ] Dev-Server neu gestartet
- [ ] Test-Webhook gesendet (200 OK)

---

## 🚀 NÄCHSTE SCHRITTE

**Nach erfolgreicher Webhook-Konfiguration:**

1. **Test-Zahlung durchführen** (5 Min)
   - Öffne Flinkly Marketplace
   - Wähle einen Gig
   - Nutze Test-Karte: 4242 4242 4242 4242
   - Prüfe ob Order erstellt wird

2. **Live-Mode aktivieren** (30 Min)
   - Live-Keys in Secrets eintragen
   - Live-Webhook konfigurieren (gleiche Schritte, aber mit Live-URL)
   - Erste echte Zahlung (1-5€)

3. **Soft-Launch starten!** 🎉

---

**Erstellt:** 19. Januar 2025  
**Version:** f52a41b0
