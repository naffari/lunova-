import { Link } from "react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import Seo from "../components/common/Seo";
import PageHero from "../components/PageHero";
import ContactStrip from "../components/common/ContactStrip";
import ZipCheck from "../components/common/ZipCheck";
import { BRAND } from "../constants/brand";
import { SERVICE_CITIES, cityPath } from "../constants/cities";
import { SERVICE_AREA } from "../constants/contact";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "../utils/structuredData";
import { trustBadges } from "../constants/credentials";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

/**
 * The hub for /service-areas/*.
 *
 * It earns its place for two reasons beyond being useful to a visitor. It is
 * the crawl entry point that lets Google reach twelve city pages from one
 * internal link rather than from the sitemap alone, and it carries the full
 * LocalBusiness schema a second time. This is the URL most likely to be cited
 * when an answer engine is asked where Lunova works.
 */
export default function ServiceAreas() {
  const missouri = SERVICE_CITIES.filter((c) => c.state === "MO");
  const kansas = SERVICE_CITIES.filter((c) => c.state === "KS");

  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title="Service Areas | Kansas City Metro | Lunova Services"
        description="Lunova Services covers 12 cities across the Kansas City metro, including Overland Park, Olathe, Lee's Summit and Independence. Check your ZIP for coverage."
        jsonLd={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/service-areas" },
          ]),
        ]}
      />

      {/* Lead copy runs in the same order as the three panels in the photo
          below it: the house, the car, the bins. */}
      <PageHero
        eyebrow={
          <>
            <MapPin size={14} />
            <span>{SERVICE_AREA}</span>
          </>
        }
        title={
          <>
            We clean, we mow, we{" "}
            <span className="italic" style={{ color: ACCENT }}>haul it away.</span>
          </>
        }
        lead={`Cleaners inside, groundskeepers out front, and a truck for whatever has to go. ${SERVICE_CITIES.length} cities across the Kansas City metro, on both sides of the state line, at the same flat rates in every one of them.`}
        meta={[`${SERVICE_CITIES.length} cities covered`, trustBadges(1)[0], "Booked in 2 minutes"]}
      />

      <section className="py-12 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif-display text-2xl mb-2" style={{ color: PRIMARY }}>
            Check your ZIP first
          </h2>
          <p className="text-sm mb-6" style={{ color: BRAND.muted }}>
            Faster than scanning the list, and it covers the suburbs that aren't named below.
          </p>
          <ZipCheck variant="section" />
        </div>
      </section>

      <CityColumn heading="Missouri" cities={missouri} />
      <CityColumn heading="Kansas" cities={kansas} tinted />

      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
            Outside these twelve? Ask anyway. The list is where we run standing routes, not a
            boundary. Jobs a little beyond it are usually still workable, and we would rather tell
            you honestly on the phone than turn you away with a ZIP lookup.
          </p>
        </div>
      </section>

      <ContactStrip
        heading="Book anywhere in the metro"
        subtext="Same flat rates in every city we serve. Booking takes about two minutes."
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Get a quote"
        ctaTo="/book"
      />
    </div>
  );
}

interface CityColumnProps {
  heading: string;
  cities: typeof SERVICE_CITIES;
  tinted?: boolean;
}

function CityColumn({ heading, cities, tinted = false }: CityColumnProps) {
  return (
    <section
      className="py-14 px-4 sm:px-6"
      style={tinted ? { backgroundColor: BRAND.surface } : undefined}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif-display text-3xl sm:text-4xl mb-8" style={{ color: PRIMARY }}>
          {heading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              to={cityPath(city.slug)}
              className="group rounded-2xl p-6 border block transition-colors"
              style={{
                backgroundColor: tinted ? BRAND.bg : BRAND.surface,
                borderColor: BRAND.hairline,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-lg" style={{ color: PRIMARY }}>
                  {city.label}
                </h3>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 mt-1.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  style={{ color: PRIMARY }}
                />
              </div>
              <p className="text-xs mb-3" style={{ color: ACCENT }}>
                {city.county}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
                {city.neighborhoods.slice(0, 4).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
