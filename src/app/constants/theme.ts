import { BRAND } from "./brand";

/**
 * Per-service accent themes, on the dark rebuild.
 *
 * Each department layers exactly one vivid identity colour on top of the
 * shared dark ground (BRAND.bg) — they do not replace it. That is the whole
 * "one skeleton, nine accents" system: nine department pages that all look
 * like the same company, not nine different websites.
 *
 * `primary`/`accent` are the SAME vivid hex on purpose. The old cream-era
 * version used two different tones (a dark navy "primary" for headings and a
 * bright "accent" for highlights) because dark navy read fine as text on
 * cream. On a dark ground that dark navy is nearly invisible, so there is
 * only one identity colour now — components that used to alternate between
 * PRIMARY and ACCENT for two-tone icon tints just get one consistent tone.
 *
 * `ground` is the near-black tone unique to each department (hero scrims,
 * stat bands, deep panels) — a hue-biased near-black rather than the flat
 * page background, so those sections read as "this department", not just
 * "the page again". Values mirror the [data-theme] blocks in
 * src/styles/theme.css — change both together.
 */
export interface ServiceTheme {
  department: string;
  primary: string;
  accent: string;
  /** Near-black, department-tinted. Hero scrims, stat bands, deep panels. */
  ground: string;
  bg: string;
}

const bg = BRAND.bg;

export const SERVICE_THEMES = {
  cleaning: { department: "Cleaning", primary: "#E8A830", accent: "#E8A830", ground: "#101E2C", bg },
  "residential-cleaning": { department: "Residential Cleaning", primary: "#E8A830", accent: "#E8A830", ground: "#101E2C", bg },
  "commercial-cleaning": { department: "Commercial Cleaning", primary: "#C97B3C", accent: "#C97B3C", ground: "#141F29", bg },
  "power-washing": { department: "Power Washing", primary: "#2BA8E0", accent: "#2BA8E0", ground: "#101C2C", bg },
  "window-cleaning": { department: "Window Cleaning", primary: "#F0B429", accent: "#F0B429", ground: "#171B22", bg },
  "auto-detailing": { department: "Auto Detailing", primary: "#D8402F", accent: "#D8402F", ground: "#17100F", bg },
  landscaping: { department: "Landscaping", primary: BRAND.accent, accent: BRAND.accent, ground: "#0A2119", bg },
  "bin-cleaning": { department: "Bin Cleaning", primary: "#8DC63F", accent: "#8DC63F", ground: "#0F1D14", bg },
  "junk-removal": { department: "Junk Removal", primary: "#F97316", accent: "#F97316", ground: "#191410", bg },
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
