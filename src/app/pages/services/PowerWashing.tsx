import {
  Star,
  ShieldCheck,
  Droplets,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import WorkGallery from "../../components/WorkGallery";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";

const { primary: PRIMARY, accent: ACCENT, bg: BG } = SERVICE_THEMES["power-washing"];

const PACKAGES = [
  {
    title: "Driveway & Sidewalk",
    price: "From $100",
    features: ["Concrete & asphalt", "Oil & rust removal", "Tire mark removal", "Rinse & inspection"],
    highlight: false,
  },
  {
    title: "House Soft Wash",
    price: "From $180",
    features: ["Vinyl, stucco & brick", "Mold & algae removal", "Gutter brightening", "Rinse & spot-check"],
    highlight: true,
  },
  {
    title: "Deck & Patio",
    price: "From $120",
    features: ["Wood & composite", "Mildew treatment", "Paver restoration", "Season prep clean"],
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: Droplets,
    title: "Licensed & Insured",
    desc: "Full commercial liability coverage on every job. Your property is protected, no exceptions.",
  },
  {
    icon: ShieldCheck,
    title: "Soft Wash Technology",
    desc: "We match pressure and cleaning agents to your surface — no risk of etching or damage.",
  },
  {
    icon: Star,
    title: "Licensed & Insured Crew",
    desc: "Licensed, insured, and ready to earn your trust on every job.",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guaranteed",
    desc: "If you're not happy with the results, we come back and re-clean at no additional charge.",
  },
];

const STATS = [
  { val: "From $175", label: "Starting Price" },
  { val: "Same-Day", label: "Service" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Free On-Site Estimate",
    desc: "We assess your surfaces, note staining levels, and give you an upfront flat-rate price.",
  },
  {
    step: "2",
    title: "Schedule Your Service",
    desc: "Pick a time that works for you — same-week slots available. We confirm via text.",
  },
  {
    step: "3",
    title: "Expert Pressure Wash",
    desc: "Our crew arrives fully equipped and works systematically across all surfaces.",
  },
  {
    step: "4",
    title: "Final Rinse & Inspection",
    desc: "We rinse down, inspect every area, and confirm you're satisfied before packing up.",
  },
];

const POWER_WASHING_DESCRIPTION =
  "Professional pressure washing, soft washing, gutter cleaning, and surface restoration for homes and businesses across Kansas City. Licensed, insured, and results-guaranteed.";

const POWER_WASHING_FAQS = [
  { q: "What surfaces can you power wash?", a: "Driveways, sidewalks, decks, patios, siding, fences, and commercial parking lots." },
  { q: "Is power washing safe for all surfaces?", a: "We adjust pressure for each surface. Soft washing is used for siding, roofs, and painted surfaces to prevent damage." },
  { q: "How long before I can use the surface?", a: "Most surfaces are ready within a few hours. We'll let you know based on the specific job." },
  { q: "Do I need to be home?", a: "Not necessarily — as long as we have access to the area and a water connection, we can complete the job." },
];

export default function PowerWashing() {
  return (
    <div data-theme="power-washing" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <Seo
        title="Power Washing Services | Lunova Services"
        description={POWER_WASHING_DESCRIPTION}
        jsonLd={[
          buildServiceSchema({ name: "Power Washing", description: POWER_WASHING_DESCRIPTION, path: "/services/power-washing" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Power Washing", path: "/services/power-washing" },
          ]),
          buildFaqSchema(POWER_WASHING_FAQS),
        ]}
      />
      <ServiceHero
        badge="Power Washing by Lunova"
        titleContent={<>Exterior Cleaning<br />for Homes &amp; <span className="italic" style={{ color: ACCENT }}>Businesses.</span></>}
        description="Professional pressure washing, soft washing, gutter cleaning, and surface restoration across Kansas City. Licensed, insured, and results-guaranteed."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=power-washing"
        trustItems={["Licensed & Insured", "Soft Wash Available", "Free Estimates"]}
        heroImage="power-washing-hero"
        heroImageAlt="Power washing a driveway"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Driveway Cleaning", "House Soft Wash", "Deck Restoration", "Oil & Rust Removal", "Licensed & Insured", "Soft Wash Available", "Free Estimates", "Satisfaction Guarantee",
            "Driveway Cleaning", "House Soft Wash", "Deck Restoration", "Oil & Rust Removal", "Licensed & Insured", "Soft Wash Available", "Free Estimates", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICE PACKAGES */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}07`, borderTop: `1px solid ${PRIMARY}15`, borderBottom: `1px solid ${PRIMARY}15` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Service Rates</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Transparent Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((plan, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-7 flex flex-col gap-5"
                style={{
                  backgroundColor: plan.highlight ? PRIMARY : '#ffffff',
                  color: plan.highlight ? '#ffffff' : PRIMARY,
                  border: plan.highlight ? 'none' : `2px solid ${PRIMARY}18`,
                  boxShadow: plan.highlight ? `0 20px 60px ${PRIMARY}40` : '0 2px 12px rgba(0,0,0,0.05)',
                  transform: plan.highlight ? 'scale(1.04)' : 'none',
                }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity: 0.55 }}>{plan.title}</p>
                  <p className="font-serif-display text-4xl">{plan.price}</p>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book?service=power-washing"
                  className="text-center font-bold py-3 rounded-full text-sm block text-white"
                  style={{ backgroundColor: plan.highlight ? ACCENT : PRIMARY }}
                >
                  Book This Service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Why Choose Lunova
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: PRIMARY }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>{f.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: `${PRIMARY}bb` }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="power-washing"
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo="/book?service=power"
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Power Washing Process"
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={PRIMARY}
        accentColor={ACCENT}
      />

      {/* STATS BAND — shared component; this markup was duplicated on all 9 pages. */}
      <StatBand stats={STATS} primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* Wave transition */}
      <div style={{ backgroundColor: PRIMARY, lineHeight: 0, marginTop: '-1px' }}>
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
            items={POWER_WASHING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Restore Your Curb Appeal?"
        subtext="Book a free on-site estimate and get your driveway, siding, or deck looking brand new — same-week slots available across Kansas City."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=power-washing"
      />

    </div>
  );
}
