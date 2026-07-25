/**
 * Central registry of lazy-loaded route modules. `routes.ts` uses these
 * to build `React.lazy()` components; `preloadRoute` reuses the same
 * import functions to warm the dynamic import cache ahead of navigation
 * (e.g. on link hover/focus) so the route feels instant when clicked.
 */
export const routeModules = {
  cleaning: () => import("./pages/Cleaning"),
  residentialCleaning: () => import("./pages/services/ResidentialCleaning"),
  commercialCleaning: () => import("./pages/services/CommercialCleaning"),
  powerWashing: () => import("./pages/services/PowerWashing"),
  windowCleaning: () => import("./pages/services/WindowCleaning"),
  autoDetailing: () => import("./pages/services/AutoDetailing"),
  binCleaning: () => import("./pages/services/BinCleaning"),
  junkRemoval: () => import("./pages/JunkRemoval"),
  landscaping: () => import("./pages/Landscaping"),
  blog: () => import("./pages/Blog"),
  blogPost: () => import("./pages/BlogPost"),
  booking: () => import("./pages/Booking"),
  bookingSuccess: () => import("./pages/BookingSuccess"),
  privacy: () => import("./pages/Privacy"),
  notFound: () => import("./pages/NotFound"),
} as const;

const PATH_TO_MODULE: Record<string, keyof typeof routeModules> = {
  "/cleaning": "cleaning",
  "/services/residential-cleaning": "residentialCleaning",
  "/services/commercial-cleaning": "commercialCleaning",
  "/services/power-washing": "powerWashing",
  "/services/window-cleaning": "windowCleaning",
  "/services/auto-detailing": "autoDetailing",
  "/services/bin-cleaning": "binCleaning",
  "/junk-removal": "junkRemoval",
  "/landscaping": "landscaping",
  "/blog": "blog",
  "/book": "booking",
  "/privacy": "privacy",
};

/** Warm the dynamic import cache for a route so navigation feels instant. */
export function preloadRoute(path: string) {
  const moduleKey = PATH_TO_MODULE[path];
  if (moduleKey) routeModules[moduleKey]();
}
