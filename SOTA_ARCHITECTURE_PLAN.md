# SOTA 2025 Architecture Plan - Flinkly

**Team:** 50-Personen Elite-Team  
**Phase:** 2/10 - Architecture Plan  
**Status:** In Progress

---

## 1. WebGL Layer Architecture

### **1.1 Technology Stack**
- **Three.js** (r170+) - 3D Engine
- **@react-three/fiber** - React Renderer für Three.js
- **@react-three/drei** - Helper Components
- **glsl-noise** - Noise Functions für Shaders
- **postprocessing** - Post-Processing Effects

### **1.2 Scene Structure**
```
<Canvas>
  <HeroScene>
    <ParticleField />        // Noise-driven particles
    <GlowPoints />           // Interactive light points
    <ShaderBackground />     // Raymarching shader
    <ParallaxLayers />       // Depth layers
  </HeroScene>
  <PostProcessing>
    <Bloom />
    <ChromaticAberration />
    <Vignette />
  </PostProcessing>
</Canvas>
```

### **1.3 Shader System**
- **Background Shader:** Raymarching + Noise + Color Gradients
- **Particle Shader:** Point sprites + Glow + Mouse reactivity
- **Glow Shader:** Additive blending + HDR
- **Depth Shader:** Z-depth fog + Parallax

### **1.4 Performance Targets**
- 60fps on Desktop (1920x1080)
- 30fps on Mobile (adaptive quality)
- <5MB initial bundle
- Lazy-load WebGL on viewport

---

## 2. Motion System Architecture

### **2.1 Technology Stack**
- **Framer Motion** (v12+) - React Animation Library
- **GSAP** (v3.12+) - Timeline orchestration
- **Lenis** - Smooth scroll
- **React Intersection Observer** - Scroll triggers

### **2.2 Motion Layers**

#### **Layer 1: Page Transitions**
- Mount/unmount animations
- Route transitions
- Staggered section reveals

#### **Layer 2: Scroll Animations**
- Parallax layers (different speeds)
- Fade-in on scroll
- Scale + opacity transforms
- Sticky elements with transforms

#### **Layer 3: Microinteractions**
- Hover states (scale, glow, shadow)
- Click feedback (ripple, scale)
- Focus states (outline, glow)
- Loading states (skeleton, shimmer)

#### **Layer 4: Kinetic Typography**
- Letter-by-letter reveals
- Word stagger
- Line animations
- Glitch effects

### **2.3 Easing Curves**
```ts
const EASING = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  snappy: [0.87, 0, 0.13, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.175, 0.885, 0.32, 1.275],
};
```

### **2.4 Timing System**
```ts
const TIMING = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};
```

---

## 3. Design Tokens System

### **3.1 Color System**
```ts
const COLORS = {
  // Primary (Brand)
  primary: {
    50: 'oklch(97% 0.01 250)',
    100: 'oklch(94% 0.03 250)',
    200: 'oklch(88% 0.06 250)',
    300: 'oklch(80% 0.10 250)',
    400: 'oklch(70% 0.14 250)',
    500: 'oklch(60% 0.18 250)', // Main
    600: 'oklch(50% 0.20 250)',
    700: 'oklch(40% 0.18 250)',
    800: 'oklch(30% 0.14 250)',
    900: 'oklch(20% 0.10 250)',
  },
  
  // Accent (Energy)
  accent: {
    cyan: 'oklch(75% 0.15 200)',
    magenta: 'oklch(65% 0.25 330)',
    yellow: 'oklch(85% 0.18 90)',
  },
  
  // Depth (Shadows & Glows)
  depth: {
    shadow: 'oklch(10% 0 0 / 0.3)',
    glow: 'oklch(90% 0.15 250 / 0.5)',
    highlight: 'oklch(100% 0 0 / 0.1)',
  },
};
```

### **3.2 Typography System**
```ts
const TYPOGRAPHY = {
  // Font Families
  display: 'Inter Variable, sans-serif',
  body: 'Inter Variable, sans-serif',
  mono: 'JetBrains Mono, monospace',
  
  // Font Sizes (Fluid)
  sizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
    base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
    '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
    '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
    '6xl': 'clamp(4rem, 3rem + 5vw, 6rem)',
  },
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### **3.3 Spacing System**
```ts
const SPACING = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  64: '16rem',   // 256px
};
```

### **3.4 Shadow System**
```ts
const SHADOWS = {
  sm: '0 1px 2px oklch(0% 0 0 / 0.05)',
  base: '0 1px 3px oklch(0% 0 0 / 0.1), 0 1px 2px oklch(0% 0 0 / 0.06)',
  md: '0 4px 6px oklch(0% 0 0 / 0.07), 0 2px 4px oklch(0% 0 0 / 0.06)',
  lg: '0 10px 15px oklch(0% 0 0 / 0.1), 0 4px 6px oklch(0% 0 0 / 0.05)',
  xl: '0 20px 25px oklch(0% 0 0 / 0.1), 0 10px 10px oklch(0% 0 0 / 0.04)',
  '2xl': '0 25px 50px oklch(0% 0 0 / 0.25)',
  glow: '0 0 20px oklch(60% 0.18 250 / 0.5)',
  glowStrong: '0 0 40px oklch(60% 0.18 250 / 0.8)',
};
```

### **3.5 Border Radius System**
```ts
const RADIUS = {
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
};
```

---

## 4. Cursor System Architecture

### **4.1 Cursor States**
```ts
type CursorState = 
  | 'default'      // Normal pointer
  | 'hover'        // Over interactive element
  | 'active'       // Click/drag
  | 'text'         // Over text
  | 'disabled'     // Over disabled element
  | 'loading';     // Loading state
