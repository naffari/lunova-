/**
 * The brand palette, in JS form.
 *
 * These values MUST match the `:root` custom properties in
 * src/styles/theme.css. That stylesheet is the real source of truth for
 * anything styled with Tailwind token classes (`bg-primary`, `text-foreground`);
 * this module exists only for the pages that still compose inline
 * `style={{ ... }}` objects and need the raw hex.
 *
 * Prefer the Tailwind token classes in new code. Reach for BRAND only when you
 * need a hex to build an alpha-composited value (e.g. `${BRAND.ink}99`).
 *
 * Contrast, measured against BRAND.bg (#F1EBD9):
 *   ink       14.0:1  — body and headings, passes AAA
 *   primary    5.4:1  — passes AA at normal text sizes
 *   muted      6.0:1  — passes AA
 * And white on primary is 6.1:1, ink on accent is 6.3:1 — both pass AA.
 *
 * The palette this replaced used #c8960e gold as a text colour on this same
 * cream, which measured 2.4:1 and failed AA outright. Do not reintroduce it.
 */
export const BRAND = {
  /** Warm cream page ground, shared by every page including service pages. */
  bg: "#F1EBD9",
  /** Slightly deeper cream for section tints and inset panels. */
  surface: "#E8DFD0",
  /** Near-black ink with a green cast. Body copy and headings. */
  ink: "#1e2319",
  /** Sage green — the brand colour. Primary buttons, links, active states. */
  primary: "#3d6b2e",
  /** Olive green — secondary accent, used on dark grounds where sage goes muddy. */
  accent: "#7fa650",
  /** Muted body copy. Use instead of alpha-compositing ink below ~70%. */
  muted: "#5f6256",
  /** White, for text on primary/ink grounds. */
  onPrimary: "#ffffff",
} as const;

/**
 * Dark site chrome — the fixed navbar, the footer, and the cookie banner.
 * Deliberately near-black rather than BRAND.ink: the chrome is meant to read as
 * a frame around the warm page ground, not as more of the same surface.
 *
 * These five values were previously redeclared in all three components. Import
 * them; don't re-inline them.
 */
export const CHROME = {
  bg: "#111318",
  text: "#E8E4DC",
  muted: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.08)",
  /** White reads cleaner than sage on this ground — sage muddies below ~15% lightness. */
  accent: "#ffffff",
} as const;
