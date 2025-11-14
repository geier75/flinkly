# Datenschutzerklärung - Analyse & Bestandsaufnahme

**Datum:** 2025-01-14  
**Phase:** 0 - Pre-Launch Blocker (Payment & Legal)  
**Status:** Analyse abgeschlossen

---

## 1. Existierende Legal-Komponenten

### ✅ Vorhanden

| Datei | Status | Inhalt | Bewertung |
|-------|--------|--------|-----------|
| `client/src/pages/Privacy.tsx` | ⚠️ Veraltet | Generische Datenschutzerklärung (Stand: Oktober 2025) | **Unvollständig** - fehlt: Stripe, Analytics, Exit-Intent, Cookie-Consent-Details, Messaging, Seller-Verifizierung |
| `client/src/pages/Terms.tsx` | ⚠️ Generisch | AGB-Grundgerüst | **Unvollständig** - fehlt: Stripe-Details, Eskrow-System, Seller-Tiers |
| `client/src/pages/Impressum.tsx` | ✅ Vorhanden | Impressum | Zu prüfen |
| `client/src/pages/PrivacyDashboard.tsx` | ✅ Vorhanden | Live Privacy Dashboard (DSGVO++) | **Production-ready** |

### ❌ Fehlend

- Widerrufsbelehrung (separate Seite)
- AVV-Muster (Auftragsverarbeitungsvertrag für Seller)
- Versionierung der Datenschutzerklärung (Changelog)

---

## 2. Technische Systeme (Real existierend im Code)

### 2.1 Datenbank-Schema (11 Tabellen)

| Tabelle | Personenbezogene Daten | DSGVO-Relevanz |
|---------|------------------------|----------------|
| `users` | ✅ Name, Email, OpenID, Phone, Avatar, Bio, Country, Verification-Status | **Hoch** - Identität, Kontaktdaten |
| `gigs` | ⚠️ Title, Description, Tags, Images (Seller-ID) | **Mittel** - Geschäftsdaten, indirekt personenbezogen |
| `orders` | ✅ Buyer-ID, Seller-ID, Messages, Delivery-Files | **Hoch** - Transaktionsdaten, Kommunikation |
| `reviews` | ✅ Reviewer-ID, Rating, Comment | **Mittel** - Meinungsäußerungen |
| `transactions` | ✅ Buyer-ID, Seller-ID, Amount, Payment-Method, Stripe-Payment-Intent-ID | **Sehr hoch** - Finanzdaten |
| `payouts` | ✅ Seller-ID, Amount, Bank-Transfer-Info, Stripe-Payout-ID | **Sehr hoch** - Finanzdaten |
| `invoices` | ✅ Buyer-ID, Seller-ID, Invoice-Number, Amounts, PDF-URL | **Hoch** - Steuerrelevante Daten |
| `conversations` | ✅ Buyer-ID, Seller-ID, Order-ID | **Hoch** - Kommunikationsmetadaten |
| `messages` | ✅ Sender-ID, Content, Attachments, Read-Status | **Sehr hoch** - Kommunikationsinhalte |
| `consent_logs` | ✅ User-ID, Consent-Type, IP, User-Agent, Timestamp | **Sehr hoch** - Proof-of-Consent (DSGVO++) |
| `account_deletion_requests` | ✅ User-ID, Reason, Scheduled-Deletion-Date | **Sehr hoch** - Löschfristen (30 Tage) |

### 2.2 Zahlungsabwicklung

- **Stripe** (integriert)
  - Stripe Checkout (Käufer-Zahlungen)
  - Stripe Connect (Seller-Payouts)
  - Webhook-Handling (Status-Updates)
  - Split-Payment (85% Seller, 15% Plattform)
  - Refund-API
  - **Drittlandübermittlung:** USA (Stripe Inc., San Francisco)
  - **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

### 2.3 Cookies & Tracking

- **Cookie-Consent-Banner** (implementiert)
  - Kategorien: Notwendig, Funktional, Analytisch, Marketing
  - Opt-in/Opt-out-Mechanismus
  - Consent-Logs in DB (`consent_logs`-Tabelle)
  - **Speicherdauer:** 12 Monate (Consent-Logs)

