/**
 * Server-side client for the Lunova CRM public API.
 *
 * The API key is a full lead-intake credential — it must never reach the
 * browser bundle. Everything in this file runs only inside Vercel functions.
 */

const CRM_BASE_URL = (process.env.CRM_API_URL || "https://crm.lunovaservices.com").replace(/\/$/, "");

/**
 * Booking-wizard category id -> CRM service slug, for the categories that map
 * one-to-one. The CRM rejects a `service_slug` that doesn't match an active
 * service with a 400, so `createLead` retries without the slug rather than
 * losing the lead. All eight slugs below are verified against production.
 *
 * `landscaping` is absent on purpose — see `resolveServiceSlug`. The CRM's
 * `hardscape-demolition-adjacent` service has no wizard category and stays
 * unmapped.
 *
 * Every mapping is kept, including the ones for services the website has
 * parked (see the `active` flag in src/app/constants/services.ts). The site no
 * longer offers those, but the CRM still has the services configured, and a
 * lead can reach this endpoint by other routes — a phone call typed in by hand,
 * a stale link, a job taken as a favour. Deleting a mapping would not prevent
 * any of that; it would only mean the lead arrives unclassified.
 */
const SERVICE_SLUG_MAP: Record<string, string> = {
  cleaning: "residential-cleaning",
  junk: "junk-removal",
  power: "power-washing",
  window: "window-cleaning",
  auto: "auto-detailing",
  bin: "bin-cleaning",
  commercial: "commercial-cleaning",
};

/**
 * Resolves the CRM service slug for a booking. Landscaping is split in the CRM
 * into a one-time project service and a recurring maintenance service, which
 * the wizard's frequency answer picks between; every other category ignores
 * frequency. Returns undefined for categories with no CRM service.
 */
export function resolveServiceSlug(category: string, frequency: string): string | undefined {
  if (category === "landscaping") {
    return frequency === "One-Time"
      ? "landscaping-one-time-project"
      : "landscaping-recurring-maintenance";
  }
  return SERVICE_SLUG_MAP[category];
}

export interface CrmAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  gate_code?: string;
  pet_notes?: string;
}

export interface CrmLeadInput {
  name: string;
  phone?: string;
  email?: string;
  address: CrmAddress;
  service_slug?: string;
  message?: string;
  requested_window_start?: string;
  requested_window_end?: string;
  estimated_total?: number;
}

export interface CrmLead {
  id: string;
  status: string;
  created_at: string;
}

export function isCrmConfigured(): boolean {
  return Boolean(process.env.WEBSITE_API_KEY);
}

async function crmFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const apiKey = process.env.WEBSITE_API_KEY;
  if (!apiKey) throw new Error("WEBSITE_API_KEY is not configured.");

  return fetch(`${CRM_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      "X-API-Key": apiKey,
    },
  });
}

/**
 * Wizard cities are stored as either "Overland Park" or "Kansas City, MO".
 * Everything unsuffixed in the service area is Missouri side except the
 * Johnson County, KS suburbs.
 */
const KANSAS_CITIES = new Set([
  "kansas city, ks",
  "overland park",
  "olathe",
  "shawnee",
  "lenexa",
  "leawood",
  "prairie village",
]);

export function splitCityState(rawCity: string): { city: string; state: string } {
  const trimmed = rawCity.trim();
  const suffix = trimmed.match(/,\s*([A-Za-z]{2})$/);
  if (suffix) {
    return { city: trimmed.slice(0, suffix.index).trim(), state: suffix[1].toUpperCase() };
  }
  return { city: trimmed, state: KANSAS_CITIES.has(trimmed.toLowerCase()) ? "KS" : "MO" };
}

/** Normalizes "64111-1234" / "641111234" / "64111" to what the CRM accepts. */
export function normalizeZip(rawZip: string): string | null {
  const digits = (rawZip || "").replace(/\D/g, "");
  if (digits.length === 5 || digits.length === 9) return digits;
  return null;
}

/**
 * The wizard collects a date plus a coarse window ("Morning"), while the CRM
 * wants ISO 8601 with an offset. Kansas City is US Central: -05:00 during DST,
 * -06:00 otherwise.
 */
const TIME_WINDOW_HOURS: Record<string, [number, number]> = {
  Morning: [8, 12],
  Afternoon: [12, 17],
  Evening: [17, 20],
};

function centralOffset(date: string): string {
  // Compare the UTC and Chicago wall clocks for that date to get the offset.
  const noonUtc = new Date(`${date}T12:00:00Z`);
  const chicago = new Date(noonUtc.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const utc = new Date(noonUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const hours = Math.round((utc.getTime() - chicago.getTime()) / 3_600_000);
  return `-0${hours}:00`;
}

export function buildRequestedWindow(
  date: string,
  timeWindow: string
): { start: string; end: string } | null {
  const hours = TIME_WINDOW_HOURS[timeWindow];
  if (!hours || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const offset = centralOffset(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    start: `${date}T${pad(hours[0])}:00:00${offset}`,
    end: `${date}T${pad(hours[1])}:00:00${offset}`,
  };
}

/**
 * Creates the customer + lead in the CRM. Returns the lead on success. On a
 * 400 caused by an unknown `service_slug` it retries once without the slug so
 * a slug-map drift never costs us a lead.
 */
export async function createLead(input: CrmLeadInput): Promise<CrmLead> {
  const post = (body: CrmLeadInput) =>
    crmFetch("/api/public/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  let res = await post(input);

  if (res.status === 400 && input.service_slug) {
    const { service_slug, ...withoutSlug } = input;
    console.warn(`CRM rejected service_slug "${service_slug}"; retrying without it.`);
    res = await post(withoutSlug);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`CRM responded ${res.status}: ${detail.slice(0, 500)}`);
  }

  const data = (await res.json()) as { lead: CrmLead };
  return data.lead;
}

export async function getPricing(serviceSlug: string): Promise<{ status: number; body: unknown }> {
  const res = await crmFetch(`/api/public/pricing/${encodeURIComponent(serviceSlug)}`);
  const body = await res.json().catch(() => ({ error: "Invalid response from pricing service." }));
  return { status: res.status, body };
}
