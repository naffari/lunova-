/**
 * THE brand palette. Single source of truth — mirrored in CSS at
 * src/styles/theme.css for anything styled with Tailwind token classes
 * (bg-background, text-foreground, bg-card, border-border). Reach for these
 * raw hex values only when composing an inline style that needs to build an
 * alpha-blended color (e.g. `${BRAND.accent}1a`).
 *
 * CREAM GROUND. The dark rebuild (commit 5b52a7d) flipped this sitewide to a
 * warm charcoal; reverted back to the original warm-cream content ground.
 * The dark tone lives on deliberately: CHROME (nav/footer) and each
 * department's `ground` (src/app/constants/theme.ts) stay dark by design —
 * hero sections, stat bands, and the site chrome are the "very dark warm
 * primary" half of the pattern, cream page content is the other half. Only
 * the plain content tokens below (bg/surface/ink/muted/hairline) flip.
 *
 * NAMING NOTE: `ink` is the near-black text color on the cream ground — the
 * name is literal again now that the palette is back to its original sense.
 */
export const BRAND = {
  /** Warm cream page ground. */
  bg: "#F1EBD9",
  /** Card / section surface, a touch lighter than the ground so cards lift off the page. */
  surface: "#FBF8F0",
  /** Stat bands and deep panels — stays dark; these are the chrome-toned accents on the cream page. */
  raised: "#100F0C",
  /** Primary text color — near-black, warm-biased. */
  ink: "#211D17",
  /** Muted body text. */
  muted: "#7A7166",
  /** Sage green — the parent-brand accent (the homepage / HQ identity). */
  primary: "#3d6b2e",
  /** Olive green — secondary parent-brand accent. */
  accent: "#7fa650",
  /** Text on a filled primary/accent button. */
  onPrimary: "#ffffff",
  /** Hairline border, the thing that replaces card shadows sitewide. */
  hairline: "rgba(33, 29, 23, 0.12)",
  hairlineStrong: "rgba(33, 29, 23, 0.22)",
} as const;

/**
 * Dark site chrome — the fixed navbar, the footer, and the cookie banner.
 *
 * Deliberately independent of BRAND.bg/ink, not derived from them. The page
 * content ground is cream; the chrome stays the dark warm tone regardless —
 * that's the "very dark warm primary" half of the pattern the cream half sits
 * against. Every value here is a literal, so flipping BRAND's content tokens
 * (light/dark mode, a future palette pass) can never silently drag the chrome
 * along with it the way it did when `bg`/`text`/`border` referenced BRAND
 * directly — that mismatch was why nav dropdown text went invisible the
 * moment BRAND.bg flipped to cream. Kept as its own export because the
 * chrome renders on every route regardless of that route's department
 * accent, so it needs an accent-neutral definition.
 */
export const CHROME = {
  bg: "#171512",
  text: "#EDEAE3",
  muted: "rgba(237, 234, 227, 0.55)",
  border: "rgba(237, 234, 227, 0.12)",
  /** White reads cleaner than an accent here — chrome stays accent-neutral. */
  accent: "#ffffff",
} as const;
