import { Ban, ClipboardCheck, Droplets, KeyRound } from "lucide-react";
import { getServicePolicy } from "../constants/servicePolicy";
import type { ServiceId } from "../constants/services";
import { withAlpha } from "../utils/color";

interface ServicePolicySectionProps {
  serviceKey: ServiceId;
  primaryColor: string;
  accentColor: string;
}

/**
 * "Before we arrive" — the practical half of a service page.
 *
 * Every service page explained what the job is and what it costs, and none of
 * them said what the customer has to do, what we need on site, or what we will
 * refuse. Those are the three things that turn a booking into a wasted trip: a
 * locked side gate, no outdoor spigot, or a drum of used motor oil in the pile
 * that no transfer station will take.
 *
 * Renders only the blocks that have confirmed content behind them — see the
 * rules at the top of constants/servicePolicy.ts. A service with nothing
 * confirmed renders nothing at all rather than filler.
 */
export default function ServicePolicySection({
  serviceKey,
  primaryColor,
  accentColor,
}: ServicePolicySectionProps) {
  const policy = getServicePolicy(serviceKey);
  if (!policy) return null;

  const { prepare, siteNeeds, cannotTake, chemicals } = policy;
  if (!prepare && !siteNeeds && !cannotTake && !chemicals) return null;

  const columns = [
    siteNeeds && { icon: KeyRound, title: "What we need on site", items: siteNeeds },
    prepare && { icon: ClipboardCheck, title: "Before we arrive", items: prepare },
  ].filter(Boolean) as { icon: typeof KeyRound; title: string; items: string[] }[];

  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>Before the day</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-2 text-foreground">
            What happens, and what we need from you.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Two minutes of reading that saves a wasted visit.
          </p>
        </div>

        {columns.length > 0 && (
          <div
            /*
              Column count follows the content. Hardcoding two left junk removal
              — which has prep notes but no site requirements — rendering one
              filled cell next to an empty grey box.
            */
            className={`grid gap-px mb-px ${columns.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}
            style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}
          >
            {columns.map(({ icon: Icon, title, items }) => (
              <div key={title} className="p-6 sm:p-7" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <Icon size={17} style={{ color: accentColor }} />
                  <h3 className="text-sm font-bold text-foreground">{title}</h3>
                </div>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span
                        className="mt-[0.55rem] w-1 h-1 rounded-full shrink-0"
                        style={{ backgroundColor: accentColor }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {chemicals && (
          <div
            className="p-6 sm:p-7"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", marginTop: columns.length ? "-1px" : 0 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <Droplets size={17} style={{ color: accentColor }} />
              <h3 className="text-sm font-bold text-foreground">What we put on your property</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">{chemicals}</p>
          </div>
        )}

        {/*
          Refusals get their own visual weight rather than a bullet in a list.
          Someone scanning for "can they take my paint tins" needs to hit this
          before they book, not after the truck has driven out.
        */}
        {cannotTake && (
          <div
            className="p-6 sm:p-7 mt-6"
            style={{
              backgroundColor: withAlpha(primaryColor, 0.05),
              border: `1px solid ${withAlpha(primaryColor, 0.22)}`,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <Ban size={17} style={{ color: primaryColor }} />
              <h3 className="text-sm font-bold" style={{ color: primaryColor }}>
                {cannotTake.heading}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl mb-4">
              {cannotTake.intro}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
              {cannotTake.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm font-semibold text-foreground py-2"
                  style={{ borderBottom: `1px solid ${withAlpha(primaryColor, 0.12)}` }}
                >
                  <Ban size={14} className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {cannotTake.footer && (
              <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {cannotTake.footer}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
