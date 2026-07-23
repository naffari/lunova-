import { Home, Trash2, Droplets, AppWindow, Car, Leaf, Building2 } from "lucide-react";
import type { ElementType } from "react";

export interface QuoteServiceDef {
  id: string;
  label: string;
  icon: ElementType;
  desc: string;
}

export const SERVICES: QuoteServiceDef[] = [
  { id: "cleaning", label: "Residential Cleaning", icon: Home, desc: "Standard, deep, move-in/out" },
  { id: "junk", label: "Junk Removal", icon: Trash2, desc: "Single item to full truckload" },
  { id: "power", label: "Power Washing", icon: Droplets, desc: "Siding, driveway, deck/patio" },
  { id: "window", label: "Window Cleaning", icon: AppWindow, desc: "Interior & exterior, hard water" },
  { id: "auto", label: "Auto Detailing", icon: Car, desc: "Interior, exterior, full detail" },
  { id: "bin", label: "Bin Cleaning", icon: Trash2, desc: "2-bin service, recurring plans" },
  { id: "landscaping", label: "Landscaping", icon: Leaf, desc: "Custom lawn care & clean-ups" },
  { id: "commercial", label: "Commercial Cleaning", icon: Building2, desc: "Office, restaurant, medical" },
];

/**
 * Instant-quote pricing engine (real Lunova rate sheet). Returns a
 * [low, high] estimated price range for a given service + option set.
 */
export function priceFor(
  service: string,
  opts: Record<string, unknown>
): [number, number] {
  if (service === "cleaning") {
    const sqft = (opts.sqft as number) || 1000;
    const rateMap: Record<string, number> = {
      recurring: 0.13,
      standard: 0.16,
      deep: 0.22,
      move: 0.28,
    };
    const minMap: Record<string, number> = {
      recurring: 130,
      standard: 150,
      deep: 220,
      move: 250,
    };
    const type = (opts.type as string) || "standard";
    const raw = sqft * (rateMap[type] ?? 0.16);
    const min = minMap[type] ?? 150;
    const base = Math.max(raw, min);
    return [Math.round(base * 0.95), Math.round(base * 1.05)];
  }
  if (service === "junk") {
    const map: Record<string, [number, number]> = {
      single: [99, 130],
      quarter: [175, 200],
      half: [299, 340],
      three_quarter: [425, 470],
      full: [550, 600],
    };
    const load = (opts.load as string) || "quarter";
    let [lo, hi] = map[load] ?? [99, 130];
    if (opts.rush) { lo += 30; hi += 30; }
    if (opts.stairs) { lo += 25; hi += 50; }
    return [lo, hi];
  }
  if (service === "power") {
    const sqft = (opts.sqft as number) || 500;
    const rateMap: Record<string, number> = {
      house: 0.2,
      driveway: 0.18,
      deck: 0.2,
    };
    const minMap: Record<string, number> = {
      house: 175,
      driveway: 100,
      deck: 120,
    };
    const surface = (opts.surface as string) || "driveway";
    const raw = sqft * (rateMap[surface] ?? 0.2);
    const min = minMap[surface] ?? 100;
    const base = Math.max(raw, min);
    return [Math.round(base * 0.95), Math.round(base * 1.05)];
  }
  if (service === "window") {
    const count = (opts.count as number) || 10;
    const base = Math.max(count * 10, 150);
    const screens = opts.screens ? count * 3 : 0;
    const hard = opts.hardwater ? count * 15 : 0;
    return [base + screens + hard, Math.round((base + screens + hard) * 1.05)];
  }
  if (service === "auto") {
    const pkgMap: Record<string, [number, number]> = {
      exterior: [95, 105],
      interior: [135, 145],
      full: [215, 230],
      full_suv: [255, 270],
    };
    const pkg = (opts.pkg as string) || "full";
    let [lo, hi] = pkgMap[pkg] ?? [215, 230];
    if (opts.mobile) { lo += 25; hi += 25; }
    return [lo, hi];
  }
  if (service === "bin") {
    const plan = (opts.plan as string) || "onetime";
    const extraBins = (opts.extraBins as number) || 0;
    const baseMap: Record<string, number> = {
      onetime: 55,
      monthly: 28,
      quarterly: 45,
    };
    const base = baseMap[plan] ?? 55;
    return [base + extraBins * 8, base + extraBins * 8];
  }
  return [0, 0];
}
