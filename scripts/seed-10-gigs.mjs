import mysql from "mysql2/promise";

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("🗑️  Clearing existing data...");

// Clear existing data
await connection.query("DELETE FROM gigPackages");
await connection.query("DELETE FROM gigs");

console.log("✅ Existing data cleared");

// Seed data: 10 gigs (2 per category, except 2 categories get 1 each)
const gigs = [
  // Design (2)
  {
    title: "Professionelles Logo-Design für dein Startup",
    description: "Ich erstelle ein einzigartiges, modernes Logo-Design, das deine Marke perfekt repräsentiert. Inklusive 3 Konzepte, unbegrenzte Revisionen und alle Dateiformate (AI, PNG, SVG, PDF).",
    category: "design",
    price: 149,
    deliveryDays: 3,
    sellerId: 1,
    imageUrl: "/images/gigs/logo-design.jpg",
    tags: JSON.stringify(["logo", "branding", "corporate-design"]),
    status: "published"
  },
  {
    title: "Social Media Design-Paket (Instagram, Facebook, LinkedIn)",
    description: "10 professionelle Social-Media-Posts im einheitlichen Design. Perfekt für deine Brand-Consistency. Inklusive Canva-Templates zum selbst bearbeiten.",
    category: "design",
    price: 89,
    deliveryDays: 2,
    sellerId: 1,
    imageUrl: "/images/gigs/social-media-design.jpg",
    tags: JSON.stringify(["social-media", "instagram", "facebook"]),
    status: "published"
  },
  
  // Development (2)
  {
    title: "Responsive WordPress-Website mit Elementor",
    description: "Ich erstelle deine professionelle WordPress-Website mit Elementor. Responsive Design, SEO-optimiert, DSGVO-konform. Inklusive 3 Seiten und Kontaktformular.",
    category: "development",
    price: 399,
    deliveryDays: 7,
    sellerId: 1,
    imageUrl: "/images/gigs/wordpress-website.jpg",
    tags: JSON.stringify(["wordpress", "elementor", "website"]),
    status: "published"
  },
  {
    title: "Landing Page mit HTML/CSS/JavaScript",
    description: "Moderne Landing Page mit Conversion-Optimierung. Responsive, schnell ladend und SEO-optimiert. Inklusive Kontaktformular und Google Analytics.",
    category: "development",
    price: 299,
    deliveryDays: 5,
    sellerId: 1,
    imageUrl: "/images/gigs/landing-page.jpg",
    tags: JSON.stringify(["html", "css", "javascript", "landing-page"]),
    status: "published"
  },
  
  // Marketing (2)
  {
    title: "SEO-Optimierung für deine Website (On-Page)",
    description: "Ich optimiere deine Website für Suchmaschinen. Keyword-Recherche, Meta-Tags, Content-Optimierung, technisches SEO. Inklusive Audit-Report.",
    category: "marketing",
    price: 249,
    deliveryDays: 5,
    sellerId: 1,
    imageUrl: "/images/gigs/seo-optimization.jpg",
    tags: JSON.stringify(["seo", "google", "ranking"]),
    status: "published"
  },
  {
    title: "Google Ads Kampagnen-Setup & Optimierung",
    description: "Ich erstelle und optimiere deine Google Ads Kampagnen. Keyword-Recherche, Anzeigentexte, Bid-Management. Inklusive 30 Tage Support.",
    category: "marketing",
    price: 299,
    deliveryDays: 4,
    sellerId: 1,
    imageUrl: "/images/gigs/google-ads.jpg",
    tags: JSON.stringify(["google-ads", "ppc", "sea"]),
    status: "published"
  },
  
  // Content (2)
  {
    title: "SEO-optimierte Blog-Artikel (1000 Wörter)",
    description: "Ich schreibe einen SEO-optimierten Blog-Artikel zu deinem Thema. Keyword-Recherche, strukturierter Aufbau, Call-to-Actions. Perfekt für Google-Rankings.",
    category: "content",
    price: 79,
    deliveryDays: 3,
    sellerId: 1,
    imageUrl: "/images/gigs/blog-article.jpg",
    tags: JSON.stringify(["blog", "seo", "content-writing"]),
    status: "published"
  },
  {
    title: "Website-Texte (About, Services, Home)",
    description: "Ich schreibe professionelle Website-Texte für deine Seiten. Conversion-optimiert, SEO-freundlich, auf deine Zielgruppe zugeschnitten.",
    category: "content",
    price: 149,
    deliveryDays: 4,
    sellerId: 1,
    imageUrl: "/images/gigs/website-texte.jpg",
    tags: JSON.stringify(["website", "copywriting", "texte"]),
    status: "published"
  },
  
  // Business (1)
  {
    title: "Business-Plan-Erstellung (20 Seiten)",
    description: "Ich erstelle einen professionellen Business-Plan für dein Startup. Marktanalyse, Finanzplanung, Strategie. Bank- und Investor-ready.",
    category: "business",
    price: 449,
    deliveryDays: 10,
    sellerId: 1,
    imageUrl: "/images/gigs/business-plan.jpg",
    tags: JSON.stringify(["business-plan", "startup", "gründung"]),
    status: "published"
  },
  
  // Technology (1)
  {
    title: "IT-Security-Audit für deine Website",
    description: "Ich führe ein umfassendes Security-Audit durch. Vulnerability-Scan, Penetration-Testing, DSGVO-Check. Inklusive Report.",
    category: "technology",
    price: 399,
    deliveryDays: 7,
    sellerId: 1,
    imageUrl: "/images/gigs/security-audit.jpg",
    tags: JSON.stringify(["security", "audit", "penetration-testing"]),
    status: "published"
  }
];

