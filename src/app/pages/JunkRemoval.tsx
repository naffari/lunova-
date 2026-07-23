import {
  ShieldCheck,
  Truck,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import { Link } from "react-router";
import ServiceHero from "../components/ServiceHero";
import HowItWorks from "../components/HowItWorks";
import ServiceAreaSection from "../components/ServiceAreaSection";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";

const PRIMARY = "#0d382c";
const ACCENT = "#f5b82e";
const BG = "#F1EBD9";

const PACKAGES = [
  { title: "Minimum / Single Item", price: "$99", desc: "Single small item or minimum trip fee. Great for one piece of furniture or appliance." },
  { title: "1/4 Load", price: "$175", desc: "A truck-bed quarter load. Ideal for a few large items or a small room's worth of clutter." },
  { title: "1/2 Load", price: "$299", desc: "Half a truckload — perfect for bedroom sets, office furniture, or moderate cleanouts." },
  { title: "3/4 Load", price: "$425", desc: "Three-quarter load for significant estate items, garage cleanouts, or multi-room jobs." },
  { title: "Full Truckload", price: "$550", desc: "Maximum haul — full estate cleanouts, construction debris, or commercial jobs." },
  { title: "Same-Day Rush", price: "+$75", desc: "Emergency same-day scheduling fee. Subject to availability — call to confirm." },
];

const FEATURES = [
  {
    icon: Truck,
    title: "All-In-One Haul & Sweep",
    desc: "Our team hauls away all junk AND sweeps or blows the area before packing up — leaving your space cleaner than we found it.",
  },
  {
    icon: ShieldCheck,
    title: "Eco-Responsible Disposal",
    desc: "We sort and donate usable items, recycle electronics and metals, and minimize landfill waste on every job.",
  },
  {
    icon: Calendar,
    title: "Same-Day & Next-Day Service",
    desc: "Book online or call. We confirm via text and show up on time with a two-man crew ready to lift anything.",
  },
  {
    icon: Star,
    title: "5.0-Star Rated Service",
    desc: "Hundreds of satisfied KC customers — from single-item pickups to full estate cleanouts. See for yourself.",
  },
];

const STATS = [
  { val: "From $99", label: "Starting Price" },
  { val: "Same-Day", label: "Service" },
  { val: "Eco-Friendly", label: "Disposal" },
  { val: "Licensed", label: "& Insured" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Photo or Call Estimate",
    desc: "Send us a photo or describe your items over the phone — we'll give you a firm price in minutes.",
  },
  {
    step: "2",
    title: "Confirm & Schedule",
    desc: "Pick a time that works for you — even same-day. We'll confirm via text.",
  },
  {
    step: "3",
    title: "Crew Arrives & Hauls",
    desc: "Our two-man crew handles all lifting, carrying, and loading with zero damage to your property.",
  },
  {
    step: "4",
    title: "Sweep & Sign Off",
    desc: "We sweep the area, confirm you're satisfied, and process payment on the spot.",
  },
];

export default function JunkRemoval() {
  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BG, color: PRIMARY }}>
      <ServiceHero
        badge="KC's #1 Junk Removal & Hauling Service"
        titleContent={<>We Haul So <br />You <span className="italic" style={{ color: ACCENT }}>Don't</span> Have To.</>}
        description="Furniture, appliances, construction debris, and full estate cleanouts — our crew shows up fast, lifts everything, and leaves your space spotless."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        bgColor={BG}
        ctaLabel="Book a Haul"
        ctaTo="/book?service=junk"
        trustItems={["Licensed & Insured", "Same-Day Service", "Eco-Friendly Recycling"]}
        heroImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=1000&fit=crop&auto=format"
        heroImageAlt="Junk removal truck and crew"
        badgeLabel="Lunova Hauling & Junk Removal"
        badgeSubLabel="Fast & Reliable Crew"
      />

      {/* MARQUEE STRIP */}
      <div style={{ backgroundColor: ACCENT, overflow: 'hidden' }} className="py-3">
        <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[
            "Single-Item Pickup", "Full Truckload", "Same-Day Service", "Eco-Friendly Recycling", "Estate Cleanouts", "Licensed & Insured", "Free Estimates", "Satisfaction Guarantee",
            "Single-Item Pickup", "Full Truckload", "Same-Day Service", "Eco-Friendly Recycling", "Estate Cleanouts", "Licensed & Insured", "Free Estimates", "Satisfaction Guarantee",
          ].map((item, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICE PACKAGES */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: `${PRIMARY}07`, borderTop: `1px solid ${PRIMARY}12`, borderBottom: `1px solid ${PRIMARY}12` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              <span className="w-6 h-0.5" style={{ backgroundColor: PRIMARY }} />
              <span>Rates &amp; Pricing</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl" style={{ color: PRIMARY }}>
              Transparent Junk Removal Rates
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
                  to="/book?service=junk"
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
              A Reputation Built on Muscle, Speed, and Integrity.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4" style={{ border: `1px solid ${PRIMARY}12` }}>
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
        heading="Our Proven Junk Removal Process"
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
              { q: "What items can you remove?", a: "We haul almost everything — furniture, appliances, yard waste, construction debris, electronics, and more. We cannot take hazardous materials." },
              { q: "Do I need to move items to the curb?", a: "No. Our crew does all the heavy lifting, including items inside your home, garage, or basement." },
              { q: "How is pricing determined?", a: "Pricing is based on volume (how much space your items take up in the truck). Get an instant estimate on our quote page." },
              { q: "How quickly can you come?", a: "We offer same-day and next-day appointments in most areas. Call or book online to check availability." },
            ]}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
      </section>

      <ContactStrip
        heading="Ready to Clear the Clutter?"
        subtext="Get a free instant estimate and same-day hauling — our crew handles the heavy lifting so you don't have to."
        primaryColor={PRIMARY}
        accentColor={ACCENT}
        ctaLabel="Book a Haul"
        ctaTo="/book?service=junk"
      />

    </div>
  );
}
