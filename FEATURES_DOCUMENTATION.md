# Flinkly - Features-Dokumentation

Dokumentation der neu implementierten Features: Email-Benachrichtigungen, Performance-Monitoring und A/B-Testing.

---

## 📧 Email-Benachrichtigungen

### Setup

1. **SMTP-Credentials konfigurieren:**
   
   Füge folgende Environment-Variablen hinzu (Management UI → Settings → Secrets):

   ```
   SMTP_HOST=smtp.gmail.com          # Oder smtp.sendgrid.net, smtp.mailgun.org
   SMTP_PORT=587                     # 587 für TLS, 465 für SSL
   SMTP_USER=deine@email.de          # Oder API-Key (SendGrid/Mailgun)
   SMTP_PASS=dein-passwort           # Oder API-Secret
   SMTP_FROM=Flinkly <noreply@flinkly.de>  # Absender-Name und E-Mail
   ```

2. **Gmail-Nutzer:**
   - Erstelle ein "App-Passwort" (nicht dein normales Passwort!):
   - https://myaccount.google.com/apppasswords
   - Verwende dieses Passwort als `SMTP_PASS`

3. **SendGrid/Mailgun:**
   - Erstelle einen API-Key im Dashboard
   - Verwende den API-Key als `SMTP_USER`
   - Verwende den API-Secret als `SMTP_PASS`

### Implementierte Templates

#### 1. Order-Confirmation (Bestellbestätigung)
- **Trigger:** Nach erfolgreicher Bestellung (`orders.create`)
- **Empfänger:** Käufer
- **Inhalt:**
  - Bestellnummer, Gig-Titel, Preis
  - Seller-Name, Lieferzeit
  - CTA-Button: "Bestellung ansehen"

#### 2. Message-Notification (Neue Nachricht)
- **Trigger:** Bei neuer Text-Nachricht (`messages.sendMessage`)
- **Empfänger:** Gesprächspartner
- **Inhalt:**
  - Absender-Name
  - Message-Preview (max 100 Zeichen)
  - CTA-Button: "Nachricht antworten"

#### 3. Dispute-Alert (Dispute eröffnet)
- **Trigger:** Bei Dispute-Eröffnung (`disputes.create`)
- **Empfänger:** Käufer + Seller (beide!)
- **Inhalt:**
  - Bestellnummer, Gig-Titel
  - Dispute-Grund (übersetzt)
  - 48h-Deadline-Warnung
  - CTA-Button: "Dispute ansehen"

### Code-Beispiel

```typescript
import { sendEmail } from './server/_core/email';
import { orderConfirmationTemplate } from './server/_core/emailTemplates';

// In tRPC-Procedure:
const emailHtml = orderConfirmationTemplate({
  buyerName: 'Max Mustermann',
  orderId: 123,
  gigTitle: 'Logo-Design',
  price: 149,
  sellerName: 'Anna Schmidt',
  deliveryDays: 3,
});

await sendEmail({
  to: 'max@example.com',
  subject: 'Bestellung bestätigt - Logo-Design (#123)',
  html: emailHtml,
});
```

---

## 🔍 Performance-Monitoring (Sentry)

### Setup

1. **Sentry-Projekt erstellen:**
   - Registriere dich auf https://sentry.io
   - Erstelle ein neues Projekt (Node.js)
   - Kopiere den DSN (z.B. `https://xxx@yyy.ingest.sentry.io/zzz`)

2. **Environment-Variablen setzen:**

   ```
   SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
   SENTRY_ENVIRONMENT=production    # Oder staging, development
   ```

### Features

- ✅ **Automatic Error-Capture:** Unhandled Exceptions, Promise-Rejections
- ✅ **Performance-Monitoring:** Transaction-Tracking (10% Sample-Rate)
- ✅ **User-Context:** User-ID, E-Mail werden automatisch getrackt
- ✅ **Sensitive-Data-Filtering:** Authorization-Header, Cookies, Passwords werden entfernt
- ✅ **Breadcrumbs:** Event-History vor Error

