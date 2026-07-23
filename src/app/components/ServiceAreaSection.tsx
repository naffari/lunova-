import { MapPin } from "lucide-react";

interface ServiceAreaSectionProps {
  primaryColor: string;
  accentColor: string;
  bgColor?: string;
}

const CITIES = [
  "Kansas City, MO",
  "Kansas City, KS",
  "Overland Park",
  "Olathe",
  "Shawnee",
  "Lenexa",
  "Leawood",
  "Prairie Village",
  "Lee's Summit",
  "Independence",
  "Blue Springs",
  "Raytown",
];

export default function ServiceAreaSection({
  primaryColor,
  accentColor,
  bgColor = '#F1EBD9',
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
          <h2
            className="font-serif-display text-4xl sm:text-5xl mb-3"
            style={{ color: primaryColor }}
          >
            Proudly Serving the KC Metro
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: `${primaryColor}99` }}>
            We serve residential and commercial clients throughout the greater Kansas City metropolitan area.
          </p>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{
            backgroundColor: `${primaryColor}08`,
            borderColor: `${primaryColor}20`,
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} style={{ color: accentColor }} />
            <span className="font-semibold text-sm" style={{ color: primaryColor }}>
              Cities We Serve
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CITIES.map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 text-xs font-medium py-1.5"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                {city}
              </div>
            ))}
          </div>

          <p className="text-xs mt-6 pt-4" style={{ color: `${primaryColor}70`, borderTop: `1px solid ${primaryColor}20` }}>
            Don't see your city? Call us — we may still be able to serve you!
          </p>
        </div>
      </div>
    </section>
  );
}
