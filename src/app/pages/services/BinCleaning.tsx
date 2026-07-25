import {
  Star,
  ShieldCheck,
  Trash2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";

const { primary: PRIMARY, accent: ACCENT, bg: BG } = SERVICE_THEMES["bin-cleaning"];

const PACKAGES = [
  { title: "Monthly Service", price: "$28/mo", desc: "One clean per month after your regular trash pickup day. Most popular plan." },
  { title: "Bi-Monthly Service", price: "$18/mo", desc: "Clean every other month for moderate-use households." },
  { title: "One-Time Clean", price: "$45", desc: "Try it once before committing to a route plan. No contract." },
  { title: "Two-Bin Plan", price: "$48/mo", desc: "Monthly cleaning for 2 trash or recycling bins. Best value for most families." },
  { title: "Three-Bin Plan", price: "$65/mo", desc: "Three bins per month — trash, recycling, and compost or yard waste." },
  { title: "Commercial Bins", price: "Custom Quote", desc: "Dumpster and commercial bin sanitization for restaurants, apartments, and offices." },
];

const FEATURES = [
  {
    icon: Trash2,
    title: "200° Pressurized Hot Water",
    desc: "Our truck-mounted system reaches temperatures that kill bacteria, mold, and maggots that chemicals miss.",
  },
  {
    icon: ShieldCheck,
    title: "Eco-Safe Deodorizing Treatment",
    desc: "After sanitizing, we apply a biodegradable deodorizing solution that keeps bins smelling fresh between visits.",
  },
  {
    icon: Star,
    title: "Kills 99.9% of Bacteria",
    desc: "Our method is scientifically proven to eliminate the pathogens that cause odors, illness, and pest attraction.",
  },
  {
    icon: MapPin,
    title: "Curbside Route Service",
    desc: "We do all the work at the curb after trash day. You don't have to be home or do anything at all.",
  },
];

const STATS = [
  { val: "From $55", label: "Starting Price" },
  { val: "200°", label: "Hot Water" },
  { val: "99.9%", label: "Bacteria Kill Rate" },
  { val: "Monthly", label: "Routes" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Sign Up for Route",
    desc: "Add your address to your neighborhood's route. We'll notify you of your clean day.",
  },
  {
    step: "2",
    title: "Leave Bins Curbside",
    desc: "After trash pickup, leave your empty bins at the curb — we handle the rest.",
  },
  {
    step: "3",
    title: "200° Hot Water Blast",
    desc: "We load bins into our truck, blast with pressurized 200° hot water, and neutralize all bacteria.",
  },
  {
    step: "4",
    title: "Deodorize & Return",
    desc: "We apply deodorizing treatment and return your bins to the curb spotless and fresh.",
  },
];

const BIN_CLEANING_DESCRIPTION =
  "Curbside trash bin cleaning after your regular pickup day, using 200° pressurized hot water and an eco-safe deodorizing treatment across Kansas City.";

const BIN_CLEANING_FAQS = [
  { q: "When do you clean the bins?", a: "We schedule service after your regular trash pickup so the bins are empty when we arrive." },
  { q: "What do you use to clean the bins?", a: "Hot water pressure washing with EPA-approved, eco-friendly disinfectants that eliminate bacteria and odors." },
  { q: "How often should I schedule bin cleaning?", a: "Monthly service is recommended to keep odors and bacteria under control, especially in summer." },
  { q: "How many bins can you clean?", a: "We can clean trash, recycling, and yard waste bins in a single visit." },
];

export default function BinCleaning() {
  return (
    <div data-theme="bin-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <Seo
        title="Trash Bin Cleaning Services | Lunova Services"
        description={BIN_CLEANING_DESCRIPTION}
        jsonLd={[
          buildServiceSchema({ name: "Trash Bin Cleaning", description: BIN_CLEANING_DESCRIPTION, path: "/services/bin-cleaning" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Bin Cleaning", path: "/services/bin-cleaning" },
          ]),
          buildFaqSchema(BIN_CLEANING_FAQS),
        ]}
      />
      <ServiceHero
        badge="KC's Curbside Trash Bin Cleaning Service"
        titleContent={<><span className="italic" style={{ color: ACCENT }}>Sanitized</span> Bins. <br />No More Stench.</>}
        description="We pull up to your curb after trash day, blast your bins with 200° pressurized hot water, and apply a deodorizing treatment — no mess, no hassle."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=bin-cleaning"
        trustItems={["200° Hot Water Sanitization", "Kills 99.9% Bacteria", "Monthly Route Service"]}
        heroImage="/images/hero/bin-cleaning-hero.jpg"
        heroImageAlt="Curbside Bin Cleaning Service"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "200° Hot Water", "Monthly Route Service", "99.9% Bacteria Kill", "Eco-Safe Deodorizer", "Curbside Service", "No Contracts", "Licensed & Insured", "Satisfaction Guarantee",
            "200° Hot Water", "Monthly Route Service", "99.9% Bacteria Kill", "Eco-Safe Deodorizer", "Curbside Service", "No Contracts", "Licensed & Insured", "Satisfaction Guarantee",
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
              Bin Cleaning Plans &amp; Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm" style={{ border: `1px solid ${PRIMARY}18` }}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif-display text-2xl" style={{ color: PRIMARY }}>{item.title}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-2 text-white" style={{ backgroundColor: ACCENT }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: `${PRIMARY}bb` }}>{item.desc}</p>
                </div>
                <Link
                  to="/book?service=bin-cleaning"
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
              200-Degree Hot Water Technology — Nothing Else Comes Close.
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

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Bin Cleaning Process"
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
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
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
            items={BIN_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Ditch the Stink?"
        subtext="Join our monthly route and never scrub a filthy bin again — sanitized, deodorized, and back at your curb before you know it."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=bin-cleaning"
      />

    </div>
  );
}
