/**
 * Thin wrapper over Umami's custom-event API.
 *
 * The Umami script is only injected after the visitor accepts analytics
 * consent (see components/common/Analytics.tsx), so `window.umami` is
 * frequently absent. That is the expected path, not an error — events fired
 * before or without consent are dropped silently and nothing throws.
 */

type EventData = Record<string, string | number | boolean | undefined>;

interface UmamiGlobal {
  track: (name: string, data?: EventData) => void;
}

declare global {
  interface Window {
    umami?: UmamiGlobal;
  }
}

export function trackEvent(name: string, data?: EventData): void {
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break a user-facing flow.
  }
}

/**
 * Click-to-call conversion.
 *
 * For a home-services business a call is a conversion, and for many visitors it
 * is the only one they will make. Before this existed the funnel measured the
 * booking wizard and reported every caller as a bounce, which made the
 * highest-intent traffic look like the worst-performing.
 *
 * `source` is the placement (navbar, footer, mobile_bar, hero, contact_strip);
 * `path` is read at click time rather than passed in, so no component needs a
 * useLocation() subscription for a value only used once.
 */
export function trackCall(source: string): void {
  trackEvent("call_click", {
    source,
    path: typeof window === "undefined" ? "" : window.location.pathname,
  });
}

/**
 * Funnel step event for the booking wizard. Kept as its own helper so every
 * step reports with a consistent name and shape, which is what makes
 * step-to-step drop-off readable in the Umami dashboard.
 */
export function trackBookingStep(step: number, label: string, serviceId?: string): void {
  trackEvent("booking_step", { step, label, service: serviceId || "none" });
}
