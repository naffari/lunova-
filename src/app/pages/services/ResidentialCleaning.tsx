import {
  Phone,
  ArrowUpRight,
  Star,
  CheckCircle,
  ShieldCheck,
  Clock,
  Leaf,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";

const PRIMARY = "#14304A";
const ACCENT = "#E8A830";
const BG = "#F1EBD9";
const DARK = "#0C1F30";

const PACKAGES = [
  {
    title: "Standard Clean",
    badge: "Most Popular",
    price: "From $130",
    desc: "Our regular maintenance clean covers all living areas, bathrooms, kitchen surfaces, and bedrooms following a detailed 40-point checklist.",
    includes: ["Kitchens & bathrooms", "Dusting & vacuuming", "Mopping all floors", "Trash removal"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop&auto=format",
  },
  {
    title: "Deep Clean",
    badge: "Recommended First Visit",
    price: "From $220",
    desc: "An intensive top-to-bottom clean including inside appliances, baseboards, cabinet faces, window sills, and every forgotten corner.",
    includes: ["Everything in standard", "Inside oven & fridge", "Baseboards & blinds", "Cabinet fronts & tracks"],
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&h=500&fit=crop&auto=format",
  },
  {
    title: "Move-In / Move-Out",
    badge: "Deposit Saver",
    price: "From $250",
    desc: "Landlord-ready or move-in-ready cleans designed to leave the property spotless. Perfect for renters, sellers, and property managers.",
    includes: ["Empty-space deep clean", "Inside all cabinets & closets", "Appliance interiors", "Walls & light fixtures"],
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&h=500&fit=crop&auto=format",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Fully Insured", sub: "Bonded & background-checked" },
  { icon: Star, label: "5.0 Rated", sub: "Hundreds of happy clients" },
  { icon: Clock, label: "On Time, Every Time", sub: "We never ghost or cancel" },
  { icon: Leaf, label: "Eco Products", sub: "Safe for kids & pets" },
];

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

export default function ResidentialCleaning() {
  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: DARK }}>
      {/* HERO */}
      <section className="px-4 sm:px-6 pt-[4.5rem] pb-4" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-5xl mx-auto text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: ACCENT, color: DARK }}
          >
            #1 Residential Cleaning in Kansas City
          </span>
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 ml-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Residential Cleaning by Lunova
          </span>

          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal text-white leading-tight mb-6">
            Your Home, Cleaned<br />
            <span style={{ color: ACCENT }} className="italic">Spotlessly.</span>
          </h1>

          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
            Standard cleans, deep cleans, and move-in/out services. We bring all supplies, arrive on time, and leave every room immaculate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book?service=cleaning"
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-full text-base"
              style={{ backgroundColor: ACCENT, color: DARK }}
            >
              Book a Clean <ArrowUpRight size={18} />
            </Link>
            <a
              href={`tel:+1${PHONE}`}
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-base border-2 text-white"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Phone size={18} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Wave transition */}
      <div style={{ backgroundColor: PRIMARY, lineHeight: 0, marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: '50px' }}>
          <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={BG} />
        </svg>
      </div>

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
            "Deep Clean", "Move-In Clean", "Move-Out Clean", "Weekly Recurring", "Eco Products",
            "Background-Checked Crew", "Same-Week Slots", "Satisfaction Guarantee",
            "Deep Clean", "Move-In Clean", "Move-Out Clean", "Weekly Recurring", "Eco Products",
            "Background-Checked Crew", "Same-Week Slots", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: DARK }}>
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
            Built for KC homes,<br />
            <span className="italic" style={{ color: PRIMARY }}>priced to make sense.</span>
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
                  to="/book?service=cleaning"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Book {svc.title} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Three Steps from Booking to Spotless."
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={PRIMARY}
        accentColor={ACCENT}
      />

      {/* PRICING */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Pricing</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: DARK }}>
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
                to="/book?service=cleaning"
                className="text-center font-bold py-3 rounded-full text-sm block"
                style={{
                  backgroundColor: plan.highlight ? ACCENT : PRIMARY,
                  color: plan.highlight ? DARK : 'white',
                }}
              >
                Book Reservation →
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
              { q: "Do I need to be home during the cleaning?", a: "No — many of our clients provide a key or door code. We clean while you're at work and you come home to a spotless house." },
              { q: "Do you bring your own supplies?", a: "Yes. We bring all cleaning products and equipment. If you have preferred products, just let us know." },
              { q: "How do I prepare for a cleaning?", a: "Just pick up personal items and clutter so our team can focus on cleaning surfaces, not organizing." },
              { q: "What's included in a standard clean?", a: "Kitchen, bathrooms, bedrooms, living areas, dusting, vacuuming, mopping, and more. See our packages for details." },
            ]}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

    </div>
  );
}
