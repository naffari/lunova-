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
  /**
   * Whether this service can actually be delivered today.
   *
   * Lunova is two people with a cleaning kit, an extractor and a polisher. It
   * can sell residential cleaning and mobile detailing. It cannot sell power
   * washing (no machine, no experience), junk removal (no disposal account),
   * landscaping (push mower only), window cleaning, or a commercial janitorial
   * contract — and a booking it cannot service costs a referral, not just a job.
   *
   * Inactive services are NOT deleted. Their pages, city copy and guides stay
   * indexed and reachable, because rebuilding that ranking later costs months.
   * What changes is that they leave the navigation, the homepage grid and every
   * cross-sell, and their page CTA becomes a waitlist capture instead of a
   * booking link. Flip one flag to bring a line back everywhere at once.
   */
  active: boolean;
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

/**
 * Where a service page's call-to-action should point.
 *
 * Active services go to the wizard. Parked ones go to the waitlist section on
 * their own page, because the alternative — a booking button for work that
 * cannot be done — costs the referral as well as the job.
 *
 * Every CTA on a service page routes through this rather than calling
 * `bookPath` directly, so parking a line cannot leave a live booking button
 * behind on the one page most likely to be found by someone searching for it.
 */
export function serviceCtaPath(service: ServiceId, packageId?: string): string {
  return isActive(service) ? bookPath(service, packageId) : "#waitlist";
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
    /*
      Repriced August 2026 against the Kansas City market, which bills a
      two-person team at $70–120/hour — $35–60 per person-hour. The old floors
      were set before anyone had costed a job: $120 for a 3-bed/2-bath standard
      clean is five person-hours of work, or about $24 an hour for two people
      before supplies and fuel. These land at roughly $35, the bottom of the
      local range, which is where a company with no reviews belongs.
    */
    subservices: [
      { name: "Standard Clean", from: 175 },
      { name: "Deep Clean", from: 280 },
      { name: "Move-In / Move-Out", from: 350 },
      { name: "Airbnb Turnover", from: 120 },
    ],
    upsells: ["auto"],
    active: true,
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
    upsells: ["cleaning", "auto"],
    active: false,
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
    upsells: ["cleaning", "auto"],
    active: false,
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
    upsells: ["cleaning", "auto"],
    active: false,
  },
  {
    id: "auto",
    name: "Auto Detailing",
    to: "/services/auto-detailing",
    hero: "auto-detailing-hero",
    icon: Car,
    bullets: ["Express wash", "Interior detail", "Full detail"],
    /*
      These names now match the package ids in serviceDetails.ts. They did not
      before — the catalogue advertised "Interior Only / Exterior Only / Full
      Detail" while the wizard sold "Express Wash / Interior Detail / Full
      Detail", so the price a visitor read on a card was not the tier they
      landed on.

      Repriced against the Kansas City mobile market, where the cheapest
      comparable interior detail is around $210 and full details run $280–330.
      The old $69/$89/$149 sat at roughly a third of that, which is not a
      competitive position — it is a company that has not worked out what its
      own time is worth. These undercut every local rival and still clear about
      $60 a person-hour.
    */
    subservices: [
      { name: "Express Wash", from: 119 },
      { name: "Interior Detail", from: 199 },
      { name: "Full Detail (In & Out)", from: 269 },
    ],
    upsells: ["cleaning"],
    active: true,
  },
  {
    id: "bin",
    name: "Bin Cleaning",
    to: "/services/bin-cleaning",
    hero: "bin-cleaning-hero",
    icon: Trash2,
    bullets: ["One-time 2-bin clean", "Recurring monthly plan", "Recurring bi-weekly plan"],
    /*
      Bin cleaning is inactive AS A STANDALONE SERVICE and sold as an add-on
      instead — see BIN_ADDON below and the `bin` entry in each active service's
      add-on list in serviceDetails.ts.

      The reason is route density. A subscription bin round is structurally a
      collection business: the rig is a fixed cost and the only variable that
      matters is stops per mile, so it needs a few hundred subscribers on tight
      routes before it clears its own equipment. Sold as a $29 attach on a job
      you are already parked at, the drive is already paid for by the cleaning
      or the detail, and the same fifteen minutes earns about $60 an hour.
    */
    subservices: [
      { name: "One-Time 2-Bin Clean", from: 25 },
      { name: "Recurring Monthly Plan", from: 15, unit: "month" },
      { name: "Recurring Bi-Weekly Plan", from: 22, unit: "month" },
    ],
    upsells: ["cleaning", "auto"],
    active: false,
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
    upsells: ["cleaning", "auto"],
    active: false,
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
    upsells: ["cleaning", "auto"],
    active: false,
  },
];

/**
 * The services Lunova can actually deliver today.
 *
 * This is what the navigation, the homepage grid, the booking wizard and every
 * cross-sell read from. `SERVICES` remains the full catalogue so the parked
 * pages can still render themselves — they just cannot be reached by browsing
 * or booked.
 */
export const ACTIVE_SERVICES: ServiceDef[] = SERVICES.filter((s) => s.active);

/** Whether a service can be booked, by id. Unknown ids are not bookable. */
export function isActive(id: string): boolean {
  return SERVICE_BY_ID[id]?.active ?? false;
}

/**
 * Bin cleaning, sold as an attach rather than a service.
 *
 * Offered on every active service's add-on list. The price assumes the crew is
 * already on site for a clean or a detail — it is not a standalone rate, and it
 * should not be quoted as one over the phone without adding travel.
 */
export const BIN_ADDON = {
  id: "bin",
  name: "Trash bin cleaning",
  /** Two bins, washed and deodorised while we are already at the property. */
  price: 29,
  /** Each bin past the first two. */
  perExtraBin: 10,
  note: "Two bins washed out and deodorised while we're already there. $10 for each extra bin.",
} as const;

/**
 * Smallest job worth loading the truck for, in whole dollars.
 *
 * Travel is the hidden cost in every mobile trade: a 20-minute drive each way
 * is most of an hour of committed time before anyone has picked up a cloth. A
 * job under this figure is a job that pays less per hour than the one it
 * displaced, so the wizard surfaces the shortfall rather than quietly booking
 * it.
 */
export const MINIMUM_CHARGE = 100;

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
 * several of them on the same street on the same morning.
 *
 * Cut again in August 2026, from 15/10/5, once the jobs were costed properly.
 * A weekly standard clean is five person-hours; at 15% off the repriced $175
 * that is about $30 an hour for two people, which made the best customer in the
 * book the worst-paying work in it. At 10/5/0 the recurring slot is still worth
 * choosing and the rate survives. Raising a discount as routes fill is an easy
 * conversation; cutting one you already advertised is not.
 *
 * Keys must match FREQUENCY_OPTIONS in pages/booking/wizardData.ts.
 */
export const FREQUENCY_DISCOUNT: Record<string, number> = {
  "One-Time": 0,
  Weekly: 0.1,
  "Bi-Weekly": 0.05,
  Monthly: 0,
};

/**
 * Ceiling on everything stacked together.
 *
 * A weekly two-service booking would otherwise stack bundle on top of
 * frequency, which is past the point where the job is worth doing at all for a
 * crew that still has to travel to it. Lowered with the ladder above.
 */
export const MAX_DISCOUNT = 0.15;

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
