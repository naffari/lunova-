import { Phone, Mail } from "lucide-react";
import type { CSSProperties } from "react";
import { useContactDetails } from "../../utils/obfuscate";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";

interface PhoneLinkProps {
  className?: string;
  style?: CSSProperties;
  icon?: boolean;
  iconSize?: number;
  iconStyle?: CSSProperties;
  /** Text to render instead of the formatted number. */
  label?: string;
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
 */
export function PhoneLink({
  className = "",
  style,
  icon = true,
  iconSize = 16,
  iconStyle,
  label,
}: PhoneLinkProps) {
  return (
    <a href={`tel:+1${PHONE}`} className={className} style={style}>
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
