import { ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import Seo from "../components/common/Seo";
import StatBand from "../components/StatBand";
import { SERVICE_THEMES } from "../constants/theme";
import { BRAND } from "../constants/brand";
import { ACTIVE_SERVICES, SERVICE_BY_ID, startingAtLabel, bookPath } from "../constants/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "../utils/structuredData";
import Marquee from "../components/Marquee";
import CrossSellRow from "../components/CrossSellRow";
import { withAlpha } from "../utils/color";
import { heroOgImage } from "../constants/seo";

const { primary: PRIMARY, accent: ACCENT, ground: GROUND, bg: BG } = SERVICE_THEMES.cleaning;

/**
 * Hub cards. Prices come from the catalogue, never hand-written — this page
 * previously carried a third independent set of numbers that agreed with
 * neither the service pages nor the wizard.
 */
/** One-line pitch per active service. Longer than `bullets`, shorter than the page. */
const SERVICE_BLURB: Record<string, string> = {
  cleaning: "Weekly, bi-weekly or one-time deep cleans for homes of all sizes.",
  auto: "Mobile detailing brought to your driveway, from an express wash to a full interior and exterior.",
};

/*
  The hub's service cards, derived rather than hand-written.

  This was six hardcoded entries, four of which the business cannot currently
  deliver. Reading ACTIVE_SERVICES means the hub cannot advertise a line the
  booking flow refuses, and a service coming back needs no edit here.

  The copy comes from the catalogue too: `bullets` is the same three
  capabilities the homepage cards and the navigation show, so the three places
  a visitor might compare them can no longer disagree.
*/
const SERVICES = ACTIVE_SERVICES.map((service) => ({
  icon: service.icon,
  title: service.name,
  price: startingAtLabel(service),
  desc: SERVICE_BLURB[service.id],
  bullets: service.bullets,
  link: service.to,
}));

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Book Online or Call",
    desc: "Choose your service type, pick a date, and confirm your address in minutes.",
  },
  {
    step: "2",
    title: "We Confirm & Prepare",
    desc: "Your crew reviews your home details and arrives with all supplies included.",
  },
  {
    step: "3",
    title: "Professional Clean",
    desc: "We work room-by-room with a detailed checklist, sanitizing every surface.",
  },
  {
    step: "4",
    title: "Quality Check & Sign-Off",
    desc: "A team lead does a final walkthrough and you confirm everything meets our standard.",
  },
];

const STATS = [
  { val: startingAtLabel(SERVICE_BY_ID.cleaning), label: "Starting Price" },
  { val: "Eco-Friendly", label: "Products" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Locally", label: "Owned" },
];

const CLEANING_DESCRIPTION =
  "Professional residential and commercial cleaning services in Kansas City. Deep cleaning, move-in/out, and recurring cleaning with eco-friendly products.";

const CLEANING_FAQS = [
  { q: "Do I need to be home during the cleaning?", a: "No. Many of our clients provide a key or door code. We clean while you're at work and you come home to a spotless house." },
  { q: "Do you bring your own supplies?", a: "Yes. We bring all cleaning products and equipment. If you have preferred products, just let us know." },
  { q: "How do I prepare for a cleaning?", a: "Just pick up personal items and clutter so our team can focus on cleaning surfaces, not organizing." },
  { q: "What's included in a standard clean?", a: "Kitchen, bathrooms, bedrooms, living areas, dusting, vacuuming, mopping, and more. See our packages for details." },
];

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "House Cleaning", "Mobile Detailing", "Standard & Deep Cleans", "Move-In / Move-Out", "Interior & Exterior Detailing", "Locally Owned", "Flat-Rate Quotes", "Same-Week Slots",
];

