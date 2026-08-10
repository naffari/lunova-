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
import { ACTIVE_SERVICES, BIN_ADDON, formatDollars, startingAtLabel, bookPath } from "../constants/services";
import { DEFAULT_OG_IMAGE_ALT, heroSize } from "../constants/seo";
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

/*
  NO PRICE IN THE HEADLINE — deliberately.

  This used to read "Clean. Cut. Haul. From $15/mo.", where $15 was computed as
  the cheapest row anywhere in the catalogue: the recurring trash-bin plan. So
  the three trades the headline names were being advertised at a price none of
  them charge — cleaning starts at $120, junk at $75, lawn care at $45 a visit.
  A visitor who reads "$15" and is quoted $120 has been misled by the first
  line on the site, and that is the most expensive place to lose trust.

  Real per-service floors are on the service cards a screen below, from the
  same catalogue, where each number sits next to the thing it actually buys.
*/

/**
 * The services shown in the hero price card.
 *
 * Reads the active catalogue rather than a hand-written id list, which is what
 * it did before — and that list named landscaping and junk removal, so the
 * first price a visitor saw was for work nobody could do.
 */
const HERO_PRICE_ROWS = ACTIVE_SERVICES;

/** Written once; Marquee doubles it for the seamless loop. */
const MARQUEE_ITEMS = [
  "House Cleaning", "Mobile Detailing", "Locally Owned", "Same-Week Slots", "Flat-Rate Quotes", "Nothing Charged At Booking", "Locally Owned", "Kansas City Metro",
];

const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Check your ZIP", desc: "One field tells you if we run routes on your street." },
  { step: "2", title: "Tell us what you need", desc: "Pick a service and the details, one-time or recurring." },
  { step: "3", title: "We confirm a time", desc: "Our team calls to lock in a date and time that works for you." },
  { step: "4", title: "We show up & handle it", desc: "Local crew, flat rate, confirmed before we start. You cross it off the list." },
];

const WHY_LUNOVA = [
  { icon: ShieldCheck, title: "The Done-Right Promise", desc: "Not happy? Tell us inside 24 hours and we come back and fix it free." },
  { icon: ThumbsUp, title: GUARANTEE.short, desc: GUARANTEE.terms },
  { icon: CalendarClock, title: "Flexible scheduling", desc: "One-time visits or recurring plans, on your calendar." },
  { icon: MapPin, title: "Local KC crew", desc: "Based here, on your street more than most." },
];

