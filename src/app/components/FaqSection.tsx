import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export const GENERAL_FAQS: FaqItem[] = [
  {
    q: "Are you licensed and insured?",
    a: "Yes — Lunova and every crew member are fully licensed and carry general liability insurance. Proof of insurance is available on request before your job.",
  },
  {
    q: "Do I need to be home for the service?",
    a: "Not for most jobs. Provide entry instructions and we'll text you before we arrive and again when we leave. We do ask someone be reachable for junk removal to confirm what gets hauled.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation or rescheduling up to 24 hours before your appointment. Inside 24 hours a $25 fee applies to cover the crew slot.",
  },
  {
    q: "Do you bring your own supplies and equipment?",
    a: "Always. Cleaning crews bring eco-friendly products, landscaping crews bring their own mowers and trimmers, and junk removal includes all hauling tools.",
  },
  {
    q: "Can I bundle multiple services?",
    a: "Absolutely — book 2 or more services and receive 10% off the combined total. Every cleaning or power washing quote surfaces bin cleaning or window washing as a discounted add-on.",
  },
  {
    q: "How fast can you come out?",
    a: "We offer same-day and next-day slots for most services in the Kansas City metro. Call or text and we'll confirm exact availability in minutes.",
  },
];

interface FaqSectionProps {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqSection({
  items = GENERAL_FAQS,
  title = "Frequently Asked Questions",
  subtitle = "Common Questions",
}: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {title && (
        <div className="mb-8">
          {subtitle && (
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              {subtitle}
            </span>
          )}
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl font-bold text-foreground uppercase mt-1"
          >
            {title}
          </h2>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-secondary/50 transition-colors"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-sm text-foreground">{item.q}</span>
                <ChevronDown
                  size={18}
                  className="text-primary shrink-0 transition-transform duration-250"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <div
                style={{
                  maxHeight: isOpen ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
