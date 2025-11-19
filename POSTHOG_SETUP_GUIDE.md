# PostHog-Dashboard-Setup-Guide

Schritt-für-Schritt-Anleitung zum Einrichten von Analytics, Conversion-Funnels und A/B-Tests in PostHog.

---

## 📋 Voraussetzungen

1. **PostHog-Account erstellen:** https://posthog.com
2. **API-Key kopieren:** Dashboard → Project Settings → API Key
3. **Environment-Variablen setzen:**
   ```
   POSTHOG_API_KEY=phc_xxx (Backend)
   VITE_POSTHOG_API_KEY=phc_xxx (Frontend)
   ```

---

## 🎯 1. Conversion-Funnel erstellen

### Schritt 1: Funnel-Definition

Gehe zu **PostHog Dashboard → Insights → New Insight → Funnel**

Erstelle einen Funnel mit folgenden Steps:

1. **gig_viewed** - Gig angesehen
2. **add_to_cart** - In Warenkorb gelegt (optional, falls implementiert)
3. **checkout_started** - Checkout begonnen
4. **payment_success** - Zahlung erfolgreich

### Schritt 2: Filter hinzufügen

- **Filter by Category:** `properties.category = "design"` (um nur Design-Gigs zu tracken)
- **Filter by Price:** `properties.price > 100` (um nur teure Gigs zu tracken)

### Schritt 3: Breakdown hinzufügen

- **Breakdown by Category:** Zeigt Conversion-Rate pro Kategorie
- **Breakdown by Device:** Zeigt Conversion-Rate pro Device (Mobile/Desktop)

### Schritt 4: Speichern

- Name: "Gig Purchase Funnel"
- Dashboard: "Flinkly Analytics"

---

## 📊 2. Key-Metrics-Dashboard erstellen

### Schritt 1: Dashboard erstellen

Gehe zu **PostHog Dashboard → Dashboards → New Dashboard**

Name: "Flinkly Analytics"

### Schritt 2: Widgets hinzufügen

#### Widget 1: Total Orders (Trend)
- **Type:** Trend
- **Event:** `payment_success`
- **Aggregation:** Total count
- **Time Range:** Last 30 days

#### Widget 2: Revenue (Trend)
- **Type:** Trend
- **Event:** `payment_success`
- **Aggregation:** Sum of `properties.revenue`
- **Time Range:** Last 30 days

#### Widget 3: Conversion Rate (Funnel)
- **Type:** Funnel
- **Steps:** `gig_viewed` → `checkout_started` → `payment_success`
- **Time Range:** Last 30 days

#### Widget 4: Top Categories (Bar Chart)
- **Type:** Trend
- **Event:** `gig_viewed`
- **Breakdown:** `properties.category`
- **Time Range:** Last 7 days

#### Widget 5: Average Order Value
- **Type:** Trend
- **Event:** `payment_success`
- **Aggregation:** Average of `properties.price`
- **Time Range:** Last 30 days

---

## 🧪 3. A/B-Tests einrichten (Feature-Flags)

### Test 1: CTA-Button-Text

#### Schritt 1: Flag erstellen

Gehe zu **PostHog Dashboard → Feature Flags → New Feature Flag**

- **Key:** `cta_button_text`
- **Type:** Multivariate
- **Variants:**
  - `jetzt_kaufen` (33%)
  - `gig_bestellen` (33%)
  - `jetzt_buchen` (34%)

#### Schritt 2: Rollout konfigurieren

- **Rollout:** 100% (alle User)
- **Targeting:** Keine (alle User bekommen eine Variante)

#### Schritt 3: Experiment erstellen

Gehe zu **PostHog Dashboard → Experiments → New Experiment**

- **Name:** "CTA Button Text A/B Test"
- **Feature Flag:** `cta_button_text`
- **Goal Metric:** `payment_success` (Conversion-Event)
- **Secondary Metrics:** `cta_clicked`, `checkout_started`

#### Schritt 4: Auswertung

