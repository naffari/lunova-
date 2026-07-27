import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPricing, isCrmConfigured } from "../_crm.js";

/**
 * Read-only proxy for the CRM's public pricing endpoint. Exists so the
 * browser never sees the API key; the CRM's own cache headers are mirrored.
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

  try {
    const { status, body } = await getPricing(slug);
    if (status === 200) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }
    return res.status(status).json(body);
  } catch (err) {
    console.error("Pricing lookup failed:", err);
    return res.status(502).json({ error: "Pricing service is unavailable." });
  }
}
