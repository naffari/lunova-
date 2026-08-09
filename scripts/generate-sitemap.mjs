/**
 * Generates public/sitemap.xml from the route table.
 *
 * It was previously hand-maintained, which means it could silently omit a new
 * page or advertise a deleted one. Runs as part of `pnpm build`, before the
 * client build copies public/ into dist/.
 *
 * Run:  pnpm sitemap
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

/** Read a value out of a TS source file without importing it (no TS loader in plain node). */
async function readConst(file, pattern) {
  const source = await readFile(path.join(ROOT, file), "utf8");
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not read ${pattern} from ${file}`);
  return match[1];
}

const SITE_URL = await readConst("src/app/constants/seo.ts", /SITE_URL\s*=\s*["'`]([^"'`]+)["'`]/);

// Route paths, straight from ROUTE_CONFIG. Anything with prerender:false is
// either a pattern or the catch-all and is handled separately.
const routeSource = await readFile(path.join(ROOT, "src/app/routeConfig.ts"), "utf8");
const routePaths = [...routeSource.matchAll(/path:\s*"([^"]+)".*?prerender:\s*(true|false)/g)]
  .filter(([, , prerender]) => prerender === "true")
  .map(([, routePath]) => routePath);

/**
 * City landing pages, expanded from constants/cities.ts.
 *
 * They are declared in routeConfig as one `:city` pattern, so the regex above
 * cannot see them. Each is a real prerendered URL and was built to be indexed.
 * Read as text for the same reason as SITE_URL: this script runs under plain
 * node with no TypeScript loader.
 *
 * Kept in step with the prerenderer by construction: `expandPrerenderPaths` in
 * routeConfig.ts builds the same list from the same slugs, so the sitemap
 * cannot advertise a page that was never written to disk.
 */
const citySource = await readFile(path.join(ROOT, "src/app/constants/cities.ts"), "utf8");
const citySlugs = [...citySource.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map(([, slug]) => slug);
if (citySlugs.length === 0) throw new Error("Could not read any city slugs from constants/cities.ts");
const cityPaths = citySlugs.map((slug) => `/service-areas/${slug}`);

/**
 * Guide pages, expanded from constants/guides.ts for the same reason as the
 * cities above: declared as one `:slug` pattern, prerendered individually.
 */
const guideSource = await readFile(path.join(ROOT, "src/app/constants/guides.ts"), "utf8");
const guideSlugs = [...guideSource.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map(([, slug]) => slug);
if (guideSlugs.length === 0) throw new Error("Could not read any guide slugs from constants/guides.ts");
const guidePaths = guideSlugs.map((slug) => `/guides/${slug}`);

/**
 * Routes that are prerendered but must not be advertised to crawlers. Empty
 * today — the booking confirmation is rendered in place by the wizard rather
 * than at its own URL, so there is no transactional route left to exclude.
 * Kept as the hook for the next one.
 */
const EXCLUDED = new Set([]);

function priorityFor(routePath) {
  if (routePath === "/") return "1.0";
  if (routePath === "/book") return "0.9";
  if (routePath.startsWith("/services/") || ["/cleaning", "/junk-removal", "/landscaping"].includes(routePath)) {
    return "0.9";
  }
  // City pages carry the local-search weight for a business with no storefront,
  // so they rank alongside the service pages rather than below them.
  if (routePath.startsWith("/service-areas/")) return "0.8";
  if (routePath === "/service-areas") return "0.8";
  // Guides are the top-of-funnel half of the strategy: they rank for the
  // question, the service page converts it. Worth more than an about page,
  // less than the page that takes the booking.
  if (routePath.startsWith("/guides/")) return "0.7";
  if (routePath === "/guides") return "0.7";
  if (routePath === "/privacy") return "0.3";
  return "0.6";
}

function changefreqFor(routePath) {
  if (routePath === "/") return "weekly";
  if (routePath === "/privacy") return "yearly";
  return "monthly";
}

const paths = [...routePaths, ...cityPaths, ...guidePaths].filter((p) => !EXCLUDED.has(p));

/**
 * `lastmod`, as today's date at build time.
 *
 * Honest at the moment it is written. Every URL here is regenerated from source
 * on every build, so the whole set really is as fresh as the build. Google
 * treats a lastmod it trusts as a recrawl hint, and a per-page date faked into
 * the future is the fastest way to stop being trusted, so this is one real date
 * rather than twelve invented ones.
 */
const LASTMOD = new Date().toISOString().slice(0, 10);

const base = SITE_URL.replace(/\/$/, "");
const entries = paths
  .map((routePath) => {
    const loc = routePath === "/" ? `${base}/` : `${base}${routePath}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      `    <changefreq>${changefreqFor(routePath)}</changefreq>`,
      `    <priority>${priorityFor(routePath)}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  GENERATED FILE — do not edit by hand.
  Produced by scripts/generate-sitemap.mjs from src/app/routeConfig.ts and
  src/app/constants/cities.ts.
  The domain comes from SITE_URL in src/app/constants/seo.ts; change it
  there, not here.
  The 404 catch-all is excluded; it is not prerendered.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

await writeFile(path.join(ROOT, "public/sitemap.xml"), xml, "utf8");
console.log(
  `sitemap.xml: ${paths.length} URLs (${cityPaths.length} city pages, ${guidePaths.length} guides) at ${base}`
);
