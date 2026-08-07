import { CheckCircle } from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import Seo from "../../components/common/Seo";
import StatBand from "../../components/StatBand";
import PackageGrid from "../../components/PackageGrid";
import WorkGallery from "../../components/WorkGallery";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../../utils/structuredData";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES["residential-cleaning"];


const STATS = [
  { val: "From $130", label: "Starting Price" },
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
    desc: "Choose any open slot — including same-week. We confirm by text the night before.",
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
  { q: "Do I need to be home during the cleaning?", a: "No — many of our clients provide a key or door code. We clean while you're at work and you come home to a spotless house." },
  { q: "Do you bring your own supplies?", a: "Yes. We bring all cleaning products and equipment. If you have preferred products, just let us know." },
  { q: "How do I prepare for a cleaning?", a: "Just pick up personal items and clutter so our team can focus on cleaning surfaces, not organizing." },
  { q: "What's included in a standard clean?", a: "Kitchen, bathrooms, bedrooms, living areas, dusting, vacuuming, mopping, and more. See our packages for details." },
];

export default function ResidentialCleaning() {
  return (
    <div data-theme="residential-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <Seo
        title="Residential Cleaning Services | Lunova Services"
        description={RESIDENTIAL_CLEANING_DESCRIPTION}
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
        ctaTo="/book?service=cleaning"
        trustItems={["Fully Insured", "Satisfaction Guarantee", "Eco Products"]}
        heroImage="residential-cleaning-hero"
        heroImageAlt="Professional residential cleaning in a Kansas City home"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Deep Clean", "Move-In Clean", "Move-Out Clean", "Weekly Recurring", "Eco Products",
            "Background-Checked Crew", "Same-Week Slots", "Satisfaction Guarantee",
            "Deep Clean", "Move-In Clean", "Move-Out Clean", "Weekly Recurring", "Eco Products",
            "Background-Checked Crew", "Same-Week Slots", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.ink }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* WHAT'S INCLUDED — shared PackageGrid, sourced from constants/serviceDetails.ts.
          Same packages, same checklist, same prices the booking wizard shows — clicking
          "Book this" pre-selects the exact package in the wizard via ?package=. */}
      <PackageGrid serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* WHAT DONE LOOKS LIKE — real job photography, see constants/serviceGallery.ts */}
      <WorkGallery
        serviceKey="residential-cleaning"
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        bookTo="/book?service=cleaning"
      />

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Three Steps from Booking to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={GROUND}
        accentColor={ACCENT}
      />

      {/* PRICING */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Pricing</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: BRAND.ink }}>
            Honest pricing.<br />
            <span className="italic" style={{ color: PRIMARY }}>Zero surprises.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {[
            {
              name: "Standard",
              price: "$130",
              sub: "per visit",
              highlight: false,
              features: ["Up to 3 bedrooms", "Kitchens & bathrooms", "Dusting & vacuuming", "Mopping & trash", "Same supplies every visit"],
            },
            {
              name: "Deep Clean",
              price: "$220",
              sub: "per visit",
              highlight: true,
              features: ["Everything in Standard", "Inside appliances", "Baseboards & blinds", "Cabinet fronts", "Ideal for first visit"],
            },
            {
              name: "Move In/Out",
              price: "$250",
              sub: "starting",
              highlight: false,
              features: ["Empty property clean", "All cabinets inside", "All closets & fixtures", "Walls & light switches", "Deposit-return ready"],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-8 flex flex-col gap-5"
              style={{
                backgroundColor: plan.highlight ? PRIMARY : '#ffffff',
                color: plan.highlight ? 'white' : BRAND.ink,
                border: plan.highlight ? 'none' : `2px solid ${PRIMARY}20`,
                boxShadow: plan.highlight ? `0 20px 60px ${PRIMARY}40` : '0 2px 12px rgba(0,0,0,0.05)',
                transform: plan.highlight ? 'scale(1.04)' : 'none',
              }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity: 0.6 }}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-display text-5xl">{plan.price}</span>
                  <span className="text-sm" style={{ opacity: 0.6 }}>{plan.sub}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={15} style={{ color: plan.highlight ? ACCENT : PRIMARY, flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/book?service=cleaning"
                className="text-center font-bold py-3 rounded-full text-sm block"
                style={{
                  backgroundColor: plan.highlight ? ACCENT : PRIMARY,
                  color: plan.highlight ? BRAND.ink : 'white',
                }}
              >
                Book Reservation →
              </Link>
            </div>
          ))}
        </div>
      </section>

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
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Spotless Home?"
        subtext="Book your clean today and get a flat-rate quote in minutes. Same-week slots are available across the Kansas City metro."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=cleaning"
      />

    </div>
  );
}
