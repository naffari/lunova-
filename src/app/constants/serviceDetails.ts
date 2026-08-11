/**
 * Per-service booking detail: packages, qualifying questions, and add-ons.
 *
 * WHY THIS EXISTS: step 2 of the wizard used to be one flat checkbox list of
 * "name — price" for all eight services. Picking "Deep Clean — from $220" told
 * the customer nothing about what they were buying, and told the crew nothing
 * about what they were walking into. Both problems are the same problem: the
 * booking form had no idea what service it was booking.
 *
 * Three things every service now declares:
 *
 *   packages   Mutually exclusive tiers. Each carries an `includes` checklist —
 *              the literal answer to "what am I paying for" — and an `excludes`
 *              list, because unstated exclusions are where disputes come from.
 *
 *   questions  The handful of facts that genuinely change the price. These exist
 *              to stop under-quoting: a 5-bed house is not a 2-bed house, and a
 *              lawn nobody has cut in six weeks is not a weekly mow. Every delta
 *              is additive and visible to the customer as they pick.
 *
 *   addOns     Extras within the service (inside the oven, engine bay, gutters).
 *              Distinct from the cross-sell bundles in services.ts, which add a
 *              whole other department to the visit.
 *
 * PRICING HONESTY: every number is a FLOOR, and the wizard says so. Deltas are
 * deliberately conservative — quoting low and correcting upward on the phone
 * costs more trust than quoting fairly up front. Durations are there to set
 * expectations, not to promise.
 */

export interface PackageDef {
  id: string;
  name: string;
  /** One line on who this tier is for. */
  tagline: string;
  /** Floor price in whole dollars. Omit when `custom`. */
  from?: number;
  unit?: "visit" | "month";
  /** Needs a site visit before it can be priced. */
  custom?: boolean;
  popular?: boolean;
  /** Rough on-site time, so nobody expects a 6-hour deep clean in 90 minutes. */
  duration?: string;
  /** Everything included. This is the checklist the customer asked for. */
  includes: string[];
  /** Deliberately not included. Prevents scope disputes on the day. */
  excludes?: string[];
}

export interface QuestionOption {
  value: string;
  label: string;
  /** Dollars added to the package floor when chosen. */
  delta?: number;
  /** Needs a site visit — suppresses the numeric estimate. */
  custom?: boolean;
}

export type QuestionDef =
  | {
      id: string;
      kind: "choice";
      label: string;
      help?: string;
      options: QuestionOption[];
    }
  | {
      id: string;
      kind: "counter";
      label: string;
      help?: string;
      min: number;
      max: number;
      default: number;
      /** This many are covered by the base price. */
      includedUpTo: number;
      /** Dollars per unit beyond `includedUpTo`. Ignored when `percentOfBase` is set. */
      pricePerUnit: number;
      /**
       * Charge each extra unit as a share of the chosen package instead of a
       * flat fee, expressed 0–1.
       *
       * Exists for one case: a second car on the same driveway. A flat
       * per-vehicle figure cannot work when the packages run $119 to $269 —
       * it would either give away a full detail or overcharge for an express
       * wash. Setting this to 0.8 means the second car is the same package at
       * 20% off, which is roughly what the Kansas City market discounts a
       * multi-vehicle booking by, and it is honest money: the drive, the
       * setup and the pack-down are already paid for by the first car.
       */
      percentOfBase?: number;
      /** Singular noun for the summary line, e.g. "bedroom". */
      noun: string;
    };

export interface AddOnDef {
  id: string;
  name: string;
  price: number;
  /** Shown under the name — say what it actually covers. */
  note?: string;
}

