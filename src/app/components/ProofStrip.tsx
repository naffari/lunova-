import { Star, ShieldCheck } from "lucide-react";
import { HERO_PROOF, REVIEWS, hasReviews } from "../constants/proof";

interface ProofStripProps {
  /** "hero" renders light-on-dark for use over a hero scrim. */
  variant?: "hero" | "light";
  className?: string;
}

/**
 * Compact trust row, designed to sit immediately below the primary CTA.
 *
 * Placement is the whole point: every researched site puts its proof adjacent
 * to the button (1-800-GOT-JUNK's rating sits between subhead and CTA,
 * Thumbtack's three stats sit directly under it). Lunova's proof previously
 * appeared five screens down, and the first trust signal a visitor met was
 * "We're brand new to Kansas City."
 *
 * Renders a star rating once REVIEWS.count is non-zero, and falls back to
 * non-review proof until then. It never renders a zeroed-out rating widget.
 */
export default function ProofStrip({ variant = "light", className = "" }: ProofStripProps) {
  const isHero = variant === "hero";
  const textColor = isHero ? "text-white/90" : "text-foreground/75";
  const dotColor = isHero ? "bg-white/40" : "bg-primary/50";

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold ${textColor} ${className}`}>
      {hasReviews() && (
        <>
          <span className="flex items-center gap-1.5">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-primary text-primary" />
              ))}
            </span>
            <span>
              {REVIEWS.rating.toFixed(1)} · {REVIEWS.count.toLocaleString("en-US")} {REVIEWS.source} reviews
            </span>
          </span>
          <span className={`w-1 h-1 rounded-full ${dotColor}`} aria-hidden="true" />
        </>
      )}

      <span className="flex items-center gap-1.5">
        <ShieldCheck size={14} className={isHero ? "text-white" : "text-primary"} />
        {HERO_PROOF[0]}
      </span>

      {HERO_PROOF.slice(1).map((claim) => (
        <span key={claim} className="flex items-center gap-4">
          <span className={`w-1 h-1 rounded-full ${dotColor}`} aria-hidden="true" />
          {claim}
        </span>
      ))}
    </div>
  );
}
