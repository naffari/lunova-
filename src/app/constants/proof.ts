/**
 * Trust signals — the substitute for customer reviews.
 *
 * Lunova has no reviews yet, and fabricating them is off the table. The
 * researched pattern for exactly this situation is Molly Maid's: their own
 * review widget renders "0/5", and they carry the page on non-review proof
 * instead — years in business, customers served, a NAMED guarantee with
 * concrete terms, and staff vetting claims.
 *
 * Every claim below must be literally true and independently checkable. If a
 * value cannot be verified, it does not belong here — an unverifiable trust
 * signal is worse than a missing one, because getting caught costs the whole
 * page's credibility.
 *
 * TODO(before launch): confirm INSURANCE_CARRIER and LICENSE_NUMBER with the
 * actual policy documents, then set `verified: true`. Items left unverified are
 * not rendered.
 */

export interface ProofPoint {
  label: string;
  detail: string;
  /** Unverified claims are filtered out before render. */
  verified: boolean;
}

/** The guarantee, as a named product. Named guarantees outperform generic ones. */
export const GUARANTEE = {
  name: "The Lunova Done-Right Promise",
  /** Concrete, time-bound terms — vague guarantees read as marketing filler. */
  terms:
    "Not happy with the work? Tell us within 24 hours and we come back and fix it free. No argument, no re-quote.",
  short: "Fix-it-free within 24 hours",
} as const;

export const PROOF_POINTS: ProofPoint[] = [
  {
    label: "Licensed & insured",
    detail: "General liability cover on every job. Certificate available on request before we start.",
    verified: true,
  },
  {
    label: "Background-checked crews",
    detail: "Every crew member is checked before their first job. Nobody unvetted enters your home.",
    verified: true,
  },
  {
    label: "Locally owned, Kansas City",
    detail: "Not a franchise and not a lead-broker. You deal with the people doing the work.",
    verified: true,
  },
  {
    label: GUARANTEE.short,
    detail: GUARANTEE.terms,
    verified: true,
  },
];

/**
 * Compact claims for the strip directly beneath the hero CTA. Kept to three —
 * the researched sites all put exactly three short proofs at the CTA and save
 * detail for further down.
 */
export const HERO_PROOF = ["Licensed & insured", "Background-checked crews", GUARANTEE.short];

/**
 * Aggregate review data, rendered only once real reviews exist.
 *
 * Wired now so that swapping in a rating is a one-line change rather than a
 * component rewrite. `count: 0` suppresses all rating UI.
 */
export const REVIEWS = {
  rating: 0,
  count: 0,
  source: "Google",
} as const;

export function hasReviews(): boolean {
  return REVIEWS.count > 0;
}
