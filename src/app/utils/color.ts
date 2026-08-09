/**
 * Color helpers for inline styles.
 *
 * The site colors each department from a hex value picked at runtime
 * (`SERVICE_THEMES[...]`), so Tailwind's `bg-primary/20` opacity syntax is not
 * available — those classes need the color at build time. The workaround had
 * been string concatenation: `${PRIMARY}20`, `${ACCENT}bb`, `${GROUND}1a`.
 *
 * That reads as noise, and it is quietly fragile:
 *   - the suffix is hex, so "20" is 12% and not 20% — every call site that
 *     looked like a percentage was wrong about its own opacity
 *   - it silently produces garbage on a 3-digit hex (`#abc` + `20` is not a
 *     color) or on any rgba()/named value
 *
 * `withAlpha` takes a real 0–1 opacity and handles both hex forms.
 */

/** Expands #abc to #aabbcc. Any other length is returned unchanged. */
function expandShorthand(hex: string): string {
  if (hex.length !== 4) return hex;
  const [, r, g, b] = hex;
  return `#${r}${r}${g}${g}${b}${b}`;
}

/**
 * `withAlpha("#3d6b2e", 0.12)` → `"#3d6b2e1f"`.
 *
 * Non-hex input (rgba(), a CSS variable, a named color) is returned untouched
 * rather than mangled — an inline style that ignores the alpha is a visual nit,
 * one that emits an invalid color is an invisible element.
 */
export function withAlpha(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;

  const hex = expandShorthand(color);
  if (hex.length !== 7) return color;

  const clamped = Math.min(1, Math.max(0, alpha));
  const suffix = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hex}${suffix}`;
}
