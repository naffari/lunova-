import { Phone, Sparkles, X } from "lucide-react";
import { Link } from "react-router";
import { PHONE } from "../../constants/contact";
import { useBooking } from "./BookingContext";

export default function BookingConfirmation() {
  const {
    bookingConfirmed,
    setBookingConfirmed,
    bookingId,
    primaryService,
    selectedAddons,
    date,
    timeSlot,
    finalTotal,
    phone,
  } = useBooking();

  if (!bookingConfirmed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setBookingConfirmed(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Sparkles size={32} />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Booking Confirmed
          </span>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mt-2">
            You're All Set!
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Reference ID: <strong className="text-foreground">{bookingId}</strong>
          </p>
        </div>

        <div className="bg-secondary border border-border rounded-xl p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-semibold text-foreground">{primaryService.name}</span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Add-ons:</span>
              <span className="text-primary font-medium">{selectedAddons.length} bundled items</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schedule:</span>
            <span className="font-semibold text-foreground">{date || "First available"} ({timeSlot})</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-foreground">Total:</span>
            <span style={{ fontFamily: "var(--font-display)" }} className="font-bold text-primary text-xl">
              ${finalTotal}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-6">
          A Lunova dispatcher will text you at <strong>{phone}</strong> to confirm crew arrival details.
        </p>

        <div className="flex gap-3">
          <a
            href={`tel:+1${PHONE}`}
            className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-lg text-center hover:bg-primary/90 transition-colors"
          >
            Call Support
          </a>
          <Link
            to="/"
            className="flex-1 py-3 border border-border text-foreground font-semibold text-sm rounded-lg text-center hover:bg-secondary transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
