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
      "House cleaning and mobile detailing in Kansas City, MO. Brookside to the Northland. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Kansas City, Missouri, from the century houses of Hyde Park and Brookside out to the newer subdivisions north of the river. Two services, both flat-rate, both booked online in about two minutes.",
    localNotes: [
      {
        heading: "Two kinds of housing stock in one city",
        body: "A pre-war four-square in Hyde Park and a 2015 build in Briarcliff have almost nothing in common. The old core means plaster, painted wood trim and hundred-year-old floors that will not tolerate what a new build shrugs off. The Northland means engineered surfaces and finished basements. We quote them as the different jobs they are, because they take different products and different amounts of time.",
      },
      {
        heading: "Loft and rental turnovers move fast",
        body: "Downtown and River Market run short turnarounds between tenants. Move-out cleans there usually get booked with 48 hours notice and have to pass a property manager's checklist rather than a homeowner's eye. We hold same-week slots across 64105 to 64111 for that reason.",
      },
      {
        heading: "Where the car sits decides the detail",
        body: "Westport, the Crossroads and Columbus Park mostly park on the street, and a mobile detail needs room to open every door plus access to an outdoor tap. That is a real constraint in the old core rather than a formality. Tell us where the car actually sits when you book and we will tell you straight away whether it works.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Deep cleans for older homes",
        body: "Plaster dust, painted woodwork and hundred-year-old hardwood need gentler chemistry and more time than a new build. Deep cleans in Brookside and Waldo are our most-booked Kansas City job.",
      },
      {
        serviceId: "auto",
        heading: "Detailing without a driveway",
        body: "Most of central Kansas City parks on the street. We work around it where we can, but we need a space with room to open every door and, for now, a tap we can reach.",
      },
    ],
    faqs: [
      {
        q: "Do you serve both sides of the river in Kansas City?",
        a: "Yes. We cover the Northland ZIPs from 64116 to 64158 as well as the central and southern city. Northland jobs run on their own routes, so booking two or three days ahead gets you a better slot than same-day.",
      },
      {
        q: "Do you clean downtown lofts and apartments?",
        a: "Yes, including move-out cleans against a property manager's checklist. If your building requires a loading dock or freight elevator booking, mention it so we can reserve the time.",
      },
      {
        q: "Can you detail my car if I park on the street?",
        a: "Usually. We need room to open every door and access to an outdoor tap. Street parking in Brookside or Waldo is normally fine. Permit blocks in Westport are the ones worth checking with us before you book.",
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
      "House cleaning and mobile detailing in Kansas City, KS. Strawberry Hill to Piper. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Kansas City, Kansas, from Strawberry Hill and Argentine through Turner and Rosedale out to the newer builds at Piper. Flat rate, confirmed before we start, nothing taken at booking.",
    localNotes: [
      {
        heading: "Detached garages and gravel alleys",
        body: "A lot of Kansas City, Kansas parks behind the house rather than beside it, down an alley, on gravel. That matters more for detailing than people expect: the tap is at the house and the car is sixty feet away. We carry hose, but it is worth saying at the booking rather than finding out on the day.",
      },
      {
        heading: "Piper needs a different service list from Strawberry Hill",
        body: "The west side of the city is fifteen years old and the east side is a hundred. Piper books standard recurring cleans on newer finishes. Strawberry Hill and Argentine book deep cleans on original wood, plaster and floors that have been refinished more than once.",
      },
      {
        heading: "Rental turnovers run to a checklist, not a preference",
        body: "There is a lot of small-landlord housing here, and a turnover clean is judged against a written standard rather than how it looks. We quote those flat by bedroom count so the number drops into a budget, and we can invoice per property.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Turnover and move-out cleans",
        body: "Quoted flat by bedroom count against a landlord's checklist, not a homeowner's eye. We can invoice per property so the accounting stays clean.",
      },
      {
        serviceId: "auto",
        heading: "Detailing at a detached garage",
        body: "We bring hose length for a car parked off a rear alley. Tell us the tap is at the house and it is a non-event; leave it out and it is a problem on the day.",
      },
    ],
    faqs: [
      {
        q: "Do you cover Piper and the western ZIPs?",
        a: "Yes. Piper runs on the same routes as the rest of Wyandotte County. Newer construction out there usually books a standard recurring clean rather than a deep clean, which is the cheaper starting point.",
      },
      {
        q: "Can you clean a rental between tenants on short notice?",
        a: "Usually within the same week. Turnovers are quoted flat by bedroom count so the price is the same every time, which is the part landlords actually care about.",
      },
      {
        q: "My car is parked on gravel behind the house. Is that a problem?",
        a: "No, as long as there is room to open the doors and a tap we can reach with hose. Gravel is only an issue if it is loose enough that we would be kicking dust onto wet paint, and we will tell you if it is.",
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
      "House cleaning and mobile detailing in Overland Park, KS. Deer Creek to Corporate Woods. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Overland Park, from the older streets around downtown OP out through Nottingham, Deer Creek and the Blue Valley subdivisions. Flat-rate pricing, confirmed before anyone starts work.",
    localNotes: [
      {
        heading: "Recurring is the default here, not the exception",
        body: "More of our Overland Park cleaning is on a weekly or bi-weekly slot than anywhere else we work. That changes what the job is: on a standing clean the house never gets far enough behind to need a reset, which is why the recurring rate exists and why the first visit is usually a deep clean and the rest are not.",
      },
      {
        heading: "Big two-storeys make square footage the real cost",
        body: "A five-bedroom in Blue Valley is not a three-bedroom with two more rooms. It is more bathrooms, more floor, more stairs and a longer day. Our counters price bedrooms and bathrooms separately for exactly that reason, so a big house is quoted as a big house rather than absorbed into a flat rate that then has to be renegotiated.",
      },
      {
        heading: "Three cars in the driveway is normal",
        body: "Overland Park households run more vehicles than most of the metro, and they are usually garage-kept and in decent shape, which makes them express-wash and interior work rather than heavy correction. Doing two or three in one visit is the cheapest way to buy it, because we are only paying for the drive once.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Bi-weekly recurring cleans",
        body: "The most-booked job in Overland Park. First visit is usually a deep clean to set the baseline, then a standard clean on a standing slot to hold it.",
      },
      {
        serviceId: "auto",
        heading: "Two or three cars at once",
        body: "Garage-kept family vehicles, done in the driveway on one visit. The travel is already paid for by the first car, which is what makes the second one worth doing.",
      },
    ],
    faqs: [
      {
        q: "Do I need a deep clean before starting a recurring plan?",
        a: "Usually, and only once. A standard clean is written to maintain a house that is already on top of things. If it has been a while, the first visit does the reset and every visit after that is the standard rate.",
      },
      {
        q: "Can you work around an HOA?",
        a: "For cleaning and detailing there is very little to work around, since both happen at your house rather than to the outside of it. If your association has rules about washing vehicles in a driveway, check them before you book and we will work to whatever they say.",
      },
      {
        q: "Do you detail more than one car in a visit?",
        a: "Yes, and it is the sensible way to do it. The drive is the fixed cost, so the second and third vehicle are much better value than booking them on separate days.",
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
      "House cleaning and mobile detailing in Olathe, KS. Cedar Creek to Havencroft. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Olathe, from the new construction at Cedar Creek and Stonebridge to the established streets around downtown and Havencroft. Flat-rate, booked online, confirmed before we start.",
    localNotes: [
      {
        heading: "Move-in cleans are the volume job here",
        body: "Olathe turns over more houses than most of the metro, and a move-in clean is a different animal from a maintenance clean: every cabinet, every drawer, inside the oven and the fridge, window glass and tracks. It is quoted as its own tier because it takes most of a day, not because it sounds more thorough.",
      },
      {
        heading: "New construction sheds drywall dust for months",
        body: "A house that has just been finished keeps releasing fine dust from cavities and vents long after the builder's clean. It settles on everything, and one pass does not end it. First cleans in Cedar Creek and Stonebridge are booked as deep cleans for that reason, and it is worth knowing before you assume the builder handled it.",
      },
      {
        heading: "That dust lands on the car too",
        body: "Anyone who parked in a driveway through a build knows this: fine construction dust bonds to paint and cannot be safely wiped off dry. It needs washing rather than rubbing, and rubbing is how it turns into scratches. We see more of that here than anywhere else we work.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Move-in and move-out cleans",
        body: "Inside every cabinet and drawer, inside the oven and fridge, glass and tracks. Landlord-ready or ready to hand over, and quoted as the full day it takes.",
      },
      {
        serviceId: "auto",
        heading: "Construction dust and new paint",
        body: "New builds shed fine dust for months and it does not come off dry. Washed properly rather than wiped, which is what stops it becoming swirl marks.",
      },
    ],
    faqs: [
      {
        q: "We just moved in and the builder already cleaned. Do we need another?",
        a: "Usually yes, and not because the builder did a bad job. New construction keeps shedding fine dust from cavities and vents for months, so the first clean after you move in is doing a different job from the one at handover.",
      },
      {
        q: "How far ahead should I book a move-out clean?",
        a: "Three or four days if you can. Move-outs run five to eight hours, so they take most of a working day and there are fewer of those slots than there are two-hour ones.",
      },
      {
        q: "Is it worth detailing a brand-new car?",
        a: "The exterior, yes, if it has sat in a driveway through construction. New paint is soft and construction dust is abrasive, so getting it off properly is worth more than it sounds.",
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
      "House cleaning and mobile detailing in Shawnee, KS. Nieman to Clear Creek. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Shawnee, from the older streets off Nieman through Bristol Highlands and Clear Creek out toward Shawnee Mission Park. Flat rate, confirmed before we start.",
    localNotes: [
      {
        heading: "The tree canopy sets the calendar",
        body: "Shawnee has more mature tree cover than most of the metro and it drives the work in both directions. Indoors it means more dust and more pollen through spring. On a car parked under it, it means sap, and sap is the one thing that gets worse the longer it is left.",
      },
      {
        heading: "Tree sap is not a wash, it is a removal",
        body: "Sap bonds to clear coat and hardens, and by high summer it has usually etched the surface underneath. It comes off with solvent and clay rather than pressure, and a car that has sat under a mature oak all season needs that step rather than a rinse. This is the most common reason a Shawnee exterior detail runs long.",
      },
      {
        heading: "Two street grids, two access realities",
        body: "The older grid around Nieman has narrow drives and detached garages. The newer subdivisions out west have wide drives and attached ones. It changes almost nothing for cleaning and a fair amount for detailing, which needs space around the vehicle.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "auto",
        heading: "Sap, pollen and canopy fallout",
        body: "The signature Shawnee detailing job. Sap needs solvent and clay rather than pressure, and by late summer it has usually started etching the clear coat underneath.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring and one-off home cleans",
        body: "Heavy canopy means more dust and a harder pollen season. Bi-weekly holds it; a one-off deep clean resets it.",
      },
    ],
    faqs: [
      {
        q: "There is sap all over my car. Can you get it off?",
        a: "Usually, yes. Sap needs solvent and a clay bar rather than pressure, and it is a normal part of an exterior detail here. If it has been baking on since spring it may have etched the clear coat underneath, and we will tell you honestly whether polishing will lift that or not.",
      },
      {
        q: "Do you cover the streets near Shawnee Mission Park?",
        a: "Yes, the whole city including Clear Creek and Bristol Highlands. The west side runs on the same routes as Lenexa, so a mid-week slot is usually easier to get than a Saturday.",
      },
      {
        q: "Does the pollen season change what a clean costs?",
        a: "No. The price comes from the size and condition of the house, not the time of year. It does mean a bi-weekly slot earns its keep more obviously in April than in January.",
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
      "House cleaning and mobile detailing in Lenexa, KS. City Center to Falcon Ridge. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Lenexa, from Old Town and City Center out through Falcon Ridge and Canyon Creek. Flat rate, confirmed before we start, nothing charged at booking.",
    localNotes: [
      {
        heading: "Detailing at the office beats detailing at home",
        body: "Lenexa has more people who work along the 87th Street corridor and at City Center than anywhere else we cover, and a car sitting in a work lot for eight hours is a car we can detail without anyone losing their Saturday. It is the single best use of a mobile service and the most common way Lenexa books it.",
      },
      {
        heading: "A work lot needs checking first, not assuming",
        body: "Two things stop a lot from working: no outdoor tap within reach, and a property manager who has not been asked. Neither is hard to solve, but both are much easier to solve the week before than on the morning. Ask your building, then tell us what they said.",
      },
      {
        heading: "Old Town and the newer subdivisions clean differently",
        body: "Old Town Lenexa is small older houses with less floor and more corners. Falcon Ridge and Canyon Creek are bigger, newer and simpler to clean per square foot. Our counters price by bedroom and bathroom rather than by postcode, which is what keeps that fair in both directions.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "auto",
        heading: "Detailing while you are at work",
        body: "Park it, hand over the keys, get it back done. Needs a tap within reach and a nod from whoever runs the lot, both worth sorting the week before.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring cleans across Falcon Ridge and Canyon Creek",
        body: "Newer, larger and simpler per square foot than Old Town. Bi-weekly is the usual slot.",
      },
    ],
    faqs: [
      {
        q: "Can you detail my car in my office parking lot?",
        a: "Often, yes, and it is the best thing about a mobile service. We need access to an outdoor tap and permission from whoever manages the lot. Ask them first, then tell us what they said, and we will fit around it.",
      },
      {
        q: "Do you do commercial cleaning for offices?",
        a: "Not at the moment. Lunova is two people and we are doing house cleaning and mobile detailing properly rather than taking on a nightly contract we could not staff. Small offices that want the same treatment as a house — one visit, flat rate — are worth a call, and if it is a nightly janitorial contract you need we will say so rather than waste your time.",
      },
      {
        q: "Is Old Town cheaper to clean than Canyon Creek?",
        a: "Often, but because the houses are smaller rather than because of where they are. We price by bedroom and bathroom count, so a compact Old Town house and a compact Canyon Creek house quote the same.",
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
      "House cleaning and mobile detailing in Leawood, KS. Hallbrook to Old Leawood. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Leawood, from Old Leawood and the streets around Town Center through Leawood Estates, Ironhorse and Hallbrook. Flat rate, agreed before anyone starts.",
    localNotes: [
      {
        heading: "Finishes decide the chemistry",
        body: "Leawood has more natural stone, more unlacquered brass, more specialist timber and more genuinely delicate surfaces per house than anywhere else in the metro. The wrong product on marble or on an oiled floor does damage that cleaning cannot undo. If there is something in the house that needs a particular product, leave it out with a note and we will use it.",
      },
      {
        heading: "Garage-kept cars need correction, not cleaning",
        body: "A car that lives in a garage is rarely dirty. What it has instead is swirl marks in the paint from years of being washed badly, which is a different job: single-stage machine polish rather than a heavier wash. That is the Leawood detail, and it is the one where the difference is visible from across the driveway.",
      },
      {
        heading: "Discretion is part of the service",
        body: "Households here are more likely to want the work done without a conversation about it, and more likely to be out while it happens. Codes and key handling go in the booking notes, they stay with the two of us because there is nobody else, and we do not post a customer's house or car without being asked to.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Recurring cleans with an extended scope",
        body: "Stone, specialist timber and delicate finishes. If something needs a particular product, leave it out and say so in the notes and we will use it.",
      },
      {
        serviceId: "auto",
        heading: "Paint correction on garage-kept cars",
        body: "Single-stage machine polish to lift the swirl marks that years of bad washing leave behind. The work is in the paint, not the dirt.",
      },
    ],
    faqs: [
      {
        q: "Do you use your own products or mine?",
        a: "Ours by default, and they are biodegradable. On stone, oiled timber or anything with a maintenance product of its own, leave yours out with a note and we will use it instead. That is the safer answer and we would rather be asked than guess.",
      },
      {
        q: "What is the difference between a wash and paint correction?",
        a: "A wash removes what is sitting on the paint. Correction removes what is in it: the fine swirl marks that build up from years of washing with the wrong cloth. It is a machine polish, it takes hours rather than minutes, and on a garage-kept car it is usually the only thing that will make a visible difference.",
      },
      {
        q: "Will you be discreet about the work?",
        a: "Yes. Access codes go in the booking notes and stay between the two of us, because there is nobody else in the company. We do not photograph or post a customer's house or vehicle unless you have told us we can.",
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
      "House cleaning and mobile detailing in Prairie Village, KS. Corinth to Meadowbrook. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Prairie Village, from Corinth and the shops area through Meadowbrook and the Fairway border. Flat rate, confirmed before we start, nothing taken at booking.",
    localNotes: [
      {
        heading: "Mid-century houses are more work per square foot",
        body: "Prairie Village is full of well-kept 1950s houses, and they are not simply small modern houses. Original wood trim, more separate rooms rather than open plan, more corners, more thresholds. A 1,600 square foot house here takes longer than a 1,600 square foot new build in Olathe, and it is worth knowing that before comparing quotes.",
      },
      {
        heading: "Original wood needs care rather than force",
        body: "Painted and stained woodwork of this age has usually been through several finishes. It cleans with gentle chemistry and a cloth, and it is damaged by anything abrasive. Our standard clean is written to that assumption throughout the older Johnson County streets.",
      },
      {
        heading: "Narrow drives change what is possible outside",
        body: "A lot of the housing here has a single-width drive or a detached garage set back off an alley. For detailing that is the only thing that matters: we need room to open every door fully. Cars usually end up done on the street out front, which is fine as long as the block allows it.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Deep cleans in mid-century homes",
        body: "More rooms, more corners and original woodwork that needs gentle chemistry rather than abrasion. Slower per square foot than a new build, and priced that way.",
      },
      {
        serviceId: "auto",
        heading: "Detailing on a narrow drive",
        body: "Single-width drives and set-back garages usually mean working on the street out front. It needs room to open every door, and a tap we can reach.",
      },
    ],
    faqs: [
      {
        q: "Why would a smaller house cost the same as a bigger one?",
        a: "Because layout matters as much as floor area. Mid-century houses have more separate rooms, more corners and more trim than an open-plan build of the same size, and all of that is time. We price bedrooms and bathrooms rather than square footage for exactly this reason.",
      },
      {
        q: "Is your standard clean safe on original woodwork?",
        a: "Yes. Gentle chemistry and cloths, nothing abrasive, which is the default across the older Johnson County streets rather than something you have to ask for. If a finish is fragile enough to worry you, say so in the notes and we will leave it alone.",
      },
      {
        q: "My drive is too narrow to open the doors. Can you still detail?",
        a: "We would do it on the street out front, assuming your block allows parking long enough. It is worth a message before booking so we can check rather than turn up and improvise.",
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
      "House cleaning and mobile detailing in Lee's Summit, MO. Lakewood to Winterset. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Lee's Summit, from downtown out through Lakewood, Raintree Lake, Longview and Winterset. Flat rate, agreed before we start work.",
    localNotes: [
      {
        heading: "Lake-adjacent properties get more of everything",
        body: "Lakewood, Raintree Lake and Longview generate more of both services than the rest of the city. Houses near water carry more dust, more damp and more traffic through the door. Vehicles carry the rest of it: launch ramp grit, lake water spotting and a boat trailer that never gets rinsed.",
      },
      {
        heading: "Water spotting is a mineral problem, not a dirt problem",
        body: "A car that gets splashed at a ramp and then dries in the sun leaves mineral deposits bonded to the paint and glass. Washing does not lift those. They need a dedicated treatment, and left long enough through a summer they etch the surface. Lake cars are the most common reason an exterior detail here needs more than a wash.",
      },
      {
        heading: "Distance means routing, and routing means notice",
        body: "Lee's Summit is the far side of our range from most of the Johnson County work. We can be here, but a booking made two or three days ahead gets a slot on a route rather than a special trip, and that is the difference between a good time and whatever is left.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "auto",
        heading: "Lake water spotting and ramp grit",
        body: "Mineral deposits bond to paint and glass and do not wash off. Treated properly rather than scrubbed, which is what stops it becoming permanent.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring family-home cleans",
        body: "Larger houses, more traffic through the door, and near the water more dust and damp than the rest of the city. Bi-weekly is the usual slot.",
      },
    ],
    faqs: [
      {
        q: "How much notice do you need out here?",
        a: "Two or three days gets you a real slot rather than a special trip. Lee's Summit is the far side of our range from the Johnson County work, so it runs on planned routes rather than same-day availability.",
      },
      {
        q: "My car has white spots that will not wash off. What is that?",
        a: "Mineral deposits, usually from lake water drying in the sun. They are bonded to the surface rather than sitting on it, so washing does nothing. There is a specific treatment for it, and the sooner it is done the better, because left through a summer they start etching the clear coat.",
      },
      {
        q: "Do you detail boats or trailers?",
        a: "Not at the moment. Cars, trucks, SUVs and vans. A boat is a different set of surfaces and a different set of products, and we would rather say no than learn on yours.",
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
      "House cleaning and mobile detailing in Independence, MO. Truman Heritage to Englewood. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Independence, from the Truman Heritage District through Englewood and Fairmount out to the Hartman Heritage area. Flat rate, confirmed before we start.",
    localNotes: [
      {
        heading: "Landlord turnovers run on a fixed number",
        body: "Independence has a lot of small landlords, and what they need from a turnover clean is not thoroughness so much as predictability: the same clean, to the same standard, for the same price, every time a tenant leaves. We quote those flat by bedroom count so it drops straight into a budget, and we can invoice per property.",
      },
      {
        heading: "Long-held houses need a reset, not a maintenance clean",
        body: "A house someone has lived in for thirty years is not dirty in the way a busy family house is dirty. It is layered: behind appliances, inside cabinets, on trim nobody has reached in years. That is a deep clean or a move-out clean, and quoting it as a standard clean does nobody a favour.",
      },
      {
        heading: "Older cars are about condition, not neglect",
        body: "A lot of the vehicles here have been owned a long time and looked after. What they have is age: dulled paint, dried trim, headlight lenses that have hazed over. Those respond well and cheaply, and headlight restoration in particular changes how a car looks for less than most people expect.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Tenant turnover cleans",
        body: "Flat by bedroom count against a landlord's checklist so the number is the same every time, and invoiced per property if you run more than one.",
      },
      {
        serviceId: "auto",
        heading: "Older cars, honestly assessed",
        body: "Hazed headlights, dried trim and dulled paint respond well and cheaply. We will tell you which of those is worth doing on your car and which is not.",
      },
    ],
    faqs: [
      {
        q: "Do you invoice per property for rentals?",
        a: "Yes. Turnovers are quoted flat by bedroom count and billed per address, which is what keeps the accounting straightforward when you are running several.",
      },
      {
        q: "Is a deep clean worth it on a house that has been lived in for decades?",
        a: "Usually more than on any other kind of house. The dirt in a long-held home is layered rather than surface, and a standard clean is not written to reach it. Book it once as a deep clean and a standard clean will hold it afterwards.",
      },
      {
        q: "Can you fix cloudy headlights?",
        a: "Yes, that is a restoration rather than a clean: wet-sanded, polished and sealed against UV. It is one of the cheapest things you can do to an older car and one of the most visible.",
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
      "House cleaning and mobile detailing in Blue Springs, MO. Woods Chapel to Adams Dairy. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Blue Springs, from downtown and Woods Chapel out past Lake Remembrance and the Adams Dairy Parkway corridor. Flat rate, confirmed before we start.",
    localNotes: [
      {
        heading: "This is a commuter town, and the cars show it",
        body: "More of Blue Springs drives I-70 daily than anywhere else we work, and highway miles leave a specific mess: bug splatter baked onto the front end, road film across the lower panels, brake dust welded to the wheels. None of it is neglect and all of it needs more than a rinse.",
      },
      {
        heading: "Bug residue is acidic and does not wait",
        body: "Insect residue is mildly acidic and starts etching paint within days in summer heat. Left across a season it leaves marks on a front bumper that polishing cannot fully remove. It is the most common avoidable damage we see on this side of the metro, and the fix is doing it sooner rather than harder.",
      },
      {
        heading: "This is the eastern edge of our range",
        body: "We work Blue Springs regularly, but it sits at the far end of the routes. Booking a few days out gets a proper slot rather than whatever is left, and mid-week is usually easier here than a Saturday.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "auto",
        heading: "Highway film, bug splatter and brake dust",
        body: "The commuter detail. Bug residue is acidic and starts etching paint within days in summer, so it is a job that rewards doing sooner rather than harder.",
      },
      {
        serviceId: "cleaning",
        heading: "Recurring family-home cleaning",
        body: "Larger houses and busy weeks. A bi-weekly slot holds a family home better than an occasional deep clean does, and costs less over a year.",
      },
    ],
    faqs: [
      {
        q: "The front of my car is covered in bugs. Will they come off?",
        a: "Almost always, if it has been weeks rather than a whole summer. Insect residue is mildly acidic and starts working on the paint quickly in heat, so the honest answer is that the sooner we see it the better the result. We will tell you what has already etched rather than promise it all comes out.",
      },
      {
        q: "How much notice do you need in Blue Springs?",
        a: "A few days. It is the eastern edge of our range, so it runs on planned routes. Mid-week is usually easier to get than a Saturday.",
      },
      {
        q: "Is a bi-weekly clean actually cheaper than a deep clean now and then?",
        a: "Over a year, yes, and it is also a better result. A house on a standing slot never gets far enough behind to need a reset, which is the expensive tier.",
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
      "House cleaning and mobile detailing in Raytown, MO. Little Blue to the 63rd Street corridor. Flat-rate quotes, nothing charged at booking.",
    intro:
      "Lunova Services cleans homes and details cars across Raytown, from downtown and the 63rd Street corridor through Little Blue and Raytown South. Flat rate, confirmed before we start, nothing taken at booking.",
    localNotes: [
      {
        heading: "Pre-sale deep cleans are half the work here",
        body: "A lot of what we do in Raytown is getting a house ready to list or ready for a family visit. That is a deep clean rather than a standard one, and the difference is real: baseboards, inside the appliances, light fixtures, the parts a photograph picks up and a walkthrough notices.",
      },
      {
        heading: "Carports are not garages, and cars know it",
        body: "Raytown has a lot of carports, which keep the rain off and nothing else. A car under one gets the full run of pollen, sap, dust and temperature swing while everyone assumes it is protected. Those vehicles usually need more exterior work than a garage-kept car and less than one that lives outdoors.",
      },
      {
        heading: "Single-storey houses are quicker, and the price says so",
        body: "Most of the housing here is one level, which takes stairs out of the job entirely. Stairs are a surprising share of the time in a clean, so a three-bedroom ranch generally quotes at the lower end for its size. That is not a discount, it is just what the work is.",
      },
    ],
    serviceFocus: [
      {
        serviceId: "cleaning",
        heading: "Pre-sale and pre-visit deep cleans",
        body: "Baseboards, inside the appliances, light fixtures and the details a walkthrough notices. Booked most often before a listing or before family arrive.",
      },
      {
        serviceId: "auto",
        heading: "Carport cars",
        body: "Sheltered from rain and nothing else. Pollen, sap and dust build up on paint that everyone assumes is protected, and it comes off easily if it is caught.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between a standard and a deep clean before selling?",
        a: "A standard clean is written to maintain a house. A deep clean reaches what a standard one skips: baseboards, door frames, inside the microwave, cabinet fronts, light fixtures, window sills. For a listing it is the deep clean you want, because those are exactly the details a photograph picks up.",
      },
      {
        q: "Is a single-storey house cheaper to clean?",
        a: "Often, yes, because stairs are a real share of the time in a clean and there are none. We price by bedroom and bathroom count, so a three-bedroom ranch usually lands at the lower end for its size.",
      },
      {
        q: "My car lives under a carport. Does it need detailing?",
        a: "More than most people assume. A carport stops rain and nothing else, so pollen, sap and dust build up on paint everyone thinks is protected. The good news is it usually comes off easily if it has not been left for years.",
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
