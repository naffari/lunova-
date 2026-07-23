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
 * Loads the Umami analytics script once the visitor has accepted
 * cookies/analytics via the CookieConsent banner, and removes it again
 * if they later revoke consent. Renders nothing.
 */
export default function Analytics() {
  useEffect(() => {
    if (getConsent() === "granted") loadUmami();

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
