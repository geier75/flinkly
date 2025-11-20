# 🚀 Stripe Quick-Start - WO muss ich WAS eintragen?

**Ziel:** Stripe Test-Keys in 10 Minuten eintragen  
**Für:** Absolute Anfänger  
**Aufwand:** 10 Minuten

---

## 📍 ÜBERSICHT: 2 ORTE

Du musst Stripe-Keys an **2 Orten** eintragen:

1. **Stripe Dashboard** → Keys HOLEN (kopieren)
2. **Flinkly Management UI** → Keys EINTRAGEN (einfügen)

---

## 🔑 TEIL 1: STRIPE-KEYS HOLEN (5 Min)

### Schritt 1: Stripe Dashboard öffnen

1. **Browser öffnen** (Chrome, Firefox, Safari)
2. **URL eingeben:** https://dashboard.stripe.com
3. **Enter drücken**
4. **Einloggen** (falls nicht eingeloggt)

---

### Schritt 2: Test-Mode aktivieren

**WICHTIG:** Du musst im **Test-Mode** sein (NICHT Live-Mode)!

1. **Oben rechts schauen** → Du siehst einen Toggle-Schalter
2. **Toggle-Text lesen:**
   - ✅ **"Viewing test data"** → RICHTIG (Test-Mode aktiv)
   - ❌ **"Viewing live data"** (orange) → FALSCH (Live-Mode aktiv)
3. **Falls "Viewing live data":**
   - Toggle anklicken
   - Wechselt zu "Viewing test data"

**Visuelle Hilfe:**
```
┌─────────────────────────────────────┐
│ Stripe Dashboard        [Viewing test data ▼] │  ← RICHTIG
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Stripe Dashboard        [Viewing live data ▼] │  ← FALSCH
└─────────────────────────────────────┘
```

---

### Schritt 3: API-Keys-Seite öffnen

1. **Linke Sidebar** → Ganz unten "Developers" finden
2. **"Developers" anklicken**
3. **Untermenü öffnet sich** → "API keys" anklicken

**Klickpfad:**
```
Stripe Dashboard
  └─ Developers (linke Sidebar, unten)
       └─ API keys (anklicken)
```

---

### Schritt 4: Publishable Key kopieren

1. **Auf der API-Keys-Seite:**
   - Du siehst eine Tabelle mit 2 Keys
   - **Publishable key** (erste Zeile)
   - **Secret key** (zweite Zeile)

2. **Publishable Key kopieren:**
   - Rechts neben "Publishable key" siehst du den Key (beginnt mit `pk_test_`)
   - **Kopier-Icon anklicken** (📋 Symbol)
   - Key ist jetzt in der Zwischenablage

**Visuelle Hilfe:**
```
┌────────────────────────────────────────────────────┐
│ Publishable key                                    │
│ pk_test_51Abc...xyz                         [📋]  │  ← HIER klicken
└────────────────────────────────────────────────────┘
```

3. **Key in Notiz-App speichern** (z.B. Notepad, TextEdit)
   - Öffne Notiz-App
   - Einfügen (Ctrl+V / Cmd+V)
   - Label: "Publishable Key"

---

### Schritt 5: Secret Key kopieren

1. **Auf der API-Keys-Seite:**
   - Zweite Zeile: "Secret key"
   - Key ist **versteckt** (aus Sicherheitsgründen)

2. **Secret Key anzeigen:**
   - Rechts neben "Secret key" siehst du "Reveal test key token"
   - **"Reveal test key token" anklicken**
   - Key wird angezeigt (beginnt mit `sk_test_`)

3. **Secret Key kopieren:**
   - **Kopier-Icon anklicken** (📋 Symbol)
   - Key ist jetzt in der Zwischenablage

**Visuelle Hilfe:**
```
┌────────────────────────────────────────────────────┐
│ Secret key                                         │
│ •••••••••••••••••••••      [Reveal test key token]│  ← HIER klicken
└────────────────────────────────────────────────────┘

Nach dem Klick:
┌────────────────────────────────────────────────────┐
│ Secret key                                         │
│ sk_test_51Abc...xyz                         [📋]  │  ← DANN hier klicken
└────────────────────────────────────────────────────┘
```

