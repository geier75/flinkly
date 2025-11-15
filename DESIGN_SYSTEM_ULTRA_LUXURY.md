# FLINKLY ULTRA-LUXURY DESIGN SYSTEM

**Version:** 2.0  
**Letzte Aktualisierung:** 15. November 2025  
**Status:** Production-Ready

---

## 🎨 FARBPALETTE

### Primary Colors
- **Violett (Primary):** `#8b5cf6` / `oklch(0.68 0.18 290)`
  - Verwendung: Haupt-CTAs, Hover-States, Active-States
  - Psychologie: Kreativität, Innovation, Premium

- **Blau (Secondary):** `#3b82f6` / `oklch(0.65 0.19 265)`
  - Verwendung: Links, Secondary-CTAs, Trust-Elemente
  - Psychologie: Vertrauen, Stabilität, Professionalität

- **Orange (Accent):** `#ff6b35` / `oklch(0.70 0.20 35)`
  - Verwendung: Primary-CTAs, Highlights, Urgency
  - Psychologie: Action, Energie, Conversion

- **Gold (Success):** `#fbbf24` / `oklch(0.75 0.15 90)`
  - Verwendung: Success-States, Achievements, Badges
  - Psychologie: Erfolg, Belohnung, Premium

### Background Colors
- **Dunkel-Violett:** `#0f0c1f` / `oklch(0.12 0.02 290)`
  - Verwendung: Page-Background, Dark-Mode
  - Psychologie: Tiefe, Fokus, Exklusivität

- **Slate-900:** `#0f172a`
  - Verwendung: Card-Backgrounds (mit Glassmorphism)

- **Slate-800:** `#1e293b`
  - Verwendung: Hover-States, Secondary-Backgrounds

### Gradient Colors
- **Violett → Blau → Orange:** `from-primary via-secondary to-accent`
  - Verwendung: Hero-Headlines, Gradient-Text
  - Effekt: Animierter Farbverlauf (4s Loop)

---

## 🌟 GLASSMORPHISM

### Standard-Card
```css
bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50
```

### Hover-State
```css
hover:border-primary hover:bg-slate-900/60
```

### Shadow-System (Multi-Layer)
```css
shadow-[
  0_8px_16px_rgba(0,0,0,0.3),
  0_20px_40px_rgba(0,0,0,0.4),
  0_50px_80px_rgba(0,0,0,0.5)
]
```

### Hover-Shadow (Glow)
```css
hover:shadow-[
  0_20px_40px_rgba(0,0,0,0.5),
  0_50px_80px_rgba(139,92,246,0.5),
  0_0_100px_rgba(139,92,246,0.3)
]
```

---

## 🎬 VIDEO-BACKGROUNDS

### WebGL-Integration
```tsx
<VideoScene
  videoSrc="/videos/[page-name].mp4"
  blendMode="overlay"
  opacity={0.4}
  brightness={1.4}
  contrast={1.2}
  saturation={1.2}
  className="w-full h-full scale-110"
/>
```

### Gradient-Overlay
```css
bg-gradient-to-t from-violet-950/50 via-slate-900/30 to-slate-950/60
```

### Video-Positionen
- **Homepage Hero:** `/videos/hero-collaboration.mp4`
- **Marketplace:** `/videos/marketplace-luxury.mp4`
- **GigDetail:** `/videos/marketplace-luxury.mp4` (gleicher wie Marketplace)
- **CreateGig:** `/videos/create-gig-flinkly.mp4`
- **Service-Cards:** `/videos/services-expertise.mp4`

---

## ✨ TYPOGRAPHY

### Headlines
```css
/* Hero-Headline */
text-7xl md:text-8xl font-black tracking-tight
text-shadow: 0 0 60px rgba(139, 92, 246, 0.4)

/* Section-Headline */
text-5xl md:text-6xl font-extrabold tracking-tight
bg-gradient-to-r from-primary via-secondary to-accent
bg-clip-text text-transparent
```

### Body-Text
```css
/* Primary */
text-slate-200 text-lg leading-relaxed

/* Secondary */
text-slate-300 text-base leading-relaxed

/* Small */
text-slate-400 text-sm
```

### Gradient-Text-Animation
```css
.animated-gradient-text {
  background: linear-gradient(
    90deg,
    #ff6b35 0%,    /* Orange */
    #10b981 25%,   /* Grün */
    #ff6b35 50%,   /* Orange */
    #10b981 75%,   /* Grün */
    #ff6b35 100%   /* Orange */
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 4s linear infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

---

## 🎭 ANIMATIONS (FRAMER MOTION)

### Stagger-Animation (Cards)
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
>
```

### Floating-Animation (Badges, CTAs)
```tsx
<motion.div
  animate={{ y: [0, -5, 0] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
>
```

### Hover-Scale (Cards)
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -10 }}
  transition={{ duration: 0.3 }}
>
```

### Shimmer-Effect (Hover)
```css
/* Shimmer-Overlay */
<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
```

### Ken-Burns-Effect (Images)
```tsx
<motion.img
  whileHover={{ 
    scale: 1.1,
    brightness: 1.1,
    transition: { duration: 0.5 }
  }}
