import { useState } from "react";
import { MapPin, Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const EMAIL = "naffari@myyahoo.com";

export const SERVICE_ZIPS = new Set([
  "64108", "64111", "64112", "64105", "64106", "64110", "64116", "64117", "64118",
  "66212", "66210", "66211", "66202", "66203", "66204", "66205", "66206", "66207",
  "66208", "66213", "66214", "66215", "66223", "66062", "64030", "64081", "64082",
]);

interface ZipValidatorProps {
  onStartQuote?: () => void;
  title?: string;
  className?: string;
}

export default function ZipValidator({
  onStartQuote,
  title = "Check if we cover your area",
  className = "",
}: ZipValidatorProps) {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<"yes" | "no" | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (zip.length !== 5) return;
    setResult(SERVICE_ZIPS.has(zip) ? "yes" : "no");
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-primary" />
        <span className="text-primary text-xs font-semibold uppercase tracking-widest">
          Serving Kansas City Metro
        </span>
      </div>
      <h3
        style={{ fontFamily: "var(--font-display)" }}
        className="text-2xl font-bold text-foreground uppercase mb-4"
      >
        {title}
      </h3>
      <form onSubmit={check} className="flex gap-2 mb-4">
        <label htmlFor="zip-validator-input" className="sr-only">
          Zip code
        </label>
        <input
          id="zip-validator-input"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
            setResult(null);
          }}
          placeholder="Enter zip code"
          inputMode="numeric"
          className="flex-1 rounded-lg px-4 py-3 text-base bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          className="rounded-lg px-5 py-3 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Check
        </button>
      </form>

      {result === "yes" && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-lg p-4 bg-primary/10 border border-primary/20">
          <Check size={16} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-foreground">
              Green light — we service {zip}!
            </p>
            {onStartQuote ? (
              <button
                onClick={onStartQuote}
                className="text-sm text-primary underline mt-1 font-medium flex items-center gap-1"
              >
                Start your free quote <ArrowRight size={14} />
              </button>
            ) : (
              <Link
                to="/book"
                className="text-sm text-primary underline mt-1 font-medium flex items-center gap-1 inline-flex"
              >
                Book online now <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}

      {result === "no" && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-lg p-4 bg-secondary border border-border">
          <X size={16} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-foreground">Not in our core area yet.</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Email us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-primary underline">
                {EMAIL}
              </a>{" "}
              and we'll let you know when we expand to {zip}.
            </p>
          </div>
        </div>
      )}

      {!result && (
        <p className="text-xs text-muted-foreground">
          Try 64111 or 66210 for a live demonstration.
        </p>
      )}
    </div>
  );
}
