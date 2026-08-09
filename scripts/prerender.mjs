/**
 * Static prerender step.
 *
 * Runs after the two Vite builds:
 *   1. `vite build`               → dist/           (client bundle + index.html)
 *   2. `vite build --ssr`         → dist-ssr/       (the render() entry)
 *
 * For every route it renders the real page to HTML, injects the markup and the
 * route's head tags into the client's index.html, and writes
 * dist/<route>/index.html. The client bundle still hydrates on load, so the app
 * behaves identically once JS arrives — this only means the first paint and
 * every crawler get real content and real metadata.
 *
 * Run:  pnpm build
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");

const ROOT_DIV = '<div id="root"></div>';
const TEMPLATE_CACHE = path.join(ROOT, "dist-ssr", "client-template.html");

/**
 * Load the pristine client shell.
 *
 * The homepage is written to dist/index.html, which is also the template — so a
 * second run would otherwise read its own prerendered output and produce
 * doubly-nested markup. The untouched shell is cached on first run so this step
 * is safely re-runnable without a full client rebuild.
 */
async function loadTemplate() {
  const fresh = await readFile(path.join(DIST, "index.html"), "utf8");
  if (fresh.includes(ROOT_DIV)) {
    await mkdir(path.dirname(TEMPLATE_CACHE), { recursive: true });
    await writeFile(TEMPLATE_CACHE, fresh, "utf8");
    return fresh;
  }

  const cached = await readFile(TEMPLATE_CACHE, "utf8").catch(() => null);
  if (cached?.includes(ROOT_DIV)) {
    console.log("dist/index.html is already prerendered — using the cached client shell.\n");
    return cached;
  }

  throw new Error(
    `Could not find ${ROOT_DIV} in dist/index.html and no usable cached shell. Run \`pnpm build:client\` first.`
  );
}

const template = await loadTemplate();
const { render, listPrerenderPaths } = await import(pathToFileURL(SSR_ENTRY).href);

/**
 * Drop the shell's generic <title>, description and robots tags.
 *
 * index.html carries site-wide defaults so that client-rendered routes (and the
 * pre-hydration flash) are not blank. Once a route's real tags are injected,
 * those defaults become duplicates — and a crawler honours the FIRST <title> it
 * meets, so leaving them in means every prerendered page reports the generic
 * homepage title. They are stripped per-page, not from index.html itself, which
 * still needs them as the fallback for non-prerendered routes.
 */
function stripDefaultMeta(html) {
  return html
    .replace(/\n?\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\n?\s*<meta\s+name="description"[^>]*>/, "")
    .replace(/\n?\s*<meta\s+name="robots"[^>]*>/, "");
}

const paths = await listPrerenderPaths();
let written = 0;

for (const route of paths) {
  const { html, head } = await render(route);

  const page = stripDefaultMeta(template)
    // Route-specific <head> tags from react-helmet-async, injected ahead of </head>.
    .replace("</head>", `  ${head}\n  </head>`)
    .replace(ROOT_DIV, `<div id="root">${html}</div>`);

  // "/" → dist/index.html; "/book/success" → dist/book/success/index.html
  const outFile =
    route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, page, "utf8");
  written += 1;

  const size = (Buffer.byteLength(page) / 1024).toFixed(0);
  console.log(`  ${route.padEnd(42)} ${size.padStart(4)} KB`);
}

/**
 * dist/404.html, served by Vercel with a real 404 status.
 *
 * The site used to rewrite every unmatched path to index.html, which meant a
 * bad URL rendered the NotFound page with HTTP 200. Google reads that as a soft
 * 404 and can keep the URL indexed. It matters more now than it used to:
 * /service-areas/:city is a pattern, so any mistyped city slug is an unmatched
 * path, and there are twelve real ones people can get wrong.
 *
 * Every real route is prerendered to its own file, so Vercel resolves those
 * from the filesystem first and only falls through to this for genuine misses.
 * Rendered from "/__not-found" rather than "*" so react-router matches the
 * catch-all rather than a literal path.
 */
const notFound = await render("/__not-found");
await writeFile(
  path.join(DIST, "404.html"),
  stripDefaultMeta(template)
    .replace("</head>", `  ${notFound.head}\n  </head>`)
    .replace(ROOT_DIV, `<div id="root">${notFound.html}</div>`),
  "utf8"
);
console.log(`  ${"404.html".padEnd(42)} ${(Buffer.byteLength(notFound.html) / 1024).toFixed(0).padStart(4)} KB`);

console.log(`\nPrerendered ${written} routes to static HTML, plus 404.html.`);
