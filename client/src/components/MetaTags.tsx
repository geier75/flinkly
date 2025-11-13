import { useEffect } from "react";
import { APP_TITLE } from "@/const";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  price?: number;
  currency?: string;
}

/**
 * MetaTags Component - SEO & Social Media Optimization
 * 
 * Dynamically updates meta tags for better SEO and social media sharing.
 * Implements Open Graph (Facebook/LinkedIn) and Twitter Card protocols.
 * 
 * Usage:
 * <MetaTags 
 *   title="Logo-Design ab 50€"
 *   description="Professionelles Logo-Design von verifizierten Designern"
 *   image="https://..."
 *   type="product"
 *   price={50}
 * />
 */
export default function MetaTags({
  title,
  description = "Der Marktplatz für schnelle, kreative & digitale Mikrodienstleistungen in der DACH-Region.",
  image = "/og-image.jpg",
  url,
  type = "website",
  price,
  currency = "EUR",
}: MetaTagsProps) {
  useEffect(() => {
    // Full title with branding
    const fullTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
    
    // Current URL
    const currentUrl = url || window.location.href;
    
    // Update document title
    document.title = fullTitle;
    
    // Helper function to set meta tag
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? "name" : "property";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };
    
    // Basic Meta Tags
    setMetaTag("description", description, true);
    
    // Open Graph Meta Tags (Facebook, LinkedIn)
    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", description);
    setMetaTag("og:image", image);
    setMetaTag("og:url", currentUrl);
    setMetaTag("og:type", type);
    setMetaTag("og:site_name", APP_TITLE);
    setMetaTag("og:locale", "de_DE");
    
    // Twitter Card Meta Tags
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", fullTitle, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", image, true);
    
    // Product-specific Meta Tags
    if (type === "product" && price) {
      setMetaTag("product:price:amount", price.toString());
      setMetaTag("product:price:currency", currency);
    }
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);
    
  }, [title, description, image, url, type, price, currency]);
  
  return null; // This component doesn't render anything
}
