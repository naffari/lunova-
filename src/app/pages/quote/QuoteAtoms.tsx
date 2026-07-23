import { useMemo } from "react";
import type { ElementType } from "react";
import { Check } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";

export function PriceGauge({ low, high, maxScale = 700 }: { low: number; high: number; maxScale?: number }) {
  const lo = useCountUp(low);
  const hi = useCountUp(high);
  const leftPct = Math.min(95, (low / maxScale) * 100);
  const widthPct = Math.max(5, ((high - low) / maxScale) * 100);
  const isSingle = low === high;

  return (
    <div className="rounded-xl p-6 bg-card border border-border">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-primary text-xs font-semibold uppercase tracking-widest">
          Estimated {isSingle ? "price" : "range"}
        </span>
        <span className="text-muted-foreground text-xs">confirmed on-site</span>
      </div>
      <div className="flex items-end gap-2 mb-5">
        <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl font-bold text-foreground">
          ${lo}
        </span>
        {!isSingle && (
          <>
            <span className="text-2xl text-muted-foreground mb-1">–</span>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl font-bold text-foreground">
              ${hi}
            </span>
          </>
        )}
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-secondary">
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-500 bg-primary"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs mt-3">
        Exact quote confirmed before any work begins — zero surprise fees.
      </p>
    </div>
  );
}

export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 8,
            background: i <= step ? "var(--primary)" : "var(--border)",
            opacity: i <= step ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.0 + Math.random() * 0.7,
        color: ["#c8960e", "#F1EBD9", "#3C312A", "#E8A830"][i % 4],
        size: 5 + Math.random() * 5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
      <style>{`
        @keyframes lunovaFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity:1; }
          100% { transform: translateY(320px) rotate(360deg); opacity:0; }
        }
      `}</style>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 1,
            animation: `lunovaFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

export function PillGroup({
  options,
  value,
  onChange,
  multi = false,
  wrap = false,
}: {
  options: { id: string; label: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  wrap?: boolean;
}) {
  function isActive(id: string) {
    return multi ? (value as string[]).includes(id) : value === id;
  }
  function toggle(id: string) {
    if (!multi) return onChange(id);
    const arr = value as string[];
    onChange(arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]);
  }
  return (
    <div className={`flex gap-2 ${wrap ? "flex-wrap" : ""}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => toggle(o.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${
            isActive(o.id)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-border text-foreground font-medium hover:border-primary/50 transition-colors"
      >
        −
      </button>
      <span style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-foreground w-5 text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-border text-foreground font-medium hover:border-primary/50 transition-colors"
      >
        +
      </button>
    </div>
  );
}

export function TextField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

export function CheckToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition-colors text-left w-full ${
        checked
          ? "bg-primary/10 border-primary/40 text-foreground"
          : "bg-secondary border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <div
        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
          checked ? "bg-primary border-primary" : "border-border"
        }`}
      >
        {checked && <Check size={10} className="text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}