- **Analytics** (vorbereitet, nicht finalisiert)
  - Event-Schema versioniert (v:1)
  - Analytics-Helper-Functions (`client/src/lib/analytics.ts`)
  - Consent-Aware-Tracking (getConsent, updateConsent)
  - **TODO:** PostHog-Integration in `main.tsx` initialisieren
  - **TODO:** Sentry-Integration (Error-Tracking)

- **Exit-Intent-Modal** (implementiert)
  - Mouse-Exit-Detection (clientY ≤ 0)
  - Inactivity-Timeout (30s)
  - Session-Storage-Guard (`exit_intent_done`)
  - Discount-Offer (5€ Rabatt)
  - **Datenerhebung:** Session-Storage (lokal, nicht personenbezogen)

### 2.4 Messaging-System

- **Real-time Chat** (Socket.io)
  - Order-bezogene Threads
  - File-Sharing (Attachments)
  - Read-Receipts
  - **Speicherdauer:** Bis zur Löschung durch Nutzer

### 2.5 Seller-Verifizierung

- **E-Mail-Verifizierung** (implementiert)
- **Telefon-Verifizierung** (implementiert)
- **Admin-Approval** (implementiert)
- **Verifizierungs-Badges** (implementiert)
- **Datenerhebung:** Phone-Nummer (optional), Verification-Status

### 2.6 Server-Logging

- **Express-Server-Logs**
  - IP-Adresse
  - User-Agent
  - Request-Methode, URL, Status-Code
  - Timestamp
  - **Speicherdauer:** TODO (90 Tage empfohlen)

### 2.7 Hosting & Infrastruktur

- **Manus Cloud** (Sandbox-Umgebung)
  - Server-Standort: TODO (zu klären)
  - SSL/TLS-Verschlüsselung
  - Automatische Backups

---

## 3. Fehlende/Unvollständige Informationen in Privacy.tsx

### 3.1 Nicht erwähnt

1. **Stripe-Integration**
   - Stripe als Auftragsverarbeiter
   - Drittlandübermittlung (USA)
   - Stripe-Datenschutzerklärung-Link
   - Welche Daten an Stripe übermittelt werden

2. **Cookie-Consent-Banner**
   - Detaillierte Cookie-Kategorien
   - Consent-Logs (Proof-of-Consent)
   - Speicherdauer der Consent-Logs (12 Monate)

3. **Analytics & Tracking**
   - PostHog (geplant)
   - Sentry (geplant)
   - Event-Tracking (Conversion-Funnel)
   - Consent-Aware-Tracking

4. **Exit-Intent-Modal**
   - Session-Storage-Nutzung
   - Discount-Offer-Mechanismus

5. **Messaging-System**
   - Real-time Chat (Socket.io)
   - File-Sharing
   - Read-Receipts
   - Speicherdauer

6. **Seller-Verifizierung**
   - Telefon-Verifizierung
   - Admin-Approval-Prozess
   - Verifizierungs-Daten

7. **DSGVO++ Features**
   - Consent-Logs (Proof-of-Consent)
   - Account-Deletion mit 30-Tage-Grace-Period
   - Pseudonymisierung nach Löschung
   - Live Privacy Dashboard

8. **Similar-Gigs-Algorithm**
   - Content-Based-Filtering
   - Datenverarbeitung für Empfehlungen

### 3.2 Veraltet/Ungenau

- **Stand:** "Oktober 2025" (sollte aktualisiert werden)
- **Passwort-Verschlüsselung:** "verschlüsselt" → korrekt: "gehasht" (bcrypt/argon2)
- **Speicherdauer Log-Dateien:** "90 Tage" (nicht implementiert, TODO)
- **Hinweis am Ende:** "Diese Datenschutzerklärung dient als Beispiel" → **MUSS entfernt werden** (wirkt unprofessionell)

---

## 4. Offene Legal-Fragen (Anwalt konsultieren)

