import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { insuranceFaq } from "../constants/credentials";

export interface FaqItem {
  q: string;
  a: string;
}

export const GENERAL_FAQS: FaqItem[] = [
  // Answer comes from constants/credentials.ts, which knows whether there is
  // actually a policy. This used to promise "proof of insurance available on
  // request" on every page of an uninsured business.
  insuranceFaq(),
  {
    q: "Do I need to be home?",
    a: "Not for a clean. Leave entry instructions in the booking notes and we'll text you before we arrive and again when we leave. For a detail it helps if you're reachable, since the car needs unlocking and we'd rather ask about a stain than guess at it.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation or rescheduling up to 24 hours before your appointment. Inside 24 hours a $25 fee applies to cover the slot, because there are two of us and a late cancellation is half a day we can't refill.",
  },
  {
    q: "Do you bring your own supplies and equipment?",
    a: "Yes, everything — products, cloths, vacuum, extractor, polisher. Detailing is the one exception: for now we need access to an outdoor tap at the property, because the water tank isn't on the truck yet. If you'd rather we used a specific product on a particular surface, leave it out and say so in the notes.",
  },
  {
    q: "Can I book both services at once?",
    a: "Yes, and it's the cheapest way to buy either. Book the house and the car together and 10% comes off the combined total — the drive is already paid for by the first job, so the second one costs us less to do. Bin cleaning rides along as an add-on for the same reason.",
  },
  {
    q: "How fast can you come out?",
    a: "Often the same week, sometimes sooner. We're a two-person company rather than a call centre, so the honest answer is that it depends on what's already on the calendar. Call or text and you'll get a real answer rather than a placeholder.",
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
