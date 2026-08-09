import { useEffect } from "react";
import { getConsent } from "../../utils/consent";
import { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "../../constants/analytics";

const SCRIPT_ID = "umami-analytics-script";

function loadUmami() {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = UMAMI_SCRIPT_URL;
  script.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
}

function removeUmami() {
  document.getElementById(SCRIPT_ID)?.remove();
}

/**
 * Loads Umami unless the visitor has explicitly opted out, and unloads it
 * again the moment they do. Renders nothing.
 *
 * WHY THE DEFAULT IS ON: Umami is cookieless. It sets nothing on the device
 * and stores no personal data, so it is not the kind of processing that needs
 * prior consent — the notice exists to disclose it and offer a real opt-out,
 * not to gate it.
 *
 * This used to be inverted: the script only loaded on an explicit "Accept",
 * which meant every visitor who ignored the banner — the overwhelming majority
 * — was invisible. The site had a working funnel, call-click tracking and
 * step-by-step booking events, and was measuring almost none of it. A
 * third-party audit of the live site reported no analytics installed at all,
 * which is exactly what a crawler that never clicks "Accept" would see.
 *
 * `null` (undecided) and `"granted"` both load. Only `"denied"` suppresses.
 */
export default function Analytics() {
  useEffect(() => {
    if (getConsent() !== "denied") loadUmami();

    const handleConsentChange = (e: Event) => {
      const status = (e as CustomEvent<"granted" | "denied">).detail;
      if (status === "granted") loadUmami();
      else removeUmami();
    };

    window.addEventListener("lunova-consent-change", handleConsentChange);
    return () => window.removeEventListener("lunova-consent-change", handleConsentChange);
  }, []);

  return null;
}