/>
```

---

## 🔘 BUTTONS

### Primary CTA (Orange)
```tsx
<button className="
  bg-accent hover:bg-accent/90
  text-white font-bold
  px-8 py-4 rounded-xl
  shadow-lg shadow-accent/30 hover:shadow-accent/50
  transition-all duration-300
  hover:scale-105 hover:-translate-y-1
">
```

### Secondary CTA (Violett Border)
```tsx
<button className="
  border-2 border-primary/50 hover:border-primary
  bg-transparent hover:bg-primary/20
  text-white font-bold
  px-8 py-4 rounded-xl
  transition-all duration-300
  hover:scale-105
">
```

### Glassmorphism-Button
```tsx
<button className="
  bg-slate-900/60 backdrop-blur-xl
  border-2 border-slate-700/50 hover:border-primary/50
  text-white font-bold
  px-6 py-3 rounded-xl
  transition-all duration-300
  hover:scale-110
">
```

---

## 📦 CARDS

### Standard-Card
```tsx
<Card className="
  bg-slate-900/40 backdrop-blur-xl
  border-2 border-slate-700/50 hover:border-primary
  rounded-2xl overflow-hidden
  shadow-[0_8px_16px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)]
  hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_50px_80px_rgba(139,92,246,0.5),0_0_100px_rgba(139,92,246,0.3)]
  transition-all duration-500
  group cursor-pointer
">
```

### Image-Overlay
```tsx
<div className="relative h-64 overflow-hidden">
  <img src="..." className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
</div>
```

### Content-Padding
```css
p-6 md:p-8
```

---

## 🎯 HOVER-EFFECTS

### Glow-Effect
```tsx
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
  <div className="absolute inset-0 shadow-[0_0_80px_rgba(139,92,246,0.3)]" />
</div>
```

### Arrow-Indicator
```tsx
<motion.div 
  className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300"
  initial={{ x: 0 }}
  whileHover={{ x: 8 }}
>
  <span className="text-sm font-bold">Mehr erfahren</span>
  <ArrowRight className="h-4 w-4" />
</motion.div>
```

---

## 📐 SPACING-SYSTEM

### Container
```css
max-w-7xl mx-auto px-4 md:px-6 lg:px-8
```

### Section-Spacing
```css
py-16 md:py-24 lg:py-32
```

### Card-Gap
```css
gap-6 md:gap-8
```

---

## 🎨 GRADIENT-OVERLAYS

### Hero-Section
```css
bg-gradient-to-t from-violet-950/50 via-slate-900/30 to-slate-950/60
```

### Card-Overlay
```css
bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent
```

### Border-Glow
```css
bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20
```

---

## 🔍 ACCESSIBILITY

### Focus-States
```css
focus:ring-4 focus:ring-primary/50 focus:outline-none
```

### ARIA-Labels
```tsx
<button aria-label="Go to slide 1">
```

### Reduced-Motion
```tsx
// Framer Motion respektiert automatisch prefers-reduced-motion
```

### Contrast-Ratios
- Text auf Dunkel-Violett: 9.2:1 (WCAG AAA)
- Orange auf Dunkel: 4.8:1 (WCAG AA)
- Violett auf Dunkel: 4.5:1 (WCAG AA)

---

## 📱 RESPONSIVE-DESIGN

### Breakpoints
- **Mobile:** < 768px (1 Column)
- **Tablet:** 768px - 1024px (2 Columns)
- **Desktop:** > 1024px (3 Columns)

### Grid-System
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🚀 PERFORMANCE

### GPU-Acceleration
```css
will-change: transform, opacity
```

### Image-Optimization
- WebP-Format bevorzugen
- Lazy-Loading mit Intersection Observer
- aspect-ratio für Layout-Shifts vermeiden

### Video-Optimization
- Scale-110 für Parallax (verhindert schwarze Ränder)
- opacity 0.4 für Performance
- blendMode: overlay für GPU-Beschleunigung

---

## 📋 CHECKLISTE FÜR NEUE SEITEN

- [ ] 4K Video-Background mit VideoScene
- [ ] Glassmorphism-Cards (bg-slate-900/40, backdrop-blur-xl)
- [ ] Violett-Gradient-Overlay
- [ ] Gradient-Text für Headlines (from-primary via-secondary to-accent)
- [ ] Multi-Layer-Shadows
- [ ] Framer Motion Stagger-Animations
- [ ] Hover-Glow-Effekte
- [ ] Shimmer-Effect auf Cards
- [ ] Ken-Burns-Effect auf Images
- [ ] Orange Primary-CTAs
- [ ] Violett Secondary-CTAs
- [ ] Progress-Dots (falls Carousel)
- [ ] ARIA-Labels für Accessibility
- [ ] Responsive Grid (1/2/3 Columns)
- [ ] TypeScript: 0 Errors

---

**Ende der Design-System-Dokumentation**
