import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Home,
  Building2,
  Droplets,
  AppWindow,
  Car,
  Trash2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";

const PRIMARY = "#14304A";
const ACCENT = "#E8A830";
const BG = "#F1EBD9";

const SERVICES = [
  {
    icon: Home,
    title: "Residential Cleaning",
    price: "From $130",
    desc: "Weekly, bi-weekly, or one-time deep cleans for homes of all sizes.",
    bullets: ["Recurring & deep cleans", "Move-in/out service", "Eco-friendly supplies"],
    link: "/services/residential-cleaning",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Building2,
    title: "Commercial Janitorial",
    price: "From $0.10/sqft",
    desc: "Nightly or scheduled janitorial for offices, medical, retail, and restaurants.",
    bullets: ["After-hours scheduling", "Sanitization & restocking", "Contract pricing"],
    link: "/services/commercial-cleaning",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Droplets,
    title: "Power Washing",
    price: "From $100",
    desc: "High-pressure cleaning for driveways, siding, patios, and decks.",
    bullets: ["Vinyl & stucco soft-wash", "Driveway grime removal", "Deck & patio refresh"],
    link: "/services/power-washing",
    img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7b85?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: AppWindow,
    title: "Window Cleaning",
    price: "From $140",
    desc: "Interior & exterior streak-free window cleaning for homes and offices.",
    bullets: ["Interior & exterior panes", "Screen & track cleaning", "Hard water treatment"],
    link: "/services/window-cleaning",
    img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Car,
    title: "Auto Detailing",
    price: "From $95",
    desc: "Mobile vehicle detailing brought to your home or office driveway.",
    bullets: ["Exterior wash & wax", "Interior vacuum & steam", "Sedan, SUV & truck packages"],
    link: "/services/auto-detailing",
    img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Trash2,
    title: "Trash Bin Cleaning",
    price: "From $28/mo",
    desc: "200° hot-water sanitization to eliminate bacteria and odors from curbside bins.",
    bullets: ["Kills 99.9% of bacteria", "Deodorizing treatment", "Curbside route schedule"],
    link: "/services/bin-cleaning",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop&auto=format",
  },
];

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
  { val: "From $130", label: "Starting Price" },
  { val: "Eco-Friendly", label: "Products" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

export default function Cleaning() {
  return (
    <>
      <Helmet>
        <title>Cleaning Services | Lunova Services</title>
        <meta name="description" content="Professional residential and commercial cleaning services in Kansas City. Deep cleaning, move-in/out, and recurring cleaning with eco-friendly products." />
        <meta property="og:title" content="Cleaning Services | Lunova Services" />
        <meta property="og:description" content="Professional residential and commercial cleaning. Deep cleaning, move-in/out, and recurring services with eco-friendly products." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <ServiceHero
        badge="#1 Cleaning Company in Kansas City"
        titleContent={<>We Clean <span className="italic" style={{ color: ACCENT }}>Everything.</span> <br />So You Don't Have To.</>}
        description="From home deep cleans to commercial janitorial, power washing, and auto detailing — Lunova brings professional-grade results to every surface."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=cleaning"
        trustItems={["Eco-Friendly Supplies", "Licensed & Insured", "Same-Week Slots"]}
        heroImage="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=1000&fit=crop&auto=format"
        heroImageAlt="Professional Cleaning Service"
        badgeLabel="Lunova Cleaning Services"
        badgeSubLabel="Professional Clean Crew"
      />

      {/* SERVICES HUB GRID */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}07`, borderTop: `1px solid ${PRIMARY}12`, borderBottom: `1px solid ${PRIMARY}12` }}>
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
                  className="bg-white rounded-2xl flex flex-col shadow-sm overflow-hidden"
                  style={{ border: `1px solid ${PRIMARY}18` }}
                >
                  <div className="h-48 overflow-hidden" style={{ backgroundColor: PRIMARY }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${ACCENT}22`, color: ACCENT }}
                        >
                          <Icon size={16} />
                        </div>
                        <h3 className="font-serif-display text-xl" style={{ color: PRIMARY }}>{item.title}</h3>
                      </div>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-2"
                        style={{ backgroundColor: ACCENT, color: PRIMARY }}
                      >
                        {item.price}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: `${PRIMARY}99` }}>{item.desc}</p>

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
                        style={{ backgroundColor: PRIMARY, color: '#ffffff' }}
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-tight mb-6" style={{ color: PRIMARY }}>
              A Reputation Built on Spotless Results, Every Time.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: `${PRIMARY}bb` }}>
              We're not just a cleaning company — we're your trusted property care team. Background-checked crews, eco supplies, and a satisfaction guarantee on every job.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white p-5 rounded-2xl flex items-start gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>Professional-Grade Eco Products</h4>
                  <p className="text-sm leading-relaxed" style={{ color: `${PRIMARY}99` }}>
                    We use non-toxic, EPA-registered cleaning formulas safe for kids, pets, and sensitive surfaces.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl flex items-start gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>Background-Checked, Trained Crews</h4>
                  <p className="text-sm leading-relaxed" style={{ color: `${PRIMARY}99` }}>
                    Every team member undergoes background checks, hands-on training, and regular quality audits.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/book?service=cleaning"
              className="inline-flex items-center gap-3 font-bold px-7 py-3.5 rounded-full text-sm transition-colors group text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Get To Know Us
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform"
                style={{ backgroundColor: ACCENT, color: PRIMARY }}
              >
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-[450px] sm:h-[520px] shadow-2xl border-4 border-white" style={{ backgroundColor: PRIMARY }}>
            <img
              src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=1000&fit=crop&auto=format"
              alt="Professional window cleaning service"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Cleaning Process"
        steps={HOW_IT_WORKS_STEPS}
        primaryColor={PRIMARY}
        accentColor={ACCENT}
      />

      {/* STATS BAR */}
      <div className="py-12 px-4 sm:px-6" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx}>
              <p className="font-serif-display text-4xl sm:text-5xl font-bold" style={{ color: ACCENT }}>{stat.val}</p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

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

    </div>
  </>
  );
}
