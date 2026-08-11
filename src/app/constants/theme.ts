import { BRAND } from "./brand";

/**
 * Per-service accent themes, on the cream ground (reverted from the dark
 * rebuild — see the note in src/app/constants/brand.ts).
 *
 * Each department layers exactly one vivid identity colour plus one dark
 * near-black tone on top of the shared cream ground (BRAND.bg) — they do not
 * replace it. That is the whole "one skeleton, nine accents" system: nine
 * department pages that all look like the same company, not nine different
 * websites.
 *
 * TWO-TONE, restored: `primary` is a dark, hue-biased near-black — used for
 * headings, labels and any text/foreground role, since a vivid identity
 * colour is not reliably legible as text on cream. `accent` is the vivid
 * identity colour, for buttons, fills and highlights. `ground` is the same
 * dark tone as `primary` by construction (hero scrims, stat bands, deep
 * panels always want the dark tone regardless of what's currently assigned
 * to `primary`) — kept as a separate field since callsites already
 * destructure it explicitly. Values mirror the [data-theme] blocks in
 * src/styles/theme.css — change both together.
 */
export interface ServiceTheme {
  department: string;
  primary: string;
  accent: string;
  /** Near-black, department-tinted. Hero scrims, stat bands, deep panels. Same value as `primary`. */
  ground: string;
  bg: string;
}

const bg = BRAND.bg;

export const SERVICE_THEMES = {
  cleaning: { department: "Cleaning", primary: "#101E2C", accent: "#E8A830", ground: "#101E2C", bg },
  "residential-cleaning": { department: "Residential Cleaning", primary: "#101E2C", accent: "#E8A830", ground: "#101E2C", bg },
  "auto-detailing": { department: "Auto Detailing", primary: "#17100F", accent: "#D8402F", ground: "#17100F", bg },
  "bin-cleaning": { department: "Bin Cleaning", primary: "#0F1D14", accent: "#8DC63F", ground: "#0F1D14", bg },
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
