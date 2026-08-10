/**
 * Post-build SEO lint, run against the HTML that actually ships.
 *
 * `check-seo.mjs` reads the source and catches an over-long description before
 * anything is built. This one reads `dist/` and catches the class of defect
 * that only exists after rendering: a page that lost its canonical, two <h1>s
 * from a layout change, a sitemap advertising a URL the prerenderer no longer
 * writes, an internal link to a route that was renamed, JSON-LD that no longer
 * parses, an og:image pointing at a file that is not in the build.
 *
 * Every one of those is invisible in review, silently wrong in production, and
 * expensive: a broken canonical or a 404 in the sitemap costs indexing, not
 * styling. Cheaper to fail the build than to find it in Search Console six
 * weeks later.
 *
 * Runs at the end of `pnpm build`. Exits non-zero on any error.
 */
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DIST = path.join(ROOT, "dist");

const SITE_URL = (
  await readFile(path.join(ROOT, "src/app/constants/seo.ts"), "utf8")
).match(/SITE_URL\s*=\s*["'`]([^"'`]+)["'`]/)[1].replace(/\/$/, "");

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

/**
 * Files in dist/ that are HTML but not pages.
 *
 * The Google verification token is a bare text file that happens to end in
 * .html; it has no head, and it must not grow one.
 */
const NOT_A_PAGE = /^google[0-9a-f]+\.html$/;

const errors = [];
const warnings = [];

function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[1]);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const exists = (p) => access(p).then(() => true, () => false);

/** dist/services/window-cleaning/index.html → /services/window-cleaning */
function routeOf(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return null; // reached by status, not by URL
  return `/${rel.replace(/\/index\.html$/, "").replace(/\.html$/, "")}`;
}

const files = (await walk(DIST)).filter((f) => !NOT_A_PAGE.test(path.basename(f)));
if (files.length === 0) {
  console.error("check-build-seo: no HTML in dist/. Did the build run?");
  process.exit(1);
}

const routes = new Set();
const linkTargets = new Map(); // href → Set(pages linking to it)
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const file of files) {
  const html = await readFile(file, "utf8");
  const route = routeOf(file);
  const where = route ?? path.relative(DIST, file).replace(/\\/g, "/");
  if (route) routes.add(route);

  const fail = (message) => errors.push(`${where}: ${message}`);
  const warn = (message) => warnings.push(`${where}: ${message}`);

  const titles = all(html, /<title[^>]*>([\s\S]*?)<\/title>/g).map(decode);
  const descriptions = all(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/g).map(decode);
  const robots = all(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/g);
  const canonicals = all(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g);
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);

  // --- one of each, no duplicates ------------------------------------------
  // A second <title> is the classic prerender bug: the shell's default is left
  // in and every page reports the homepage title, because a crawler honours the
  // first one it meets.
  if (titles.length !== 1) fail(`expected exactly 1 <title>, found ${titles.length}`);
  if (descriptions.length !== 1) fail(`expected exactly 1 meta description, found ${descriptions.length}`);
  if (robots.length !== 1) fail(`expected exactly 1 meta robots, found ${robots.length}`);
  if (h1s.length !== 1) fail(`expected exactly 1 <h1>, found ${h1s.length}`);
  if (!/<html[^>]*\slang="[a-z]{2}(-[A-Z]{2})?"/.test(html)) fail("missing or malformed <html lang>");

  const noIndex = robots.some((r) => /noindex/i.test(r));

  if (titles.length === 1) {
    const length = titles[0].length;
    if (length > TITLE_MAX || length < TITLE_MIN) {
      warn(`title is ${length} chars (aim ${TITLE_MIN}–${TITLE_MAX}): "${titles[0]}"`);
    }
    const key = titles[0];
    if (!seenTitles.has(key)) seenTitles.set(key, []);
    seenTitles.get(key).push(where);
  }

  if (descriptions.length === 1) {
    const length = descriptions[0].length;
    if (length > DESC_MAX) fail(`meta description is ${length} chars (max ${DESC_MAX})`);
    else if (length < DESC_MIN) warn(`meta description is ${length} chars (aim ${DESC_MIN}+)`);
    const key = descriptions[0];
    if (!seenDescriptions.has(key)) seenDescriptions.set(key, []);
    seenDescriptions.get(key).push(where);
  }

  // --- canonical ------------------------------------------------------------
  if (noIndex) {
    if (canonicals.length > 0) fail(`noindex page carries a canonical (${canonicals[0]})`);
  } else if (canonicals.length !== 1) {
    fail(`expected exactly 1 canonical, found ${canonicals.length}`);
  } else if (route && canonicals[0] !== `${SITE_URL}${route}`) {
    fail(`canonical points at ${canonicals[0]}, expected ${SITE_URL}${route}`);
  }

  // --- Open Graph -----------------------------------------------------------
  const og = (property) =>
    all(html, new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]*)"`, "g"))[0];

  for (const property of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:site_name"]) {
    if (!og(property)) fail(`missing ${property}`);
  }

  const ogImage = og("og:image");
  if (ogImage) {
    if (!ogImage.startsWith(`${SITE_URL}/`)) {
      fail(`og:image must be an absolute URL on ${SITE_URL}: ${ogImage}`);
    } else {
      // A share image that 404s is a blank card, and the crawler caches it.
      const asset = path.join(DIST, ogImage.slice(SITE_URL.length));
      if (!(await exists(asset))) fail(`og:image is not in the build: ${ogImage}`);
    }
  }
  if (!all(html, /<meta[^>]*property="og:image:alt"[^>]*content="([^"]*)"/g)[0]) {
    warn("missing og:image:alt");
  }
  if (!noIndex && route && og("og:url") && og("og:url") !== `${SITE_URL}${route}`) {
    fail(`og:url is ${og("og:url")}, expected ${SITE_URL}${route}`);
  }

  // --- structured data ------------------------------------------------------
  const blocks = all(html, /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
  for (const [index, block] of blocks.entries()) {
    try {
      const parsed = JSON.parse(decode(block));
      if (!parsed["@context"]) fail(`JSON-LD block ${index + 1} has no @context`);
      if (!parsed["@type"]) fail(`JSON-LD block ${index + 1} has no @type`);
    } catch (error) {
      fail(`JSON-LD block ${index + 1} does not parse: ${error.message}`);
    }
  }
  if (!noIndex && blocks.length === 0) warn("no JSON-LD on an indexable page");

  // --- images ---------------------------------------------------------------
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(tag)) fail(`<img> with no alt attribute: ${tag.slice(0, 90)}`);
  }

  // --- links ----------------------------------------------------------------
  for (const href of all(html, /<a\b[^>]*href="([^"]*)"/g)) {
    if (!linkTargets.has(href)) linkTargets.set(href, new Set());
    linkTargets.get(href).add(where);
  }
  if (/https?:\/\/(localhost|127\.0\.0\.1|[^"']*\.vercel\.app)/.test(html)) {
    fail("contains a localhost or *.vercel.app URL");
  }
}

// --- internal links resolve to something we shipped -------------------------
for (const [href, from] of linkTargets) {
  if (!href.startsWith("/")) continue;
  const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (routes.has(clean)) continue;
  if (await exists(path.join(DIST, clean))) continue; // a real static file
  errors.push(`dead internal link "${href}" on: ${[...from].slice(0, 3).join(", ")}`);
}

// --- sitemap agrees with what was written ------------------------------------
const sitemap = await readFile(path.join(DIST, "sitemap.xml"), "utf8");
const sitemapRoutes = new Set(
  all(sitemap, /<loc>([^<]+)<\/loc>/g).map((loc) => {
    const route = loc.replace(SITE_URL, "");
    return route === "/" || route === "" ? "/" : route.replace(/\/$/, "");
  })
);

for (const route of sitemapRoutes) {
  if (!routes.has(route)) errors.push(`sitemap.xml lists ${route}, which was not prerendered`);
}
for (const route of routes) {
  if (!sitemapRoutes.has(route)) {
    errors.push(`${route} was prerendered but is missing from sitemap.xml`);
  }
}

// --- duplicate titles and descriptions ---------------------------------------
// Two pages with the same title is Google's cue to keep one and drop the other.
for (const [title, pages] of seenTitles) {
  if (pages.length > 1) errors.push(`duplicate <title> "${title}" on: ${pages.join(", ")}`);
}
for (const [description, pages] of seenDescriptions) {
  if (pages.length > 1) {
    errors.push(`duplicate meta description on: ${pages.join(", ")}`);
  }
}

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (errors.length > 0) {
  console.error(`\nBuild SEO check failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`  error  ${error}`);
  console.error("");
  process.exit(1);
}

console.log(
  `\nBuild SEO check passed: ${files.length} pages, ${sitemapRoutes.size} sitemap URLs, ${warnings.length} warning(s).`
);