1. **Joint Controllership (gemeinsame Verantwortlichkeit)**
   - Sind Seller und Flinkly gemeinsam verantwortlich für Käufer-Daten?
   - Benötigen wir eine Art. 26 DSGVO-Vereinbarung?

2. **Auftragsverarbeitungsvertrag (AVV)**
   - Benötigen Seller einen AVV mit Flinkly?
   - Benötigen wir einen AVV mit Stripe?

3. **Drittlandübermittlung**
   - Stripe (USA): Standard-Vertragsklauseln (SCC)?
   - PostHog (USA, geplant): SCC?
   - Sentry (USA, geplant): SCC?

4. **Speicherfristen**
   - Transaktionsdaten: 10 Jahre (steuerrechtlich korrekt?)
   - Nachrichten: "Bis zur Löschung durch Nutzer" (DSGVO-konform?)
   - Log-Dateien: 90 Tage (angemessen?)

5. **Seller-Impressumspflicht**
   - Müssen gewerbliche Seller ein Impressum hinterlegen?
   - Wie wird dies technisch umgesetzt?

6. **Fraud-Detection & IP-Fingerprinting**
   - Rechtsgrundlage für Fraud-Detection?
   - Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)?

---

## 5. Zusammenfassung

### Was existiert schon?

- ✅ Grundgerüst Datenschutzerklärung (`Privacy.tsx`)
- ✅ AGB-Grundgerüst (`Terms.tsx`)
- ✅ Impressum (`Impressum.tsx`)
- ✅ Live Privacy Dashboard (DSGVO++)
- ✅ Cookie-Consent-Banner
- ✅ Consent-Logs (Proof-of-Consent)
- ✅ Account-Deletion mit 30-Tage-Grace-Period
- ✅ Stripe-Integration (Zahlungsabwicklung)
- ✅ Messaging-System (Real-time Chat)
- ✅ Seller-Verifizierung (E-Mail, Telefon, Admin-Approval)
- ✅ Analytics-Infrastructure (Event-Schema, Telemetrie-Integration)
- ✅ Exit-Intent-Modal
- ✅ Similar-Gigs-Algorithm

### Was ist veraltet/unvollständig?

- ⚠️ Privacy.tsx fehlt: Stripe, Analytics, Exit-Intent, Cookie-Details, Messaging, Seller-Verifizierung, DSGVO++
- ⚠️ Unprofessioneller Hinweis am Ende ("dient als Beispiel")
- ⚠️ Stand: "Oktober 2025" (sollte aktualisiert werden)

### Welche technischen Systeme müssen beschrieben werden?

1. **Stripe** (Zahlungsabwicklung, Drittlandübermittlung USA)
2. **Cookie-Consent-Banner** (Kategorien, Consent-Logs, Speicherdauer)
3. **Analytics** (PostHog, Sentry, Event-Tracking, Consent-Aware)
4. **Exit-Intent-Modal** (Session-Storage, Discount-Offer)
5. **Messaging-System** (Socket.io, File-Sharing, Read-Receipts)
6. **Seller-Verifizierung** (Telefon, Admin-Approval)
7. **DSGVO++ Features** (Consent-Logs, Account-Deletion, Pseudonymisierung, Live Privacy Dashboard)
8. **Similar-Gigs-Algorithm** (Content-Based-Filtering)
9. **Server-Logging** (IP, User-Agent, Speicherdauer)
10. **Hosting** (Manus Cloud, Server-Standort, SSL/TLS)

---

## 6. Nächste Schritte (Phase 2)

1. **Fachkonzept ausarbeiten**
   - Strukturierte Gliederung definieren
   - Mapping auf reale Systeme
   - Offene Punkte notieren

2. **Implementierungsplan erstellen**
   - Dateien/Komponenten identifizieren
   - UI-Verlinkung planen
   - Komponenten-Referenzen definieren

3. **Umsetzung**
   - Privacy.tsx vollständig neu schreiben
   - Footer-Integration
   - Navigation anpassen
   - Verknüpfung mit technischen Stellen

---

**Status:** ✅ Phase 1 abgeschlossen - Analyse & Bestandsaufnahme erfolgreich