Nach 1-2 Wochen:
- Gehe zu **Experiments → CTA Button Text A/B Test**
- Prüfe welche Variante die höchste Conversion-Rate hat
- Rollout der Gewinner-Variante auf 100%

---

### Test 2: Pricing-Format

#### Schritt 1: Flag erstellen

- **Key:** `pricing_format`
- **Type:** Multivariate
- **Variants:**
  - `standard` (33%) → "€149"
  - `with_cents` (33%) → "€149,00"
  - `with_prefix` (34%) → "Nur €149"

#### Schritt 2: Experiment erstellen

- **Name:** "Pricing Format A/B Test"
- **Feature Flag:** `pricing_format`
- **Goal Metric:** `payment_success`
- **Secondary Metrics:** `gig_viewed`, `checkout_started`

---

### Test 3: Checkout-Flow

#### Schritt 1: Flag erstellen

- **Key:** `checkout_flow`
- **Type:** Multivariate
- **Variants:**
  - `three_step` (50%) → 3-Step-Checkout
  - `one_page` (50%) → 1-Page-Checkout

#### Schritt 2: Experiment erstellen

- **Name:** "Checkout Flow A/B Test"
- **Feature Flag:** `checkout_flow`
- **Goal Metric:** `payment_success`
- **Secondary Metrics:** `checkout_started`, `checkout_abandoned`

---

### Test 4: Trust-Badge

#### Schritt 1: Flag erstellen

- **Key:** `trust_badge`
- **Type:** Multivariate
- **Variants:**
  - `geld_zurueck` (33%) → "Geld-zurück-Garantie"
  - `dsgvo_konform` (33%) → "DSGVO-konform"
  - `verifiziert` (34%) → "Verifizierter Seller"

#### Schritt 2: Experiment erstellen

- **Name:** "Trust Badge A/B Test"
- **Feature Flag:** `trust_badge`
- **Goal Metric:** `payment_success`
- **Secondary Metrics:** `gig_viewed`, `add_to_cart`

---

## 🚀 4. Feature-Rollouts (Gradual Rollout)

### Video-Calls-Feature

#### Schritt 1: Flag erstellen

- **Key:** `video_calls_enabled`
- **Type:** Boolean
- **Rollout:** Start mit 0%

#### Schritt 2: Schrittweise Rollout

1. **Phase 1:** 10% Rollout (1 Woche)
   - Monitoring: Fehlerrate, User-Feedback
2. **Phase 2:** 50% Rollout (1 Woche)
   - Monitoring: Performance, Conversion-Impact
3. **Phase 3:** 100% Rollout
   - Feature ist für alle User verfügbar

---

### AI-Matching-Feature

#### Schritt 1: Flag erstellen

- **Key:** `ai_matching_enabled`
- **Type:** Boolean
- **Rollout:** Start mit 0%

#### Schritt 2: Targeting (Beta-User)

- **Targeting:** User-Property `beta_tester = true`
- **Rollout:** 100% für Beta-Tester, 0% für andere

---

### Premium-Features

#### Schritt 1: Flag erstellen

- **Key:** `premium_features`
- **Type:** Boolean
- **Rollout:** 0%

#### Schritt 2: Targeting (Premium-User)

- **Targeting:** User-Property `subscription_tier = "premium"`
- **Rollout:** 100% für Premium-User, 0% für Free-User

---

## 📈 5. Analytics-Events tracken

### Backend-Events (bereits implementiert)

- ✅ `payment_success` - Zahlung erfolgreich
- ✅ `order_completed` - Bestellung abgeschlossen
- ✅ `dispute_opened` - Dispute eröffnet
- ✅ `message_sent` - Nachricht gesendet

### Frontend-Events (Hooks verfügbar)

Verwende die Hooks aus `client/src/hooks/useAnalytics.ts`:

