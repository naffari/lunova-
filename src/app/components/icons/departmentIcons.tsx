import type { SVGProps } from "react";

/**
 * Hand-drawn department icons — one per service line, approved against the
 * dark-direction mockup before this rebuild started. 24x24 grid, 1.6px
 * stroke, no fill, `currentColor` throughout, so each inherits its
 * department's accent for free wherever it's dropped in.
 *
 * These are simple machines drawn in clean geometry (a spray bottle, a
 * squeegee, a wheelie bin) — recognisable at 20px, not aiming for the
 * illustrative complexity of a licensed icon set. See the note in the
 * approved mockup for where that ceiling is.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Residential Cleaning — trigger spray bottle. */
export function CleaningIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7.6" y="12" width="6.8" height="9.2" rx="1.1" />
      <path d="M9.6 9.4h2.8V12H9.6z" />
      <path d="M12.4 10.2h3.5l1.3-2.4" />
      <path d="M18.4 6.9l2.2-1.3M18.9 8.6l2.5.3M17.6 5.3l.8-2.3" />
      <path d="M9.3 15.6h3.4" />
    </svg>
  );
}

/** Commercial Cleaning — office block, lit windows. */
export function CommercialIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V5.8a1 1 0 0 1 1-1h6.8a1 1 0 0 1 1 1V21" />
      <path d="M12.8 21V10.4h6.3a1 1 0 0 1 1 1V21" />
      <path d="M2.4 21h19.2" />
      <path d="M6.6 8.4h1.6M10 8.4h1.6M6.6 11.8h1.6M10 11.8h1.6M6.6 15.2h1.6M10 15.2h1.6" />
      <path d="M15.4 13.8h1.8M15.4 17.2h1.8" />
    </svg>
  );
}

/** Power Washing — spray wand, fan tip, hose. */
export function PowerWashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.6 14.4 17 7" />
      <path d="M9.6 14.4 7 17" />
      <path d="M8.7 15.3l-1.5-.5" />
      <path d="M15.9 5.9 18.1 8.1" />
      <path d="M19.4 6.2 22 4.6M19.8 8.6l2.4.6M18.2 4.4l.8-2.4" />
      <path d="M7 17c-2 1.4-3 2.4-3.4 3.8" />
    </svg>
  );
}

/** Window Cleaning — squeegee, water streaks. */
export function WindowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.4" y="16.2" width="11.8" height="2.4" rx="0.8" />
      <path d="M11.6 16.2 17.4 7.4" />
      <path d="M16 6.2 19.4 8.4" />
      <path d="M5.6 12.8h3.4M5.6 9.6h5.6M5.6 6.4h2.6" />
    </svg>
  );
}

/** Auto Detailing — sedan profile, shine ticks. */
export function AutoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.8 13 9.2 8.6h5.6L18 13" />
      <path d="M3.4 13h17.2a1 1 0 0 1 1 1v2.4H2.4V14a1 1 0 0 1 1-1z" />
      <circle cx="7.4" cy="16.4" r="1.9" />
      <circle cx="16.6" cy="16.4" r="1.9" />
      <path d="M13.4 5.4 15 3.8M16.8 6.2l2-1.4" />
    </svg>
  );
}

/** Landscaping — walk-behind mower, turf. */
export function LandscapingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.8" y="12.4" width="11.8" height="4.8" rx="1" />
      <path d="M14.6 12.4 19.8 6.2" />
      <path d="M18.2 4.8 21.6 7.2" />
      <circle cx="5.6" cy="19.4" r="1.8" />
      <circle cx="12" cy="19.4" r="1.8" />
      <path d="M2.6 21.6h1.4M8.2 21.6h1.6M15.2 21.6h1.6M19.4 21.6h1.8" />
    </svg>
  );
}

/** Bin Cleaning — wheelie bin, ribbed body. */
export function BinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.4" y="5.6" width="15.2" height="2.6" rx="0.9" />
      <path d="M10.4 5.6V4.2h3.2v1.4" />
      <path d="M6.2 8.2 7.6 19.4h8.8L17.8 8.2" />
      <path d="M9.9 10.8v6.2M14.1 10.8v6.2" />
      <circle cx="8.8" cy="21" r="1.3" />
      <circle cx="15.2" cy="21" r="1.3" />
    </svg>
  );
}

/** Junk Removal — box truck, cab and chassis. */
export function JunkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.2" y="7" width="10.6" height="8.4" rx="1" />
      <path d="M12.8 15.4V9.8h3.4L19.8 13v2.4" />
      <circle cx="6.2" cy="17.6" r="1.9" />
      <circle cx="16.6" cy="17.6" r="1.9" />
      <path d="M1.8 17.6h2.5M8.1 17.6h6.6M18.5 17.6h3.2" />
      <path d="M4.8 11.4h5.4" />
    </svg>
  );
}

/** Department id -> icon component, for pages that key off the same ids used in constants/theme.ts / constants/services.ts. */
export const DEPARTMENT_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  cleaning: CleaningIcon,
  "residential-cleaning": CleaningIcon,
  "commercial-cleaning": CommercialIcon,
  commercial: CommercialIcon,
  "power-washing": PowerWashIcon,
  power: PowerWashIcon,
  "window-cleaning": WindowIcon,
  window: WindowIcon,
  "auto-detailing": AutoIcon,
  auto: AutoIcon,
  landscaping: LandscapingIcon,
  "bin-cleaning": BinIcon,
  bin: BinIcon,
  "junk-removal": JunkIcon,
  junk: JunkIcon,
};
