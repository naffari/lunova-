import { Link } from "react-router";
import { ShieldCheck, MapPin, Clock, Sparkles } from "lucide-react";
import Seo from "../components/common/Seo";
import PageHero from "../components/PageHero";
import ContactStrip from "../components/common/ContactStrip";
import { BRAND } from "../constants/brand";
import { COMPANY_NAME, SERVICE_AREA } from "../constants/contact";
import { FOUNDED_YEAR } from "../constants/business";
import { GUARANTEE, PROOF_POINTS } from "../constants/proof";
import { SERVICES } from "../constants/services";
import { SERVICE_CITIES } from "../constants/cities";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "../utils/structuredData";
import { trustBadges } from "../constants/credentials";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

const DESCRIPTION =
  "Locally owned Kansas City house cleaning and mobile detailing. Not a franchise, not a lead broker. Two people, flat rates, nothing charged at booking.";

/**
 * The about page.
 *
 * Local ranking's third pillar is prominence, and prominence is mostly a trust
 * question. Google and the AI answer engines both want a named, checkable
 * entity behind a business rather than a phone number attached to a price list.
 * This page states what can be verified and nothing else.
 *
 * The rule from constants/proof.ts applies to every sentence here: if it cannot
 * be checked, it does not go on the page. An inflated claim that gets caught
 * costs more than the claim was ever worth.
 */
export default function About() {
  const verified = PROOF_POINTS.filter((p) => p.verified);

  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title={`About ${COMPANY_NAME} | Locally Owned in Kansas City`}
        description={DESCRIPTION}
        jsonLd={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      {/* Lead copy runs in the same order as the three panels in the photo
          below it: cleaning, lawn care, hauling. */}
      <PageHero
        eyebrow={
          <>
            <Sparkles size={14} />
            <span>About us</span>
          </>
        }
        title={
          <>
            Locally owned.{" "}
            <span className="italic" style={{ color: ACCENT }}>Not a franchise.</span>
          </>
        }
        lead={`Same crew inside the house, on the lawn, and loading the truck. ${COMPANY_NAME} covers the ${SERVICE_AREA} on both sides of the state line, and we do the work ourselves. No lead broker in the middle, no subcontractor you have never met turning up in an unmarked van.`}
        meta={[...trustBadges(2), GUARANTEE.short]}
        ctaLabel="Get a quote"
      />

      {/* Everything on this strip is checkable. */}
      <section className="py-12 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-3">
          <Fact icon={Clock} label="Trading since" value={String(FOUNDED_YEAR)} />
          <Fact icon={MapPin} label="Cities covered" value={`${SERVICE_CITIES.length} across the metro`} />
          <Fact icon={Sparkles} label="Services" value={`${SERVICES.length} lines, one crew`} />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <article>
            <h2 className="font-serif-display text-3xl mb-3" style={{ color: PRIMARY }}>
              One company, not a directory
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
              Most of what shows up when you search for a cleaner or a junk hauler in Kansas City is
              a lead broker: a website that sells your phone number to whoever is buying that day.
              You get three calls in ten minutes from companies you did not choose. Lunova is the
              company doing the work. The number on this site rings us, the crew that arrives is
              ours, and the person who quoted the job is the person accountable for it.
            </p>
          </article>

          <article>
            <h2 className="font-serif-display text-3xl mb-3" style={{ color: PRIMARY }}>
              Flat rates, published up front
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
              Every service page on this site lists a starting price and what it includes, and the
              booking wizard shows a running total before you commit. Some jobs cannot be priced
              without seeing them, like a full estate cleanout or a commercial site, and those say
              "custom quote" instead of quoting a number we would have to revise on the day. We would
              rather look more expensive up front than cheaper up front and wrong at the end.
            </p>
          </article>

          <article>
            <h2 className="font-serif-display text-3xl mb-3" style={{ color: PRIMARY }}>
              {GUARANTEE.name}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
              {GUARANTEE.terms}
            </p>
          </article>

          <article>
            <h2 className="font-serif-display text-3xl mb-3" style={{ color: PRIMARY }}>
              We don't post reviews we don't have
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
              Lunova is new. Rather than fill this site with invented testimonials, which is what
              most new service companies do and what customers have learned to discount, we carry
              the things that can be verified: insurance on request, background checks on every crew
              member, and a guarantee with a time limit on it. Real reviews will go up as they
              arrive, under the customer's own name, and not before.
            </p>
          </article>
        </div>
      </section>

      {/* Rendered from constants/proof.ts, with unverified claims filtered out. */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: BRAND.surface }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-8" style={{ color: PRIMARY }}>
            What you can check
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {verified.map((point) => (
              <div
                key={point.label}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: BRAND.bg, borderColor: BRAND.hairline }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} style={{ color: ACCENT }} />
                  <h3 className="font-semibold text-sm" style={{ color: PRIMARY }}>
                    {point.label}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm" style={{ color: BRAND.muted }}>
            Want the detail on a specific service or city?{" "}
            <Link to="/service-areas" className="underline font-medium" style={{ color: PRIMARY }}>
              Browse service areas
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="underline font-medium" style={{ color: PRIMARY }}>
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      <ContactStrip
        heading="Ready when you are"
        subtext="Flat-rate quote in about two minutes, or call and talk it through."
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Get a quote"
        ctaTo="/book"
      />
    </div>
  );
}

interface FactProps {
  icon: typeof Clock;
  label: string;
  value: string;
}

function Fact({ icon: Icon, label, value }: FactProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={15} style={{ color: ACCENT }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: BRAND.muted }}>
          {label}
        </span>
      </div>
      <p className="font-semibold text-lg" style={{ color: PRIMARY }}>
        {value}
      </p>
    </div>
  );
}