```

### **4.2 Cursor Features**
- **Magnetism:** Cursor snaps to interactive elements
- **Glow Trail:** Particle trail following cursor
- **Depth Transform:** Cursor changes size based on depth
- **UI-Reactive:** Cursor changes based on element type

### **4.3 Implementation**
```tsx
<CustomCursor>
  <CursorDot />           // Main cursor dot
  <CursorGlow />          // Glow effect
  <CursorTrail />         // Particle trail
  <CursorMagnet />        // Magnetism effect
</CustomCursor>
```

---

## 5. Layout Architecture

### **5.1 Grid System**
```ts
const GRID = {
  columns: 12,
  gutter: '2rem',
  maxWidth: '1440px',
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
```

### **5.2 Layout Patterns**

#### **Hero Section**
- Asymmetric grid (60/40 split)
- WebGL background
- Kinetic typography
- CTA with magnetism

#### **Feature Sections**
- Alternating layouts (left/right)
- Parallax images
- Staggered reveals
- Depth layers

#### **Footer**
- Full-width
- Depth shadow
- Microinteractions

---

## 6. Component Architecture

### **6.1 Core Components**
```
components/
├── webgl/
│   ├── HeroScene.tsx
│   ├── ParticleField.tsx
│   ├── GlowPoints.tsx
│   ├── ShaderBackground.tsx
│   └── ParallaxLayers.tsx
├── motion/
│   ├── AnimatedSection.tsx
│   ├── StaggeredList.tsx
│   ├── KineticText.tsx
│   └── ScrollReveal.tsx
├── cursor/
│   ├── CustomCursor.tsx
│   ├── CursorDot.tsx
│   ├── CursorGlow.tsx
│   └── CursorTrail.tsx
├── ui/
│   ├── Button.tsx (enhanced)
│   ├── Card.tsx (enhanced)
│   └── Input.tsx (enhanced)
└── layout/
    ├── HeroLayout.tsx
    ├── FeatureLayout.tsx
    └── FooterLayout.tsx
```

---

## 7. File Structure

```
client/src/
├── components/
│   ├── webgl/          # WebGL components
│   ├── motion/         # Motion components
│   ├── cursor/         # Cursor system
│   ├── ui/             # Enhanced UI components
│   └── layout/         # Layout components
├── lib/
│   ├── webgl/          # WebGL utilities
│   ├── motion/         # Motion utilities
│   ├── cursor/         # Cursor utilities
│   └── tokens/         # Design tokens
├── shaders/
│   ├── background.glsl
│   ├── particles.glsl
│   ├── glow.glsl
│   └── depth.glsl
├── hooks/
│   ├── useWebGL.ts
│   ├── useMotion.ts
│   ├── useCursor.ts
│   └── useScroll.ts
└── pages/
    ├── Home.tsx (enhanced)
    ├── Marketplace.tsx (enhanced)
    └── GigDetail.tsx (enhanced)
```

---

## 8. Implementation Order

### **Phase 3: WebGL Hero Layer** (Next)
1. Install Three.js dependencies
2. Create HeroScene component
3. Implement ParticleField
4. Implement ShaderBackground
5. Add PostProcessing
6. Test performance

### **Phase 4: Motion Architecture**
1. Install Framer Motion + GSAP
2. Create motion utilities
3. Implement AnimatedSection
4. Implement KineticText
5. Add scroll animations
6. Test performance

### **Phase 5: Cursor System**
1. Create CustomCursor component
2. Implement magnetism
3. Implement glow trail
4. Add UI-reactive states
5. Test performance

### **Phase 6: Visual Identity**
1. Define design tokens
2. Update index.css
3. Create token utilities
4. Apply to components
5. Test consistency

### **Phase 7: Layout Transformation**
1. Create HeroLayout
2. Update Home.tsx
3. Create FeatureLayout
4. Update Marketplace.tsx
5. Test responsiveness

### **Phase 8: Performance Pass**
1. WebGL optimization
2. Motion optimization
3. Bundle size optimization
4. Lazy loading
5. Performance testing

---

## 9. Success Criteria

- ✅ 60fps on Desktop
- ✅ 30fps on Mobile
- ✅ <5MB initial bundle
- ✅ Lighthouse Performance >90
- ✅ Visual Score 10/10
- ✅ Motion Score 10/10
- ✅ WebGL Score 10/10

---

**Status:** ✅ Phase 2 Complete - Ready for Phase 3 (WebGL Hero Layer Implementation)
