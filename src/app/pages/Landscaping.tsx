import { CheckCircle, Phone, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import CTABanner from "../components/CTABanner";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

const includes = [
  "Lawn mowing and edging",
  "Hedge and shrub trimming",
  "Garden bed weeding and mulching",
  "Seasonal planting & flower installation",
  "Leaf and yard debris removal",
  "Tree trimming and stump grinding",
  "Sod installation",
  "Irrigation system check and adjustment",
];

const gallery = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=400&fit=crop&auto=format",
];

export default function Landscaping() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=700&fit=crop&auto=format"
            alt="Beautiful landscaped garden"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Lunova Services</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-6xl md:text-8xl font-bold text-foreground uppercase leading-tight mt-2 mb-4">
            Land<br />scaping
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Lawn care, garden design, and seasonal clean-ups for Kansas City homes and businesses. A yard you are actually proud of.
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

      {/* Services + Pricing Coming Soon */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Full-Service Yard Care</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase mt-2 mb-8">
              What We Offer
            </h2>
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <CheckCircle size={17} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Coming Soon Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mb-3">Pricing</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Landscaping pricing varies by lot size, service type, and frequency. Kansas City mowing typically runs $35–65/visit — we price competitively and lock in your rate for the season.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <p className="text-muted-foreground text-sm">Lawn mowing (standard lot)</p>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-primary">$35–65</p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <p className="text-muted-foreground text-sm">Full seasonal package</p>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-primary">Custom</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-muted-foreground text-sm">One-time cleanup</p>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-primary">Custom</p>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mb-6">Full pricing sheet coming soon — call or text for a free on-site estimate.</p>
            <div className="space-y-3">
              <a
                href={`tel:+1${PHONE}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:+1${PHONE}`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-border text-foreground rounded-lg font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                <MessageSquare size={14} /> Text for a Free Estimate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mb-6">Our Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gallery.map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden h-52 bg-secondary">
              <img src={src} alt={`Landscaping project ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Other Services */}
      <section className="bg-secondary py-10 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">Need cleaning or junk removal too?</p>
          <div className="flex gap-3">
            <Link to="/cleaning" className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
              Cleaning →
            </Link>
            <Link to="/junk-removal" className="px-4 py-2 border border-border text-sm text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
              Junk Removal →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner heading="Transform Your Yard" subtext="Free estimates, flexible scheduling, and results that speak for themselves." />
    </div>
  );
}
