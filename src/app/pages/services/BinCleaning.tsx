import {
  Star,
  ShieldCheck,
  Trash2,
  MapPin,
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
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { withAlpha } from "../../utils/color";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["bin-cleaning"];


/**
 * WHAT THIS PAGE MAY AND MAY NOT SAY.
 *
 * This page used to advertise "200° pressurized hot water" and "kills 99.9% of
 * bacteria", in the hero, the stat band, the marquee, the feature cards, the
 * meta description and the nav dropdown. Neither is true: the rig runs
 * unheated, and no kill rate has ever been measured for it.
 *
 * A specific efficacy percentage and a specific temperature are exactly the
 * kind of claim that has to be substantiated before it is published, so both
 * are gone rather than softened. What replaced them is the honest version of
 * the same argument — pressure and detergent and dwell time do remove the film
 * a garden hose leaves, and that stands on its own without a fake number.
 *
 * If the rig is ever heated, or a lab result ever exists, put the claim back
 * with the evidence behind it. Until then: no temperature, no percentage, no
 * "sanitised", no "disinfectant" (a regulated term for an EPA-registered
 * product, which a biodegradable detergent is not).
 */
const FEATURES = [
  {
    icon: Trash2,
    title: "Pressure Washed, Not Rinsed",
    desc: "High-pressure jets plus a biodegradable detergent, worked over every interior face. That is what lifts the film a garden hose pushes around.",
  },
  {
    icon: ShieldCheck,
    title: "Biodegradable Detergents",
    desc: "The only thing we put in your bin breaks down on its own. No solvents, nothing that needs a hazard label.",
  },
  {
    icon: Star,
    title: "Deodorizing Treatment",
    desc: "A biodegradable finishing treatment after the wash, so the bin stops smelling instead of smelling like something else.",
  },
  {
    icon: MapPin,
    title: "Curbside Route Service",
    desc: "We do all the work at the curb after trash day. You don't have to be home or do anything at all.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.bin), label: "Starting Price" },
  { val: "Curbside", label: "Nothing To Do" },
  { val: "Biodegradable", label: "Detergents" },
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
    desc: "After trash pickup, leave your empty bins at the curb. We handle the rest.",
  },
  {
    step: "3",
    title: "Pressure Wash & Detergent",
    desc: "The bin goes on the truck and gets pressure washed inside and out with a biodegradable detergent, lid and rim included.",
  },
  {
    step: "4",
    title: "Deodorize & Return",
    desc: "We apply deodorizing treatment and return your bins to the curb spotless and fresh.",
  },
];

const BIN_CLEANING_DESCRIPTION =
  "Curbside trash bin cleaning across Kansas City, on or after your pickup day. Pressure washed with biodegradable detergent, deodorized, and back at your curb.";

const BIN_CLEANING_FAQS = [
  { q: "When do you clean the bins?", a: "We schedule service after your regular trash pickup so the bins are empty when we arrive." },
  { q: "What do you use to clean the bins?", a: "Pressure washing with a biodegradable detergent, then a biodegradable deodorizing treatment. The water is not heated, and we do not claim a bacterial kill rate we have not had measured — what the wash removes is the built-up film and the smell that comes with it." },
  { q: "How often should I schedule bin cleaning?", a: "Monthly service is recommended to keep odors and bacteria under control, especially in summer." },
  { q: "How many bins can you clean?", a: "We can clean trash, recycling, and yard waste bins in a single visit." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Pressure Washed", "Monthly Route Service", "Biodegradable Detergents", "Deodorizing Treatment", "Curbside Service", "No Contracts", "Locally Owned", "Satisfaction Guarantee",
];

export default function BinCleaning() {
  return (
    <div data-theme="bin-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Trash Bin Cleaning Services | Lunova Services"
        description={BIN_CLEANING_DESCRIPTION}
        image={heroOgImage("bin-cleaning-hero")}
        imageAlt="A wheelie bin tipped on its side at the curb being pressure-rinsed, water spraying out through the open lid"
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
        titleContent={<><span className="italic" style={{ color: ACCENT }}>Clean</span> Bins. <br />No More Stench.</>}
        description="We pull up to your curb after trash day, pressure wash your bins inside and out with a biodegradable detergent, and finish with a deodorizing treatment. No mess, no hassle."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("bin")}
        trustItems={["Biodegradable Detergents", "Curbside — Nothing To Do", "Monthly Route Service"]}
        heroImage="bin-cleaning-hero"
        heroImageAlt="A wheelie bin tipped on its side at the curb being pressure-rinsed, water spraying out through the open lid"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* INSTANT ESTIMATE — the packages, questions and add-on prices from
          constants/serviceDetails.ts, priced live and handed to the wizard
          through the URL so step 2 opens already answered. Sits above the
          package grid: price first, then the detail behind the price. */}
      <ServiceEstimator serviceKey="bin" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="bin" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* The two services this one is usually booked with, from `upsells`. */}
      <CrossSellRow serviceKey="bin" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* Access, prep and hard refusals, from constants/servicePolicy.ts.
          Only blocks with confirmed facts behind them render. */}
      <ServicePolicySection serviceKey="bin" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              The Bin Comes To Us. You Don't Lift Anything.
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
        heading="Our Proven Bin Cleaning Process"
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
            items={BIN_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before you join a route"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Ditch the Stink?"
        subtext="Join our monthly route and never scrub a filthy bin again. Washed, deodorized, and back at your curb before you know it."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("bin")}
      />

    </div>
  );
}
