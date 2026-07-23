/**
 * Lightweight cookie-consent state, stored in localStorage so the choice
 * persists across visits. Non-essential integrations (analytics, etc.)
 * should check `getConsent() === "granted"` before initializing.
 */

const CONSENT_KEY = "lunova-cookie-consent";

export type ConsentStatus = "granted" | "denied" | null;

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setConsent(status: Exclude<ConsentStatus, null>): void {
  window.localStorage.setItem(CONSENT_KEY, status);
  window.dispatchEvent(new CustomEvent("lunova-consent-change", { detail: status }));
}
