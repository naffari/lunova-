import { Phone, Mail } from "lucide-react";
import type { CSSProperties } from "react";
import { useContactDetails } from "../../utils/obfuscate";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import { trackCall } from "../../utils/analytics";

interface PhoneLinkProps {
  className?: string;
  style?: CSSProperties;
  icon?: boolean;
  iconSize?: number;
  iconStyle?: CSSProperties;
  /** Text to render instead of the formatted number. */
  label?: string;
  /**
   * Where on the page this link sits ("navbar", "footer", "mobile_bar",
   * "hero"). Reported with the click event so the funnel can tell which
   * placements actually produce calls.
   */
  source?: string;
}

/**
 * Click-to-call link. One component so every phone link on the site is
 * identical, but the href is NOT deferred or obfuscated. That is deliberate:
 *
 * The LocalBusiness JSON-LD has to carry the real number in its `telephone`
 * field — that is what puts click-to-call into Google's local results, and it is
 * one of the highest-value things on the page for a local service business. So
 * the number is in the served HTML no matter what this component does.
 *
 * Given that, deferring the `tel:` href until hydration buys nothing against a
 * harvester (the digits are right there in the schema block) while costing
 * something real: on the prerendered pages, first paint would show a phone
 * number you cannot tap yet. On mobile, on a slow connection, that is a lost
 * call. Always-clickable wins.
 *
 * Email is different — see EmailLink.
 *
 * TRACKING: a `tel:` click is a conversion for a home-services business, and
 * for a lot of visitors it is the only one they will make. Until this fired an
 * event, the funnel measured the booking wizard and reported every caller as a
 * bounce, which made the highest-intent traffic look like the worst. The event
 * carries where the link was and which page it was on, so the two questions
 * that follow ("which placement works" and "which page sells") are answerable
 * without adding more instrumentation later.
 */
export function PhoneLink({
  className = "",
  style,
  icon = true,
  iconSize = 16,
  iconStyle,
  label,
  source = "unknown",
}: PhoneLinkProps) {
  return (
    <a
      href={`tel:+1${PHONE}`}
      className={className}
      style={style}
      onClick={() => trackCall(source)}
    >
      {icon && <Phone size={iconSize} style={iconStyle} />}
      {label ?? PHONE_DISPLAY}
    </a>
  );
}

interface EmailLinkProps {
  className?: string;
  style?: CSSProperties;
  icon?: boolean;
  iconSize?: number;
  iconStyle?: CSSProperties;
}

/**
 * Click-to-email link, assembled after hydration so no `mailto:` and no plain
 * address appear in the prerendered HTML.
 *
 * Worth doing here where it wasn't for phone: a bare email address is the single
 * easiest thing on a web page to harvest, the payoff for a spammer is immediate,
 * and — unlike `telephone` — the address earns almost nothing in structured
 * data, so it has been dropped from the JSON-LD entirely. That makes the
 * obfuscation actually complete rather than cosmetic.
 *
 * Pre-hydration this renders a plain "Email us" label, which is a fully useful
 * fallback: the visitor can still reach the contact form and the phone number.
 */
export function EmailLink({ className = "", style, icon = true, iconSize = 16, iconStyle }: EmailLinkProps) {
  const { ready, emailHref, email } = useContactDetails();

  if (!ready) {
    return (
      <span className={className} style={style}>
        {icon && <Mail size={iconSize} style={iconStyle} />}
        Email us
      </span>
    );
  }

  return (
    <a href={emailHref} className={className} style={style}>
      {icon && <Mail size={iconSize} style={iconStyle} />}
      {email}
    </a>
  );
}
