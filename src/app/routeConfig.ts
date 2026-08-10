/**
 * The route table, as data.
 *
 * Declared once here so the three things that need it cannot drift:
 *   - routes.ts        builds the client router with React.lazy
 *   - entry-server.tsx builds an eager table for prerendering
 *   - routeModules.ts  derives the hover-preload path lookup
 *
 * Adding a page means adding one entry here and one import in routeModules.ts.
 */

export interface RouteConfigEntry {
  /** react-router path pattern. */
  path: string;
  /** Key into `routeModules`. */
  module: string;
  /**
   * Whether this route is prerendered to static HTML at build time.
   * Dynamic patterns (`:slug`) and the catch-all are expanded separately.
   */
  prerender: boolean;
  /**
   * What the navbar floats over on THIS route, before any scrolling.
   *
   * "dark" (the default) means the page opens on a dark photo hero or the
   * chrome-toned PageHero band, so the bar stays transparent with a white mark
   * and white links. "light" means the page opens on the cream ground, where
   * that treatment produces a grey scrim, an invisible logo and links at ~2:1
   * contrast — those routes get the inverted palette instead.
   *
   * Declared here rather than sniffed at runtime so it is server-rendered
   * correctly: the prerendered HTML carries the right colours on first paint
   * instead of flashing the wrong ones until hydration.
   */
  chrome?: "dark" | "light";
}

export const ROUTE_CONFIG: RouteConfigEntry[] = [
  { path: "/", module: "home", prerender: true },
  { path: "/cleaning", module: "cleaning", prerender: true },
  { path: "/services/residential-cleaning", module: "residentialCleaning", prerender: true },
  { path: "/services/commercial-cleaning", module: "commercialCleaning", prerender: true },
  { path: "/services/power-washing", module: "powerWashing", prerender: true },
  { path: "/services/window-cleaning", module: "windowCleaning", prerender: true },
  { path: "/services/auto-detailing", module: "autoDetailing", prerender: true },
  { path: "/services/bin-cleaning", module: "binCleaning", prerender: true },
  { path: "/junk-removal", module: "junkRemoval", prerender: true },
  { path: "/landscaping", module: "landscaping", prerender: true },
  { path: "/service-areas", module: "serviceAreas", prerender: true },
  // One route, twelve prerendered URLs. `prerender: false` here means "not a
  // static path". expandPrerenderPaths() below turns it into a real page per
  // city from CITY_SLUGS, so adding a city needs no change in this file.
  { path: "/service-areas/:city", module: "serviceAreaCity", prerender: false },
  { path: "/guides", module: "guides", prerender: true },
  // Same shape as the city route below: one pattern, one prerendered URL per
  // guide, expanded by expandPrerenderPaths from GUIDE_SLUGS.
  { path: "/guides/:slug", module: "guide", prerender: false },
  { path: "/about", module: "about", prerender: true },
  { path: "/contact", module: "contact", prerender: true },
  { path: "/book", module: "booking", prerender: true, chrome: "light" },
  // No /book/success. The wizard renders its confirmation in place off
  // `state.submitted`, so a separate route was only ever reachable by typing the
  // URL — where it rendered an empty shell, having no navigation state to read.
  { path: "/privacy", module: "privacy", prerender: true, chrome: "light" },
  { path: "*", module: "notFound", prerender: false },
];

/** Static paths only — no patterns, no catch-all. */
export const STATIC_ROUTE_PATHS = ROUTE_CONFIG.filter((r) => r.prerender).map((r) => r.path);

/**
 * Every URL to emit as static HTML: the flat routes above, plus one page per
 * service-area city.
 *
 * The city pages are the on-page half of local SEO for a business with no
 * storefront, so they must exist as real HTML. A crawler that has to run
 * JavaScript to see `/service-areas/overland-park` is a crawler that may never
 * index it. `entry-server.tsx` and `scripts/generate-sitemap.mjs` both build
 * from this, so the sitemap can never advertise a page the prerenderer skipped.
 */
export function expandPrerenderPaths(citySlugs: string[], guideSlugs: string[] = []): string[] {
  return [
    ...STATIC_ROUTE_PATHS,
    ...citySlugs.map((slug) => `/service-areas/${slug}`),
    ...guideSlugs.map((slug) => `/guides/${slug}`),
  ];
}

/**
 * Routes whose first section is the cream ground rather than a dark hero.
 *
 * Every path here is static, so a Set lookup is the whole matcher — no
 * `matchPath` needed. If a patterned route ever opens on cream, this becomes a
 * real match and the lookup below has to grow with it.
 */
const LIGHT_CHROME_PATHS = new Set(
  ROUTE_CONFIG.filter((route) => route.chrome === "light").map((route) => route.path)
);

/** Which chrome palette the navbar should wear on `pathname`. */
export function chromeToneFor(pathname: string): "dark" | "light" {
  const normalised = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return LIGHT_CHROME_PATHS.has(normalised) ? "light" : "dark";
}
