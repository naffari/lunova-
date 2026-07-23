import { useState } from "react";
import { Star } from "lucide-react";

export interface Testimonial {
  name: string;
  tag: string;
  loc: string;
  text: string;
  stars?: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maria T.",
    tag: "cleaning",
    loc: "Homeowner, Kansas City",
    text: "Lunova did an incredible deep clean before our house listing. The place has never looked better.",
    stars: 5,
  },
  {
    name: "James R.",
    tag: "junk",
    loc: "Property Manager, Overland Park",
    text: "Used them for junk removal after a tenant moved out. On time, fast, and no damage. Will use every time.",
    stars: 5,
  },
  {
    name: "Sandra K.",
    tag: "landscaping",
    loc: "Homeowner, Prairie Village",
    text: "The crew transformed our overgrown backyard into something we are actually proud of. Outstanding.",
    stars: 5,
  },
  {
    name: "Dee W.",
    tag: "junk",
    loc: "Homeowner, Lee's Summit",
    text: "Cleared a full garage in under an hour. No judgment about the mess either — just got it done.",
    stars: 5,
  },
  {
    name: "Priya K.",
    tag: "cleaning",
    loc: "Homeowner, Leawood",
    text: "Deep clean before hosting family was worth every dollar. The oven and windows looked brand new.",
    stars: 5,
  },
  {
    name: "Alan R.",
    tag: "landscaping",
    loc: "Business Owner, KC",
    text: "First company that actually edged the beds instead of just mowing over them. We're locked in weekly.",
    stars: 5,
  },
  {
    name: "David H.",
    tag: "power",
    loc: "Homeowner, Olathe",
    text: "Power washed our two-story house siding and driveway. Blocked out all grease and mildew streaks!",
    stars: 5,
  },
  {
    name: "Rachel B.",
    tag: "auto",
    loc: "Homeowner, Lenexa",
    text: "Got full mobile auto detailing right in my driveway while working from home. Spotless!",
    stars: 5,
  },
];

interface TestimonialsSectionProps {
  category?: string;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

const FILTER_TABS = [
  { id: "all", label: "All Reviews" },
  { id: "cleaning", label: "Cleaning" },
  { id: "junk", label: "Junk Removal" },
  { id: "landscaping", label: "Landscaping" },
  { id: "power", label: "Power Wash" },
  { id: "auto", label: "Auto Detail" },
];

export default function TestimonialsSection({
  category = "all",
  showFilters = true,
  title = "Customers Agree.",
  subtitle = "Reviews",
}: TestimonialsSectionProps) {
  const [filter, setFilter] = useState(category);

  const shown = filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.tag === filter);

  return (
    <div>
      {title && (
        <div className="mb-8">
          {subtitle && (
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              {subtitle}
            </span>
          )}
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl font-bold text-foreground uppercase mt-1"
          >
            {title}
          </h2>
        </div>
      )}

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                filter === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((t, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.stars || 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <p className="text-foreground font-semibold text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.loc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
