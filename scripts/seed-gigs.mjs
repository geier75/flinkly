import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Seed data: 100 realistic gigs across 6 categories
const categories = ["design", "development", "marketing", "content", "business", "technology"];

const gigTemplates = {
  design: [
    { title: "Professionelles Logo-Design für dein Startup", description: "Ich erstelle ein einzigartiges, modernes Logo-Design, das deine Marke perfekt repräsentiert. Inklusive 3 Konzepte, unbegrenzte Revisionen und alle Dateiformate (AI, PNG, SVG, PDF).", price: 149, deliveryDays: 3, tags: ["logo", "branding", "corporate-design"] },
    { title: "Social Media Design-Paket (Instagram, Facebook, LinkedIn)", description: "10 professionelle Social-Media-Posts im einheitlichen Design. Perfekt für deine Brand-Consistency. Inklusive Canva-Templates zum selbst bearbeiten.", price: 89, deliveryDays: 2, tags: ["social-media", "instagram", "facebook"] },
    { title: "Moderne Website-Mockups (Figma/Adobe XD)", description: "Ich designe deine komplette Website in Figma oder Adobe XD. Responsive Design für Desktop, Tablet und Mobile. Inklusive Styleguide und Developer-Handoff.", price: 299, deliveryDays: 5, tags: ["web-design", "figma", "ui-ux"] },
    { title: "Flyer & Poster Design für Events", description: "Auffälliges Flyer-Design für dein Event, Produkt oder Dienstleistung. Print-ready (CMYK, 300dpi) und Web-Version inklusive.", price: 69, deliveryDays: 2, tags: ["print-design", "flyer", "poster"] },
    { title: "Visitenkarten-Design (beidseitig)", description: "Professionelles Visitenkarten-Design mit deinem Branding. Print-ready Dateien und QR-Code-Integration optional.", price: 49, deliveryDays: 1, tags: ["visitenkarten", "print", "branding"] },
    { title: "Infografik-Design für komplexe Daten", description: "Ich verwandle deine Daten in eine verständliche, visuell ansprechende Infografik. Perfekt für Präsentationen, Social Media oder Websites.", price: 129, deliveryDays: 3, tags: ["infografik", "data-visualization", "design"] },
    { title: "Buchcover-Design für Self-Publisher", description: "Professionelles Buchcover-Design für Amazon KDP, Tolino und Co. Inklusive 3D-Mockup und Rückentext-Layout.", price: 179, deliveryDays: 4, tags: ["buchcover", "self-publishing", "amazon-kdp"] },
    { title: "App-Icon-Design (iOS & Android)", description: "Modernes App-Icon-Design in allen benötigten Größen für iOS und Android. Inklusive adaptive Icons für Android.", price: 99, deliveryDays: 2, tags: ["app-icon", "ios", "android"] },
    { title: "Präsentations-Design (PowerPoint/Keynote)", description: "Ich gestalte deine Präsentation professionell und modern. Inklusive Master-Slides und Animationen.", price: 149, deliveryDays: 3, tags: ["powerpoint", "präsentation", "keynote"] },
    { title: "Packaging-Design für Produkte", description: "Kreatives Verpackungsdesign für dein Produkt. Print-ready mit Stanzvorlage und 3D-Mockup.", price: 249, deliveryDays: 5, tags: ["packaging", "product-design", "print"] }
  ],
  development: [
    { title: "Responsive WordPress-Website mit Elementor", description: "Ich erstelle deine professionelle WordPress-Website mit Elementor. Responsive Design, SEO-optimiert, DSGVO-konform. Inklusive 3 Seiten und Kontaktformular.", price: 399, deliveryDays: 7, tags: ["wordpress", "elementor", "website"] },
    { title: "Landing Page mit HTML/CSS/JavaScript", description: "Moderne Landing Page mit Conversion-Optimierung. Responsive, schnell ladend und SEO-optimiert. Inklusive Kontaktformular und Google Analytics.", price: 299, deliveryDays: 5, tags: ["html", "css", "javascript", "landing-page"] },
    { title: "React-Komponenten für dein Projekt", description: "Ich entwickle wiederverwendbare React-Komponenten nach deinen Vorgaben. TypeScript optional. Inklusive Storybook-Dokumentation.", price: 199, deliveryDays: 4, tags: ["react", "typescript", "components"] },
    { title: "REST API mit Node.js & Express", description: "Ich entwickle eine skalierbare REST API mit Node.js, Express und MongoDB/PostgreSQL. Inklusive Authentifizierung, Dokumentation und Tests.", price: 499, deliveryDays: 10, tags: ["nodejs", "api", "backend"] },
    { title: "WordPress-Plugin-Entwicklung", description: "Custom WordPress-Plugin nach deinen Anforderungen. Sauberer Code, WordPress-Coding-Standards, Update-sicher.", price: 349, deliveryDays: 7, tags: ["wordpress", "plugin", "php"] },
    { title: "Shopify-Theme-Anpassungen", description: "Ich passe dein Shopify-Theme individuell an. Custom-Sections, Liquid-Code, Responsive-Optimierung.", price: 249, deliveryDays: 5, tags: ["shopify", "ecommerce", "liquid"] },
    { title: "Python-Automatisierungs-Script", description: "Ich entwickle ein Python-Script zur Automatisierung deiner Aufgaben. Web-Scraping, Datenverarbeitung, API-Integration.", price: 179, deliveryDays: 3, tags: ["python", "automation", "scripting"] },
    { title: "Chrome-Extension-Entwicklung", description: "Custom Chrome-Extension nach deinen Anforderungen. Manifest V3, moderne APIs, Cross-Browser-kompatibel.", price: 299, deliveryDays: 6, tags: ["chrome-extension", "javascript", "browser"] },
    { title: "Bug-Fixing für deine Website/App", description: "Ich behebe Bugs in deiner Website oder App. JavaScript, React, Vue, PHP, WordPress. Schnelle Analyse und Lösung.", price: 89, deliveryDays: 2, tags: ["bug-fixing", "debugging", "support"] },
    { title: "Datenbank-Design & Optimierung", description: "Ich designe deine Datenbank-Struktur oder optimiere bestehende Queries. MySQL, PostgreSQL, MongoDB.", price: 199, deliveryDays: 4, tags: ["database", "sql", "optimization"] }
  ],
  marketing: [
    { title: "SEO-Optimierung für deine Website (On-Page)", description: "Ich optimiere deine Website für Suchmaschinen. Keyword-Recherche, Meta-Tags, Content-Optimierung, technisches SEO. Inklusive Audit-Report.", price: 249, deliveryDays: 5, tags: ["seo", "google", "ranking"] },
    { title: "Google Ads Kampagnen-Setup & Optimierung", description: "Ich erstelle und optimiere deine Google Ads Kampagnen. Keyword-Recherche, Anzeigentexte, Bid-Management. Inklusive 30 Tage Support.", price: 299, deliveryDays: 4, tags: ["google-ads", "ppc", "sea"] },
    { title: "Social Media Marketing-Strategie", description: "Ich entwickle eine maßgeschneiderte Social-Media-Strategie für dein Business. Content-Plan, Posting-Schedule, Hashtag-Strategie.", price: 199, deliveryDays: 5, tags: ["social-media", "strategie", "marketing"] },
    { title: "E-Mail-Marketing-Kampagne (Newsletter)", description: "Ich erstelle eine professionelle E-Mail-Marketing-Kampagne. Design, Copywriting, A/B-Testing-Setup. Mailchimp/Klaviyo-kompatibel.", price: 149, deliveryDays: 3, tags: ["email-marketing", "newsletter", "mailchimp"] },
    { title: "Facebook & Instagram Ads Management", description: "Ich manage deine Facebook & Instagram Ads. Zielgruppen-Targeting, Creative-Testing, Performance-Tracking. Inklusive wöchentliche Reports.", price: 349, deliveryDays: 7, tags: ["facebook-ads", "instagram-ads", "social-ads"] },
    { title: "Content-Marketing-Plan (3 Monate)", description: "Ich erstelle einen detaillierten Content-Marketing-Plan für 3 Monate. Blog-Themen, Social-Media-Content, SEO-Keywords.", price: 399, deliveryDays: 7, tags: ["content-marketing", "strategie", "planung"] },
    { title: "Influencer-Marketing-Kampagne", description: "Ich plane und koordiniere deine Influencer-Marketing-Kampagne. Influencer-Recherche, Outreach, Vertragsverhandlung.", price: 449, deliveryDays: 10, tags: ["influencer", "marketing", "kampagne"] },
    { title: "Conversion-Rate-Optimierung (CRO)", description: "Ich analysiere deine Website und optimiere die Conversion-Rate. A/B-Tests, Heatmaps, User-Journey-Analyse.", price: 299, deliveryDays: 6, tags: ["cro", "conversion", "optimization"] },
    { title: "LinkedIn-Marketing für B2B", description: "Ich entwickle eine LinkedIn-Marketing-Strategie für dein B2B-Business. Content-Plan, Lead-Generation, Networking-Strategie.", price: 249, deliveryDays: 5, tags: ["linkedin", "b2b", "lead-generation"] },
    { title: "Affiliate-Marketing-Setup", description: "Ich richte dein Affiliate-Marketing-Programm ein. Partner-Akquise, Tracking-Setup, Provisionsmodell.", price: 349, deliveryDays: 7, tags: ["affiliate", "marketing", "partner"] }
  ],
  content: [
    { title: "SEO-optimierte Blog-Artikel (1000 Wörter)", description: "Ich schreibe einen SEO-optimierten Blog-Artikel zu deinem Thema. Keyword-Recherche, strukturierter Aufbau, Call-to-Actions. Perfekt für Google-Rankings.", price: 79, deliveryDays: 3, tags: ["blog", "seo", "content-writing"] },
    { title: "Website-Texte (About, Services, Home)", description: "Ich schreibe professionelle Website-Texte für deine Seiten. Conversion-optimiert, SEO-freundlich, auf deine Zielgruppe zugeschnitten.", price: 149, deliveryDays: 4, tags: ["website", "copywriting", "texte"] },
    { title: "Produktbeschreibungen für Online-Shops", description: "Ich erstelle verkaufsstarke Produktbeschreibungen für deinen Online-Shop. SEO-optimiert, emotional ansprechend. Bis zu 20 Produkte.", price: 99, deliveryDays: 3, tags: ["produktbeschreibungen", "ecommerce", "shop"] },
    { title: "Social Media Content-Paket (30 Posts)", description: "30 fertige Social-Media-Posts mit Texten und Hashtags. Perfekt für Instagram, Facebook, LinkedIn. Inklusive Content-Kalender.", price: 129, deliveryDays: 5, tags: ["social-media", "content", "posts"] },
    { title: "E-Book-Ghostwriting (10.000 Wörter)", description: "Ich schreibe ein komplettes E-Book zu deinem Thema. Recherche, Struktur, Schreibstil nach deinen Vorgaben. Inklusive Lektorat.", price: 499, deliveryDays: 14, tags: ["ebook", "ghostwriting", "autor"] },
    { title: "Pressemitteilung schreiben & verteilen", description: "Ich schreibe eine professionelle Pressemitteilung und verteile sie an relevante Medien. Inklusive Follow-Up.", price: 199, deliveryDays: 4, tags: ["pressemitteilung", "pr", "medien"] },
    { title: "Video-Script für YouTube/TikTok", description: "Ich schreibe ein fesselndes Video-Script für deine YouTube- oder TikTok-Videos. Hook, Struktur, Call-to-Action.", price: 89, deliveryDays: 2, tags: ["video-script", "youtube", "tiktok"] },
    { title: "Podcast-Show-Notes & Transkription", description: "Ich erstelle professionelle Show-Notes für deine Podcast-Episode. Inklusive Transkription, Timestamps, Key-Takeaways.", price: 69, deliveryDays: 2, tags: ["podcast", "transkription", "show-notes"] },
    { title: "Übersetzung Deutsch ↔ Englisch", description: "Ich übersetze deine Texte professionell von Deutsch nach Englisch oder umgekehrt. Muttersprachler-Niveau, fachspezifisch.", price: 59, deliveryDays: 2, tags: ["übersetzung", "deutsch", "englisch"] },
    { title: "LinkedIn-Profil-Optimierung", description: "Ich optimiere dein LinkedIn-Profil für mehr Sichtbarkeit und Anfragen. Headline, About, Experience, SEO-Keywords.", price: 99, deliveryDays: 2, tags: ["linkedin", "profil", "personal-branding"] }
  ],
  business: [
    { title: "Business-Plan-Erstellung (20 Seiten)", description: "Ich erstelle einen professionellen Business-Plan für dein Startup. Marktanalyse, Finanzplanung, Strategie. Bank- und Investor-ready.", price: 449, deliveryDays: 10, tags: ["business-plan", "startup", "gründung"] },
    { title: "Marktforschung & Wettbewerbsanalyse", description: "Ich führe eine detaillierte Marktforschung durch. Zielgruppen-Analyse, Wettbewerber-Vergleich, Marktpotenzial. Inklusive Report.", price: 299, deliveryDays: 7, tags: ["marktforschung", "analyse", "wettbewerb"] },
    { title: "Pitch-Deck für Investoren (10 Slides)", description: "Ich erstelle ein überzeugendes Pitch-Deck für deine Investor-Präsentation. Storytelling, Design, Finanzprognosen.", price: 349, deliveryDays: 6, tags: ["pitch-deck", "investoren", "startup"] },
    { title: "Buchhaltung & Steuerberatung (monatlich)", description: "Ich übernehme deine monatliche Buchhaltung. Rechnungen, Belege, Umsatzsteuer-Voranmeldung. DATEV-kompatibel.", price: 199, deliveryDays: 5, tags: ["buchhaltung", "steuer", "finanzen"] },
    { title: "Virtuelle Assistenz (10 Stunden/Monat)", description: "Ich unterstütze dich als virtuelle Assistenz. E-Mail-Management, Terminplanung, Recherche, Admin-Aufgaben.", price: 149, deliveryDays: 30, tags: ["virtuelle-assistenz", "admin", "support"] },
    { title: "Rechtsberatung für Startups (1 Stunde)", description: "Ich berate dich rechtlich zu Gründung, Verträgen, AGB, Datenschutz. Fachanwalt für IT-Recht.", price: 199, deliveryDays: 2, tags: ["rechtsberatung", "anwalt", "startup"] },
    { title: "HR-Recruiting & Bewerbermanagement", description: "Ich unterstütze dich beim Recruiting. Stellenanzeigen, Bewerbermanagement, Interviews. Bis zu 5 Positionen.", price: 399, deliveryDays: 14, tags: ["recruiting", "hr", "personal"] },
    { title: "Projektmanagement (Agile/Scrum)", description: "Ich manage dein Projekt nach Agile/Scrum-Methodik. Sprint-Planning, Daily-Standups, Retrospektiven. Jira/Trello-Setup.", price: 499, deliveryDays: 30, tags: ["projektmanagement", "agile", "scrum"] },
    { title: "Business-Coaching (3 Sessions à 60 Min)", description: "Ich coache dich in 3 Sessions zu deinen Business-Herausforderungen. Strategie, Mindset, Umsetzung.", price: 349, deliveryDays: 14, tags: ["coaching", "business", "strategie"] },
    { title: "Vertrags-Prüfung & -Erstellung", description: "Ich prüfe oder erstelle Verträge für dein Business. AGB, Dienstleistungsverträge, NDAs. Rechtssicher.", price: 249, deliveryDays: 4, tags: ["verträge", "recht", "agb"] }
  ],
  technology: [
    { title: "IT-Security-Audit für deine Website", description: "Ich führe ein umfassendes Security-Audit durch. Vulnerability-Scan, Penetration-Testing, DSGVO-Check. Inklusive Report.", price: 399, deliveryDays: 7, tags: ["security", "audit", "penetration-testing"] },
    { title: "Cloud-Migration (AWS/Azure/GCP)", description: "Ich migriere deine Infrastruktur in die Cloud. AWS, Azure oder Google Cloud. Inklusive Setup, Monitoring, Backup.", price: 799, deliveryDays: 14, tags: ["cloud", "aws", "migration"] },
    { title: "DevOps-Setup (CI/CD-Pipeline)", description: "Ich richte eine CI/CD-Pipeline für dein Projekt ein. GitHub Actions, GitLab CI, Jenkins. Automatisiertes Testing & Deployment.", price: 499, deliveryDays: 7, tags: ["devops", "cicd", "automation"] },
    { title: "Blockchain-Smart-Contract-Entwicklung", description: "Ich entwickle Smart Contracts für Ethereum, Binance Smart Chain oder Polygon. Solidity, Security-Audit inklusive.", price: 899, deliveryDays: 14, tags: ["blockchain", "smart-contract", "ethereum"] },
    { title: "KI/ML-Modell-Training & Integration", description: "Ich trainiere ein KI-Modell für deine Anwendung. TensorFlow, PyTorch, scikit-learn. Inklusive API-Integration.", price: 699, deliveryDays: 10, tags: ["ki", "machine-learning", "ai"] },
    { title: "IoT-Lösung mit Raspberry Pi/Arduino", description: "Ich entwickle eine IoT-Lösung für dein Projekt. Sensoren, Datenübertragung, Dashboard. Raspberry Pi oder Arduino.", price: 449, deliveryDays: 10, tags: ["iot", "raspberry-pi", "arduino"] },
    { title: "Datenanalyse mit Python/R", description: "Ich analysiere deine Daten mit Python oder R. Statistik, Visualisierung, Predictive Analytics. Inklusive Report.", price: 349, deliveryDays: 7, tags: ["datenanalyse", "python", "statistik"] },
    { title: "VPN-Setup für Unternehmen", description: "Ich richte ein sicheres VPN für dein Unternehmen ein. WireGuard, OpenVPN, Multi-Faktor-Authentifizierung.", price: 299, deliveryDays: 5, tags: ["vpn", "security", "netzwerk"] },
    { title: "Server-Administration & Wartung", description: "Ich administriere deinen Server. Linux, Updates, Monitoring, Backup, Security-Hardening. Monatlicher Service.", price: 249, deliveryDays: 30, tags: ["server", "linux", "administration"] },
    { title: "Chatbot-Entwicklung mit AI", description: "Ich entwickle einen intelligenten Chatbot für deine Website. GPT-Integration, Custom-Training, Multi-Language.", price: 599, deliveryDays: 10, tags: ["chatbot", "ai", "gpt"] }
  ]
};

