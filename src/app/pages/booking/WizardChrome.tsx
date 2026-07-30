import { Check, Lock } from "lucide-react";

interface StepNavProps {
  labels: string[];
  current: number;
  /** Highest step the user has legitimately reached. Later steps aren't clickable. */
  furthest: number;
  onJump: (step: number) => void;
}

/**
 * Step navigation.
 *
 * Two findings drove this rebuild. Baymard: a progress indicator must be a 1:1
 * map of the flow, and **past steps must be clickable** — users reach for the
 * indicator to go back, and a dead indicator reads as broken. The previous
 * version was five inert circles.
 *
 * Forward steps stay disabled rather than hidden, so the shape of the whole
 * flow is visible from step 1 — people abandon forms whose length they can't
 * see. `furthest` (not `current`) gates clickability so returning to step 2 from
 * step 4 doesn't lock the later steps you already filled in.
 */
export function StepNav({ labels, current, furthest, onJump }: StepNavProps) {
  return (
    <nav aria-label="Booking progress" className="mb-9">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {labels.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          const reachable = step <= furthest;

          return (
            <li key={label} className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => reachable && onJump(step)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={`group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${
                  reachable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {/* The bar carries the progress; the number is secondary. A
                    filled bar reads at a glance on mobile where the labels
                    truncate. */}
                <span
                  className={`block h-1.5 rounded-full transition-colors ${
                    done ? "bg-primary" : active ? "bg-primary" : "bg-primary/15"
                  }`}
                />
                <span className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`w-[18px] h-[18px] shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground/40"
                    }`}
                  >
                    {done ? <Check size={11} strokeWidth={3.5} /> : step}
                  </span>
                  <span
                    className={`hidden sm:block truncate text-[11px] transition-colors ${
                      active ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                    } ${reachable ? "group-hover:text-foreground" : ""}`}
                  >
                    {label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {/* Mobile gets the current step spelled out, since the labels are hidden. */}
      <p className="sm:hidden mt-2.5 text-xs font-semibold text-foreground">
        Step {current} of {labels.length} · {labels[current - 1]}
      </p>
    </nav>
  );
}

interface FieldProps {
  id: string;
  label: string;
  /** Renders the "Required" affordance. Baymard: 94% of sites fail to mark this. */
  required?: boolean;
  /** Shown under the label. Use it to say WHY you need the data. */
  hint?: string;
  /** Inline error. Empty/undefined renders nothing. */
  error?: string;
  children: React.ReactNode;
}

/**
 * Labelled field wrapper.
 *
 * Baymard findings applied: label ABOVE the input (not inline), full-width
 * field, explicit required/optional marking, a specific inline error rather than
 * a generic one, and room for a hint explaining why the data is needed — 65% of
 * sites induce privacy concerns by asking without explaining.
 */
export function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {required ? (
          <span className="text-[10px] font-medium text-primary">Required</span>
        ) : (
          <span className="text-[10px] font-medium text-muted-foreground/70">Optional</span>
        )}
      </label>
      {hint && <p className="text-[11px] text-muted-foreground mb-1.5 leading-relaxed">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Reassurance line for the contact step. Sits next to the fields that ask for
 * personal data, which is where the hesitation actually happens.
 */
export function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
      <Lock size={12} className="mt-0.5 shrink-0 text-primary" />
      <span>{children}</span>
    </p>
  );
}
