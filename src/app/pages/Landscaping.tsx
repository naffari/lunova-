import {
  Check,
  ShieldCheck,
  Leaf,
  Calendar,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import Seo from "../components/common/Seo";
import { SERVICE_THEMES } from "../constants/theme";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../utils/structuredData";

const { primary: PRIMARY, accent: ACCENT, bg: BG } = SERVICE_THEMES.landscaping;

const PACKAGES = [
  {
    title: "Lawn Mowing & Edging",
    price: "$45 – $65",
    desc: "Weekly or bi-weekly mowing, string trimming around obstacles, and crisp sidewalk edging.",
  },
  {
    title: "Hedge & Bush Trimming",
    price: "$90 – $150",
    desc: "Pruning overgrown bushes, shaping decorative hedges, and removing dead limbs.",
  },
  {
    title: "Mulch & Bed Edging",
    price: "$180+",
    desc: "Fresh dark brown or black shredded hardwood mulch application with hand-dug deep edge lines.",
  },
  {
    title: "Spring & Autumn Yard Cleanup",
    price: "$195+",
    desc: "Leaf raking, gutter clearing, branch pickup, and property haul-away.",
  },
  {
    title: "Aeration & Overseeding",
    price: "$160 – $240",
    desc: "Core aeration to relieve soil compaction followed by premium Fescue lawn seeding.",
  },
  {
    title: "Full Landscape Redesign",
    price: "Custom Estimate",
    desc: "Flowerbed planting, sod installation, stone paver borders, and complete yard transformations.",
  },
];

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
    desc: "We fill your appointment fast. Most KC customers get same-week or next-day service.",
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
    <div data-theme="landscaping" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
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
        badge="No. 1 Lawn & Landscaping Company in KC"
        titleContent={<>We're Growing Better <br /><span className="italic" style={{ color: ACCENT }}>Neighborhoods</span> One <br />Yard At A Time</>}
        description="Whether you need routine lawn maintenance, bush trimming, mulch application, or urgent yard cleanup, our team delivers fast, affordable, and professional outdoor care."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        ctaLabel="Book Landscaping"
        ctaTo="/book?service=landscaping"
        trustItems={["Licensed & Insured", "Same-Week Appointments", "100% Satisfaction"]}
        heroImage="https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&h=1000&fit=crop&auto=format"
        heroImageAlt="Landscaping Professional at Work"
        badgeLabel="Lunova Landscaping"
        badgeSubLabel="Expert Yard & Lawn Crew"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Lawn Mowing", "Hedge Trimming", "Mulch & Edging", "Seasonal Cleanup", "Aeration & Seeding", "Licensed & Insured", "Same-Week Slots", "Satisfaction Guarantee",
            "Lawn Mowing", "Hedge Trimming", "Mulch & Edging", "Seasonal Cleanup", "Aeration & Seeding", "Licensed & Insured", "Same-Week Slots", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICE PACKAGES */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}08`, borderTop: `1px solid ${PRIMARY}15`, borderBottom: `1px solid ${PRIMARY}15` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Services &amp; Rates</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Comprehensive Yard Care Menu
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm" style={{ border: `1px solid ${PRIMARY}20` }}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif-display text-2xl" style={{ color: PRIMARY }}>{item.title}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-2" style={{ backgroundColor: ACCENT, color: PRIMARY }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: `${PRIMARY}bb` }}>{item.desc}</p>
                </div>
                <Link
                  to="/book?service=landscaping"
                  className="w-full py-2.5 text-xs font-bold rounded-full text-center transition-colors block"
                  style={{ backgroundColor: PRIMARY, color: '#ffffff' }}
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
              A Reputation Built on Safety, Quality, and Integrity.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
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

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Landscape & Yard Process"
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={PRIMARY}
        accentColor={ACCENT}
      />

      {/* STATS BAR */}
      <div className="py-12 px-4 sm:px-6" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx}>
              <p className="font-serif-display text-4xl sm:text-5xl font-bold" style={{ color: ACCENT }}>{stat.val}</p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

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
            items={LANDSCAPING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Yard You'll Love?"
        subtext="Book mowing, cleanup, or a full landscape refresh today — flat-rate pricing and same-week appointments across the KC metro."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book Landscaping"
        ctaTo="/book?service=landscaping"
      />

    </div>
  );
}
