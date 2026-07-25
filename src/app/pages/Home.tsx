import type { CSSProperties } from "react";
import {
  Phone,
  ArrowUpRight,
  Sparkles,
  Truck,
  Droplets,
  AppWindow,
  Car,
  Trash2,
  Leaf,
  Building2,
  ShieldCheck,
  ThumbsUp,
  CalendarClock,
  MapPin,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import ContactStrip from "../components/common/ContactStrip";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FadeInSection from "../components/common/FadeInSection";
import PhotoGallery from "../components/common/PhotoGallery";
import TestimonialsSection from "../components/TestimonialsSection";
import Seo from "../components/common/Seo";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { preloadRoute } from "../routeModules";
import { buildLocalBusinessSchema, buildOrganizationSchema } from "../utils/structuredData";

// Sage design system — scoped to the Home page only via CSS custom
// property overrides on the root wrapper below. This re-themes every
// shared, CSS-var-driven component (TestimonialsSection, PhotoGallery,
// ContactStrip focus rings, etc.) without touching the global stylesheet.
const PRIMARY = "#1e2319"; // ink
const ACCENT = "#3d6b2e"; // sage green
const ACCENT_2 = "#7fa650"; // olive green
const BG = "#f4f6f2"; // page background
const SURFACE = "#e7ece1"; // card/section tint

const sageThemeVars = {
  "--background": BG,
  "--foreground": PRIMARY,
  "--card": "#ffffff",
  "--card-foreground": PRIMARY,
  "--popover": "#ffffff",
  "--popover-foreground": PRIMARY,
  "--primary": ACCENT,
  "--primary-foreground": "#ffffff",
  "--secondary": SURFACE,
  "--secondary-foreground": PRIMARY,
  "--muted": SURFACE,
  "--muted-foreground": "#5f6256",
  "--accent": ACCENT_2,
  "--accent-foreground": PRIMARY,
  "--border": "rgba(30, 35, 25, 0.14)",
  "--input": "transparent",
  "--input-background": SURFACE,
  "--ring": ACCENT,
  "--radius": "1.1rem",
  "--font-display": "var(--font-sage-heading)",
  "--font-body": "var(--font-sage-body)",
} as CSSProperties;

const SERVICES = [
  {
    icon: Sparkles,
    title: "Residential Cleaning",
    price: "Starting at $120",
    to: "/services/residential-cleaning",
    bookId: "cleaning",
    bullets: ["Standard clean", "Deep clean", "Move-in / move-out"],
  },
  {
    icon: Truck,
    title: "Junk Removal",
    price: "Starting at $75",
    to: "/junk-removal",
    bookId: "junk",
    bullets: ["Single item", "Partial truckload", "Full truckload"],
  },
  {
    icon: Droplets,
    title: "Power Washing",
    price: "Starting at $120",
    to: "/services/power-washing",
    bookId: "power",
    bullets: ["Siding", "Driveway", "Deck / patio"],
  },
  {
    icon: AppWindow,
    title: "Window Cleaning",
    price: "Starting at $110",
    to: "/services/window-cleaning",
    bookId: "window",
    bullets: ["Interior & exterior", "Exterior only", "Hard water treatment"],
  },
  {
    icon: Car,
    title: "Auto Detailing",
    price: "Starting at $69",
    to: "/services/auto-detailing",
    bookId: "auto",
    bullets: ["Interior only", "Exterior only", "Full detail"],
  },
  {
    icon: Trash2,
    title: "Bin Cleaning",
    price: "Starting at $15/mo",
    to: "/services/bin-cleaning",
    bookId: "bin",
    bullets: ["One-time 2-bin clean", "Recurring monthly plan", "Recurring bi-weekly plan"],
  },
  {
    icon: Leaf,
    title: "Landscaping",
    price: "Starting at $45/visit",
    to: "/landscaping",
    bookId: "landscaping",
    bullets: ["One-time clean-up", "Recurring lawn care", "Seasonal package"],
  },
  {
    icon: Building2,
    title: "Commercial Cleaning",
    price: "Custom quote",
    to: "/services/commercial-cleaning",
    bookId: "commercial",
    bullets: ["Offices", "Restaurants", "Dealerships"],
  },
];

const MARQUEE_ITEMS = [
  "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
  "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
];

const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Tell us what you need", desc: "Pick a service and the details — one-time or recurring." },
  { step: "2", title: "We confirm a time", desc: "Our team calls to lock in a date and time that works for you." },
  { step: "3", title: "We show up & handle it", desc: "Licensed, insured and local — you cross it off the list." },
];

