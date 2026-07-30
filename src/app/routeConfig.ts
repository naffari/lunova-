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
  { path: "/blog", module: "blog", prerender: true },
  { path: "/blog/:slug", module: "blogPost", prerender: false },
  { path: "/book", module: "booking", prerender: true },
  { path: "/book/success", module: "bookingSuccess", prerender: true },
  { path: "/privacy", module: "privacy", prerender: true },
  { path: "*", module: "notFound", prerender: false },
];

/** Static paths only — no patterns, no catch-all. */
export const STATIC_ROUTE_PATHS = ROUTE_CONFIG.filter((r) => r.prerender).map((r) => r.path);