### Code-Beispiel

```typescript
import { captureException, setUser } from './server/_core/sentry';

// Manual Error-Capture:
try {
  // Risky operation
} catch (error) {
  captureException(error, {
    context: 'payment_processing',
    orderId: 123,
  });
}

// Set User-Context:
setUser({
  id: 123,
  email: 'max@example.com',
  name: 'Max Mustermann',
});
```

---

## 📊 Analytics (PostHog)

### Setup

1. **PostHog-Projekt erstellen:**
   - Registriere dich auf https://posthog.com
   - Erstelle ein neues Projekt
   - Kopiere den API-Key (z.B. `phc_xxx`)

2. **Environment-Variablen setzen:**

   ```
   POSTHOG_API_KEY=phc_xxx
   POSTHOG_HOST=https://app.posthog.com    # Optional (default)
   ```

### Conversion-Funnel-Events

Die folgenden Events sind bereits implementiert:

1. **gig_viewed** - Gig angesehen
   - Properties: `gig_id`, `gig_title`, `category`, `price`

2. **add_to_cart** - In Warenkorb gelegt
   - Properties: `gig_id`, `gig_title`, `price`

3. **checkout_started** - Checkout begonnen
   - Properties: `gig_id`, `price`

4. **payment_success** - Zahlung erfolgreich ✅
   - Properties: `order_id`, `gig_id`, `price`, `revenue`
   - **Bereits integriert in `orders.create`!**

5. **order_completed** - Bestellung abgeschlossen
   - Properties: `order_id`, `gig_id`, `price`

6. **dispute_opened** - Dispute eröffnet
   - Properties: `order_id`, `reason`

7. **message_sent** - Nachricht gesendet
   - Properties: `conversation_id`, `message_type`

### Code-Beispiel

```typescript
import { trackEvent, trackGigView } from './server/_core/analytics';

// Generic Event:
trackEvent(userId, 'custom_event', {
  property1: 'value1',
  property2: 123,
});

// Conversion-Funnel-Event:
trackGigView(userId, gigId, 'Logo-Design', 'design', 149);
```

### PostHog-Dashboard

Nach dem Setup kannst du im PostHog-Dashboard:
- **Funnels** erstellen (z.B. `gig_viewed` → `checkout_started` → `payment_success`)
- **Drop-off-Raten** analysieren (wo brechen Nutzer ab?)
- **Cohorts** erstellen (Nutzer-Segmente)
- **Retention** tracken (Wiederkehrende Nutzer)

---

## 🧪 A/B-Testing (Feature-Flags)

### Setup

1. **Feature-Flags in PostHog erstellen:**
   - Gehe zu PostHog Dashboard → Feature Flags
   - Erstelle neue Flags mit den unten genannten Keys
   - Konfiguriere Rollout-Prozent und Varianten

### Vorkonfigurierte A/B-Tests

#### 1. CTA-Button-Text (`cta_button_text`)

**Varianten:**
- `jetzt_kaufen` → "Jetzt kaufen"
- `gig_bestellen` → "Gig bestellen"
- `jetzt_buchen` → "Jetzt buchen"

**Rollout:** 33% / 33% / 34%

**Code-Beispiel:**
```typescript
import { getCtaButtonText } from './server/_core/featureFlags';

const buttonText = await getCtaButtonText(userId);
// Returns: "Jetzt kaufen" | "Gig bestellen" | "Jetzt buchen"
```

#### 2. Pricing-Format (`pricing_format`)

**Varianten:**
- `standard` → "€149"
- `with_cents` → "€149,00"
- `with_prefix` → "Nur €149"

**Rollout:** 33% / 33% / 34%

**Code-Beispiel:**
```typescript
import { formatPrice } from './server/_core/featureFlags';

const formatted = await formatPrice(userId, 149);
// Returns: "€149" | "€149,00" | "Nur €149"
```

#### 3. Checkout-Flow (`checkout_flow`)

**Varianten:**
- `three_step` → 3-Step-Checkout
- `one_page` → 1-Page-Checkout

