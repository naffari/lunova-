import { Check, Clock, MessageSquare, Phone, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { PHONE } from "../../constants/contact";
import ZipValidator from "../../components/ZipValidator";

export default function QuoteSidebar() {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <ZipValidator title="Check Zip Coverage" />

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-foreground uppercase mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-primary" /> Why Lunova?
        </h3>
        <ul className="space-y-3">
          {[
            { text: "Licensed, bonded & fully insured", icon: ShieldCheck },
            { text: "Flat-rate pricing — no surprise fees", icon: Tag },
            { text: "Same-day & next-day slots available", icon: Clock },
            { text: "10% off when you bundle 2+ services", icon: Sparkles },
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-muted-foreground text-sm">
              <Check size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-5 border-t border-border flex gap-2">
          <a
            href={`tel:+1${PHONE}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors"
          >
            <Phone size={13} /> Call Us
          </a>
          <a
            href={`sms:+1${PHONE}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-foreground rounded-lg font-semibold text-xs hover:border-primary/50 hover:text-primary transition-colors"
          >
            <MessageSquare size={13} /> Text Us
          </a>
        </div>
      </div>
    </div>
  );
}
