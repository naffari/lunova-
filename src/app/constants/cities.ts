/**
 * The service-area city catalogue. One record per city we work in.
 *
 * WHY THIS FILE IS LONG AND HAND-WRITTEN
 *
 * Lunova is a service-area business. No storefront, no map pin, so Google
 * cannot rank it on proximity and falls back on relevance and prominence. The
 * on-page half of that is a real page per city.
 *
 * The shortcut, one template with the city name substituted in, is what Google
 * calls a doorway page. It has demoted or deindexed those since 2015, and a
 * dozen near-identical pages would be worse than having no city pages at all.
 *
 * So every record below carries facts only true of that city: its county, its
 * neighborhoods, the age and construction of its housing, and the work that
 * housing generates. If a field could be pasted into another city's record
 * unchanged, rewrite it.
 *
 * This file is also the only place the ZIP list lives. constants/serviceArea.ts
 * builds its coverage lookup from here, so the checker and the city pages
 * cannot disagree about where we work.
 *
 * ADDING A CITY: add a record here and nothing else. routeConfig expands
 * `/service-areas/:city` from CITY_SLUGS, the sitemap script reads the slugs
 * out of this file, and the prerenderer picks up both.
 */

import type { ServiceId } from "./services";

export interface CityServiceFocus {
  /**
   * A catalogue id from constants/services.ts.
   *
   * Typed as the union rather than `string`: a mistyped id used to compile
   * fine and then resolve to `undefined` through SERVICE_BY_ID at runtime,
   * silently dropping the service from the city page's schema, its price list
   * and now its hero photo.
   */
  serviceId: ServiceId;
  heading: string;
  /** Why this service, in this city. */
  body: string;
}

export interface ServiceCity {
  /** URL segment: /service-areas/<slug> */
  slug: string;
  /** Bare city name, for prose. */
  name: string;
  state: "MO" | "KS";
  /** Display label. Matches the labels the booking wizard and ZIP checker use. */
  label: string;
  county: string;
  zips: string[];
  /** Approximate city-center coordinates, for the page's GeoCoordinates schema. */
  geo: { lat: number; lng: number };
  /** Real districts and neighborhoods, named in the copy. */
  neighborhoods: string[];
  /** Under 150 characters, leads with the city name. */
  metaDescription: string;
  /** Opening paragraph. Written to stand alone, since AI answer engines lift it. */
  intro: string;
  /** What is different about working here. Two or three, each specific to the city. */
  localNotes: { heading: string; body: string }[];
  /** The services this city's housing generates, most common first. */
  serviceFocus: CityServiceFocus[];
  /** Questions specific to this city. Feeds FAQPage schema on the city page. */
  faqs: { q: string; a: string }[];
  /** Adjacent city slugs, for internal linking. */
  nearby: string[];
}

