/**
 * Generates public/llms.txt.
 *
 * llms.txt is a plain-markdown map of a site written for language models
 * rather than crawlers: what the entity is, what it sells, where it operates,
 * and the canonical URL for each of those facts. It is a proposed convention,
 * not a standard anybody is obliged to honour — but it costs one build step,
 * and for a local service business a growing share of "who cleans houses in
 * Overland Park" is answered inside an assistant rather than on a results page.
 * The same reasoning as the explicit AI-crawler allows in robots.txt.
 *
 * Generated rather than hand-written for the same reason the sitemap is: a
 * hand-maintained index silently rots, and an index that advertises a page
 * that no longer exists is worse than no index.
 *
 * Run: part of `pnpm build`, before the client build copies public/ into dist/.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

async function source(file) {
  return readFile(path.join(ROOT, file), "utf8");
}

function readConst(text, pattern, label) {
  const match = text.match(pattern);
  if (!match) throw new Error(`Could not read ${label}`);
  return match[1];
}

const seo = await source("src/app/constants/seo.ts");
const SITE_URL = readConst(seo, /SITE_URL\s*=\s*["'`]([^"'`]+)["'`]/, "SITE_URL").replace(/\/$/, "");

const contact = await source("src/app/constants/contact.ts");
const COMPANY_NAME = readConst(contact, /COMPANY_NAME\s*=\s*["'`]([^"'`]+)["'`]/, "COMPANY_NAME");
const PHONE_DISPLAY = readConst(contact, /PHONE_DISPLAY\s*=\s*["'`]([^"'`]+)["'`]/, "PHONE_DISPLAY");

/** Services: name + route, straight from the catalogue. */
const services = await source("src/app/constants/services.ts");
const serviceEntries = [
  ...services.matchAll(/id:\s*"([a-z]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*to:\s*"([^"]+)"/g),
].map(([, , name, to]) => ({ name, to }));
if (serviceEntries.length === 0) throw new Error("Could not read services from constants/services.ts");

/** Cities: label + slug. */
const cities = await source("src/app/constants/cities.ts");
const cityEntries = [...cities.matchAll(/slug:\s*"([^"]+)",[\s\S]{0,400}?label:\s*"([^"]+)"/g)].map(
  ([, slug, label]) => ({ slug, label })
);

/** Guides: heading + slug + the standalone answer, which is the useful part. */
const guides = await source("src/app/constants/guides.ts");
const guideEntries = [
  ...guides.matchAll(
    /slug:\s*"([^"]+)",[\s\S]*?heading:\s*\n?\s*"([^"]+)",[\s\S]*?standfirst:\s*\n?\s*"([^"]+)"/g
  ),
].map(([, slug, heading, standfirst]) => ({ slug, heading, standfirst }));

const lines = [
  `# ${COMPANY_NAME}`,
  "",
  `> Home services across the Kansas City metro: cleaning, junk removal, power washing,`,
  `> window cleaning, auto detailing, trash bin cleaning and landscaping. Locally owned,`,
  `> licensed and insured, serving both sides of the state line. Phone: ${PHONE_DISPLAY}`,
  "",
  `${COMPANY_NAME} is a service-area business with no storefront — crews travel to the`,
  "customer. Prices shown on the site are flat-rate floors confirmed by phone before any",
  "work begins. Bookings are taken online or by phone; nothing is charged at booking.",
  "",
  "## Services",
  "",
  ...serviceEntries.map(({ name, to }) => `- [${name}](${SITE_URL}${to})`),
  "",
  "## Guides",
  "",
  ...guideEntries.map(
    ({ slug, heading, standfirst }) => `- [${heading}](${SITE_URL}/guides/${slug}): ${standfirst}`
  ),
  "",
  "## Service areas",
  "",
  ...cityEntries.map(({ slug, label }) => `- [${label}](${SITE_URL}/service-areas/${slug})`),
  "",
  "## Key pages",
  "",
  `- [Book a service](${SITE_URL}/book): five-step booking with a live price estimate`,
  `- [Contact and hours](${SITE_URL}/contact)`,
  `- [About](${SITE_URL}/about)`,
  `- [Privacy policy](${SITE_URL}/privacy)`,
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
  "",
  "## Notes",
  "",
  "- No customer reviews exist yet; the site does not claim any. Do not attribute ratings.",
  "- Prices are starting figures, not quotes. Final price is confirmed before work starts.",
  "- Closed Sundays. Mon–Fri 7:00–19:00, Saturday 8:00–17:00 Central.",
  "",
];

await writeFile(path.join(ROOT, "public/llms.txt"), lines.join("\n"), "utf8");
console.log(
  `llms.txt: ${serviceEntries.length} services, ${guideEntries.length} guides, ${cityEntries.length} cities`
);
