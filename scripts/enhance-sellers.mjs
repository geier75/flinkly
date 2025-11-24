import mysql from "mysql2/promise";

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("🔧 Enhancing seller profiles...");

// Update seller 1 (Hakki özkelle) with verification and better stats
await connection.query(`
  UPDATE users 
  SET 
    verified = true,
    emailVerified = true,
    phoneVerified = true,
    verificationLevel = 'admin',
    sellerLevel = 'top_rated',
    completedOrders = 47,
    averageRating = 480
  WHERE id = 1
`);

console.log("✅ Updated seller 1: Hakki özkelle (Pro Seller, Full Verification)");

// Update gigs with better stats
const gigUpdates = [
  { id: 90001, completedOrders: 23, averageRating: 490, popularityScore: 85 }, // Logo Design
  { id: 90002, completedOrders: 18, averageRating: 475, popularityScore: 72 }, // Social Media
  { id: 90003, completedOrders: 12, averageRating: 495, popularityScore: 68 }, // WordPress
  { id: 90004, completedOrders: 15, averageRating: 485, popularityScore: 74 }, // Landing Page
  { id: 90005, completedOrders: 28, averageRating: 488, popularityScore: 92 }, // SEO
  { id: 90006, completedOrders: 19, averageRating: 482, popularityScore: 78 }, // Google Ads
  { id: 90007, completedOrders: 34, averageRating: 492, popularityScore: 95 }, // Blog Article
  { id: 90008, completedOrders: 21, averageRating: 486, popularityScore: 81 }, // Website Texte
  { id: 90009, completedOrders: 8, averageRating: 498, popularityScore: 65 }, // Business Plan
  { id: 90010, completedOrders: 11, averageRating: 494, popularityScore: 70 }, // Security Audit
];

for (const gig of gigUpdates) {
  await connection.query(
    `UPDATE gigs 
     SET completedOrders = ?, averageRating = ?, popularityScore = ?, updatedAt = NOW()
     WHERE id = ?`,
    [gig.completedOrders, gig.averageRating, gig.popularityScore, gig.id]
  );
  console.log(`✅ Updated gig ${gig.id}: ${gig.completedOrders} orders, ${(gig.averageRating / 100).toFixed(1)}★`);
}

await connection.end();

console.log("\n🎉 Seller profiles enhanced successfully!");
console.log("📊 Summary:");
console.log("  - Seller 1: Pro Level, Full Verification, 47 completed orders, 4.8★ rating");
console.log("  - 10 Gigs: Updated with realistic order counts (8-34) and ratings (4.7-5.0★)");
