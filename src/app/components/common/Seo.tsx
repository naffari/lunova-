import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../../constants/seo";
import type { JsonLdSchema } from "../../utils/structuredData";

interface SeoProps {
  title: string;
  description: string;
  /** Open Graph share image. Defaults to a site-wide fallback. */
  image?: string;
  /** "website" for most pages, "article" for blog posts. */
  type?: "website" | "article";
  /** One or more JSON-LD schema objects to embed as <script type="application/ld+json">. */
  jsonLd?: JsonLdSchema | JsonLdSchema[];
  /** Set true for transactional/utility pages (404, success screens) that shouldn't be indexed. */
  noIndex?: boolean;
}

/**
 * Centralized page-level SEO: title/description, Open Graph, Twitter card,
 * a self-referencing canonical URL (derived from the current route), and
 * optional JSON-LD structured data. Wraps the site's existing react-helmet-async
 * setup so every page gets consistent, complete meta tags from one component.
 */
export default function Seo({ title, description, image = DEFAULT_OG_IMAGE, type = "website", jsonLd, noIndex = false }: SeoProps) {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Lunova Services" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
