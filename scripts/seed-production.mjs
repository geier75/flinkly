import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
// Note: We'll use raw SQL instead of importing schema to avoid TypeScript issues

/**
 * Production Database Seed Script
 * 
 * This script populates the production database with:
 * - Sample users (sellers)
 * - Gigs with all fields
 * - Gig packages (Basic/Standard/Premium)
 * - Gig extras (Express Delivery, Extra Revisions, etc.)
 */

async function seedProduction() {
  console.log('🌱 Starting production database seed...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    // Check if data already exists
    const existingGigs = await connection.query('SELECT COUNT(*) as count FROM gigs');
    const gigCount = existingGigs[0][0].count;
    
    if (gigCount > 0) {
      console.log(`⚠️  Database already contains ${gigCount} gigs. Skipping seed.`);
      console.log('   To re-seed, first delete existing data manually.');
      await connection.end();
      return;
    }

    console.log('📝 Creating sample sellers...');
    
    // Create sample sellers (if they don't exist)
    const sellers = [
      {
        openId: 'seller_michael_weber',
        name: 'Michael Weber',
        email: 'michael.weber@example.com',
        userType: 'seller',
        sellerLevel: 'top_rated',
        completedOrders: 127,
        averageRating: 490, // 4.9 stars
        emailVerified: true,
        verified: true,
      },
      {
        openId: 'seller_stefan_richter',
        name: 'Stefan Richter',
        email: 'stefan.richter@example.com',
        userType: 'seller',
        sellerLevel: 'level_one',
        completedOrders: 45,
        averageRating: 470, // 4.7 stars
        emailVerified: true,
        verified: true,
      },
      {
        openId: 'seller_anna_schmidt',
        name: 'Anna Schmidt',
        email: 'anna.schmidt@example.com',
        userType: 'seller',
        sellerLevel: 'rising',
        completedOrders: 23,
        averageRating: 480, // 4.8 stars
        emailVerified: true,
        verified: true,
      },
    ];

    const sellerIds = {};
    for (const seller of sellers) {
      const result = await connection.query(
        `INSERT INTO users (openId, name, email, userType, sellerLevel, completedOrders, averageRating, emailVerified, verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [seller.openId, seller.name, seller.email, seller.userType, seller.sellerLevel, seller.completedOrders, seller.averageRating, seller.emailVerified, seller.verified]
      );
      sellerIds[seller.openId] = result[0].insertId;
      console.log(`   ✓ Created seller: ${seller.name} (ID: ${sellerIds[seller.openId]})`);
    }

    console.log('📦 Creating gigs with packages and extras...');

    // Sample gigs with packages and extras
    const gigsData = [
      {
        title: 'Professionelles Logo-Design',
        description: 'Ich erstelle ein einzigartiges, professionelles Logo für dein Unternehmen. Inklusive Quelldateien und unbegrenzten Revisionen im Premium-Paket.',
        category: 'design',
        sellerId: sellerIds['seller_michael_weber'],
        price: 9900, // 99€ (Basic package price)
        deliveryDays: 7,
        status: 'published',
        active: true,
        packages: [
          {
            packageType: 'basic',
            name: 'Basis Logo',
            description: '1 Logo-Konzept, 2 Revisionen',
            price: 9900,
            deliveryDays: 7,
            revisions: 2,
            features: JSON.stringify(['1 Logo-Konzept', '2 Revisionen', 'PNG & JPG Dateien', 'Kommerzielle Nutzung']),
          },
          {
            packageType: 'standard',
            name: 'Business Logo',
            description: '3 Logo-Konzepte, 5 Revisionen',
            price: 14900,
            deliveryDays: 5,
            revisions: 5,
            features: JSON.stringify(['3 Logo-Konzepte', '5 Revisionen', 'Alle Dateiformate', 'Quelldateien (AI, PSD)', 'Social Media Kit']),
          },
          {
            packageType: 'premium',
            name: 'Premium Branding',
            description: '5 Logo-Konzepte, unbegrenzte Revisionen',
            price: 19900,
            deliveryDays: 3,
            revisions: 999,
            features: JSON.stringify(['5 Logo-Konzepte', 'Unbegrenzte Revisionen', 'Komplettes Branding-Paket', 'Style Guide', 'Visitenkarten-Design', '24/7 Support']),
          },
        ],
        extras: [
          {
            extraType: 'express_delivery',
            name: 'Express-Lieferung',
            description: 'Erhalte dein Logo 2 Tage früher',
            price: 2000,
            deliveryDaysReduction: 2,
          },
          {
            extraType: 'extra_revisions',
            name: '+3 Extra Revisionen',
            description: '3 zusätzliche Überarbeitungsrunden',
            price: 1500,
            revisionsAdded: 3,
          },
          {
            extraType: 'commercial_license',
            name: 'Erweiterte Kommerzielle Lizenz',
            description: 'Nutzung für Merchandising & Weiterverkauf',
            price: 3000,
          },
        ],
      },
      {
        title: 'Responsive Webdesign (Figma)',
        description: 'Ich designe eine moderne, responsive Website in Figma. Perfekt für Entwickler-Übergabe.',
        category: 'design',
        sellerId: sellerIds['seller_anna_schmidt'],
        price: 14900,
        deliveryDays: 10,
        status: 'published',
        active: true,
        packages: [
          {
            packageType: 'basic',
            name: 'Landing Page',
            description: '1 Seite, Desktop + Mobile',
            price: 14900,
            deliveryDays: 10,
            revisions: 2,
            features: JSON.stringify(['1 Seite Design', 'Desktop + Mobile', '2 Revisionen', 'Figma Datei']),
          },
          {
            packageType: 'standard',
            name: 'Multi-Page Website',
            description: 'Bis zu 5 Seiten, alle Devices',
            price: 29900,
            deliveryDays: 14,
            revisions: 4,
            features: JSON.stringify(['5 Seiten Design', 'Desktop + Tablet + Mobile', '4 Revisionen', 'Design System', 'Prototyping']),
          },
          {
            packageType: 'premium',
            name: 'Full Website + Branding',
            description: 'Unbegrenzte Seiten, komplettes Branding',
            price: 49900,
            deliveryDays: 21,
            revisions: 999,
            features: JSON.stringify(['Unbegrenzte Seiten', 'Komplettes Design System', 'Branding Guidelines', 'Animations-Konzept', 'Developer Handoff', 'Unbegrenzte Revisionen']),
          },
        ],
        extras: [
          {
            extraType: 'express_delivery',
            name: 'Express-Lieferung',
            description: 'Projekt 3 Tage früher',
            price: 5000,
            deliveryDaysReduction: 3,
          },
          {
            extraType: 'source_files',
            name: 'Sketch & Adobe XD Export',
            description: 'Zusätzliche Dateiformate',
            price: 2000,
          },
        ],
      },
      {
        title: 'Chatbot-Entwicklung mit AI',
        description: 'Ich entwickle einen intelligenten Chatbot für deine Website. GPT-Integration, Custom-Training, Multi-Language.',
        category: 'technology',
        sellerId: sellerIds['seller_michael_weber'],
        price: 59900,
        deliveryDays: 10,
        status: 'published',
        active: true,
        packages: [
          {
            packageType: 'basic',
            name: 'Simple Chatbot',
            description: 'FAQ-basiert, 1 Sprache',
            price: 59900,
            deliveryDays: 10,
            revisions: 2,
            features: JSON.stringify(['FAQ-basierter Bot', '1 Sprache', 'Bis zu 50 Intents', 'Web-Widget', 'Basic Analytics']),
          },
          {
            packageType: 'standard',
            name: 'AI Chatbot',
            description: 'GPT-Integration, Multi-Language',
            price: 99900,
            deliveryDays: 14,
            revisions: 3,
            features: JSON.stringify(['GPT-4 Integration', '3 Sprachen', 'Custom Training', 'CRM Integration', 'Advanced Analytics', 'API Zugang']),
          },
          {
            packageType: 'premium',
            name: 'Enterprise Chatbot',
            description: 'Vollständig angepasst, alle Features',
            price: 199900,
            deliveryDays: 21,
            revisions: 5,
            features: JSON.stringify(['Vollständig Custom', 'Unbegrenzte Sprachen', 'Voice Integration', 'Multi-Channel (Web, WhatsApp, Telegram)', 'Dedicated Support', 'On-Premise Option']),
          },
        ],
        extras: [
          {
            extraType: 'express_delivery',
            name: 'Express-Entwicklung',
            description: '5 Tage früher fertig',
            price: 10000,
            deliveryDaysReduction: 5,
          },
          {
            extraType: 'extra_revisions',
            name: '+2 Revisionen',
            description: '2 zusätzliche Überarbeitungsrunden',
            price: 5000,
            revisionsAdded: 2,
          },
        ],
      },
    ];

    for (const gigData of gigsData) {
      // Insert gig
      const gigResult = await connection.query(
        `INSERT INTO gigs (title, description, category, sellerId, price, deliveryDays, status, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [gigData.title, gigData.description, gigData.category, gigData.sellerId, gigData.price, gigData.deliveryDays, gigData.status, gigData.active]
      );
      const gigId = gigResult[0].insertId;
      console.log(`   ✓ Created gig: ${gigData.title} (ID: ${gigId})`);

      // Insert packages
      for (const pkg of gigData.packages) {
        await connection.query(
          `INSERT INTO gigPackages (gigId, packageType, name, description, price, deliveryDays, revisions, features, active) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [gigId, pkg.packageType, pkg.name, pkg.description, pkg.price, pkg.deliveryDays, pkg.revisions, pkg.features, true]
        );
        console.log(`      → Package: ${pkg.name}`);
      }

      // Insert extras
      for (const extra of gigData.extras) {
        await connection.query(
          `INSERT INTO gigExtras (gigId, extraType, name, description, price, deliveryDaysReduction, revisionsAdded, active) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [gigId, extra.extraType, extra.name, extra.description, extra.price, extra.deliveryDaysReduction || 0, extra.revisionsAdded || 0, true]
        );
        console.log(`      → Extra: ${extra.name}`);
      }
    }

    console.log('✅ Production database seeded successfully!');
    console.log(`   Created ${gigsData.length} gigs with packages and extras`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run seed
seedProduction().catch(console.error);
