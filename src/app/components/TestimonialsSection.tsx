import { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { GUARANTEE, PROOF_POINTS, REVIEWS, hasReviews } from "../constants/proof";

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
 *
 * Adding entries here automatically switches this section from the trust-proof
 * fallback to the review grid, and turns on the rating line in ProofStrip once
 * REVIEWS.count in constants/proof.ts is also set.
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
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">{subtitle}</span>
          )}
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl font-bold text-foreground mt-1"
          >
            {title}
          </h2>
          {hasReviews() && (
            <p className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </span>
              {REVIEWS.rating.toFixed(1)} average from {REVIEWS.count.toLocaleString("en-US")}{" "}
              {REVIEWS.source} reviews
            </p>
          )}
        </div>
      )}

      {showFilters && TESTIMONIALS.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              aria-pressed={filter === t.id}
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
        /*
          No reviews yet, and none will be invented. This is the researched
          Molly Maid pattern: their own widget shows "0/5", and they carry the
          section on verifiable non-review proof instead — a named guarantee
          with real terms, plus vetting and insurance claims.

          The previous version of this block simply apologised for being new and
          gave the visitor nothing to weigh, which made it the site's first
          trust signal and a negative one.
        */
        <div className="rounded-2xl border border-border bg-card p-7">
          <div className="flex items-start gap-3 mb-5 pb-5 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{GUARANTEE.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-xl">{GUARANTEE.terms}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {PROOF_POINTS.filter((p) => p.verified && p.label !== GUARANTEE.short).map((point) => (
              <div key={point.label}>
                <p className="font-semibold text-xs text-foreground mb-1">{point.label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-5 pt-5 border-t border-border">
            We're new to Kansas City and haven't collected reviews yet — so we're leading with what
            you can check instead. Be one of our first and hold us to the promise above.
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
