import { Link } from "react-router";
import { Phone, Star, CheckCircle, ArrowRight, Sparkles, Truck, Leaf } from "lucide-react";
import CTABanner from "../components/CTABanner";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

const services = [
  {
    icon: <Sparkles size={28} className="text-primary" />,
    title: "Cleaning Services",
    desc: "Residential, commercial, bin cleaning, auto detailing, power washing & window cleaning — all under one roof.",
    to: "/cleaning",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: <Truck size={28} className="text-primary" />,
    title: "Junk Removal",
    desc: "Same-day haul-away of furniture, appliances, construction debris — no job too big.",
    to: "/junk-removal",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: <Leaf size={28} className="text-primary" />,
    title: "Landscaping",
    desc: "Lawn care, trimming, planting, and seasonal clean-ups to keep your yard pristine.",
    to: "/landscaping",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format",
  },
];

const stats = [
  { value: "500+", label: "Jobs Completed" },
  { value: "5.0★", label: "Average Rating" },
  { value: "98%", label: "Repeat Customers" },
  { value: "6yr", label: "In Business" },
];

const testimonials = [
  {
    name: "Maria T.",
    location: "Homeowner, Kansas City",
    text: "Lunova did an incredible deep clean before our house listing. The place has never looked better. Highly recommend!",
    stars: 5,
  },
  {
    name: "James R.",
    location: "Property Manager",
    text: "Used them for junk removal after a tenant moved out. On time, fast, and no damage. Will use every time.",
    stars: 5,
  },
  {
    name: "Sandra K.",
    location: "Homeowner, Overland Park",
    text: "The landscaping crew transformed our overgrown backyard into something we are actually proud of. Outstanding work.",
    stars: 5,
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&auto=format"
            alt="Cleaning professional at work"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-6">
              <span className="w-8 h-px bg-primary" />
              Kansas City Metro
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-6xl sm:text-7xl md:text-8xl font-bold text-foreground leading-tight uppercase mb-6"
            >
              Your Home,
              <span className="text-primary block">Perfectly</span>
              Maintained.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
              Cleaning, junk removal, and landscaping from one reliable team. Licensed, insured, and ready today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:+1${PHONE}`}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors"
              >
                <Phone size={20} />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground rounded-lg font-semibold text-lg hover:border-primary/50 hover:text-primary transition-colors"
              >
                Get a Free Quote
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-4">
              <p style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">What We Do</span>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-5xl md:text-6xl font-bold text-foreground mt-2 uppercase">
            Three Services. One Team.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors">
              <div className="h-52 overflow-hidden bg-secondary">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="mb-3">{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Lunova */}
      <section className="bg-secondary py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-5xl md:text-6xl font-bold text-foreground mt-2 uppercase leading-tight mb-6">
              Built on Trust &amp; Results
            </h2>
            <ul className="space-y-4">
              {[
                "Licensed, bonded & fully insured",
                "Same-day and next-day appointments",
                "Flat-rate pricing — no hidden fees",
                "Background-checked, trained professionals",
                "Eco-friendly cleaning products available",
                "Satisfaction guaranteed on every job",
                "Only company in KC offering all services under one roof",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-xl overflow-hidden h-80 md:h-96 bg-muted">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format"
              alt="Professional cleaning service"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground rounded-lg px-4 py-3">
              <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold">100%</p>
              <p className="text-xs font-medium">Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Reviews</span>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-5xl md:text-6xl font-bold text-foreground mt-2 uppercase">
            Our Customers Agree
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <p className="text-foreground font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
