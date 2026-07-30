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
 * Funnel step event for the booking wizard. Kept as its own helper so every
 * step reports with a consistent name and shape, which is what makes
 * step-to-step drop-off readable in the Umami dashboard.
 */
export function trackBookingStep(step: number, label: string, serviceId?: string): void {
  trackEvent("booking_step", { step, label, service: serviceId || "none" });
}
