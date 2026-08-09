import {
  Star,
  ShieldCheck,
  Car,
  MapPin,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import PackageGrid from "../../components/PackageGrid";
import WorkGallery from "../../components/WorkGallery";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { SERVICE_BY_ID, startingAtLabel, bookPath } from "../../constants/services";
import Marquee from "../../components/Marquee";
import { withAlpha } from "../../utils/color";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["auto-detailing"];


const FEATURES = [
  {
    icon: Car,
    title: "Fully Mobile, No Drop-Off Needed",
    desc: "We bring everything: water, generator, vacuum, and professional-grade products to your location.",
  },
  {
    icon: ShieldCheck,
    title: "Ceramic Coating & Paint Protection",
    desc: "Add a ceramic coating or paint sealant to protect your vehicle's finish from UV, swirls, and contaminants.",
  },
  {
    icon: Star,
    title: "Detail-Obsessed Crew",
    desc: "From daily drivers to luxury vehicles, our detail team treats every car like it's their own.",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    desc: "Home, office, or apartment complex, our mobile unit parks and works wherever you are in KC.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.auto), label: "Starting Price" },
  { val: "Mobile", label: "Service" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Book & Describe Vehicle",
    desc: "Tell us your vehicle type and service level. We confirm a time at your home or office.",
  },
  {
    step: "2",
    title: "Crew Arrives Fully Equipped",
    desc: "Our team pulls up with everything needed. No hose hookup required from you.",
  },
  {
    step: "3",
    title: "Interior & Exterior Detail",
    desc: "We work systematically from roof to tires, inside and out, following a meticulous checklist.",
  },
  {
    step: "4",
    title: "Final Inspection & Shine",
    desc: "We walk around the vehicle with you and buff out any remaining spots before signing off.",
  },
];

const AUTO_DETAILING_DESCRIPTION =
  "Mobile auto detailing brought directly to your home or office in Kansas City. From express washes to full paint protection and ceramic coating.";

const AUTO_DETAILING_FAQS = [
  { q: "Do you come to my location?", a: "Yes. We are fully mobile and come to your home, office, or wherever your vehicle is parked." },
  { q: "How long does a detail take?", a: "Standard details take 2–4 hours. Full interior/exterior details can take 4–6 hours depending on vehicle size and condition." },
  { q: "Do you need access to water and power?", a: "We carry our own water supply and power equipment. You don't need to provide anything." },
  { q: "What vehicles do you detail?", a: "Cars, trucks, SUVs, vans, and boats. Pricing varies by vehicle size." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Full Detail", "Ceramic Coating", "Interior Steam Clean", "Headlight Restoration", "Mobile Service", "Licensed & Insured", "Satisfaction Guarantee", "We Come to You",
];

export default function AutoDetailing() {
  return (
    <div data-theme="auto-detailing" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Auto Detailing Services | Lunova Services"
        description={AUTO_DETAILING_DESCRIPTION}
        jsonLd={[
          buildServiceSchema({ name: "Auto Detailing", description: AUTO_DETAILING_DESCRIPTION, path: "/services/auto-detailing" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
            { name: "Auto Detailing", path: "/services/auto-detailing" },
          ]),
          buildFaqSchema(AUTO_DETAILING_FAQS),
        ]}
      />
      <ServiceHero
        badge="KC's Mobile Auto Detailing Service"
        titleContent={<>Your Car, <span className="italic" style={{ color: ACCENT }}>Detailed</span> <br />At Your Doorstep.</>}
        description="We bring professional-grade detailing directly to your home or office, from express washes to full paint protection."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("auto")}
        trustItems={["Mobile Service", "Ceramic Coating Available", "Interior Steam Clean"]}
        heroImage="auto-detailing-hero"
        heroImageAlt="Mobile Auto Detailing Professional"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="auto" primaryColor={PRIMARY} accentColor={ACCENT} />
      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Professional Detailing Without Leaving Your Driveway.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-card p-6 rounded-2xl flex flex-col gap-4" style={{ border: `1px solid ${withAlpha(PRIMARY, 0.082)}` }}>
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

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="auto-detailing"
        primaryColor={GROUND}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo={bookPath("auto")}
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Auto Detailing Process"
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
            items={AUTO_DETAILING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before you book a detail"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Showroom Shine?"
        subtext="Book your mobile detail today. We bring the water, power, and products straight to your driveway anywhere in the KC metro."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("auto")}
      />

    </div>
  );
}
