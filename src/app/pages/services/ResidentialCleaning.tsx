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
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../../constants/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import Marquee from "../../components/Marquee";
import { heroOgImage } from "../../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["residential-cleaning"];


const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.cleaning), label: "Starting Price" },
  { val: "Eco-Friendly", label: "Products" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Get a Flat Quote",
    desc: "Book online in under 2 minutes. Select your clean type, home size, and date.",
  },
  {
    step: "2",
    title: "Pick Your Day",
    desc: "Choose any open slot, including same-week. We confirm by text the night before.",
  },
  {
    step: "3",
    title: "We Arrive on Time",
    desc: "Your crew shows up with all supplies. We clean, you relax. Done.",
  },
  {
    step: "4",
    title: "Quality Sign-Off",
    desc: "A team lead does a final walkthrough with you. Not happy? We make it right.",
  },
];

const RESIDENTIAL_CLEANING_DESCRIPTION =
  "Standard cleans, deep cleans, and move-in/out cleaning services for Kansas City homes. Fully insured crews, eco-friendly products, and flat-rate pricing.";

const RESIDENTIAL_CLEANING_FAQS = [
  { q: "Do I need to be home during the cleaning?", a: "No. Many of our clients provide a key or door code. We clean while you're at work and you come home to a spotless house." },
  { q: "Do you bring your own supplies?", a: "Yes. We bring all cleaning products and equipment. If you have preferred products, just let us know." },
  { q: "How do I prepare for a cleaning?", a: "Just pick up personal items and clutter so our team can focus on cleaning surfaces, not organizing." },
  { q: "What's included in a standard clean?", a: "Kitchen, bathrooms, bedrooms, living areas, dusting, vacuuming, mopping, and more. See our packages for details." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Deep Clean", "Move-In Clean", "Move-Out Clean", "Weekly Recurring", "Eco Products",
  "Background-Checked Crew", "Same-Week Slots", "Satisfaction Guarantee",
];

export default function ResidentialCleaning() {
  return (
    <div data-theme="residential-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Residential Cleaning Services | Lunova Services"
        description={RESIDENTIAL_CLEANING_DESCRIPTION}
        image={heroOgImage("cleaning-hero")}
        imageAlt="A cleaner in gloves and a face mask wiping down the window frame and shutters of a Kansas City home"
        jsonLd={[
          buildServiceSchema({ name: "Residential Cleaning", description: RESIDENTIAL_CLEANING_DESCRIPTION, path: "/services/residential-cleaning" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Residential Cleaning", path: "/services/residential-cleaning" },
          ]),
          buildFaqSchema(RESIDENTIAL_CLEANING_FAQS),
        ]}
      />
      <ServiceHero
        badge="Now Booking in Kansas City"
        titleContent={<>Your Home, Cleaned<br /><span style={{ color: ACCENT }} className="italic">Spotlessly.</span></>}
        description="Standard cleans, deep cleans, and move-in/out services. We bring all supplies, arrive on time, and leave every room immaculate."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("cleaning")}
        trustItems={["Fully Insured", "Satisfaction Guarantee", "Eco Products"]}
        heroImage="cleaning-hero"
        heroImageAlt="A cleaner in gloves and a face mask wiping down the window frame and shutters of a Kansas City home"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* INSTANT ESTIMATE — the packages, questions and add-on prices from
          constants/serviceDetails.ts, priced live and handed to the wizard
          through the URL so step 2 opens already answered. Sits above the
          package grid: price first, then the detail behind the price. */}
      <ServiceEstimator serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* The two services this one is usually booked with, from `upsells`. */}
      <CrossSellRow serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* Access, prep and hard refusals, from constants/servicePolicy.ts.
          Only blocks with confirmed facts behind them render. */}
      <ServicePolicySection serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="residential-cleaning"
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo={bookPath("cleaning")}
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Three Steps from Booking to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={GROUND}
        accentColor={ACCENT}
      />

      {/* No hand-written pricing table here on purpose. PackageGrid above renders
          the same tiers from constants/serviceDetails.ts — a second table drifted
          from the catalogue ($130/$220/$250 against the real $120/$220/$260) and
          contradicted the grid on the same page. One price, one source. */}

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
            items={RESIDENTIAL_CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before your first clean"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Spotless Home?"
        subtext="Book your clean today and get a flat-rate quote in minutes. Same-week slots are available across the Kansas City metro."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("cleaning")}
      />

    </div>
  );
}
