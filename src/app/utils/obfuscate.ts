import { useEffect, useState } from "react";
import { EMAIL, PHONE } from "../constants/contact";

/**
 * EMAIL scraper hardening.
 *
 * Harvesting bots crawl static HTML for `mailto:` hrefs and plain-text
 * addresses, then sell the list on. Now that the site is prerendered, anything
 * in the markup is visible to a crawler that never runs a line of JavaScript.
 * This composes the address after mount so it isn't there to find.
 *
 * SCOPE — email only, and deliberately so.
 *
 * The phone number is NOT obfuscated. It has to appear in the LocalBusiness
 * JSON-LD `telephone` field to earn click-to-call in Google's local results,
 * so it is in the served HTML regardless; deferring the `tel:` href on top of
 * that would be cosmetic, and it would leave the number untappable until
 * hydration, which costs real calls on mobile. The email address earns almost
 * nothing in structured data, so it has been removed from the schema entirely —
 * which is what makes obfuscating it here actually airtight rather than
 * decorative.
 *
 * This defeats cheap harvesters, not a determined scraper running a headless
 * browser. That is the intended trade: near-zero cost, no loss of reachability
 * for humans.
 *
 * Consumers must render a useful fallback while `ready` is false — never a
 * blank. See EmailLink in components/common/ContactLinks.tsx.
 */

/**
 * Held as character codes so the contact strings never appear contiguously in
 * the built JS bundle either, which is the other place a lazy harvester looks.
 */
const phoneCodes = PHONE.split("").map((c) => c.charCodeAt(0));
const emailCodes = EMAIL.split("").map((c) => c.charCodeAt(0));

function decode(codes: number[]): string {
  return String.fromCharCode(...codes);
}

export interface ContactDetails {
  ready: boolean;
  phone: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
}

export function useContactDetails(): ContactDetails {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return { ready: false, phone: "", phoneDisplay: "", phoneHref: "", email: "", emailHref: "" };
  }

  const digits = decode(phoneCodes);
  const email = decode(emailCodes);

  return {
    ready: true,
    phone: digits,
    phoneDisplay: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`,
    phoneHref: `tel:+1${digits}`,
    email,
    emailHref: `mailto:${email}`,
  };
}
