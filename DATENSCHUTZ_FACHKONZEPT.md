# Datenschutzerklärung - Fachkonzept (Legal & Tech)

**Datum:** 2025-01-14  
**Phase:** 2 - Fachkonzept ausarbeiten  
**Basis:** DATENSCHUTZ_ANALYSE.md

---

## 1. Strukturierte Gliederung (DSGVO-konform)

### 1.1 Einleitung & Verantwortlicher (Art. 13 Abs. 1 lit. a DSGVO)

**Inhalt:**
- Name und Kontaktdaten des Verantwortlichen (MiMi Tech Ai UG)
- Kontaktdaten des Datenschutzbeauftragten (falls vorhanden)
- Zweck der Datenschutzerklärung
- Stand der Datenschutzerklärung

**Mapping auf reale Systeme:**
- Verantwortlicher: MiMi Tech Ai UG (haftungsbeschränkt), Lindenplatz 23, 75378 Bad Liebenzell
- E-Mail: info@mimitechai.com
- Telefon: +49 1575 8805737

---

### 1.2 Begriffsbestimmungen (Art. 4 DSGVO)

**Inhalt:**
- Personenbezogene Daten
- Verarbeitung
- Einwilligung
- Auftragsverarbeiter
- Drittland

**Zweck:** Verständlichkeit für Nutzer erhöhen

---

### 1.3 Hosting & Server-Logs (Art. 6 Abs. 1 lit. f DSGVO)

**Inhalt:**
- Hosting-Provider (Manus Cloud)
- Server-Standort (TODO: zu klären)
- SSL/TLS-Verschlüsselung
- Automatische Backups

**Server-Logs:**
- IP-Adresse
- User-Agent (Browser-Typ, Betriebssystem)
- Request-Methode, URL, Status-Code
- Timestamp
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: IT-Sicherheit, Fehleranalyse)
- **Speicherdauer:** 90 Tage (TODO: implementieren)

**Mapping auf reale Systeme:**
- Express-Server-Logs (automatisch)
- Manus Cloud Hosting

---

### 1.4 Registrierung & Nutzerkonten (Art. 6 Abs. 1 lit. b DSGVO)

**Inhalt:**
- Welche Daten werden bei der Registrierung erhoben?
- Wie werden Passwörter gespeichert? (gehasht, nicht verschlüsselt)
- OAuth-Integration (Manus OAuth)

**Erhobene Daten (DB-Tabelle `users`):**
- OpenID (Manus OAuth-Identifier)
- Name
- E-Mail-Adresse
- Passwort (gehasht mit bcrypt/argon2)
- Profilbild (optional)
- Bio (optional)
- Land (DE, AT, CH)
- Telefon-Nummer (optional, für Verifizierung)
- Verifizierungs-Status (E-Mail, Telefon, Admin-Approval)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Mapping auf reale Systeme:**
- DB-Tabelle: `users`
- OAuth: Manus OAuth (server/_core/oauth.ts)
- Passwort-Hashing: bcrypt/argon2 (TODO: prüfen)

---

### 1.5 Marktplatz-Funktion (Seller/Käufer, Gigs, Orders)

**Inhalt:**
- Welche Daten werden bei der Erstellung eines Gigs erhoben?
- Welche Daten werden bei einer Bestellung erhoben?
- Wie lange werden diese Daten gespeichert?

**Gigs (DB-Tabelle `gigs`):**
- Seller-ID
- Title, Description, Category, Tags
- Price, Delivery-Days
- Images
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- **Speicherdauer:** Bis zur Löschung durch Seller

**Orders (DB-Tabelle `orders`):**
- Buyer-ID, Seller-ID, Gig-ID
- Status, Total-Price
- Buyer-Message, Seller-Delivery
- Delivery-Date, Completed-At
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- **Speicherdauer:** 10 Jahre (steuerrechtliche Aufbewahrungspflicht, § 147 AO)

**Mapping auf reale Systeme:**
- DB-Tabellen: `gigs`, `orders`
- tRPC-Procedures: `gigs.create`, `orders.create`

