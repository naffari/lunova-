import {
  ArrowUpRight,
  Star,
  CheckCircle,
  ShieldCheck,
  Clock,
  Building2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";
import { SERVICE_THEMES } from "../../constants/theme";

const { primary: PRIMARY, accent: ACCENT, bg: BG } = SERVICE_THEMES["commercial-cleaning"];
const DARK = "#0C1F30";

const PACKAGES = [
  {
    title: "Office Janitorial",
    badge: "Most Popular",
    price: "$0.10/sqft",
    desc: "Nightly vacuum, trash removal, surface sanitization, and restroom restocking for office environments of all sizes.",
    includes: ["Nightly or weekly schedule", "Trash & recycling service", "Restroom sanitization", "Break room & common areas"],
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop&auto=format",
  },
  {
    title: "Medical Facility",
    badge: "HIPAA-Aware",
    price: "$0.15/sqft",
    desc: "Hospital-grade disinfecting protocols for clinics, dental offices, and outpatient facilities with compliance-minded cleaning teams.",
    includes: ["Hospital-grade disinfectants", "Exam room sanitization", "Waiting area & surfaces", "Waste disposal compliance"],
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&h=500&fit=crop&auto=format",
  },
  {
    title: "Restaurant Cleaning",
    badge: "Health Inspector Ready",
    price: "From $180/visit",
    desc: "After-close kitchen degreasing, dining area reset, and full restroom service. Leave it spotless before the morning crew arrives.",
    includes: ["Kitchen degreasing & floors", "Dining room reset", "Restroom deep clean", "Grease trap & hood areas"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop&auto=format",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Fully Insured", sub: "Full commercial liability coverage" },
  { icon: Building2, label: "Dedicated Team Lead", sub: "Consistent crew per account" },
  { icon: Clock, label: "After-Hours Service", sub: "Never disrupts your business" },
  { icon: Star, label: "5.0 Rated", sub: "Trusted by KC businesses" },
];

const STATS = [
  { val: "Custom", label: "Pricing" },
  { val: "After-Hours", label: "Available" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Facility Walk-Through",
    desc: "We tour your space, assess sq footage, and note special requirements.",
  },
  {
    step: "02",
    title: "Custom Contract Quote",
    desc: "Flat-rate nightly or weekly pricing. No surprise invoices.",
  },
  {
    step: "03",
    title: "Nightly Service Begins",
    desc: "Dedicated crew arrives after-hours and works your facility checklist.",
  },
  {
    step: "04",
    title: "Monthly Quality Audit",
    desc: "Account manager reviews service and adjusts based on your feedback.",
  },
];

export default function CommercialCleaning() {
  return (
    <div data-theme="commercial-cleaning" className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: DARK }}>
      <ServiceHero
        badge="Now Accepting Commercial Contracts in KC"
        titleContent={<>Professional Janitorial.<br /><span style={{ color: ACCENT }} className="italic">Every Night. On Time.</span></>}
        description="Scheduled nightly janitorial for offices, medical facilities, retail stores, and restaurants. Fully insured, contract-ready, and dedicated to your standards."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=commercial"
        trustItems={["Fully Insured", "After-Hours Service", "5.0 Rated"]}
        heroImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop&auto=format"
        heroImageAlt="Commercial janitorial team cleaning an office space in Kansas City"
        badgeLabel="Commercial Cleaning by Lunova"
        badgeSubLabel="Trusted by KC Businesses"
      />

      {/* TRUST BADGES */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ backgroundColor: `${PRIMARY}15` }}>
                <Icon size={26} style={{ color: PRIMARY }} />
              </div>
              <p className="font-bold text-sm" style={{ color: DARK }}>{label}</p>
              <p className="text-xs" style={{ color: '#888' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Nightly Janitorial", "Office Cleaning", "Medical Facility", "Restaurant Cleaning", "HIPAA-Aware Protocols", "After-Hours Service", "Dedicated Crew", "Satisfaction Guarantee",
            "Nightly Janitorial", "Office Cleaning", "Medical Facility", "Restaurant Cleaning", "HIPAA-Aware Protocols", "After-Hours Service", "Dedicated Crew", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES — ALTERNATING ROWS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Services</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: DARK }}>
            Built for KC businesses,<br />
            <span className="italic" style={{ color: PRIMARY }}>priced per square foot.</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {PACKAGES.map((svc, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}
            >
              <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl flex-shrink-0" style={{ height: '300px' }}>
                <img src={svc.img} alt={svc.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: ACCENT, color: DARK }}
                >
                  {svc.badge}
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-serif-display text-3xl" style={{ color: DARK }}>{svc.title}</h3>
                  <span className="font-bold text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}>
                    {svc.price}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{svc.desc}</p>
                <ul className="space-y-2">
                  {svc.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: DARK }}>
                      <CheckCircle size={16} style={{ color: PRIMARY }} className="shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book?service=commercial"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Request Quote <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Four Steps from Contract to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={PRIMARY}
        accentColor={ACCENT}
      />

      {/* PRICING */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Pricing</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: DARK }}>
            Transparent contracts.<br />
            <span className="italic" style={{ color: PRIMARY }}>No lock-in required.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {[
            {
              name: "Small Office",
              price: "~$250",
              sub: "per month",
              highlight: false,
              features: ["Up to 2,500 sqft", "Nightly 5 days/week", "Trash & restroom service", "Surface sanitization", "Break room cleaning"],
            },
            {
              name: "Mid-Size Business",
              price: "~$650",
              sub: "per month",
              highlight: true,
              features: ["2,500–10,000 sqft", "Nightly service included", "Dedicated team lead", "Monthly quality audit", "Priority scheduling"],
            },
            {
              name: "Enterprise / Custom",
              price: "Quote",
              sub: "based on scope",
              highlight: false,
              features: ["10,000+ sqft", "Medical, retail & restaurant", "Multi-location support", "Custom checklist", "Flexible contract terms"],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-8 flex flex-col gap-5"
              style={{
                backgroundColor: plan.highlight ? PRIMARY : '#ffffff',
                color: plan.highlight ? 'white' : DARK,
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
                to="/book?service=commercial"
                className="text-center font-bold py-3 rounded-full text-sm block"
                style={{
                  backgroundColor: plan.highlight ? ACCENT : PRIMARY,
                  color: plan.highlight ? DARK : 'white',
                }}
              >
                Request a Quote →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <div className="py-12 px-4 sm:px-6" style={{ backgroundColor: DARK }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-serif-display text-4xl font-bold" style={{ color: ACCENT }}>{s.val}</p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave transition */}
      <div style={{ backgroundColor: DARK, lineHeight: 0, marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: '50px' }}>
          <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={BG} />
        </svg>
      </div>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FaqSection
            items={[
              { q: "Do you offer after-hours cleaning?", a: "Yes — we specialize in after-hours and overnight cleaning so your business is ready to open each morning." },
              { q: "Can you handle large commercial spaces?", a: "Absolutely. We serve offices, retail stores, medical facilities, and industrial spaces." },
              { q: "Do you provide cleaning contracts?", a: "Yes. We offer weekly, bi-weekly, and monthly contracts with discounted rates for long-term commitments." },
              { q: "Are your cleaners insured?", a: "Yes. Lunova Services is fully licensed and insured. We carry liability coverage for all commercial jobs." },
            ]}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

      <ContactStrip
        heading="Ready for a Spotless Workplace?"
        subtext="Get a custom contract quote for your facility. After-hours crews, dedicated team leads, and no long-term lock-in required."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Request a Quote"
        ctaTo="/book?service=commercial"
      />

    </div>
  );
}
