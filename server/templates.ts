/**
 * Gig Templates - 10 templates per category
 * 
 * Helps sellers create professional gigs faster with pre-filled
 * titles, descriptions, and pricing suggestions.
 */

export interface GigTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  suggestedPrice: number; // in cents
  suggestedDeliveryDays: number;
  tags: string[];
}

export const GIG_TEMPLATES: GigTemplate[] = [
  // Design & Kreation (10 templates)
  {
    id: "design-logo-1",
    category: "Design & Kreation",
    title: "Professionelles Logo-Design für dein Startup",
    description: "Ich erstelle ein einzigartiges, modernes Logo für dein Startup oder Unternehmen.\n\n**Was du bekommst:**\n- 3 Logo-Konzepte zur Auswahl\n- Unbegrenzte Revisionen\n- Finale Dateien in AI, PNG, SVG\n- Farbvarianten (Vollfarbe, Schwarz-Weiß)\n- Brand-Guidelines (Farben, Schriften)\n\n**Mein Prozess:**\n1. Briefing-Call (15 Min)\n2. Konzept-Entwicklung\n3. Präsentation & Feedback\n4. Finalisierung\n\n**Warum ich?**\n- 5+ Jahre Erfahrung\n- 200+ zufriedene Kunden\n- Schnelle Kommunikation",
    suggestedPrice: 15000, // 150€
    suggestedDeliveryDays: 5,
    tags: ["Logo", "Branding", "Startup", "Design"],
  },
  {
    id: "design-social-media-1",
    category: "Design & Kreation",
    title: "Social Media Posts für Instagram & Facebook (10 Posts)",
    description: "Ich erstelle 10 professionelle Social Media Posts für deine Brand.\n\n**Lieferumfang:**\n- 10 Posts (1080x1080px)\n- Instagram & Facebook optimiert\n- Deine Brand-Farben & Fonts\n- Editierbare Canva-Vorlagen\n\n**Beispiel-Themen:**\n- Produkt-Showcase\n- Zitate & Motivation\n- Behind-the-Scenes\n- Testimonials\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 8000, // 80€
    suggestedDeliveryDays: 3,
    tags: ["Social Media", "Instagram", "Facebook", "Content"],
  },
  {
    id: "design-flyer-1",
    category: "Design & Kreation",
    title: "Flyer-Design (A5/A4) - Print-Ready",
    description: "Ich gestalte einen professionellen Flyer für dein Event oder Business.\n\n**Inklusive:**\n- 1 Flyer-Design (A5 oder A4)\n- Print-Ready PDF (300 DPI, CMYK)\n- 2 Revisionen\n- Druckerei-Empfehlungen\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 5000, // 50€
    suggestedDeliveryDays: 2,
    tags: ["Flyer", "Print", "Event", "Marketing"],
  },
  {
    id: "design-business-card-1",
    category: "Design & Kreation",
    title: "Visitenkarten-Design (beidseitig)",
    description: "Ich erstelle ein modernes Visitenkarten-Design.\n\n**Lieferumfang:**\n- Beidseitiges Design\n- Print-Ready PDF\n- 3 Revisionen\n\n**Turnaround:** 1 Tag",
    suggestedPrice: 3000, // 30€
    suggestedDeliveryDays: 1,
    tags: ["Visitenkarte", "Business Card", "Print"],
  },
  {
    id: "design-banner-1",
    category: "Design & Kreation",
    title: "Website-Banner / Header-Design",
    description: "Ich erstelle einen eye-catching Website-Banner.\n\n**Inklusive:**\n- 1 Banner (Custom Size)\n- Web-optimiert (PNG/JPG)\n- 2 Revisionen\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 4000, // 40€
    suggestedDeliveryDays: 2,
    tags: ["Banner", "Header", "Web Design"],
  },
  {
    id: "design-infographic-1",
    category: "Design & Kreation",
    title: "Infografik-Design (Daten-Visualisierung)",
    description: "Ich verwandle deine Daten in eine ansprechende Infografik.\n\n**Lieferumfang:**\n- 1 Infografik (Custom Size)\n- Datenvisualisierung\n- 2 Revisionen\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 7000, // 70€
    suggestedDeliveryDays: 3,
    tags: ["Infografik", "Daten", "Visualisierung"],
  },
  {
    id: "design-presentation-1",
    category: "Design & Kreation",
    title: "PowerPoint-Präsentation (10 Slides)",
    description: "Ich erstelle eine professionelle PowerPoint-Präsentation.\n\n**Inklusive:**\n- 10 Slides\n- Master-Layout\n- Animationen\n- Editierbare PPTX\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 9000, // 90€
    suggestedDeliveryDays: 3,
    tags: ["PowerPoint", "Präsentation", "Slides"],
  },
  {
    id: "design-icon-set-1",
    category: "Design & Kreation",
    title: "Icon-Set (20 Icons) - Custom Design",
    description: "Ich erstelle ein Custom Icon-Set für deine App/Website.\n\n**Lieferumfang:**\n- 20 Icons\n- SVG + PNG\n- Konsistenter Stil\n\n**Turnaround:** 4 Tage",
    suggestedPrice: 12000, // 120€
    suggestedDeliveryDays: 4,
    tags: ["Icons", "UI", "Design"],
  },
  {
    id: "design-ebook-cover-1",
    category: "Design & Kreation",
    title: "E-Book-Cover-Design (3D-Mockup)",
    description: "Ich erstelle ein professionelles E-Book-Cover.\n\n**Inklusive:**\n- Cover-Design\n- 3D-Mockup\n- 2 Revisionen\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 6000, // 60€
    suggestedDeliveryDays: 2,
    tags: ["E-Book", "Cover", "Mockup"],
  },
  {
    id: "design-branding-package-1",
    category: "Design & Kreation",
    title: "Branding-Paket (Logo + Visitenkarte + Social Media Kit)",
    description: "Komplettes Branding-Paket für dein Business.\n\n**Inklusive:**\n- Logo-Design\n- Visitenkarten\n- Social Media Templates\n- Brand-Guidelines\n\n**Turnaround:** 7 Tage",
    suggestedPrice: 25000, // 250€ (Maximum)
    suggestedDeliveryDays: 7,
    tags: ["Branding", "Logo", "Social Media", "Paket"],
  },

  // Development (10 templates)
  {
    id: "dev-landing-page-1",
    category: "Development",
    title: "Landing Page (HTML/CSS/JS) - Responsive",
    description: "Ich erstelle eine moderne, responsive Landing Page.\n\n**Tech-Stack:**\n- HTML5, CSS3, JavaScript\n- Responsive Design (Mobile-First)\n- SEO-optimiert\n- Contact-Form\n\n**Lieferumfang:**\n- Source Code (GitHub)\n- Deployment-Anleitung\n- 1 Woche Support\n\n**Turnaround:** 5 Tage",
    suggestedPrice: 18000, // 180€
    suggestedDeliveryDays: 5,
    tags: ["Landing Page", "HTML", "CSS", "Responsive"],
  },
  {
    id: "dev-wordpress-1",
    category: "Development",
    title: "WordPress-Website (5 Seiten) - Custom Theme",
    description: "Ich erstelle eine professionelle WordPress-Website.\n\n**Inklusive:**\n- 5 Seiten (Home, About, Services, Blog, Contact)\n- Custom Theme\n- Mobile-optimiert\n- SEO-Plugins\n\n**Turnaround:** 7 Tage",
    suggestedPrice: 22000, // 220€
    suggestedDeliveryDays: 7,
    tags: ["WordPress", "Website", "CMS"],
  },
  {
    id: "dev-bug-fix-1",
    category: "Development",
    title: "Bug-Fixing (1 Stunde) - HTML/CSS/JS",
    description: "Ich behebe Bugs in deinem Frontend-Code.\n\n**Umfang:**\n- 1 Stunde Debugging\n- HTML/CSS/JavaScript\n- Schnelle Kommunikation\n\n**Turnaround:** 1 Tag",
    suggestedPrice: 5000, // 50€
    suggestedDeliveryDays: 1,
    tags: ["Bug Fix", "Debugging", "Frontend"],
  },
  {
    id: "dev-api-integration-1",
    category: "Development",
    title: "API-Integration (REST/GraphQL)",
    description: "Ich integriere eine externe API in deine Website/App.\n\n**Beispiele:**\n- Payment (Stripe, PayPal)\n- Social Media (Instagram, Twitter)\n- Maps (Google Maps)\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 12000, // 120€
    suggestedDeliveryDays: 3,
    tags: ["API", "Integration", "Backend"],
  },
  {
    id: "dev-react-component-1",
    category: "Development",
    title: "React-Komponente (Custom) - Reusable",
    description: "Ich erstelle eine wiederverwendbare React-Komponente.\n\n**Tech-Stack:**\n- React 18+\n- TypeScript\n- Styled Components\n- Storybook-Docs\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 8000, // 80€
    suggestedDeliveryDays: 2,
    tags: ["React", "Component", "TypeScript"],
  },
  {
    id: "dev-database-setup-1",
    category: "Development",
    title: "Datenbank-Setup (MySQL/PostgreSQL)",
    description: "Ich richte eine Datenbank für dein Projekt ein.\n\n**Inklusive:**\n- Schema-Design\n- Migrations\n- Seeding (Test-Daten)\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 10000, // 100€
    suggestedDeliveryDays: 2,
    tags: ["Database", "MySQL", "PostgreSQL"],
  },
  {
    id: "dev-seo-optimization-1",
    category: "Development",
    title: "SEO-Optimierung (On-Page) - Technisch",
    description: "Ich optimiere deine Website für Suchmaschinen.\n\n**Umfang:**\n- Meta-Tags\n- Schema.org Markup\n- Sitemap\n- Performance-Optimierung\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 15000, // 150€
    suggestedDeliveryDays: 3,
    tags: ["SEO", "Optimierung", "Performance"],
  },
  {
    id: "dev-chrome-extension-1",
    category: "Development",
    title: "Chrome-Extension (Simple Feature)",
    description: "Ich erstelle eine Chrome-Extension für dich.\n\n**Beispiele:**\n- Bookmark-Manager\n- Tab-Organizer\n- Content-Blocker\n\n**Turnaround:** 5 Tage",
    suggestedPrice: 20000, // 200€
    suggestedDeliveryDays: 5,
    tags: ["Chrome Extension", "Browser", "JavaScript"],
  },
  {
    id: "dev-automation-script-1",
    category: "Development",
    title: "Automation-Script (Python/Node.js)",
    description: "Ich erstelle ein Automation-Script für repetitive Tasks.\n\n**Beispiele:**\n- Web Scraping\n- Data Processing\n- File Management\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 12000, // 120€
    suggestedDeliveryDays: 3,
    tags: ["Automation", "Python", "Node.js"],
  },
  {
    id: "dev-ci-cd-setup-1",
    category: "Development",
    title: "CI/CD-Pipeline-Setup (GitHub Actions)",
    description: "Ich richte eine CI/CD-Pipeline für dein Projekt ein.\n\n**Inklusive:**\n- Automated Testing\n- Deployment\n- GitHub Actions Workflow\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 10000, // 100€
    suggestedDeliveryDays: 2,
    tags: ["CI/CD", "GitHub Actions", "DevOps"],
  },

  // Marketing (10 templates)
  {
    id: "marketing-seo-audit-1",
    category: "Marketing",
    title: "SEO-Audit (Umfassend) - 20 Seiten Report",
    description: "Ich analysiere deine Website und erstelle einen detaillierten SEO-Audit-Report.\n\n**Inklusive:**\n- Keyword-Analyse\n- On-Page-SEO-Check\n- Backlink-Analyse\n- Konkurrenz-Analyse\n- Handlungsempfehlungen\n\n**Turnaround:** 5 Tage",
    suggestedPrice: 18000, // 180€
    suggestedDeliveryDays: 5,
    tags: ["SEO", "Audit", "Analyse"],
  },
  {
    id: "marketing-social-media-strategy-1",
    category: "Marketing",
    title: "Social Media Strategie (30 Tage Content-Plan)",
    description: "Ich erstelle eine Social Media Strategie für dein Business.\n\n**Lieferumfang:**\n- 30-Tage-Content-Plan\n- Posting-Schedule\n- Hashtag-Strategie\n- KPI-Tracking\n\n**Turnaround:** 4 Tage",
    suggestedPrice: 15000, // 150€
    suggestedDeliveryDays: 4,
    tags: ["Social Media", "Strategie", "Content Plan"],
  },
  {
    id: "marketing-email-campaign-1",
    category: "Marketing",
    title: "E-Mail-Marketing-Kampagne (5 E-Mails)",
    description: "Ich erstelle eine E-Mail-Marketing-Kampagne.\n\n**Inklusive:**\n- 5 E-Mails (Copywriting)\n- Subject-Lines\n- CTA-Optimierung\n- A/B-Testing-Empfehlungen\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 12000, // 120€
    suggestedDeliveryDays: 3,
    tags: ["E-Mail", "Marketing", "Copywriting"],
  },
  {
    id: "marketing-google-ads-1",
    category: "Marketing",
    title: "Google Ads Kampagne (Setup + 1 Woche Management)",
    description: "Ich richte eine Google Ads Kampagne ein und manage sie 1 Woche.\n\n**Inklusive:**\n- Keyword-Research\n- Ad-Copy\n- Landing-Page-Optimierung\n- Wöchentlicher Report\n\n**Turnaround:** 7 Tage",
    suggestedPrice: 25000, // 250€
    suggestedDeliveryDays: 7,
    tags: ["Google Ads", "PPC", "Marketing"],
  },
  {
    id: "marketing-instagram-growth-1",
    category: "Marketing",
    title: "Instagram-Growth-Strategie (Organisch)",
    description: "Ich erstelle eine Strategie für organisches Instagram-Wachstum.\n\n**Inklusive:**\n- Zielgruppen-Analyse\n- Content-Strategie\n- Engagement-Taktiken\n- Hashtag-Research\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 10000, // 100€
    suggestedDeliveryDays: 3,
    tags: ["Instagram", "Growth", "Social Media"],
  },
  {
    id: "marketing-competitor-analysis-1",
    category: "Marketing",
    title: "Konkurrenz-Analyse (3 Wettbewerber)",
    description: "Ich analysiere 3 deiner Hauptkonkurrenten.\n\n**Inklusive:**\n- SWOT-Analyse\n- Marketing-Strategie-Vergleich\n- Pricing-Analyse\n- Handlungsempfehlungen\n\n**Turnaround:** 4 Tage",
    suggestedPrice: 14000, // 140€
    suggestedDeliveryDays: 4,
    tags: ["Konkurrenz", "Analyse", "Strategie"],
  },
  {
    id: "marketing-content-calendar-1",
    category: "Marketing",
    title: "Content-Kalender (3 Monate) - Blog + Social Media",
    description: "Ich erstelle einen 3-Monats-Content-Kalender.\n\n**Inklusive:**\n- Blog-Themen\n- Social Media Posts\n- Posting-Schedule\n- SEO-Keywords\n\n**Turnaround:** 5 Tage",
    suggestedPrice: 16000, // 160€
    suggestedDeliveryDays: 5,
    tags: ["Content", "Kalender", "Planung"],
  },
  {
    id: "marketing-landing-page-copy-1",
    category: "Marketing",
    title: "Landing-Page-Copywriting (Conversion-optimiert)",
    description: "Ich schreibe Conversion-optimierten Copy für deine Landing Page.\n\n**Inklusive:**\n- Headline\n- Subheadline\n- Benefits\n- CTAs\n- Social Proof\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 8000, // 80€
    suggestedDeliveryDays: 2,
    tags: ["Copywriting", "Landing Page", "Conversion"],
  },
  {
    id: "marketing-facebook-ads-1",
    category: "Marketing",
    title: "Facebook Ads Kampagne (Setup + 1 Woche Management)",
    description: "Ich richte eine Facebook Ads Kampagne ein.\n\n**Inklusive:**\n- Zielgruppen-Targeting\n- Ad-Creative\n- A/B-Testing\n- Wöchentlicher Report\n\n**Turnaround:** 7 Tage",
    suggestedPrice: 22000, // 220€
    suggestedDeliveryDays: 7,
    tags: ["Facebook Ads", "Social Media", "Marketing"],
  },
  {
    id: "marketing-press-release-1",
    category: "Marketing",
    title: "Pressemitteilung (500 Wörter)",
    description: "Ich schreibe eine professionelle Pressemitteilung.\n\n**Inklusive:**\n- 500 Wörter\n- SEO-optimiert\n- Distribution-Empfehlungen\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 7000, // 70€
    suggestedDeliveryDays: 2,
    tags: ["Pressemitteilung", "PR", "Content"],
  },

  // Content & Text (10 templates)
  {
    id: "content-blog-post-1",
    category: "Content & Text",
    title: "Blog-Artikel (1000 Wörter) - SEO-optimiert",
    description: "Ich schreibe einen SEO-optimierten Blog-Artikel.\n\n**Inklusive:**\n- 1000 Wörter\n- Keyword-Research\n- Meta-Description\n- 2 Revisionen\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 8000, // 80€
    suggestedDeliveryDays: 3,
    tags: ["Blog", "SEO", "Content"],
  },
  {
    id: "content-product-description-1",
    category: "Content & Text",
    title: "Produkt-Beschreibungen (10 Produkte)",
    description: "Ich schreibe 10 Conversion-optimierte Produkt-Beschreibungen.\n\n**Inklusive:**\n- 10 Beschreibungen (je 100 Wörter)\n- SEO-Keywords\n- Bullet-Points\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 6000, // 60€
    suggestedDeliveryDays: 2,
    tags: ["Produkt", "E-Commerce", "Copywriting"],
  },
  {
    id: "content-website-copy-1",
    category: "Content & Text",
    title: "Website-Texte (5 Seiten) - About, Services, etc.",
    description: "Ich schreibe professionelle Website-Texte.\n\n**Inklusive:**\n- 5 Seiten (je 300 Wörter)\n- SEO-optimiert\n- Brand-Voice\n\n**Turnaround:** 4 Tage",
    suggestedPrice: 15000, // 150€
    suggestedDeliveryDays: 4,
    tags: ["Website", "Copywriting", "Content"],
  },
  {
    id: "content-newsletter-1",
    category: "Content & Text",
    title: "Newsletter (4 Ausgaben) - Monatlich",
    description: "Ich schreibe 4 Newsletter für dein E-Mail-Marketing.\n\n**Inklusive:**\n- 4 Newsletter (je 500 Wörter)\n- Subject-Lines\n- CTAs\n\n**Turnaround:** 5 Tage",
    suggestedPrice: 12000, // 120€
    suggestedDeliveryDays: 5,
    tags: ["Newsletter", "E-Mail", "Content"],
  },
  {
    id: "content-social-media-captions-1",
    category: "Content & Text",
    title: "Social Media Captions (30 Posts)",
    description: "Ich schreibe 30 Social Media Captions.\n\n**Inklusive:**\n- 30 Captions\n- Hashtags\n- Emojis\n\n**Turnaround:** 3 Tage",
    suggestedPrice: 7000, // 70€
    suggestedDeliveryDays: 3,
    tags: ["Social Media", "Captions", "Content"],
  },
  {
    id: "content-case-study-1",
    category: "Content & Text",
    title: "Case Study (1500 Wörter) - Success Story",
    description: "Ich schreibe eine überzeugende Case Study.\n\n**Inklusive:**\n- 1500 Wörter\n- Struktur: Problem, Solution, Results\n- Visuals-Empfehlungen\n\n**Turnaround:** 4 Tage",
    suggestedPrice: 14000, // 140€
    suggestedDeliveryDays: 4,
    tags: ["Case Study", "Content", "Marketing"],
  },
  {
    id: "content-whitepaper-1",
    category: "Content & Text",
    title: "Whitepaper (3000 Wörter) - Lead-Magnet",
    description: "Ich schreibe ein professionelles Whitepaper.\n\n**Inklusive:**\n- 3000 Wörter\n- Research\n- Formatierung\n\n**Turnaround:** 7 Tage",
    suggestedPrice: 25000, // 250€
    suggestedDeliveryDays: 7,
    tags: ["Whitepaper", "Lead Magnet", "Content"],
  },
  {
    id: "content-video-script-1",
    category: "Content & Text",
    title: "Video-Script (3 Minuten) - YouTube/TikTok",
    description: "Ich schreibe ein Video-Script.\n\n**Inklusive:**\n- 3-Minuten-Script\n- Hook, Body, CTA\n- Timestamps\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 6000, // 60€
    suggestedDeliveryDays: 2,
    tags: ["Video", "Script", "YouTube"],
  },
  {
    id: "content-ebook-1",
    category: "Content & Text",
    title: "E-Book (5000 Wörter) - Lead-Magnet",
    description: "Ich schreibe ein E-Book für dein Business.\n\n**Inklusive:**\n- 5000 Wörter\n- Kapitel-Struktur\n- Formatierung\n\n**Turnaround:** 10 Tage",
    suggestedPrice: 25000, // 250€
    suggestedDeliveryDays: 10,
    tags: ["E-Book", "Lead Magnet", "Content"],
  },
  {
    id: "content-faq-1",
    category: "Content & Text",
    title: "FAQ-Seite (20 Fragen + Antworten)",
    description: "Ich erstelle eine FAQ-Seite für deine Website.\n\n**Inklusive:**\n- 20 Fragen + Antworten\n- SEO-optimiert\n- Strukturierte Daten\n\n**Turnaround:** 2 Tage",
    suggestedPrice: 5000, // 50€
    suggestedDeliveryDays: 2,
    tags: ["FAQ", "Content", "SEO"],
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): GigTemplate[] {
  return GIG_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): GigTemplate | undefined {
  return GIG_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(GIG_TEMPLATES.map((t) => t.category)));
}
