import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import ServiceEstimator from "../../components/ServiceEstimator";
import PackageGrid from "../../components/PackageGrid";
import CrossSellRow from "../../components/CrossSellRow";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { bookPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["commercial-cleaning"];


const STATS = [
  { val: "Custom", label: "Pricing" },
  { val: "After-Hours", label: "Available" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Facility Walk-Through",
    desc: "We tour your space, assess sq footage, and note special requirements.",
  },
  {
    step: "02",
    title: "Custom Contract Quote",
    desc: "Flat-rate nightly or weekly pricing. No surprise invoices.",
  },
  {
    step: "03",
    title: "Nightly Service Begins",
    desc: "Dedicated crew arrives after-hours and works your facility checklist.",
  },
  {
    step: "04",
    title: "Monthly Quality Audit",
    desc: "Account manager reviews service and adjusts based on your feedback.",
  },
];

const COMMERCIAL_CLEANING_DESCRIPTION =
  "Scheduled nightly janitorial for offices, medical facilities, retail stores, and restaurants across Kansas City. Fully insured, contract-ready crews.";

const COMMERCIAL_CLEANING_FAQS = [
  { q: "Do you offer after-hours cleaning?", a: "Yes. We specialize in after-hours and overnight cleaning so your business is ready to open each morning." },
  { q: "Can you handle large commercial spaces?", a: "Absolutely. We serve offices, retail stores, medical facilities, and industrial spaces." },
  { q: "Do you provide cleaning contracts?", a: "Yes. We offer weekly, bi-weekly, and monthly contracts with discounted rates for long-term commitments." },
  { q: "Are your cleaners insured?", a: "Yes. Lunova Services is fully licensed and insured. We carry liability coverage for all commercial jobs." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Nightly Janitorial", "Office Cleaning", "Medical Facility", "Restaurant Cleaning", "HIPAA-Aware Protocols", "After-Hours Service", "Dedicated Crew", "Satisfaction Guarantee",
];

export default function CommercialCleaning() {
  return (
    <div data-theme="commercial-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Commercial Cleaning Services | Lunova Services"
        description={COMMERCIAL_CLEANING_DESCRIPTION}
        image={heroOgImage("commercial-cleaning-hero")}
        imageAlt="A cleaner in protective coveralls sweeping up paint and plaster debris during a post-renovation clean"
        jsonLd={[
          buildServiceSchema({ name: "Commercial Cleaning", description: COMMERCIAL_CLEANING_DESCRIPTION, path: "/services/commercial-cleaning" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Commercial Cleaning", path: "/services/commercial-cleaning" },
          ]),
          buildFaqSchema(COMMERCIAL_CLEANING_FAQS),
        ]}
      />
      <ServiceHero
        badge="Now Accepting Commercial Contracts in KC"
        titleContent={<>Professional Janitorial.<br /><span style={{ color: ACCENT }} className="italic">Every Night. On Time.</span></>}
        description="Scheduled nightly janitorial for offices, medical facilities, retail stores, and restaurants. Fully insured, contract-ready, and dedicated to your standards."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("commercial")}
        trustItems={["Fully Insured", "After-Hours Service", "Satisfaction Guarantee"]}
        heroImage="commercial-cleaning-hero"
        heroImageAlt="A cleaner in protective coveralls sweeping up paint and plaster debris during a post-renovation clean"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* INSTANT ESTIMATE — the packages, questions and add-on prices from
          constants/serviceDetails.ts, priced live and handed to the wizard
          through the URL so step 2 opens already answered. Sits above the
          package grid: price first, then the detail behind the price. */}
      <ServiceEstimator serviceKey="commercial" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="commercial" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* The two services this one is usually booked with, from `upsells`. */}
      <CrossSellRow serviceKey="commercial" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Four Steps from Contract to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={GROUND}
        accentColor={ACCENT}
      />

      {/* No pricing table here on purpose. Every commercial package is `custom: true`
          in constants/serviceDetails.ts because these jobs genuinely cannot be priced
          without a walk-through. The table that used to sit here invented "~$250" and
          "~$650" per month and directly contradicted the "Custom quote" PackageGrid
          renders above it. Quoting a number we won't stand behind costs more than
          saying we need to see the facility. */}

      {/* STATS BAND — shared component; this markup was duplicated on all 9 pages. */}
      <StatBand stats={STATS} primaryColor={GROUND} accentColor={ACCENT} />

      {/* Wave transition */}
      <div style={{ backgroundColor: GROUND, lineHeight: 0, marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: '50px' }}>
          <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={BG} />
        </svg>
      </div>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FaqSection
            items={COMMERCIAL_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before you sign a contract"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Spotless Workplace?"
        subtext="Get a custom contract quote for your facility. After-hours crews, dedicated team leads, and no long-term lock-in required."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Request a Quote"
        ctaTo={bookPath("commercial")}
      />

    </div>
  );
}
