import { Phone, ArrowUpRight, ShieldCheck, ThumbsUp, CalendarClock, MapPin, Check } from "lucide-react";
import { Link } from "react-router";
import ContactStrip from "../components/common/ContactStrip";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FadeInSection from "../components/common/FadeInSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSection from "../components/FaqSection";
import HowItWorks from "../components/HowItWorks";
import ProofStrip from "../components/ProofStrip";
import ZipCheck from "../components/common/ZipCheck";
import Seo from "../components/common/Seo";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { BRAND } from "../constants/brand";
import { GUARANTEE } from "../constants/proof";
import { SERVICES, startingAtLabel, cheapestSubservice, formatPrice, bookPath } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { HIGH_FETCH_PRIORITY } from "../utils/dom";
import {
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "../utils/structuredData";
import Marquee from "../components/Marquee";
import { withAlpha } from "../utils/color";
import { trackCall } from "../utils/analytics";

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

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "Cleaning Services", "Junk Removal", "Landscaping", "Licensed & Insured", "Same-Week Slots", "100% Satisfaction", "Locally Owned", "Kansas City Metro",
];

const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Check your ZIP", desc: "One field tells you if we run routes on your street." },
  { step: "2", title: "Tell us what you need", desc: "Pick a service and the details, one-time or recurring." },
  { step: "3", title: "We confirm a time", desc: "Our team calls to lock in a date and time that works for you." },
  { step: "4", title: "We show up & handle it", desc: "Licensed, insured and local. You cross it off the list." },
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
    a: "Yes. Cleaning, bin sanitation, and landscaping are all available on weekly, bi-weekly, or monthly recurring plans, and recurring customers get priority scheduling plus bundle pricing.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the greater Kansas City metro, including Overland Park, Olathe, Shawnee, Lenexa, Leawood, Prairie Village, Lee's Summit, Independence, Blue Springs, and Raytown. Enter your ZIP in the checker above, and if we're not on your street yet we'll tell you straight away.",
  },
  {
    q: "How do I get a quote for commercial cleaning?",
    a: "Book online and select Commercial Cleaning, or give us a call. We'll ask a few quick questions about your space and get you a custom quote, usually same day.",
  },
  {
    q: "What if I need to reschedule?",
    a: "No problem. Text or call us at least 24 hours ahead and we'll move your appointment to a new time that works. No fees for standard reschedules.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Lunova Services | Kansas City Cleaning, Landscaping & More"
        description="Lunova Services offers professional cleaning, power washing, junk removal, landscaping, auto detailing, and more across Kansas City."
        jsonLd={[
          buildLocalBusinessSchema(),
          buildOrganizationSchema(),
          buildWebSiteSchema(),
          buildFaqSchema(FAQS),
        ]}
      />
      <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
        {/*
          HERO — split layout, image right, single-input coverage check left.
          Replaces a centred text-only hero whose two buttons sent cold traffic
          straight into a five-step wizard. The ZIP field is the researched
          pattern (LawnStarter's hero-as-form, Homeaglow's single ZIP + price
          headline) and it qualifies the visitor before they invest any effort.
        */}
        <section className="relative pt-[5.5rem] pb-10 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: BG }}>
          <div className="max-w-3xl mx-auto">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
                style={{ backgroundColor: withAlpha(ACCENT, 0.07), color: ACCENT, borderColor: withAlpha(ACCENT, 0.19) }}
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

              {/*
                The company name is in this sentence on purpose.

                Above the fold, the only thing that said who this is was the
                logo — an image, which is not text a search engine can match a
                brand query against. Someone searching "Lunova Services Kansas
                City" is the highest-intent visitor this site gets: they have
                already decided, and are looking for a phone number. Naming the
                business in the opening line, next to the metro it works in, is
                the cheapest possible signal that this page is the answer.
              */}
              <p className="text-base sm:text-lg max-w-xl mb-7 leading-relaxed" style={{ color: withAlpha(BRAND.ink, 0.69) }}>
                Lunova Services is one local crew for eight home jobs, on both sides of the state
                line in Kansas City. Check your ZIP and book a same-week slot in about two minutes.
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
                  onClick={() => trackCall("home_hero")}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: withAlpha(BRAND.ink, 0.6) }}
                >
                  <Phone size={14} style={{ color: ACCENT }} />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

          </div>
        </section>

        {/*
          The three services the headline names, in the order it names them:
          clean, cut, haul. Full bleed and uncovered.

          It used to be one portrait crop of a cleaner in the right-hand column,
          which showed a third of the business and squeezed the ZIP field into
          half the width on desktop. A single wide band shows all three trades,
          gives the copy the full column back, and needs no scrim because
          nothing sits on top of it.
        */}
        <figure className="relative w-full overflow-hidden m-0" style={{ backgroundColor: BRAND.raised }}>
          <picture>
            <source
              type="image/avif"
              sizes="100vw"
              srcSet="/images/hero/lunova-services-hero-640.avif 640w, /images/hero/lunova-services-hero-1280.avif 1280w"
            />
            <source
              type="image/webp"
              sizes="100vw"
              srcSet="/images/hero/lunova-services-hero-640.webp 640w, /images/hero/lunova-services-hero-1280.webp 1280w"
            />
            <img
              src="/images/hero/lunova-services-hero-1280.jpg"
              alt="Three sides of the business, side by side: a cleaner wiping down interior window glass, a freshly mown back lawn, and a cleared household load stacked ready for hauling"
              className="block w-full object-cover h-[42vw] min-h-[190px] max-h-[460px]"
              width={2400}
              height={864}
              loading="eager"
              decoding="async"
              {...HIGH_FETCH_PRIORITY}
            />
          </picture>
          <figcaption
            className="absolute inset-x-0 bottom-0 px-4 sm:px-6 py-4"
            style={{ background: `linear-gradient(to top, ${withAlpha(PRIMARY, 0.85)}, transparent)` }}
          >
            <div className="max-w-7xl mx-auto">
              <p className="text-xs font-semibold text-white/95">{GUARANTEE.name}</p>
              <p className="text-[11px] mt-0.5 text-white/70">{GUARANTEE.short} on every job.</p>
            </div>
          </figcaption>
        </figure>

        <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={"#ffffff"} />

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
              <p className="text-sm" style={{ color: withAlpha(BRAND.ink, 0.6) }}>
                Book two or more and 10% comes off the combined total.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((svc, idx) => {
                const Icon = svc.icon;
                const iconBg = idx % 2 === 0 ? withAlpha(ACCENT, 0.1) : withAlpha(ACCENT_2, 0.1);
                const iconColor = idx % 2 === 0 ? ACCENT : ACCENT_2;
                return (
                  <div
                    key={svc.id}
                    className="relative bg-card rounded-3xl p-6 flex flex-col"
                    style={{ border: `1px solid ${svc.popular ? withAlpha(ACCENT, 0.333) : withAlpha(PRIMARY, 0.08)}` }}
                  >
                    {svc.popular && (
                      <span
                        className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: withAlpha(ACCENT, 0.082), color: ACCENT }}
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
                        <li key={b} className="flex items-center gap-2 text-xs" style={{ color: withAlpha(BRAND.ink, 0.6) }}>
                          <Check size={12} style={{ color: iconColor, flexShrink: 0 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between gap-2 pt-4" style={{ borderTop: `1px solid ${withAlpha(PRIMARY, 0.07)}` }}>
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
                        to={bookPath(svc.id)}
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
          <FadeInSection className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
              <span>Why Lunova</span>
              <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl mb-8 leading-tight" style={{ color: PRIMARY }}>
              One crew you can call for everything.
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {WHY_LUNOVA.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: withAlpha(ACCENT, 0.082), color: ACCENT }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: PRIMARY }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: withAlpha(BRAND.ink, 0.6) }}>{desc}</p>
                  </div>
                </div>
              ))}
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
          subtext="Book online in under two minutes. We'll confirm by phone."
          primaryColor={BRAND.raised}
          accentColor={ACCENT_2}
          ctaLabel="Book Online"
          ctaTo="/book"
        />
      </div>
    </>
  );
}
