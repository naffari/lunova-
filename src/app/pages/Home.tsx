import {
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Star,
  Sparkles,
  Truck,
  Leaf,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import ContactStrip from "../components/common/ContactStrip";
import ServiceAreaSection from "../components/ServiceAreaSection";
import { PHONE, PHONE_DISPLAY, EMAIL } from "../constants/contact";

const PRIMARY = "#3C312A";
const ACCENT = "#c8960e";
const BG = "#F1EBD9";
const DARK = "#1a1410";

const SERVICES = [
  {
    icon: Sparkles,
    title: "Cleaning Services",
    desc: "Residential, commercial, bin cleaning, auto detailing, power washing & window cleaning — all under one roof.",
    price: "From $130",
    to: "/cleaning",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=450&fit=crop&auto=format",
    bullets: ["Recurring & deep cleans", "Move-in/out service", "Eco-friendly supplies"],
  },
  {
    icon: Truck,
    title: "Junk Removal",
    desc: "Same-day haul-away of furniture, appliances, construction debris — no job too big.",
    price: "From $99",
    to: "/junk-removal",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop&auto=format",
    bullets: ["Furniture & appliance haul-away", "Same-day service", "Eco-friendly recycling"],
  },
  {
    icon: Leaf,
    title: "Landscaping",
    desc: "Lawn care, trimming, planting, and seasonal clean-ups to keep your yard pristine.",
    price: "From $45",
    to: "/landscaping",
    img: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&h=450&fit=crop&auto=format",
    bullets: ["Mowing, trimming & mulch", "Seasonal cleanups", "Sod & planting"],
  },
];

const STATS = [
  { val: "From $99", label: "Starting Price" },
  { val: "Same-Day", label: "Availability" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Lunova Services | Kansas City Cleaning, Landscaping & More</title>
        <meta name="description" content="Lunova Services provides professional cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services across Kansas City." />
        <meta property="og:title" content="Lunova Services | Kansas City Cleaning, Landscaping & More" />
        <meta property="og:description" content="Professional home and business services across Kansas City. From cleaning to landscaping, we handle it all with licensed, insured professionals." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      {/* HERO */}
      <section className="relative pt-[4.5rem] pb-20 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_480px] gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
              style={{ backgroundColor: `${PRIMARY}12`, color: PRIMARY, borderColor: `${PRIMARY}28` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span>Kansas City's Full-Service Home Care Team</span>
            </div>

            <h1
              className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.08] mb-6 tracking-tight"
              style={{ color: PRIMARY }}
            >
              Your Home, <br />
              <span className="italic" style={{ color: ACCENT }}>Perfectly</span> Maintained.
            </h1>

            <p className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: `${PRIMARY}bb` }}>
              One call covers cleaning, junk removal, and landscaping. Licensed, insured, and available this week across Kansas City.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base transition-all shadow-md group"
                style={{ backgroundColor: ACCENT, color: PRIMARY }}
              >
                Book a Service
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  style={{ backgroundColor: PRIMARY, color: ACCENT }}
                >
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <a
                href={`tel:+1${PHONE}`}
                className="inline-flex items-center gap-2 font-semibold px-6 py-4 rounded-full text-sm transition-colors text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                <Phone size={16} style={{ color: ACCENT }} />
                Call {PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-10 pt-8 flex items-center gap-6 text-sm" style={{ borderTop: `1px solid ${PRIMARY}20` }}>
              <span className="font-semibold" style={{ color: PRIMARY }}>Licensed &amp; Insured</span>
              <span style={{ color: `${PRIMARY}40` }}>•</span>
              <span className="font-semibold" style={{ color: PRIMARY }}>Same-Week Appointments</span>
              <span style={{ color: `${PRIMARY}40` }}>•</span>
              <span className="font-semibold" style={{ color: PRIMARY }}>100% Satisfaction</span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -inset-4 rounded-[40px] rotate-2 opacity-40 z-0" style={{ backgroundColor: `${PRIMARY}20` }} />
            <div className="relative z-10 w-full max-w-md h-[460px] sm:h-[520px] rounded-[36px] overflow-hidden border-4 border-white shadow-2xl" style={{ backgroundColor: PRIMARY }}>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&auto=format"
                alt="Lunova home services team"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-6 left-6 right-6 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between"
                style={{ backgroundColor: `${PRIMARY}e6`, border: `1px solid ${ACCENT}50` }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>Lunova Quality</p>
                  <p className="font-serif-display text-xl text-white">KC's Most Trusted Team</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: ACCENT, color: PRIMARY }}>
                  ★ 5.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}08`, borderTop: `1px solid ${PRIMARY}15`, borderBottom: `1px solid ${PRIMARY}15` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
                <span>About Us</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl leading-tight" style={{ color: PRIMARY }}>
                Locally Owned. Three Services. <br />
                One Trusted Team.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed mb-4" style={{ color: `${PRIMARY}99` }}>
                Lunova was built to be Kansas City's most reliable home services partner — whether you need your home cleaned, your junk hauled, or your yard transformed.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
                style={{ backgroundColor: ACCENT, color: PRIMARY }}
              >
                See The Difference <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[440px] mb-12 shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=700&fit=crop&auto=format"
              alt="Lunova professional team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-end p-8" style={{ background: `linear-gradient(to top, ${PRIMARY}cc, transparent)` }}>
              <p className="font-serif-display text-2xl sm:text-3xl max-w-xl text-white">
                "Serving Kansas City homeowners &amp; property managers with top-tier cleaning, hauling &amp; landscaping."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl" style={{ border: `1px solid ${PRIMARY}18` }}>
                <p className="font-serif-display text-4xl sm:text-5xl font-bold" style={{ color: PRIMARY }}>{stat.val}</p>
                <p className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: `${PRIMARY}70` }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
            "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>What We Do</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Three Services. One Reliable Team.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm group" style={{ border: `1px solid ${PRIMARY}18` }}>
                  <div className="relative h-52 overflow-hidden" style={{ backgroundColor: PRIMARY }}>
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: ACCENT, color: PRIMARY }}>
                      {svc.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} style={{ color: ACCENT }} />
                      <h3 className="font-serif-display text-2xl" style={{ color: PRIMARY }}>{svc.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: `${PRIMARY}99` }}>{svc.desc}</p>
                    <ul className="space-y-1.5 mb-6 mt-auto">
                      {svc.bullets.map((b, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: `${PRIMARY}99` }}>
                          <Check size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={svc.to}
                      className="w-full py-2.5 text-xs font-bold rounded-xl text-center transition-colors block"
                      style={{ backgroundColor: BG, color: PRIMARY, border: `1px solid ${PRIMARY}28` }}
                    >
                      Explore {svc.title} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
              <span>How We Work</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-white">
              Built on Trust, Delivered With Pride.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { step: "1", title: "Free Estimate", desc: "We assess your needs online, by photo, or on-site and give you a transparent flat-rate quote." },
              { step: "2", title: "Scheduled Arrival", desc: "Pick a time that works for you — even same-day or next-day. We confirm via text." },
              { step: "3", title: "Expert Service", desc: "Our licensed, background-checked crew arrives on time with all equipment and supplies." },
              { step: "4", title: "Total Satisfaction", desc: "We do a final walkthrough together. Not happy? We make it right — guaranteed." },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl flex flex-col items-center text-center"
                style={{ backgroundColor: `${DARK}60`, border: `1px solid rgba(255,255,255,0.08)` }}
              >
                <div
                  className="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center mb-4 shadow-md"
                  style={{ backgroundColor: ACCENT, color: PRIMARY }}
                >
                  {s.step}
                </div>
                <h3 className="font-serif-display text-2xl text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-center pt-12" style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
            {[
              { icon: ShieldCheck, label: "Licensed, Bonded & Insured" },
              { icon: Star, label: "5.0 Star Average Rating" },
              { icon: Check, label: "100% Satisfaction Guarantee" },
            ].map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${ACCENT}25`, color: ACCENT }}
                >
                  <Icon size={22} />
                </div>
                <p className="font-semibold text-sm text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave transition */}
      <div style={{ backgroundColor: PRIMARY, lineHeight: 0, marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: '50px' }}>
          <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={BG} />
        </svg>
      </div>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

      {/* CONTACT STRIP */}
      <ContactStrip
        heading="Ready to Get Your Home Looking Its Best?"
        subtext="Book online or call us — same-week slots available across Kansas City."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Service"
        ctaTo="/book"
      />
    </div>
    </>
  );
}
