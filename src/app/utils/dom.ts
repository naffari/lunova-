/**
 * DOM attribute escape hatches for attributes React 18 doesn't map.
 *
 * React 18 does not recognise the camelCase `fetchPriority` prop — it warns and
 * drops it, so `fetchPriority="high"` on the hero images was silently doing
 * nothing at all. React forwards unknown *lowercase* attributes to the DOM
 * verbatim, so the all-lowercase spelling is what actually reaches the browser.
 *
 * React 19 supports `fetchPriority` natively; delete this on that upgrade.
 */
export const HIGH_FETCH_PRIORITY = { fetchpriority: "high" } as { fetchpriority?: string };
