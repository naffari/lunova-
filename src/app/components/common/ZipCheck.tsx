import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Check, MapPin, AlertCircle } from "lucide-react";
import { checkCoverage, isServable, normalizeZip } from "../../constants/serviceArea";
import type { CoverageResult } from "../../constants/serviceArea";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import { trackCall, trackEvent } from "../../utils/analytics";

interface ZipCheckProps {
  /** Optional service id to carry into the booking flow (`?service=cleaning`). */
  serviceId?: string;
  /** "hero" is light-on-dark and larger; "section" sits on the page ground. */
  variant?: "hero" | "section";
  className?: string;
}

/**
 * Coverage checker — the site's primary micro-commitment.
 *
 * Asking for one field (a ZIP) converts far better than sending cold traffic
 * into a five-step wizard, and it lets us qualify before the visitor invests
 * effort. A covered ZIP deep-links straight into the wizard with the ZIP and
 * city pre-filled, so the answer is never thrown away.
 *
 * An out-of-area ZIP captures an email instead of dead-ending — see the
 * three-state rationale in constants/serviceArea.ts.
 */
export default function ZipCheck({ serviceId, variant = "section", className = "" }: ZipCheckProps) {
  const navigate = useNavigate();
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistSending, setWaitlistSending] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  /** Honeypot. Hidden from humans; anything here means a bot filled the form. */
  const [waitlistTrap, setWaitlistTrap] = useState("");

  const isHero = variant === "hero";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const coverage = checkCoverage(zip);
    setResult(coverage);
    trackEvent("zip_check", { zip: normalizeZip(zip), status: coverage.status });

    if (isServable(coverage.status)) {
      const params = new URLSearchParams({ zip: normalizeZip(zip) });
      if (coverage.city) params.set("city", coverage.city);
      if (serviceId) params.set("service", serviceId);
      navigate(`/book?${params.toString()}`);
    }
  }

  /**
   * Sends the signup to /api/waitlist.
   *
   * This used to fire an analytics event and set `waitlistDone`, which meant the
   * visitor was told "we'll email you when we're near you" while the address
   * went nowhere but Umami. The success state now only appears once the address
   * has actually been recorded.
   */
  async function handleWaitlist(event: React.FormEvent) {
    event.preventDefault();
    setWaitlistSending(true);
    setWaitlistError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: waitlistEmail,
          zip: normalizeZip(zip),
          website: waitlistTrap,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not save your details.");
      }

      trackEvent("waitlist_signup", { zip: normalizeZip(zip) });
      setWaitlistDone(true);
    } catch (err) {
      trackEvent("waitlist_error", { zip: normalizeZip(zip) });
      setWaitlistError(
        err instanceof Error && err.message
          ? err.message
          : "Could not save your details. Please try again."
      );
    } finally {
      setWaitlistSending(false);
    }
  }

  const labelColor = isHero ? "text-white/70" : "text-foreground/60";
  // h-14 on both variants so the field and the submit button always align.
  const fieldBase =
    "w-full h-14 rounded-full px-5 text-base outline-none transition-colors " +
    (isHero
      ? "bg-white/95 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-white/60"
      : "bg-card text-foreground border border-border placeholder:text-muted-foreground/60 focus:border-primary");

  // Out of area — swap the ZIP field for a "tell us where you are" capture.
  if (result?.status === "outside") {
    return (
      <div className={className}>
        {waitlistDone ? (
          <div className={`flex items-start gap-2.5 text-sm ${isHero ? "text-white" : "text-foreground"}`}>
            <Check size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>Got it. We'll email you the moment we start running routes near {normalizeZip(zip)}.</span>
          </div>
        ) : (
          <>
            <p className={`text-sm mb-3 ${isHero ? "text-white/85" : "text-foreground/75"}`}>{result.message}</p>
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-2.5">
              {/* Honeypot. Hidden from humans, findable by bots that fill every
                  input. tabIndex -1 and aria-hidden keep it out of the keyboard
                  order and the accessibility tree. */}
              <input
                type="text"
                name="website"
                value={waitlistTrap}
                onChange={(e) => setWaitlistTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />
              <input
                type="email"
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address for expansion updates"
                disabled={waitlistSending}
                className={fieldBase}
              />
              <button
                type="submit"
                disabled={waitlistSending}
                className="h-14 shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-6 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {waitlistSending ? "Saving…" : "Notify me"}
                {!waitlistSending && <ArrowRight size={16} />}
              </button>
            </form>
            {waitlistError && (
              <p
                role="alert"
                className={`mt-2.5 flex items-center gap-1.5 text-xs font-semibold ${isHero ? "text-white" : "text-destructive"}`}
              >
                <AlertCircle size={14} /> {waitlistError} Or call{" "}
                <a href={`tel:+1${PHONE}`} onClick={() => trackCall("zip_waitlist_error")} className="underline">
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setZip("");
                setWaitlistError(null);
              }}
              className={`mt-3 text-xs font-semibold underline ${labelColor}`}
            >
              Try a different ZIP
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <MapPin
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              isHero ? "text-neutral-400" : "text-muted-foreground"
            }`}
          />
          <input
            value={zip}
            onChange={(e) => {
              setZip(normalizeZip(e.target.value));
              if (result) setResult(null);
            }}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter your ZIP code"
            aria-label="Your ZIP code"
            aria-invalid={result?.status === "invalid"}
            aria-describedby={result ? "zip-check-result" : undefined}
            className={`${fieldBase} pl-11`}
          />
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-7 font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Check availability
          <ArrowRight size={18} />
        </button>
      </form>

      {result?.status === "invalid" ? (
        <p
          id="zip-check-result"
          role="alert"
          className={`mt-2.5 flex items-center gap-1.5 text-xs font-semibold ${isHero ? "text-white" : "text-destructive"}`}
        >
          <AlertCircle size={14} /> {result.message}
        </p>
      ) : (
        <p className={`mt-2.5 text-xs ${labelColor}`}>
          No spam calls, ever. We confirm every booking by phone, or call{" "}
          <a href={`tel:+1${PHONE}`} onClick={() => trackCall("zip_check")} className="font-semibold underline">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      )}
    </div>
  );
}
