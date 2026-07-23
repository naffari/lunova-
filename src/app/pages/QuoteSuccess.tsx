import { Phone, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { Confetti } from "./quote/QuoteAtoms";

interface QuoteSuccessState {
  name?: string;
  range?: [number, number];
}

export default function QuoteSuccess() {
  const location = useLocation();
  const state = (location.state as QuoteSuccessState | null) ?? {};
  const { name, range } = state;

  return (
    <>
      <Helmet>
        <title>Quote Request Sent | Lunova Services</title>
        <meta name="description" content="Your quote request has been received. A Lunova representative will reach out within one business hour." />
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
        <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: '#2A2118', borderBottom: '1px solid rgba(241,235,217,0.1)' }}>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#c8960e', backgroundColor: 'rgba(200,150,14,0.12)', border: '1px solid rgba(200,150,14,0.25)' }}>
              Request Received
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)", color: '#F1EBD9' }}
              className="text-4xl sm:text-6xl font-bold uppercase leading-tight mt-4 mb-3"
            >
              Your Quote is <span style={{ color: '#c8960e' }}>On Its Way</span>
            </h1>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="relative rounded-xl border border-border bg-card p-8 text-center py-14 overflow-hidden">
            <Confetti />
            <div className="relative z-10">
              <div className="mx-auto mb-5 rounded-full p-4 w-fit bg-primary/10">
                <Sparkles size={32} className="text-primary" />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mb-3">
                Quote Request Sent{name ? `, ${name.split(" ")[0]}` : ""}!
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto mb-8">
                {range ? (
                  <>
                    Our team will contact you within 1 business hour to confirm your{" "}
                    <strong className="text-foreground">${range[0]}–${range[1]}</strong> estimate and lock in your service window.
                  </>
                ) : (
                  "Our team will contact you within 1 business hour to confirm your estimate and lock in your service window."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`tel:+1${PHONE}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Phone size={16} /> Call {PHONE_DISPLAY}
                </a>
                <Link
                  to="/book"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground rounded-lg font-semibold text-sm hover:border-primary/50 transition-colors"
                >
                  Book Online Directly
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
