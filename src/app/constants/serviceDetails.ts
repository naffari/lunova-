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
      /** Dollars per unit beyond `includedUpTo`. */
      pricePerUnit: number;
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
        from: 120,
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
        from: 220,
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
        from: 260,
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
        from: 90,
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
        pricePerUnit: 20,
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
        pricePerUnit: 25,
        noun: "bathroom",
      },
      {
        id: "condition",
        kind: "choice",
        label: "How's it looking right now?",
        help: "Be honest. It costs you nothing and stops us arriving under-scheduled.",
        options: [
          { value: "maintained", label: "Regularly cleaned", delta: 0 },
          { value: "behind", label: "A bit behind", delta: 40 },
          { value: "neglected", label: "Hasn't been done in a long while", delta: 90 },
        ],
      },
    ],
    addOns: [
      { id: "oven", name: "Inside the oven", price: 35, note: "Racks, glass and cavity degreased." },
      { id: "fridge", name: "Inside the fridge", price: 35, note: "Emptied, shelves washed, restacked." },
      { id: "windows-in", name: "Interior windows", price: 60, note: "Glass, sills and tracks throughout." },
      { id: "laundry", name: "Laundry, wash & fold", price: 25, note: "Per load, on-site machines." },
      { id: "pet-hair", name: "Pet hair treatment", price: 30, note: "Rubber-brush lift on upholstery and carpet." },
      { id: "basement", name: "Finished basement", price: 40, note: "Treated as an extra living area." },
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
        from: 69,
        duration: "45 minutes",
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
        from: 89,
        duration: "2 hours",
        includes: [
          "Full vacuum including boot and under seats",
          "Fabric seats shampooed, or leather cleaned and conditioned",
          "Carpets and mats hot-water extracted",
          "Dash, console and vents detailed",
          "Interior glass and mirrors",
          "Odour neutraliser",
        ],
        excludes: ["Exterior wash", "Ozone treatment (add below)", "Pet hair removal (add below)"],
      },
      {
        id: "full",
        name: "Full Detail",
        tagline: "Inside and out, with paint protection. Our most booked.",
        from: 149,
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
      {
        id: "correction",
        name: "Paint Correction & Ceramic",
        tagline: "Swirl removal and long-term coating. Priced after inspection.",
        custom: true,
        duration: "6–8 hours, sometimes two days",
        includes: [
          "Paint depth inspection and test panel",
          "Multi-stage cut and polish",
          "Swirl and light scratch removal",
          "Ceramic coating, 2–3 years protection",
          "Coated wheels and glass on request",
          "Aftercare kit and instructions",
        ],
        excludes: ["Dent or bodywork repair", "Repainting", "Deep scratches through clear coat"],
      },
    ],
    questions: [
      {
        id: "vehicle",
        kind: "choice",
        label: "Vehicle size",
        options: [
          { value: "sedan", label: "Coupe or sedan", delta: 0 },
          { value: "crossover", label: "Small SUV / crossover", delta: 20 },
          { value: "truck", label: "Pickup truck", delta: 30 },
          { value: "large", label: "Large SUV, 3-row or van", delta: 40 },
        ],
      },
      {
        id: "condition",
        kind: "choice",
        label: "Interior condition",
        help: "Pets, kids and smoke all add real time.",
        options: [
          { value: "clean", label: "Well kept", delta: 0 },
          { value: "normal", label: "Normal daily use", delta: 25 },
          { value: "heavy", label: "Heavy: pets, kids or smoke", delta: 75 },
        ],
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
    addOns: [
      { id: "engine", name: "Engine bay deep clean", price: 45, note: "Degreased, rinsed and plastics dressed." },
      { id: "headlights", name: "Headlight restoration", price: 65, note: "Wet-sanded, polished and UV sealed." },
      { id: "pet-hair", name: "Pet hair removal", price: 40, note: "Embedded hair, charged separately from vacuuming." },
      { id: "ozone", name: "Ozone odour treatment", price: 75, note: "Smoke, damp or spoiled food. Vehicle sits sealed." },
      { id: "wax", name: "Upgrade to premium wax", price: 40, note: "Around 6 months protection instead of 3." },
      { id: "wheels", name: "Ceramic wheel coating", price: 60, note: "Brake dust wipes off for about a year." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  landscaping: {
    heading: "What does the yard need?",
    blurb:
      "Lot size and how overgrown things are drive the price more than anything else, so we ask up front rather than re-quoting on the day.",
    packageLabel: "Choose your service",
    packages: [
      {
        id: "recurring",
        name: "Recurring Lawn Care",
        tagline: "Weekly or bi-weekly upkeep on a fixed route day.",
        from: 45,
        unit: "visit",
        popular: true,
        duration: "30–60 minutes",
        includes: [
          "Mow all turf areas",
          "String trim fence lines, beds and obstacles",
          "Edge walkways and driveway",
          "Blow clippings off all hard surfaces",
          "Gates re-latched, pet waste checked before mowing",
        ],
        excludes: ["Bed weeding", "Shrub trimming", "Leaf haul-away", "Fertiliser or weed control"],
      },
      {
        id: "cleanup",
        name: "One-Time Clean-Up",
        tagline: "Getting a neglected yard back under control.",
        from: 150,
        duration: "2–4 hours",
        includes: [
          "Overgrown mow, double-cut where needed",
          "Full trim and edge",
          "Bed weeding and defining",
          "Shrub trim under 8 feet",
          "Leaf and debris removal",
          "All green waste hauled away",
        ],
        excludes: ["Tree work above 8 feet", "Stump or root removal", "Mulch supply (add below)"],
      },
      {
        id: "seasonal",
        name: "Seasonal Package",
        tagline: "Spring or fall programme. Priced after we see the property.",
        custom: true,
        duration: "Scheduled across the season",
        includes: [
          "Spring or fall programme built around your yard",
          "Bed refresh and mulch installation",
          "Structural pruning",
          "Gutter clearing",
          "Aeration and overseed option",
          "Priority scheduling all season",
        ],
        excludes: ["Irrigation repair", "Hardscaping", "Tree removal"],
      },
    ],
    questions: [
      {
        id: "lot",
        kind: "choice",
        label: "Lot size",
        options: [
          { value: "small", label: "Under 1/4 acre", delta: 0 },
          { value: "medium", label: "1/4 to 1/2 acre", delta: 20 },
          { value: "large", label: "1/2 to 1 acre", delta: 45 },
          { value: "acreage", label: "Over 1 acre", custom: true },
        ],
      },
      {
        id: "growth",
        kind: "choice",
        label: "Current condition",
        help: "Tall or wet grass means a slower cut and sometimes two passes.",
        options: [
          { value: "maintained", label: "Cut in the last two weeks", delta: 0 },
          { value: "shaggy", label: "Getting away from us", delta: 30 },
          { value: "overgrown", label: "Over a month, properly overgrown", delta: 80 },
        ],
      },
    ],
    addOns: [
      { id: "mulch", name: "Mulch installation", price: 85, note: "Per yard, supplied and spread." },
      { id: "shrubs", name: "Shrub and hedge trim", price: 60, note: "Under 8 feet, clippings removed." },
      { id: "weeding", name: "Bed weeding", price: 45, note: "Hand-pulled, beds re-edged." },
      { id: "gutters", name: "Gutter clearing", price: 95, note: "Single storey, debris bagged." },
      { id: "leaves", name: "Leaf haul-away", price: 50, note: "Bagged and taken off site." },
      { id: "aeration", name: "Core aeration", price: 75, note: "Best paired with overseeding." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  bin: {
    heading: "How many bins, how often?",
    blurb:
      "We clean curbside on your regular pickup day, so your bins are empty when we arrive. Wastewater is captured, not left on your driveway.",
    packageLabel: "Choose your plan",
    packages: [
      {
        id: "onetime",
        name: "One-Time Clean",
        tagline: "Try it once. No commitment.",
        from: 25,
        duration: "10 minutes on site",
        includes: [
          "High-pressure hot wash, inside and out",
          "Sanitising treatment",
          "Deodoriser applied",
          "Curbside, no need to be home",
          "Wastewater captured and removed",
        ],
        excludes: ["Recurring scheduling", "Priority route slot"],
      },
      {
        id: "monthly",
        name: "Monthly Plan",
        tagline: "One clean a month, on route. Most popular.",
        from: 15,
        unit: "month",
        popular: true,
        duration: "10 minutes, same day each month",
        includes: [
          "One clean per month after your pickup",
          "Sanitise and deodorise every visit",
          "Reminder text the day before",
          "Same crew, same route day",
          "Cancel any time, no fee",
        ],
        excludes: ["Mid-month extra visits"],
      },
      {
        id: "biweekly",
        name: "Bi-Weekly Plan",
        tagline: "Two cleans a month. For heavy or shared bins.",
        from: 22,
        unit: "month",
        duration: "10 minutes, twice monthly",
        includes: [
          "Two cleans per month",
          "Sanitise and deodorise every visit",
          "Priority route slot",
          "Reminder text before each visit",
          "Cancel any time, no fee",
        ],
        excludes: ["Weekly service, ask us if you need it"],
      },
    ],
    questions: [
      {
        id: "bins",
        kind: "counter",
        label: "How many bins?",
        help: "Two are covered by the base price. Recycling and yard waste count.",
        min: 1,
        max: 8,
        default: 2,
        includedUpTo: 2,
        pricePerUnit: 8,
        noun: "bin",
      },
      {
        id: "state",
        kind: "choice",
        label: "Condition of the bins",
        help: "First cleans on long-neglected bins take considerably longer.",
        options: [
          { value: "normal", label: "Normal use", delta: 0 },
          { value: "heavy", label: "Heavy build-up or maggots", delta: 15 },
        ],
      },
    ],
    addOns: [
      { id: "driveway", name: "Driveway rinse after service", price: 20, note: "Quick wash-down of the bin area." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  power: {
    heading: "What are we washing?",
    blurb:
      "We match pressure to the surface: soft wash for siding, high pressure for concrete. Area and staining level set the price.",
    packageLabel: "Choose your surface",
    packages: [
      {
        id: "driveway",
        name: "Driveway & Sidewalk",
        tagline: "Concrete, pavers and asphalt.",
        from: 120,
        duration: "1–2 hours",
        includes: [
          "Oil and rust spots pre-treated",
          "Surface-cleaner pass for an even finish",
          "Wand-trimmed edges and borders",
          "Full rinse down",
          "Walk-through before we leave",
        ],
        excludes: ["Sealing", "Crack repair", "Guaranteed removal of set-in stains"],
      },
      {
        id: "house",
        name: "House Soft Wash",
        tagline: "Siding, stucco and brick. Low pressure, safe for paint.",
        from: 180,
        popular: true,
        duration: "2–4 hours",
        includes: [
          "Low-pressure soft wash across all siding",
          "Mould, algae and mildew treatment",
          "Gutter faces brightened",
          "Windows and doors rinsed",
          "Plants wetted down and protected",
        ],
        excludes: ["Interior gutter clearing (add below)", "Roof washing", "Window glass detailing"],
      },
      {
        id: "deck",
        name: "Deck & Patio",
        tagline: "Wood and composite, at a pressure that won't furr the grain.",
        from: 150,
        duration: "2–3 hours",
        includes: [
          "Pressure matched to wood or composite",
          "Mildew and greying treatment",
          "Railings, spindles and steps",
          "Paver sand checked and noted",
          "Rinse and seasonal prep",
        ],
        excludes: ["Staining or sealing", "Board replacement", "Structural repair"],
      },
    ],
    questions: [
      {
        id: "area",
        kind: "choice",
        label: "Roughly how big?",
        options: [
          { value: "small", label: "Small: 1-car drive or small patio", delta: 0 },
          { value: "medium", label: "Medium: 2-car drive or standard patio", delta: 40 },
          { value: "large", label: "Large: 3-car, wraparound or long drive", delta: 95 },
        ],
      },
      {
        id: "stories",
        kind: "choice",
        label: "How many storeys?",
        help: "Only affects siding and gutter work.",
        options: [
          { value: "1", label: "Single storey", delta: 0 },
          { value: "2", label: "Two storeys", delta: 50 },
          { value: "3", label: "Three or more", custom: true },
        ],
      },
      {
        id: "staining",
        kind: "choice",
        label: "How bad is the staining?",
        options: [
          { value: "light", label: "Light: general dirt", delta: 0 },
          { value: "moderate", label: "Moderate: visible green or black", delta: 35 },
          { value: "heavy", label: "Heavy: years of build-up", delta: 90 },
        ],
      },
    ],
    addOns: [
      { id: "gutters", name: "Gutter interior clearing", price: 95, note: "Debris removed and downspouts flushed." },
      { id: "fence", name: "Fence washing", price: 75, note: "Per standard run, wood or vinyl." },
      { id: "rust", name: "Rust removal treatment", price: 55, note: "Irrigation and fertiliser staining." },
      { id: "concrete-seal", name: "Concrete sealing", price: 0, note: "Quoted after the wash. Depends on porosity." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  window: {
    heading: "Inside, outside, or both?",
    blurb: "Priced on pane count and reach. Storeys matter more than window size.",
    packageLabel: "Choose your service",
    packages: [
      {
        id: "exterior",
        name: "Exterior Only",
        tagline: "No access needed indoors. Nobody has to be home.",
        from: 110,
        duration: "1–2 hours",
        includes: [
          "All exterior glass hand-washed",
          "Frames wiped down",
          "Sills brushed clear",
          "Screens rinsed in place",
          "Streak-free squeegee finish",
        ],
        excludes: ["Interior glass", "Screen removal and deep clean", "Hard water stain removal"],
      },
      {
        id: "both",
        name: "Interior & Exterior",
        tagline: "The full job. Most booked.",
        from: 180,
        popular: true,
        duration: "2–4 hours",
        includes: [
          "Everything in Exterior Only",
          "All interior glass",
          "Interior sills and tracks detailed",
          "Screens removed, washed and refitted",
          "Shoe covers and drop cloths indoors",
        ],
        excludes: ["Hard water stain removal (add below)", "Skylights (add below)", "Blind or curtain cleaning"],
      },
    ],
    questions: [
      {
        id: "panes",
        kind: "choice",
        label: "Roughly how many windows?",
        help: "Count openings, not panes. A sliding door counts as one.",
        options: [
          { value: "10", label: "Up to 10", delta: 0 },
          { value: "20", label: "11 to 20", delta: 45 },
          { value: "30", label: "21 to 30", delta: 95 },
          { value: "more", label: "More than 30", custom: true },
        ],
      },
      {
        id: "stories",
        kind: "choice",
        label: "How many storeys?",
        options: [
          { value: "1", label: "Single storey", delta: 0 },
          { value: "2", label: "Two storeys", delta: 40 },
          { value: "3", label: "Three or more", custom: true },
        ],
      },
    ],
    addOns: [
      { id: "hardwater", name: "Hard water stain treatment", price: 60, note: "Mineral etching from sprinkler overspray." },
      { id: "screens", name: "Screen deep clean", price: 35, note: "Removed, scrubbed and dried rather than rinsed." },
      { id: "skylights", name: "Skylights", price: 50, note: "Interior and exterior, reachable ones." },
      { id: "french", name: "French or divided panes", price: 40, note: "Individual panes take considerably longer." },
      { id: "tracks", name: "Track and channel detail", price: 30, note: "Vacuumed and scrubbed, not just wiped." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  junk: {
    heading: "What are we hauling?",
    blurb:
      "Priced by how much room it takes in the truck, plus how far we have to carry it. Disposal fees are included in every tier.",
    packageLabel: "Choose your load",
    packages: [
      {
        id: "single",
        name: "Single Item",
        tagline: "One thing gone: sofa, mattress, appliance.",
        from: 75,
        duration: "30 minutes",
        includes: [
          "One item, from any floor",
          "Disassembly where needed",
          "Loaded and hauled",
          "Area swept after",
          "Disposal fees included",
        ],
        excludes: ["Hazardous waste", "Paint or chemicals", "Construction debris by weight"],
      },
      {
        id: "partial",
        name: "Partial Truckload",
        tagline: "A room's worth, or a decent garage clear.",
        from: 175,
        popular: true,
        duration: "1–2 hours",
        includes: [
          "Up to half a truck",
          "Multi-room pickup",
          "Loaded and hauled",
          "Area swept after",
          "Disposal and recycling sorted",
          "Donatable items dropped off",
        ],
        excludes: ["Hazardous waste", "Asbestos or chemicals"],
      },
      {
        id: "full",
        name: "Full Truckload",
        tagline: "Whole-property cleanout.",
        from: 395,
        duration: "3–5 hours",
        includes: [
          "Full truck capacity",
          "Whole-property or estate cleanout",
          "Loaded and hauled",
          "Area swept after",
          "Disposal and recycling sorted",
          "Donation drop-off with receipt",
        ],
        excludes: ["Hazardous waste", "Asbestos", "Anything requiring a permit"],
      },
    ],
    questions: [
      {
        id: "access",
        kind: "choice",
        label: "Where is it now?",
        help: "Carrying distance is most of the labour on a haul.",
        options: [
          { value: "curb", label: "Curbside or garage", delta: 0 },
          { value: "ground", label: "Inside, ground floor", delta: 25 },
          { value: "stairs", label: "Upstairs or basement", delta: 50 },
        ],
      },
      {
        id: "heavy",
        kind: "choice",
        label: "Anything unusually heavy?",
        help: "Pianos, safes, hot tubs and gun cabinets need extra crew.",
        options: [
          { value: "none", label: "Nothing unusual", delta: 0 },
          { value: "some", label: "One or two heavy items", delta: 75 },
          { value: "many", label: "Three or more", custom: true },
        ],
      },
    ],
    addOns: [
      { id: "rush", name: "Same-day rush", price: 75, note: "Subject to availability. We'll confirm by phone." },
      { id: "freon", name: "Appliance freon recovery", price: 30, note: "Required for fridges, freezers and AC units." },
      { id: "mattress", name: "Mattress disposal fee", price: 25, note: "Per mattress. Charged by the transfer station." },
      { id: "ewaste", name: "E-waste handling", price: 20, note: "TVs, monitors and computers." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  commercial: {
    heading: "Tell us about the facility",
    blurb:
      "Commercial work is always quoted after a walk-through. Square footage, frequency and access vary too much to price online. This gets us ready for that call.",
    packageLabel: "What kind of facility?",
    packages: [
      {
        id: "office",
        name: "Office Janitorial",
        tagline: "Nightly or weekly, after hours.",
        custom: true,
        duration: "Scheduled around your hours",
        includes: [
          "Trash and recycling collection",
          "Restroom sanitisation and restocking",
          "Break room and common areas",
          "Vacuum and hard-floor care",
          "Surface disinfection at touch points",
          "Monthly quality audit with your account manager",
        ],
      },
      {
        id: "medical",
        name: "Medical Facility",
        tagline: "Clinics, dental and outpatient.",
        custom: true,
        duration: "Scheduled around your hours",
        includes: [
          "Hospital-grade disinfectants",
          "Exam room turnover protocol",
          "Waiting area and reception",
          "Compliant waste handling",
          "Restroom sanitisation and restocking",
          "Documented cleaning log",
        ],
      },
      {
        id: "restaurant",
        name: "Restaurant",
        tagline: "After-close reset, ready for the morning crew.",
        custom: true,
        duration: "After close",
        includes: [
          "Kitchen degreasing, floors and drains",
          "Hood and grease-trap surrounds",
          "Dining room reset",
          "Restroom deep clean",
          "Bin area wash-down",
          "Inspection-ready standard",
        ],
      },
      {
        id: "retail",
        name: "Retail or Other",
        tagline: "Storefronts, gyms, dealerships, anything else.",
        custom: true,
        duration: "Scheduled around your hours",
        includes: [
          "Sales floor and fitting rooms",
          "Glass and entry doors",
          "Restroom sanitisation",
          "Hard-floor care and matting",
          "Back-of-house and stock areas",
        ],
      },
    ],
    questions: [
      {
        id: "sqft",
        kind: "choice",
        label: "Approximate square footage",
        options: [
          { value: "s", label: "Under 2,000 sq ft", custom: true },
          { value: "m", label: "2,000 – 10,000 sq ft", custom: true },
          { value: "l", label: "10,000 – 25,000 sq ft", custom: true },
          { value: "xl", label: "Over 25,000 sq ft", custom: true },
        ],
      },
      {
        id: "access",
        kind: "choice",
        label: "When can we work?",
        options: [
          { value: "after", label: "After hours", custom: true },
          { value: "before", label: "Before opening", custom: true },
          { value: "during", label: "During business hours", custom: true },
          { value: "weekend", label: "Weekends only", custom: true },
        ],
      },
    ],
    addOns: [],
  },
};

export function getServiceDetail(categoryId: string): ServiceDetail | undefined {
  return SERVICE_DETAILS[categoryId];
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
        const amount = over * question.pricePerUnit;
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
