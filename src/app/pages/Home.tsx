import { Phone, ArrowUpRight, ShieldCheck, ThumbsUp, CalendarClock, MapPin, Check } from "lucide-react";
import { Link } from "react-router";
import ContactStrip from "../components/common/ContactStrip";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FadeInSection from "../components/common/FadeInSection";
import PhotoGallery from "../components/common/PhotoGallery";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSection from "../components/FaqSection";
import HowItWorks from "../components/HowItWorks";
import ProofStrip from "../components/ProofStrip";
import ZipCheck from "../components/common/ZipCheck";
import Seo from "../components/common/Seo";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { BRAND } from "../constants/brand";
import { GUARANTEE } from "../constants/proof";
import { SERVICES, startingAtLabel, cheapestSubservice, formatPrice } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { HIGH_FETCH_PRIORITY } from "../utils/dom";
import { buildFaqSchema, buildLocalBusinessSchema, buildOrganizationSchema } from "../utils/structuredData";

// Local aliases matching this page's existing naming: PRIMARY is the ink used
// for type, ACCENT is the sage brand colour. Values come from the global
// palette — this page no longer defines a theme of its own.
const PRIMARY = BRAND.ink;
const ACCENT = BRAND.primary;
const ACCENT_2 = BRAND.accent;
const BG = BRAND.bg;
const SURFACE = BRAND.surface;

/** The cheapest entry price across the whole catalogue, for the hero headline. */
const CHEAPEST = SERVICES.map(cheapestSubservice).reduce((min, sub) => {
  if (!sub?.from) return min;
  return !min?.from || sub.from < min.from ? sub : min;
}, undefined as ReturnType<typeof cheapestSubservice>);

const MARQUEE_ITEMS = [
  "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
  "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
];

const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Check your ZIP", desc: "One field tells you if we run routes on your street." },
  { step: "2", title: "Tell us what you need", desc: "Pick a service and the details — one-time or recurring." },
  { step: "3", title: "We confirm a time", desc: "Our team calls to lock in a date and time that works for you." },
  { step: "4", title: "We show up & handle it", desc: "Licensed, insured and local — you cross it off the list." },
];

