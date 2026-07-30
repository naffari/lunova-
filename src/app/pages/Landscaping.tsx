import { Check, ShieldCheck, Leaf, Calendar } from "lucide-react";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import Seo from "../components/common/Seo";
import StatBand from "../components/StatBand";
import PackageGrid from "../components/PackageGrid";
import WorkGallery from "../components/WorkGallery";
import { SERVICE_THEMES } from "../constants/theme";
import { BRAND } from "../constants/brand";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../utils/structuredData";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES.landscaping;


const FEATURES = [
  {
    icon: Leaf,
    title: "Handpicked Healthy Plants & Mulch",
    desc: "We source top-grade organic mulch, hearty turf seeds, and healthy plants tailored for Missouri climate.",
  },
  {
    icon: ShieldCheck,
    title: "Hassle-Free Delivery & Complete Cleanup",
    desc: "Our crew arrives equipped, operates safely, and hauls away all grass clippings and tree debris before leaving.",
  },
  {
    icon: Check,
    title: "Licensed & Fully Insured",
    desc: "Every job is backed by full liability insurance — your property is protected from start to finish.",
  },
  {
    icon: Calendar,
    title: "Same-Week Scheduling",
    desc: "We keep our schedule tight so you can usually get same-week or next-day service.",
  },
];

const STATS = [
  { val: "From $45", label: "Starting Price" },
  { val: "Same-Week", label: "Availability" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Free Consultation",
    desc: "We start with a quick site assessment or photo evaluation to understand your vision.",
  },
  {
    step: "2",
    title: "Transparent Quote",
    desc: "We provide an upfront, flat-rate estimate with zero hidden fees.",
  },
  {
    step: "3",
    title: "Professional Service",
    desc: "Our certified crew arrives on time with commercial mowers and safety gear.",
  },
  {
    step: "4",
    title: "Complete Cleanup",
    desc: "We blow off driveways and haul away all debris so your property looks immaculate.",
  },
];

const LANDSCAPING_DESCRIPTION =
  "Professional lawn mowing, hedge trimming, mulch, seasonal cleanup, and landscape design across the Kansas City metro — flat-rate pricing and same-week appointments.";

const LANDSCAPING_FAQS = [
  { q: "Do I need to be home for lawn service?", a: "No — our crews work independently. We'll notify you when we arrive and when the job is complete." },
  { q: "How often should I schedule lawn care?", a: "We recommend weekly or bi-weekly service during growing season (April–October) and monthly in the off-season." },
  { q: "Do you bring your own equipment?", a: "Yes. Our teams arrive fully equipped. You don't need to provide anything." },
  { q: "What areas do you serve?", a: "We serve the full Kansas City metro area including Overland Park, Olathe, Shawnee, Lee's Summit, and more." },
];

export default function Landscaping() {
  return (
    <div data-theme="landscaping" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Landscaping & Lawn Care Services | Lunova Services"
        description={LANDSCAPING_DESCRIPTION}
        jsonLd={[
          buildServiceSchema({ name: "Landscaping", description: LANDSCAPING_DESCRIPTION, path: "/landscaping" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Landscaping", path: "/landscaping" },
          ]),
          buildFaqSchema(LANDSCAPING_FAQS),
        ]}
      />
      <ServiceHero
        badge="Now Booking in Kansas City"
        titleContent={<>We're Growing Better <br /><span className="italic" style={{ color: ACCENT }}>Neighborhoods</span> One <br />Yard At A Time</>}
        description="Whether you need routine lawn maintenance, bush trimming, mulch application, or urgent yard cleanup, our team delivers fast, affordable, and professional outdoor care."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book Landscaping"
        ctaTo="/book?service=landscaping"
        trustItems={["Licensed & Insured", "Same-Week Appointments", "100% Satisfaction"]}
        heroImage="landscaping-hero"
        heroImageAlt="Landscaping Professional at Work"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Lawn Mowing", "Hedge Trimming", "Mulch & Edging", "Seasonal Cleanup", "Aeration & Seeding", "Licensed & Insured", "Same-Week Slots", "Satisfaction Guarantee",
            "Lawn Mowing", "Hedge Trimming", "Mulch & Edging", "Seasonal Cleanup", "Aeration & Seeding", "Licensed & Insured", "Same-Week Slots", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.bg }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="landscaping" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              A Reputation Built on Safety, Quality, and Integrity.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-card p-6 rounded-2xl flex flex-col gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GROUND, color: ACCENT }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>{f.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: `${BRAND.ink}bb` }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="landscaping"
        primaryColor={GROUND}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo="/book?service=landscaping"
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Landscape & Yard Process"
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={GROUND}
        accentColor={ACCENT}
      />

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
            items={LANDSCAPING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Yard You'll Love?"
        subtext="Book mowing, cleanup, or a full landscape refresh today — flat-rate pricing and same-week appointments across the KC metro."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book Landscaping"
        ctaTo="/book?service=landscaping"
      />

    </div>
  );
}
