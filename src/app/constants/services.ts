import { Sparkles, Truck, Droplets, AppWindow, Car, Trash2, Leaf, Building2 } from "lucide-react";
import type { ElementType } from "react";
import type { HeroName } from "./seo";

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

/**
 * The eight catalogue ids, as a closed set.
 *
 * These are the values the booking wizard matches on — `?service=power`, not
 * `?service=power-washing`. The two vocabularies look similar enough that four
 * service pages shipped hero CTAs carrying their own URL slug instead, which
 * the wizard silently dropped (see the guard in BookingWizard's deep-link
 * effect): the visitor clicked "Book a Clean" on the power washing page and
 * landed on step 1 with nothing selected.
 *
 * Declaring the union and routing every link through `bookPath` below turns
 * that from a silent runtime no-op into a compile error.
 */
export type ServiceId =
  | "cleaning"
  | "junk"
  | "power"
  | "window"
  | "auto"
  | "bin"
  | "landscaping"
  | "commercial";

export interface ServiceDef {
  id: ServiceId;
  name: string;
  /** Route to the service's own detail page. */
  to: string;
  /**
   * Manifest key of this service's hero photo — no directory, width suffix or
   * extension. Used wherever a page other than the service page itself needs a
   * picture of the work (guide share cards, guide Article schema). The service
   * page passes the same key to `<ServiceHero heroImage>`.
   */
  hero: HeroName;
  icon: ElementType;
  /** Three short scannable capabilities for card display. */
  bullets: string[];
  /** Flagged on the highest-converting service, shown as a "Most booked" badge. */
  popular?: boolean;
  subservices: SubserviceDef[];
  /** IDs of two other services offered as bundle add-ons during booking. */
  upsells: ServiceId[];
}

/**
 * The only way to link into the booking wizard.
 *
 * Never hand-write "/book?service=…" in a component — the id is checked here
 * and nowhere else. `packageId` deep-links to a specific tier, which is what
 * PackageGrid's "Book this" buttons use.
 */
export function bookPath(service: ServiceId, packageId?: string): string {
  return packageId ? `/book?service=${service}&package=${packageId}` : `/book?service=${service}`;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "cleaning",
    name: "Residential Cleaning",
    to: "/services/residential-cleaning",
    /*
      NOT "residential-cleaning-hero". That file is a photograph of someone
      wiping down a CAR INTERIOR — it was shipped as the residential cleaning
      hero with alt text claiming it showed a Kansas City home. Until a real
      interior-cleaning photo exists it points at cleaning-hero, which actually
      shows a cleaner working inside a house. See ATTRIBUTIONS.md.
    */
    hero: "cleaning-hero",
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
    hero: "junk-removal-hero",
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
    hero: "power-washing-hero",
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
    hero: "window-cleaning-hero",
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
    hero: "auto-detailing-hero",
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
    hero: "bin-cleaning-hero",
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
    hero: "landscaping-hero",
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
    hero: "commercial-cleaning-hero",
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
 * Discount for committing to a recurring slot, by frequency.
 *
 * The wizard has always asked "how often?" and then charged the same either
 * way, so the question read as data collection rather than an offer, and the
 * one lever that turns a one-off customer into a route was doing nothing.
 *
 * These are deliberately below the ladder the big maid franchises publish
 * (commonly 20/15/10). Those numbers are funded by route density Lunova does
 * not have yet — a weekly customer is only cheaper to serve once there are
 * several of them on the same street on the same morning. Starting at 15%
 * leaves room to go up as routes fill, which is a much easier conversation
 * than cutting an advertised discount later.
 *
 * Keys must match FREQUENCY_OPTIONS in pages/booking/wizardData.ts.
 */
export const FREQUENCY_DISCOUNT: Record<string, number> = {
  "One-Time": 0,
  Weekly: 0.15,
  "Bi-Weekly": 0.1,
  Monthly: 0.05,
};

/**
 * Ceiling on everything stacked together.
 *
 * A weekly two-service booking would otherwise take 25% off, which is past the
 * point where the job is worth doing at all for a crew that still has to
 * travel to it.
 */
export const MAX_DISCOUNT = 0.2;

/**
 * The combined rate for a booking. Bundle and frequency stack, then cap.
 *
 * Returns a RATE, not an amount, so a caller that needs to show the two
 * components separately still can — see the review step, which itemises them.
 */
export function discountRate(serviceCount: number, frequency: string): number {
  const bundle = serviceCount > 1 ? BUNDLE_DISCOUNT : 0;
  const recurring = FREQUENCY_DISCOUNT[frequency] ?? 0;
  return Math.min(bundle + recurring, MAX_DISCOUNT);
}

/** "15% off" / "" — for labelling a frequency control. */
export function frequencyDiscountLabel(frequency: string): string {
  const rate = FREQUENCY_DISCOUNT[frequency] ?? 0;
  return rate > 0 ? `${Math.round(rate * 100)}% off` : "";
}

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

/**
 * NOTE ON ESTIMATES: a `buildEstimate` used to live here, pricing a booking from
 * flat subservice names. Step 2 of the wizard moved to packages + qualifying
 * questions, so pricing moved with it — `priceDetail` in serviceDetails.ts is
 * the only estimator, and it returns a line-by-line breakdown rather than one
 * number. This file stays the catalogue: names, routes, floors, cross-sells.
 */

export function formatDollars(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