4. **Key in Notiz-App speichern**
   - Einfügen (Ctrl+V / Cmd+V)
   - Label: "Secret Key"

---

### ✅ Checkpoint: Du hast jetzt 2 Keys

**In deiner Notiz-App solltest du jetzt haben:**
```
Publishable Key: pk_test_51Abc...xyz
Secret Key: sk_test_51Abc...xyz
```

**Weiter zu Teil 2!**

---

## ⚙️ TEIL 2: KEYS IN FLINKLY EINTRAGEN (5 Min)

### Schritt 1: Flinkly Management UI öffnen

**Option A: Via Chatbox-Header**
1. **Flinkly-Website öffnen:** https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer
2. **Oben rechts** → ⚙️ Icon (Zahnrad) finden
3. **⚙️ Icon anklicken**
4. **Management UI öffnet sich** im rechten Panel

**Option B: Direkter Link**
1. **Browser öffnen**
2. **URL eingeben:** https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer
3. **Enter drücken**
4. **Management UI öffnet sich**

**Visuelle Hilfe:**
```
┌─────────────────────────────────────┐
│ Flinkly         [Gig erstellen] [⚙️] │  ← HIER klicken
└─────────────────────────────────────┘
```

---

### Schritt 2: Payment-Settings öffnen

1. **Management UI ist offen** (rechtes Panel oder neuer Tab)
2. **Linke Sidebar** → "Settings" finden
3. **"Settings" anklicken**
4. **Untermenü öffnet sich** → "Payment" anklicken

**Klickpfad:**
```
Management UI
  └─ Settings (linke Sidebar)
       └─ Payment (anklicken)
```

**Visuelle Hilfe:**
```
┌─────────────────┐
│ Management UI   │
│                 │
│ ├─ Preview      │
│ ├─ Code         │
│ ├─ Dashboard    │
│ ├─ Database     │
│ ├─ Settings  ◄──┼── HIER klicken
│ │   ├─ General │
│ │   ├─ Domains │
│ │   ├─ Payment ◄┼── DANN hier klicken
│ │   └─ Secrets  │
│ └─ Publish      │
└─────────────────┘
```

---

### Schritt 3: Stripe-Keys eintragen

1. **Payment-Settings-Panel öffnet sich** (rechte Seite)
2. **Du siehst mehrere Eingabefelder:**
   - STRIPE_SECRET_KEY
   - VITE_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET (ignorieren für jetzt)

3. **Secret Key eintragen:**
   - **Feld "STRIPE_SECRET_KEY" finden**
   - **In das Feld klicken**
   - **Secret Key einfügen** (Ctrl+V / Cmd+V)
   - **Prüfen:** Key beginnt mit `sk_test_`

4. **Publishable Key eintragen:**
   - **Feld "VITE_STRIPE_PUBLISHABLE_KEY" finden**
   - **In das Feld klicken**
   - **Publishable Key einfügen** (Ctrl+V / Cmd+V)
   - **Prüfen:** Key beginnt mit `pk_test_`

**Visuelle Hilfe:**
```
┌────────────────────────────────────────────────────┐
│ Payment Settings                                   │
│                                                    │
│ STRIPE_SECRET_KEY                                  │
│ ┌────────────────────────────────────────────────┐ │
│ │ sk_test_51Abc...xyz                            │ │  ← Secret Key hier
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ VITE_STRIPE_PUBLISHABLE_KEY                        │
│ ┌────────────────────────────────────────────────┐ │
│ │ pk_test_51Abc...xyz                            │ │  ← Publishable Key hier
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ STRIPE_WEBHOOK_SECRET                              │
│ ┌────────────────────────────────────────────────┐ │
│ │ (leer lassen für jetzt)                        │ │  ← Ignorieren
│ └────────────────────────────────────────────────┘ │
│                                                    │
│                                        [Save]      │  ← DANN hier klicken
└────────────────────────────────────────────────────┘
```

---

### Schritt 4: Speichern

1. **Unten rechts** → "Save" Button finden
2. **"Save" Button anklicken**
3. **Bestätigung:** Toast-Message erscheint
   - "Payment settings saved successfully" ✅

**Falls Fehler:**
- Prüfe, ob Keys korrekt kopiert wurden
- Prüfe, ob Keys mit `sk_test_` und `pk_test_` beginnen
- Keine Leerzeichen am Anfang/Ende

