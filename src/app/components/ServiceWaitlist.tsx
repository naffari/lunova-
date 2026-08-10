import { useState } from "react";
import { Link } from "react-router";
import { Check, ArrowUpRight } from "lucide-react";
import { ACTIVE_SERVICES, SERVICE_BY_ID, startingAtLabel, type ServiceId } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { trackEvent } from "../utils/analytics";
import { withAlpha } from "../utils/color";

interface ServiceWaitlistProps {
  /** The parked service this page is about. */
  serviceKey: ServiceId;
  primaryColor: string;
  accentColor: string;
}

/**
 * What a parked service page offers instead of a booking button.
 *
 * Six of the eight services in the catalogue cannot be delivered today —
 * see the `active` flag in constants/services.ts for which and why. Their pages
 * stay published, because they hold rankings that would take months to rebuild,
 * and because someone searching "power washing Overland Park" is a real
 * customer even if the answer today is "not yet".
 *
 * What that person must not get is a booking form. A booking that cannot be
 * serviced costs the referral as well as the job, and it is worse than saying
 * no — the customer has already stopped looking by the time anyone calls them
 * back.
 *
 * So the page says so plainly, captures the address, and points at the two
 * things that CAN be booked. Saying "not yet" costs one visitor. Saying yes and
 * failing costs everyone they would have told.
 */
export default function ServiceWaitlist({ serviceKey, primaryColor, accentColor }: ServiceWaitlistProps) {
  const service = SERVICE_BY_ID[serviceKey];
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [trap, setTrap] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service || service.active) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          zip: zip.replace(/\D/g, "").slice(0, 5),
          service: service.name,
          website: trap,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not save your details.");

      trackEvent("service_waitlist_signup", { service: serviceKey });
      setDone(true);
    } catch (err) {
      trackEvent("service_waitlist_error", { service: serviceKey });
      setError(err instanceof Error && err.message ? err.message : "Could not save your details. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="waitlist"
      className="py-16 px-4 sm:px-6"
      style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>Not yet</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl mb-3 text-foreground">
            We don't offer {service.name.toLowerCase()} yet.
          </h2>

          {/*
            The reason is stated rather than hidden behind "coming soon".

            A visitor who is told why tends to believe the rest of the page. A
            visitor who is told "coming soon" with no date assumes the whole
            site is that vague, and the honest-claims architecture everywhere
            else here only works if it holds on the pages where the answer is
            inconvenient.
          */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Lunova is two people, and we would rather do two things properly than eight things
            badly. This page is still here because the work is on the list and the questions it
            answers are worth answering. It is not here to take a booking we cannot keep.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Leave an address and you will hear from us when it is ready. Nothing else gets sent to
            you in between.
          </p>
        </div>

        <div>
          {done ? (
            <div
              className="p-6 rounded-xl flex items-start gap-3"
              style={{ backgroundColor: withAlpha(accentColor, 0.08), border: `1px solid ${withAlpha(accentColor, 0.3)}` }}
            >
              <Check size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground mb-1">You're on the list.</p>
                <p className="text-sm text-muted-foreground">
                  We'll email you when {service.name.toLowerCase()} is something we can actually
                  stand behind.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Hidden from humans. Any value means an automated submission. */}
              <input
                type="text"
                name="website"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
              />

              <div className="grid sm:grid-cols-[1fr_7rem] gap-3">
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg text-sm text-foreground"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  />
                </label>
                <label className="block">
                  <span className="sr-only">ZIP code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-lg text-sm text-foreground"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-lg font-bold text-sm transition-opacity disabled:opacity-60"
                style={{ backgroundColor: accentColor, color: "#ffffff" }}
              >
                {sending ? "Adding you…" : "Tell me when it's ready"}
              </button>

              {error && (
                <p className="text-xs" role="alert" style={{ color: "var(--destructive, #b91c1c)" }}>
                  {error}
                </p>
              )}
            </form>
          )}

          {/*
            The point of the section. Someone on a parked page has already shown
            intent and is one click from leaving — this is the only place on the
            page where a booking is possible.
          */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
              What we do today
            </p>
            <div className="space-y-px" style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}>
              {ACTIVE_SERVICES.map((active) => (
                <Link
                  key={active.id}
                  to={active.to}
                  onMouseEnter={() => preloadRoute(active.to)}
                  onFocus={() => preloadRoute(active.to)}
                  className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-[var(--muted)]"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  <span>
                    <span className="block text-sm font-bold text-foreground">{active.name}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {startingAtLabel(active)}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: accentColor }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
