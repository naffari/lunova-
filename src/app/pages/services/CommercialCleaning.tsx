import { CheckCircle } from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import PackageGrid from "../../components/PackageGrid";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";

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
  "Scheduled nightly janitorial for offices, medical facilities, retail stores, and restaurants across Kansas City. Fully insured, contract-ready crews dedicated to your standards.";

const COMMERCIAL_CLEANING_FAQS = [
  { q: "Do you offer after-hours cleaning?", a: "Yes — we specialize in after-hours and overnight cleaning so your business is ready to open each morning." },
  { q: "Can you handle large commercial spaces?", a: "Absolutely. We serve offices, retail stores, medical facilities, and industrial spaces." },
  { q: "Do you provide cleaning contracts?", a: "Yes. We offer weekly, bi-weekly, and monthly contracts with discounted rates for long-term commitments." },
  { q: "Are your cleaners insured?", a: "Yes. Lunova Services is fully licensed and insured. We carry liability coverage for all commercial jobs." },
];

export default function CommercialCleaning() {
  return (
    <div data-theme="commercial-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Commercial Cleaning Services | Lunova Services"
        description={COMMERCIAL_CLEANING_DESCRIPTION}
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
        ctaTo="/book?service=commercial"
        trustItems={["Fully Insured", "After-Hours Service", "Satisfaction Guarantee"]}
        heroImage="commercial-cleaning-hero"
        heroImageAlt="Commercial janitorial team cleaning an office space in Kansas City"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Nightly Janitorial", "Office Cleaning", "Medical Facility", "Restaurant Cleaning", "HIPAA-Aware Protocols", "After-Hours Service", "Dedicated Crew", "Satisfaction Guarantee",
            "Nightly Janitorial", "Office Cleaning", "Medical Facility", "Restaurant Cleaning", "HIPAA-Aware Protocols", "After-Hours Service", "Dedicated Crew", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.ink }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="commercial" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Four Steps from Contract to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={GROUND}
        accentColor={ACCENT}
      />

      {/* PRICING */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Pricing</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: BRAND.ink }}>
            Transparent contracts.<br />
            <span className="italic" style={{ color: PRIMARY }}>No lock-in required.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {[
            {
              name: "Small Office",
              price: "~$250",
              sub: "per month",
              highlight: false,
              features: ["Up to 2,500 sqft", "Nightly 5 days/week", "Trash & restroom service", "Surface sanitization", "Break room cleaning"],
            },
            {
              name: "Mid-Size Business",
              price: "~$650",
              sub: "per month",
              highlight: true,
              features: ["2,500–10,000 sqft", "Nightly service included", "Dedicated team lead", "Monthly quality audit", "Priority scheduling"],
            },
            {
              name: "Enterprise / Custom",
              price: "Quote",
              sub: "based on scope",
              highlight: false,
              features: ["10,000+ sqft", "Medical, retail & restaurant", "Multi-location support", "Custom checklist", "Flexible contract terms"],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-8 flex flex-col gap-5"
              style={{
                backgroundColor: plan.highlight ? PRIMARY : '#ffffff',
                color: plan.highlight ? 'white' : BRAND.ink,
                border: plan.highlight ? 'none' : `2px solid ${PRIMARY}20`,
                boxShadow: plan.highlight ? `0 20px 60px ${PRIMARY}40` : '0 2px 12px rgba(0,0,0,0.05)',
                transform: plan.highlight ? 'scale(1.04)' : 'none',
              }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity: 0.6 }}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-display text-5xl">{plan.price}</span>
                  <span className="text-sm" style={{ opacity: 0.6 }}>{plan.sub}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={15} style={{ color: plan.highlight ? ACCENT : PRIMARY, flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/book?service=commercial"
                className="text-center font-bold py-3 rounded-full text-sm block"
                style={{
                  backgroundColor: plan.highlight ? ACCENT : PRIMARY,
                  color: plan.highlight ? BRAND.ink : 'white',
                }}
              >
                Request a Quote →
              </Link>
            </div>
          ))}
        </div>
      </section>

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
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Spotless Workplace?"
        subtext="Get a custom contract quote for your facility. After-hours crews, dedicated team leads, and no long-term lock-in required."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Request a Quote"
        ctaTo="/book?service=commercial"
      />

    </div>
  );
}
