import type { VercelRequest, VercelResponse } from "@vercel/node";
// NOTE: the .js extension is required — these compile to ESM and Node will not
// resolve an extensionless relative specifier at runtime. See 3582b30.
import { getPricing, isCrmConfigured, resolveServiceSlug } from "../_crm.js";

/**
 * Read-only proxy for the CRM's public pricing endpoint. Exists so the
 * browser never sees the API key; the CRM's own cache headers are mirrored.
 *
 * Accepts EITHER a booking-wizard category id ("cleaning", "power") or a raw CRM
 * service slug ("residential-cleaning"). The wizard sends its own category ids,
 * because the id→slug mapping lives in _crm.ts and must stay server-side with
 * the rest of the CRM contract. A value that isn't a known category is passed
 * through untouched, so a slug still works.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!isCrmConfigured()) {
    return res.status(503).json({ error: "Pricing service is not configured." });
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;
  if (!slug) {
    return res.status(400).json({ error: "Missing service slug." });
  }

  // "One-Time" is the wizard's default frequency; it only affects landscaping,
  // which the CRM splits into one-time and recurring services.
  const resolved = resolveServiceSlug(slug, "One-Time") ?? slug;

  try {
    const { status, body } = await getPricing(resolved);
    if (status === 200) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }
    return res.status(status).json(body);
  } catch (err) {
    console.error("Pricing lookup failed:", err);
    return res.status(502).json({ error: "Pricing service is unavailable." });
  }
}
