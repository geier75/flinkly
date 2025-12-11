# 🔑 Flinkly - API Keys & Credentials Planung

**Erstellt:** 02. Dezember 2025  
**Status:** Planungsdokument für Launch-Vorbereitung

---

## 📋 Übersicht

Dieses Dokument listet alle benötigten API-Keys, Credentials und Dienste für Flinkly auf, kategorisiert nach Priorität und Kosten.

---

## 🚨 KRITISCH - Ohne diese funktioniert nichts

### 1. Stripe (Zahlungen)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `STRIPE_SECRET_KEY` | Server-seitiger API Key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client-seitiger API Key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook Signatur-Verifizierung | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) |

**Kosten:** 1,4% + 0,25€ pro Transaktion (EU-Karten)  
**Test-Keys:** Verfügbar (sk_test_..., pk_test_...)  
**Setup-Zeit:** 30 Minuten

**Benötigte Stripe-Produkte:**
- ✅ Stripe Payments (Checkout)
- ✅ Stripe Connect (Seller-Auszahlungen)
- ⚠️ Stripe Billing (optional für Subscriptions)

---

### 2. Datenbank (MySQL)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `DATABASE_URL` | MySQL Connection String | Eigener Server oder Cloud |

**Format:** `mysql://user:password@host:3306/flinkly`

**Optionen:**
| Anbieter | Kosten | Empfehlung |
|----------|--------|------------|
| **PlanetScale** | Free Tier: 5GB | ⭐ Empfohlen für Start |
| **Railway** | $5/Monat | Gut für Prototypen |
| **AWS RDS** | ~$15/Monat | Für Production |
| **DigitalOcean** | $15/Monat | Einfach zu verwalten |
| **Eigener Server** | Variabel | Volle Kontrolle |

**Setup-Zeit:** 15-60 Minuten

---

### 3. OAuth / Authentifizierung
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `OAUTH_SERVER_URL` | OAuth Provider URL | Eigener Auth-Server oder Dienst |
| `VITE_OAUTH_PORTAL_URL` | Frontend OAuth URL | Gleicher Provider |
| `JWT_SECRET` | JWT Signatur-Secret | Selbst generieren |
| `OWNER_OPEN_ID` | Admin User ID | Nach erstem Login |

**Optionen:**
| Anbieter | Kosten | Features |
|----------|--------|----------|
| **Auth0** | Free: 7.000 MAU | Social Login, MFA |
| **Clerk** | Free: 5.000 MAU | Modern, React-native |
| **Supabase Auth** | Free: Unlimited | Open Source |
| **Firebase Auth** | Free: 50.000 MAU | Google-Integration |
| **Eigener Server** | Hosting-Kosten | Volle Kontrolle |

**Setup-Zeit:** 1-4 Stunden

---

## ⚠️ WICHTIG - Für volle Funktionalität

### 4. Redis (Caching)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `REDIS_URL` | Redis Connection String | Cloud oder lokal |

**Format:** `redis://user:password@host:6379`

**Optionen:**
| Anbieter | Kosten | Empfehlung |
|----------|--------|------------|
| **Upstash** | Free: 10.000 Requests/Tag | ⭐ Empfohlen |
| **Redis Cloud** | Free: 30MB | Gut für Start |
| **Railway** | $5/Monat | Einfach |
| **Lokal** | Kostenlos | Nur für Dev |

**Ohne Redis:** App funktioniert, aber langsamer (kein Caching)  
**Setup-Zeit:** 10 Minuten

---

### 5. Email (SMTP)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `SMTP_HOST` | SMTP Server | Email-Provider |
| `SMTP_PORT` | Port (587 TLS, 465 SSL) | Email-Provider |
| `SMTP_USER` | Benutzername/API-Key | Email-Provider |
| `SMTP_PASS` | Passwort/API-Secret | Email-Provider |
| `SMTP_FROM` | Absender-Adresse | z.B. `Flinkly <noreply@flinkly.de>` |

**Optionen:**
| Anbieter | Free Tier | Kosten danach | Empfehlung |
|----------|-----------|---------------|------------|
| **Resend** | 3.000/Monat | $20/10.000 | ⭐ Modern, einfach |
| **SendGrid** | 100/Tag | $15/40.000 | Etabliert |
| **Mailgun** | 5.000/Monat | $35/50.000 | Gut für Transaktional |
| **Amazon SES** | 62.000/Monat* | $0.10/1.000 | Günstigster |
| **Gmail** | 500/Tag | - | Nur für Tests |

