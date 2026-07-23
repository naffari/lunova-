import { Phone, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router";
import { PHONE } from "../constants/contact";

interface BookingSuccessState {
  bookingId?: string;
  serviceName?: string;
  addonsCount?: number;
  date?: string;
  timeSlot?: string;
  finalTotal?: number;
  phone?: string;
}

export default function BookingSuccess() {
  const location = useLocation();
  const state = (location.state as BookingSuccessState | null) ?? {};
  const { bookingId, serviceName, addonsCount, date, timeSlot, finalTotal, phone } = state;

  return (
    <>
      <Helmet>
        <title>Booking Confirmed | Lunova Services</title>
        <meta name="description" content="Your Lunova service booking has been received. A dispatcher will text you shortly to confirm arrival details." />
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
        <section className="relative pt-24 pb-14 px-4 sm:px-6 overflow-hidden border-b border-border bg-gradient-to-b from-[#0a1628] to-background">
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
              Booking Confirmed
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-6xl font-bold text-foreground uppercase leading-tight mt-4 mb-3"
            >
              You're <span className="text-primary">All Set!</span>
            </h1>
          </div>
        </section>

        <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Sparkles size={32} />
              </div>
              {bookingId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Reference ID: <strong className="text-foreground">{bookingId}</strong>
                </p>
              )}
            </div>

            {serviceName && (
              <div className="bg-secondary border border-border rounded-xl p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-semibold text-foreground">{serviceName}</span>
                </div>
                {!!addonsCount && addonsCount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Add-ons:</span>
                    <span className="text-primary font-medium">{addonsCount} bundled items</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-semibold text-foreground">{date || "First available"} ({timeSlot})</span>
                </div>
                {finalTotal !== undefined && (
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-bold text-foreground">Total:</span>
                    <span style={{ fontFamily: "var(--font-display)" }} className="font-bold text-primary text-xl">
                      ${finalTotal}
                    </span>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mb-6">
              A Lunova dispatcher will text you{phone ? ` at ${phone}` : ""} to confirm crew arrival details.
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
      </div>
    </>
  );
}
