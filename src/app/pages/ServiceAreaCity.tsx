import { Link, useParams } from "react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import Seo from "../components/common/Seo";
import PageHero from "../components/PageHero";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import ZipCheck from "../components/common/ZipCheck";
import NotFound from "./NotFound";
import { BRAND } from "../constants/brand";
import { CITY_BY_SLUG, cityPath } from "../constants/cities";
import type { ServiceCity } from "../constants/cities";
import { SERVICE_BY_ID, startingAtLabel } from "../constants/services";
import { withAlpha } from "../utils/color";
import {
  buildBreadcrumbSchema,
  buildCityServiceSchemas,
  buildFaqSchema,
} from "../utils/structuredData";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

/**
 * A city landing page.
 *
 * This is the on-page half of local SEO for a service-area business. Lunova has
 * no storefront, so Google cannot rank it on proximity and falls back on
 * relevance and prominence. A real page per city supplies the relevance for
 * "<service> in <city>" queries.
 *
 * The thing this page is built to avoid is the doorway page: one template with
 * the city name swapped in, which Google has demoted since 2015 and which would
 * take the whole /service-areas section down with it. Every paragraph of
 * substance comes from that city's record in constants/cities.ts, including its
 * neighborhoods, its housing stock, its service mix and its FAQs. The component
 * is shared. The content is not.
 */
export default function ServiceAreaCity() {
  const { city: slug } = useParams();
  const city = slug ? CITY_BY_SLUG[slug] : undefined;

  // An unrecognised slug renders the real 404 rather than an empty city shell.
  // Only reachable by hand-typed URL, since every route we emit comes from
  // CITY_SLUGS.
  if (!city) return <NotFound />;

  return <CityPage city={city} />;
}

function CityPage({ city }: { city: ServiceCity }) {
  const path = cityPath(city.slug);
  // Kept under 60 characters with the longest label ("Prairie Village",
  // "Kansas City, MO") substituted in — past that Google truncates and the
  // brand, which is the part doing the trust work, is what gets cut.
  const title = `${city.label} Cleaning & Junk Removal | Lunova Services`;

  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title={title}
        description={city.metaDescription}
        jsonLd={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/service-areas" },
            { name: city.label, path },
          ]),
          ...buildCityServiceSchemas(city),
          buildFaqSchema(city.faqs),
        ]}
      />

      {/* The intro doubles as the page's lead paragraph and as the block an AI
          answer engine lifts when summarising us for a "<service> in <city>"
          question, so it has to read well on its own. */}
      <PageHero
        above={
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/service-areas" className="hover:underline">Service Areas</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" style={{ color: "#ffffff" }}>{city.label}</li>
            </ol>
          </nav>
        }
        eyebrow={
          <>
            <MapPin size={14} />
            <span>{city.county}</span>
          </>
        }
        title={
          <>
            Cleaning, lawn care and hauling in{" "}
            <span className="italic" style={{ color: ACCENT }}>{city.label}</span>
          </>
        }
        lead={city.intro}
        meta={["Licensed & insured", "Flat-rate quotes", "Same-week slots"]}
      />

      {/* Named neighborhoods and a full ZIP list. The concrete, checkable
          details that prove this page is about this city. */}
      <section className="py-12 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              Neighborhoods we work in
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
              {city.neighborhoods.join(" · ")}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              ZIP codes served
            </h2>
            <p className="text-sm leading-relaxed font-mono" style={{ color: BRAND.muted }}>
              {city.zips.join(", ")}
            </p>
          </div>
        </div>
      </section>

      {/* The services this city's housing generates, and why. Each card links to
          the service page, which is where pricing and packages live. One price,
          one source. */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-3" style={{ color: PRIMARY }}>
            What we do most in {city.name}
          </h2>
          <p className="text-sm mb-10 max-w-2xl" style={{ color: BRAND.muted }}>
            Every service we offer is available across the metro. These are the ones {city.label}{" "}
            books most, and the reason why.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {city.serviceFocus.map((focus) => {
              const service = SERVICE_BY_ID[focus.serviceId];
              return (
                <Link
                  key={focus.serviceId}
                  to={service?.to ?? "/book"}
                  className="group rounded-2xl p-6 border transition-colors block"
                  style={{ backgroundColor: BRAND.surface, borderColor: BRAND.hairline }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-base" style={{ color: PRIMARY }}>
                      {focus.heading}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 mt-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      style={{ color: PRIMARY }}
                    />
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: BRAND.muted }}>
                    {focus.body}
                  </p>
                  {service && (
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>
                      {service.name} · {startingAtLabel(service)}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The content that keeps this out of doorway-page territory. If any of
          these paragraphs could be pasted into another city's page unchanged, it
          is wrong and belongs in a shared component instead. */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-10" style={{ color: PRIMARY }}>
            What's different about working in {city.name}
          </h2>
          <div className="space-y-10">
            {city.localNotes.map((note) => (
              <article key={note.heading}>
                <h3 className="font-semibold text-lg mb-2" style={{ color: PRIMARY }}>
                  {note.heading}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
                  {note.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The ZIP list above answers the coverage question for people who find
          their ZIP on it. This answers it for everyone else. */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif-display text-3xl mb-2" style={{ color: PRIMARY }}>
            Not sure if we reach your street?
          </h2>
          <p className="text-sm mb-6" style={{ color: BRAND.muted }}>
            Surrounding suburbs are usually covered even when they aren't listed above.
          </p>
          <ZipCheck variant="section" />
        </div>
      </section>

      {/* Feeds FAQPage schema. Questions are city-specific, because the same FAQ
          block on twelve pages is duplicate content nothing would cite. */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-3xl mx-auto">
          <FaqSection items={city.faqs} title={`${city.label} questions`} subtitle="Before you book" />
        </div>
      </section>

      {/* Internal linking. Keeps crawl equity inside /service-areas and gives a
          visitor in the next town over somewhere to land. */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: PRIMARY }}>
            We also serve
          </h2>
          <div className="flex flex-wrap gap-3">
            {city.nearby.map((slug) => {
              const neighbor = CITY_BY_SLUG[slug];
              if (!neighbor) return null;
              return (
                <Link
                  key={slug}
                  to={cityPath(slug)}
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-colors"
                  style={{
                    borderColor: BRAND.hairlineStrong,
                    color: PRIMARY,
                    backgroundColor: withAlpha(PRIMARY, 0.04),
                  }}
                >
                  <MapPin size={13} />
                  {neighbor.label}
                </Link>
              );
            })}
            <Link
              to="/service-areas"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-colors"
              style={{ borderColor: BRAND.hairlineStrong, color: PRIMARY }}
            >
              All service areas
            </Link>
          </div>
        </div>
      </section>

      <ContactStrip
        heading={`Book a service in ${city.label}`}
        subtext={`Flat-rate quotes, insured crews and same-week slots across ${city.label}. Booking takes about two minutes.`}
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Get a quote"
        ctaTo="/book"
      />
    </div>
  );
}