*SES Free Tier nur wenn von EC2 gesendet

**Ohne Email:** Keine Benachrichtigungen (Order, Messages, etc.)  
**Setup-Zeit:** 30 Minuten

---

## 📊 EMPFOHLEN - Für Analytics & Monitoring

### 6. Sentry (Error Tracking)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `SENTRY_DSN` | Data Source Name | [Sentry.io](https://sentry.io) |
| `SENTRY_ENVIRONMENT` | Environment (production/staging) | Selbst setzen |
| `VITE_SENTRY_DSN` | Frontend DSN | Gleicher Wert |

**Kosten:**
| Plan | Preis | Events/Monat |
|------|-------|--------------|
| **Developer** | Kostenlos | 5.000 |
| **Team** | $26/Monat | 50.000 |
| **Business** | $80/Monat | 100.000 |

**Ohne Sentry:** Keine automatische Fehler-Erkennung  
**Setup-Zeit:** 15 Minuten

---

### 7. PostHog (Product Analytics)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `POSTHOG_API_KEY` | Server API Key | [PostHog.com](https://posthog.com) |
| `POSTHOG_HOST` | API Host | `https://app.posthog.com` |
| `VITE_POSTHOG_API_KEY` | Frontend API Key | Gleicher Wert |
| `VITE_POSTHOG_HOST` | Frontend Host | Gleicher Wert |

**Kosten:**
| Plan | Preis | Events/Monat |
|------|-------|--------------|
| **Free** | Kostenlos | 1 Million |
| **Scale** | Ab $0 | Pay-per-use |

**Features:**
- ✅ Event Tracking
- ✅ Conversion Funnels
- ✅ A/B Testing (Feature Flags)
- ✅ Session Recording

**Ohne PostHog:** Keine Analytics, kein A/B-Testing  
**Setup-Zeit:** 20 Minuten

---

## 🔧 OPTIONAL - Erweiterte Features

### 8. AWS (File Storage & Image Moderation)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM Access Key | [AWS Console](https://console.aws.amazon.com/iam) |
| `AWS_SECRET_ACCESS_KEY` | IAM Secret Key | AWS Console |
| `AWS_REGION` | Region (z.B. eu-central-1) | Selbst wählen |
| `AWS_S3_BUCKET` | S3 Bucket Name | AWS S3 Console |

**Benötigte Services:**
| Service | Zweck | Kosten |
|---------|-------|--------|
| **S3** | File Storage | ~$0.023/GB |
| **Rekognition** | Image Moderation | $1/1.000 Bilder |

**Alternativen zu S3:**
- **Cloudflare R2** - Kostenlos für 10GB, kein Egress
- **Backblaze B2** - $0.005/GB
- **DigitalOcean Spaces** - $5/250GB

**Ohne AWS:** Keine Bild-Uploads, keine automatische Moderation  
**Setup-Zeit:** 45 Minuten

---

### 9. Google Maps (Karten)
| Variable | Beschreibung | Wo besorgen |
|----------|--------------|-------------|
| `VITE_FRONTEND_FORGE_API_KEY` | Maps API Key (via Proxy) | Forge/Google |
| `VITE_FRONTEND_FORGE_API_URL` | Forge API URL | Forge Dashboard |

**Hinweis:** Flinkly nutzt einen Proxy-Service (Forge) für Google Maps.

**Kosten:** Abhängig vom Proxy-Anbieter  
**Ohne Maps:** Keine Kartenansicht für Seller-Standorte  
**Setup-Zeit:** 30 Minuten

---

## 📝 Vollständige .env Template

