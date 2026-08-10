import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_URL,
  ogImageDimensions,
} from "../../constants/seo";
import type { JsonLdSchema } from "../../utils/structuredData";

interface SeoProps {
  title: string;
  description: string;
  /**
   * Open Graph share image, absolute. Build it with `heroOgImage()` so the card
   * shows this page's own hero; defaults to the site-wide composite.
   */
  image?: string;
  /** Alt text for the share image. Read aloud by screen readers on social posts. */
  imageAlt?: string;
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
export default function Seo({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  jsonLd,
  noIndex = false,
}: SeoProps) {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const dimensions = ogImageDimensions(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      {/*
        No canonical on a noindex page. The 404 renders from an internal
        "/__not-found" path, so a self-referencing canonical pointed every
        missing URL at a URL that does not exist and never resolves — a
        contradiction a crawler has to reconcile for nothing. A noindex page
        needs no canonical at all.
      */}
      {noIndex ? null : <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      {/*
        Declared size, so a share card lays out at the right aspect ratio before
        the image has downloaded rather than reflowing once it arrives. Emitted
        only for images whose real dimensions are known — see ogImageDimensions.
      */}
      {dimensions ? <meta property="og:image:width" content={String(dimensions.width)} /> : null}
      {dimensions ? <meta property="og:image:height" content={String(dimensions.height)} /> : null}
      <meta property="og:site_name" content="Lunova Services" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
