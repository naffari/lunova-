import { Phone, CalendarCheck } from "lucide-react";
import { Link } from "react-router";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";

/**
 * Persistent bottom action bar shown only on mobile viewports, giving
 * visitors a one-tap path to book or call from anywhere on the site.
 * Hidden on the booking flow itself (Root.tsx), since that
 * page already is the conversion action.
 */
export default function MobileCTABar() {
  return (
    <div
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border flex items-stretch gap-2 px-3 pt-2.5"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:+1${PHONE}`}
        aria-label={`Call us at ${PHONE_DISPLAY}`}
        className="flex-1 flex items-center justify-center gap-2 font-semibold text-sm px-4 py-3 rounded-full border-2 border-border text-foreground"
      >
        <Phone size={16} />
        Call
      </a>
      <Link
        to="/book"
        className="flex-[1.4] flex items-center justify-center gap-2 font-bold text-sm px-4 py-3 rounded-full bg-primary text-primary-foreground"
      >
        <CalendarCheck size={16} />
        Book Now
      </Link>
    </div>
  );
}