```tsx
import { useButtonClick, useScrollDepth, useCTAClick } from '@/hooks/useAnalytics';

function GigDetailPage() {
  const trackCTA = useCTAClick();
  useScrollDepth('gig_detail');

  return (
    <Button onClick={() => trackCTA('buy_now', { gig_id: 123, price: 149 })}>
      Jetzt kaufen
    </Button>
  );
}
```

**Empfohlene Events:**
- `button_clicked` - Button-Clicks (Navigation, CTA, etc.)
- `scroll_depth` - Scroll-Milestones (25%, 50%, 75%, 100%)
- `form_submitted` - Form-Submissions
- `search_performed` - Search-Queries
- `filter_applied` - Filter-Usage

---

## 🔍 6. Retention-Analyse

### Schritt 1: Retention-Insight erstellen

Gehe zu **PostHog Dashboard → Insights → New Insight → Retention**

- **Event:** `$pageview` (User kehrt zurück)
- **Cohort:** User die `payment_success` hatten
- **Time Range:** Last 30 days

### Schritt 2: Auswertung

- **Day 1 Retention:** Wie viele User kommen am nächsten Tag zurück?
- **Week 1 Retention:** Wie viele User kommen in der ersten Woche zurück?
- **Month 1 Retention:** Wie viele User kommen im ersten Monat zurück?

---

## 🎯 7. User-Segmentation

### Segment 1: High-Value-Customers

- **Definition:** User mit `payment_success` und `properties.revenue > 200`
- **Use-Case:** Targeting für Premium-Features

### Segment 2: Churned-Users

- **Definition:** User die `payment_success` hatten, aber seit 30 Tagen nicht mehr aktiv
- **Use-Case:** Re-Engagement-Kampagnen

### Segment 3: Power-Sellers

- **Definition:** User mit `order_completed > 10`
- **Use-Case:** Seller-Incentive-Programme

---

## 📊 8. Best Practices

### 1. Naming-Conventions

- **Events:** `snake_case` (z.B. `payment_success`, `gig_viewed`)
- **Properties:** `snake_case` (z.B. `gig_id`, `price`, `category`)
- **Feature-Flags:** `snake_case` (z.B. `cta_button_text`, `video_calls_enabled`)

### 2. Event-Properties

Immer folgende Properties mitschicken:
- **User-ID:** `user_id` (für User-Segmentation)
- **Timestamp:** Automatisch von PostHog
- **Context:** `page`, `location`, `source` (wo kam der Event her?)

### 3. A/B-Test-Dauer

- **Minimum:** 1 Woche (für statistische Signifikanz)
- **Empfohlen:** 2-4 Wochen (für saisonale Effekte)

### 4. Sample-Size

- **Minimum:** 100 Conversions pro Variante
- **Empfohlen:** 500+ Conversions pro Variante

---

## 🆘 Troubleshooting

### Problem: Events werden nicht getrackt

**Lösung:**
1. Prüfe ob `POSTHOG_API_KEY` gesetzt ist
2. Prüfe Browser-Console auf Fehler
3. Prüfe PostHog-Dashboard → Live Events (sollte Events in Echtzeit zeigen)

### Problem: Feature-Flags funktionieren nicht

**Lösung:**
1. Prüfe ob `VITE_POSTHOG_API_KEY` gesetzt ist (Frontend)
2. Prüfe ob User identifiziert ist (`posthog.identify(userId)`)
3. Prüfe PostHog-Dashboard → Feature Flags → Flag ist aktiv

### Problem: A/B-Test zeigt keine Unterschiede

**Lösung:**
1. Prüfe Sample-Size (mindestens 100 Conversions pro Variante)
2. Prüfe Test-Dauer (mindestens 1 Woche)
3. Prüfe ob Varianten korrekt implementiert sind (Frontend-Code)

---

## 📚 Weitere Ressourcen

- **PostHog-Docs:** https://posthog.com/docs
- **A/B-Testing-Guide:** https://posthog.com/docs/experiments
- **Feature-Flags-Guide:** https://posthog.com/docs/feature-flags
- **Retention-Analysis:** https://posthog.com/docs/user-guides/retention
