import {
  ShieldCheck,
  Trash2,
  Sparkles,
  Car,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import CrossSellRow from "../../components/CrossSellRow";
import ServicePolicySection from "../../components/ServicePolicySection";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { BIN_ADDON, formatDollars, serviceCtaPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { withAlpha } from "../../utils/color";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["bin-cleaning"];


/**
 * WHAT THIS PAGE MAY AND MAY NOT SAY.
 *
 * Two separate rounds of untrue claims have been taken off this page.
 *
 * First: it advertised "200° pressurized hot water" and "kills 99.9% of
 * bacteria" — in the hero, the stat band, the marquee, the feature cards and
 * the meta description. Neither was true. A specific temperature and a specific
 * efficacy percentage both have to be substantiated before publication.
 *
 * Second, and worse: everything that replaced them still described PRESSURE
 * WASHING, on a curbside subscription route, performed by a truck-mounted rig.
 * Lunova does not own a pressure washer. There is no route, there are no
 * subscribers, and no bin has ever gone on the truck. The page was selling a
 * business that does not exist.
 *
 * What it sells now is the thing that is real: two bins scrubbed out by hand
 * with a detergent and deodorised, done while the crew is already at the
 * property for a clean or a detail. That is why there is no standalone price
 * and no "book bin cleaning" button — see BIN_ADDON in constants/services.ts,
 * and the `active: false` on the catalogue entry, which here means "not a
 * wizard category" rather than "not offered".
 *
 * If a pressure washer is ever bought, or a route ever has subscribers on it,
 * put those claims back with the equipment behind them. Until then: no
 * temperature, no percentage, no "sanitised", no "disinfectant" (a regulated
 * term for an EPA-registered product, which a biodegradable detergent is not),
 * and no "pressure washed".
 */
const FEATURES = [
  {
    icon: Trash2,
    title: "Scrubbed Out, Not Rinsed",
    desc: "Tipped, worked over every interior face with a stiff brush and a detergent, and rinsed clean. That is what lifts the film a garden hose pushes around.",
  },
  {
    icon: ShieldCheck,
    title: "Biodegradable Detergents",
    desc: "The only thing that goes in your bin breaks down on its own. No solvents, nothing that needs a hazard label.",
  },
  {
    icon: Sparkles,
    title: "Deodorising Treatment",
    desc: "A biodegradable finishing treatment after the wash, so the bin stops smelling instead of smelling like something else.",
  },
  {
    icon: Car,
    title: "Added To A Job You Already Booked",
    desc: "We do it while we are already at your address for a clean or a detail. The drive is paid for, which is the only reason it costs what it costs.",
  },
];

const STATS = [
  { val: formatDollars(BIN_ADDON.price), label: "Two Bins, Added On" },
  { val: `+${formatDollars(BIN_ADDON.perExtraBin)}`, label: "Each Extra Bin" },
  { val: "~15 min", label: "Added To Your Visit" },
  { val: "Biodegradable", label: "Detergents" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Book A Clean Or A Detail",
    desc: "Bin cleaning rides along with another job. Start with the house or the car — the bins are a tick box in the wizard.",
  },
  {
    step: "2",
    title: "Tick The Bins",
    desc: "Two bins are included in the add-on price. Tell us if you have more and we will price the extras before we come out.",
  },
  {
    step: "3",
    title: "Leave Them Emptied",
    desc: "Anytime after your collection day is ideal. A bin with a full bag still in it cannot be washed, and we would rather say that now than at your gate.",
  },
  {
    step: "4",
    title: "Washed And Put Back",
    desc: "Scrubbed inside and out, lid and rim included, deodorised, and returned where we found them.",
  },
];

const BIN_CLEANING_DESCRIPTION =
  "Trash bin cleaning in Kansas City, added to a house clean or a car detail. Two bins scrubbed out with a biodegradable detergent and deodorised.";

const BIN_CLEANING_FAQS = [
  {
    q: "Can I book bin cleaning on its own?",
    a: `No, and the reason is the drive rather than the work. Two bins is about fifteen minutes. A round trip across the metro for a ${formatDollars(BIN_ADDON.price)} job costs more in fuel and time than the job pays, so we would either have to charge four times as much or do it badly. Add it to a clean or a detail and the drive is already paid for — that is the whole reason the price is what it is.`,
  },
  {
    q: "What do you actually do to the bin?",
    a: "Tip it, scrub every interior face and the lid and rim with a stiff brush and a biodegradable detergent, rinse it out, then apply a biodegradable deodorising treatment. We do not pressure wash — we do not own a pressure washer, and we would rather tell you that than let you picture a rig we do not have. We also do not publish a bacterial kill rate, because nobody has ever measured ours. What the wash removes is the built-up film and the smell that comes with it.",
  },
  {
    q: "How many bins does the price cover?",
    a: `Two. Trash, recycling, yard waste — whichever two you want done. Each bin after that is ${formatDollars(BIN_ADDON.perExtraBin)}, and it is worth telling us the number when you book rather than on the day, so the visit is scheduled with the extra time in it.`,
  },
  {
    q: "Does the bin need to be empty?",
    a: "Yes. Anytime after your collection day is the easy window. A bin with a full bag still in it cannot be washed, and if we arrive to one we will do the rest of the job and take the bin cleaning off the invoice rather than charge you for a rinse.",
  },
  {
    q: "How often is worth doing?",
    a: "Twice a year for most households, and once in high summer if you have a dog or put food waste in the bin — that is when the smell stops being a smell and starts being flies. There is no subscription to sign; add it whenever you have us out.",
  },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Scrubbed, Not Rinsed", "Lid And Rim Included", "Biodegradable Detergents", "Deodorising Treatment", "Added To Any Job", "No Subscription", "Locally Owned", "Two Bins Included",
];

export default function BinCleaning() {
  return (
    <div data-theme="bin-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Trash Bin Cleaning in Kansas City | Lunova Services"
        description={BIN_CLEANING_DESCRIPTION}
        image={heroOgImage("bin-cleaning-hero")}
        imageAlt="A wheelie bin tipped on its side at the curb being rinsed out, water running from the open lid"
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
        badge={`Add-on · ${formatDollars(BIN_ADDON.price)} for two bins`}
        titleContent={<><span className="italic" style={{ color: ACCENT }}>Clean</span> Bins. <br />No More Stench.</>}
        description={`While we are already at your address for a clean or a detail, we will tip your bins, scrub them out with a biodegradable detergent, and deodorise them. ${formatDollars(BIN_ADDON.price)} for two, ${formatDollars(BIN_ADDON.perExtraBin)} for each one after that.`}
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a job and add it"
        ctaTo={serviceCtaPath("bin")}
        trustItems={["Biodegradable Detergents", "Lid And Rim Included", "No Subscription"]}
        heroImage="bin-cleaning-hero"
        heroImageAlt="A wheelie bin tipped on its side at the curb being rinsed out, water running from the open lid"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/*
        No estimator and no package grid here, and that is on purpose rather
        than an omission: bin cleaning is an add-on, not a wizard category, so
        there is nothing to configure and nothing to price. Both components
        return null for it anyway — the CrossSellRow below is the real call to
        action, because booking one of those two jobs is how you get this one.
      */}
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
              Fifteen Minutes You Will Never Spend Again.
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
        heading="How The Bins Actually Get Done"
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
            subtitle="Before you add it on"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Ditch the Stink?"
        subtext={`Book a house clean or a car detail and tick the bins. ${formatDollars(BIN_ADDON.price)} for two, done while we are already there, and nothing to sign up to.`}
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a job and add it"
        ctaTo={serviceCtaPath("bin")}
      />

    </div>
  );
}
