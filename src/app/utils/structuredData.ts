import { COMPANY_NAME, PHONE_DISPLAY, SERVICE_AREA } from "../constants/contact";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../constants/seo";
import {
  ALTERNATE_NAMES,
  FOUNDED_YEAR,
  GOOGLE_BUSINESS,
  OPENING_HOURS,
  PAYMENT,
  SAME_AS,
  SERVICE_CENTER,
} from "../constants/business";
import { SERVICE_CITIES, cityPath } from "../constants/cities";
import type { ServiceCity } from "../constants/cities";
import { ACTIVE_SERVICES, SERVICES } from "../constants/services";

/** A JSON-LD document. Kept loose (schema.org has no static TS types) but never `any`. */
export type JsonLdSchema = Record<string, unknown>;

/**
 * The one stable identifier for the business entity.
 *
 * Every schema block that describes Lunova points at this `@id` instead of
 * re-declaring the business inline. That is what lets a crawler merge the
 * homepage's LocalBusiness, a service page's `provider`, and a city page's
 * `areaServed` into one entity rather than treating them as three businesses
 * that happen to share a phone number.
 */
export const BUSINESS_ID = `${SITE_URL}/#business`;

/** `areaServed` as real City nodes, not a single loose string. */
function areaServedCities(): JsonLdSchema[] {
  return SERVICE_CITIES.map((city) => ({
    "@type": "City",
    name: city.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: "US",
    },
  }));
}

function openingHoursSpecification(): JsonLdSchema[] {
  return OPENING_HOURS.map((block) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...block.days],
    opens: block.opens,
    closes: block.closes,
  }));
}

/**
 * Every service we sell, as an OfferCatalog.
 *
 * This is the block that answers "what does this business actually do" for
 * both the classic local algorithm and the AI systems that summarise a
 * business from its markup. Generated from constants/services.ts so a new
 * service appears here the moment it appears in the catalogue.
 */
function hasOfferCatalog(): JsonLdSchema {
  return {
    "@type": "OfferCatalog",
    name: `${COMPANY_NAME} Services`,
    // ACTIVE_SERVICES, not SERVICES. This is the block Google and the AI
    // answer engines read to decide what the business does, so listing a
    // parked line here would have the schema advertising work the site itself
    // refuses to book.
    itemListElement: ACTIVE_SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        url: `${SITE_URL}${service.to}`,
      },
    })),
  };
}

/**
 * Site-wide LocalBusiness schema.
 *
 * Still omits `address` and refuses to invent one: Lunova is a service-area
 * business with no storefront, and Google cross-checks schema against the
 * Business Profile. A fabricated street address is a mismatch, and a mismatch
 * on NAP is the most common reason a local business fails to consolidate into
 * a single entity in Google's index.
 *
 * What it does now carry, all of it verifiable: the service area as City
 * nodes, a GeoCircle for the metro, opening hours matching the Business
 * Profile, the full service catalogue, and `sameAs` linking this site to that
 * profile. Everything comes from constants/business.ts, so change it there.
 */
export function buildLocalBusinessSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    /**
     * Both types, deliberately.
     *
     * `HomeAndConstructionBusiness` is already a subtype of `LocalBusiness`, so
     * on paper the second entry is redundant. In practice a lot of SEO
     * crawlers, directory validators and citation checkers match the literal
     * string `LocalBusiness` and report "no local business schema" on a page
     * that is carrying exactly that — which is what a third-party audit of this
     * site did. Declaring an array is valid schema.org, costs nothing, and
     * keeps the specific type for the systems that understand the hierarchy.
     */
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": BUSINESS_ID,
    name: COMPANY_NAME,
    alternateName: ALTERNATE_NAMES,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    logo: `${SITE_URL}/favicon.png`,
    // `telephone` stays: it is what earns click-to-call in local results, and
    // it is worth far more than the spam it attracts.
    telephone: PHONE_DISPLAY,
    // `email` deliberately omitted. It earns almost nothing here, and leaving it
    // would put the address in static HTML for harvesters — undoing the
    // obfuscation in utils/obfuscate.ts. Contact routes through the phone
    // number, the booking form, and the post-hydration mailto link.
    /**
     * Locality and region, but no `streetAddress`.
     *
     * This is the shape Google documents for a service-area business: the
     * `PostalAddress` is still required to establish where the entity is based,
     * and omitting the street line is the correct way to say "we come to you"
     * rather than "we have a shop you can visit". Inventing a street number to
     * fill the field is a fabricated fact Google cross-checks against the
     * Business Profile, and a NAP mismatch costs more than the missing field.
     */
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kansas City",
      addressRegion: "MO",
      addressCountry: "US",
    },
    areaServed: areaServedCities(),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: SERVICE_CENTER.latitude,
        longitude: SERVICE_CENTER.longitude,
      },
      geoRadius: SERVICE_CENTER.radius,
    },
    openingHoursSpecification: openingHoursSpecification(),
    hasOfferCatalog: hasOfferCatalog(),
    foundingDate: String(FOUNDED_YEAR),
    knowsLanguage: "en-US",
    ...PAYMENT,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    // Resolves straight to the Business Profile when the place ID is set. Left
    // Left out entirely otherwise, since an empty hasMap is worse than none.
    ...(GOOGLE_BUSINESS.PLACE_ID
      ? { hasMap: `https://www.google.com/maps/place/?q=place_id:${GOOGLE_BUSINESS.PLACE_ID}` }
      : {}),
    // NOTE: no `aggregateRating`. Lunova has no reviews yet, and Google is
    // explicit that self-hosted LocalBusiness ratings are ineligible for star
    // rich results anyway. When real reviews exist, wire REVIEWS from
    // constants/proof.ts in here. It still feeds AI Overviews even without
    // earning stars.
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
    areaServed: areaServedCities(),
    // Reference, not a copy. An inline provider block on nine service pages
    // reads as nine businesses; an @id reference resolves to the one entity
    // declared on the homepage.
    provider: {
      "@id": BUSINESS_ID,
      "@type": "HomeAndConstructionBusiness",
      name: COMPANY_NAME,
      telephone: PHONE_DISPLAY,
      url: SITE_URL,
    },
  };
}

