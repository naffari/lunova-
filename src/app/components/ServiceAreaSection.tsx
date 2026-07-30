import { MapPin } from "lucide-react";
import { BRAND } from "../constants/brand";
import { SERVICE_AREA_CITIES } from "../constants/serviceArea";
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
          <p className="text-sm max-w-lg mx-auto" style={{ color: `${primaryColor}99` }}>
            Enter your ZIP and we'll tell you straight away. Residential and commercial, across the
            greater Kansas City metro.
          </p>
        </div>

        <ZipCheck variant="section" className="max-w-xl mx-auto mb-10" />

        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20` }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} style={{ color: accentColor }} />
            <span className="font-semibold text-sm" style={{ color: primaryColor }}>
              Cities We Serve
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SERVICE_AREA_CITIES.map((city) => (
              <div
                key={city.label}
                className="flex items-center gap-2 text-xs font-medium py-1.5"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                {city.label}
              </div>
            ))}
          </div>

          <p className="text-xs mt-6 pt-4" style={{ color: `${primaryColor}70`, borderTop: `1px solid ${primaryColor}20` }}>
            Surrounding suburbs are usually covered too even when they're not listed — the ZIP check
            above is the fastest way to know.
          </p>
        </div>
      </div>
    </section>
  );
}