const WHY_LUNOVA = [
  { icon: ShieldCheck, title: "Licensed & insured", desc: "Every job, every crew member, covered." },
  { icon: ThumbsUp, title: "Satisfaction guaranteed", desc: "Not happy? We'll make it right." },
  { icon: CalendarClock, title: "Flexible scheduling", desc: "One-time visits or recurring plans, on your calendar." },
  { icon: MapPin, title: "Local KC crew", desc: "Based here, on your street more than most." },
];

const FAQS = [
  {
    q: "Do you offer recurring service plans?",
    a: "Yes — cleaning, bin sanitation, and landscaping are all available on weekly, bi-weekly, or monthly recurring plans, and recurring customers get priority scheduling plus bundle pricing.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the greater Kansas City metro, including Overland Park, Olathe, Shawnee, Lenexa, Leawood, Prairie Village, Lee's Summit, Independence, Blue Springs, and Raytown. Don't see your city? Call us — we may still be able to help.",
  },
  {
    q: "How do I get a quote for commercial cleaning?",
    a: "Book online and select Commercial Cleaning, or give us a call — we'll ask a few quick questions about your space and get you a custom quote, usually same day.",
  },
  {
    q: "What if I need to reschedule?",
    a: "No problem. Text or call us at least 24 hours ahead and we'll move your appointment to a new time that works — no fees for standard reschedules.",
  },
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop&auto=format", alt: "Sparkling clean modern kitchen after a Lunova deep clean" },
  { src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7b85?w=600&h=600&fit=crop&auto=format", alt: "Freshly power washed driveway" },
  { src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&h=600&fit=crop&auto=format", alt: "Manicured lawn and landscaping" },
  { src: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop&auto=format", alt: "Streak-free window cleaning results" },
  { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop&auto=format", alt: "Junk removal crew hauling away debris" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&auto=format", alt: "Clean patio and deck after pressure washing" },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Lunova Services | Kansas City Cleaning, Landscaping & More"
        description="Lunova Services provides professional cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services across Kansas City."
        jsonLd={[buildLocalBusinessSchema(), buildOrganizationSchema()]}
      />
      <div className="font-sans-modern min-h-screen" style={{ ...sageThemeVars, backgroundColor: BG, color: PRIMARY }}>
        {/* HERO */}
        <section className="relative pt-[4.5rem] pb-16 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: BG }}>
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
              style={{ backgroundColor: `${ACCENT}12`, color: ACCENT, borderColor: `${ACCENT}30` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span>Serving the Kansas City Metro</span>
            </div>

            <h1
              className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] mb-6 tracking-tight"
              style={{ color: PRIMARY }}
            >
              Clean. Cut. Haul.
            </h1>

            <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: `${PRIMARY}bb` }}>
              Serving Kansas City homeowners &amp; property managers with top-tier cleaning, hauling &amp; landscaping.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Link
                to="/book"
                className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base transition-all shadow-md group"
                style={{ backgroundColor: ACCENT, color: "#ffffff" }}
                onMouseEnter={() => preloadRoute("/book")}
                onFocus={() => preloadRoute("/book")}
              >
                Book Online
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  style={{ backgroundColor: "#ffffff", color: ACCENT }}
                >
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <a
                href={`tel:+1${PHONE}`}
                className="inline-flex items-center gap-2 font-semibold px-6 py-4 rounded-full text-sm transition-colors border-2"
                style={{ borderColor: `${PRIMARY}30`, color: PRIMARY }}
              >
                <Phone size={16} style={{ color: ACCENT }} />
                Call {PHONE_DISPLAY}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Licensed & Insured", "Locally Owned", "Recurring Plans Available"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-4 py-2 rounded-full border"
                  style={{ borderColor: `${PRIMARY}25`, color: PRIMARY }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div style={{ backgroundColor: ACCENT, overflow: "hidden" }} className="py-3">
          <div style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", animation: "marquee 20s linear infinite", width: "max-content" }}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="text-xs font-bold uppercase tracking-widest text-white">
                ✦ {item}
              </span>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>What We Do</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl mb-3" style={{ color: PRIMARY }}>
                Eight services. One call.
              </h2>
              <p className="text-sm" style={{ color: `${PRIMARY}99` }}>
                Pick a service to see starting prices and book online in minutes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((svc, idx) => {
                const Icon = svc.icon;
                const iconBg = idx % 2 === 0 ? `${ACCENT}1a` : `${ACCENT_2}1a`;
                const iconColor = idx % 2 === 0 ? ACCENT : ACCENT_2;
                return (
                  <div
                    key={svc.title}
                    className="bg-white rounded-3xl p-6 flex flex-col shadow-sm"
                    style={{ border: `1px solid ${PRIMARY}14` }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: iconBg, color: iconColor }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif-display text-xl mb-1" style={{ color: PRIMARY }}>
                      {svc.title}
                    </h3>
                    <p className="text-xs font-bold mb-4" style={{ color: ACCENT }}>{svc.price}</p>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {svc.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs" style={{ color: `${PRIMARY}99` }}>
                          <Check size={12} style={{ color: iconColor, flexShrink: 0 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between gap-2 pt-4" style={{ borderTop: `1px solid ${PRIMARY}12` }}>
                      <Link
                        to={svc.to}
                        className="text-xs font-semibold"
                        style={{ color: PRIMARY }}
                        onMouseEnter={() => preloadRoute(svc.to)}
                        onFocus={() => preloadRoute(svc.to)}
                      >
                        Details
                      </Link>
                      <Link
                        to={`/book?service=${svc.bookId}`}
                        className="text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        style={{ color: ACCENT }}
                        onMouseEnter={() => preloadRoute("/book")}
                        onFocus={() => preloadRoute("/book")}
                      >
                        Book this <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeInSection>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: PRIMARY }}>
          <FadeInSection className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT_2 }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT_2 }} />
                <span>Simple Process</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-white">
                Booking takes two minutes.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {HOW_IT_WORKS_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-6 rounded-3xl flex flex-col items-center text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center mb-4 shadow-md"
                    style={{ backgroundColor: ACCENT_2, color: PRIMARY }}
                  >
                    {s.step}
                  </div>
                  <h3 className="font-serif-display text-2xl text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </section>

        {/* WHY LUNOVA */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=1125&fit=crop&auto=format"
                alt="Lunova professional crew"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>Why Lunova</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl mb-8 leading-tight" style={{ color: PRIMARY }}>
                One crew you can call for everything.
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {WHY_LUNOVA.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: PRIMARY }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: `${PRIMARY}99` }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Wave transition */}
        <div style={{ backgroundColor: BG, lineHeight: 0, marginTop: "-1px" }}>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: "50px" }}>
            <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={SURFACE} />
          </svg>
        </div>

        {/* SERVICE AREA — kept from the previous design, re-themed with sage colors */}
        <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={SURFACE} />

        {/* RECENT WORK GALLERY */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>Recent Work</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
                See the Lunova difference.
              </h2>
            </div>
            <PhotoGallery images={GALLERY_IMAGES} />
          </FadeInSection>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-6xl mx-auto">
            <TestimonialsSection title="Just getting started in KC" subtitle="Customer Reviews" />
          </FadeInSection>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3 justify-center" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>Questions</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
                Frequently asked.
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group bg-white rounded-2xl px-6 py-4"
                  style={{ border: `1px solid ${PRIMARY}14` }}
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-sm" style={{ color: PRIMARY }}>
                    {f.q}
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform group-open:rotate-45"
                      style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: `${PRIMARY}99` }}>{f.a}</p>
                </details>
              ))}
            </div>
          </FadeInSection>
        </section>

        {/* CONTACT STRIP */}
        <ContactStrip
          heading="Ready to check something off your list?"
          subtext="Book online in under two minutes — we'll confirm by phone."
          primaryColor={PRIMARY}
          accentColor={ACCENT_2}
          ctaLabel="Book Online"
          ctaTo="/book"
        />
      </div>
    </>
  );
}
