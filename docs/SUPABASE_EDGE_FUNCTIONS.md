# Supabase Edge Functions - Migration Guide

## Übersicht

Die tRPC-basierten API-Calls wurden durch Supabase Edge Functions ersetzt. Dies ermöglicht:
- **Keine zusätzlichen Kosten** - Läuft auf deinem bestehenden Supabase-Plan
- **Kein separater Server** - Kein Railway/Render/etc. nötig
- **Schnellere Deployments** - Änderungen sind sofort live
- **Bessere Skalierung** - Edge Functions skalieren automatisch

## Deployed Edge Functions

| Function | URL | Status |
|----------|-----|--------|
| `gigs` | `https://fpiszghehrjmkbxhbwqr.supabase.co/functions/v1/gigs` | ✅ ACTIVE |
| `auth` | `https://fpiszghehrjmkbxhbwqr.supabase.co/functions/v1/auth` | ✅ ACTIVE |
| `orders` | `https://fpiszghehrjmkbxhbwqr.supabase.co/functions/v1/orders` | ✅ ACTIVE |
| `users` | `https://fpiszghehrjmkbxhbwqr.supabase.co/functions/v1/users` | ✅ ACTIVE |

## API Endpoints

### Gigs

```bash
# Liste alle Gigs
GET /functions/v1/gigs
GET /functions/v1/gigs?category=design&sortBy=price&limit=20

# Einzelner Gig mit Packages und Seller
GET /functions/v1/gigs/361
```

### Auth

```bash
# Aktueller User (aus Session Cookie)
GET /functions/v1/auth/me

# Logout
POST /functions/v1/auth/logout
```

### Orders (Auth required)

```bash
# Liste Orders
GET /functions/v1/orders?role=buyer
GET /functions/v1/orders?role=seller

# Einzelne Order
GET /functions/v1/orders/123
```

### Users

```bash
# Public Profile
GET /functions/v1/users/826

# Update eigenes Profil (Auth required)
PUT /functions/v1/users/profile
Body: { "name": "Neuer Name", "bio": "Neue Bio" }
```

## Frontend Migration

### Vorher (tRPC)

```tsx
import { trpc } from '@/lib/trpc';

function GigsList() {
  const { data, isLoading } = trpc.gigs.list.useQuery({ limit: 20 });
  return <div>{data?.gigs.map(g => <GigCard key={g.id} gig={g} />)}</div>;
}
```

### Nachher (API Client)

```tsx
import { useGigsList } from '@/hooks/useApi';

function GigsList() {
  const { data, isLoading } = useGigsList({ limit: 20 });
  return <div>{data?.gigs.map(g => <GigCard key={g.id} gig={g} />)}</div>;
}
```

## Neue Dateien

- `client/src/lib/api.ts` - API Client mit fetch
- `client/src/hooks/useApi.ts` - React Hooks für API-Calls
- `supabase/functions/gigs/index.ts` - Gigs Edge Function
- `supabase/functions/auth/index.ts` - Auth Edge Function
- `supabase/functions/orders/index.ts` - Orders Edge Function
- `supabase/functions/users/index.ts` - Users Edge Function

## Schrittweise Migration

1. **Neue Hooks importieren** statt tRPC:
   ```tsx
   // Alt
   import { trpc } from '@/lib/trpc';
   const { data } = trpc.gigs.list.useQuery();
   
   // Neu
   import { useGigsList } from '@/hooks/useApi';
   const { data } = useGigsList();
   ```

2. **Komponenten einzeln migrieren** - Beide Systeme können parallel laufen

3. **tRPC entfernen** wenn alle Komponenten migriert sind

## Lokale Entwicklung

Die Edge Functions laufen direkt auf Supabase. Für lokale Entwicklung:

```bash
# Supabase CLI installieren
npm install -g supabase

# Lokale Supabase starten
supabase start

# Edge Functions lokal testen
supabase functions serve
```

## Deployment

Edge Functions werden automatisch deployed wenn du sie über die Supabase CLI oder das Dashboard hochlädst:

```bash
# Einzelne Function deployen
supabase functions deploy gigs --project-ref fpiszghehrjmkbxhbwqr

# Alle Functions deployen
supabase functions deploy --project-ref fpiszghehrjmkbxhbwqr
```

## Fehlende Endpoints

Folgende tRPC-Endpoints müssen noch als Edge Functions implementiert werden:

- [ ] `stripeConnect` - Stripe Connect Onboarding
- [ ] `payment` - Checkout und Payment
- [ ] `messages` - Chat/Messaging
- [ ] `reviews` - Bewertungen
- [ ] `favorites` - Favoriten
- [ ] `admin` - Admin Dashboard
- [ ] `verification` - Email/Phone Verification

Diese können bei Bedarf hinzugefügt werden.