const WHY_LUNOVA = [
  { icon: ShieldCheck, title: "Licensed & insured", desc: "Every job, every crew member, covered." },
  { icon: ThumbsUp, title: GUARANTEE.short, desc: GUARANTEE.terms },
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
    a: "We serve the greater Kansas City metro, including Overland Park, Olathe, Shawnee, Lenexa, Leawood, Prairie Village, Lee's Summit, Independence, Blue Springs, and Raytown. Enter your ZIP in the checker above — if we're not on your street yet we'll tell you straight away.",
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

/**
 * Illustrative photography, NOT Lunova's completed work.
 *
 * This section was previously headed "Recent Work — See the Lunova difference"
 * over six Unsplash stock photos. A customer who reverse-image-searches one of
 * these loses trust in every other claim on the page, which also throws away
 * the credit earned by refusing to publish fake testimonials. The heading and
 * the caption below now say what these actually are. Replace with real job
 * photos and then — and only then — relabel the section.
 */
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop&auto=format", alt: "A deep-cleaned modern kitchen, illustrating the standard we work to" },
  { src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7b85?w=600&h=600&fit=crop&auto=format", alt: "A freshly power washed driveway" },
  { src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&h=600&fit=crop&auto=format", alt: "A manicured lawn and tidy landscaping beds" },
  { src: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop&auto=format", alt: "Streak-free glass after a window clean" },
  { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop&auto=format", alt: "A crew loading debris for junk removal" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&auto=format", alt: "A clean patio and deck after pressure washing" },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Lunova Services | Kansas City Cleaning, Landscaping & More"
        description="Lunova Services provides professional cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services across Kansas City."
        jsonLd={[buildLocalBusinessSchema(), buildOrganizationSchema(), buildFaqSchema(FAQS)]}
      />
      <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
        {/*
          HERO — split layout, image right, single-input coverage check left.
          Replaces a centred text-only hero whose two buttons sent cold traffic
          straight into a five-step wizard. The ZIP field is the researched
          pattern (LawnStarter's hero-as-form, Homeaglow's single ZIP + price
          headline) and it qualifies the visitor before they invest any effort.
        */}
        <section className="relative pt-[5.5rem] pb-12 lg:pb-20 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: BG }}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
                style={{ backgroundColor: `${ACCENT}12`, color: ACCENT, borderColor: `${ACCENT}30` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                <span>Serving the Kansas City Metro</span>
              </div>

              <h1
                className="font-serif-display text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-normal leading-[1.02] mb-5 tracking-tight"
                style={{ color: PRIMARY }}
              >
                Clean. Cut. Haul.
                <br />
                <span style={{ color: ACCENT }}>
                  {CHEAPEST?.from ? `From ${formatPrice(CHEAPEST)}.` : "One call."}
                </span>
              </h1>

              <p className="text-base sm:text-lg max-w-xl mb-7 leading-relaxed" style={{ color: `${BRAND.ink}b0` }}>
                Eight home services, one local crew, one number to call. Check your ZIP and book a
                same-week slot in about two minutes.
              </p>

              <ZipCheck variant="section" className="max-w-xl mb-6" />

              <ProofStrip variant="light" className="mb-6" />

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  style={{ color: PRIMARY }}
                  onMouseEnter={() => preloadRoute("/book")}
                  onFocus={() => preloadRoute("/book")}
                >
                  Or browse services and book directly
                  <ArrowUpRight size={15} style={{ color: ACCENT }} />
                </Link>
                <a
                  href={`tel:+1${PHONE}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: `${BRAND.ink}99` }}
                >
                  <Phone size={14} style={{ color: ACCENT }} />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            {/* The homepage previously had no hero image at all, while every
                service page had a full-bleed one. Same responsive variants. */}
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-xl aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] order-first lg:order-last">
              <picture>
                <source
                  type="image/avif"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  srcSet="/images/hero/cleaning-hero-640.avif 640w, /images/hero/cleaning-hero-1280.avif 1280w"
                />
                <source
                  type="image/webp"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  srcSet="/images/hero/cleaning-hero-640.webp 640w, /images/hero/cleaning-hero-1280.webp 1280w"
                />
                <img
                  src="/images/hero/cleaning-hero-1280.jpg"
                  alt="A Lunova crew member cleaning a Kansas City home"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  {...HIGH_FETCH_PRIORITY}
                />
              </picture>
              <div
                className="absolute inset-x-0 bottom-0 p-5"
                style={{ background: `linear-gradient(to top, ${PRIMARY}e6, transparent)` }}
              >
                <p className="text-xs font-semibold text-white/95">{GUARANTEE.name}</p>
                <p className="text-[11px] mt-0.5 text-white/70">{GUARANTEE.short} — on every job.</p>
              </div>
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

        {/* SERVICES — cards and prices both come from the shared catalogue. */}
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
              <p className="text-sm" style={{ color: `${BRAND.ink}99` }}>
                Book two or more and 10% comes off the combined total.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((svc, idx) => {
                const Icon = svc.icon;
                const iconBg = idx % 2 === 0 ? `${ACCENT}1a` : `${ACCENT_2}1a`;
                const iconColor = idx % 2 === 0 ? ACCENT : ACCENT_2;
                return (
                  <div
                    key={svc.id}
                    className="relative bg-card rounded-3xl p-6 flex flex-col"
                    style={{ border: `1px solid ${svc.popular ? `${ACCENT}55` : `${PRIMARY}14`}` }}
                  >
                    {svc.popular && (
                      <span
                        className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                      >
                        Most booked
                      </span>
                    )}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: iconBg, color: iconColor }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif-display text-xl mb-1" style={{ color: PRIMARY }}>
                      {svc.name}
                    </h3>
                    <p className="text-xs font-bold mb-4" style={{ color: ACCENT }}>
                      {startingAtLabel(svc)}
                    </p>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {svc.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs" style={{ color: `${BRAND.ink}99` }}>
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
                        to={`/book?service=${svc.id}`}
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

        {/* HOW IT WORKS — shared component, was hand-rolled inline here. */}
        <FadeInSection>
          <HowItWorks
            heading="Booking takes two minutes."
            steps={HOW_IT_WORKS_STEPS}
            primaryColor={BRAND.raised}
            accentColor={ACCENT_2}
          />
        </FadeInSection>

        {/* WHY LUNOVA */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-[var(--card)] order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=1125&fit=crop&auto=format"
                alt="Lunova professional crew"
                width={900}
                height={1125}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
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
                      <p className="text-xs leading-relaxed" style={{ color: `${BRAND.ink}99` }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Wave transition */}
        <div style={{ backgroundColor: BG, lineHeight: 0, marginTop: "-1px" }}>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: "50px" }} aria-hidden="true">
            <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={SURFACE} />
          </svg>
        </div>

        {/* SERVICE AREA — now carries its own ZIP checker. */}
        <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={SURFACE} />

        {/* ILLUSTRATIVE GALLERY — see the note on GALLERY_IMAGES above. */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>The Standard</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl mb-3" style={{ color: PRIMARY }}>
                What "done" looks like.
              </h2>
              <p className="text-sm" style={{ color: `${BRAND.ink}99` }}>
                Reference photography showing the finish we work to. We're new here — our own job
                photos go up as we complete them.
              </p>
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

        {/* FAQ — shared component, was a duplicate <details> implementation. */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-3xl mx-auto">
            <FaqSection items={FAQS} title="Frequently asked." subtitle="Questions" />
          </FadeInSection>
        </section>

        {/* CONTACT STRIP */}
        <ContactStrip
          heading="Ready to check something off your list?"
          subtext="Book online in under two minutes — we'll confirm by phone."
          primaryColor={BRAND.raised}
          accentColor={ACCENT_2}
          ctaLabel="Book Online"
          ctaTo="/book"
        />
      </div>
    </>
  );
}
