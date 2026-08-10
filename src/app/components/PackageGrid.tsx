import { Link } from "react-router";
import { Check, X, ArrowUpRight } from "lucide-react";
import { getServiceDetail } from "../constants/serviceDetails";
import { formatDollars, bookPath, isActive, type ServiceId } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { withAlpha } from "../utils/color";

interface PackageGridProps {
  /** Booking-wizard category id, e.g. "power". Keys into serviceDetails.ts. */
  serviceKey: ServiceId;
  primaryColor: string;
  accentColor: string;
}

/**
 * The package/pricing section every service page now renders.
 *
 * WHY THIS REPLACES THE OLD PER-PAGE PACKAGES ARRAY: each of the nine service
 * pages used to hand-roll its own PACKAGES constant — different prices than
 * the booking wizard's, no inclusion checklist, no connection to the booking
 * flow at all beyond a generic "Book this service" link to /book?service=X.
 * Clicking "Basic Wash" told the wizard nothing; step 1 started cold.
 *
 * This reads the EXACT SAME src/app/constants/serviceDetails.ts the wizard's
 * ServiceDetailStep renders — same checklist, same price, same package ids.
 * The "Book this" button links to `/book?service=X&package=Y`, and the
 * wizard (see BookingWizard's deep-link effect) pre-selects that package and
 * jumps straight to the qualifying questions. What you see on the page is
 * what loads in the booking flow.
 *
 * Visual treatment: thin 1px bordered grid, no card shadow or heavy radius —
 * the BuildCore-style density that replaced the old rounded/shadowed cards.
 */
export default function PackageGrid({ serviceKey, primaryColor, accentColor }: PackageGridProps) {
  const detail = getServiceDetail(serviceKey);
  if (!detail) return null;
  /*
    Parked services render no package grid at all.

    Every tile in it carries a "Book this" button, and the tiers are priced from
    a catalogue nobody can currently deliver against. ServiceWaitlist takes this
    slot on those pages instead. See the `active` flag in constants/services.ts.
  */
  if (!isActive(serviceKey)) return null;


  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>{detail.packageLabel}</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl mb-3 text-foreground">{detail.heading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{detail.blurb}</p>
        </div>

        <div className="grid gap-px" style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}>
          {detail.packages.map((pkg) => (
            <div key={pkg.id} className="bg-background p-6 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="sm:w-64 shrink-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-serif-display text-2xl text-foreground">{pkg.name}</h3>
                  {pkg.popular && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: withAlpha(accentColor, 0.125), color: accentColor }}
                    >
                      Most booked
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{pkg.tagline}</p>
                <p className="font-serif-display text-3xl mb-1" style={{ color: accentColor }}>
                  {pkg.custom || pkg.from === undefined
                    ? "Custom quote"
                    : `${formatDollars(pkg.from)}${pkg.unit === "month" ? "/mo" : pkg.unit === "visit" ? "/visit" : ""}`}
                </p>
                {pkg.duration && (
                  <p className="text-[11px] text-muted-foreground mb-4">Typically {pkg.duration} on site</p>
                )}
                <Link
                  to={bookPath(serviceKey, pkg.id)}
                  onMouseEnter={() => preloadRoute("/book")}
                  onFocus={() => preloadRoute("/book")}
                  className="inline-flex items-center gap-1.5 text-sm font-bold rounded-full px-5 py-2.5 transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: accentColor, color: primaryColor }}
                >
                  Book this <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="flex-1 grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <ul className="space-y-1.5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-foreground/85">
                      <Check size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {pkg.excludes && pkg.excludes.length > 0 && (
                  <ul className="space-y-1.5">
                    {pkg.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <X size={12} className="mt-0.5 shrink-0 opacity-50" />
                        <span>Not included: {item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
