import {
  Star,
  ShieldCheck,
  Car,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../../components/ServiceHero";
import HowItWorks from "../../components/HowItWorks";
import ServiceAreaSection from "../../components/ServiceAreaSection";
import FaqSection from "../../components/FaqSection";
import ContactStrip from "../../components/common/ContactStrip";

const PRIMARY = "#14304A";
const ACCENT = "#E8A830";
const BG = "#F1EBD9";

const PACKAGES = [
  { title: "Exterior Wash & Dry", price: "From $50", desc: "Hand wash, dry, and wheel clean for a quick refresh between details." },
  { title: "Full Interior Detail", price: "From $95", desc: "Deep vacuum, steam, wipe-down of all surfaces, and odor elimination." },
  { title: "Exterior Detail", price: "From $120", desc: "Clay bar, polish, wax, and tire dressing for a showroom shine." },
  { title: "Full Detail Package", price: "From $180", desc: "Interior + exterior combined: our most popular complete detail." },
  { title: "Ceramic Coating", price: "From $350", desc: "3-year paint protection coating applied professionally at your location." },
  { title: "Headlight Restoration", price: "From $65", desc: "Oxidized headlights polished and sealed for improved clarity and safety." },
];

const FEATURES = [
  {
    icon: Car,
    title: "Fully Mobile — No Drop-Off Needed",
    desc: "We bring everything: water, generator, vacuum, and professional-grade products to your location.",
  },
  {
    icon: ShieldCheck,
    title: "Ceramic Coating & Paint Protection",
    desc: "Add a ceramic coating or paint sealant to protect your vehicle's finish from UV, swirls, and contaminants.",
  },
  {
    icon: Star,
    title: "5.0-Star Rated Crew",
    desc: "From daily drivers to luxury vehicles — our detail team treats every car like it's their own.",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    desc: "Home, office, or apartment complex — our mobile unit parks and works wherever you are in KC.",
  },
];

const STATS = [
  { val: "From $95", label: "Starting Price" },
  { val: "Mobile", label: "Service" },
  { val: "100%", label: "Satisfaction Guarantee" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Book & Describe Vehicle",
    desc: "Tell us your vehicle type and service level. We confirm a time at your home or office.",
  },
  {
    step: "2",
    title: "Crew Arrives Fully Equipped",
    desc: "Our team pulls up with everything needed — no hose hookup required from you.",
  },
  {
    step: "3",
    title: "Interior & Exterior Detail",
    desc: "We work systematically from roof to tires, inside and out, following a meticulous checklist.",
  },
  {
    step: "4",
    title: "Final Inspection & Shine",
    desc: "We walk around the vehicle with you and buff out any remaining spots before signing off.",
  },
];

export default function AutoDetailing() {
  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <ServiceHero
        badge="KC's Mobile Auto Detailing Service"
        titleContent={<>Your Car, <span className="italic" style={{ color: ACCENT }}>Detailed</span> <br />At Your Doorstep.</>}
        description="We bring professional-grade detailing directly to your home or office. From express washes to full paint protection — your vehicle deserves the best."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=auto-detailing"
        trustItems={["Mobile Service", "Ceramic Coating Available", "Interior Steam Clean"]}
        heroImage="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=1000&fit=crop&auto=format"
        heroImageAlt="Mobile Auto Detailing Professional"
        badgeLabel="Auto Detailing by Lunova"
        badgeSubLabel="Mobile Detailing Specialists"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Full Detail", "Ceramic Coating", "Interior Steam Clean", "Headlight Restoration", "Mobile Service", "Licensed & Insured", "Satisfaction Guarantee", "We Come to You",
            "Full Detail", "Ceramic Coating", "Interior Steam Clean", "Headlight Restoration", "Mobile Service", "Licensed & Insured", "Satisfaction Guarantee", "We Come to You",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICE PACKAGES */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}08`, borderTop: `1px solid ${PRIMARY}15`, borderBottom: `1px solid ${PRIMARY}15` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Services &amp; Rates</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Complete Auto Detailing Menu
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm" style={{ border: `1px solid ${PRIMARY}18` }}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif-display text-2xl" style={{ color: PRIMARY }}>{item.title}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-2" style={{ backgroundColor: ACCENT, color: PRIMARY }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: `${PRIMARY}99` }}>{item.desc}</p>
                </div>
                <Link
                  to="/book?service=auto-detailing"
                  className="w-full py-2.5 text-xs font-bold rounded-full text-center transition-colors block"
                  style={{ backgroundColor: PRIMARY, color: '#ffffff' }}
                >
                  Book This Service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Professional Detailing Without Leaving Your Driveway.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ border: `1px solid ${PRIMARY}15` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: PRIMARY }}>{f.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: `${PRIMARY}99` }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        heading="Our Proven Auto Detailing Process"
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

      {/* Wave transition */}
      <div style={{ backgroundColor: PRIMARY, lineHeight: 0, marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ height: '50px' }}>
          <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,0 1440,36 L1440,72 L0,72 Z" fill={BG} />
        </svg>
      </div>

      {/* SERVICE AREA */}
      <ServiceAreaSection primaryColor={PRIMARY} accentColor={ACCENT} bgColor={BG} />

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FaqSection
            items={[
              { q: "Do you come to my location?", a: "Yes — we are fully mobile. We come to your home, office, or wherever your vehicle is parked." },
              { q: "How long does a detail take?", a: "Standard details take 2–4 hours. Full interior/exterior details can take 4–6 hours depending on vehicle size and condition." },
              { q: "Do you need access to water and power?", a: "We carry our own water supply and power equipment. You don't need to provide anything." },
              { q: "What vehicles do you detail?", a: "Cars, trucks, SUVs, vans, and boats. Pricing varies by vehicle size." },
            ]}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready for a Showroom Shine?"
        subtext="Book your mobile detail today — we bring the water, power, and products straight to your driveway anywhere in the KC metro."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Clean"
        ctaTo="/book?service=auto-detailing"
      />

    </div>
  );
}