---

### 1.6 Zahlungsabwicklung (Stripe) - Art. 6 Abs. 1 lit. b DSGVO

**Inhalt:**
- Stripe als Auftragsverarbeiter
- Welche Daten werden an Stripe übermittelt?
- Drittlandübermittlung (USA)
- Standard-Vertragsklauseln (SCC)
- Link zur Stripe-Datenschutzerklärung

**An Stripe übermittelte Daten:**
- Name, E-Mail-Adresse
- Zahlungsinformationen (Kreditkarte, SEPA, Klarna, TWINT)
- Transaktionsbetrag
- Order-ID (Metadaten)

**Stripe-Services:**
- Stripe Checkout (Käufer-Zahlungen)
- Stripe Connect (Seller-Payouts)
- Webhook-Handling (Status-Updates)
- Split-Payment (85% Seller, 15% Plattform)
- Refund-API

**Drittlandübermittlung:**
- Stripe Inc., 510 Townsend Street, San Francisco, CA 94103, USA
- **Rechtsgrundlage:** Art. 46 Abs. 2 lit. c DSGVO (Standard-Vertragsklauseln)
- **Link:** https://stripe.com/de/privacy

**Mapping auf reale Systeme:**
- DB-Tabellen: `transactions`, `payouts`, `invoices`
- Stripe-Integration: server/_core/stripe.ts (TODO: prüfen)
- tRPC-Procedures: `payments.createCheckout`, `payments.createPayout`

---

### 1.7 Messaging-System (Real-time Chat) - Art. 6 Abs. 1 lit. b DSGVO

**Inhalt:**
- Real-time Chat (Socket.io)
- Order-bezogene Threads
- File-Sharing (Attachments)
- Read-Receipts
- Speicherdauer

**Erhobene Daten (DB-Tabellen `conversations`, `messages`):**
- Buyer-ID, Seller-ID, Order-ID
- Sender-ID, Content, Attachments
- Read-Status, Timestamp

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Speicherdauer:** Bis zur Löschung durch Nutzer

**Mapping auf reale Systeme:**
- DB-Tabellen: `conversations`, `messages`
- Socket.io: server/_core/socket.ts (TODO: prüfen)
- tRPC-Procedures: `messages.send`, `messages.getByConversation`

---

### 1.8 Seller-Verifizierung - Art. 6 Abs. 1 lit. b DSGVO

**Inhalt:**
- E-Mail-Verifizierung
- Telefon-Verifizierung
- Admin-Approval-Prozess
- Verifizierungs-Badges

**Erhobene Daten:**
- E-Mail-Adresse (bereits bei Registrierung)
- Telefon-Nummer (optional)
- Verifizierungs-Status (E-Mail, Telefon, Admin-Approval)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Betrugspr\u00e4vention)

**Mapping auf reale Systeme:**
- DB-Tabelle: `users` (emailVerified, phoneVerified, adminApproved, verificationLevel)
- tRPC-Procedures: `verification.sendEmailCode`, `verification.verifyEmail`, `verification.sendPhoneCode`, `verification.verifyPhone`

---

### 1.9 Cookies & ähnliche Technologien (Art. 6 Abs. 1 lit. a DSGVO)

**Inhalt:**
- Cookie-Consent-Banner
- Cookie-Kategorien (Notwendig, Funktional, Analytisch, Marketing)
- Opt-in/Opt-out-Mechanismus
- Consent-Logs (Proof-of-Consent)
- Speicherdauer der Consent-Logs

**Cookie-Kategorien:**

| Kategorie | Zweck | Beispiele | Rechtsgrundlage |
|-----------|-------|-----------|----------------|
| Notwendig | Betrieb der Website | Session-Cookies, CSRF-Token | Art. 6 Abs. 1 lit. f DSGVO |
| Funktional | Erweiterte Funktionen | Spracheinstellungen, Theme | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| Analytisch | Website-Verbesserung | PostHog, Google Analytics | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| Marketing | Personalisierte Werbung | Exit-Intent-Modal, Retargeting | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |

