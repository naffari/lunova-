/**
 * Entity facts about the business, as opposed to contact points (contact.ts).
 *
 * Everything here exists to feed structured data and the local-SEO surfaces
 * that read it: LocalBusiness JSON-LD, the /about and /contact pages, and the
 * `sameAs` links that tie this website to the Google Business Profile.
 *
 * THE RULE, same as constants/proof.ts: every value must be literally true.
 * Google cross-checks schema against the Business Profile, and a mismatch on
 * hours or name is worse than omitting the field. It degrades trust in the whole
 * entity, which is what local ranking is built on.
 */

/**
 * Google Business Profile.
 *
 * `sameAs` is what tells Google that this website and that profile are one
 * entity. The share link works, since Google follows the redirect, but the
 * canonical Maps URL is stronger and does not depend on a shortener staying
 * alive. To upgrade: open the profile in Google Maps, copy the full
 * /maps/place/... URL, paste it over PROFILE_URL. To fill PLACE_ID, look the
 * business up at
 * https://developers.google.com/maps/documentation/places/web-service/place-id
 * With it set, buildLocalBusinessSchema emits a hasMap link Google resolves to
 * the profile directly.
 */
export const GOOGLE_BUSINESS = {
  /**
   * The share link from the Business Profile. Works, and Google follows it,
   * but it resolves to a search URL rather than a stable Maps place URL. Once
   * PLACE_ID below is filled, prefer replacing this with the canonical
   * `https://www.google.com/maps/place/?q=place_id:<PLACE_ID>` form, which
   * does not depend on a shortener staying alive.
   */
  PROFILE_URL: "https://share.google/vL3mMBGcNd8sLjAmC",

  /**
   * Google Place ID, the `ChIJ…` string. Empty until filled; the schema omits
   * `hasMap` rather than emitting a blank.
   *
   * NOT the same as the `kgmid` (`/g/11nr3bn4df`) visible in the share link's
   * redirect — that is a Knowledge Graph id and the review and map URLs will
   * not accept it. Get the real one from
   * https://developers.google.com/maps/documentation/places/web-service/place-id
   */
  PLACE_ID: "",

  /**
   * Direct "leave a review" link, taken straight from the Business Profile.
   *
   * In the GBP dashboard: "Ask for reviews" (or "Get more reviews") hands you
   * a short link of the form `https://g.page/r/<id>/review`. Paste it here.
   * That is the link to text a customer the day after a job, and review
   * velocity is a large share of local ranking weight — for a business with no
   * reviews at all it is the single highest-value thing on this page.
   *
   * Preferred over deriving the URL from PLACE_ID because GBP gives you this
   * one in two clicks, whereas the Place ID needs a lookup tool.
   */
  REVIEW_LINK: "",

  /** Whichever review destination is configured, best first. */
  get REVIEW_URL(): string {
    if (this.REVIEW_LINK) return this.REVIEW_LINK;
    if (this.PLACE_ID) return `https://search.google.com/local/writereview?placeid=${this.PLACE_ID}`;
    return this.PROFILE_URL;
  },
} as const;

/**
 * Every profile that represents this business elsewhere on the web.
 *
 * Only add a URL once the profile exists and its name and phone match
 * contact.ts character for character. An entry pointing at an unclaimed or
 * inconsistent listing does damage: NAP conflicts are the most common cause of
 * a local business failing to consolidate into one entity in Google's index.
 */
export const SAME_AS: string[] = [GOOGLE_BUSINESS.PROFILE_URL].filter(Boolean);

/**
 * Other names real people use for this business.
 *
 * Emitted as `alternateName` on the Organization and WebSite nodes. This is
 * how you get found by someone who half-remembers the name — searches for
 * "Lunova KC" or "Lunova cleaning" rather than the registered
 * "Lunova Services". Without it, Google has one string to match a brand query
 * against, and brand queries are the highest-intent traffic a new business
 * gets: those people already decided to hire you and are just looking for the
 * phone number.
 *
 * Only add names that are genuinely in use or genuinely likely to be typed.
 * Stuffing this with keyword variants ("best cleaning Kansas City") is a spam
 * signal, not a ranking one.
 */
export const ALTERNATE_NAMES: string[] = [
  "Lunova",
  "Lunova KC",
  "Lunova Cleaning",
  "Lunova Services Kansas City",
];

/**
 * Opening hours, in schema.org's `openingHoursSpecification` shape.
 *
 * MUST match the Google Business Profile exactly. Google cross-checks the two,
 * and an hours mismatch is a NAP inconsistency like any other.
 *
 * Values taken from the footer, which was the only place hours had ever been
 * stated. TODO(before launch): confirm these against the Business Profile and
 * correct both together if they differ.
 */
export const OPENING_HOURS = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "19:00" },
  { days: ["Saturday"], opens: "08:00", closes: "17:00" },
] as const;

/**
 * Human-readable version of the above.
 *
 * Rendered on /contact AND in the footer. Two hand-written copies is how a site
 * ends up telling Google one thing in its schema and a customer another on the
 * page. The footer used to be the second copy.
 */
export const HOURS_DISPLAY = [
  { label: "Mon to Fri", value: "7:00 AM to 7:00 PM" },
  { label: "Saturday", value: "8:00 AM to 5:00 PM" },
  { label: "Sunday", value: "Closed" },
] as const;

/**
 * Metro centroid, used for the `areaServed` GeoCircle in LocalBusiness schema.
 *
 * This is the Kansas City metro's approximate center, not a street address.
 * Lunova is a service-area business with no storefront, and inventing a
 * `PostalAddress` to fill the schema field would be a fabricated fact that
 * Google can and does check against the Business Profile.
 */
export const SERVICE_CENTER = {
  latitude: 39.0997,
  longitude: -94.5786,
  /** Metres. About 40 km covers the metro from the Northland to Olathe. */
  radius: 40000,
} as const;

/** Year the business began trading. Used for `foundingDate` and the /about page. */
export const FOUNDED_YEAR = 2025;

/** Currencies and payment methods, for schema completeness. */
export const PAYMENT = {
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card",
  priceRange: "$$",
} as const;
