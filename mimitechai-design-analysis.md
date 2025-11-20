# MiMi Tech AI Design-Analyse (mimitechai.com)

**Quelle:** https://www.mimitechai.com  
**Datum:** 20. November 2025  
**Zweck:** Design-Elemente für Flinkly Impressumspflicht übernehmen

---

## 🎨 Design-Elemente

### Farbschema
- **Primärfarbe:** Cyan/Türkis (#00D9FF oder ähnlich)
- **Hintergrund:** Dunkel (fast schwarz, #0a0a0a)
- **Gradient:** Cyan → Blau (für CTA-Bereiche)
- **Text:** Weiß auf dunklem Hintergrund

### Typografie
- **Überschriften:** Groß, Bold, Weiß
- **Body-Text:** Hellgrau (#b0b0b0 oder ähnlich)
- **Font:** Modern, Sans-Serif (wahrscheinlich Inter oder ähnlich)

### Layout
- **Navigation:** Fixed Header, Cyan-Akzent für CTA-Button
- **Content:** Zentriert, großzügige Abstände
- **Cards:** Leicht transparenter Hintergrund (glassmorphism)
- **Buttons:** Cyan mit Hover-Effekt

### Komponenten
- **Hero-Section:** Großer Titel + Untertitel + CTA
- **Service-Cards:** 2-Spalten-Grid, abgerundete Ecken
- **CTA-Section:** Gradient-Hintergrund (Cyan → Blau)

---

## 📋 Impressum-Daten (aus mimitech-impressum-data.md)

```
Firma: MiMi Tech AI
Inhaber: Mirza Hasanbasic
Adresse: Hauptstraße 123, 10115 Berlin, Deutschland
E-Mail: info@mimitechai.com
Telefon: +49 30 12345678
USt-IdNr: DE123456789
Handelsregister: HRB 12345 B (Amtsgericht Charlottenburg)
```

---

## 🎯 Umsetzung für Flinkly

### Seller-Profil: Impressum-Anzeige (für gewerbliche Seller)

**Design:**
- Card mit dunklem Hintergrund (bg-slate-900/40)
- Cyan-Akzent für Überschrift
- Icon: Building2 (Lucide)
- Grid-Layout für Daten

**Felder:**
- Firmenname
- Inhaber/Geschäftsführer
- Vollständige Adresse
- E-Mail
- Telefon
- USt-IdNr.
- Handelsregister

**Beispiel-Code:**
```tsx
<Card className="bg-slate-900/40 border-2 border-slate-700/50">
  <CardContent className="p-6">
    <div className="flex items-center gap-3 mb-4">
      <Building2 className="h-6 w-6 text-cyan-400" />
      <h3 className="text-xl font-bold text-white">Impressum</h3>
    </div>
    <div className="space-y-3 text-slate-300">
      <div>
        <span className="text-slate-400">Firma:</span>
        <span className="ml-2 font-semibold">{companyName}</span>
      </div>
      {/* ... weitere Felder */}
    </div>
  </CardContent>
</Card>
```

---

## ✅ Nächste Schritte

1. Impressum-Daten aus mimitech-impressum-data.md laden
2. Seller-Onboarding: "Gewerblich?" Checkbox hinzufügen
3. Impressum-Pflichtfelder im Seller-Profil-Editor
4. Impressum-Card auf Seller-Profil anzeigen (nur für isCommercial=true)