export const SERVICE_CITIES: ServiceCity[] = [
  {
    slug: "kansas-city-mo",
    name: "Kansas City",
    state: "MO",
    label: "Kansas City, MO",
    county: "Jackson, Clay & Platte Counties",
    zips: [
      "64105", "64106", "64108", "64109", "64110", "64111", "64112", "64113",
      "64114", "64116", "64117", "64118", "64119", "64123", "64124", "64125",
      "64127", "64128", "64129", "64130", "64131", "64132", "64134", "64136",
      "64137", "64145", "64146", "64147", "64151", "64152", "64153", "64154",
      "64155", "64156", "64157", "64158",
    ],
    geo: { lat: 39.0997, lng: -94.5786 },
    neighborhoods: [
      "Brookside", "Waldo", "Westport", "River Market", "Hyde Park",
      "Crossroads", "the Northland", "Union Hill", "Columbus Park",
    ],
    metaDescription:
      "Cleaning, junk removal, power washing and landscaping in Kansas City, MO. Brookside to the Northland. Flat-rate quotes, local crews, same-week slots.",
    intro:
      "Lunova Services works across Kansas City, Missouri, from the century homes of Hyde Park and Brookside out to the newer subdivisions north of the river. Cleaning, junk removal, power washing, window cleaning, auto detailing, bin cleaning and landscaping, all flat-rate and booked online in about two minutes.",
    localNotes: [
      {
        heading: "Two kinds of housing stock in one city",
        body: "A pre-war four-square in Hyde Park and a 2015 build in Briarcliff have almost nothing in common. The old core means painted wood trim, storm windows, radiators, plaster, and basements that have been filling up since the Truman administration. The Northland means vinyl, engineered surfaces, and finished basements that flooded once. We quote them as the different jobs they are.",
      },
      {
        heading: "Street parking and alley access decide the crew size",
        body: "Junk removal in Westport or the Crossroads is a loading problem before it is a lifting problem. Narrow streets, permit parking, and alley dumpsters a 20-foot truck cannot reach. We plan the approach at the quote instead of discovering it on the day, which is why our Kansas City quotes ask where the truck can stop.",
      },
      {
        heading: "Loft and rental turnovers move fast",
        body: "Downtown and River Market run short turnarounds between tenants. Move-out cleans there usually get booked with 48 hours notice and have to pass a property manager's checklist rather than a homeowner's eye. We hold same-week slots across 64105 to 64111 for that reason.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Deep cleans for older homes",
        body: "Plaster dust, painted woodwork and hundred-year-old hardwood need gentler chemistry than a new build. Deep cleans in Brookside and Waldo are our most-booked Kansas City job.",
      },
      {
        serviceId: "junk",
        heading: "Basement and attic clear-outs",
        body: "Century homes come with century basements. Most of our junk work here is a full-basement clear-out with a stair carry, not a curbside pickup.",
      },
      {
        serviceId: "window",
        heading: "Divided-lite and storm windows",
        body: "Original wood windows with true divided lites take three times as long as a modern slider. We price by pane count in the older neighborhoods so the quote holds.",
      },
      {
        serviceId: "commercial",
        heading: "Crossroads offices and studios",
        body: "Converted warehouse space with polished concrete and exposed brick. Evening and weekend cleans so we are not working around your team.",
      },
    ],
    faqs: [
      {
        q: "Do you serve both sides of the river in Kansas City?",
        a: "Yes. We cover the Northland ZIPs from 64116 to 64158 as well as the central and southern city. Northland jobs run on their own routes, so booking two or three days ahead gets you a better slot than same-day.",
      },
      {
        q: "Can you get a junk truck down a Westport alley?",
        a: "Usually, but tell us when you book. If the alley is too tight we bring a smaller vehicle and do more trips. Price stays the same, we just need to know first.",
      },
      {
        q: "Do you clean downtown lofts and apartments?",
        a: "Yes, including move-out cleans against a property manager's checklist. If your building requires a loading dock or freight elevator booking, mention it so we can reserve the time.",
      },
    ],
    nearby: ["kansas-city-ks", "independence", "raytown", "prairie-village"],
  },

  {
    slug: "kansas-city-ks",
    name: "Kansas City",
    state: "KS",
    label: "Kansas City, KS",
    county: "Wyandotte County",
    zips: ["66101", "66102", "66103", "66104", "66105", "66106", "66109", "66111", "66112"],
    geo: { lat: 39.1141, lng: -94.6275 },
    neighborhoods: ["Strawberry Hill", "Argentine", "Turner", "Piper", "Rosedale", "the Legends"],
    metaDescription:
      "Home and property services in Kansas City, KS. Strawberry Hill to Piper. Cleaning, junk removal, pressure washing and landscaping at flat rates.",
    intro:
      "Lunova Services covers Wyandotte County, from the hillside bungalows of Strawberry Hill out to the newer builds around Piper. Housing here runs older and more owner-occupied than Johnson County, and most of what we do is exterior work and clear-outs rather than recurring maid service.",
    localNotes: [
      {
        heading: "Hillside lots turn exterior work into a rigging job",
        body: "Strawberry Hill and Rosedale are built into slopes. A driveway wash there runs downhill into a neighbor's yard unless it is staged properly, and gutter work on the low side of a hillside house often needs ladder standoffs rather than a straight set. We build that into the time, not into a surprise upcharge.",
      },
      {
        heading: "Detached garages and gravel alleys",
        body: "Much of the older grid has a detached garage off a rear alley, which is where thirty years of stored things end up. Garage clear-outs are the most common junk removal call we take in 66102 and 66104.",
      },
      {
        heading: "Piper builds need a different service list",
        body: "The 66109 and 66111 subdivisions are newer, larger and vinyl-clad, so they generate siding washes, bin cleaning and recurring lawn care. The older core generates one-time deep cleans. Same city, two sets of work.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "junk",
        heading: "Garage and estate clear-outs",
        body: "Detached garages, sheds and full-property estate cleanouts. We sort out what can be donated before anything goes in the truck.",
      },
      {
        serviceId: "power",
        heading: "Driveways, steps and retaining walls",
        body: "Concrete on a slope holds algae on the shaded side. Most washes here cover drive, steps and front walk together, which costs less than booking them separately.",
      },
      {
        serviceId: "landscaping",
        heading: "Overgrowth and lot cleanup",
        body: "Mature trees and long-neglected fence lines. Brush clearing and haul-away in one visit, so you do not need a second junk booking.",
      },
      {
        serviceId: "cleaning",
        heading: "Rental turnovers",
        body: "Move-out cleans between tenants, priced flat by home size so a landlord can budget the same number every turn.",
      },
    ],
    faqs: [
      {
        q: "Do you charge more to work in Wyandotte County?",
        a: "No. Pricing is flat across the metro. What changes the price is the job. A hillside driveway takes longer than a flat one, and we quote the work rather than the ZIP code.",
      },
      {
        q: "Can you haul away brush and yard waste as well as junk?",
        a: "Yes, and combining them saves money. Brush clearing plus haul-away in one visit costs less than booking landscaping and junk removal separately.",
      },
    ],
    nearby: ["kansas-city-mo", "shawnee", "overland-park", "lenexa"],
  },

  {
    slug: "overland-park",
    name: "Overland Park",
    state: "KS",
    label: "Overland Park",
    county: "Johnson County",
    zips: ["66204", "66207", "66210", "66212", "66213", "66214", "66221", "66223", "66224"],
    geo: { lat: 38.9822, lng: -94.6708 },
    neighborhoods: [
      "Downtown Overland Park", "Deer Creek", "Nottingham", "Blue Valley",
      "Brookridge", "Corporate Woods",
    ],
    metaDescription:
      "House cleaning, window cleaning, power washing and lawn care in Overland Park, KS. Recurring plans for Blue Valley, Deer Creek and downtown OP.",
    intro:
      "Overland Park is our busiest service area, and almost all of it is recurring work. Biweekly house cleaning, seasonal window washing, and driveway and siding washes that keep HOA letters out of the mailbox. We run standing routes through 66210, 66213, 66221 and 66223, so a regular slot on a fixed weekday is usually available.",
    localNotes: [
      {
        heading: "HOA standards set the exterior calendar",
        body: "South OP associations write letters about algae streaks on north-facing siding and oil staining on driveways. Both are washing jobs with a season: siding in late spring once the pollen finishes, concrete before winter. Booking the two together on one visit is the cheapest way to stay off the list.",
      },
      {
        heading: "Big two-storeys make access the real cost",
        body: "The Blue Valley and Deer Creek builds are two and three storeys with tall gable ends. Exterior window cleaning and gutter work there is priced on access and storey count rather than square footage. A 3,000 square foot ranch and a 3,000 square foot three-storey are not the same job.",
      },
      {
        heading: "Downtown OP is the older half of the city",
        body: "North of I-435 around Santa Fe, the homes are 1950s ranches on small lots with original windows and mature trees. Those book gutter clearing and one-time deep cleans instead of the recurring exterior programme the southern subdivisions run.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Biweekly recurring cleans",
        body: "Our most-requested Overland Park service. Same crew, same weekday, flat rate. Most households here run biweekly rather than weekly.",
      },
      {
        serviceId: "window",
        heading: "Two and three-storey exteriors",
        body: "Inside and out, screens and tracks included. Priced by storey and access rather than a flat per-window rate.",
      },
      {
        serviceId: "power",
        heading: "Siding, driveways and HOA compliance",
        body: "North-facing siding algae and driveway oil staining, the two things OP associations write letters about.",
      },
      {
        serviceId: "landscaping",
        heading: "Maintained-lawn standards",
        body: "Edging, bed maintenance and seasonal cleanup to the standard the covenants expect.",
      },
    ],
    faqs: [
      {
        q: "Can you work around an HOA's contractor rules?",
        a: "Not yet. General liability cover is being put in place, and until it is we cannot produce a certificate of insurance — so if your HOA requires one on file for exterior work, we are not the right call for that job today. Work at your own property that does not need a COI, we can take now.",
      },
      {
        q: "Do you offer a fixed weekday for recurring cleans?",
        a: "Yes, and in Overland Park we can usually hold it. We run standing routes here, so a biweekly Tuesday stays a biweekly Tuesday instead of drifting.",
      },
      {
        q: "Is a three-storey window clean priced differently?",
        a: "Yes. Storey count and access drive the price on exterior glass, not the size of the house. We confirm the count at the quote so nothing changes on the day.",
      },
    ],
    nearby: ["leawood", "lenexa", "prairie-village", "olathe"],
  },

  {
    slug: "olathe",
    name: "Olathe",
    state: "KS",
    label: "Olathe",
    county: "Johnson County",
    zips: ["66061", "66062", "66063"],
    geo: { lat: 38.8814, lng: -94.8191 },
    neighborhoods: ["Cedar Creek", "Stonebridge", "Downtown Olathe", "Havencroft", "Brougham"],
    metaDescription:
      "Cleaning, move-in/move-out, bin cleaning and lawn care in Olathe, KS. Serving Cedar Creek, Stonebridge and downtown Olathe with flat-rate booking.",
    intro:
      "Olathe is the metro's fastest-growing suburb and it books like one. Move-in and move-out cleans, first deep cleans in newly bought homes, and recurring service for households with young kids and not enough weekend. We cover 66061, 66062 and 66063 with same-week availability most weeks.",
    localNotes: [
      {
        heading: "Move-in cleans are the volume job here",
        body: "Olathe turns over more houses than anywhere else we work. A move-in clean has a different scope from a recurring clean: inside cabinets and drawers, appliance interiors, and the previous owner's baseboards. It gets priced as its own package rather than as a deep clean with extras bolted on.",
      },
      {
        heading: "New construction leaves fine dust for months",
        body: "Homes in the newer Cedar Creek and Stonebridge phases carry drywall dust in the HVAC returns, window tracks and light fixtures long after the builder's clean. Post-construction detail is slower work than it looks, so we quote it separately instead of pretending a standard clean will get it.",
      },
      {
        heading: "Bins sit close to the house",
        body: "Several newer Olathe developments store bins near the back door rather than out of sight. Bin cleaning makes obvious sense here in a way it does not in older parts of the metro, and it is our cheapest recurring service.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Move-in and move-out cleans",
        body: "Cabinet interiors, appliance interiors, and everything the last owner left behind. Our highest-volume Olathe booking.",
      },
      {
        serviceId: "bin",
        heading: "Recurring bin cleaning",
        body: "Monthly or quarterly. Cheap, fast, and it earns its keep when the bins live within smelling distance of a door you use.",
      },
      {
        serviceId: "landscaping",
        heading: "Young-lawn maintenance",
        body: "Newer sod on graded clay needs different care than an established lawn. Mowing, edging and seasonal cleanup.",
      },
      {
        serviceId: "power",
        heading: "New concrete and vinyl siding",
        body: "Newer concrete stains faster than people expect. Low-pressure siding washing that will not force water behind the vinyl.",
      },
    ],
    faqs: [
      {
        q: "How far ahead should I book a move-out clean in Olathe?",
        a: "Three to five days if you can. Olathe closings cluster at month-end and the last week books out first. If you are inside 48 hours, call instead of booking online and we will tell you what is left.",
      },
      {
        q: "Is a post-construction clean the same as a deep clean?",
        a: "No. Construction dust sits in HVAC returns, window tracks and fixtures and needs its own pass. We quote it as a separate job so the estimate matches the hours it takes.",
      },
    ],
    nearby: ["lenexa", "overland-park", "shawnee", "leawood"],
  },

  {
    slug: "shawnee",
    name: "Shawnee",
    state: "KS",
    label: "Shawnee",
    county: "Johnson County",
    zips: ["66203", "66216", "66217", "66218", "66226", "66227"],
    geo: { lat: 39.0417, lng: -94.7203 },
    neighborhoods: ["Downtown Shawnee", "Shawnee Mission Park area", "Bristol Highlands", "Clear Creek", "Nieman"],
    metaDescription:
      "Deck and fence washing, gutter clearing, cleaning and yard cleanup in Shawnee, KS. Serving downtown Shawnee, Clear Creek and the Shawnee Mission Park area.",
    intro:
      "Shawnee splits in two: the older grid around Nieman and downtown, and the newer western subdivisions past K-7. Both halves have trees. Shawnee holds more mature canopy than most of Johnson County, which makes gutters, decks and shaded concrete the work we do most here.",
    localNotes: [
      {
        heading: "Tree canopy sets the maintenance calendar",
        body: "Gutters here fill twice a year rather than once, and shaded north-side concrete and decking grow algae that a driveway in an open subdivision never gets. Booking a gutter clear in late November, after the oaks finally drop, beats booking it in October and doing it twice.",
      },
      {
        heading: "Decks and fences, not just siding",
        body: "Shawnee's older builds have a lot of wooden deck and cedar fence. Both wash at much lower pressure than concrete. A driveway-pressure wand will fur the grain and leave permanent lap marks. We soft wash timber, and we will say no to a pressure setting that would wreck it.",
      },
      {
        heading: "Two street grids, two access realities",
        body: "The Nieman-area streets are narrow with short driveways. The Clear Creek and 66226 builds have wide approaches and three-car garages. It changes how a junk truck or trailer stages, which is the first thing we ask about on a Shawnee quote.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "power",
        heading: "Deck, fence and shaded concrete",
        body: "Soft wash on timber, full pressure on concrete. Two different jobs that should not be quoted as one.",
      },
      {
        serviceId: "landscaping",
        heading: "Leaf and canopy cleanup",
        body: "Seasonal cleanup on properties with real tree cover, including haul-away so the bags are not your problem.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring and one-off home cleans",
        body: "Standard, deep and move-out cleans across both halves of the city.",
      },
      {
        serviceId: "junk",
        heading: "Shed, deck teardown and debris",
        body: "Old decking, fence panels and shed contents hauled in one trip.",
      },
    ],
    faqs: [
      {
        q: "Will pressure washing damage my cedar deck or fence?",
        a: "It will if it is done at concrete pressure. That is what causes furred grain and permanent lap lines. We soft wash timber at much lower pressure and let a cleaning solution do the work. If a deck is too far gone to wash safely we will tell you rather than take the booking.",
      },
      {
        q: "When should I book gutter clearing in Shawnee?",
        a: "Late November. Shawnee's oaks hold their leaves longer than the maples do, so an October clear usually needs a second visit.",
      },
    ],
    nearby: ["lenexa", "olathe", "kansas-city-ks", "overland-park"],
  },

  {
    slug: "lenexa",
    name: "Lenexa",
    state: "KS",
    label: "Lenexa",
    county: "Johnson County",
    zips: ["66215", "66219", "66220", "66227"],
    geo: { lat: 38.9536, lng: -94.7336 },
    neighborhoods: ["Lenexa City Center", "Old Town Lenexa", "Falcon Ridge", "Canyon Creek", "the 87th Street corridor"],
    metaDescription:
      "Commercial and residential cleaning in Lenexa, KS. Offices, warehouses and homes, plus fleet detailing around City Center and the 87th Street corridor.",
    intro:
      "Lenexa is the one part of the metro where our commercial work outweighs our residential work. The business parks along 87th Street and around City Center generate office cleaning, warehouse and breakroom work, and fleet vehicle detailing. Those jobs run after hours and on a contract rather than as a one-off booking.",
    localNotes: [
      {
        heading: "Commercial work runs on your clock",
        body: "Every office and warehouse account we hold in Lenexa is cleaned outside business hours: evenings, early mornings or weekends. That is a scheduling commitment more than a cleaning one, and it is why commercial gets quoted per site after a walkthrough rather than from a price list.",
      },
      {
        heading: "Warehouse floors are not office floors",
        body: "Light-industrial space around 87th and Renner means sealed concrete, loading-dock grime and breakrooms that take more abuse than a corporate kitchen. Different equipment, different chemistry, and usually more frequent visits on less square footage.",
      },
      {
        heading: "Fleet detailing beats a wash bay on a company account",
        body: "Several Lenexa businesses run vans or light trucks. Detailing them on site on a rotation costs less in staff time than sending drivers out to a wash bay, and we can work through a whole yard in one visit.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "commercial",
        heading: "Offices, warehouses and breakrooms",
        body: "After-hours janitorial on contract, quoted per site after a walkthrough. Square footage alone does not price a warehouse.",
      },
      {
        serviceId: "auto",
        heading: "On-site fleet detailing",
        body: "Vans and light trucks detailed in your lot on a rotation. No driver time lost to a wash bay.",
      },
      {
        serviceId: "cleaning",
        heading: "Residential across Falcon Ridge and Canyon Creek",
        body: "Standard and deep cleans for the western subdivisions, at the same flat rates as the rest of the metro.",
      },
      {
        serviceId: "power",
        heading: "Entrances, dumpster pads and walkways",
        body: "The parts of a commercial property customers look at, plus the dumpster pad they smell.",
      },
    ],
    faqs: [
      {
        q: "Do you clean offices outside business hours?",
        a: "Yes. Every commercial account we hold in Lenexa is serviced after hours or at weekends. Tell us your access arrangement at the walkthrough, whether that is a fob, a code or an on-site contact, and we build the schedule around it.",
      },
      {
        q: "Can you detail a fleet on site?",
        a: "Yes. We come to your lot and work through the vehicles in one visit. Give us a rough count and vehicle type and we will quote per rotation.",
      },
      {
        q: "How is commercial cleaning priced?",
        a: "Per site, after a walkthrough. A warehouse and an office of identical square footage need different equipment and different frequency, so a per-square-foot rate would be wrong for one of them.",
      },
    ],
    nearby: ["olathe", "shawnee", "overland-park", "kansas-city-ks"],
  },

  {
    slug: "leawood",
    name: "Leawood",
    state: "KS",
    label: "Leawood",
    county: "Johnson County",
    zips: ["66206", "66209", "66211"],
    geo: { lat: 38.92, lng: -94.6169 },
    neighborhoods: ["Town Center Plaza area", "Leawood Estates", "Hallbrook", "Ironhorse", "Old Leawood"],
    metaDescription:
      "Detail-focused house cleaning, window cleaning and auto detailing in Leawood, KS. Serving Old Leawood, Hallbrook and Ironhorse with flat-rate quotes.",
    intro:
      "Leawood work is detail work. The homes are larger, the finishes are less forgiving, and the standard gets set by what the last cleaner missed rather than by a checklist. Most of what we do here is recurring cleaning with a longer scope, exterior glass on big elevations, and paint-safe auto detailing at the house.",
    localNotes: [
      {
        heading: "Finishes decide the chemistry",
        body: "Natural stone counters, unlacquered brass, wide-plank hardwood and marble baths all fail under a general-purpose spray, and etching on stone is permanent. Leawood cleans start with a walkthrough of the finishes, and we bring pH-neutral products by default rather than on request.",
      },
      {
        heading: "Big elevations mean real glass footage",
        body: "Two-storey entry windows and rear walls of glass in Hallbrook and Ironhorse are why exterior window cleaning here is quoted on access and pane count. It is a bigger job than the same-priced house a few miles north, and pretending otherwise produces a quote we would have to revise on site.",
      },
      {
        heading: "Discretion is part of the service",
        body: "Every crew member is background-checked before their first job, we work to a fixed arrival window, and we do not photograph a client's home for marketing without written permission. That last one matters more in Leawood than anywhere else we work.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Recurring cleans with an extended scope",
        body: "pH-neutral on stone, dry methods on unfinished timber, and a scope agreed at walkthrough rather than assumed.",
      },
      {
        serviceId: "window",
        heading: "Large-elevation exterior glass",
        body: "Two-storey entries and rear glass walls, inside and out. Quoted by pane count and access.",
      },
      {
        serviceId: "auto",
        heading: "Paint-safe detailing at the house",
        body: "Two-bucket wash, decontamination and interior detail in your driveway. No wash-tunnel swirl marks.",
      },
      {
        serviceId: "landscaping",
        heading: "Bed and border maintenance",
        body: "Mature planting kept to the standard the street sets, including seasonal cleanup.",
      },
    ],
    faqs: [
      {
        q: "Do you use products that are safe on marble and natural stone?",
        a: "Yes, pH-neutral by default in Leawood rather than on request. Acidic and alkaline general-purpose cleaners etch stone permanently, and no amount of polishing takes it back out.",
      },
      {
        q: "Will the same crew come each visit?",
        a: "For recurring accounts, yes, wherever scheduling allows. A crew that already knows which surfaces need which product is the reason a recurring plan is worth having.",
      },
      {
        q: "Do you photograph homes for marketing?",
        a: "Only with written permission from the homeowner. Our gallery is real jobs, and every one of them was cleared first.",
      },
    ],
    nearby: ["overland-park", "prairie-village", "kansas-city-mo", "olathe"],
  },

  {
    slug: "prairie-village",
    name: "Prairie Village",
    state: "KS",
    label: "Prairie Village",
    county: "Johnson County",
    zips: ["66207", "66208"],
    geo: { lat: 38.9917, lng: -94.6358 },
    neighborhoods: ["Prairie Village shops area", "Corinth", "Meadowbrook", "Fairway border", "Mission Valley"],
    metaDescription:
      "Window cleaning, gutter work and home cleaning in Prairie Village, KS. Original wood windows and mid-century homes around Corinth and Meadowbrook.",
    intro:
      "Prairie Village is a mid-century neighborhood that mostly still has its original windows, and that one fact shapes our work here. Divided-lite wood sashes, small basements, mature trees and compact lots make this a window cleaning, gutter clearing and one-off deep clean market rather than a big-exterior one.",
    localNotes: [
      {
        heading: "Divided lites get counted, then priced",
        body: "A 1950s Cape Cod with eight-over-eight wood sashes has more individual panes in one window than a modern house has in a whole elevation. Quoting that per window instead of per pane produces a number we would have to walk back, so we count first and quote after.",
      },
      {
        heading: "Original wood needs care, not pressure",
        body: "Old glazing putty and painted sashes come apart under a pressure washer, and under too much water generally. Exterior glass on these homes is hand-washed and squeegeed with the sills dried. Slower, but it does not cost you a re-glaze in spring.",
      },
      {
        heading: "Small basements fill up faster",
        body: "The compact floorplans here have small basements and small garages, so clear-outs come around more often and are smaller each time. We quote junk by load fraction rather than assuming a full truck, which means a half-basement is a half price.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "window",
        heading: "Original wood and divided-lite glass",
        body: "Hand-washed, squeegeed, sills dried. Counted per pane so the quote survives contact with the house.",
      },
      {
        serviceId: "cleaning",
        heading: "Deep cleans in mid-century homes",
        body: "Painted trim, original hardwood, and tiled baths that predate modern grout sealers.",
      },
      {
        serviceId: "junk",
        heading: "Small-load basement and garage clear-outs",
        body: "Priced by load fraction. A half-load is a half price, not a rounded-up truck.",
      },
      {
        serviceId: "landscaping",
        heading: "Compact lots and mature trees",
        body: "Tight-lot mowing, edging and leaf cleanup where a full-size mower does not fit.",
      },
    ],
    faqs: [
      {
        q: "Can you clean original wood windows without damaging them?",
        a: "Yes, by hand rather than with a pressure washer. Old glazing putty fails under pressure and under standing water, so we squeegee and dry the sills instead of flooding them.",
      },
      {
        q: "Do I have to pay for a full junk truck if I only have a few items?",
        a: "No. We price by the fraction of the truck you fill, which suits Prairie Village's smaller basements and garages.",
      },
    ],
    nearby: ["leawood", "overland-park", "kansas-city-mo", "shawnee"],
  },

  {
    slug: "lees-summit",
    name: "Lee's Summit",
    state: "MO",
    label: "Lee's Summit",
    county: "Jackson County",
    zips: ["64063", "64064", "64081", "64082", "64086"],
    geo: { lat: 38.9108, lng: -94.3822 },
    neighborhoods: ["Downtown Lee's Summit", "Lakewood", "Longview", "Raintree Lake", "Winterset"],
    metaDescription:
      "House cleaning, siding and driveway washing, and lawn care in Lee's Summit, MO. Serving Lakewood, Longview, Raintree Lake and downtown.",
    intro:
      "Lee's Summit is large, spread out and mostly vinyl-clad, which makes soft washing, recurring cleaning and lawn care the core of our work here. The lake communities around Lakewood and Raintree add a seasonal layer: dock-adjacent decks, boat and trailer detailing, and heavier spring pollen than the rest of the metro.",
    localNotes: [
      {
        heading: "Vinyl siding needs soft wash, not pressure",
        body: "Most of Lee's Summit is vinyl, and vinyl is the material people most often ruin with a pressure washer. Water forced up behind a lap course ends up in the wall cavity, and you find out about that months later. Every siding wash we do here is low pressure with a cleaning solution doing the work.",
      },
      {
        heading: "Lake-adjacent properties get more of everything",
        body: "Homes near Lakewood and Raintree collect more pollen, more algae on shaded decking and more silt on hard surfaces than the rest of the city. One annual exterior wash usually is not enough there. Twice a year is realistic, and we say so rather than selling one and letting it look bad by August.",
      },
      {
        heading: "Distance means routing, and routing means notice",
        body: "The 64082 and 64086 ZIPs sit at the far edge of our range. We serve them fully and at the same rates, but a job booked three or four days out gets a much better slot than a same-day request, because we route the south-east runs together.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "power",
        heading: "Soft-wash siding, drives and decks",
        body: "Low pressure on vinyl and timber, full pressure on concrete. Twice a year near the lakes.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring family-home cleans",
        body: "Weekly and biweekly plans for the larger Lakewood and Winterset floorplans.",
      },
      {
        serviceId: "landscaping",
        heading: "Larger lots and seasonal cleanup",
        body: "Mowing, edging, bed work and spring and fall cleanup on the bigger suburban plots.",
      },
      {
        serviceId: "auto",
        heading: "Boats, trailers and daily drivers",
        body: "Detailing at the house, including the trailer that has been sitting since October.",
      },
    ],
    faqs: [
      {
        q: "Is pressure washing safe on vinyl siding?",
        a: "Not at high pressure. Water gets forced behind the lap courses and into the wall. Vinyl should be soft washed at low pressure with a cleaning solution, which is what we do by default in Lee's Summit, where most of the housing stock is vinyl.",
      },
      {
        q: "Do you serve the far south-east ZIPs like 64082 and 64086?",
        a: "Yes, at the same rates as everywhere else. Book three or four days out if you can. We route the south-east together, so advance bookings get the better time slots.",
      },
    ],
    nearby: ["blue-springs", "raytown", "independence", "kansas-city-mo"],
  },

  {
    slug: "independence",
    name: "Independence",
    state: "MO",
    label: "Independence",
    county: "Jackson County",
    zips: ["64050", "64052", "64053", "64054", "64055", "64056", "64057", "64058"],
    geo: { lat: 39.0911, lng: -94.4155 },
    neighborhoods: ["Truman Heritage District", "Englewood", "Fairmount", "Sugar Creek border", "Hartman Heritage area"],
    metaDescription:
      "Estate cleanouts, rental turnovers, cleaning and pressure washing in Independence, MO. Serving the Truman district, Englewood and Fairmount.",
    intro:
      "Independence has some of the oldest housing in the metro and a high share of rentals, and our work reflects both. Estate cleanouts in long-held family homes, turnover cleans between tenants, and exterior washing on brick and painted wood that has been through a lot of Missouri winters.",
    localNotes: [
      {
        heading: "Estate cleanouts are a sorting job first",
        body: "A full-house clearance after a death or a move into care is not a junk run. We work room by room, set aside anything a family flags, route what is usable to donation, and only then load what is waste. It takes longer than a straight haul and we schedule it that way.",
      },
      {
        heading: "Historic-district exteriors need a lighter hand",
        body: "The Truman Heritage District has soft-fired historic brick and lime mortar. High pressure strips the fired face off old brick and blows out mortar joints, and repairing that costs far more than the wash did. We soft wash there, without exception.",
      },
      {
        heading: "Landlord turnovers run on a fixed number",
        body: "Independence has a lot of small landlords who need the same clean at the same price every time a tenant leaves. We quote turnovers flat by bedroom count so it drops straight into a budget, and we can invoice per property.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "junk",
        heading: "Estate and full-property cleanouts",
        body: "Sorted room by room, donations routed, waste hauled. Scheduled with the time the job needs.",
      },
      {
        serviceId: "cleaning",
        heading: "Tenant turnover cleans",
        body: "Flat rate by bedroom count so a landlord can budget the same figure every turn.",
      },
      {
        serviceId: "power",
        heading: "Soft washing older brick and painted wood",
        body: "Low pressure on historic masonry. High pressure on old brick is permanent damage, not a shortcut.",
      },
      {
        serviceId: "landscaping",
        heading: "Overgrown lot recovery",
        body: "Vacant and between-tenant properties brought back to lettable condition, with haul-away included.",
      },
    ],
    faqs: [
      {
        q: "Can you pressure wash a historic brick home?",
        a: "Not at pressure. Soft-fired historic brick and lime mortar take permanent damage from high-pressure washing. The fired face comes off and the joints blow out. We soft wash historic masonry at low pressure with a longer dwell time.",
      },
      {
        q: "Do you handle full estate cleanouts?",
        a: "Yes, and we treat them as a sorting job before a hauling job. Tell us what matters and we set it aside. Usable goods go to donation and we haul the rest.",
      },
      {
        q: "Do you work with landlords on multiple properties?",
        a: "Yes. Turnovers are quoted flat by bedroom count and we can invoice per property so the accounting stays clean.",
      },
    ],
    nearby: ["kansas-city-mo", "blue-springs", "raytown", "lees-summit"],
  },

  {
    slug: "blue-springs",
    name: "Blue Springs",
    state: "MO",
    label: "Blue Springs",
    county: "Jackson County",
    zips: ["64013", "64014", "64015"],
    geo: { lat: 39.0169, lng: -94.2816 },
    neighborhoods: ["Downtown Blue Springs", "Adams Dairy Parkway area", "Lake Remembrance", "Woods Chapel"],
    metaDescription:
      "Deck and siding washing, bin cleaning, house cleaning and lawn care in Blue Springs, MO. Serving Woods Chapel, Lake Remembrance and downtown.",
    intro:
      "Blue Springs is family-suburban: decks, fenced yards, vinyl siding and two cars on the drive. The work follows. Exterior washing in spring, recurring cleaning year-round, bin cleaning for households that keep the bins by the garage, and lawn care through the growing season.",
    localNotes: [
      {
        heading: "Everyone has a deck, and most are due",
        body: "Deck washing is our most-booked Blue Springs exterior job, and the one people most often try to do themselves with a rented pressure washer. Timber washes at a fraction of concrete pressure. Above that, the wand furs the grain and leaves stripes only sanding will remove.",
      },
      {
        heading: "Bins live by the garage here",
        body: "Blue Springs collection means most households store bins on the drive or beside the garage, a few feet from a door people use daily. That is why bin cleaning sells here and barely registers in neighborhoods with alley storage. Quarterly suits most households, monthly through summer.",
      },
      {
        heading: "This is the eastern edge of our range",
        body: "We serve 64013, 64014 and 64015 in full and at standard rates, but they sit at the far east of the metro and we route them with Lee's Summit and Independence. Booking a few days ahead gets a much better slot than a same-day call.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "power",
        heading: "Decks, fences and siding",
        body: "Soft wash on timber and vinyl, full pressure on concrete. Spring is the booking season.",
      },
      {
        serviceId: "bin",
        heading: "Quarterly and monthly bin cleaning",
        body: "Worth it when the bins live by the garage door. Monthly through summer, quarterly otherwise.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring family-home cleaning",
        body: "Standard and deep cleans on a weekly or biweekly rhythm.",
      },
      {
        serviceId: "landscaping",
        heading: "Mowing and seasonal cleanup",
        body: "Fenced-yard mowing, edging, and spring and fall cleanups.",
      },
    ],
    faqs: [
      {
        q: "Can I just rent a pressure washer for my deck?",
        a: "You can, and it is the most common way decks get damaged around here. Timber needs a fraction of concrete pressure. Go above it and the wand furs the grain and leaves lap stripes that only sanding takes out. If you do rent one, keep it low and keep it moving.",
      },
      {
        q: "How often should bins be cleaned?",
        a: "Quarterly suits most Blue Springs households, monthly through summer if the bins sit in sun near a door you use. It is our cheapest recurring service, so people usually run it alongside something else.",
      },
    ],
    nearby: ["lees-summit", "independence", "raytown", "kansas-city-mo"],
  },

  {
    slug: "raytown",
    name: "Raytown",
    state: "MO",
    label: "Raytown",
    county: "Jackson County",
    zips: ["64133", "64138"],
    geo: { lat: 39.0086, lng: -94.4636 },
    neighborhoods: ["Downtown Raytown", "Little Blue", "Raytown South", "63rd Street corridor"],
    metaDescription:
      "Junk removal, gutter clearing and one-time deep cleans in Raytown, MO. Small-load pricing and honest quotes for mid-century homes in 64133 and 64138.",
    intro:
      "Raytown is a compact, mostly mid-century city of single-storey ranches on modest lots, and many of those homes have had the same owner for decades. The work here skews to one-time jobs rather than recurring plans: a basement or garage cleared, gutters done before winter, a deep clean before family visits or before a sale.",
    localNotes: [
      {
        heading: "Single-storey makes gutter work quick and cheap",
        body: "Almost everything in Raytown is a one-storey ranch, so gutter clearing is a short-ladder job rather than a roof-line one. It costs less here than in a two-storey suburb, and we price it that way instead of charging the metro average.",
      },
      {
        heading: "Long-held homes generate one big clear-out",
        body: "Thirty or forty years in the same house fills a basement. Most Raytown junk calls are a single large clear-out rather than a recurring need, so we quote the whole job up front, bring enough crew to finish in one visit, and sort donations before loading.",
      },
      {
        heading: "Pre-sale deep cleans are the other half of the work",
        body: "When a long-held Raytown home goes on the market it usually needs a deep clean rather than a standard one. Original kitchens, decades-old grout, appliance interiors nobody has opened. We book those as deep cleans and say so, because quoting a standard clean and upgrading on the day is the wrong way to treat a seller.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "junk",
        heading: "Whole-basement and garage clear-outs",
        body: "Quoted as one job, finished in one visit, donations sorted before anything is loaded.",
      },
      {
        serviceId: "cleaning",
        heading: "Pre-sale and pre-visit deep cleans",
        body: "Original kitchens, old grout, appliance interiors. Quoted as a deep clean from the start.",
      },
      {
        serviceId: "landscaping",
        heading: "Gutter clearing and yard tidy-up",
        body: "Short-ladder gutter work on single-storey ranches, priced accordingly.",
      },
      {
        serviceId: "power",
        heading: "Drives, walks and carports",
        body: "Concrete washing on the small, well-shaded lots typical of 64133 and 64138.",
      },
    ],
    faqs: [
      {
        q: "Is gutter clearing cheaper on a single-storey house?",
        a: "Yes, and in Raytown that is most houses. It is a short-ladder job rather than a roof-line one, so it takes less time and less setup, and the price reflects that instead of the metro average.",
      },
      {
        q: "My parents' house has forty years of stuff in the basement. Can you handle that in one go?",
        a: "Yes. We quote the whole clear-out up front and bring enough crew to finish in a single visit. Anything you flag gets set aside, usable goods go to donation, and we haul the rest.",
      },
    ],
    nearby: ["kansas-city-mo", "independence", "lees-summit", "blue-springs"],
  },
];

/** Slug to city lookup for the dynamic route. */
export const CITY_BY_SLUG: Record<string, ServiceCity> = Object.fromEntries(
  SERVICE_CITIES.map((city) => [city.slug, city])
);

/** Every slug, in catalogue order. Drives route expansion and the sitemap. */
export const CITY_SLUGS: string[] = SERVICE_CITIES.map((city) => city.slug);

/** Canonical path for a city page. Never hand-build this string elsewhere. */
export function cityPath(slug: string): string {
  return `/service-areas/${slug}`;
}
