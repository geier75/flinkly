# 🔐 Stripe Setup - SICHERE Methode (Secrets)

**Ziel:** Stripe Test-Keys SICHER eintragen (verschlüsselt, server-seitig)  
**Methode:** Manus Secrets Management (NICHT in der App!)  
**Aufwand:** 10 Minuten

---

## ⚠️ WICHTIG: SECRETS vs. PAYMENT SETTINGS

**❌ FALSCH: Payment Settings**
- Keys sind in der App sichtbar
- Jeder mit Zugriff auf Management UI kann Keys sehen
- **NICHT SICHER!**

**✅ RICHTIG: Secrets**
- Keys sind server-seitig verschlüsselt
- Nicht öffentlich zugänglich
- Automatisch in ENV injiziert
- **SICHER!**

---

## 🔑 TEIL 1: STRIPE-KEYS HOLEN (5 Min)

### Schritt 1: Stripe Dashboard öffnen

1. **Browser öffnen**
2. **URL:** https://dashboard.stripe.com
3. **Einloggen**

---

### Schritt 2: Test-Mode aktivieren

**WICHTIG:** Test-Mode muss aktiv sein!

1. **Oben rechts** → Toggle-Schalter finden
2. **Prüfen:**
   - ✅ **"Viewing test data"** → RICHTIG
   - ❌ **"Viewing live data"** (orange) → FALSCH

3. **Falls "Viewing live data":**
   - Toggle anklicken → wechselt zu "Viewing test data"

---

### Schritt 3: API-Keys-Seite öffnen

**Klickpfad:**
```
Stripe Dashboard
  └─ Developers (linke Sidebar, unten)
       └─ API keys
```

---

### Schritt 4: Keys kopieren

1. **Publishable Key kopieren:**
   - Rechts neben "Publishable key" → 📋 Icon klicken
   - Key beginnt mit `pk_test_`
   - In Notiz-App speichern

2. **Secret Key kopieren:**
   - "Reveal test key token" klicken
   - Rechts neben Key → 📋 Icon klicken
   - Key beginnt mit `sk_test_`
   - In Notiz-App speichern

**Du hast jetzt:**
```
Publishable Key: pk_test_51Abc...xyz
Secret Key: sk_test_51Abc...xyz
```

---

## 🔒 TEIL 2: KEYS IN SECRETS EINTRAGEN (5 Min)

### Schritt 1: Management UI öffnen

**Option A: Via Chatbox**
1. Flinkly öffnen
2. Oben rechts → ⚙️ Icon klicken
3. Management UI öffnet sich

**Option B: Direkter Link**
- https://3000-i1mh60iuo3drq8kog1m91-5a5cdc32.manusvm.computer

---

### Schritt 2: Secrets öffnen

**Klickpfad:**
```
Management UI
  └─ Settings (linke Sidebar)
       └─ Secrets ← WICHTIG: Secrets, NICHT Payment!
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
│ │   ├─ Payment │  ← NICHT hier!
│ │   └─ Secrets ◄┼── HIER klicken!
│ └─ Publish      │
└─────────────────┘
```

---

### Schritt 3: Stripe-Keys eintragen

**Secrets-Panel öffnet sich** (rechte Seite)

#### 3.1 Secret Key eintragen

1. **"Add Secret" Button klicken** (falls noch keine Secrets)
   - Oder: Bestehenden Secret bearbeiten

2. **Secret Key eintragen:**
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_51Abc...xyz` (dein Secret Key)
   - **"Save" klicken**

#### 3.2 Publishable Key eintragen

1. **"Add Secret" Button klicken**

2. **Publishable Key eintragen:**
   - **Key:** `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value:** `pk_test_51Abc...xyz` (dein Publishable Key)
   - **"Save" klicken**

