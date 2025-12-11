// @ts-nocheck
import { getDb } from "./adapters";
import { gigs } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Sitemap Generator
 * 
 * Generates dynamic XML sitemap for SEO optimization.
 * Includes all public pages with priority and changefreq.
 */

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapURL[] = [];

  // 1. Static Pages
  urls.push(
    { loc: `${baseUrl}/`, priority: 1.0, changefreq: "daily" }, // Homepage
    { loc: `${baseUrl}/marketplace`, priority: 0.9, changefreq: "hourly" }, // Marketplace
    { loc: `${baseUrl}/how-it-works`, priority: 0.7, changefreq: "monthly" },
    { loc: `${baseUrl}/become-seller`, priority: 0.8, changefreq: "monthly" },
    { loc: `${baseUrl}/impressum`, priority: 0.3, changefreq: "yearly" },
    { loc: `${baseUrl}/privacy`, priority: 0.3, changefreq: "yearly" },
    { loc: `${baseUrl}/terms`, priority: 0.3, changefreq: "yearly" },
    { loc: `${baseUrl}/widerruf`, priority: 0.3, changefreq: "yearly" }
  );

  // 2. Dynamic Pages - Gigs
  const db = await getDb();
  if (db) {
    const publishedGigs = await db
      .select({ id: gigs.id, updatedAt: gigs.updatedAt })
      .from(gigs)
      .where(eq(gigs.status, "published"));

    publishedGigs.forEach((gig) => {
      urls.push({
        loc: `${baseUrl}/gig/${gig.id}`,
        lastmod: gig.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "weekly",
      });
    });
  }

  // 3. Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ""}${url.priority !== undefined ? `\n    <priority>${url.priority.toFixed(1)}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
}

/**
 * Generate robots.txt
 * 
 * Allows all crawlers, points to sitemap.
 */
export function generateRobotsTxt(baseUrl: string): string {
  return `# Flinkly - DACH Marktplatz für Mikrodienstleistungen
# https://flinkly.de

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /dashboard/
Disallow: /messages/
Disallow: /checkout/

# Crawl-delay (optional, for aggressive crawlers)
Crawl-delay: 1
`;
}
