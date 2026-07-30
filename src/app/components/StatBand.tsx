import type { ElementType } from "react";

export interface StatItem {
  val: string;
  label: string;
  /** Optional one-line elaboration, shown under the label. */
  detail?: string;
  icon?: ElementType;
}

interface StatBandProps {
  stats: StatItem[];
  /** Department ground. Always dark — the band is white-on-dark by design. */
  primaryColor: string;
  /** Department accent, used for the figures. */
  accentColor: string;
  className?: string;
}

/**
 * Dark stat band. One implementation, used by all nine service pages.
 *
 * This markup was previously copy-pasted byte-for-byte into every service page,
 * so the layout could only be improved nine times or not at all.
 *
 * Structurally follows the researched BuildCore treatment: an icon, a large
 * figure in the department accent, a small uppercase label, and hairline
 * dividers between columns rather than card borders — which reads as one
 * continuous band instead of four boxes.
 */
export default function StatBand({ stats, primaryColor, accentColor, className = "" }: StatBandProps) {
  return (
    <div className={`py-14 px-4 sm:px-6 ${className}`} style={{ backgroundColor: primaryColor }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="px-4 sm:px-6 flex flex-col items-center lg:items-start text-center lg:text-left"
              style={{
                // Hairline dividers, skipped on the first column of each row so
                // no rule ever hangs off the left edge of the band.
                borderLeft: idx % 2 === 0 ? "none" : "1px solid rgba(255,255,255,0.14)",
              }}
            >
              {Icon && (
                <Icon size={26} className="mb-3" style={{ color: accentColor, opacity: 0.9 }} />
              )}
              <p
                className="font-serif-display text-4xl sm:text-5xl font-bold leading-none"
                style={{ color: accentColor }}
              >
                {stat.val}
              </p>
              <p
                className="text-[11px] mt-2 font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {stat.label}
              </p>
              {stat.detail && (
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {stat.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
