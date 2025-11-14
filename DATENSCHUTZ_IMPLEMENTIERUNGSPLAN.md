# Datenschutzerklärung - Implementierungsplan

**Datum:** 2025-01-14  
**Phase:** 3 - Implementierungsplan erstellen  
**Basis:** DATENSCHUTZ_FACHKONZEPT.md

---

## 1. Dateien/Komponenten (Erstellen oder Anpassen)

### 1.1 Hauptdatei: Privacy.tsx

**Pfad:** `client/src/pages/Privacy.tsx`

**Aktion:** **Vollständig neu schreiben** (existierende Datei ist veraltet/unvollständig)

**Struktur:**
- Header mit Zurück-Button, Titel, Stand
- 18 Abschnitte (siehe DATENSCHUTZ_FACHKONZEPT.md)
- Self-Service-Tools-Hinweis (Live Privacy Dashboard, Datenexport, Account-Deletion)
- Kontakt-Informationen
- **KEIN** "Beispiel"-Hinweis am Ende

**Technische Anforderungen:**
- React-Komponente (TypeScript)
- Tailwind CSS für Styling
- Wouter für Navigation (Link-Komponente)
- Accessibility (Heading-Hierarchie, ARIA-Labels)
- Responsive Design (Mobile-First)

---

### 1.2 Footer-Integration

**Pfad:** `client/src/components/Footer.tsx` (TODO: prüfen ob existiert)

**Aktion:** Footer-Komponente erstellen oder anpassen

**Inhalt:**
- Link zu Datenschutzerklärung (/privacy)
- Link zu AGB (/terms)
- Link zu Impressum (/impressum)
- Link zu Widerruf (/widerruf) - TODO: erstellen
- Copyright-Notice

**Technische Anforderungen:**
- React-Komponente (TypeScript)
- Tailwind CSS
- Wouter Link-Komponente
- Sticky Footer (immer am unteren Bildschirmrand)

---

### 1.3 Navigation/Router

**Pfad:** `client/src/App.tsx`

**Aktion:** Route für /privacy prüfen (sollte bereits existieren)

**Erwartete Route:**
```tsx
<Route path="/privacy" component={Privacy} />
```

**Zusätzliche Routen prüfen:**
- /terms (AGB)
- /impressum (Impressum)
- /widerruf (Widerrufsbelehrung) - TODO: erstellen
- /privacy-dashboard (Live Privacy Dashboard) - bereits vorhanden

---

### 1.4 Checkout-Hinweise

**Pfad:** `client/src/pages/Checkout.tsx`

**Aktion:** Datenschutz-Hinweis im Checkout hinzufügen

**Inhalt:**
- Checkbox: "Ich habe die Datenschutzerklärung gelesen und akzeptiere sie"
- Link zur Datenschutzerklärung (/privacy)
- **Pflichtfeld** vor Zahlungsabwicklung

**Position:** Vor dem "Jetzt kaufen"-Button (Step 3: Zahlung)

---

### 1.5 Registrierungs-Hinweise

**Pfad:** `client/src/pages/Register.tsx` (TODO: prüfen ob existiert)

**Aktion:** Datenschutz-Hinweis bei Registrierung hinzufügen

**Inhalt:**
- Text: "Mit der Registrierung akzeptieren Sie unsere [Datenschutzerklärung](/privacy) und [AGB](/terms)"
- Links zu /privacy und /terms

**Position:** Unter dem Registrierungs-Formular

---

### 1.6 Cookie-Consent-Banner

**Pfad:** `client/src/components/CookieConsent.tsx` (TODO: prüfen ob existiert)

**Aktion:** Link zur Datenschutzerklärung im Cookie-Banner hinzufügen

**Inhalt:**
- Text: "Wir verwenden Cookies. Weitere Informationen finden Sie in unserer [Datenschutzerklärung](/privacy)"
- Link zu /privacy

---

## 2. UI-Verlinkung (Wo wird die Datenschutzerklärung verlinkt?)

### 2.1 Footer (Global)

**Sichtbarkeit:** Auf allen Seiten

**Position:** Unten, zentriert oder links

**Link-Text:** "Datenschutzerklärung"

**Ziel:** /privacy

---

### 2.2 Checkout (Pflichtfeld)

**Sichtbarkeit:** Nur auf Checkout-Seite

**Position:** Vor "Jetzt kaufen"-Button (Step 3: Zahlung)

**Link-Text:** "Datenschutzerklärung" (in Checkbox-Label)

**Ziel:** /privacy (öffnet in neuem Tab)

---

### 2.3 Registrierung

**Sichtbarkeit:** Nur auf Registrierungs-Seite

**Position:** Unter Registrierungs-Formular

**Link-Text:** "Datenschutzerklärung" (in Hinweis-Text)