---

### Schritt 5: Dev-Server neu starten

**WICHTIG:** Server muss neu gestartet werden, damit Keys geladen werden!

1. **Terminal öffnen** (auf deinem Computer)
2. **Zum Flinkly-Projekt navigieren:**
   ```bash
   cd /home/ubuntu/flinkly
   ```
3. **Dev-Server stoppen:**
   - Drücke `Ctrl+C` (Windows/Linux) oder `Cmd+C` (Mac)
4. **Dev-Server neu starten:**
   ```bash
   pnpm dev
   ```
5. **Warten bis Server läuft:**
   ```
   Server running on http://localhost:3000/
   ```

**Visuelle Hilfe:**
```
Terminal:
┌────────────────────────────────────────────────────┐
│ $ cd /home/ubuntu/flinkly                          │
│ $ pnpm dev                                         │
│ > flinkly@1.0.0 dev                                │
│ > vite                                             │
│                                                    │
│ [Stripe] Publishable key loaded: pk_test_...  ✅   │  ← WICHTIG
│ Server running on http://localhost:3000/      ✅   │
└────────────────────────────────────────────────────┘
```

---

## ✅ FERTIG! Keys sind eingetragen

**Du hast erfolgreich:**
- ✅ Stripe Test-Keys aus Stripe Dashboard kopiert
- ✅ Keys in Flinkly Management UI eingetragen
- ✅ Dev-Server neu gestartet

**Nächster Schritt:**
- 📄 **STRIPE_TEST_MODE_GUIDE.md** öffnen
- 6 Test-Szenarien durchführen
- Test-Karte verwenden: `4242 4242 4242 4242`

---

## 🔧 TROUBLESHOOTING

### Problem: "Save" Button ist ausgegraut

**Lösung:**
- Prüfe, ob beide Felder ausgefüllt sind
- Prüfe, ob Keys korrekt sind (beginnen mit `sk_test_` und `pk_test_`)

---

### Problem: Toast-Message "Error saving settings"

**Lösung:**
1. **Browser-Console öffnen** (F12 → Console-Tab)
2. **Fehler-Message lesen**
3. **Häufigste Ursachen:**
   - Keys haben Leerzeichen am Anfang/Ende
   - Keys sind nicht vollständig kopiert
   - Falscher Key-Typ (Live statt Test)

---

### Problem: Dev-Server zeigt "Invalid API key"

**Lösung:**
1. **Prüfe Keys in Management UI:**
   - Settings → Payment
   - Keys müssen mit `sk_test_` und `pk_test_` beginnen
2. **Dev-Server neu starten:**
   ```bash
   pnpm dev
   ```

---

### Problem: Ich finde das ⚙️ Icon nicht

**Lösung:**
- **Option 1:** Direkten Link verwenden
  - https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer
- **Option 2:** Browser-Fenster vergrößern
  - Icon ist möglicherweise versteckt bei kleinem Fenster

---

## 📞 HILFE

**Falls du nicht weiterkommst:**
1. **Screenshots machen** von:
   - Stripe Dashboard (API-Keys-Seite)
   - Flinkly Management UI (Payment-Settings)
   - Terminal (Dev-Server-Output)
2. **Support kontaktieren:**
   - Email: support@flinkly.de
   - Screenshots anhängen

---

## 🎯 NÄCHSTE SCHRITTE

**Nach erfolgreicher Konfiguration:**

1. **Test-Szenarien durchführen:**
   - 📄 **STRIPE_TEST_MODE_GUIDE.md** öffnen
   - 6 Tests durchführen (1-2h)
   - Test-Karte: `4242 4242 4242 4242`

2. **Webhook konfigurieren:**
   - Siehe STRIPE_TEST_MODE_GUIDE.md → Schritt 2

3. **Erste Test-Zahlung:**
   - Flinkly öffnen
   - Gig kaufen
   - Test-Karte verwenden
   - Prüfen ob Order erstellt wird

---

**Geschätzte Dauer:** 10 Minuten  
**Schwierigkeitsgrad:** Sehr einfach  
**Erforderliche Skills:** Keine

**Erstellt von:** Manus AI Agent  
**Datum:** 19. Januar 2025  
**Version:** 92aa6806
