import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Cookie } from "lucide-react";
import { getConsent, setConsent } from "../../utils/consent";
import { BRAND, CHROME } from "../../constants/brand";

/**
 * Analytics notice, not a cookie wall.
 *
 * This site sets no advertising or tracking cookies. The only measurement on
 * it is Umami, which is cookieless, so the honest framing is a disclosure with
 * a working opt-out rather than an Accept/Decline gate — and the banner now
 * says so instead of talking about cookies it does not set. Analytics runs
 * unless the visitor opts out; see components/common/Analytics.tsx.
 *
 * Shown until the visitor makes a choice, then dismissed permanently (stored
 * in localStorage via utils/consent.ts). Sits above the mobile sticky CTA bar
 * on small screens (see the bottom-[4.75rem] sm:bottom-0 offset).
 *
 * BEFORE LAUNCH: have counsel confirm this wording and the Privacy Policy it
 * links to. The framing above is a reasonable reading for cookieless
 * first-party analytics on a US-only service business, but it is a legal call,
 * not an engineering one.
 */
interface CookieConsentProps {
  /** Whether the mobile sticky CTA bar is currently occupying the bottom
   *  of the viewport, so this banner can sit above it instead of overlapping. */
  mobileCtaVisible: boolean;
}

export default function CookieConsent({ mobileCtaVisible }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  const choose = (status: "granted" | "denied") => {
    setConsent(status);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 z-50 px-4 py-4 sm:px-6 ${mobileCtaVisible ? "bottom-[4.75rem] sm:bottom-0" : "bottom-0"}`}
      style={{ backgroundColor: CHROME.bg, borderTop: `1px solid ${CHROME.border}` }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <Cookie size={22} className="shrink-0 hidden sm:block" style={{ color: BRAND.accent }} />
        <p className="text-xs sm:text-sm text-center sm:text-left flex-1" style={{ color: CHROME.text }}>
          We count page views with cookieless analytics so we know which services people
          actually need. No cookies, no ad tracking, nothing sold on. Full detail in our{" "}
          <Link to="/privacy" className="underline font-semibold">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: CHROME.text }}
          >
            Opt out
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="px-4 py-2 rounded-full text-xs font-bold transition-colors"
            style={{ backgroundColor: BRAND.accent, color: BRAND.ink }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
