import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_BY_ID, startingAtLabel, type ServiceId } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { BUNDLE_DISCOUNT } from "../constants/services";

interface CrossSellRowProps {
  /** The service this page is about. Its `upsells` decide what appears. */
  serviceKey: ServiceId;
  primaryColor: string;
  accentColor: string;
}

/**
 * The two services this one is usually booked with.
 *
 * WHY: `upsells` has been in the catalogue since it was written, and the only
 * place it was ever read is step 2 of the booking wizard — so the pairing was
 * offered to people who had already committed, and never to the far larger
 * group reading a service page and leaving. The 10% multi-service discount had
 * the same problem: real, funded, and mentioned almost nowhere a visitor
 * actually looks.
 *
 * The copy names the practical reason for the pair rather than saying "you may
 * also like": the crew is already on site with the equipment out, which is the
 * honest reason it is worth doing at the same time and the only one a customer
 * finds persuasive.
 */
export default function CrossSellRow({ serviceKey, primaryColor, accentColor }: CrossSellRowProps) {
  const service = SERVICE_BY_ID[serviceKey];
  const pairs = (service?.upsells ?? []).map((id) => SERVICE_BY_ID[id]).filter(Boolean);
  if (pairs.length === 0) return null;

  const percent = Math.round(BUNDLE_DISCOUNT * 100);

  return (
    <section
      className="py-16 px-4 sm:px-6"
      style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>Worth doing at the same time</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-2 text-foreground">
            Book two, take {percent}% off both.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            One visit, one crew, one bill. The discount comes off the combined total automatically
            in the booking flow — there is no code to enter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}>
          {pairs.map((pair) => (
            <Link
              key={pair.id}
              to={pair.to}
              onMouseEnter={() => preloadRoute(pair.to)}
              onFocus={() => preloadRoute(pair.to)}
              className="group p-6 sm:p-7 transition-colors hover:bg-[var(--muted)]"
              style={{ backgroundColor: "var(--card)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-serif-display text-2xl text-foreground">{pair.name}</h3>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: accentColor }}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">{pair.bullets.join(" · ")}</p>
              <p className="text-sm font-bold" style={{ color: accentColor }}>
                {startingAtLabel(pair)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
