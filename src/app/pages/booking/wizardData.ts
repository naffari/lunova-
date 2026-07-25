import { Sparkles, Truck, Droplets, AppWindow, Car, Trash2, Leaf, Building2 } from "lucide-react";
import type { ElementType } from "react";

export interface CategoryDef {
  id: string;
  name: string;
  price: string;
  icon: ElementType;
}

/**
 * The 8 bookable service categories, in design-spec order. Kept local to
 * the booking wizard (rather than reusing utils/bookingData.ts) since the
 * wizard's pricing copy is a pixel-perfect match to an external design
 * spec and shouldn't drift if other pages' pricing tables change.
 */
export const CATEGORIES: CategoryDef[] = [
  { id: "cleaning", name: "Residential Cleaning", price: "From $120", icon: Sparkles },
  { id: "junk", name: "Junk Removal", price: "From $75", icon: Truck },
  { id: "power", name: "Power Washing", price: "From $120", icon: Droplets },
  { id: "window", name: "Window Cleaning", price: "From $110", icon: AppWindow },
  { id: "auto", name: "Auto Detailing", price: "From $69", icon: Car },
  { id: "bin", name: "Bin Cleaning", price: "From $15/mo", icon: Trash2 },
  { id: "landscaping", name: "Landscaping", price: "From $45/visit", icon: Leaf },
  { id: "commercial", name: "Commercial Cleaning", price: "Custom quote", icon: Building2 },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.name])
);

export interface SubserviceOption {
  name: string;
  price: string;
}

export const SUBSERVICE_CATALOG: Record<string, SubserviceOption[]> = {
  cleaning: [
    { name: "Standard Clean", price: "from $120" },
    { name: "Deep Clean", price: "from $220" },
    { name: "Move-In / Move-Out", price: "from $260" },
    { name: "Airbnb Turnover", price: "from $90" },
  ],
  junk: [
    { name: "Single Item", price: "from $75" },
    { name: "Partial Truckload", price: "from $175" },
    { name: "Full Truckload", price: "from $395" },
  ],
  power: [
    { name: "Siding", price: "from $180" },
    { name: "Driveway", price: "from $120" },
    { name: "Deck / Patio", price: "from $150" },
  ],
  window: [
    { name: "Interior & Exterior", price: "from $180" },
    { name: "Exterior Only", price: "from $110" },
    { name: "Hard Water Treatment", price: "+$60" },
  ],
  auto: [
    { name: "Interior Only", price: "from $89" },
    { name: "Exterior Only", price: "from $69" },
    { name: "Full Detail (In & Out)", price: "from $149" },
  ],
  bin: [
    { name: "One-Time 2-Bin Clean", price: "$25" },
    { name: "Recurring Monthly Plan", price: "$15/mo" },
    { name: "Recurring Bi-Weekly Plan", price: "$22/mo" },
  ],
  landscaping: [
    { name: "One-Time Clean-Up", price: "from $150" },
    { name: "Recurring Lawn Care", price: "$45/visit" },
    { name: "Seasonal Package", price: "custom quote" },
  ],
  commercial: [
    { name: "Office Cleaning", price: "custom quote" },
    { name: "Restaurant Cleaning", price: "custom quote" },
    { name: "Dealership Cleaning", price: "custom quote" },
  ],
};

/** For each category, the 2 other categories suggested as cross-sell add-ons. */
export const UPSELL_MAP: Record<string, string[]> = {
  cleaning: ["window", "bin"],
  junk: ["power", "landscaping"],
  power: ["window", "bin"],
  window: ["cleaning", "power"],
  auto: ["bin", "cleaning"],
  bin: ["landscaping", "cleaning"],
  landscaping: ["power", "bin"],
  commercial: ["window", "power"],
};

export const ADDON_CATALOG: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, `${c.name} — ${c.price}`])
);

export const CITIES = [
  "Kansas City, MO",
  "Kansas City, KS",
  "Overland Park",
  "Olathe",
  "Shawnee",
  "Lenexa",
  "Leawood",
  "Prairie Village",
  "Lee's Summit",
  "Independence",
  "Blue Springs",
  "Raytown",
];

export const HEAR_ABOUT_OPTIONS = [
  "Google search",
  "Friend or family referral",
  "Social media",
  "Saw a truck / crew",
  "Repeat customer",
  "Other",
];

export const STEP_LABELS = ["Service", "Details", "Schedule", "Contact", "Review"];
