import { Home, Trash2, Droplets, AppWindow, Car, Leaf, Building2 } from "lucide-react";
import type { ElementType } from "react";

export interface ServiceDef {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  priceNote: string;
  icon: ElementType;
  desc: string;
}

export const PRIMARY_SERVICES: ServiceDef[] = [
  {
    id: "cleaning",
    name: "Residential Cleaning",
    category: "Cleaning",
    basePrice: 150,
    priceNote: "Standard home clean",
    icon: Home,
    desc: "Kitchen, bathrooms, dusting, vacuuming & floor wash.",
  },
  {
    id: "junk",
    name: "Junk Removal",
    category: "Hauling",
    basePrice: 175,
    priceNote: "¼ truck load base",
    icon: Trash2,
    desc: "Furniture, appliances, debris, yard waste haul-away.",
  },
  {
    id: "power",
    name: "Power Washing",
    category: "Exterior",
    basePrice: 160,
    priceNote: "Driveway or patio",
    icon: Droplets,
    desc: "Pressure clean driveways, siding, decks, and walkways.",
  },
  {
    id: "window",
    name: "Window Cleaning",
    category: "Exterior",
    basePrice: 140,
    priceNote: "Up to 12 windows",
    icon: AppWindow,
    desc: "Interior & exterior streak-free window washing.",
  },
  {
    id: "auto",
    name: "Auto Detailing",
    category: "Mobile Auto",
    basePrice: 195,
    priceNote: "Full interior & exterior",
    icon: Car,
    desc: "Mobile vehicle wash, wax, vacuum & interior steam clean.",
  },
  {
    id: "bin",
    name: "Trash Bin Cleaning",
    category: "Sanitation",
    basePrice: 55,
    priceNote: "2 bins high-pressure wash",
    icon: Trash2,
    desc: "Sanitize & deodorize dirty trash & recycle bins.",
  },
  {
    id: "landscaping",
    name: "Landscaping & Yard Care",
    category: "Lawn",
    basePrice: 120,
    priceNote: "Mowing, edging & cleanup",
    icon: Leaf,
    desc: "Lawn maintenance, trimming, flowerbed edging & clean-up.",
  },
  {
    id: "commercial",
    name: "Commercial Cleaning",
    category: "Commercial",
    basePrice: 200,
    priceNote: "Office / storefront",
    icon: Building2,
    desc: "Scheduled office, retail, or facility cleaning.",
  },
];

export interface AddonDef {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  forServices: string[]; // service IDs where this cross-sell is relevant
  desc: string;
}

export const CROSS_SELL_ADDONS: AddonDef[] = [
  {
    id: "bin_add",
    name: "Trash Bin Cleaning & Sanitization",
    price: 35,
    originalPrice: 55,
    badge: "Popular 35% Off",
    forServices: ["cleaning", "junk", "power", "landscaping"],
    desc: "We high-pressure wash & sanitize your bins right after service.",
  },
  {
    id: "window_add",
    name: "Exterior Window Polish (Up to 10 Windows)",
    price: 85,
    originalPrice: 110,
    badge: "Save $25",
    forServices: ["cleaning", "power"],
    desc: "Sparkling streak-free glass while we're already at your property.",
  },
  {
    id: "deep_oven",
    name: "Oven & Microwave Interior Deep Scrub",
    price: 40,
    originalPrice: 50,
    badge: "Popular Add-on",
    forServices: ["cleaning"],
    desc: "Remove baked-on grease and odors from appliances.",
  },
  {
    id: "driveway_seal",
    name: "Driveway Surface Sealant",
    price: 95,
    originalPrice: 130,
    badge: "Save 25%",
    forServices: ["power"],
    desc: "Protective clear seal applied after power washing.",
  },
  {
    id: "garage_sweep",
    name: "Garage Floor Sweep & De-clutter",
    price: 45,
    originalPrice: 65,
    badge: "Great Pair",
    forServices: ["junk"],
    desc: "Deep sweep and organize garage space after junk haul.",
  },
  {
    id: "gutter_clean",
    name: "Gutter Cleanout & Flush",
    price: 85,
    originalPrice: 115,
    badge: "Seasonal Deal",
    forServices: ["landscaping", "power"],
    desc: "Clear leaves, twigs, and flushing downspouts.",
  },
  {
    id: "headlight_resto",
    name: "Headlight Oxidation Restoration",
    price: 40,
    originalPrice: 60,
    badge: "Save $20",
    forServices: ["auto"],
    desc: "Restore cloudy headlight lenses to crystal clarity.",
  },
];