```bash
# ============================================
# FLINKLY - ENVIRONMENT VARIABLES
# ============================================
# Kopiere diese Datei nach .env und fülle die Werte aus

# --------------------------------------------
# 🚨 KRITISCH - Ohne diese funktioniert nichts
# --------------------------------------------

# App Configuration
NODE_ENV=production
PORT=3000
VITE_APP_ID=flinkly
VITE_APP_TITLE=Flinkly
VITE_FRONTEND_URL=https://flinkly.de

# Database (MySQL)
DATABASE_URL=mysql://user:password@host:3306/flinkly

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
OAUTH_SERVER_URL=https://auth.flinkly.de
VITE_OAUTH_PORTAL_URL=https://auth.flinkly.de
OWNER_OPEN_ID=admin-user-open-id

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_live_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# --------------------------------------------
# ⚠️ WICHTIG - Für volle Funktionalität
# --------------------------------------------

# Redis (Caching)
REDIS_URL=redis://user:password@host:6379

# Email (SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxx
SMTP_FROM=Flinkly <noreply@flinkly.de>

# --------------------------------------------
# 📊 EMPFOHLEN - Analytics & Monitoring
# --------------------------------------------

# Sentry (Error Tracking)
SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
SENTRY_ENVIRONMENT=production
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz

# PostHog (Analytics)
POSTHOG_API_KEY=phc_xxx
POSTHOG_HOST=https://app.posthog.com
VITE_POSTHOG_API_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com

# --------------------------------------------
# 🔧 OPTIONAL - Erweiterte Features
# --------------------------------------------

# AWS (S3 + Rekognition)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=eu-central-1
AWS_S3_BUCKET=flinkly-uploads

# Google Maps (via Forge Proxy)
VITE_FRONTEND_FORGE_API_KEY=xxx
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev

# Forge API (AI Features)
BUILT_IN_FORGE_API_URL=https://api.forge.example.com
BUILT_IN_FORGE_API_KEY=xxx
```

---

## 💰 Kosten-Übersicht

### Minimal-Setup (MVP Launch)
| Service | Anbieter | Kosten/Monat |
|---------|----------|--------------|
| Database | PlanetScale Free | $0 |
| Auth | Supabase Auth | $0 |
| Payments | Stripe | 1,4% + 0,25€/Tx |
| Email | Resend Free | $0 |
| **Total** | | **~$0** + Stripe-Gebühren |

### Empfohlenes Setup (Production)
| Service | Anbieter | Kosten/Monat |
|---------|----------|--------------|
| Database | PlanetScale Scaler | $29 |
| Auth | Auth0 Free | $0 |
| Payments | Stripe | 1,4% + 0,25€/Tx |
| Redis | Upstash Pro | $10 |
| Email | Resend Pro | $20 |
| Sentry | Team | $26 |
| PostHog | Free | $0 |
| S3 | AWS | ~$5 |
| **Total** | | **~$90/Monat** + Stripe |

### Enterprise Setup
| Service | Anbieter | Kosten/Monat |
|---------|----------|--------------|
| Database | AWS RDS | $50+ |
| Auth | Auth0 Business | $240+ |
| Payments | Stripe | 1,4% + 0,25€/Tx |
| Redis | Redis Cloud | $50+ |
| Email | SendGrid Pro | $90+ |
| Sentry | Business | $80 |
| PostHog | Scale | Pay-per-use |
| AWS | Full Suite | $100+ |
| **Total** | | **$600+/Monat** |

---

## 🚀 Setup-Reihenfolge

### Phase 1: Basis (Tag 1)
1. ✅ MySQL-Datenbank einrichten
2. ✅ Stripe-Account erstellen (Test-Keys)
3. ✅ JWT_SECRET generieren
4. ✅ Lokaler Test

### Phase 2: Kommunikation (Tag 2)
5. ✅ Email-Provider einrichten (Resend/SendGrid)
6. ✅ Redis einrichten (Upstash)
7. ✅ OAuth-Provider konfigurieren

### Phase 3: Monitoring (Tag 3)
8. ✅ Sentry-Projekt erstellen
9. ✅ PostHog-Projekt erstellen
10. ✅ Feature Flags konfigurieren

### Phase 4: Production (Tag 4-5)
11. ✅ Stripe Live-Keys aktivieren
12. ✅ AWS S3 + Rekognition einrichten
13. ✅ Domain & SSL konfigurieren
14. ✅ Webhooks einrichten

---

## 🔐 Sicherheits-Checkliste

- [ ] Alle Keys in `.env` (nicht im Code!)
- [ ] `.env` in `.gitignore`
- [ ] Verschiedene Keys für Dev/Staging/Production
- [ ] Stripe Webhook-Signatur verifizieren
- [ ] JWT_SECRET mindestens 32 Zeichen
- [ ] HTTPS für alle Production-URLs
- [ ] Rate Limiting aktiviert
- [ ] CORS korrekt konfiguriert

---

**Erstellt von:** Cascade AI  
**Für:** Flinkly Marketplace Launch
