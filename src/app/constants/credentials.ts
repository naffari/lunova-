/**
 * What Lunova can currently prove about itself.
 *
 * WHY THIS FILE EXISTS: the site advertised "Licensed & Insured" in 47 places —
 * hero trust badges, stat bands, marquees, meta descriptions, city pages, the
 * shared FAQ — and none of it was true yet. Two of those went further than a
 * badge and promised a document: the site-wide FAQ said "proof of insurance is
 * available on request before your job", and the Overland Park page offered to
 * "send a certificate of insurance to your association before we start".
 *
 * That is a different category of claim from marketing copy. It is the claim a
 * customer relies on when deciding to let a stranger into their house, the one
 * an HOA contracts on, and the one a commercial property manager will ask to
 * see before issuing a bid. Advertising it while uninsured is a
 * misrepresentation a customer acts on, and the exposure lands on the business,
 * not on the website.
 *
 * So the claims are gated on these flags rather than deleted. The moment a
 * policy is bound, flip `insured` to true and every badge, stat, marquee item
 * and FAQ answer comes back in one edit — nothing needs rewriting.
 *
 * DO NOT flip a flag to true in anticipation. "The policy is being sorted out"
 * is not the same as being covered, and the gap between the two is exactly the
 * window in which something goes wrong in someone's kitchen.
 */
export const CREDENTIALS = {
  /**
   * General liability cover, bound and in force.
   *
   * false as of 2026-08-10 — stated by the owner: the site was built ahead of
   * buying insurance. Flip when the certificate is in hand, not when it is
   * quoted.
   */
  insured: false,

  /**
   * Business licensing for the trades we sell, in the jurisdictions we work in.
   *
   * false because it has never been confirmed either way, and "licensed" was
   * only ever asserted next to "insured". Kansas City, MO and the Johnson
   * County cities have their own occupational licence requirements — check
   * before flipping this, per city, not once.
   */
  licensed: false,

  /**
   * Criminal background checks run on every crew member before their first job.
   *
   * UNCONFIRMED. This was on the site as a verified proof point and no one has
   * said whether the process exists. It is left true because nothing has
   * contradicted it — but it is the next claim to check, and if there is no
   * actual check being run it belongs at false immediately. It is the second
   * thing a customer letting someone into their home is relying on.
   */
  backgroundChecked: true,
} as const;

/**
 * Trust badges that are currently true, in priority order.
 *
 * Callers take the first N they have room for rather than hardcoding a list,
 * so a page never renders a claim that has been switched off — and never
 * renders a gap where one used to be either. There are deliberately more
 * entries here than any caller uses.
 */
export const TRUST_BADGES: string[] = [
  ...(CREDENTIALS.insured ? ["Licensed & insured"] : []),
  ...(CREDENTIALS.backgroundChecked ? ["Background-checked crews"] : []),
  "Locally owned in Kansas City",
  "Flat-rate quotes, confirmed before we start",
  "Nothing charged at booking",
  "Same-week slots",
];

/** The first `count` true badges. */
export function trustBadges(count = 3): string[] {
  return TRUST_BADGES.slice(0, count);
}

/**
 * Honest answer to "are you licensed and insured?".
 *
 * The question gets asked, so the FAQ keeps it — silently dropping it reads
 * worse than answering it, and someone who cares enough to ask deserves a
 * straight answer rather than a page that has quietly gone quiet on the
 * subject.
 */
export function insuranceFaq(): { q: string; a: string } {
  if (CREDENTIALS.insured) {
    return {
      q: "Are you licensed and insured?",
      a: "Yes. Lunova carries general liability insurance, and a certificate is available on request before your job starts.",
    };
  }

  return {
    q: "Are you insured?",
    a: "Not yet, and we would rather say so here than have you find out at the door. Lunova is new and general liability cover is being put in place — until it is, we are not taking work that requires a certificate of insurance, and we will tell you before you book if that affects your job. Everything else on this site stands: flat-rate pricing confirmed before we start, nothing charged at booking, and the Done-Right Promise if the work is not right.",
  };
}
