import { CheckCircle, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import CTABanner from "../components/CTABanner";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

const includes = [
  "Furniture removal (sofas, beds, dressers)",
  "Appliance haul-away (fridges, washers, dryers)",
  "Construction & renovation debris",
  "Yard waste & brush removal",
  "Estate clean-outs",
  "Office & commercial junk",
  "Hot tub & swing set removal",
  "Same-day service available",
];

const loadPricing = [
  { label: "Minimum / single item", price: "$99" },
  { label: "1/4 load", price: "$175" },
  { label: "1/2 load", price: "$299" },
  { label: "3/4 load", price: "$425" },
  { label: "Full load", price: "$550" },
];

const flatRateItems = [
  { label: "Couch / sofa", price: "$110" },
  { label: "Mattress", price: "$95" },
  { label: "Refrigerator / large appliance", price: "$140" },
  { label: "Washer / dryer (each)", price: "$110" },
  { label: "Hot tub", price: "$400" },
  { label: "TV", price: "$65" },
];

const addOns = [
  "Heavy item requiring 3+ people (piano, safe, gun cabinet): +$50–100",
  "Same-day / rush service: +$30 flat or 15% premium",
  "Stairs / long carry (2+ flights or 75 ft+): +$25–50",
];

const gallery = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7b85?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&h=400&fit=crop&auto=format",
];

export default function JunkRemoval() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=700&fit=crop&auto=format"
            alt="Junk removal truck and workers"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Lunova Services</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-6xl md:text-8xl font-bold text-foreground uppercase leading-tight mt-2 mb-4">
            Junk<br />Removal
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            We haul it all away — fast, affordable, no mess left behind. Same-day slots available in Kansas City.
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
              Get a Quote <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* What We Take + Load Pricing */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">No Job Too Big</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase mt-2 mb-8">
              What We Remove
            </h2>
            <ul className="space-y-3 mb-8">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <CheckCircle size={17} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
              <p className="text-primary text-sm font-medium">💡 Just had a cleanout? Book a post-removal deep clean and save 10% on both services.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Load pricing */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mb-6">Load Pricing</h3>
              <div className="space-y-1">
                {loadPricing.map((p) => (
                  <div key={p.label} className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-4">
                    <p className="text-foreground font-medium text-sm">{p.label}</p>
                    <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-primary shrink-0">{p.price}</p>
                  </div>
                ))}
              </div>
              <a
                href={`tel:+1${PHONE}`}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                <Phone size={16} /> Schedule Pickup
              </a>
            </div>

            {/* Add-ons */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-foreground uppercase mb-4">Add-ons</h4>
              <ul className="space-y-2">
                {addOns.map((a) => (
                  <li key={a} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">+</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Flat Rate Items */}
      <section className="bg-secondary py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">No Guesswork</span>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mt-2 mb-8">Common Flat-Rate Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {flatRateItems.map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-primary mb-1">{item.price}</p>
                <p className="text-muted-foreground text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mb-6">Before &amp; After</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gallery.map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden h-52 bg-secondary">
              <img src={src} alt={`Junk removal job ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Other Services */}
      <section className="bg-secondary py-12 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">Also need cleaning or landscaping?</p>
          <div className="flex gap-3">
            <Link to="/cleaning" className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
              Cleaning →
            </Link>
            <Link to="/landscaping" className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
              Landscaping →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner heading="Clear the Clutter Today" subtext="Call or text for a free, no-obligation estimate. We show up on time and do the heavy lifting." />
    </div>
  );
}
