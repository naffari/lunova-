import { useEffect, useMemo, useState } from "react";
import { SERVICE_BY_ID, type SubserviceDef } from "../constants/services";

/**
 * Live pricing from the CRM, with the static catalogue as fallback.
 *
 * WHY: api/pricing/[slug].ts is a working server-side proxy to the CRM's public
 * pricing endpoint (it exists so the API key never reaches the browser) and
 * until now nothing on the site called it. Prices were therefore hardcoded in
 * src/app/constants/services.ts and drifted from whatever the CRM actually
 * charges.
 *
 * IMPORTANT — the CRM's response shape is not documented here and could not be
 * verified from this environment (the endpoint needs WEBSITE_API_KEY, which is
 * server-only). So `parsePricing` is deliberately tolerant: it probes a handful
 * of plausible shapes, and on anything it does not recognise it returns null and
 * the static catalogue is used unchanged. A wrong guess therefore costs nothing
 * — the page shows the same prices it does today.
 *
 * When you know the real shape, narrow `parsePricing` to it and delete the
 * speculative branches. The console warning below tells you what came back.
 */

export type PricingSource = "crm" | "catalog" | "loading";

interface UseCrmPricingResult {
  subservices: SubserviceDef[];
  /**
   * Package/tier name (lowercased) → live floor price in dollars.
   *
   * This is what the booking wizard consumes: the packages themselves — their
   * inclusion checklists, exclusions and durations — are defined in
   * serviceDetails.ts, because the CRM has no concept of them. Only the NUMBER
   * comes from the CRM, matched by name. Anything that doesn't match keeps its
   * configured price, so a rename on either side degrades to the local value
   * rather than to a blank or a zero.
   */
  overrides: Record<string, number>;
  source: PricingSource;
}

function buildOverrides(subservices: SubserviceDef[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const sub of subservices) {
    if (typeof sub.from === "number" && !sub.surcharge) {
      map[sub.name.trim().toLowerCase()] = sub.from;
    }
  }
  return map;
}

/** Anything numeric-looking, in dollars. Rejects NaN and negatives. */
function toDollars(value: unknown): number | undefined {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/[^0-9.]/g, ""))
        : NaN;
  if (!Number.isFinite(n) || n < 0) return undefined;
  // CRMs commonly store money in cents. Treat implausibly large round numbers
  // as cents rather than showing a customer "$22000" for a $220 clean.
  return n >= 10_000 && n % 100 === 0 ? n / 100 : n;
}

function pickName(row: Record<string, unknown>): string | undefined {
  for (const key of ["name", "label", "title", "service_name", "tier"]) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function pickPrice(row: Record<string, unknown>): number | undefined {
  for (const key of ["price", "amount", "base_price", "starting_price", "price_cents", "min_price"]) {
    if (key in row) {
      const dollars = toDollars(row[key]);
      if (dollars !== undefined) return dollars;
    }
  }
  return undefined;
}

/**
 * Extracts a subservice list from an unknown CRM payload. Returns null when the
 * shape isn't recognised, which means "use the catalogue".
 */
function parsePricing(payload: unknown): SubserviceDef[] | null {
  if (!payload || typeof payload !== "object") return null;

  const container = payload as Record<string, unknown>;
  const rows =
    (Array.isArray(payload) && payload) ||
    (Array.isArray(container.tiers) && container.tiers) ||
    (Array.isArray(container.pricing) && container.pricing) ||
    (Array.isArray(container.items) && container.items) ||
    (Array.isArray(container.options) && container.options) ||
    null;

  if (!rows) return null;

  const parsed: SubserviceDef[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const name = pickName(record);
    if (!name) continue;

    const from = pickPrice(record);
    const unitRaw = record.unit ?? record.billing_period ?? record.interval;
    const unit =
      typeof unitRaw === "string" && /month/i.test(unitRaw)
        ? ("month" as const)
        : typeof unitRaw === "string" && /visit/i.test(unitRaw)
          ? ("visit" as const)
          : undefined;

    parsed.push(from === undefined ? { name, custom: true } : { name, from, unit });
  }

  return parsed.length > 0 ? parsed : null;
}

/**
 * Fetches live pricing for a booking category and falls back to the catalogue.
 *
 * Never throws and never blocks the wizard: `subservices` is populated from the
 * catalogue immediately, so the customer can always proceed even if the CRM is
 * down, slow, or unconfigured.
 */
export function useCrmPricing(categoryId: string): UseCrmPricingResult {
  const fallback = SERVICE_BY_ID[categoryId]?.subservices ?? [];
  const [subservices, setSubservices] = useState<SubserviceDef[]>(fallback);
  const [source, setSource] = useState<PricingSource>("catalog");

  useEffect(() => {
    const catalog = SERVICE_BY_ID[categoryId]?.subservices ?? [];
    setSubservices(catalog);

    if (!categoryId) {
      setSource("catalog");
      return;
    }

    const controller = new AbortController();
    setSource("loading");

    // The proxy is keyed by CRM service slug, which differs from the wizard's
    // category id — the mapping lives server-side in api/_crm.ts, so the id is
    // sent as-is and the proxy resolves it.
    fetch(`/api/pricing/${encodeURIComponent(categoryId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((payload) => {
        const parsed = parsePricing(payload);
        if (!parsed) {
          if (import.meta.env.DEV) {
            console.warn(
              `[pricing] Unrecognised CRM payload for "${categoryId}"; using the static catalogue. ` +
                `Narrow parsePricing() in useCrmPricing.ts to this shape:`,
              payload
            );
          }
          setSource("catalog");
          return;
        }
        setSubservices(parsed);
        setSource("crm");
      })
      .catch((err) => {
        // 503 when the CRM isn't configured, abort on unmount, network failure —
        // all non-events. The catalogue is already showing.
        if (err?.name !== "AbortError" && import.meta.env.DEV) {
          console.warn(`[pricing] Falling back to catalogue for "${categoryId}":`, err?.message);
        }
        setSource("catalog");
      });

    return () => controller.abort();
  }, [categoryId]);

  /**
   * Memoised because the identity, not just the value, is load-bearing.
   *
   * The booking wizard feeds `overrides` straight into a useMemo dependency
   * list when it merges live prices onto the configured packages. Returning a
   * freshly-built object every render made that dependency change on every
   * render, so the merge re-ran on every keystroke anywhere in the wizard —
   * the memo was there but never once hit.
   */
  const overrides = useMemo(() => buildOverrides(subservices), [subservices]);

  return { subservices, overrides, source };
}