/**
 * City page schema: the business, scoped to one city.
 *
 * Emits a Service node per service the city page actually features, each with
 * a single-city `areaServed` and a `GeoCoordinates` for that city. This is the
 * markup that gives Google something concrete to match against a
 * "<service> near me in <city>" query, and gives an AI answer engine a
 * city-scoped fact to cite rather than a metro-wide generality.
 */
export function buildCityServiceSchemas(city: ServiceCity): JsonLdSchema[] {
  const cityNode = {
    "@type": "City",
    name: city.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.geo.lat,
      longitude: city.geo.lng,
    },
  };

  return city.serviceFocus.map((focus) => {
    const service = SERVICES.find((s) => s.id === focus.serviceId);
    const serviceName = service?.name ?? focus.heading;
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${serviceName} in ${city.label}`,
      serviceType: serviceName,
      description: focus.body,
      url: `${SITE_URL}${cityPath(city.slug)}`,
      areaServed: cityNode,
      provider: {
        "@id": BUSINESS_ID,
        "@type": "HomeAndConstructionBusiness",
        name: COMPANY_NAME,
        telephone: PHONE_DISPLAY,
        url: SITE_URL,
      },
      ...(service ? { mainEntityOfPage: `${SITE_URL}${service.to}` } : {}),
    };
  });
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
    "@id": BUSINESS_ID,
    name: COMPANY_NAME,
    alternateName: ALTERNATE_NAMES,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    // See buildLocalBusinessSchema: telephone earns its keep, email does not and
    // would leak the address into static HTML.
    telephone: PHONE_DISPLAY,
    areaServed: SERVICE_AREA,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_DISPLAY,
      contactType: "customer service",
      areaServed: "US-MO",
      availableLanguage: "English",
    },
  };
}

/**
 * WebSite node, emitted once on the homepage.
 *
 * Small, but it is the block that names the site as a distinct thing from the
 * business and gives a crawler a publisher reference, which matters more now
 * that AI answer engines attribute citations to a publisher rather than a URL.
 */
export function buildWebSiteSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY_NAME,
    alternateName: ALTERNATE_NAMES,
    inLanguage: "en-US",
    publisher: { "@id": BUSINESS_ID },
  };
}

interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  /** Last substantive revision. Falls back to `datePublished`. */
  dateModified?: string;
  image: string;
}

export function buildArticleSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
}: ArticleSchemaInput): JsonLdSchema {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    // Google reads `dateModified` for freshness and shows it in the snippet.
    // Without it an evergreen guide looks stale the moment it stops being new.
    dateModified: dateModified ?? datePublished,
    url,
    // Names the canonical page this article IS, rather than leaving a crawler to
    // infer it from `url`. Required for Article to be eligible for rich results.
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    author: {
      // The publisher, by @id, so the article resolves to the same business
      // entity as every other page rather than a second nameless Organization.
      "@id": BUSINESS_ID,
      "@type": "Organization",
      name: COMPANY_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@id": BUSINESS_ID,
      "@type": "Organization",
      name: COMPANY_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.png`,
      },
    },
  };
}
