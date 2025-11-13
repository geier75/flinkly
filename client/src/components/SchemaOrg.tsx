/**
 * Schema.org JSON-LD Component
 * 
 * Structured Data für bessere SEO und Rich Snippets in Google
 * Best Practices 2025:
 * - Organization Schema (für Brand Knowledge Panel)
 * - WebSite Schema (für Sitelinks Search Box)
 * - AggregateRating Schema (für Star-Ratings in SERPs)
 * - Product/Service Schema (für Gig-Details)
 */

import { useEffect } from 'react';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[]; // Social Media URLs
  contactPoint?: {
    telephone?: string;
    contactType: string;
    email?: string;
  };
}

interface WebSiteSchemaProps {
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface AggregateRatingSchemaProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs = [],
  contactPoint,
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
    ...(contactPoint && { contactPoint }),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-organization';
    
    // Remove existing schema if present
    const existing = document.getElementById('schema-organization');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

export function WebSiteSchema({ name, url, potentialAction }: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(potentialAction && { potentialAction }),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-website';
    
    const existing = document.getElementById('schema-website');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

export function AggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: AggregateRatingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating,
    worstRating,
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-rating';
    
    const existing = document.getElementById('schema-rating');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * Product/Service Schema für Gig-Detail-Seiten
 */
interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: {
    name: string;
    image?: string;
  };
  offers: {
    price: number;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function ServiceSchema({
  name,
  description,
  provider,
  offers,
  aggregateRating,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Person',
      ...provider,
    },
    offers: {
      '@type': 'Offer',
      ...offers,
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...aggregateRating,
      },
    }),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-service';
    
    const existing = document.getElementById('schema-service');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * FAQ Schema für FAQ-Seiten
 */
interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-faq';
    
    const existing = document.getElementById('schema-faq');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
