import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { StepDots } from "./QuoteAtoms";
import { QUOTE_STEP_INDEX, useQuote } from "./QuoteContext";

export default function QuoteStepper() {
  const { step } = useQuote();

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
      <div className="flex items-center gap-3">
        <StepDots step={QUOTE_STEP_INDEX[step]} total={3} />
        <span className="text-muted-foreground text-xs font-medium">
          Step {QUOTE_STEP_INDEX[step] + 1} of 3
        </span>
      </div>
      <Link
        to="/book"
        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
      >
        Ready to book date now? <ArrowRight size={13} />
      </Link>
    </div>
  );
}
