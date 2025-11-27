# Deployment Troubleshooting Guide

## 🚨 Aktuelles Problem

**Symptom:** Marketplace zeigt 0 Gigs auf Production (https://flinkly-dach-pv3g2vyh.manus.space/marketplace)

**Status:**
- ✅ Localhost funktioniert (Gigs werden angezeigt)
- ❌ Production zeigt 0 Gigs
- ✅ Datenbank ist verbunden (beide verwenden dieselbe DB)
- ✅ API ist erreichbar (HTTP 204 Response)

## 🔍 Diagnose

### 1. Alte Build-Artefakte auf Production
Die CSP-Header zeigen noch die alte Konfiguration:
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://manus-analytics.com
```

**Erwartete neue Konfiguration (nach Fix):**
```
script-src 'self' 'unsafe-inline' https://manus-analytics.com
```
(ohne `'unsafe-eval'` in Production)

### 2. Mögliche Ursachen

#### A. Build nicht aktualisiert
```bash
# Lösung: Neu bauen
pnpm run build
```

#### B. Server nicht neu gestartet
```bash
# Lösung: Server neu starten
pm2 restart flinkly
# oder
systemctl restart flinkly
```

#### C. CDN/Cloudflare Cache
Die Response-Header zeigen:
```
server: cloudflare
cf-cache-status: DYNAMIC
```

**Lösung: Cache leeren**
1. Cloudflare Dashboard öffnen
2. Caching → Configuration → Purge Everything
3. Oder: Purge by URL für `/api/trpc/gigs.list`

#### D. Environment-Variablen fehlen
Prüfe ob auf Production gesetzt:
- `DATABASE_URL` ✅ (funktioniert auf localhost)
- `REDIS_URL` ⚠️ (optional, aber empfohlen)
- `NODE_ENV=production` ⚠️ (wichtig für CSP)

## ✅ Schritt-für-Schritt Lösung

### Schritt 1: Aktuellen Code pullen
```bash
cd /path/to/flinkly
git pull origin main
```

### Schritt 2: Dependencies installieren
```bash
pnpm install
```

### Schritt 3: Production Build erstellen
```bash
pnpm run build
```

**Erwartete Ausgabe:**
- `dist/public/` Verzeichnis wird erstellt
- Minifizierte JS/CSS-Dateien
- Keine Source Maps (sourcemap: false)
- Optimierte Chunks (react-vendor, router, ui)

### Schritt 4: Environment-Variablen prüfen
```bash
# Auf dem Production-Server
cat .env | grep -E "(DATABASE_URL|REDIS_URL|NODE_ENV)"
```

**Erwartete Werte:**
```env
DATABASE_URL=mysql://user:pass@host:port/database
REDIS_URL=redis://localhost:6379  # Optional
NODE_ENV=production  # Wichtig!
```

### Schritt 5: Server neu starten
```bash
# Option A: PM2
pm2 restart flinkly
pm2 logs flinkly --lines 100

# Option B: systemd
sudo systemctl restart flinkly
sudo journalctl -u flinkly -n 100 -f

# Option C: Direkt
pkill -f "node.*server"
pnpm run start
```

### Schritt 6: Logs prüfen
Suche nach diesen Meldungen:
```
[Redis] Connected successfully  # Optional
[Database] Connected successfully
[getGigsPaginated] Returning X gigs
```

**Fehler-Meldungen:**
```
[getGigsPaginated] Database connection not available  # ❌ DB-Problem
[getGigsPaginated] Database query failed  # ❌ Query-Problem
[Redis] Failed to connect  # ⚠️ OK (optional)
```

### Schritt 7: Cache leeren (Cloudflare)
1. Gehe zu Cloudflare Dashboard
2. Wähle die Domain aus
3. Caching → Configuration
4. "Purge Everything" klicken
5. Warte 30 Sekunden

### Schritt 8: Testen
```bash
# Test 1: API-Endpunkt
curl -v "https://flinkly-dach-pv3g2vyh.manus.space/api/trpc/gigs.list?input=%7B%22json%22%3A%7B%22limit%22%3A20%7D%7D"

# Erwartete Ausgabe:
# {"result":{"data":{"json":{"gigs":[...],"nextCursor":null}}}}

# Test 2: CSP-Header prüfen
curl -I https://flinkly-dach-pv3g2vyh.manus.space/marketplace | grep -i "content-security-policy"

# Erwartete Ausgabe (ohne 'unsafe-eval'):
# content-security-policy: ... script-src 'self' 'unsafe-inline' https://manus-analytics.com ...
```

## 🐛 Debugging

### Problem: Immer noch 0 Gigs

#### Check 1: Sind Gigs in der Datenbank?
```bash
# Auf dem Server mit DB-Zugriff
mysql -u user -p database -e "SELECT COUNT(*) FROM gigs WHERE active = 1 AND status = 'published';"
```

**Erwartete Ausgabe:** > 0

**Falls 0:** Erstelle einen Test-Gig über `/create-gig`

#### Check 2: API gibt Daten zurück?
```bash
curl -s "https://flinkly-dach-pv3g2vyh.manus.space/api/trpc/gigs.list?input=%7B%22json%22%3A%7B%22limit%22%3A20%7D%7D" | jq '.result.data.json.gigs | length'
```

**Erwartete Ausgabe:** > 0

**Falls 0:** 
- Prüfe Server-Logs
- Prüfe `getGigsPaginated` Funktion
- Prüfe Filter-Parameter

#### Check 3: Frontend lädt Daten?
Browser-Konsole öffnen:
```javascript
// Prüfe tRPC-Query
console.log('[Marketplace] Query State:', { isLoading, isError, hasData: !!gigs });
```

**Erwartete Ausgabe:**
```
[Marketplace] Query State: { isLoading: false, isError: false, hasData: true }
[Marketplace] Gigs data: { gigs: [...], nextCursor: null }
```

**Falls isError: true:**
- Prüfe Network-Tab für failed requests
- Prüfe CORS-Header
- Prüfe CSP-Header

## 📊 Erwartete Metriken nach Fix

### Performance
- ⚡ First Contentful Paint: < 1.5s
- ⚡ Time to Interactive: < 3s
- ⚡ Largest Contentful Paint: < 2.5s

### Funktionalität
- ✅ Gigs werden geladen
- ✅ Keine CSP-Warnungen
- ✅ Keine 500-Fehler
- ✅ Filter funktionieren

### Sicherheit
- ✅ Keine `'unsafe-eval'` in Production
- ✅ Source Maps deaktiviert
- ✅ console.log entfernt

## 🔧 Schnell-Fixes

### Quick Fix 1: Force Rebuild
```bash
rm -rf dist node_modules/.vite
pnpm install
pnpm run build
```

### Quick Fix 2: Clear All Caches
```bash
# Redis
redis-cli FLUSHALL

# Cloudflare
# Via Dashboard: Purge Everything

# Browser
# Hard Reload: Ctrl+Shift+R (Windows/Linux) oder Cmd+Shift+R (Mac)
```

### Quick Fix 3: Rollback
Falls nichts funktioniert:
```bash
git log --oneline -10  # Finde letzten funktionierenden Commit
git checkout <commit-hash>
pnpm install
pnpm run build
```

## 📞 Support

Falls das Problem weiterhin besteht:

1. **Logs sammeln:**
   ```bash
   # Server-Logs
   pm2 logs flinkly --lines 500 > server.log
   
   # Browser-Logs
   # F12 → Console → Rechtsklick → "Save as..."
   ```

2. **System-Info:**
   ```bash
   node --version
   pnpm --version
   mysql --version
   redis-cli --version
   ```

3. **Deployment-Info:**
   ```bash
   git log -1
   git status
   env | grep -E "(NODE_ENV|DATABASE_URL|REDIS_URL)"
   ```

---

**Letzte Aktualisierung:** 27. November 2025  
**Status:** Fixes implementiert, Deployment ausstehend