**Rollout:** 50% / 50%

**Code-Beispiel:**
```typescript
import { getCheckoutFlow } from './server/_core/featureFlags';

const flow = await getCheckoutFlow(userId);
// Returns: "three_step" | "one_page"
```

#### 4. Trust-Badge (`trust_badge`)

**Varianten:**
- `geld_zurueck` → "Geld-zurück-Garantie"
- `dsgvo_konform` → "DSGVO-konform"
- `verifiziert` → "Verifizierter Seller"

**Rollout:** 33% / 33% / 34%

**Code-Beispiel:**
```typescript
import { getTrustBadge } from './server/_core/featureFlags';

const badge = await getTrustBadge(userId);
// Returns: "Geld-zurück-Garantie" | "DSGVO-konform" | "Verifizierter Seller"
```

### Feature-Rollouts (Boolean-Flags)

#### 5. Video-Calls (`video_calls_enabled`)
- **Type:** Boolean
- **Rollout:** Gradual (0% → 10% → 50% → 100%)
- **Use-Case:** Schrittweise Einführung von Video-Call-Feature

#### 6. AI-Matching (`ai_matching_enabled`)
- **Type:** Boolean
- **Rollout:** Gradual
- **Use-Case:** KI-basierte Gig-Empfehlungen

#### 7. Premium-Features (`premium_features`)
- **Type:** Boolean
- **Targeting:** User-Property `subscription_tier` = "premium"
- **Use-Case:** Feature-Gates für Premium-Nutzer

### tRPC-Integration

Alle Feature-Flags sind über tRPC abrufbar:

```typescript
// Frontend:
const { data } = trpc.featureFlags.getCtaButtonText.useQuery();
console.log(data?.text); // "Jetzt kaufen"

const { data: flow } = trpc.featureFlags.getCheckoutFlow.useQuery();
console.log(data?.flow); // "three_step"

const { data: flags } = trpc.featureFlags.getActiveFlags.useQuery();
console.log(flags); // All active flags for current user
```

---

## 🚀 Deployment-Checklist

Vor dem Go-Live:

### 1. Email-Setup
- [ ] SMTP-Credentials in Production-Environment setzen
- [ ] Test-Email senden (Order-Confirmation)
- [ ] Spam-Filter-Check (SPF/DKIM/DMARC konfigurieren)

### 2. Sentry-Setup
- [ ] Production-DSN in Environment setzen
- [ ] `SENTRY_ENVIRONMENT=production` setzen
- [ ] Test-Error werfen und in Sentry-Dashboard prüfen

### 3. PostHog-Setup
- [ ] Production-API-Key in Environment setzen
- [ ] Test-Event senden (`trackEvent`)
- [ ] Conversion-Funnel im Dashboard erstellen

### 4. Feature-Flags-Setup
- [ ] Alle 7 Flags in PostHog-Dashboard erstellen
- [ ] Rollout-Prozent konfigurieren (Start: 0% für neue Features)
- [ ] Test-User erstellen und Flag-Varianten testen

---

## 📝 Weitere Schritte

### Email-Erweiterungen
- [ ] Welcome-Email bei Registrierung
- [ ] Password-Reset-Email
- [ ] Weekly-Digest (neue Gigs, Messages)
- [ ] Order-Delivered-Notification

### Analytics-Erweiterungen
- [ ] Frontend-Events (Button-Clicks, Scroll-Depth)
- [ ] Session-Recording (PostHog)
- [ ] Heatmaps (PostHog)
- [ ] User-Surveys (PostHog)

### A/B-Testing-Erweiterungen
- [ ] Hero-Section-Varianten
- [ ] Onboarding-Flow-Tests
- [ ] Pricing-Page-Experimente
- [ ] Email-Subject-Line-Tests

---

## 🆘 Support

Bei Fragen oder Problemen:
- **Email:** support@flinkly.de
- **Sentry:** https://sentry.io/organizations/flinkly
- **PostHog:** https://app.posthog.com
- **Dokumentation:** https://docs.flinkly.de