**Consent-Logs (DB-Tabelle `consent_logs`):**
- User-ID
- Consent-Type (analytics, marketing, functional)
- Consent-Given (true/false)
- IP-Adresse
- User-Agent
- Timestamp
- **Rechtsgrundlage:** Art. 7 Abs. 1 DSGVO (Nachweispflicht der Einwilligung)
- **Speicherdauer:** 12 Monate

**Mapping auf reale Systeme:**
- Cookie-Consent-Banner: client/src/components/CookieConsent.tsx (TODO: prüfen)
- DB-Tabelle: `consent_logs`
- tRPC-Procedures: `user.logConsent`

---

### 1.10 Web-Analytics & Tracking (Art. 6 Abs. 1 lit. a DSGVO)

**Inhalt:**
- PostHog (geplant)
- Sentry (geplant)
- Event-Tracking (Conversion-Funnel)
- Consent-Aware-Tracking
- Drittlandübermittlung (USA)

**PostHog (geplant):**
- Event-Schema versioniert (v:1)
- KPI-Funnel: view_marketplace → view_gig → start_checkout → checkout_step → purchase_succeeded
- Heatmaps, Session-Recording (nur mit Einwilligung)
- **Drittlandübermittlung:** USA (PostHog Inc., San Francisco)
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- **Link:** https://posthog.com/privacy

**Sentry (geplant):**
- Error-Tracking
- **Drittlandübermittlung:** USA (Sentry Inc., San Francisco)
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Fehleranalyse)
- **Link:** https://sentry.io/privacy/

**Mapping auf reale Systeme:**
- Analytics-Helper: client/src/lib/analytics.ts
- Event-Schema: A.viewMarketplace, A.viewGig, A.startCheckout, etc.
- Consent-Helper: getConsent(), updateConsent()
- TODO: PostHog-Integration in main.tsx initialisieren
- TODO: Sentry-Integration

---

### 1.11 Exit-Intent-Modal & Discount-Offers (Art. 6 Abs. 1 lit. a DSGVO)

**Inhalt:**
- Exit-Intent-Detection (Mouse-Exit, Inactivity)
- Session-Storage-Nutzung
- Discount-Offer (5€ Rabatt)
- A/B-Testing

**Datenverarbeitung:**
- Session-Storage: `exit_intent_done` (lokal, nicht personenbezogen)
- Telemetrie-Events: exitIntentTriggered, exitIntentShown, exitIntentAccepted, exitIntentDismissed
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung für Telemetrie)

**Mapping auf reale Systeme:**
- Exit-Intent-Hook: client/src/hooks/useExitIntent.ts
- Exit-Intent-Modal: client/src/components/ExitIntentModal.tsx
- Telemetrie: A.exitIntentTriggered, A.exitIntentShown, etc.

---

### 1.12 Similar-Gigs-Algorithm (Empfehlungen) - Art. 6 Abs. 1 lit. f DSGVO

**Inhalt:**
- Content-Based-Filtering
- Jaccard-Similarity (Category, Tags)
- Weighted-Scoring (Text, Price, Delivery, Trust)

**Datenverarbeitung:**
- Gig-Daten: Title, Description, Category, Tags, Price, Delivery-Days, Rating, Completed-Orders
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Verbesserung der Nutzererfahrung)
- **Keine personenbezogenen Daten:** Nur Gig-Metadaten

**Mapping auf reale Systeme:**
- DB-Helper: getSimilarGigs()
- tRPC-Procedure: `similarGigs.byGigId`
- Telemetrie: A.similarGigsRequested, A.similarGigsRendered

---

### 1.13 DSGVO++ Features (Art. 15-20 DSGVO)

**Inhalt:**
- Live Privacy Dashboard
- Datenexport (Art. 20 DSGVO)
- Account-Deletion mit 30-Tage-Grace-Period (Art. 17 DSGVO)
- Pseudonymisierung nach Löschung
- Consent-Logs (Proof-of-Consent, Art. 7 DSGVO)

