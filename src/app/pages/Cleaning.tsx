import { useState } from "react";
import { CheckCircle, Phone, ArrowRight, Home, Building2, Trash2, Car, Droplets, AppWindow } from "lucide-react";
import { Link } from "react-router";
import CTABanner from "../components/CTABanner";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

type ServiceKey = "residential" | "commercial" | "bin" | "auto" | "power" | "window";

const serviceNav: { key: ServiceKey; label: string; icon: React.ReactNode }[] = [
  { key: "residential", label: "Residential", icon: <Home size={16} /> },
  { key: "commercial", label: "Commercial", icon: <Building2 size={16} /> },
  { key: "bin", label: "Bin Cleaning", icon: <Trash2 size={16} /> },
  { key: "auto", label: "Auto Detailing", icon: <Car size={16} /> },
  { key: "power", label: "Power Washing", icon: <Droplets size={16} /> },
  { key: "window", label: "Window Cleaning", icon: <AppWindow size={16} /> },
];

const services: Record<ServiceKey, {
  headline: string;
  subhead: string;
  img: string;
  alt: string;
  includes: string[];
  pricing: { label: string; price: string; note?: string }[];
  pricingNote?: string;
  crossSell?: string;
}> = {
  residential: {
    headline: "Residential Cleaning",
    subhead: "Recurring plans and one-time cleans for homes of every size. We bring everything — you just unlock the door.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=500&fit=crop&auto=format",
    alt: "Clean bright living room",
    includes: [
      "Kitchen surfaces, appliances, sink & floors",
      "All bathrooms scrubbed & disinfected",
      "Bedrooms vacuumed, dusted & tidied",
      "Living areas — furniture, baseboards, windows",
      "Move-in / move-out deep cleans available",
      "Weekly, bi-weekly & monthly recurring plans",
      "Eco-friendly product options on request",
    ],
    pricing: [
      { label: "Recurring (weekly / bi-weekly)", price: "$0.13/sq ft", note: "$130 minimum" },
      { label: "Standard one-time", price: "$0.16/sq ft", note: "$150 minimum" },
      { label: "Deep clean", price: "$0.22/sq ft", note: "$220 minimum" },
      { label: "Move-in / move-out", price: "$0.28/sq ft", note: "$250 minimum" },
    ],
    crossSell: "Add bin cleaning to any residential quote — takes 10 minutes, saves you the hassle.",
  },
  commercial: {
    headline: "Commercial Cleaning",
    subhead: "Offices, restaurants, medical facilities, and more. Consistent, professional results on your schedule.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=500&fit=crop&auto=format",
    alt: "Clean modern office space",
    includes: [
      "Standard office cleaning per visit",
      "Recurring contract rates (2–3× per week)",
      "Restaurant & kitchen-grade deep cleans",
      "Medical & industrial facility cleans",
      "After-hours scheduling available",
      "Supplies and equipment provided",
    ],
    pricing: [
      { label: "Standard office, per visit", price: "$0.10/sq ft" },
      { label: "Recurring contract (2–3×/week)", price: "10% off", note: "Per-visit rate" },
      { label: "Restaurant / medical / industrial", price: "Custom quote", note: "Site visit required" },
    ],
    pricingNote: "Commercial contracts receive priority scheduling and a dedicated account contact.",
  },
  bin: {
    headline: "Bin Cleaning",
    subhead: "Sanitize and deodorize your trash and recycling bins. A 10-minute add-on that makes a real difference.",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&h=500&fit=crop&auto=format",
    alt: "Clean residential bins",
    includes: [
      "High-pressure hot water rinse",
      "Deodorizing treatment inside & out",
      "Handles and lids cleaned",
      "Residue and buildup removed",
      "Route-based scheduling — we come to you",
      "Add more bins at a flat per-bin rate",
    ],
    pricing: [
      { label: "One-time clean (2 bins)", price: "$55" },
      { label: "Monthly subscription (2 bins)", price: "$28/mo" },
      { label: "Quarterly subscription (2 bins)", price: "$45/quarter" },
      { label: "Each additional bin", price: "+$8" },
    ],
    crossSell: "Best value when bundled with a recurring residential cleaning plan.",
  },
  auto: {
    headline: "Auto Detailing",
    subhead: "Professional interior and exterior detailing at your home or office. Mobile service available.",
    img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&h=500&fit=crop&auto=format",
    alt: "Car being detailed",
    includes: [
      "Exterior hand wash, clay bar & wax",
      "Interior vacuum, wipe-down & shampoo",
      "Leather/vinyl conditioning",
      "Glass cleaning inside & out",
      "Tire and wheel detailing",
      "Mobile service available — we come to you",
    ],
    pricing: [
      { label: "Exterior wash & wax", price: "$95" },
      { label: "Interior detail", price: "$135" },
      { label: "Full detail (interior + exterior)", price: "$215" },
      { label: "Full detail — SUV / truck", price: "$255" },
      { label: "Mobile / travel fee (outside core area)", price: "+$25" },
    ],
  },
  power: {
    headline: "Power Washing",
    subhead: "Remove years of buildup from siding, driveways, decks, and more. Before-and-after results you can see.",
    img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7b85?w=900&h=500&fit=crop&auto=format",
    alt: "Power washing a driveway",
    includes: [
      "House exterior siding & fascia",
      "Driveways, sidewalks & walkways",
      "Decks, patios & fences",
      "Gutters exterior wash",
      "Commercial storefronts & loading docks",
      "Bundle discounts on multiple surfaces",
    ],
    pricing: [
      { label: "House exterior (siding)", price: "$0.20/sq ft", note: "$175 minimum" },
      { label: "Driveway", price: "$0.18/sq ft", note: "$100 minimum" },
      { label: "Deck / patio", price: "$0.20/sq ft", note: "$120 minimum" },
      { label: "Bundle: driveway + walkway", price: "15% off", note: "Combined total" },
    ],
    crossSell: "Bundle power washing with window cleaning for an additional 15% off both services.",
  },
  window: {
    headline: "Window Cleaning",
    subhead: "Streak-free windows inside and out — residential and commercial. Hard water treatment available.",
    img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=900&h=500&fit=crop&auto=format",
    alt: "Clean sparkling windows",
    includes: [
      "Interior and exterior pane cleaning",
      "Screen & track cleaning add-on",
      "Hard water & mineral deposit removal",
      "Commercial storefront glass",
      "High-rise / ladder work available",
      "Spotless streak-free finish guaranteed",
    ],
    pricing: [
      { label: "Standard window, in & out", price: "$10/window", note: "$150 minimum" },
      { label: "Screens / tracks add-on", price: "+$3/window" },
      { label: "Hard water / mineral removal", price: "+$15/window" },
      { label: "Commercial storefront", price: "$1.25/sq ft" },
    ],
    crossSell: "Pair with power washing for a complete exterior refresh — bundled discount applied automatically.",
  },
};

