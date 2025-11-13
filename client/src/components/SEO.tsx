/**
 * SEO Component - Dynamic Meta Tags & Schema.org
 * 
 * Usage:
 * <SEO
 *   title="Gig-Titel | Flinkly"
 *   description="Beschreibung..."
 *   image="https://..."
 *   type="product"
 *   schema={{
 *     "@type": "Product",
 *     "name": "...",
 *     "offers": {...}
 *   }}
 * />
 */

import { useEffect } from "react";
import { APP_TITLE } from "@/const";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article" | "profile";
  schema?: Record<string, any>;
  noindex?: boolean;
  canonical?: string;
}

export function SEO({
  title,
  description = "Dein Marktplatz für schnelle, kreative & digitale Mikrodienstleistungen in der DACH-Region. Vertrauensvoll. Erfahren. Rechtssicher.",
  image = "/og-image.jpg",
  url,
  type = "website",
  schema,
  noindex = false,
  canonical,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
  const fullUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }

    // Open Graph
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", fullUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", APP_TITLE, true);
    updateMetaTag("og:locale", "de_DE", true);

    // Twitter Card
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Schema.org JSON-LD
    if (schema) {
      let scriptElement = document.querySelector('script[type="application/ld+json"][data-seo]');
      
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.setAttribute("type", "application/ld+json");
        scriptElement.setAttribute("data-seo", "true");
        document.head.appendChild(scriptElement);
      }

      const schemaData = {
        "@context": "https://schema.org",
        ...schema,
      };

      scriptElement.textContent = JSON.stringify(schemaData);
    }
  }, [fullTitle, description, image, fullUrl, type, schema, noindex, canonicalUrl]);

  return null;
}

// Helper function to generate Product schema
export function generateProductSchema(gig: {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  seller: { name: string };
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@type": "Product",
    "name": gig.title,
    "description": gig.description,
    "image": gig.imageUrl || "/og-image.jpg",
    "offers": {
      "@type": "Offer",
      "url": `https://flinkly.com/gigs/${gig.id}`,
      "priceCurrency": "EUR",
      "price": (gig.price / 100).toFixed(2),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Person",
        "name": gig.seller.name,
      },
    },
    ...(gig.rating && gig.reviewCount
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": gig.rating.toString(),
            "reviewCount": gig.reviewCount.toString(),
          },
        }
      : {}),
  };
}

// Helper function to generate BreadcrumbList schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

// Helper function to generate FAQ schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
