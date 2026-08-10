import {
  Star,
  ShieldCheck,
  Droplets,
  CheckCircle,
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
import ServicePolicySection from "../../components/ServicePolicySection";
import WorkGallery from "../../components/WorkGallery";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { withAlpha } from "../../utils/color";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["power-washing"];


const FEATURES = [
  {
    icon: Droplets,
    title: "Locally Owned",
    desc: "Full commercial liability coverage on every job. Your property is protected, no exceptions.",
  },
  {
    icon: ShieldCheck,
    title: "Soft Wash Technology",
    desc: "We match pressure and cleaning agents to your surface, so there's no risk of etching or damage.",
  },
  {
    icon: Star,
    title: "Background-Checked Crew",
    desc: "Every technician passes a background check before stepping foot on your property.",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guaranteed",
    desc: "If you're not happy with the results, we come back and re-clean at no additional charge.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.power), label: "Starting Price" },
  { val: "Same-Day", label: "Service" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Locally", label: "Owned" },
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
    desc: "Pick a time that works for you. Same-week slots available, and we confirm via text.",
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
  "Pressure washing, soft washing, gutter cleaning and surface restoration for homes and businesses across Kansas City. Flat rates, confirmed before we start.";

const POWER_WASHING_FAQS = [
  { q: "What surfaces can you power wash?", a: "Driveways, sidewalks, decks, patios, siding, fences, and commercial parking lots." },
  { q: "Is power washing safe for all surfaces?", a: "We adjust pressure for each surface. Soft washing is used for siding, roofs, and painted surfaces to prevent damage." },
  { q: "How long before I can use the surface?", a: "Most surfaces are ready within a few hours. We'll let you know based on the specific job." },
  { q: "Do I need to be home?", a: "Not necessarily. As long as we have access to the area and a water connection, we can complete the job." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Driveway Cleaning", "House Soft Wash", "Deck Restoration", "Oil & Rust Removal", "Locally Owned", "Soft Wash Available", "Free Estimates", "Satisfaction Guarantee",
];

export default function PowerWashing() {
  return (
    <div data-theme="power-washing" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Power Washing Services | Lunova Services"
        description={POWER_WASHING_DESCRIPTION}
        image={heroOgImage("power-washing-hero")}
        imageAlt="A pressure washer stripping grey weathering off a wooden deck, leaving a clean stripe of bare timber"
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
        description="Pressure washing, soft washing, gutter cleaning, and surface restoration across Kansas City. Flat rates, and the Done-Right Promise on every job."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("power")}
        trustItems={["Locally Owned", "Soft Wash Available", "Free Estimates"]}
        heroImage="power-washing-hero"
        heroImageAlt="A pressure washer stripping grey weathering off a wooden deck, leaving a clean stripe of bare timber"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* INSTANT ESTIMATE — the packages, questions and add-on prices from
          constants/serviceDetails.ts, priced live and handed to the wizard
          through the URL so step 2 opens already answered. Sits above the
          package grid: price first, then the detail behind the price. */}
      <ServiceEstimator serviceKey="power" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="power" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* The two services this one is usually booked with, from `upsells`. */}
      <CrossSellRow serviceKey="power" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* Access, prep and hard refusals, from constants/servicePolicy.ts.
          Only blocks with confirmed facts behind them render. */}
      <ServicePolicySection serviceKey="power" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              A Reputation Built on Pressure, Precision, and Care.
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

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="power-washing"
        primaryColor={GROUND}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo={bookPath("power")}
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Power Washing Process"
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
            items={POWER_WASHING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before you book a wash"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Restore Your Curb Appeal?"
        subtext="Book a free on-site estimate and get your driveway, siding, or deck looking brand new. Same-week slots available across Kansas City."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("power")}
      />

    </div>
  );
}