export default function Cleaning() {
  const [active, setActive] = useState<ServiceKey>("residential");
  const s = services[active];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=700&fit=crop&auto=format"
            alt="Cleaning team at work"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Lunova Services</span>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-6xl md:text-8xl font-bold text-foreground uppercase leading-tight mt-2 mb-4"
          >
            Cleaning<br />Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mb-8">
            Six services under one roof — from deep house cleans to auto detailing and power washing. Book one or bundle for 10% off.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:+1${PHONE}`}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:bg-primary/90 transition-colors"
            >
              <Phone size={18} /> {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground rounded-lg font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              Get a Free Quote <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Service Tab Bar */}
      <div className="sticky top-16 z-40 bg-[#070f1f]/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {serviceNav.map((n) => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  active === n.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Service Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: info */}
          <div>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl md:text-5xl font-bold text-foreground uppercase mb-3"
            >
              {s.headline}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{s.subhead}</p>

            <div className="rounded-xl overflow-hidden h-56 bg-secondary mb-8">
              <img
                src={s.img}
                alt={s.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3">
              {s.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <CheckCircle size={17} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {s.crossSell && (
              <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
                <p className="text-primary text-sm font-medium">💡 {s.crossSell}</p>
              </div>
            )}
          </div>

          {/* Right: pricing */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-bold text-foreground uppercase mb-6"
            >
              Pricing
            </h3>
            <div className="space-y-1 mb-6">
              {s.pricing.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between py-3.5 border-b border-border last:border-0 gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-foreground font-medium text-sm">{p.label}</p>
                    {p.note && <p className="text-muted-foreground text-xs mt-0.5">{p.note}</p>}
                  </div>
                  <p
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-bold text-primary shrink-0"
                  >
                    {p.price}
                  </p>
                </div>
              ))}
            </div>
            {s.pricingNote && (
              <p className="text-muted-foreground text-xs mb-6 leading-relaxed">{s.pricingNote}</p>
            )}

            <div className="space-y-3">
              <a
                href={`tel:+1${PHONE}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                <Phone size={16} /> Call {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:+1${PHONE}`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-border text-foreground rounded-lg font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                Text for a Quote
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-border text-foreground rounded-lg font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Overview Strip */}
      <section className="bg-secondary py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-bold text-foreground uppercase mb-8 text-center"
          >
            All Cleaning Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {serviceNav.map((n) => (
              <button
                key={n.key}
                onClick={() => {
                  setActive(n.key);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors ${
                  active === n.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Bundle &amp; Save</span>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-4xl md:text-5xl font-bold text-foreground uppercase mt-2 mb-4"
        >
          Book 2+ Services — Save 10%
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Cleaning + bin cleaning, power washing + window cleaning, or any combo you need. One call covers it all.
        </p>
        <a
          href={`tel:+1${PHONE}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          <Phone size={20} /> {PHONE_DISPLAY}
        </a>
      </section>

      {/* Other Service Areas */}
      <section className="bg-secondary py-10 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">Also need junk removal or yard work?</p>
          <div className="flex gap-3">
            <Link
              to="/junk-removal"
              className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
            >
              Junk Removal →
            </Link>
            <Link
              to="/landscaping"
              className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
            >
              Landscaping →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        heading="Let's Get You Booked"
        subtext="Call, text, or email — we respond fast and can often schedule same-week."
      />
    </div>
  );
}
