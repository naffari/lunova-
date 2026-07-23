import { Phone, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import { Confetti } from "./QuoteAtoms";
import { useQuote } from "./QuoteContext";

export default function QuoteSummary() {
  const { step, contact, range } = useQuote();
  if (step !== "success") return null;

  return (
    <div className="relative rounded-xl border border-border bg-card p-8 text-center py-14 overflow-hidden">
      <Confetti />
      <div className="relative z-10">
        <div className="mx-auto mb-5 rounded-full p-4 w-fit bg-primary/10">
          <Sparkles size={32} className="text-primary" />
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mb-3">
          Quote Request Sent{contact.name ? `, ${contact.name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto mb-8">
          Our team will contact you within 1 business hour to confirm your{" "}
          <strong className="text-foreground">${range[0]}–${range[1]}</strong> estimate and lock in your service window.
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
  );
}