console.log("🌱 Starting seed process...\n");

// Create 10 test sellers first
const sellers = [];
for (let i = 1; i <= 10; i++) {
  const sellerNames = [
    "Anna Schmidt", "Michael Weber", "Sarah Müller", "Thomas Fischer", 
    "Laura Becker", "Daniel Hoffmann", "Julia Schulz", "Markus Wagner",
    "Lisa Zimmermann", "Stefan Richter"
  ];
  
  try {
    const [result] = await connection.execute(
      `INSERT INTO users (openId, name, email, role, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, 'user', NOW(), NOW(), NOW())`,
      [`seller_${i}_${Date.now()}`, sellerNames[i-1], `seller${i}@flinkly.de`]
    );
    sellers.push(result.insertId);
    console.log(`✅ Created seller: ${sellerNames[i-1]} (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`❌ Error creating seller ${i}:`, error.message);
  }
}

console.log(`\n✅ Created ${sellers.length} sellers\n`);

// Create 100 gigs (10 per category, distributed across sellers)
let gigsCreated = 0;

for (const [category, templates] of Object.entries(gigTemplates)) {
  console.log(`\n📦 Creating gigs for category: ${category}`);
  
  for (const template of templates) {
    const sellerId = sellers[Math.floor(Math.random() * sellers.length)];
    
    try {
      const [result] = await connection.execute(
        `INSERT INTO gigs (
          sellerId, title, description, category, price, deliveryDays, 
          imageUrl, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NOW(), NOW())`,
        [
          sellerId,
          template.title,
          template.description,
          category,
          template.price,
          template.deliveryDays,
          `/images/gig-${category}-${Math.floor(Math.random() * 5) + 1}.jpg`
        ]
      );
      
      const gigId = result.insertId;
      gigsCreated++;
      console.log(`  ✅ ${gigsCreated}/100 - ${template.title.substring(0, 50)}...`);

      // Create 3 packages for this gig (Basic, Standard, Premium)
      const packages = [
        {
          name: 'Basic',
          type: 'basic',
          description: 'Grundlegende Leistung mit allen essentiellen Features',
          price: template.price,
          deliveryDays: template.deliveryDays,
          revisions: 1,
          features: JSON.stringify(['Grundlegende Umsetzung', '1 Revision', 'Standard-Support'])
        },
        {
          name: 'Standard',
          type: 'standard',
          description: 'Erweiterte Leistung mit zusätzlichen Features',
          price: Math.round(template.price * 1.5),
          deliveryDays: Math.max(1, Math.round(template.deliveryDays * 0.8)),
          revisions: 3,
          features: JSON.stringify(['Erweiterte Umsetzung', '3 Revisionen', 'Priority-Support', 'Schnellere Lieferung'])
        },
        {
          name: 'Premium',
          type: 'premium',
          description: 'Premium-Leistung mit allen Features und höchster Priorität',
          price: Math.round(template.price * 2.5),
          deliveryDays: Math.max(1, Math.round(template.deliveryDays * 0.6)),
          revisions: 999,
          features: JSON.stringify(['Premium-Umsetzung', 'Unbegrenzte Revisionen', '24/7 Support', 'Express-Lieferung', 'Dedizierter Manager'])
        }
      ];

      for (const pkg of packages) {
        try {
          await connection.execute(
            `INSERT INTO gigPackages (
              gigId, name, packageType, description, price, deliveryDays, revisions, features, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              gigId,
              pkg.name,
              pkg.type,
              pkg.description,
              pkg.price,
              pkg.deliveryDays,
              pkg.revisions,
              pkg.features
            ]
          );
        } catch (pkgError) {
          console.error(`  ❌ Error creating package for gig ${gigId}:`, pkgError.message);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error creating gig:`, error.message);
    }
  }
}

console.log(`\n🎉 Seed completed! Created ${gigsCreated} gigs across ${Object.keys(gigTemplates).length} categories.`);

// Close connection
await connection.end();
