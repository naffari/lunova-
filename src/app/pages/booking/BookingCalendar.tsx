import { Calendar as CalendarIcon } from "lucide-react";
import { useBooking } from "./BookingContext";

export default function BookingCalendar() {
  const { date, setDate, timeSlot, setTimeSlot } = useBooking();

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
          3
        </span>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
            Choose Preferred Date &amp; Time
          </h2>
          <p className="text-muted-foreground text-xs">We will confirm exact arrival window</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="booking-date" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Preferred Date
          </label>
          <div className="relative">
            <CalendarIcon size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
            <input
              id="booking-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div>
          <p id="booking-timeslot-label" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Arrival Window Slot
          </p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="booking-timeslot-label">
            {[
              { id: "morning", label: "Morning", sub: "8am–12pm" },
              { id: "afternoon", label: "Afternoon", sub: "12pm–4pm" },
              { id: "evening", label: "Evening", sub: "4pm–7pm" },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={timeSlot === slot.id}
                onClick={() => setTimeSlot(slot.id)}
                className={`p-2.5 rounded-lg border text-center transition-colors ${
                  timeSlot === slot.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <p className="font-bold text-xs">{slot.label}</p>
                <p className="text-[10px] opacity-80">{slot.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
