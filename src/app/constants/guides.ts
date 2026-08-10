import { SERVICE_BY_ID, formatDollars, type ServiceId } from "./services";
import { getServiceDetail, findPackage } from "./serviceDetails";

/**
 * LONG-FORM GUIDES.
 *
 * Why these exist: every page on this site before now was a page about Lunova.
 * That is fine for someone already looking for a cleaner in Overland Park, and
 * useless for the far larger group typing "what does move out cleaning
 * include" or "is trash bin cleaning worth it" — questions with real search
 * volume, commercial intent one step back, and no page here answering them.
 * A keyword audit of the live site found exactly that gap: strong on-page SEO,
 * almost no content to rank.
 *
 * THE RULES, because a guide that reads like filler costs more than it earns:
 *
 *   1. Answer the question in the first paragraph. Not after 400 words of
 *      throat-clearing about how important a clean home is.
 *   2. Real numbers only. Prices come from the catalogue below, not from
 *      hand-typed figures that drift the moment the price book changes.
 *   3. Say when NOT to hire us. "Do it yourself if…" is the sentence that makes
 *      the rest of the page believable, and it is the one most competitors
 *      won't write.
 *   4. No invented statistics, no fake case studies, no citing research that
 *      does not exist.
 *
 * Each guide maps to one service, so a reader who wants the job done has one
 * obvious next step rather than a generic "contact us".
 */

export interface GuideSection {
  heading: string;
  /** Paragraphs. Rendered in order. */
  body?: string[];
  /** Optional bulleted list, rendered after the paragraphs. */
  list?: string[];
  /** Optional two-column comparison, rendered as a table. */
  table?: {
    columns: [string, string, string];
    rows: [string, string, string][];
  };
  /** Optional pull-out note. Use for the honest caveat, not for a sales line. */
  note?: string;
}

export interface Guide {
  slug: string;
  /** <title>. Keep under 60 characters. */
  title: string;
  /** Meta description. 120–160 characters; scripts/check-seo.mjs enforces it. */
  description: string;
  /** On-page H1. Usually shorter and less keyword-shaped than the title. */
  heading: string;
  /** One-sentence summary, used on the index card and as the lead paragraph. */
  standfirst: string;
  /** ISO date. Shown on the page and emitted as `datePublished`. */
  published: string;
  /**
   * ISO date of the last substantive revision, emitted as `dateModified`.
   *
   * Omit until the guide is actually revised — it falls back to `published`.
   * Bumping this without changing the content is the fastest way to teach
   * Google that our dates mean nothing, and a price-driven number changing
   * underneath the prose does not count as a revision.
   */
  updated?: string;
  /** Rough read time in minutes. Counted, not guessed — see readMinutes(). */
  category: string;
  /** The service this guide leads to. Drives the CTA and the related links. */
  service: ServiceId;
  /**
   * The short answer, up top, before anything else.
   *
   * This is the block an AI answer engine lifts and the block a reader in a
   * hurry actually needs. Written to stand alone out of context.
   */
  answer: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
}

/** Catalogue prices, read live so a price-book change updates the prose. */
function price(service: ServiceId, packageId: string): string {
  const pkg = findPackage(service, packageId);
  return pkg?.from === undefined ? "custom quote" : formatDollars(pkg.from);
}

function cheapest(service: ServiceId): string {
  const detail = getServiceDetail(service);
  const priced = (detail?.packages ?? []).filter((p) => !p.custom && p.from !== undefined);
  if (priced.length === 0) return "custom quote";
  return formatDollars(Math.min(...priced.map((p) => p.from as number)));
}

