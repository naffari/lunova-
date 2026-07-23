/**
 * Single source of truth for each service page's accent theme.
 * Values here must stay in sync with the CSS custom properties defined
 * for the matching `[data-theme="..."]` selector in src/styles/theme.css.
 */
export interface ServiceTheme {
  primary: string;
  accent: string;
  bg: string;
}

export const SERVICE_THEMES = {
  cleaning: { primary: "#14304A", accent: "#E8A830", bg: "#F1EBD9" },
  "residential-cleaning": { primary: "#14304A", accent: "#E8A830", bg: "#F1EBD9" },
  "commercial-cleaning": { primary: "#14304A", accent: "#E8A830", bg: "#F1EBD9" },
  "auto-detailing": { primary: "#14304A", accent: "#E8A830", bg: "#F1EBD9" },
  "junk-removal": { primary: "#0d382c", accent: "#f5b82e", bg: "#F1EBD9" },
  landscaping: { primary: "#0d382c", accent: "#f5b82e", bg: "#F1EBD9" },
  "bin-cleaning": { primary: "#0d382c", accent: "#f5b82e", bg: "#F1EBD9" },
  "power-washing": { primary: "#1A2F4A", accent: "#2BA8E0", bg: "#F1EBD9" },
  "window-cleaning": { primary: "#1A2F4A", accent: "#2BA8E0", bg: "#F1EBD9" },
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