**Live Privacy Dashboard:**
- Real-time Datenübersicht
- Selective Export (JSON, CSV)
- Account-Deletion-UI

**Account-Deletion (DB-Tabelle `account_deletion_requests`):**
- User-ID, Reason, Requested-At, Scheduled-Deletion-At (30 Tage)
- Status: pending, cancelled, completed
- **Pseudonymisierung:** Name → "DELETED_USER", E-Mail → null, OpenID → `deleted_{userId}_{timestamp}`
- **Rechtsgrundlage:** Art. 17 DSGVO (Recht auf Löschung)

**Mapping auf reale Systeme:**
- Privacy Dashboard: client/src/pages/PrivacyDashboard.tsx
- DB-Tabellen: `consent_logs`, `account_deletion_requests`
- DB-Helper: scheduleAccountDeletion(), completeAccountDeletion()
- tRPC-Procedures: `user.exportData`, `user.requestAccountDeletion`

---

### 1.14 Speicherdauer & Löschung (Art. 17 DSGVO)

**Inhalt:**
- Speicherfristen für verschiedene Datenarten
- Automatische Löschung
- Pseudonymisierung

| Datenart | Speicherdauer | Rechtsgrundlage |
|----------|---------------|----------------|
| Kontodaten (users) | Bis zur Löschung des Kontos | Art. 6 Abs. 1 lit. b DSGVO |
| Transaktionsdaten (transactions, orders) | 10 Jahre | § 147 AO (steuerrechtliche Aufbewahrungspflicht) |
| Nachrichten (messages) | Bis zur Löschung durch Nutzer | Art. 6 Abs. 1 lit. b DSGVO |
| Consent-Logs (consent_logs) | 12 Monate | Art. 7 Abs. 1 DSGVO (Nachweispflicht) |
| Server-Logs | 90 Tage | Art. 6 Abs. 1 lit. f DSGVO (IT-Sicherheit) |
| Account-Deletion-Requests | 30 Tage Grace-Period | Art. 17 DSGVO |

---

### 1.15 Betroffenenrechte (Art. 15-22 DSGVO)

**Inhalt:**
- Auskunftsrecht (Art. 15 DSGVO)
- Berichtigungsrecht (Art. 16 DSGVO)
- Löschungsrecht (Art. 17 DSGVO)
- Einschränkungsrecht (Art. 18 DSGVO)
- Widerspruchsrecht (Art. 21 DSGVO)
- Datenübertragbarkeit (Art. 20 DSGVO)
- Beschwerderecht (Art. 77 DSGVO)

**Self-Service-Tools:**
- Live Privacy Dashboard (/privacy-dashboard)
- Datenexport (/settings/data-export)
- Account-Deletion (/settings/delete-account)

**Kontakt:**
- E-Mail: info@mimitechai.com
- Telefon: +49 1575 8805737

---

### 1.16 Rechtsgrundlagen (Art. 6 DSGVO)

**Übersicht:**

| Verarbeitungszweck | Rechtsgrundlage |
|--------------------|----------------|
| Registrierung, Gig-Erstellung, Orders | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| Zahlungsabwicklung (Stripe) | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| Messaging-System | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| Seller-Verifizierung | Art. 6 Abs. 1 lit. b + f DSGVO (Vertragserfüllung + berechtigtes Interesse) |
| Cookies (Notwendig) | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| Cookies (Funktional, Analytisch, Marketing) | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| Analytics (PostHog) | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| Error-Tracking (Sentry) | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| Exit-Intent-Modal (Telemetrie) | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| Similar-Gigs-Algorithm | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| Server-Logs | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: IT-Sicherheit) |
| Consent-Logs | Art. 7 Abs. 1 DSGVO (Nachweispflicht der Einwilligung) |

---

### 1.17 Drittlandübermittlung (Art. 44-49 DSGVO)

**Übersicht:**