export const GUIDES: Guide[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "move-out-cleaning-checklist",
    title: "Move-Out Cleaning Checklist for Kansas City Renters",
    description:
      "What landlords in Missouri and Kansas actually check at move-out, room by room, and the five jobs that cost most tenants their deposit.",
    heading: "The move-out cleaning checklist that gets your deposit back",
    standfirst:
      "Room by room, what a landlord inspects, what they can legally deduct, and where the money actually goes missing.",
    published: "2026-08-09",
    category: "Cleaning",
    service: "cleaning",
    answer:
      "A move-out clean is a deep clean plus everything a deep clean normally skips: inside the oven and fridge, inside every cabinet and drawer, interior window glass and tracks, and scuff marks off the walls. The property has to come back close to how you got it, minus fair wear and tear. In both Missouri and Kansas your landlord has 30 days after the tenancy ends to return the deposit or send you an itemised list of what they held back and why.",
    sections: [
      {
        heading: "What your landlord is legally allowed to keep",
        body: [
          "This is worth getting straight before you start scrubbing, because it decides where your effort is worth spending.",
          "A landlord can deduct for damage and for cleaning beyond normal use. They cannot deduct for fair wear and tear — carpet flattened along the hallway you walked down for two years is wear. A wine stain ground into that same carpet is damage. Faded paint is wear. Crayon on the paint is damage.",
          "In Missouri, RSMo 535.300 gives the landlord 30 days from the end of the tenancy to return the deposit or provide a written itemised list of deductions. Miss that, and a tenant can sue for up to twice the deposit. In Kansas, KSA 58-2550 also sets 30 days, and a landlord who wrongfully withholds can be liable for one and a half times the amount.",
          "Practical consequence: photograph everything on your last day, timestamped, before you hand the keys over. It costs ten minutes and it is the only evidence you will have.",
        ],
        note: "This is a plain-English summary, not legal advice. If a deposit dispute goes past a phone call, talk to a tenant advice line or a lawyer.",
      },
      {
        heading: "Kitchen — where most deductions come from",
        body: [
          "If you only have time for one room, make it this one. Kitchens are where inspections slow down and where the expensive line items live.",
        ],
        list: [
          "Inside the oven: racks out, glass door degreased on both sides, and the cavity properly stripped. A baked-on oven is the single most common deduction we hear about.",
          "Inside and behind the fridge. Empty it, wash the shelves and drawers, and pull it out to clean the floor underneath. Leave the door ajar if the power is going off.",
          "Inside every cabinet and drawer, including the crumbs in the corners and the liner nobody has lifted since move-in.",
          "Extractor hood filter — degreased or replaced. Landlords check it because tenants never do.",
          "Sink, taps and drain, descaled. Kansas City water leaves visible limescale on chrome.",
          "Splashback and the wall behind the hob, back to the paint.",
        ],
      },
      {
        heading: "Bathrooms",
        list: [
          "Limescale off the shower screen, tiles and taps. Vinegar and time beats scrubbing hard.",
          "Grout and silicone: mould treated, not painted over. A blackened silicone line reads as neglect even in an otherwise spotless room.",
          "Toilet including the base, the hinges and the pipe behind it.",
          "Extractor fan cover, which will be grey with dust.",
          "Mirror and cabinet, inside and out.",
        ],
      },
      {
        heading: "Everywhere else",
        list: [
          "Interior window glass, sills and the tracks the sliders run in. Tracks are the classic miss.",
          "Skirting boards, door frames and switch plates, wiped rather than dusted.",
          "Light fittings and ceiling fan blades.",
          "Wall scuffs spot-cleaned. Do not repaint a patch unless you can match the colour — a mismatched square is worse than the mark.",
          "Carpets vacuumed, and shampooed if your lease says so. Check the lease; plenty of KC leases require professional carpet cleaning with a receipt.",
          "Garage, basement and any storage cupboard swept out and emptied. Anything you leave becomes a disposal charge.",
          "Bins emptied and washed, not left full on the drive.",
        ],
      },
      {
        heading: "Do it yourself if…",
        body: [
          "You have two full days, the property is under about 1,200 square feet, you kept on top of it while you lived there, and your lease has no professional-cleaning clause. A determined weekend genuinely does it.",
          "Hire someone if the oven has not been cleaned in a year, if you are handing keys over on the same day you move out, if the lease requires a receipt from a professional, or if the deposit at stake is more than the cost of the clean — which it usually is.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          `Our move-in/move-out clean starts at ${price("cleaning", "move")} and takes five to eight hours on an empty property. That covers everything in the deep clean plus the oven, the fridge, inside all cabinets, interior window glass and wall spot-cleaning.`,
          `For comparison, a standard clean of an occupied home starts at ${price("cleaning", "standard")} and a deep clean at ${price("cleaning", "deep")}. The move-out tier costs more because an empty property means every surface is reachable, and reachable means expected.`,
          "Book it for the day after the van leaves, not the same day. Cleaning around boxes is slower, and a crew working around your furniture cannot do the job the inspection is about to check.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does a move-out clean take?",
        a: "Five to eight hours for a typical two or three bedroom home, with a crew rather than one person. An empty property takes longer than people expect because everything is reachable — inside cabinets, behind appliances, window tracks — and all of it gets inspected.",
      },
      {
        q: "Should I clean before or after the movers?",
        a: "After. Cleaning around furniture and boxes takes longer and leaves marks where things stood. Book the clean for the day after the property is empty, and before your final walkthrough with the landlord.",
      },
      {
        q: "Does move-out cleaning include carpet shampooing?",
        a: "Not as standard, ours included. Carpet extraction is a separate job with separate equipment. Check your lease first — a lot of Kansas City leases require professional carpet cleaning with a receipt, and if yours does, get it done and keep the paperwork.",
      },
      {
        q: "Will a professional clean guarantee I get my deposit back?",
        a: "No, and be suspicious of anyone who says otherwise. Cleaning addresses cleaning deductions. It does nothing about a damaged worktop or a hole in a door. What it does is remove the most common and most subjective category of deduction from the conversation.",
      },
      {
        q: "How long does my landlord have to return the deposit?",
        a: "Thirty days after the tenancy ends, in both Missouri and Kansas. They must either return it in full or send an itemised written list of what they kept and why. Missing that deadline exposes the landlord to damages in both states.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "trash-bin-cleaning-worth-it",
    title: "Is Trash Bin Cleaning Worth It? An Honest Look",
    description:
      "What a bin cleaning service actually removes, what it costs in Kansas City, and the three situations where it is genuinely worth paying someone to do it.",
    heading: "Is trash bin cleaning actually worth paying for?",
    standfirst:
      "What the wash really removes, what it costs per year, and when you should just do it yourself with a hose.",
    published: "2026-08-09",
    updated: "2026-08-10",
    category: "Bin cleaning",
    service: "bin",
    /*
     * REWRITTEN 2026-08-10.
     *
     * The original version of this guide argued that heat was the whole point —
     * "water at around 200°F", "the heat is the whole point", a FAQ answering
     * "how hot is the water". Our rig is not heated, so the guide was selling a
     * service we do not run and arguing against our own product in the DIY
     * section. Every temperature claim is gone.
     *
     * What replaced it is the true mechanism: the smell is a film, and a film
     * comes off with pressure, detergent and contact time. That argument does
     * not need a number we cannot stand behind, and it survives a customer
     * asking us a direct question about our equipment.
     */
    answer:
      "For most households, yes — but on a recurring plan, not as one-off cleans. The smell in a bin is a film of dried residue on the walls and lid, and it takes pressure, a detergent and a few minutes of contact to lift it; a rinse with a garden hose mostly moves it around. It is worth paying for if your bins live near the house, you have pets or kids in diapers, or you have a raccoon problem. It is not worth it if your bins sit at the end of a long driveway and you are happy to tip them over and scrub them twice a year.",
    sections: [
      {
        heading: "What the service actually does",
        body: [
          "The crew comes on or after your collection day, while the bin is empty. The bin goes onto the truck, gets pressure washed inside and out with a biodegradable detergent — walls, base, rim and lid — and comes back to your curb washed and draining. The detergent is biodegradable, which is the part that matters for what ends up on your driveway and in the gutter.",
          "The mechanism is worth understanding, because it tells you whether you are being sold something real. What smells is not loose trash; it is a thin film of dried organic residue bonded to the plastic, and the bacteria living in it. Pressure breaks the film up, detergent lifts what pressure alone leaves bonded, and contact time lets the detergent work. A garden hose gives you water at low pressure with no detergent and no dwell, which is why the smell comes back within a day.",
        ],
        note: "Our rig runs unheated. Some operators use heated water, which does help lift grease faster — if one quotes you a temperature, that is a fair question to ask them to back up. We would rather tell you what ours does than claim a number we have not measured.",
      },
      {
        heading: "What it costs",
        body: [
          `One-off cleans run around $20–$25 per bin nationally. Recurring plans are where the price drops: ours start at ${cheapest("bin")} a month, and a one-time two-bin clean is ${price("bin", "onetime")}.`,
          "Annually that is somewhere between $180 and $320 a bin depending on frequency — real money, and the reason to be honest about whether you need it.",
        ],
        table: {
          columns: ["Frequency", "Best for", "Roughly"],
          rows: [
            ["One-off", "After a pest problem, a spill, or before selling", "$20–$25 per bin"],
            ["Monthly", "Households with pets, diapers, or bins near the house", "$180–$300 a year"],
            ["Quarterly", "Most households — the sensible default", "$80–$120 a year"],
          ],
        },
      },
      {
        heading: "The three cases where it clearly pays",
        list: [
          "Bins stored close to the house, a side door, or under a window. Smell travels, and in a Kansas City July it travels a lot.",
          "Households with dogs, cats, or children in diapers. Both put protein waste in the bin every single day, which is what maggots need.",
          "A raccoon or rodent problem. Animals are drawn by residue, not by the bin. Clean the residue and you remove the reason they keep coming back.",
        ],
      },
      {
        heading: "When to skip it",
        body: [
          "If your bins live at the end of a long driveway, you bag everything, and you are willing to tip them on their side, scrub them with a stiff brush and some detergent and let them dry in the sun twice a year — that genuinely covers it. You will spend ten minutes and some water and get most of the benefit.",
          "The honest version: a cleaned bin does not stay clean. It gets dirty again the next time you fill it. What a recurring plan buys is a ceiling on how bad it gets, not a permanently pristine bin. Anyone selling it as the latter is overselling it.",
        ],
        note: "Ask any operator what they put in the bin. A biodegradable detergent and a rinse is a different thing from a solvent, and it is the question worth asking before you let someone spray something onto the ground next to your house.",
      },
    ],
    faqs: [
      {
        q: "Does the water have to be hot?",
        a: "No. Heat speeds up grease removal, but the work is done by pressure, detergent and contact time — that is what breaks up the dried film the smell comes from. Our rig runs unheated, and we would rather say so than quote a temperature we have not measured.",
      },
      {
        q: "What do you actually put in the bin?",
        a: "A biodegradable detergent for the wash, and a biodegradable deodorizing treatment afterwards. Nothing that needs to be kept away from pets, kids or planting beds. We do not publish a bacterial kill rate, because we have not had ours tested and a number nobody measured is worth nothing.",
      },
      {
        q: "How often should trash bins be cleaned?",
        a: "Quarterly suits most households. Monthly is worth it if you have pets, small children, or bins stored close to the house. Anything more frequent than monthly is hard to justify unless something has gone wrong.",
      },
      {
        q: "Do I need to be home for bin cleaning?",
        a: "No. We come on or after your collection day while the bins are still at the curb, clean them there, and leave them where we found them. Nothing needs unlocking and nobody needs to be in.",
      },
      {
        q: "Can I just clean my own bin?",
        a: "Yes, and for some households that is the right answer. Tip it over, hose it out, use a stiff brush and a detergent, and let it dry in the sun. You will not get the pressure or the dwell time we get, but you will get a lot of the benefit for free.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "power-washing-vs-pressure-washing",
    title: "Power Washing vs Pressure Washing vs Soft Wash",
    description:
      "The difference is heat and pressure, and picking wrong cracks siding or etches concrete. Which method suits which surface on a Kansas City home.",
    heading: "Power washing, pressure washing, soft washing: which one your house needs",
    standfirst:
      "Three different jobs that get used as one word. Choosing wrong is how vinyl siding cracks and concrete comes back striped.",
    published: "2026-08-09",
    updated: "2026-08-10",
    category: "Exterior",
    service: "power",
    answer:
      "Pressure washing is high-pressure unheated water. Power washing is the same thing with heat added, which is what breaks down grease and oil. Soft washing is low pressure — around 150 to 300 PSI — with a cleaning solution doing the work instead of force. Concrete and brick can take pressure. Vinyl siding, painted wood and roofs need soft wash, and hitting them with a pressure washer is how panels crack and paint comes off.",
    sections: [
      {
        heading: "The actual difference",
        table: {
          columns: ["Method", "How it works", "Right for"],
          rows: [
            [
              "Pressure washing",
              "Unheated water, roughly 1,300–3,100 PSI",
              "Concrete drives, sidewalks, brick, stone",
            ],
            [
              "Power washing",
              "The same, with heated water",
              "Oil stains, grease, gum, rust marks on concrete",
            ],
            [
              "Soft washing",
              "150–300 PSI plus a cleaning solution",
              "Vinyl and painted siding, roofs, decks, fences",
            ],
          ],
        },
        body: [
          "In everyday use \"power washing\" and \"pressure washing\" get swapped around freely, including by companies that should know better. What matters is not the label on the van. It is whether the person holding the wand changes method when they move from your driveway to your siding.",
        ],
        note: "Ours included, to be straight about it: our service is listed as power washing because that is what people search for, but the rig runs unheated. That means pressure washing and soft washing on our equipment, and it is why the section below on oil stains tells you to get a specialist rather than telling you to book us.",
      },
      {
        heading: "What goes wrong when the method is wrong",
        list: [
          "Vinyl siding: high pressure cracks panels and forces water up behind them, where it sits against the sheathing. The damage does not show up until it is expensive.",
          "Painted wood: pressure strips paint. You will see it immediately, in stripes.",
          "Roof shingles: pressure lifts granules off asphalt shingles and takes years off the roof. Roofs are a soft wash job, always.",
          "Concrete: too much pressure held too long etches the surface and leaves visible wand marks. Aggregate finishes are especially unforgiving.",
          "Old mortar: pressure blows out soft joints in older brickwork, which is common on the pre-war housing stock across the KC metro.",
        ],
      },
      {
        heading: "What a Kansas City house typically needs",
        body: [
          "Most properties here need both methods in one visit, which is exactly why the distinction matters.",
          "The north-facing side of a house grows green algae because it stays damp. That is a soft wash with a cleaning solution — the growth is biological, and killing it is what stops it coming straight back. Blasting it off with pressure removes what you can see and leaves what you cannot, which is why it returns within a season.",
          "Driveways and paths are the opposite problem: no delicate surface to protect, and stains that need force. Moss, algae and general grime want pressure and a decent surface cleaner rather than a wand, which is what stops the striping. Set oil and rust aside — they are the one case on a driveway where cold pressure genuinely will not finish the job, and they are covered below.",
        ],
        note: "A useful test when you get a quote: ask what pressure they will use on the siding. If the answer is the same as for the driveway, keep calling.",
      },
      {
        heading: "The one job we turn down",
        body: [
          "Set-in motor oil and rust on concrete need heat, and our rig does not have it. Cold water and pressure will lighten an oil patch and leave a shadow, and the shadow is what you will notice every time you park.",
          "So if that is the job, hire someone running a heated machine, or budget for a degreaser and a poultice rather than a wash. We would rather say that here than take the booking and hand back a driveway with a grey ghost on it.",
        ],
      },
      {
        heading: "What we charge",
        body: [
          `Siding starts at ${formatDollars(SERVICE_BY_ID.power.subservices.find((s) => s.name === "Siding")?.from ?? 0)}, driveways at ${formatDollars(SERVICE_BY_ID.power.subservices.find((s) => s.name === "Driveway")?.from ?? 0)}, decks and patios at ${formatDollars(SERVICE_BY_ID.power.subservices.find((s) => s.name === "Deck / Patio")?.from ?? 0)}. Those are floor prices for a typical suburban property — square footage and how bad the staining is move the number, which is why we look before we commit to it.`,
          "Doing siding and the driveway in one visit is cheaper than two visits, because most of the cost is setup and water, not time on the wand.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is power washing the same as pressure washing?",
        a: "Almost. The difference is heat: a power washer heats the water, a pressure washer does not. Heat is what breaks down oil, grease and gum, so it matters on a stained driveway and matters very little on general dirt. Ours runs unheated, so on a set-in oil patch we will tell you to call someone with a heated rig rather than take your money and leave a shadow.",
      },
      {
        q: "Can you pressure wash vinyl siding?",
        a: "You should not. High pressure cracks the panels and drives water behind them. Vinyl is a soft wash job — low pressure and a cleaning solution that kills the algae rather than just knocking it off.",
      },
      {
        q: "How often should a house be washed in Kansas City?",
        a: "Siding roughly once a year, usually spring, because our humidity grows algae on shaded elevations. Driveways every year or two depending on tree cover and how much oil they see.",
      },
      {
        q: "Will pressure washing damage my concrete driveway?",
        a: "It can, if the pressure is too high or the wand is held in one place too long. That is what causes etching and visible stripes. A surface cleaner attachment rather than a bare wand is what keeps the finish even.",
      },
      {
        q: "Do you need to use my water?",
        a: "Yes, an outside spigot. We bring everything else. If the water is off at the property, tell us beforehand and we will plan around it.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "house-cleaning-cost-kansas-city",
    title: "House Cleaning Cost in Kansas City: 2026 Prices",
    description:
      "What house cleaning actually costs across the Kansas City metro, why deep cleans cost double, and how to tell a real quote from a lowball one.",
    heading: "What house cleaning costs in Kansas City",
    standfirst:
      "Real 2026 numbers for the metro, what moves the price, and the quote patterns worth walking away from.",
    published: "2026-08-09",
    category: "Cleaning",
    service: "cleaning",
    answer:
      "Across the Kansas City metro, a standard house clean runs about $120 to $200 for a typical home, with flat rates averaging around $170. A one-off deep clean runs $200 to $450 because it covers everything a standard clean skips. Recurring visits cost less per visit than one-offs — weekly is cheapest per visit, monthly the most expensive, because a house cleaned often takes less time.",
    sections: [
      {
        heading: "The numbers",
        table: {
          columns: ["Type of clean", "KC metro range", "What we charge"],
          rows: [
            ["Standard / upkeep clean", "$120–$200", `from ${price("cleaning", "standard")}`],
            ["Deep clean (one-off)", "$200–$450", `from ${price("cleaning", "deep")}`],
            ["Move-in / move-out", "$250–$450", `from ${price("cleaning", "move")}`],
            ["Short-let turnover", "$80–$150", `from ${price("cleaning", "turnover")}`],
          ],
        },
        body: [
          "Hourly pricing is the other model you will see, usually $20 to $75 an hour depending on whether you are hiring an individual or a company. We do not price by the hour, and neither should anyone quoting you for a defined job — hourly pricing makes working slowly profitable, and it means you cannot know the bill until it arrives.",
        ],
      },
      {
        heading: "What actually moves the price",
        list: [
          "Bathrooms, more than bedrooms. A bathroom is the slowest room in any house and the count drives the quote more than square footage does.",
          "Condition, not size. A four-bed kept on top of is faster than a two-bed that has not had a proper clean in a year, and any quote that ignores this is a quote that will get revised on the day.",
          "Frequency. Weekly and bi-weekly visits are cheaper per visit because there is less to do each time.",
          "Pets. Hair gets into upholstery and carpet and adds real time. Say so up front; it is not a surcharge, it is a scheduling fact.",
          "Add-ons that are not standard anywhere: inside the oven, inside the fridge, interior windows, laundry.",
        ],
      },
      {
        heading: "Why a deep clean costs roughly double",
        body: [
          "Because it is a different job, not a longer version of the same one.",
          "A standard clean is upkeep: surfaces, floors, bathrooms, kitchen, bins. Two to three hours. A deep clean adds baseboards, door frames, switch plates, inside the microwave, cabinet fronts, window sills and tracks, light fittings, ceiling fans, limescale removal, and moving furniture to get behind it. Four to six hours, and most of the added time is on things that have never been cleaned rather than things cleaned last month.",
          "Most companies, us included, want a deep clean first if a property has not had one in a while. It is not an upsell so much as the only way a recurring standard clean stays inside its time.",
        ],
      },
      {
        heading: "Quotes worth walking away from",
        list: [
          "A price quoted with no questions about bathroom count or condition. It will be revised on the day, upward.",
          "Hourly with no cap and no estimate of hours.",
          "No proof of insurance when you ask. Ask. A general liability certificate should arrive by email within the hour.",
          "A price far under the range above. Someone is unvetted, being paid badly, or cutting the time on site to nothing, and none of those are your problem until something goes wrong in your house.",
          "No written list of what is included. \"Deep clean\" means whatever the company decides it means once they are standing in your kitchen.",
        ],
      },
      {
        heading: "Doing it yourself",
        body: [
          "A standard clean of a small, well-kept home is two or three hours of your own time. If that time is worth less to you than $120, do it yourself — that is a straightforward trade and there is no reason to dress it up.",
          "The calculation changes for deep cleans and move-outs. Those are five to eight hours, need equipment most people do not own, and are the ones where doing it badly has a cost attached: a failed inspection, a withheld deposit, a second attempt.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does house cleaning cost in Kansas City?",
        a: "A standard clean runs roughly $120 to $200 for a typical home, averaging around $170 flat-rate across the metro. A one-off deep clean runs $200 to $450. Bathroom count and the current condition of the house move that figure more than square footage does.",
      },
      {
        q: "Is it cheaper to book recurring cleaning?",
        a: "Per visit, yes. A house cleaned weekly or bi-weekly takes less time each visit than one cleaned monthly, and the price follows the time. The catch is that most companies want an initial deep clean before starting a recurring plan.",
      },
      {
        q: "Do I need to be home during the clean?",
        a: "No. Most of our recurring customers are not. We arrange access on the confirmation call — a key, a code, or a neighbour — and note anything we need to know about pets or alarms.",
      },
      {
        q: "What is not included in a standard clean?",
        a: "Inside the oven, inside the fridge, interior window glass, walls and baseboards, and garages or basements. All of those are either deep-clean items or add-ons, and any company that will not tell you which is which before booking is worth a second look.",
      },
      {
        q: "Do you bring your own supplies?",
        a: "Yes, everything including the vacuum. If you would rather we used a specific product on a particular surface — a sealed stone worktop, say — leave it out and tell us in the booking notes.",
      },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g])
);

export const GUIDE_SLUGS: string[] = GUIDES.map((g) => g.slug);

export function guidePath(slug: string): string {
  return `/guides/${slug}`;
}

/**
 * Read time, counted from the actual words rather than typed in by hand.
 *
 * 220wpm is the usual figure for non-technical prose. Counting it means the
 * number cannot drift out of step when a section is added or cut, which is
 * exactly what happens to a hand-maintained one.
 */
export function readMinutes(guide: Guide): number {
  const text = [
    guide.standfirst,
    guide.answer,
    ...guide.sections.flatMap((s) => [
      s.heading,
      ...(s.body ?? []),
      ...(s.list ?? []),
      ...(s.table?.rows.flat() ?? []),
      s.note ?? "",
    ]),
    ...guide.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

/** Other guides pointing at the same service, for the related-reading block. */
export function relatedGuides(slug: string, limit = 2): Guide[] {
  const current = GUIDE_BY_SLUG[slug];
  if (!current) return [];
  const sameService = GUIDES.filter((g) => g.slug !== slug && g.service === current.service);
  const rest = GUIDES.filter((g) => g.slug !== slug && g.service !== current.service);
  return [...sameService, ...rest].slice(0, limit);
}
