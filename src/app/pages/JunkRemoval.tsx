import { ShieldCheck, Truck, Calendar, Star } from "lucide-react";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import Seo from "../components/common/Seo";
import StatBand from "../components/StatBand";
import PackageGrid from "../components/PackageGrid";
import { SERVICE_THEMES } from "../constants/theme";
import { BRAND } from "../constants/brand";
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../constants/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../utils/structuredData";
import { withAlpha } from "../utils/color";
import Marquee from "../components/Marquee";
import { heroOgImage } from "../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["junk-removal"];


const FEATURES = [
  {
    icon: Truck,
    title: "All-In-One Haul & Sweep",
    desc: "Our team hauls away all junk AND sweeps or blows the area before packing up, leaving your space cleaner than we found it.",
  },
  {
    icon: ShieldCheck,
    title: "Eco-Responsible Disposal",
    desc: "We sort and donate usable items, recycle electronics and metals, and minimize landfill waste on every job.",
  },
  {
    icon: Calendar,
    title: "Same-Day & Next-Day Service",
    desc: "Book online or call. We confirm via text and show up on time with a two-man crew ready to lift anything.",
  },
  {
    icon: Star,
    title: "Careful, Damage-Free Crews",
    desc: "Background-checked crew, careful with your property, and upfront pricing before we lift a thing.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.junk), label: "Starting Price" },
  { val: "Same-Day", label: "Service" },
  { val: "Eco-Friendly", label: "Disposal" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Photo or Call Estimate",
    desc: "Send us a photo or describe your items over the phone, and we'll give you a firm price in minutes.",
  },
  {
    step: "2",
    title: "Confirm & Schedule",
    desc: "Pick a time that works for you, even same-day. We'll confirm via text.",
  },
  {
    step: "3",
    title: "Crew Arrives & Hauls",
    desc: "Our two-man crew handles all lifting, carrying, and loading with zero damage to your property.",
  },
  {
    step: "4",
    title: "Sweep & Sign Off",
    desc: "We sweep the area, confirm you're satisfied, and process payment on the spot.",
  },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Single-Item Pickup", "Full Truckload", "Same-Day Service", "Eco-Friendly Recycling", "Estate Cleanouts", "Licensed & Insured", "Free Estimates", "Satisfaction Guarantee",
];

const JUNK_REMOVAL_DESCRIPTION =
  "Furniture, appliances, debris and full estate cleanouts across Kansas City. Same-week junk removal, priced by volume, and we sweep the space before we go.";

const JUNK_REMOVAL_FAQS = [
  { q: "What items can you remove?", a: "We haul almost everything: furniture, appliances, yard waste, construction debris, electronics, and more. We cannot take hazardous materials." },
  { q: "Do I need to move items to the curb?", a: "No. Our crew does all the heavy lifting, including items inside your home, garage, or basement." },
  { q: "How is pricing determined?", a: "Pricing is based on volume (how much space your items take up in the truck). Get an instant estimate on our quote page." },
  { q: "How quickly can you come?", a: "We offer same-day and next-day appointments in most areas. Call or book online to check availability." },
];

export default function JunkRemoval() {
  return (
    <div data-theme="junk-removal" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Junk Removal & Hauling Services | Lunova Services"
        description={JUNK_REMOVAL_DESCRIPTION}
        image={heroOgImage("junk-removal-hero")}
        imageAlt="A curbside pile of household junk cleared in one load: cardboard boxes, bagged waste, a broken dresser and a filing cabinet"
        jsonLd={[
          buildServiceSchema({ name: "Junk Removal", description: JUNK_REMOVAL_DESCRIPTION, path: "/junk-removal" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Junk Removal", path: "/junk-removal" },
          ]),
          buildFaqSchema(JUNK_REMOVAL_FAQS),
        ]}
      />
      <ServiceHero
        badge="Now Booking in Kansas City"
        titleContent={<>We Haul So <br />You <span className="italic" style={{ color: ACCENT }}>Don't</span> Have To.</>}
        description="Furniture, appliances, construction debris, and full estate cleanouts. Our crew shows up fast, lifts everything, and leaves your space spotless."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Haul"
        ctaTo={bookPath("junk")}
        trustItems={["Licensed & Insured", "Same-Day Service", "Eco-Friendly Recycling"]}
        heroImage="junk-removal-hero"
        heroImageAlt="A curbside pile of household junk cleared in one load: cardboard boxes, bagged waste, a broken dresser and a filing cabinet"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="junk" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              A Reputation Built on Muscle, Speed, and Integrity.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-card p-6 rounded-2xl flex flex-col gap-4" style={{ border: `1px solid ${withAlpha(PRIMARY, 0.071)}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GROUND, color: ACCENT }}>
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
        heading="Our Proven Junk Removal Process"
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
            items={JUNK_REMOVAL_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Clear the Clutter?"
        subtext="Get a free instant estimate and same-day hauling. Our crew handles the heavy lifting so you don't have to."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Haul"
        ctaTo={bookPath("junk")}
      />

    </div>
  );
}
