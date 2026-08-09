import { Link } from "react-router";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import Seo from "../components/common/Seo";
import PageHero from "../components/PageHero";
import ContactStrip from "../components/common/ContactStrip";
import ZipCheck from "../components/common/ZipCheck";
import { EmailLink, PhoneLink } from "../components/common/ContactLinks";
import { BRAND } from "../constants/brand";
import { COMPANY_NAME, PHONE_DISPLAY, SERVICE_AREA } from "../constants/contact";
import { GOOGLE_BUSINESS, HOURS_DISPLAY } from "../constants/business";
import { SERVICE_CITIES, cityPath } from "../constants/cities";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "../utils/structuredData";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

/**
 * The contact page, and for local SEO purposes the NAP page.
 *
 * Name, phone and service area appear here in plain text in the same form they
 * appear on the Google Business Profile and in every directory listing. That
 * consistency is what the page is for. NAP conflicts across listings are the
 * most common reason a local business fails to consolidate into a single entity
 * in Google's index, and this is the page a crawler checks those listings
 * against.
 *
 * Hours come from constants/business.ts, which also feeds
 * `openingHoursSpecification` in the schema, so the page and the markup cannot
 * disagree. Both still have to match the Business Profile by hand. Update all
 * three together or none of them.
 *
 * No street address, here or in the schema. Lunova is a service-area business
 * and inventing one to fill the field would be a fabricated fact Google checks.
 */
export default function Contact() {
  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title={`Contact ${COMPANY_NAME} | Kansas City Metro | ${PHONE_DISPLAY}`}
        description={`Call ${COMPANY_NAME} on ${PHONE_DISPLAY} or book online. Serving the ${SERVICE_AREA} Monday to Saturday. Flat-rate quotes, insured crews.`}
        jsonLd={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      {/* Lead copy runs in the same order as the three panels in the photo
          below it: cleaning, lawn care, hauling. */}
      <PageHero
        eyebrow={
          <>
            <Phone size={14} />
            <span>Contact</span>
          </>
        }
        title={
          <>
            Talk to a{" "}
            <span className="italic" style={{ color: ACCENT }}>real person.</span>
          </>
        }
        lead={`Booking a clean, a mow, or a truck for the basement? The number below rings ${COMPANY_NAME} directly. Not a call centre, not a lead broker. If we are on a job we call back the same day.`}
        meta={["Mon to Sat", "Same-day callback", "Free quotes"]}
        ctaLabel="Book online instead"
      />

      {/* Plain text, exactly as it appears on the Business Profile. */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-4xl mx-auto grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-serif-display text-2xl mb-5" style={{ color: PRIMARY }}>
              Reach us
            </h2>
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                  Business name
                </dt>
                <dd className="text-base font-semibold" style={{ color: PRIMARY }}>{COMPANY_NAME}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                  Phone
                </dt>
                <dd>
                  <PhoneLink
                    source="contact_page"
                    className="inline-flex items-center gap-2 text-base font-semibold hover:underline"
                    style={{ color: PRIMARY }}
                    iconStyle={{ color: ACCENT }}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                  Email
                </dt>
                <dd>
                  <EmailLink
                    className="inline-flex items-center gap-2 text-base font-semibold hover:underline break-all"
                    style={{ color: PRIMARY }}
                    iconStyle={{ color: ACCENT }}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                  Service area
                </dt>
                <dd className="text-base" style={{ color: PRIMARY }}>
                  {SERVICE_AREA}, {SERVICE_CITIES.length} cities on both sides of the state line.{" "}
                  <Link to="/service-areas" className="underline font-medium">See the list</Link>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl mb-5" style={{ color: PRIMARY }}>
              Hours
            </h2>
            <dl className="space-y-3 mb-8">
              {HOURS_DISPLAY.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 pb-3"
                  style={{ borderBottom: `1px solid ${BRAND.hairline}` }}
                >
                  <dt className="text-sm font-medium flex items-center gap-2" style={{ color: PRIMARY }}>
                    <Clock size={14} style={{ color: ACCENT }} />
                    {row.label}
                  </dt>
                  <dd className="text-sm" style={{ color: BRAND.muted }}>{row.value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={GOOGLE_BUSINESS.PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-full border-2"
              style={{ borderColor: BRAND.hairlineStrong, color: PRIMARY }}
            >
              <Star size={15} style={{ color: ACCENT }} />
              Find us on Google
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif-display text-3xl mb-2" style={{ color: PRIMARY }}>
            Do we reach you?
          </h2>
          <p className="text-sm mb-6" style={{ color: BRAND.muted }}>
            Check your ZIP before you call and we can skip straight to scheduling.
          </p>
          <ZipCheck variant="section" />
        </div>
      </section>

      {/* The contact page is a common crawl entry point, so it links onward to
          every city page rather than dead-ending. */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: PRIMARY }}>
            Local pages
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {SERVICE_CITIES.map((city) => (
              <Link
                key={city.slug}
                to={cityPath(city.slug)}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border"
                style={{ borderColor: BRAND.hairlineStrong, color: PRIMARY }}
              >
                <MapPin size={13} style={{ color: ACCENT }} />
                {city.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip
        heading="Or just book it"
        subtext="The wizard gives you a flat-rate quote without anyone calling you first."
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Get a quote"
        ctaTo="/book"
      />
    </div>
  );
}
