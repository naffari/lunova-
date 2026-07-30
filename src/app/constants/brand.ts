/**
 * THE brand palette. Single source of truth — mirrored in CSS at
 * src/styles/theme.css for anything styled with Tailwind token classes
 * (bg-background, text-foreground, bg-card, border-border). Reach for these
 * raw hex values only when composing an inline style that needs to build an
 * alpha-blended color (e.g. `${BRAND.accent}1a`).
 *
 * DARK GROUND, chosen deliberately warm rather than neutral: seven of the
 * eight department accents (src/app/constants/theme.ts) are warm hues, so a
 * neutral grey ground would fight them. `bg`/`surface`/`raised` step from
 * darkest to lightest for page ground → card → stat band / deep panel.
 *
 * NAMING NOTE: `ink` predates the dark rebuild, when it WAS the near-black
 * text color on a cream ground. The name stuck because renaming it means
 * touching every "color: PRIMARY" callsite across nine service pages; the
 * VALUE flipped to the light foreground color it needs to be on a dark
 * ground. Read `BRAND.ink` as "the strong foreground token", not literally
 * as ink.
 */
export const BRAND = {
  /** Warm charcoal page ground. Same value the dark chrome (nav/footer) uses. */
  bg: "#171512",
  /** Card / section surface, one step up from the ground. */
  surface: "#201D19",
  /** Stat bands and deep panels — the darkest surface, used sparingly. */
  raised: "#100F0C",
  /** Primary text color. See naming note above. */
  ink: "#EDEAE3",
  /** Muted body text. */
  muted: "#A29C92",
  /** Sage green — the parent-brand accent (the homepage / HQ identity). */
  primary: "#3d6b2e",
  /** Olive green — secondary parent-brand accent. */
  accent: "#7fa650",
  /** Text on a filled primary/accent button. */
  onPrimary: "#ffffff",
  /** Hairline border, the thing that replaces card shadows sitewide. */
  hairline: "rgba(237, 234, 227, 0.12)",
  hairlineStrong: "rgba(237, 234, 227, 0.22)",
} as const;

/**
 * Dark site chrome — the fixed navbar, the footer, and the cookie banner.
 *
 * Now the SAME tone as BRAND.bg on purpose: the nav is a frosted-blur overlay
 * on the page itself, not a separate darker frame around it. Kept as its own
 * export because the chrome renders on every route regardless of that route's
 * department accent, so it needs an accent-neutral definition.
 */
export const CHROME = {
  bg: BRAND.bg,
  text: BRAND.ink,
  muted: "rgba(237, 234, 227, 0.55)",
  border: BRAND.hairline,
  /** White reads cleaner than an accent here — chrome stays accent-neutral. */
  accent: "#ffffff",
} as const;