| Service | Land | Rechtsgrundlage | Schutzmaßnahmen |
|---------|------|----------------|-----------------|
| Stripe | USA | Art. 46 Abs. 2 lit. c DSGVO | Standard-Vertragsklauseln (SCC) |
| PostHog (geplant) | USA | Art. 46 Abs. 2 lit. c DSGVO | Standard-Vertragsklauseln (SCC) |
| Sentry (geplant) | USA | Art. 46 Abs. 2 lit. c DSGVO | Standard-Vertragsklauseln (SCC) |

**Links zu Datenschutzerklärungen:**
- Stripe: https://stripe.com/de/privacy
- PostHog: https://posthog.com/privacy
- Sentry: https://sentry.io/privacy/

---

### 1.18 Sicherheitsmaßnahmen (Art. 32 DSGVO)

**Inhalt:**
- SSL/TLS-Verschlüsselung
- Passwort-Hashing (bcrypt/argon2)
- CSRF-Protection
- Rate-Limiting
- Content-Security-Policy
- File-Upload-Validation
- Regelmäßige Sicherheitsupdates
- Zugriffsbeschränkungen
- Regelmäßige Backups

**Mapping auf reale Systeme:**
- SSL/TLS: Manus Cloud (automatisch)
- Passwort-Hashing: bcrypt/argon2 (TODO: prüfen)
- CSRF-Protection: TODO (Phase 0)
- Rate-Limiting: TODO (Phase 0)
- CSP: TODO (Phase 0)

---

### 1.19 Änderungen der Datenschutzerklärung

**Inhalt:**
- Versionierung
- Benachrichtigung bei wesentlichen Änderungen
- Archivierung alter Versionen

**TODO:** Versionierungs-System implementieren

---

## 2. Offene Punkte (Anwalt konsultieren)

### 2.1 Joint Controllership (Art. 26 DSGVO)

**Frage:** Sind Seller und Flinkly gemeinsam verantwortlich für Käufer-Daten?

**Kontext:**
- Seller erstellen Gigs, erhalten Käufer-Daten (Name, E-Mail, Nachrichten)
- Flinkly verarbeitet Zahlungen, speichert Daten in eigener DB

**Mögliche Antwort:**
- Flinkly ist alleiniger Verantwortlicher (Seller sind Nutzer der Plattform)
- **ODER:** Flinkly und Seller sind gemeinsam verantwortlich (Art. 26 DSGVO-Vereinbarung erforderlich)

**TODO:** Anwalt konsultieren

---

### 2.2 Auftragsverarbeitungsvertrag (AVV, Art. 28 DSGVO)

**Frage 1:** Benötigen Seller einen AVV mit Flinkly?

**Kontext:**
- Wenn Seller gewerblich tätig sind und Käufer-Daten verarbeiten
- Flinkly könnte als Auftragsverarbeiter für Seller agieren

**Mögliche Antwort:**
- Nein, Flinkly ist Verantwortlicher (Seller sind Nutzer)
- **ODER:** Ja, AVV erforderlich (Seller sind Verantwortliche, Flinkly ist Auftragsverarbeiter)

**TODO:** Anwalt konsultieren

---

**Frage 2:** Benötigen wir einen AVV mit Stripe?

**Kontext:**
- Stripe verarbeitet Zahlungsdaten im Auftrag von Flinkly

**Antwort:**
- Ja, Stripe bietet Standard-AVV an (Data Processing Agreement)
- **TODO:** Stripe-AVV prüfen und unterschreiben

---

### 2.3 Drittlandübermittlung (Art. 44-49 DSGVO)

**Frage:** Sind Standard-Vertragsklauseln (SCC) für Stripe, PostHog, Sentry ausreichend?

**Kontext:**
- USA ist kein sicheres Drittland (Schrems II-Urteil)
- SCC sind eine Möglichkeit, aber zusätzliche Maßnahmen können erforderlich sein

**TODO:** Anwalt konsultieren, ggf. Transfer Impact Assessment (TIA) durchführen

---