const FAQS = [
  {
    q: "Do you offer recurring cleaning plans?",
    a: "Yes. Cleaning runs weekly, bi-weekly or monthly, and recurring customers get the same crew, priority scheduling and a discount that comes off automatically in the booking flow. Detailing is booked as you need it — most people land on somewhere between twice and four times a year.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the greater Kansas City metro, including Overland Park, Olathe, Shawnee, Lenexa, Leawood, Prairie Village, Lee's Summit, Independence, Blue Springs, and Raytown. Enter your ZIP in the checker above, and if we're not on your street yet we'll tell you straight away.",
  },
  {
    q: "Can you clean the house and detail the car on the same visit?",
    a: `That is the point of booking both. The drive is already paid for, so the second job is cheaper to do — which is why 10% comes off the combined total. We can also wash and deodorise your bins while we're there for ${formatDollars(BIN_ADDON.price)}.`,
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
        title="Lunova Services | KC House Cleaning & Mobile Detailing"
        description="Lunova Services cleans homes and details cars across the Kansas City metro. Flat-rate quotes confirmed before we start, nothing charged at booking."
        jsonLd={[
          buildLocalBusinessSchema(),
          buildOrganizationSchema(),
          buildWebSiteSchema(),
          buildFaqSchema(FAQS),
        ]}
      />
      <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: BRAND.ink }}>
        {/*
          HERO — the same shape every other page uses.

          Copy on the chrome-toned ground, then the photograph full bleed
          underneath it, uncovered. This page used to open on the cream ground
          instead, which made the homepage the one page whose first screen did
          not look like the rest of the site, and forced the fixed navbar to
          carry a second colour scheme for that route alone.

          The ZIP field stays. It is the researched pattern (LawnStarter's
          hero-as-form, Homeaglow's single ZIP) and it qualifies the visitor
          before they invest any effort in a five-step wizard.
        */}
        <section className="pt-28 pb-12 px-4 sm:px-6" style={{ backgroundColor: BRAND.raised }}>
          {/*
            Two columns from lg up, one below.

            The copy used to sit in a max-w-3xl column centred in a full-width
            section, which on a 1440 screen left the entire right half of the
            first viewport empty — it read as a layout that had lost its second
            half rather than as deliberate space. The prices that belong next
            to this headline now live there instead.
          */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 lg:gap-16 items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: ACCENT_2 }}
              >
                <MapPin size={14} />
                <span>Serving the Kansas City Metro</span>
              </div>

              <h1
                className="font-serif-display text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-normal leading-[1.02] mb-5 tracking-tight"
                style={{ color: "#ffffff" }}
              >
                Clean home. Clean car.
                <br />
                <span style={{ color: ACCENT_2 }}>One call.</span>
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
              <p className="text-base sm:text-lg max-w-xl mb-7 leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                Lunova Services is one local crew for eight home jobs, on both sides of the state
                line in Kansas City. Check your ZIP and book a same-week slot in about two minutes.
              </p>

              <ZipCheck variant="hero" className="max-w-xl mb-6" />

              <ProofStrip variant="hero" className="mb-6" />

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  style={{ color: "#ffffff" }}
                  onMouseEnter={() => preloadRoute("/book")}
                  onFocus={() => preloadRoute("/book")}
                >
                  Or browse services and book directly
                  <ArrowUpRight size={15} style={{ color: ACCENT_2 }} />
                </Link>
                <a
                  href={`tel:+1${PHONE}`}
                  onClick={() => trackCall("home_hero")}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <Phone size={14} style={{ color: ACCENT_2 }} />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            {/*
              THE PRICE CARD — where the number cut from the headline went.

              Every figure is read from the catalogue, so it cannot drift from
              the service pages or the booking wizard, and each one sits next
              to the job it actually buys rather than being flattened into a
              single misleading "from" number. Hidden below lg, where the copy
              column is full width and the service cards are one scroll away.
            */}
            <aside
              className="hidden lg:block rounded-3xl p-6 border"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.16)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT_2 }}>
                What it costs to start
              </p>

              <ul className="space-y-3">
                {HERO_PRICE_ROWS.map((service) => (
                  <li key={service.id} className="flex items-baseline justify-between gap-4">
                    <Link
                      to={service.to}
                      className="text-sm font-semibold text-white hover:underline"
                      onMouseEnter={() => preloadRoute(service.to)}
                      onFocus={() => preloadRoute(service.to)}
                    >
                      {service.name}
                    </Link>
                    <span className="text-sm font-bold shrink-0" style={{ color: ACCENT_2 }}>
                      {startingAtLabel(service)}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className="mt-5 pt-4 text-xs leading-relaxed"
                style={{ borderTop: "1px solid rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.68)" }}
              >
                Flat rates, confirmed by phone before any work starts. Book two or more services
                and 10% comes off the combined total.
              </p>

              <p className="mt-3 text-xs font-semibold text-white">{GUARANTEE.short}.</p>
            </aside>
          </div>
        </section>

        {/*
          The three services the headline names, in the order it names them:
          clean, cut, haul.

          Full bleed and completely uncovered — no scrim, no caption laid over
          it. A gradient used to run along the bottom carrying the guarantee,
          which darkened the one panel of the photograph doing the most work.
          The guarantee moved to the strip below, where it is readable text
          rather than white type on a photo.
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
              alt={DEFAULT_OG_IMAGE_ALT}
              className="block w-full object-cover h-[42vw] min-h-[190px] max-h-[460px]"
              width={heroSize("lunova-services-hero").width}
              height={heroSize("lunova-services-hero").height}
              loading="eager"
              decoding="async"
              {...HIGH_FETCH_PRIORITY}
            />
          </picture>
        </figure>

        {/* The guarantee, off the photograph and onto its own ground. */}
        <div className="px-4 sm:px-6 py-4" style={{ backgroundColor: BRAND.raised }}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-xs font-semibold text-white">{GUARANTEE.name}</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              {GUARANTEE.short} on every job.
            </p>
          </div>
        </div>

        <Marquee items={MARQUEE_ITEMS} backgroundColor={ACCENT} textColor={"#ffffff"} />

        {/* SERVICES — cards and prices both come from the shared catalogue. */}
        <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
          <FadeInSection className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                <span className="w-6 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span>What We Do</span>
              </div>
              {/*
                This said "Eight services. One call." while the business could
                deliver two of them. Narrowing is easier to sell as a choice
                than to explain as a shortfall — and for a company nobody has
                heard of, doing two things properly is a better claim than doing
                eight things somehow.
              */}
              <h2 className="font-serif-display text-4xl sm:text-5xl mb-3" style={{ color: PRIMARY }}>
                Two services. Both done properly.
              </h2>
              <p className="text-sm" style={{ color: withAlpha(BRAND.ink, 0.6) }}>
                Book both and 10% comes off the combined total.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {ACTIVE_SERVICES.map((svc, idx) => {
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