**Ziel:** /privacy

---

### 2.4 Cookie-Consent-Banner

**Sichtbarkeit:** Beim ersten Besuch (oder nach Consent-Widerruf)

**Position:** Unten, zentriert (Overlay)

**Link-Text:** "Datenschutzerklärung" (in Banner-Text)

**Ziel:** /privacy

---

### 2.5 Live Privacy Dashboard

**Sichtbarkeit:** Nur für eingeloggte Nutzer

**Position:** /privacy-dashboard

**Link-Text:** "Vollständige Datenschutzerklärung lesen" (Button)

**Ziel:** /privacy

---

## 3. Komponenten-Referenzen (Welche Komponenten müssen inhaltlich referenziert werden?)

### 3.1 Cookie-Consent-Banner

**Referenz in Privacy.tsx:**
- Abschnitt 1.9: Cookies & ähnliche Technologien
- Beschreibung des Cookie-Consent-Banners
- Cookie-Kategorien (Notwendig, Funktional, Analytisch, Marketing)
- Consent-Logs (Proof-of-Consent)

**Link:** "Sie können Ihre Cookie-Einstellungen jederzeit in unserem [Cookie-Consent-Banner] ändern"

---

### 3.2 Checkout

**Referenz in Privacy.tsx:**
- Abschnitt 1.6: Zahlungsabwicklung (Stripe)
- Beschreibung der Zahlungsabwicklung
- Welche Daten an Stripe übermittelt werden
- Drittlandübermittlung (USA)

**Link:** "Weitere Informationen zur Zahlungsabwicklung finden Sie in unserer [Datenschutzerklärung](/privacy#zahlungsabwicklung)"

---

### 3.3 Registrierung

**Referenz in Privacy.tsx:**
- Abschnitt 1.4: Registrierung & Nutzerkonten
- Welche Daten bei der Registrierung erhoben werden
- Wie Passwörter gespeichert werden (gehasht)

**Link:** "Weitere Informationen zur Datenverarbeitung bei der Registrierung finden Sie in unserer [Datenschutzerklärung](/privacy#registrierung)"

---

### 3.4 Messaging-System

**Referenz in Privacy.tsx:**
- Abschnitt 1.7: Messaging-System (Real-time Chat)
- Beschreibung des Messaging-Systems
- Welche Daten gespeichert werden (Nachrichten, Attachments, Read-Status)
- Speicherdauer (Bis zur Löschung durch Nutzer)

---

### 3.5 Live Privacy Dashboard

**Referenz in Privacy.tsx:**
- Abschnitt 1.13: DSGVO++ Features
- Beschreibung des Live Privacy Dashboards
- Datenexport (Art. 20 DSGVO)
- Account-Deletion (Art. 17 DSGVO)

**Link:** "Sie können Ihre Rechte direkt über unser [Live Privacy Dashboard](/privacy-dashboard) ausüben"

---

### 3.6 Seller-Verifizierung

**Referenz in Privacy.tsx:**
- Abschnitt 1.8: Seller-Verifizierung
- Beschreibung der Verifizierungs-Prozesse (E-Mail, Telefon, Admin-Approval)
- Welche Daten erhoben werden (Telefon-Nummer, Verifizierungs-Status)

---

## 4. Technische Umsetzung (Schritt-für-Schritt)

### Schritt 1: Footer-Komponente erstellen/prüfen

**Aktion:**
1. Prüfen ob `client/src/components/Footer.tsx` existiert
2. Falls nicht: Footer-Komponente erstellen
3. Links zu /privacy, /terms, /impressum hinzufügen
4. Footer in Layout-Komponente integrieren (z.B. `client/src/App.tsx`)

---

### Schritt 2: Privacy.tsx vollständig neu schreiben

**Aktion:**
1. Existierende `client/src/pages/Privacy.tsx` löschen (Backup erstellen)
2. Neue Privacy.tsx erstellen mit 18 Abschnitten (siehe DATENSCHUTZ_FACHKONZEPT.md)
3. Alle technischen Systeme beschreiben (Stripe, Analytics, Exit-Intent, Messaging, etc.)
4. Self-Service-Tools-Hinweis hinzufügen (Live Privacy Dashboard, Datenexport, Account-Deletion)
5. Kontakt-Informationen hinzufügen
6. **KEIN** "Beispiel"-Hinweis am Ende

---

### Schritt 3: Checkout-Hinweise hinzufügen

**Aktion:**
1. `client/src/pages/Checkout.tsx` öffnen
2. Datenschutz-Checkbox vor "Jetzt kaufen"-Button hinzufügen (Step 3: Zahlung)
3. Link zur Datenschutzerklärung (/privacy) in Checkbox-Label
4. Checkbox als Pflichtfeld markieren (disabled "Jetzt kaufen"-Button wenn nicht gecheckt)