### 2.4 Speicherfristen (Art. 5 Abs. 1 lit. e DSGVO)

**Frage 1:** Sind 10 Jahre Speicherfrist für Transaktionsdaten korrekt?

**Kontext:**
- § 147 AO: 10 Jahre Aufbewahrungspflicht für steuerrelevante Unterlagen
- Gilt dies auch für Marketplace-Transaktionen?

**TODO:** Steuerberater konsultieren

---

**Frage 2:** Ist "Bis zur Löschung durch Nutzer" für Nachrichten DSGVO-konform?

**Kontext:**
- Keine feste Speicherfrist
- Nutzer können Nachrichten unbegrenzt speichern

**Mögliche Antwort:**
- Ja, wenn Nutzer die Kontrolle haben (Art. 17 DSGVO)
- **ODER:** Nein, feste Speicherfrist erforderlich (z.B. 2 Jahre nach letzter Aktivität)

**TODO:** Anwalt konsultieren

---

### 2.5 Seller-Impressumspflicht (§ 5 TMG)

**Frage:** Müssen gewerbliche Seller ein Impressum hinterlegen?

**Kontext:**
- § 5 TMG: Impressumspflicht für geschäftsmäßige Telemedien
- Seller bieten Dienstleistungen an (gewerblich)

**Antwort:**
- Ja, gewerbliche Seller benötigen ein Impressum
- **TODO:** Technische Umsetzung (Impressum-Feld im Seller-Profil)

---

### 2.6 Fraud-Detection & IP-Fingerprinting (Art. 6 Abs. 1 lit. f DSGVO)

**Frage:** Ist berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) ausreichend für Fraud-Detection?

**Kontext:**
- Stripe Radar, IP/Device-Fingerprinting, Verhaltens-Anomalie-Detection
- Keine Einwilligung der Nutzer

**Mögliche Antwort:**
- Ja, berechtigtes Interesse ist ausreichend (Betrugspr\u00e4vention)
- **ABER:** Interessenabwägung erforderlich (Art. 6 Abs. 1 lit. f DSGVO)

**TODO:** Anwalt konsultieren, Interessenabwägung dokumentieren

---

## 3. Zusammenfassung

### ✅ Gliederung definiert

18 Abschnitte strukturiert:
1. Einleitung & Verantwortlicher
2. Begriffsbestimmungen
3. Hosting & Server-Logs
4. Registrierung & Nutzerkonten
5. Marktplatz-Funktion
6. Zahlungsabwicklung (Stripe)
7. Messaging-System
8. Seller-Verifizierung
9. Cookies & ähnliche Technologien
10. Web-Analytics & Tracking
11. Exit-Intent-Modal & Discount-Offers
12. Similar-Gigs-Algorithm
13. DSGVO++ Features
14. Speicherdauer & Löschung
15. Betroffenenrechte
16. Rechtsgrundlagen
17. Drittlandübermittlung
18. Sicherheitsmaßnahmen
19. Änderungen der Datenschutzerklärung

### ✅ Mapping auf reale Systeme

Alle 10 technischen Systeme kartiert:
- 11 DB-Tabellen
- Stripe-Integration
- Cookie-Consent-Banner
- Analytics-Infrastructure
- Exit-Intent-Modal
- Messaging-System
- Seller-Verifizierung
- DSGVO++ Features
- Similar-Gigs-Algorithm
- Server-Logging

### ✅ Offene Punkte notiert

6 offene Legal-Fragen:
1. Joint Controllership (Art. 26 DSGVO)
2. AVV mit Sellern / Stripe (Art. 28 DSGVO)
3. Drittlandübermittlung (SCC ausreichend?)
4. Speicherfristen (10 Jahre korrekt? Nachrichten unbegrenzt?)
5. Seller-Impressumspflicht (§ 5 TMG)
6. Fraud-Detection (berechtigtes Interesse ausreichend?)

---

**Status:** ✅ Phase 2 abgeschlossen - Fachkonzept ausgearbeitet
