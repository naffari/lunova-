import { withAlpha } from "../utils/color";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { BRAND } from "../constants/brand";
import { SERVICE_AREA_CITIES } from "../constants/serviceArea";
import { cityPath } from "../constants/cities";
import ZipCheck from "./common/ZipCheck";

interface ServiceAreaSectionProps {
  primaryColor: string;
  accentColor: string;
  bgColor?: string;
}

/**
 * Service area block. Now leads with the coverage checker rather than a static
 * list of city names.
 *
 * The list alone answered "do you serve me?" only if the visitor's town
 * happened to be one of twelve labels — anyone in a suburb we cover but don't
 * name read it as a no. The checker resolves by ZIP and captures an email when
 * the answer is genuinely no. Cities come from the same module the booking
 * wizard's address dropdown uses.
 */
export default function ServiceAreaSection({
  primaryColor,
  accentColor,
  bgColor = BRAND.bg,
}: ServiceAreaSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>Service Area</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl mb-3" style={{ color: primaryColor }}>
            Are we on your street?
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: withAlpha(primaryColor, 0.6) }}>
            Enter your ZIP and we'll tell you straight away. Residential and commercial, across the
            greater Kansas City metro.
          </p>
        </div>

        <ZipCheck variant="section" className="max-w-xl mx-auto mb-10" />

        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: withAlpha(primaryColor, 0.03), borderColor: withAlpha(primaryColor, 0.125) }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} style={{ color: accentColor }} />
            <span className="font-semibold text-sm" style={{ color: primaryColor }}>
              Cities We Serve
            </span>
          </div>

          {/* Each city links to its own page rather than sitting as dead text.
              This block renders on every service page, so it is the single
              biggest source of internal links into /service-areas/*, which is
              what gets those pages crawled and ranked rather than merely
              existing. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SERVICE_AREA_CITIES.map((city) => (
              <Link
                key={city.label}
                to={cityPath(city.slug)}
                className="group flex items-center gap-2 text-xs font-medium py-1.5 hover:underline"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                {city.label}
                <ArrowUpRight
                  size={11}
                  className="opacity-0 group-hover:opacity-70 transition-opacity shrink-0"
                />
              </Link>
            ))}
          </div>

          <p className="text-xs mt-6 pt-4" style={{ color: withAlpha(primaryColor, 0.44), borderTop: `1px solid ${withAlpha(primaryColor, 0.125)}` }}>
            Surrounding suburbs are usually covered too even when they're not listed. The ZIP check
            above is the fastest way to know, or{" "}
            <Link to="/service-areas" className="underline font-medium">
              browse every area we serve
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