export interface ServiceDetail {
  /** Heading + blurb for step 2, written for this service specifically. */
  heading: string;
  blurb: string;
  /** Label above the package list. */
  packageLabel: string;
  packages: PackageDef[];
  questions: QuestionDef[];
  addOns: AddOnDef[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  // ─────────────────────────────────────────────────────────────────────
  cleaning: {
    heading: "Which clean do you need?",
    blurb:
      "Every tier lists exactly what's covered. If it isn't on the list, it isn't in the price. Add it below or tell us in the notes.",
    packageLabel: "Choose your clean",
    packages: [
      {
        id: "standard",
        name: "Standard Clean",
        tagline: "Upkeep for a home that's already in decent shape.",
        from: 175,
        duration: "2–3 hours",
        includes: [
          "Kitchen counters, sinks and appliance exteriors",
          "All bathrooms: toilet, shower, tub, sink, mirrors",
          "Dust all reachable surfaces and furniture",
          "Vacuum carpets and rugs",
          "Mop all hard floors",
          "Empty bins and replace liners",
          "Beds made (linens changed if left out)",
        ],
        excludes: ["Inside the oven or fridge", "Interior windows", "Walls and baseboards", "Garage or basement"],
      },
      {
        id: "deep",
        name: "Deep Clean",
        tagline: "The reset. Recommended for a first visit or after a long gap.",
        from: 280,
        popular: true,
        duration: "4–6 hours",
        includes: [
          "Everything in Standard Clean",
          "Baseboards, door frames and switch plates",
          "Inside the microwave",
          "Cabinet fronts and handles",
          "Window sills and tracks",
          "Light fixtures and ceiling fans",
          "Soap scum and limescale removal",
          "Behind and under movable furniture",
        ],
        excludes: ["Inside the oven or fridge (add below)", "Interior window glass (add below)", "Carpet shampoo"],
      },
      {
        id: "move",
        name: "Move-In / Move-Out",
        tagline: "Empty property, landlord-ready or ready to hand over.",
        from: 350,
        duration: "5–8 hours",
        includes: [
          "Everything in Deep Clean",
          "Inside all cabinets, drawers and closets",
          "Inside the oven and fridge",
          "Interior window glass and tracks",
          "Wall spot-cleaning and scuff removal",
          "Appliance exteriors and behind where movable",
          "Garage sweep-out",
        ],
        excludes: ["Carpet shampoo or extraction", "Exterior windows", "Paint or drywall repair"],
      },
      {
        id: "turnover",
        name: "Airbnb Turnover",
        tagline: "Fast reset between guests, on a short window.",
        /*
          Was $120. Short-term-rental turnovers bill 30–50% above the
          equivalent residential clean in every market where the rate is
          published, and Kansas City runs $85–130 for a one-bed up to
          $180–250 for a three-bed. $120 flat sat under the bottom of that
          band for work that is harder than a standard clean, not easier —
          linens stripped and remade, consumables restocked, a damage report
          sent, and all of it inside a fixed checkout-to-checkin window with a
          guest arriving whether or not the job ran long.
        */
        from: 150,
        duration: "1–2 hours",
        includes: [
          "Full linen change and beds made",
          "Bathroom reset, towels replaced, consumables restocked",
          "Kitchen reset, dishes done, fridge checked",
          "Bins emptied and relined",
          "Floors vacuumed and mopped",
          "Damage and low-stock report sent to you",
          "Staging photos on request",
        ],
        excludes: ["Deep-clean tasks", "Off-site laundry", "Restocking items we don't supply"],
      },
    ],
    questions: [
      {
        id: "bedrooms",
        kind: "counter",
        label: "Bedrooms",
        help: "Up to 3 is covered by the base price.",
        min: 0,
        max: 8,
        default: 3,
        includedUpTo: 3,
        pricePerUnit: 30,
        noun: "bedroom",
      },
      {
        id: "bathrooms",
        kind: "counter",
        label: "Bathrooms",
        help: "Up to 2 is covered by the base price. Half-baths count.",
        min: 1,
        max: 6,
        default: 2,
        includedUpTo: 2,
        pricePerUnit: 35,
        noun: "bathroom",
      },
      {
        id: "condition",
        kind: "choice",
        label: "How's it looking right now?",
        help: "Be honest. It costs you nothing and stops us arriving under-scheduled.",
        /*
          These are the most under-costed numbers on the old price list. A house
          that has not been touched in months is not 90 dollars of extra work on
          top of a standard clean — it is closer to a second clean. Under-pricing
          condition is how a two-hour job becomes a five-hour one at the same
          price, and the customer who was honest on the form is not the one at
          fault when that happens.
        */
        options: [
          { value: "maintained", label: "Regularly cleaned", delta: 0 },
          { value: "behind", label: "A bit behind", delta: 60 },
          { value: "neglected", label: "Hasn't been done in a long while", delta: 130 },
        ],
      },
    ],
    addOns: [
      { id: "oven", name: "Inside the oven", price: 45, note: "Racks, glass and cavity degreased." },
      { id: "fridge", name: "Inside the fridge", price: 45, note: "Emptied, shelves washed, restacked." },
      { id: "windows-in", name: "Interior windows", price: 75, note: "Glass, sills and tracks throughout." },
      { id: "laundry", name: "Laundry, wash & fold", price: 30, note: "Per load, on-site machines." },
      { id: "pet-hair", name: "Pet hair treatment", price: 40, note: "Rubber-brush lift on upholstery and carpet." },
      { id: "basement", name: "Finished basement", price: 55, note: "Treated as an extra living area." },
      { id: "cabinets", name: "Inside kitchen cabinets", price: 55, note: "Emptied, wiped out and restacked. Included free in a move-out." },
      { id: "garage", name: "Garage sweep-out", price: 45, note: "Swept, cobwebs down, bins wiped. Not a clear-out — we sweep, we don't haul." },
      // Bin cleaning is only worth this rate because the truck is already on the
      // drive. See BIN_ADDON in services.ts.
      { id: "bin", name: "Trash bin cleaning", price: 29, note: "Two bins washed and deodorised while we're here. $10 per extra bin." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  auto: {
    heading: "How far do you want to take it?",
    blurb:
      "Packages run basic wash through full correction. Vehicle size and condition change the time on site, so they change the price.",
    packageLabel: "Choose your detail",
    packages: [
      {
        id: "express",
        name: "Express Wash",
        tagline: "Clean and presentable, in and out.",
        from: 119,
        duration: "1 hour",
        includes: [
          "Hand wash and microfibre dry",
          "Wheels, barrels and tyres cleaned",
          "Tyre dressing applied",
          "Glass cleaned inside and out",
          "Door jambs wiped down",
        ],
        excludes: ["Interior vacuum or shampoo", "Paint correction", "Wax or sealant"],
      },
      {
        id: "interior",
        name: "Interior Detail",
        tagline: "For when the outside is fine and the inside isn't.",
        from: 199,
        duration: "2–3 hours",
        includes: [
          "Full vacuum including boot and under seats",
          "Fabric seats shampooed, or leather cleaned and conditioned",
          "Carpets and mats hot-water extracted",
          "Dash, console and vents detailed",
          "Interior glass and mirrors",
          "Odour neutraliser",
        ],
        excludes: ["Exterior wash", "Paint correction", "Pet hair removal (add below)"],
      },
      {
        id: "full",
        name: "Full Detail",
        tagline: "Inside and out, with paint protection. Our most booked.",
        from: 269,
        popular: true,
        duration: "3–4 hours",
        includes: [
          "Everything in Express Wash and Interior Detail",
          "Clay bar decontamination",
          "Single-stage machine polish",
          "Paint sealant, around 3 months protection",
          "Engine bay wipe-down",
          "Exterior trim restored",
        ],
        excludes: ["Multi-stage correction", "Ceramic coating", "Deep scratch removal"],
      },
      /*
        A fourth tier used to sit here: "Paint Correction & Ceramic", six to
        eight hours, multi-stage cut, a coating warranted for two to three
        years.

        It is gone because nobody here can do it yet. Multi-stage correction on
        someone else's paint is the one job in this catalogue that can cause
        permanent, expensive damage — clear coat is finite, and burning through
        it on a panel is a respray, not a re-buff. Selling a two-to-three year
        coating also means standing behind it for two to three years.

        Single-stage machine polish stays in the Full Detail above, which is a
        different risk entirely on a dual-action polisher. Bring correction back
        when there is a portfolio behind it and a policy that covers it.
      */
    ],
    questions: [
      {
        id: "vehicle",
        kind: "choice",
        label: "Vehicle size",
        options: [
          { value: "sedan", label: "Coupe or sedan", delta: 0 },
          { value: "crossover", label: "Small SUV / crossover", delta: 25 },
          { value: "truck", label: "Pickup truck", delta: 40 },
          { value: "large", label: "Large SUV, 3-row or van", delta: 55 },
        ],
      },
      {
        id: "condition",
        kind: "choice",
        label: "Interior condition",
        help: "Pets, kids and smoke all add real time.",
        options: [
          { value: "clean", label: "Well kept", delta: 0 },
          { value: "normal", label: "Normal daily use", delta: 35 },
          { value: "heavy", label: "Heavy: pets, kids or smoke", delta: 95 },
        ],
      },
      {
        id: "vehicles",
        kind: "counter",
        label: "How many vehicles?",
        help: "Same package, same address, same visit. Every car after the first is 20% off.",
        min: 1,
        max: 4,
        default: 1,
        includedUpTo: 1,
        // Unused — percentOfBase takes over. Kept because the type requires it.
        pricePerUnit: 0,
        percentOfBase: 0.8,
        noun: "vehicle",
      },
      {
        id: "site",
        kind: "choice",
        label: "Where will we be working?",
        help: "We're mobile. No power or water on site means we bring our own.",
        options: [
          { value: "full", label: "Driveway with power and water", delta: 0 },
          { value: "none", label: "Driveway, no power or water", delta: 15 },
          { value: "lot", label: "Parking garage or lot", delta: 15 },
        ],
      },
    ],
    /*
      Two add-ons were dropped rather than repriced.

      Ozone odour treatment needs a generator and, worse, needs the car to sit
      sealed for hours. On a mobile round that is not an add-on, it is a lost
      afternoon — the slot it occupies is worth more than the $75 it earned.

      Ceramic wheel coating went for the same reason as the correction tier: it
      is a durability promise measured in years, sold by someone who has not
      applied one yet.

      What is left is what the Kansas City market actually sells alongside a
      detail, and all of it is fast, low-risk work with gear that is already on
      the truck.
    */
    /*
      Repriced and extended in August 2026 against the published menus of four
      Kansas City mobile detailers. Two of ours were ABOVE the local market
      (engine bay at $59 against $35–50; the old headliner charge was under it
      at $39 against $55) and four things every competitor sells were missing
      entirely.

      The four additions are deliberately all short, low-risk work with tools
      already on the truck — a car seat, a trim dressing, a glass treatment, a
      spot extraction. None of them costs a slot the way an ozone treatment
      did. The test for anything else joining this list is the same: does it
      finish inside half an hour, and can it be done badly without damaging
      the car?
    */
    addOns: [
      { id: "engine", name: "Engine bay deep clean", price: 49, note: "Degreased, rinsed and plastics dressed." },
      { id: "headlights", name: "Headlight restoration", price: 89, note: "Wet-sanded, polished and UV sealed. Both lenses." },
      { id: "pet-hair", name: "Pet hair removal", price: 49, note: "Embedded hair, charged separately from vacuuming." },
      { id: "pet-hair-heavy", name: "Heavy pet hair", price: 119, note: "A shedding breed in a car it lives in. Ask us if you're not sure which one you need — we'd rather quote it right." },
      { id: "stain", name: "Spot & stain extraction", price: 59, note: "Hot-water extraction on a specific spill. Set-in dye and bleach marks may not lift, and we'll say so before we start." },
      { id: "leather", name: "Leather clean & condition", price: 49, note: "Seats and trim cleaned, then fed so they stop drying out." },
      { id: "headliner", name: "Headliner spot clean", price: 49, note: "Marks lifted by hand. Headliners delaminate if they are soaked." },
      { id: "carseat", name: "Child seat deep clean", price: 39, note: "Per seat. Cover off where the manufacturer allows it, harness wiped, crumbs out of the shell." },
      { id: "trim", name: "Exterior trim restoration", price: 35, note: "Faded black plastic cleaned and dressed. Lasts months, not years." },
      { id: "glass", name: "Rain-repellent glass treatment", price: 25, note: "Windscreen and front doors. Water beads and clears instead of smearing." },
      { id: "sealant", name: "Ceramic spray sealant", price: 69, note: "Hand-applied. Around 6 months of protection instead of 3." },
      { id: "bin", name: "Trash bin cleaning", price: 29, note: "Two bins washed and deodorised while we're here. $10 per extra bin." },
    ],
  },

  /*
    Five more blocks used to sit here — landscaping, bin, power, window and
    commercial. Four of those services were withdrawn in August 2026 (see
    docs/parked-services.md); bin cleaning is still sold, but as an add-on
    rather than a wizard category, so it has packages nobody can choose and
    questions nobody is asked. Keeping dead configuration around is how a
    price list drifts out of step with what is actually for sale.
  */
};

export function getServiceDetail(categoryId: string): ServiceDetail | undefined {
  return SERVICE_DETAILS[categoryId];
}

/**
 * A service's detail with live CRM floors laid over the configured ones.
 *
 * Only the NUMBER moves. Packages, checklists, exclusions and durations have no
 * CRM equivalent and stay exactly as configured here; a package whose name the
 * CRM does not return keeps its local price rather than blanking. `custom` tiers
 * are never overwritten — a site-visit tier has no floor to override.
 *
 * This lived inline in BookingWizard, which meant a service page and the wizard
 * could quote different numbers for the same package: the page read the static
 * catalogue, the wizard read the CRM. Anything that shows a customer a price
 * they are about to commit to should call this.
 */
export function withLivePrices(
  base: ServiceDetail | undefined,
  overrides: Record<string, number>
): ServiceDetail | undefined {
  if (!base || Object.keys(overrides).length === 0) return base;
  return {
    ...base,
    packages: base.packages.map((pkg) => {
      const live = overrides[pkg.name.trim().toLowerCase()];
      return live === undefined || pkg.custom ? pkg : { ...pkg, from: live };
    }),
  };
}

export function findPackage(categoryId: string, packageId: string): PackageDef | undefined {
  return SERVICE_DETAILS[categoryId]?.packages.find((p) => p.id === packageId);
}

/** Answers keyed by question id. Counter answers are numbers, choices are option values. */
export type Answers = Record<string, string | number>;

export interface DetailEstimate {
  /** Package floor before any adjustment. */
  base: number;
  /** Total from question deltas and counter overages. */
  adjustments: number;
  /** Total from selected in-service add-ons. */
  extras: number;
  /** base + adjustments + extras, before any cross-service bundle discount. */
  subtotal: number;
  /** True when anything selected needs a site visit before it can be priced. */
  needsVisit: boolean;
  /** Human-readable breakdown lines for the review step and the crew's email. */
  lines: { label: string; amount?: number; custom?: boolean }[];
}

/**
 * Prices one service's configuration.
 *
 * Returns a breakdown rather than a single number, because the customer needs to
 * see WHY it costs what it does — an unexplained total is the thing that makes
 * people abandon a quote. `needsVisit` suppresses the figure entirely rather
 * than showing a number we can't stand behind.
 */
export function priceDetail(
  /**
   * Pass the RESOLVED detail, not a category id. The booking wizard overlays
   * live CRM prices onto the configured packages before pricing, so reading
   * SERVICE_DETAILS here would silently quote the stale local number.
   */
  detail: ServiceDetail | undefined,
  packageId: string,
  answers: Answers,
  addOnIds: string[]
): DetailEstimate {
  const pkg = detail?.packages.find((p) => p.id === packageId);

  const lines: DetailEstimate["lines"] = [];
  let base = 0;
  let adjustments = 0;
  let extras = 0;
  let needsVisit = false;

  if (!detail || !pkg) {
    return { base: 0, adjustments: 0, extras: 0, subtotal: 0, needsVisit: false, lines };
  }

  if (pkg.custom || pkg.from === undefined) {
    needsVisit = true;
    lines.push({ label: pkg.name, custom: true });
  } else {
    base = pkg.from;
    lines.push({ label: pkg.name, amount: pkg.from });
  }

  for (const question of detail.questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === "") continue;

    if (question.kind === "counter") {
      const count = Number(answer);
      const over = Math.max(0, count - question.includedUpTo);
      if (over > 0) {
        // `base` is the package floor set immediately above, so a
        // percentOfBase counter prices against the tier actually chosen.
        const unit = question.percentOfBase
          ? Math.round(base * question.percentOfBase)
          : question.pricePerUnit;
        const amount = over * unit;
        adjustments += amount;
        lines.push({
          label: `${over} extra ${question.noun}${over === 1 ? "" : "s"}`,
          amount,
        });
      }
      continue;
    }

    const option = question.options.find((o) => o.value === answer);
    if (!option) continue;
    if (option.custom) {
      needsVisit = true;
      lines.push({ label: option.label, custom: true });
    } else if (option.delta) {
      adjustments += option.delta;
      lines.push({ label: option.label, amount: option.delta });
    }
  }

  for (const id of addOnIds) {
    const addOn = detail.addOns.find((a) => a.id === id);
    if (!addOn) continue;
    if (addOn.price === 0) {
      needsVisit = true;
      lines.push({ label: addOn.name, custom: true });
    } else {
      extras += addOn.price;
      lines.push({ label: addOn.name, amount: addOn.price });
    }
  }

  return { base, adjustments, extras, subtotal: base + adjustments + extras, needsVisit, lines };
}

/** Default answers for a service, so the estimate is sensible before anyone touches a control. */
export function defaultAnswers(categoryId: string): Answers {
  const detail = SERVICE_DETAILS[categoryId];
  if (!detail) return {};
  const answers: Answers = {};
  for (const question of detail.questions) {
    answers[question.id] = question.kind === "counter" ? question.default : question.options[0].value;
  }
  return answers;
}
