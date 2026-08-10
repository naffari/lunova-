import {
  ShieldCheck,
  AppWindow,
  MapPin,
  Droplets,
} from "lucide-react";
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
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { withAlpha } from "../../utils/color";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["window-cleaning"];


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
    desc: "From single-family homes to multi-story office buildings, we scale to any property size in KC.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.window), label: "Starting Price" },
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
  { q: "Do you clean interior and exterior windows?", a: "Yes. We offer interior only, exterior only, or full inside-and-out service." },
  { q: "How often should windows be professionally cleaned?", a: "Most homes benefit from cleaning 2–4 times per year. Commercial properties often need monthly service." },
  { q: "Will you clean windows in winter?", a: "Yes. We operate year-round and use solutions safe for all temperatures." },
  { q: "What about hard water stains or build-up?", a: "We carry specialized solutions for hard water and mineral deposits. Just mention it when booking." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Interior Windows", "Exterior Windows", "Screen Cleaning", "Hard Water Removal", "Streak-Free Guarantee", "Water-Fed Pole", "Licensed & Insured", "Free Estimates",
];

export default function WindowCleaning() {
  return (
    <div data-theme="window-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Window Cleaning Services | Lunova Services"
        description={WINDOW_CLEANING_DESCRIPTION}
        image={heroOgImage("window-cleaning-hero")}
        imageAlt="A squeegee pulling a clean stripe through soap on a window, blue sky visible through the glass"
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
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("window")}
        trustItems={["Streak-Free Guarantee", "Interior & Exterior", "Eco-Safe Solution"]}
        heroImage="window-cleaning-hero"
        heroImageAlt="A squeegee pulling a clean stripe through soap on a window, blue sky visible through the glass"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* INSTANT ESTIMATE — the packages, questions and add-on prices from
          constants/serviceDetails.ts, priced live and handed to the wizard
          through the URL so step 2 opens already answered. Sits above the
          package grid: price first, then the detail behind the price. */}
      <ServiceEstimator serviceKey="window" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="window" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* The two services this one is usually booked with, from `upsells`. */}
      <CrossSellRow serviceKey="window" primaryColor={PRIMARY} accentColor={ACCENT} />
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
                <div key={idx} className="bg-card p-6 rounded-2xl flex flex-col gap-4" style={{ border: `1px solid ${withAlpha(PRIMARY, 0.082)}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: PRIMARY }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>{f.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: withAlpha(BRAND.ink, 0.733) }}>{f.desc}</p>
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
            items={WINDOW_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before your first window clean"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for Streak-Free Windows?"
        subtext="Book your interior, exterior, or full-service window clean today. Flat-rate pricing and a streak-free guarantee on every pane."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("window")}
      />

    </div>
  );
}