---

### Schritt 4: Registrierungs-Hinweise hinzufügen

**Aktion:**
1. Prüfen ob `client/src/pages/Register.tsx` existiert
2. Falls ja: Datenschutz-Hinweis unter Registrierungs-Formular hinzufügen
3. Links zu /privacy und /terms

---

### Schritt 5: Cookie-Consent-Banner-Link hinzufügen

**Aktion:**
1. Prüfen ob `client/src/components/CookieConsent.tsx` existiert
2. Falls ja: Link zur Datenschutzerklärung (/privacy) im Banner-Text hinzufügen

---

### Schritt 6: Live Privacy Dashboard-Link hinzufügen

**Aktion:**
1. `client/src/pages/PrivacyDashboard.tsx` öffnen
2. Button "Vollständige Datenschutzerklärung lesen" hinzufügen
3. Link zu /privacy

---

### Schritt 7: Router prüfen

**Aktion:**
1. `client/src/App.tsx` öffnen
2. Route für /privacy prüfen (sollte bereits existieren)
3. Falls nicht: Route hinzufügen

---

## 5. Accessibility-Anforderungen

### 5.1 Heading-Hierarchie

**Anforderung:**
- H1: "Datenschutzerklärung" (nur einmal pro Seite)
- H2: Hauptabschnitte (z.B. "1. Verantwortlicher", "2. Begriffsbestimmungen")
- H3: Unterabschnitte (z.B. "1.1 Kontaktdaten", "2.1 Personenbezogene Daten")

**Umsetzung:**
- Tailwind CSS: `text-4xl font-bold` (H1), `text-2xl font-bold` (H2), `text-xl font-semibold` (H3)

---

### 5.2 ARIA-Labels

**Anforderung:**
- Links zu externen Seiten: `aria-label="Öffnet in neuem Tab"` + `target="_blank"` + `rel="noopener noreferrer"`
- Buttons: `aria-label` mit beschreibendem Text

**Umsetzung:**
- Beispiel: `<a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" aria-label="Stripe Datenschutzerklärung (öffnet in neuem Tab)">Stripe Datenschutzerklärung</a>`

---

### 5.3 Kontrast

**Anforderung:**
- WCAG 2.2 AA: Kontrastverhältnis mindestens 4.5:1 (Text zu Hintergrund)

**Umsetzung:**
- Text: `text-slate-900` (dunkel) auf `bg-white` (hell)
- Links: `text-blue-600 hover:underline`

---

### 5.4 Keyboard-Navigation

**Anforderung:**
- Alle interaktiven Elemente (Links, Buttons) müssen mit Tastatur erreichbar sein
- Focus-States müssen sichtbar sein

**Umsetzung:**
- Tailwind CSS: `focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`

---

## 6. Responsive Design

### 6.1 Mobile-First

**Anforderung:**
- Design für Mobile (320px+) zuerst
- Dann Tablet (768px+)
- Dann Desktop (1024px+)

**Umsetzung:**
- Tailwind CSS: `container mx-auto px-4` (Mobile), `sm:px-6` (Tablet), `lg:px-8` (Desktop)
- Max-Width: `max-w-4xl` (für Lesbarkeit)

---

### 6.2 Touch-Targets

**Anforderung:**
- Mindestens 44x44px für Touch-Targets (Buttons, Links)

**Umsetzung:**
- Tailwind CSS: `min-h-[44px] min-w-[44px]` für Buttons

---

## 7. Zusammenfassung

### ✅ Dateien/Komponenten identifiziert

- Privacy.tsx (vollständig neu schreiben)
- Footer.tsx (erstellen oder anpassen)
- App.tsx (Route prüfen)
- Checkout.tsx (Datenschutz-Checkbox hinzufügen)
- Register.tsx (Datenschutz-Hinweis hinzufügen) - TODO: prüfen ob existiert
- CookieConsent.tsx (Link hinzufügen) - TODO: prüfen ob existiert
- PrivacyDashboard.tsx (Link hinzufügen)

### ✅ UI-Verlinkung geplant

- Footer (Global)
- Checkout (Pflichtfeld)
- Registrierung
- Cookie-Consent-Banner
- Live Privacy Dashboard

### ✅ Komponenten-Referenzen definiert

- Cookie-Consent-Banner → Abschnitt 1.9
- Checkout → Abschnitt 1.6
- Registrierung → Abschnitt 1.4
- Messaging-System → Abschnitt 1.7
- Live Privacy Dashboard → Abschnitt 1.13
- Seller-Verifizierung → Abschnitt 1.8

---

**Status:** ✅ Phase 3 abgeschlossen - Implementierungsplan erstellt
