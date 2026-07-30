import { Sparkles, Truck, Droplets, AppWindow, Car, Trash2, Leaf, Building2 } from "lucide-react";
import type { ElementType } from "react";

/**
 * THE service catalogue. Single source of truth for service names, routes,
 * bullets, cross-sells, and — critically — prices.
 *
 * Prices were previously declared in three places that had already drifted:
 * the homepage cards said cleaning started at $120, the booking wizard said
 * $120, and the residential cleaning page said $130. The wizard's numbers are
 * treated as authoritative here, because that is the figure a customer sees
 * immediately before committing.
 *
 * Prices are NUMBERS, not display strings. That is what makes a running
 * estimate possible in the booking wizard. Format them at the edge with
 * `formatPrice` / `startingAtLabel` — never hand-write "$120" in a component.
 *
 * There are deliberately no upper bounds. Inventing a "$220–$320" range we
 * cannot stand behind is worse than quoting a floor and confirming on site.
 */

export interface SubserviceDef {
  name: string;
  /** Floor price in whole dollars. Omitted only when `custom` is true. */
  from?: number;
  /** Billing unit. "visit" is the default and renders bare. */
  unit?: "visit" | "month";
  /** Genuinely cannot be priced without seeing the property. */
  custom?: boolean;
  /** A flat add-on charge rather than a base price — renders as "+$60". */
  surcharge?: boolean;
}

export interface ServiceDef {
  id: string;
  name: string;
  /** Route to the service's own detail page. */
  to: string;
  icon: ElementType;
  /** Three short scannable capabilities for card display. */
  bullets: string[];
  /** Flagged on the highest-converting service, shown as a "Most booked" badge. */
  popular?: boolean;
  subservices: SubserviceDef[];
  /** IDs of two other services offered as bundle add-ons during booking. */
  upsells: string[];
}

export const SERVICES: ServiceDef[] = [
  {
    id: "cleaning",
    name: "Residential Cleaning",
    to: "/services/residential-cleaning",
    icon: Sparkles,
    bullets: ["Standard clean", "Deep clean", "Move-in / move-out"],
    popular: true,
    subservices: [
      { name: "Standard Clean", from: 120 },
      { name: "Deep Clean", from: 220 },
      { name: "Move-In / Move-Out", from: 260 },
      { name: "Airbnb Turnover", from: 90 },
    ],
    upsells: ["window", "bin"],
  },
  {
    id: "junk",
    name: "Junk Removal",
    to: "/junk-removal",
    icon: Truck,
    bullets: ["Single item", "Partial truckload", "Full truckload"],
    subservices: [
      { name: "Single Item", from: 75 },
      { name: "Partial Truckload", from: 175 },
      { name: "Full Truckload", from: 395 },
    ],
    upsells: ["power", "landscaping"],
  },
  {
    id: "power",
    name: "Power Washing",
    to: "/services/power-washing",
    icon: Droplets,
    bullets: ["Siding", "Driveway", "Deck / patio"],
    subservices: [
      { name: "Siding", from: 180 },
      { name: "Driveway", from: 120 },
      { name: "Deck / Patio", from: 150 },
    ],
    upsells: ["window", "bin"],
  },
  {
    id: "window",
    name: "Window Cleaning",
    to: "/services/window-cleaning",
    icon: AppWindow,
    bullets: ["Interior & exterior", "Exterior only", "Hard water treatment"],
    subservices: [
      { name: "Interior & Exterior", from: 180 },
      { name: "Exterior Only", from: 110 },
      { name: "Hard Water Treatment", from: 60, surcharge: true },
    ],
    upsells: ["cleaning", "power"],
  },
  {
    id: "auto",
    name: "Auto Detailing",
    to: "/services/auto-detailing",
    icon: Car,
    bullets: ["Interior only", "Exterior only", "Full detail"],
    subservices: [
      { name: "Interior Only", from: 89 },
      { name: "Exterior Only", from: 69 },
      { name: "Full Detail (In & Out)", from: 149 },
    ],
    upsells: ["bin", "cleaning"],
  },
  {
    id: "bin",
    name: "Bin Cleaning",
    to: "/services/bin-cleaning",
    icon: Trash2,
    bullets: ["One-time 2-bin clean", "Recurring monthly plan", "Recurring bi-weekly plan"],
    subservices: [
      { name: "One-Time 2-Bin Clean", from: 25 },
      { name: "Recurring Monthly Plan", from: 15, unit: "month" },
      { name: "Recurring Bi-Weekly Plan", from: 22, unit: "month" },
    ],
    upsells: ["landscaping", "cleaning"],
  },
  {
    id: "landscaping",
    name: "Landscaping",
    to: "/landscaping",
    icon: Leaf,
    bullets: ["One-time clean-up", "Recurring lawn care", "Seasonal package"],
    subservices: [
      { name: "One-Time Clean-Up", from: 150 },
      { name: "Recurring Lawn Care", from: 45, unit: "visit" },
      { name: "Seasonal Package", custom: true },
    ],
    upsells: ["power", "bin"],
  },
  {
    id: "commercial",
    name: "Commercial Cleaning",
    to: "/services/commercial-cleaning",
    icon: Building2,
    bullets: ["Offices", "Restaurants", "Dealerships"],
    subservices: [
      { name: "Office Cleaning", custom: true },
      { name: "Restaurant Cleaning", custom: true },
      { name: "Dealership Cleaning", custom: true },
    ],
    upsells: ["window", "power"],
  },
];

