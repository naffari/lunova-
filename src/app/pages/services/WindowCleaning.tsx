import {
  ShieldCheck,
  AppWindow,
  MapPin,
  Droplets,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";

const { primary: PRIMARY, accent: ACCENT, bg: BG } = SERVICE_THEMES["window-cleaning"];

const PACKAGES = [
  { title: "Interior Window Wash", price: "From $80", desc: "Clean interior glass surfaces, wipe frames, and remove smudges and fingerprints." },
  { title: "Exterior Window Wash", price: "From $100", desc: "Full exterior pane cleaning using water-fed pole or squeegee technique." },
  { title: "Interior & Exterior", price: "From $140", desc: "Full service: both interior and exterior panes, frames, and sills cleaned." },
  { title: "Screen Cleaning", price: "From $40", desc: "Remove, scrub, rinse, and re-install all window screens." },
  { title: "Hard Water Treatment", price: "From $75", desc: "Specialized acid wash to dissolve mineral and calcium deposits from glass." },
  { title: "Commercial Windows", price: "Custom Quote", desc: "Multi-story, storefront, and office building window cleaning on contract." },
];

const FEATURES = [
  {
    icon: AppWindow,
    title: "Water-Fed Pole System",
    desc: "Our pure water technology cleans higher windows safely from the ground, leaving zero mineral deposits.",
  },
  {
    icon: ShieldCheck,
    title: "Hard Water Stain Removal",
    desc: "We use specialized acid treatment to dissolve calcium and mineral buildup that regular cleaning can't touch.",
  },
  {
    icon: Droplets,
    title: "Streak-Free Guarantee",
    desc: "We inspect every pane in direct light before leaving. Any streaks? We touch them up on the spot.",
  },
  {
    icon: MapPin,
    title: "Residential & Commercial",
    desc: "From single-family homes to multi-story office buildings — we scale to any property size in KC.",
  },
];

const STATS = [
  { val: "From $140", label: "Starting Price" },
  { val: "Streak-Free", label: "Guarantee" },
  { val: "100%", label: "Satisfaction" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Count & Quote",
    desc: "We count panes, identify stain levels, and give you an upfront flat-rate price before we start.",
  },
  {
    step: "2",
    title: "Screen & Track Removal",
    desc: "Screens are removed, scrubbed, and rinsed. Tracks are vacuumed and wiped clean.",
  },
  {
    step: "3",
    title: "Interior & Exterior Wash",
    desc: "Frames are wiped, glass is washed with our purified solution, then squeegeed dry.",
  },
  {
    step: "4",
    title: "Streak Check & Sign-Off",
    desc: "We inspect every pane in direct light. Any streaks are touched up immediately.",
  },
];

const WINDOW_CLEANING_DESCRIPTION =
  "Interior and exterior window washing, screen scrubbing, track cleaning, and hard water stain removal for homes and businesses across Kansas City.";

const WINDOW_CLEANING_FAQS = [
  { q: "Do you clean interior and exterior windows?", a: "Yes — we offer interior only, exterior only, or full inside-and-out service." },
  { q: "How often should windows be professionally cleaned?", a: "Most homes benefit from cleaning 2–4 times per year. Commercial properties often need monthly service." },
  { q: "Will you clean windows in winter?", a: "Yes. We operate year-round and use solutions safe for all temperatures." },
  { q: "What about hard water stains or build-up?", a: "We carry specialized solutions for hard water and mineral deposits — just mention it when booking." },
];

export default function WindowCleaning() {
  return (
    <div data-theme="window-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <Seo
        title="Window Cleaning Services | Lunova Services"
        description={WINDOW_CLEANING_DESCRIPTION}
        jsonLd={[
          buildServiceSchema({ name: "Window Cleaning", description: WINDOW_CLEANING_DESCRIPTION, path: "/services/window-cleaning" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Window Cleaning", path: "/services/window-cleaning" },
          ]),
          buildFaqSchema(WINDOW_CLEANING_FAQS),
        ]}
      />
      <ServiceHero
        badge="Window Cleaning by Lunova"
        titleContent={<><span className="italic" style={{ color: ACCENT }}>Streak-Free</span> Windows. <br />Inside and Out.</>}
        description="Interior and exterior window washing, screen scrubbing, track cleaning, and hard water stain removal for homes and businesses."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=window-cleaning"
        trustItems={["Streak-Free Guarantee", "Interior & Exterior", "Eco-Safe Solution"]}
        heroImage="window-cleaning-hero"
        heroImageAlt="Window Cleaning Professional at Work"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Interior Windows", "Exterior Windows", "Screen Cleaning", "Hard Water Removal", "Streak-Free Guarantee", "Water-Fed Pole", "Licensed & Insured", "Free Estimates",
            "Interior Windows", "Exterior Windows", "Screen Cleaning", "Hard Water Removal", "Streak-Free Guarantee", "Water-Fed Pole", "Licensed & Insured", "Free Estimates",
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
              Comprehensive Window Cleaning Menu
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
                  to="/book?service=window-cleaning"
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
              Professional Window Cleaning That Makes a Real Difference.
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
        heading="Our Proven Window Cleaning Process"
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
            items={WINDOW_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for Streak-Free Windows?"
        subtext="Book your interior, exterior, or full-service window clean today — flat-rate pricing and a streak-free guarantee on every pane."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=window-cleaning"
      />

    </div>
  );
}