**Visuelle Hilfe:**
```
┌────────────────────────────────────────────────────┐
│ Secrets                                            │
│                                                    │
│ [Add Secret]                                       │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ STRIPE_SECRET_KEY                              │ │
│ │ ••••••••••••••••••••                   [Edit]  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ VITE_STRIPE_PUBLISHABLE_KEY                    │ │
│ │ ••••••••••••••••••••                   [Edit]  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ STRIPE_WEBHOOK_SECRET                          │ │
│ │ (leer lassen für jetzt)                [Edit]  │ │
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

---

### Schritt 4: Dev-Server neu starten

**WICHTIG:** Server muss neu gestartet werden!

```bash
cd /home/ubuntu/flinkly
pnpm dev
```

**Erwartete Ausgabe:**
```
[Stripe] Publishable key loaded: pk_test_...  ✅
Server running on http://localhost:3000/      ✅
```

---

## ✅ FERTIG! Keys sind SICHER eingetragen

**Du hast erfolgreich:**
- ✅ Stripe Test-Keys aus Stripe Dashboard kopiert
- ✅ Keys in **Secrets** eingetragen (verschlüsselt, server-seitig)
- ✅ Dev-Server neu gestartet

**Nächster Schritt:**
- 📄 **STRIPE_TEST_MODE_GUIDE.md** öffnen
- 6 Test-Szenarien durchführen

---

## 🔒 WARUM SECRETS SICHER SIND

**Secrets-Vorteile:**
- ✅ **Server-seitig verschlüsselt** (AES-256)
- ✅ **Nicht im Frontend** (Keys werden nie an Browser gesendet)
- ✅ **Nicht in Git** (automatisch ignoriert)
- ✅ **Zugriffskontrolle** (nur autorisierte User)
- ✅ **Audit-Log** (wer hat wann geändert)

**Payment-Settings-Nachteile:**
- ❌ **In der App sichtbar** (jeder mit UI-Zugriff kann sehen)
- ❌ **Nicht verschlüsselt** (Klartext)
- ❌ **Keine Zugriffskontrolle**

---

## 🔧 TROUBLESHOOTING

### Problem: "Add Secret" Button fehlt

**Lösung:**
- Prüfe, ob du in **Settings → Secrets** bist (NICHT Payment!)
- Falls Secrets-Panel leer: Scroll nach unten

---

### Problem: Secret wird nicht gespeichert

**Lösung:**
1. **Prüfe Key-Name:**
   - Exakt: `STRIPE_SECRET_KEY` (Groß-/Kleinschreibung beachten!)
   - Exakt: `VITE_STRIPE_PUBLISHABLE_KEY`
2. **Prüfe Value:**
   - Keine Leerzeichen am Anfang/Ende
   - Key vollständig kopiert

---

### Problem: Dev-Server zeigt "Invalid API key"

**Lösung:**
1. **Secrets prüfen:**
   - Settings → Secrets
   - Keys müssen mit `sk_test_` und `pk_test_` beginnen
2. **Dev-Server neu starten:**
   ```bash
   pnpm dev
   ```
3. **Browser-Cache löschen:**
   - F12 → Application → Clear storage

---

## 📞 HILFE

**Falls du nicht weiterkommst:**
- Email: support@flinkly.de
- Screenshots anhängen:
  - Stripe Dashboard (API-Keys-Seite)
  - Management UI (Secrets-Panel)
  - Terminal (Dev-Server-Output)

---

## 🎯 NÄCHSTE SCHRITTE

1. **Webhook konfigurieren:**
   - Siehe STRIPE_TEST_MODE_GUIDE.md → Schritt 2
   - Webhook-Secret auch in Secrets eintragen

2. **Test-Szenarien durchführen:**
   - 📄 STRIPE_TEST_MODE_GUIDE.md öffnen
   - 6 Tests durchführen
   - Test-Karte: `4242 4242 4242 4242`

3. **Live-Mode aktivieren:**
   - Nach erfolgreichen Tests
   - STRIPE_LIVE_MODE_MIGRATION.md folgen

---

**Geschätzte Dauer:** 10 Minuten  
**Schwierigkeitsgrad:** Sehr einfach  
**Sicherheit:** ✅ Hoch (verschlüsselt, server-seitig)

**Erstellt von:** Manus AI Agent  
**Datum:** 19. Januar 2025  
**Version:** 92aa6806
