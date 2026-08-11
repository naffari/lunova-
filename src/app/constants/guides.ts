import { BIN_ADDON, formatDollars, type ServiceId } from "./services";
import { findPackage } from "./serviceDetails";

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
     * REWRITTEN TWICE.
     *
     * The first version argued that heat was the whole point — "water at around
     * 200F", "the heat is the whole point", a FAQ answering "how hot is the
     * water". No rig here is heated, so the guide was selling a service nobody
     * runs and arguing against its own product in the DIY section.
     *
     * The second version fixed the temperature and left everything else: a crew
     * arriving on collection day, a bin going ONTO THE TRUCK, a PRESSURE WASH,
     * and recurring plans priced per month. None of that exists either. There
     * is no pressure washer, no truck rig and no route with subscribers on it.
     *
     * This version describes the only thing that is real: two bins scrubbed out
     * by hand while the crew is already at the property for a clean or a
     * detail. The argument for the service did not actually need any of the
     * equipment — the mechanism is the film, and a stiff brush with detergent
     * and contact time removes a film. That case stands on its own and survives
     * a customer asking a direct question about the gear.
     */
    answer:
      "For most households, twice a year, and as an add-on rather than a standalone visit. The smell in a bin is a film of dried organic residue bonded to the plastic, and lifting it takes a detergent, a stiff brush and a few minutes of contact — a rinse with a garden hose mostly moves it around. It is worth paying for if your bins live near the house, or you have pets or children in diapers. It is not worth a special trip from anybody, ours included: at $20-30 a bin, the drive costs more than the job.",
    sections: [
      {
        heading: "What the service actually does",
        body: [
          "The bin gets tipped, and every interior face plus the rim and the lid gets worked over with a stiff brush and a biodegradable detergent, then rinsed out and treated with a deodoriser. That is the whole job, and it takes about fifteen minutes for two bins.",
          "The mechanism is worth understanding, because it tells you whether you are being sold something real. What smells is not loose trash; it is a thin film of dried organic residue bonded to the plastic, and the bacteria living in it. Agitation breaks the film up, detergent lifts what the brush leaves bonded, and contact time lets the detergent work. A garden hose gives you water with no detergent and no dwell, which is why the smell is back within a day.",
        ],
        note: "We scrub by hand. We do not own a pressure washer and we do not run a truck-mounted rig, and you should assume any operator who does not tell you what their equipment is does not want you to ask. Pressure is faster than a brush, but it is not the ingredient doing the work.",
      },
      {
        heading: "What it costs, and why nobody should drive across town for it",
        body: [
          `One-off cleans run around $20-25 a bin nationally. Ours is ${formatDollars(BIN_ADDON.price)} for two and ${formatDollars(BIN_ADDON.perExtraBin)} for each one after that, and it is only available added onto a house clean or a car detail.`,
          "That restriction is the honest part of the pricing rather than a catch. Two bins is fifteen minutes of work. A round trip across the Kansas City metro is most of an hour of committed time before anyone picks up a brush, so a standalone bin visit either costs four times as much or gets done in four minutes. Bolted onto a job at the same address, the drive is already paid for, and the fifteen minutes earns a fair rate.",
          "Subscription bin rounds — the ones that quote you a monthly figure — work on exactly the same logic in reverse. They need hundreds of subscribers packed onto tight routes before the rig pays for itself, which is why they sell contracts rather than visits. It is a real business; it is just a different one, and it is not this one.",
        ],
        table: {
          columns: ["How you buy it", "Best for", "Roughly"],
          rows: [
            ["Added to a clean or a detail", "Anyone already booking us", "$29 for two bins"],
            ["A subscription route", "Households wanting it handled monthly, hands-off", "$180-300 a year"],
            ["Yourself, twice a year", "Bins at the end of a long driveway", "Ten minutes and some water"],
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
          "If your bins live at the end of a long driveway, you bag everything, and you are willing to tip them on their side, scrub them with a stiff brush and some detergent and let them dry in the sun twice a year - that genuinely covers it. You will spend ten minutes and some water and get most of the benefit. It is the same method we use.",
          "The honest version: a cleaned bin does not stay clean. It gets dirty again the next time you fill it. What the service buys is a ceiling on how bad it gets, not a permanently pristine bin. Anyone selling it as the latter is overselling it.",
        ],
        note: "Ask any operator what they put in the bin. A biodegradable detergent and a rinse is a different thing from a solvent, and it is the question worth asking before you let someone spray something onto the ground next to your house.",
      },
    ],
    faqs: [
      {
        q: "Can I book bin cleaning on its own?",
        a: "Not from us. Two bins is about fifteen minutes and a round trip across the metro is closer to an hour, so a standalone visit would have to cost four times as much to be worth doing. Add it to a house clean or a car detail and the drive is already covered. If bins are genuinely all you want, a subscription route operator is the right call and we will say so.",
      },
      {
        q: "Does the water have to be hot?",
        a: "No. Heat speeds up grease removal, but the work is done by detergent, agitation and contact time - that is what breaks up the dried film the smell comes from. Ours is scrubbed by hand with cold water, and we would rather say so than quote a temperature nobody has measured.",
      },
      {
        q: "What do you actually put in the bin?",
        a: "A biodegradable detergent for the wash, and a biodegradable deodorising treatment afterwards. Nothing that needs to be kept away from pets, kids or planting beds. We do not publish a bacterial kill rate, because we have not had ours tested and a number nobody measured is worth nothing.",
      },
      {
        q: "How often should trash bins be cleaned?",
        a: "Twice a year suits most households, and once more in high summer if you have a dog or put food waste in the bin. Anything more frequent than monthly is hard to justify unless something has gone wrong.",
      },
      {
        q: "Do the bins need to be empty?",
        a: "Yes. Anytime after your collection day is the easy window. A bin with a full bag still in it cannot be washed, and if we arrive to one we will take the bin cleaning off the invoice rather than charge you for a rinse.",
      },
      {
        q: "Can I just clean my own bin?",
        a: "Yes, and for some households that is the right answer. Tip it over, hose it out, use a stiff brush and a detergent, and let it dry in the sun. That is the same method we use - what you are buying from us is not a secret technique, it is fifteen minutes you do not spend and a job you do not have to think about.",
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

  /*
    The detailing guide. Added because the site had four guides and every one
    of them pointed at cleaning or at a service that is now parked — so half
    the business had no content answering the question people actually search
    before they book it, which is what it costs.
  */
  {
    slug: "mobile-detailing-cost-kansas-city",
    title: "Mobile Detailing Prices in Kansas City (2026)",
    description:
      "What mobile detailing costs in Kansas City, what separates a wash from a full detail, and when the cheaper option is genuinely the right one.",
    heading: "What mobile detailing actually costs in Kansas City",
    standfirst:
      "The real price ranges in this metro, what each tier includes, and the three jobs where paying more changes nothing.",
    published: "2026-08-10",
    category: "Auto detailing",
    service: "auto",
    answer:
      `In Kansas City, a mobile exterior wash runs roughly ${price("auto", "express")} to $150, an interior detail ${price("auto", "interior")} to $400, and a full interior-and-exterior detail ${price("auto", "full")} to $450. Vehicle size and interior condition move the number more than anything else: a three-row SUV that has carried a dog and two children is a materially longer job than a garage-kept sedan, and any quote that ignores both is a quote that will change on the day.`,
    sections: [
      {
        heading: "The three tiers, and what actually separates them",
        body: [
          "Almost every detailer sells some version of the same three tiers, under different names. What changes between them is not thoroughness in the abstract — it is which surfaces get touched and whether anything is done to the paint itself.",
        ],
        table: {
          columns: ["Tier", "What it covers", "Typical KC price"],
          rows: [
            [
              "Wash / express",
              "Exterior hand wash, wheels, glass, tyre dressing. Nothing inside.",
              `${price("auto", "express")}–$150`,
            ],
            [
              "Interior detail",
              "Full vacuum, seats and carpets cleaned, plastics and vents detailed, glass. Nothing outside.",
              `${price("auto", "interior")}–$400`,
            ],
            [
              "Full detail",
              "Both of the above, plus decontamination and a machine polish, plus protection on the paint.",
              `${price("auto", "full")}–$450`,
            ],
          ],
        },
        note:
          "Paint correction and ceramic coating are a separate category, not a tier. Those run several hundred to a few thousand dollars, take one or two days, and are worth buying only from someone who can show you their work. We do not currently offer them.",
      },
      {
        heading: "What actually moves the price",
        list: [
          "Vehicle size. A large SUV or van has roughly twice the interior surface of a coupe, and it is time rather than product that costs.",
          "Interior condition. Pet hair, ground-in food and smoke are the three that add real hours, and pet hair in particular is charged separately by most detailers because it is genuinely slow.",
          "Where the vehicle is. A mobile detailer needs space to open every door and, unless they carry a tank, an outdoor tap. A car in a parking garage may be a no rather than a surcharge.",
          "How long it has been. This is the one people underestimate. Sap, bug residue and hard-water spotting all bond to the surface and, given a season, start etching what is underneath.",
        ],
      },
      {
        heading: "Mobile or a shop?",
        body: [
          "A shop has power, lighting, water and a controlled space, which genuinely matters for heavy correction work. Mobile has one advantage that beats all of that for ordinary jobs: the car gets done while you are doing something else, and you never lose a Saturday to sitting in a waiting room.",
          "The honest rule is that anything short of multi-stage paint correction is well suited to mobile. Correction is not, and anyone offering to do a two-day ceramic coating in your driveway in February is describing a job that will not cure properly.",
        ],
      },
      {
        heading: "When not to pay for a detail",
        body: [
          "This is the section most detailers will not write, so here it is.",
        ],
        list: [
          "If you are selling the car this month, an exterior wash and a solid interior vacuum gets you most of the visible gain. A full detail rarely returns its cost on a private sale.",
          "If the paint has clear-coat failure — flaking or peeling rather than dull — polishing cannot fix that, and anyone who says otherwise is selling you a result they cannot deliver. That is a respray.",
          "If it is a lease return, check the wear standard first. It is usually far cheaper than a detail, and it is the actual thing you will be judged against.",
          "If the car is genuinely clean and garage-kept, an express wash every few weeks holds it. You do not need the full tier three times a year.",
        ],
      },
      {
        heading: "The things that are worth paying for",
        list: [
          "Headlight restoration on anything over about eight years old. Hazed lenses are the single most visible sign of age on a car and among the cheapest to fix.",
          "Pet hair removal, if you have it. It is slow, unpleasant work and it is the one job where paying someone is obviously worth it.",
          "Getting bug residue and sap off sooner rather than later. Both are acidic or bonding, and both etch paint if left a season. The cheap job now avoids the expensive one later.",
          "A sealant after any full detail. It is the difference between the result lasting weeks and lasting months.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does a full detail take?",
        a: "Three to four hours for a normal vehicle in normal condition, and longer for a large SUV or a heavy interior. Anyone promising a full interior-and-exterior detail in an hour is describing a wash.",
      },
      {
        q: "Do you need my water and power?",
        a: "For now we need access to an outdoor tap. We bring everything else. That means a driveway or a lot with a spigot within reach — it is the one thing worth checking before you book.",
      },
      {
        q: "How often should a car be detailed?",
        a: "Twice a year covers most people, with a wash in between. A car that lives outdoors under trees or does heavy highway miles benefits from more; a garage-kept car that is washed properly needs less.",
      },
      {
        q: "Is machine polishing safe on my paint?",
        a: "A single-stage polish on a dual-action machine is low risk, which is why it is the standard step in a full detail. Multi-stage correction removes materially more clear coat and is not something to buy from someone without a portfolio, ourselves included — we do not offer it.",
      },
      {
        q: "What is the cheapest useful thing I can buy?",
        a: `An express wash, at ${price("auto", "express")}. It will not fix paint, but a properly hand-washed car with clean wheels and glass looks dramatically better than most people expect, and it does not put swirl marks in the paint the way an automatic wash does.`,
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
