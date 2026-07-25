import { useState } from "react";
import { Star, Sparkles } from "lucide-react";

export interface Testimonial {
  name: string;
  tag: string;
  loc: string;
  text: string;
  stars?: number;
}

/**
 * Real customer reviews go here once we have them. Lunova is a newly
 * launched company — do not add placeholder/fabricated testimonials.
 */
export const TESTIMONIALS: Testimonial[] = [];

interface TestimonialsSectionProps {
  category?: string;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

const FILTER_TABS = [
  { id: "all", label: "All Reviews" },
  { id: "cleaning", label: "Cleaning" },
  { id: "junk", label: "Junk Removal" },
  { id: "landscaping", label: "Landscaping" },
  { id: "power", label: "Power Wash" },
  { id: "auto", label: "Auto Detail" },
];

export default function TestimonialsSection({
  category = "all",
  showFilters = true,
  title = "Customers Agree.",
  subtitle = "Reviews",
}: TestimonialsSectionProps) {
  const [filter, setFilter] = useState(category);

  const shown = filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.tag === filter);

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

      {showFilters && TESTIMONIALS.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                filter === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {TESTIMONIALS.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Sparkles size={20} />
          </div>
          <p className="text-foreground font-semibold text-sm mb-1">We're brand new to Kansas City.</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We haven't collected customer reviews yet — book with us and be one of our first! We're backed by a satisfaction guarantee on every job.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((t, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars || 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="text-foreground font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.loc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
