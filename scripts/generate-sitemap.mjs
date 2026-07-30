/**
 * Generates public/sitemap.xml from the route table and the blog index.
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

// Blog slugs from the post list.
const blogSource = await readFile(path.join(ROOT, "src/app/constants/blog.ts"), "utf8");
const blogSlugs = [...blogSource.matchAll(/slug:\s*"([^"]+)"/g)].map(([, slug]) => slug);

/**
 * Transactional routes stay out of the sitemap: /book/success is noindex, and
 * listing it invites crawlers into a confirmation screen.
 */
const EXCLUDED = new Set(["/book/success"]);

function priorityFor(routePath) {
  if (routePath === "/") return "1.0";
  if (routePath === "/book") return "0.9";
  if (routePath.startsWith("/services/") || ["/cleaning", "/junk-removal", "/landscaping"].includes(routePath)) {
    return "0.9";
  }
  if (routePath === "/privacy") return "0.3";
  return "0.6";
}

function changefreqFor(routePath) {
  if (routePath === "/" || routePath === "/blog") return "weekly";
  if (routePath === "/privacy") return "yearly";
  return "monthly";
}

const paths = [
  ...routePaths.filter((p) => !EXCLUDED.has(p)),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];

const base = SITE_URL.replace(/\/$/, "");
const entries = paths
  .map((routePath) => {
    const loc = routePath === "/" ? `${base}/` : `${base}${routePath}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
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
  src/app/constants/blog.ts. The domain comes from SITE_URL in
  src/app/constants/seo.ts; change it there, not here.
  Noindex/transactional routes (/book/success, 404) are excluded.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

await writeFile(path.join(ROOT, "public/sitemap.xml"), xml, "utf8");
console.log(`sitemap.xml — ${paths.length} URLs at ${base}`);
