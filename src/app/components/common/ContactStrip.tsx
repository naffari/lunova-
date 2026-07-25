import { Phone, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { PHONE, PHONE_DISPLAY, EMAIL } from "../../constants/contact";

export type ContactStripVariant = "dark" | "light" | "compact";

interface ContactStripProps {
  heading?: string;
  subtext?: string;
  phone?: string;
  phoneDisplay?: string;
  email?: string;
  showEmail?: boolean;
  ctaLabel?: string;
  ctaTo?: string;
  primaryColor?: string;
  accentColor?: string;
  variant?: ContactStripVariant;
  className?: string;
}

/**
 * Shared contact/CTA strip used across the site (home page closer, service
 * page closers, etc). Consolidates what used to be several near-identical
 * "Ready to get started?" banners into one configurable component.
 */
export default function ContactStrip({
  heading = "Ready to Get Started?",
  subtext = "Book today and get a free estimate. We serve the Kansas City metro — same-day slots available.",
  phone = PHONE,
  phoneDisplay = PHONE_DISPLAY,
  email = EMAIL,
  showEmail = false,
  ctaLabel = "Book a Service",
  ctaTo = "/book",
  primaryColor = "#0E202F",
  accentColor = "#F1EBD9",
  variant = "dark",
  className = "",
}: ContactStripProps) {
  const isCompact = variant === "compact";
  const isLight = variant === "light";

  const bg = isLight ? accentColor : primaryColor;
  const headingColor = isLight ? primaryColor : "#ffffff";
  const subtextColor = isLight ? `${primaryColor}99` : "rgba(255,255,255,0.65)";
  const btnBg = isLight ? primaryColor : accentColor;
  const btnColor = isLight ? accentColor : primaryColor;
  const outlineBorder = isLight ? `${primaryColor}40` : "rgba(255,255,255,0.35)";
  const outlineText = isLight ? primaryColor : "#ffffff";
  const outlineHover = isLight ? `${primaryColor}0d` : "rgba(255,255,255,0.1)";

  return (
    <section
      className={`${isCompact ? "py-12" : "py-16"} px-4 sm:px-6 ${className}`}
      style={{ backgroundColor: bg }}
    >
      <div
        className={`max-w-4xl mx-auto text-center ${
          isCompact ? "flex flex-col sm:flex-row sm:items-center sm:justify-between sm:text-left gap-6" : ""
        }`}
      >
        <div>
          <h2
            className={`font-serif-display ${isCompact ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"} mb-3`}
            style={{ color: headingColor }}
          >
            {heading}
          </h2>
          {!isCompact && (
            <p
              className="text-sm mb-10 max-w-xl mx-auto leading-relaxed"
              style={{ color: subtextColor }}
            >
              {subtext}
            </p>
          )}
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center ${
            isCompact ? "sm:justify-end" : "justify-center"
          } gap-4 shrink-0`}
        >
          <Link
            to={ctaTo}
            className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all group w-full sm:w-auto justify-center"
            style={{ backgroundColor: btnBg, color: btnColor }}
          >
            {ctaLabel}
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              style={{ backgroundColor: btnColor, color: btnBg }}
            >
              <ArrowUpRight size={16} />
            </span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:+1${phone}`}
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full border-2 text-base transition-colors w-full sm:w-auto"
              style={{ borderColor: outlineBorder, color: outlineText }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = outlineHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <Phone size={18} />
              {phoneDisplay}
            </a>

            {showEmail && (
              <a
                href={`mailto:${email}`}
                aria-label={`Email us at ${email}`}
                className="hidden sm:inline-flex items-center justify-center w-14 h-14 rounded-full border-2 shrink-0 transition-colors"
                style={{ borderColor: outlineBorder, color: outlineText }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = outlineHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
