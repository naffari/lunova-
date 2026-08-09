import { ROUTE_CONFIG } from "./routeConfig";

/**
 * Central registry of route modules. `routes.ts` wraps these in `React.lazy()`
 * for the client; `entry-server.tsx` awaits them directly for prerendering; and
 * `preloadRoute` reuses the same import functions to warm the dynamic import
 * cache ahead of navigation (e.g. on link hover/focus).
 */
export const routeModules = {
  home: () => import("./pages/Home"),
  cleaning: () => import("./pages/Cleaning"),
  residentialCleaning: () => import("./pages/services/ResidentialCleaning"),
  commercialCleaning: () => import("./pages/services/CommercialCleaning"),
  powerWashing: () => import("./pages/services/PowerWashing"),
  windowCleaning: () => import("./pages/services/WindowCleaning"),
  autoDetailing: () => import("./pages/services/AutoDetailing"),
  binCleaning: () => import("./pages/services/BinCleaning"),
  junkRemoval: () => import("./pages/JunkRemoval"),
  landscaping: () => import("./pages/Landscaping"),
  serviceAreas: () => import("./pages/ServiceAreas"),
  serviceAreaCity: () => import("./pages/ServiceAreaCity"),
  guides: () => import("./pages/Guides"),
  guide: () => import("./pages/Guide"),
  about: () => import("./pages/About"),
  contact: () => import("./pages/Contact"),
  booking: () => import("./pages/Booking"),
  privacy: () => import("./pages/Privacy"),
  notFound: () => import("./pages/NotFound"),
} as const;

export type RouteModuleKey = keyof typeof routeModules;

/**
 * Path → module lookup, derived from ROUTE_CONFIG rather than hand-maintained.
 * Patterned and catch-all routes are excluded: there is nothing to preload for
 * a path the user has not resolved yet.
 */
const PATH_TO_MODULE: Record<string, RouteModuleKey> = Object.fromEntries(
  ROUTE_CONFIG.filter((r) => !r.path.includes(":") && r.path !== "*").map((r) => [
    r.path,
    r.module as RouteModuleKey,
  ])
);

/**
 * Patterned routes, matched by prefix rather than exact path.
 *
 * `/service-areas/overland-park` is not a key in PATH_TO_MODULE, since the
 * route is declared as `:city`. Every city page is the same module, so a prefix
 * match preloads the right chunk. Without this, the twelve most-linked pages on
 * the site would be the only ones that do not warm on hover.
 */
const PREFIX_TO_MODULE: [string, RouteModuleKey][] = [
  ["/service-areas/", "serviceAreaCity"],
  ["/guides/", "guide"],
];

/** Warm the dynamic import cache for a route so navigation feels instant. */
export function preloadRoute(path: string) {
  const moduleKey =
    PATH_TO_MODULE[path] ?? PREFIX_TO_MODULE.find(([prefix]) => path.startsWith(prefix))?.[1];
  if (moduleKey) routeModules[moduleKey]();
}
