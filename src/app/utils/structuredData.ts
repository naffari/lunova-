import { COMPANY_NAME, EMAIL, PHONE, PHONE_DISPLAY, SERVICE_AREA } from "../constants/contact";
import { SITE_URL } from "../constants/seo";

/** A JSON-LD document. Kept loose (schema.org has no static TS types) but never `any`. */
export type JsonLdSchema = Record<string, unknown>;

/**
 * Site-wide LocalBusiness schema. Only includes fields we actually know to be
 * true (name, phone, email, service area) — deliberately omits street address
 * and geo-coordinates since none exist anywhere in this project yet. Fabricating
 * that data would actively hurt local SEO once the real business details are added.
 */
export function buildLocalBusinessSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: COMPANY_NAME,
    url: SITE_URL,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    areaServed: SERVICE_AREA,
    priceRange: "$$",
  };
}

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
}

export function buildServiceSchema({ name, description, path }: ServiceSchemaInput): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE_URL}${path}`,
    areaServed: SERVICE_AREA,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: COMPANY_NAME,
      telephone: PHONE_DISPLAY,
      url: SITE_URL,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

interface FaqSchemaItem {
  q: string;
  a: string;
}

export function buildFaqSchema(items: FaqSchemaItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildOrganizationSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: SITE_URL,
    email: EMAIL,
    telephone: PHONE_DISPLAY,
  };
}

interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  image: string;
}

export function buildArticleSchema({ title, description, path, datePublished, image }: ArticleSchemaInput): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    url: `${SITE_URL}${path}`,
    author: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      url: SITE_URL,
    },
  };
}