console.log(`📦 Creating ${gigs.length} gigs...`);

// Insert gigs and get IDs
const gigIds = [];
for (const gig of gigs) {
  const [result] = await connection.query(
    `INSERT INTO gigs (title, description, category, price, deliveryDays, sellerId, imageUrl, tags, status, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [gig.title, gig.description, gig.category, gig.price, gig.deliveryDays, gig.sellerId, gig.imageUrl, gig.tags, gig.status]
  );
  gigIds.push(result.insertId);
  console.log(`✅ Created gig: ${gig.title} (ID: ${result.insertId})`);
}

console.log(`\n📦 Creating packages for ${gigIds.length} gigs...`);

// Create 3 packages (Basic, Standard, Premium) for each gig
let packageCount = 0;
for (const gigId of gigIds) {
  // Basic Package
  await connection.query(
    `INSERT INTO gigPackages (gigId, name, description, price, deliveryDays, revisions, features, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      gigId,
      "Basic",
      "Grundlegendes Paket mit allen essentiellen Features",
      Math.round(gigs[gigIds.indexOf(gigId)].price * 0.7), // 70% of base price
      gigs[gigIds.indexOf(gigId)].deliveryDays,
      1,
      JSON.stringify(["1 Konzept", "1 Revision", "Grundlegende Features"])
    ]
  );
  packageCount++;

  // Standard Package (Base price)
  await connection.query(
    `INSERT INTO gigPackages (gigId, name, description, price, deliveryDays, revisions, features, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      gigId,
      "Standard",
      "Empfohlenes Paket mit erweiterten Features",
      gigs[gigIds.indexOf(gigId)].price, // Base price
      Math.max(gigs[gigIds.indexOf(gigId)].deliveryDays - 1, 1),
      3,
      JSON.stringify(["2 Konzepte", "3 Revisionen", "Erweiterte Features", "Schnellere Lieferung"])
    ]
  );
  packageCount++;

  // Premium Package
  await connection.query(
    `INSERT INTO gigPackages (gigId, name, description, price, deliveryDays, revisions, features, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      gigId,
      "Premium",
      "Premium-Paket mit allen Features und Priority-Support",
      Math.round(gigs[gigIds.indexOf(gigId)].price * 1.5), // 150% of base price
      Math.max(gigs[gigIds.indexOf(gigId)].deliveryDays - 2, 1),
      999, // Unlimited revisions
      JSON.stringify(["3 Konzepte", "Unbegrenzte Revisionen", "Alle Features", "Priority-Support", "Express-Lieferung"])
    ]
  );
  packageCount++;
}

console.log(`✅ Created ${packageCount} packages (3 per gig)`);

await connection.end();

console.log("\n🎉 Seed completed successfully!");
console.log(`📊 Summary: ${gigs.length} gigs, ${packageCount} packages`);
