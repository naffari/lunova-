import { ArrowRight, Check, Clock, FileText, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import { CROSS_SELL_ADDONS } from "../../utils/bookingData";
import { useBooking } from "./BookingContext";

export default function BookingSummary() {
  const {
    primaryService,
    selectedAddons,
    rushOption,
    hasBundleDiscount,
    bundleDiscount,
    baseSubtotal,
    finalTotal,
    name,
    email,
    phone,
  } = useBooking();

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-foreground uppercase mb-4 flex items-center gap-2">
          <FileText size={18} className="text-primary" /> Booking Summary
        </h3>

        {/* Itemized list */}
        <div className="space-y-3 mb-6 border-b border-border pb-4">
          <div className="flex justify-between items-start text-sm">
            <div>
              <p className="font-semibold text-foreground">{primaryService.name}</p>
              <p className="text-xs text-muted-foreground">{primaryService.priceNote}</p>
            </div>
            <span style={{ fontFamily: "var(--font-display)" }} className="font-bold text-foreground">
              ${baseSubtotal}
            </span>
          </div>

          {selectedAddons.map((addonId) => {
            const item = CROSS_SELL_ADDONS.find((a) => a.id === addonId)!;
            return (
              <div key={addonId} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Check size={12} className="text-primary" /> {item.name}
                </span>
                <span style={{ fontFamily: "var(--font-display)" }} className="font-semibold text-primary">
                  +${item.price}
                </span>
              </div>
            );
          })}

          {rushOption && (
            <div className="flex justify-between items-center text-xs text-primary">
              <span>Same-day priority rush</span>
              <span style={{ fontFamily: "var(--font-display)" }} className="font-semibold">+$30</span>
            </div>
          )}
        </div>

        {/* Bundle discount highlight */}
        {hasBundleDiscount && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between text-xs text-primary font-bold">
              <span className="flex items-center gap-1">
                <Sparkles size={14} /> 10% Bundle Discount
              </span>
              <span>-${bundleDiscount}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Multi-service bundle savings applied automatically!
            </p>
          </div>
        )}

        {/* Total display */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Total Estimate
            </span>
            <p className="text-[11px] text-muted-foreground">Pay after work complete</p>
          </div>
          <div className="text-right">
            <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-primary">
              ${finalTotal}
            </span>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={!name || !email || !phone}
          className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
        >
          Confirm &amp; Book Appointment <ArrowRight size={18} />
        </button>

        <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <span>No payment required until job completion.</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <span>Free cancellation up to 24h before.</span>
          </div>
        </div>
      </div>

      {/* Support contact box */}
      <div className="bg-secondary/60 border border-border rounded-xl p-5 text-center">
        <p className="text-xs text-muted-foreground mb-2">Prefer to talk directly to a technician?</p>
        <a
          href={`tel:+1${PHONE}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <Phone size={14} /> Call {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
