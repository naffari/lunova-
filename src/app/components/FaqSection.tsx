import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export const GENERAL_FAQS: FaqItem[] = [
  {
    q: "Are you licensed and insured?",
    a: "Yes. Lunova and every crew member are fully licensed and carry general liability insurance. Proof of insurance is available on request before your job.",
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
    a: "Book 2 or more services and receive 10% off the combined total. Every cleaning or power washing quote surfaces bin cleaning or window washing as a discounted add-on.",
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
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">{subtitle}</span>
          )}
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl font-bold text-foreground mt-1"
          >
            {title}
          </h2>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-border bg-card">
        {items.map((item, i) => (
          <FaqRow
            key={item.q}
            item={item}
            index={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

interface FaqRowProps {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqRow({ item, index, isOpen, onToggle }: FaqRowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  /**
   * Measure the panel rather than hardcoding a height.
   *
   * This used to be `maxHeight: isOpen ? 300 : 0`, which silently clipped any
   * answer taller than 300px — and several of the service pages' FAQs are.
   * Re-measures on resize because reflow changes how many lines the answer wraps to.
   */
  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const measure = () => setMaxHeight(node.scrollHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.a]);

  const buttonId = `faq-question-${index}`;
  const panelId = `faq-panel-${index}`;

  /**
   * `inert` is not in React 18's JSX typings (it landed in React 19), but React
   * does forward unknown lowercase string attributes to the DOM, so spreading
   * it produces a real `inert=""` on the element. Presence is what the browser
   * keys off — hence `""` rather than `true`.
   */
  const inertWhenClosed = (isOpen ? {} : { inert: "" }) as { inert?: string };

  return (
    <div style={{ borderTop: index === 0 ? "none" : "1px solid var(--border)" }}>
      <button
        type="button"
        id={buttonId}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-secondary/50 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-medium text-sm text-foreground">{item.q}</span>
        <ChevronDown
          size={18}
          className="text-primary shrink-0 transition-transform duration-250"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {/*
        `inert` on the collapsed panel is what keeps its contents out of the tab
        order and out of the accessibility tree. The previous `aria-hidden`
        alone hid it from screen readers while leaving any links inside
        focusable — a keyboard user could tab into invisible content.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        {...inertWhenClosed}
        style={{
          maxHeight: isOpen ? maxHeight : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div ref={panelRef}>
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
        </div>
      </div>
    </div>
  );
}