export default function Cleaning() {
  return (
    <>
      <Seo
        title="Cleaning Services | Lunova Services"
        description={CLEANING_DESCRIPTION}
        image={heroOgImage("cleaning-hero")}
        imageAlt="A cleaner in gloves and a face mask wiping down the window frame and shutters of a Kansas City home"
        jsonLd={[
          buildServiceSchema({ name: "Cleaning Services", description: CLEANING_DESCRIPTION, path: "/cleaning" }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cleaning", path: "/cleaning" },
          ]),
          buildFaqSchema(CLEANING_FAQS),
        ]}
      />
      <div data-theme="cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
      <ServiceHero
        badge="Now Booking in Kansas City"
        titleContent={<>We Clean It <span className="italic" style={{ color: ACCENT }}>Properly.</span> <br />So You Don't Have To.</>}
        description="Two services, done properly: house cleaning from a standard visit to a landlord-ready move-out, and mobile detailing from an express wash to a full interior and exterior."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("cleaning")}
        trustItems={["Eco-Friendly Supplies", "Locally Owned", "Same-Week Slots"]}
        heroImage="cleaning-hero"
        heroImageAlt="A cleaner in gloves and a face mask wiping down the window frame and shutters of a Kansas City home"
      />

      <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={BRAND.ink} />

      {/* SERVICES HUB GRID */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: withAlpha(PRIMARY, 0.027), borderTop: `1px solid ${withAlpha(PRIMARY, 0.07)}`, borderBottom: `1px solid ${withAlpha(PRIMARY, 0.07)}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Our Services</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Comprehensive Cleaning Services
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-card rounded-2xl flex flex-col overflow-hidden"
                  style={{ border: `1px solid ${withAlpha(PRIMARY, 0.094)}` }}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: withAlpha(ACCENT, 0.133), color: ACCENT }}
                        >
                          <Icon size={20} />
                        </div>
                        <h3 className="font-serif-display text-xl" style={{ color: PRIMARY }}>{item.title}</h3>
                      </div>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-2"
                        style={{ backgroundColor: ACCENT, color: BRAND.ink }}
                      >
                        {item.price}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: withAlpha(BRAND.ink, 0.733) }}>{item.desc}</p>

                    <ul className="space-y-1.5 mb-6">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-sm" style={{ color: PRIMARY }}>
                          <CheckCircle2 size={14} style={{ color: ACCENT }} className="shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <Link
                        to={item.link}
                        className="w-full py-2.5 text-xs font-bold rounded-full text-center transition-colors block"
                        style={{ backgroundColor: GROUND, color: '#ffffff' }}
                      >
                        View Full Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-tight mb-6" style={{ color: PRIMARY }}>
              A Reputation Built on Spotless Results, Every Time.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: withAlpha(BRAND.ink, 0.733) }}>
              We're a new Kansas City cleaning company built on background-checked crews, eco supplies, and a satisfaction guarantee on every job.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-card p-5 rounded-2xl flex items-start gap-4" style={{ border: `1px solid ${withAlpha(PRIMARY, 0.082)}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GROUND, color: ACCENT }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>Professional-Grade Eco Products</h4>
                  <p className="text-sm leading-relaxed" style={{ color: withAlpha(BRAND.ink, 0.733) }}>
                    We use non-toxic, EPA-registered cleaning formulas safe for kids, pets, and sensitive surfaces.
                  </p>
                </div>
              </div>

              <div className="bg-card p-5 rounded-2xl flex items-start gap-4" style={{ border: `1px solid ${withAlpha(PRIMARY, 0.082)}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GROUND, color: ACCENT }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>Background-Checked, Trained Crews</h4>
                  <p className="text-sm leading-relaxed" style={{ color: withAlpha(BRAND.ink, 0.733) }}>
                    Every team member undergoes background checks, hands-on training, and regular quality audits.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to={bookPath("cleaning")}
              className="inline-flex items-center gap-3 font-bold px-7 py-3.5 rounded-full text-sm transition-colors group text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Get To Know Us
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform"
                style={{ backgroundColor: ACCENT, color: BRAND.ink }}
              >
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Cleaning Process"
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

      {/* No estimator on this page: it is the hub that splits residential from
          commercial, and both of those pages carry their own. Asking "which
          clean?" here would duplicate the choice the page exists to make. */}
      <CrossSellRow serviceKey="cleaning" primaryColor={PRIMARY} accentColor={ACCENT} />

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FaqSection
            items={CLEANING_FAQS}
            title="Frequently Asked Questions"
            subtitle="Before you book a clean"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Spotless Property?"
        subtext="From homes to offices, driveways to vehicles, book any Lunova cleaning service today and get a flat-rate quote in minutes."
        primaryColor={GROUND}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo={bookPath("cleaning")}
      />

    </div>
  </>
  );
}
