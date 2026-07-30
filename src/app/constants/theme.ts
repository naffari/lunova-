import { BRAND } from "./brand";

/**
 * DEPARTMENT IDENTITIES.
 *
 * Each service line gets its own accent and its own dark ground, so the
 * branches can be spun out as separate departments later without a redesign —
 * the colour already belongs to the department rather than to the page.
 *
 * THE GUARDRAIL: identity is colour only. Every service page shares the exact
 * same skeleton (ServiceHero → marquee → packages → features → work gallery →
 * process → StatBand → service area → FAQ → ContactStrip) and the exact same
 * type scale. Nine palettes on one layout reads as one company with nine
 * divisions. Nine palettes on nine layouts reads as nine different websites
 * badly glued together. Do not fork the layout per service.
 *
 * `ground` is only ever used as a dark surface behind white text — hero scrims,
 * the stat band, the process band — so its contrast obligation is against
 * white, not against BRAND.bg. `accent` must clear 4.5:1 on `ground`.
 *
 * Values must stay in sync with the `[data-theme="..."]` blocks in
 * src/styles/theme.css.
 */

export interface ServiceTheme {
  /** Human label for the department, for future org/nav separation. */
  department: string;
  /** Dark ground. Used behind white text only. */
  primary: string;
  /** The department's signature colour. */
  accent: string;
  /** Page ground — shared across every department on purpose. */
  bg: string;
}

const bg = BRAND.bg;

export const SERVICE_THEMES = {
  // ── Cleaning division ────────────────────────────────────────────────
  // Deep navy + warm amber. The parent of the two cleaning sub-brands.
  cleaning: { department: "Cleaning", primary: "#14304A", accent: "#E8A830", bg },
  "residential-cleaning": { department: "Residential Cleaning", primary: "#14304A", accent: "#E8A830", bg },
  // Copper against a colder slate, so commercial reads as the business-facing
  // sibling rather than a recolour of residential.
  "commercial-cleaning": { department: "Commercial Cleaning", primary: "#1B2A38", accent: "#C97B3C", bg },

  // ── Exterior division ────────────────────────────────────────────────
  // Blue is the one cool accent in the system and it is earned: the service is
  // water. Anything warm here fights the subject matter.
  "power-washing": { department: "Power Washing", primary: "#1A2F4A", accent: "#2BA8E0", bg },
  // Glass gets warm gold rather than a second blue — two blues in the same
  // division were indistinguishable in the nav and on the cards.
  "window-cleaning": { department: "Window Cleaning", primary: "#1E2430", accent: "#F0B429", bg },

  // ── Auto division ────────────────────────────────────────────────────
  // Automotive crimson on near-black, picked to sit with the dark-red bodywork
  // in the detailing photography.
  "auto-detailing": { department: "Auto Detailing", primary: "#1A1618", accent: "#D8402F", bg },

  // ── Grounds division ─────────────────────────────────────────────────
  // Sage carries straight through from the parent brand — lawn care is the
  // closest department to the Lunova mark itself.
  landscaping: { department: "Landscaping", primary: "#0d382c", accent: BRAND.accent, bg },
  // Fresh lime for sanitation, distinct from landscaping's deeper sage.
  "bin-cleaning": { department: "Bin Cleaning", primary: "#17301F", accent: "#8DC63F", bg },

  // ── Hauling division ─────────────────────────────────────────────────
  // Safety orange on warm charcoal. The most industrial line gets the most
  // industrial colour.
  "junk-removal": { department: "Junk Removal", primary: "#1F1B16", accent: "#F97316", bg },
} as const satisfies Record<string, ServiceTheme>;

export type ServiceThemeKey = keyof typeof SERVICE_THEMES;

// Typography
export const TYPE = {
  h1: 'text-5xl sm:text-6xl md:text-7xl',
  h2: 'text-4xl sm:text-5xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  label: 'text-xs uppercase tracking-widest',
  body: 'text-base',
};

// Spacing
export const SPACING = {
  section: 'py-16',
  hero: 'py-20',
  compact: 'py-12',
};

// Container widths
export const CONTAINERS = {
  full: 'max-w-7xl',
  centered: 'max-w-5xl',
  narrow: 'max-w-4xl',
};

// Icon sizes
export const ICON_SIZE = {
  small: 14,    // inline
  medium: 16,   // cards
  large: 24,    // features
  hero: 28,     // prominent
};