export const SERVICE_BY_ID: Record<string, ServiceDef> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s])
);

export const SERVICE_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.name])
);

/** Discount applied when a booking includes more than one service. */
export const BUNDLE_DISCOUNT = 0.1;

/**
 * Price of a single subservice, as display text.
 * "$120" · "$15/mo" · "$45/visit" · "+$60" · "Custom quote"
 */
export function formatPrice(sub: SubserviceDef): string {
  if (sub.custom || sub.from === undefined) return "Custom quote";
  const amount = `$${sub.from}`;
  if (sub.surcharge) return `+${amount}`;
  if (sub.unit === "month") return `${amount}/mo`;
  if (sub.unit === "visit") return `${amount}/visit`;
  return amount;
}

/** The cheapest real entry point into a service, ignoring surcharges. */
export function cheapestSubservice(service: ServiceDef): SubserviceDef | undefined {
  const priced = service.subservices.filter((s) => !s.custom && !s.surcharge && s.from !== undefined);
  if (priced.length === 0) return undefined;
  return priced.reduce((min, s) => (s.from! < min.from! ? s : min));
}

/** Card/hero label: "From $120", "From $15/mo", or "Custom quote". */
export function startingAtLabel(service: ServiceDef): string {
  const cheapest = cheapestSubservice(service);
  if (!cheapest) return "Custom quote";
  return `From ${formatPrice(cheapest)}`;
}

export interface EstimateInput {
  /** Subservice display names the customer selected, within one service. */
  serviceId: string;
  selected: string[];
  /** Service IDs added as bundle extras. */
  addonIds: string[];
}

export interface Estimate {
  /** Floor total in dollars, before discount. */
  subtotal: number;
  /** Dollars removed by the multi-service bundle discount. */
  discount: number;
  /** What the customer should expect as a starting figure. */
  total: number;
  /** True when any selected line cannot be priced without a site visit. */
  hasCustom: boolean;
  /** True when at least one recurring plan is in the selection. */
  hasRecurring: boolean;
  /** Number of distinct services in the booking, including add-ons. */
  serviceCount: number;
}

/**
 * Builds the running estimate shown in the booking wizard.
 *
 * Every figure is a FLOOR, not a quote: add-on services contribute their
 * cheapest entry price because the customer has not chosen a tier for them
 * yet. `hasCustom` exists so the UI can say "plus site-visit pricing" rather
 * than silently under-quoting a job we cannot price yet.
 */
export function buildEstimate({ serviceId, selected, addonIds }: EstimateInput): Estimate {
  const service = SERVICE_BY_ID[serviceId];
  let subtotal = 0;
  let hasCustom = false;
  let hasRecurring = false;

  if (service) {
    for (const sub of service.subservices) {
      if (!selected.includes(sub.name)) continue;
      if (sub.custom || sub.from === undefined) {
        hasCustom = true;
        continue;
      }
      if (sub.unit === "month") hasRecurring = true;
      subtotal += sub.from;
    }
  }

  for (const id of addonIds) {
    const addon = SERVICE_BY_ID[id];
    if (!addon) continue;
    const cheapest = cheapestSubservice(addon);
    if (!cheapest) {
      hasCustom = true;
      continue;
    }
    if (cheapest.unit === "month") hasRecurring = true;
    subtotal += cheapest.from!;
  }

  const serviceCount = (service ? 1 : 0) + addonIds.length;
  const discount = serviceCount > 1 ? Math.round(subtotal * BUNDLE_DISCOUNT) : 0;

  return { subtotal, discount, total: subtotal - discount, hasCustom, hasRecurring, serviceCount };
}

export function formatDollars(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
