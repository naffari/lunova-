import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router";
import { EMAIL } from "../../constants/contact";
import { PRIMARY_SERVICES, CROSS_SELL_ADDONS, type ServiceDef } from "../../utils/bookingData";

interface BookingContextValue {
  primaryId: string;
  setPrimaryId: (id: string) => void;
  selectedAddons: string[];
  toggleAddon: (id: string) => void;
  rushOption: boolean;
  setRushOption: (v: boolean) => void;

  date: string;
  setDate: (v: string) => void;
  timeSlot: string;
  setTimeSlot: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  zip: string;
  setZip: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;

  bookingConfirmed: boolean;
  setBookingConfirmed: (v: boolean) => void;
  bookingId: string;
  errors: Record<string, string>;

  primaryService: ServiceDef;
  relevantAddons: typeof CROSS_SELL_ADDONS;
  baseSubtotal: number;
  addonsSubtotal: number;
  rushFee: number;
  hasBundleDiscount: boolean;
  bundleDiscount: number;
  finalTotal: number;

  handleBookingSubmit: (e: React.FormEvent) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "cleaning";

  const [primaryId, setPrimaryId] = useState<string>(
    PRIMARY_SERVICES.some((s) => s.id === initialService) ? initialService : "cleaning"
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [rushOption, setRushOption] = useState(false);

  // Booking Details
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Primary service details
  const primaryService = PRIMARY_SERVICES.find((s) => s.id === primaryId)!;

  // Relevant cross-sells
  const relevantAddons = useMemo(() => {
    return CROSS_SELL_ADDONS.filter((a) => a.forServices.includes(primaryId));
  }, [primaryId]);

  // Pricing calculations
  const baseSubtotal = primaryService.basePrice;
  const addonsSubtotal = selectedAddons.reduce((sum, addonId) => {
    const item = CROSS_SELL_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);
  const rushFee = rushOption ? 30 : 0;

  const rawTotal = baseSubtotal + addonsSubtotal + rushFee;

  // Bundle discount applies if 1 or more add-ons selected
  const hasBundleDiscount = selectedAddons.length > 0;
  const bundleDiscount = hasBundleDiscount ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - bundleDiscount;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handlePrimaryChange(id: string) {
    setPrimaryId(id);
    setSelectedAddons([]); // reset add-ons for new service type
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Please enter a valid name";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{5}$/.test(zip)) {
      newErrors.zip = "Please enter a valid 5-digit zip code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const newId = `LN-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(newId);

    // Prepare email string
    const addonNames = selectedAddons
      .map((id) => CROSS_SELL_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const subject = encodeURIComponent(`Booking #${newId} — ${primaryService.name}`);
    const body = encodeURIComponent(
      `Booking Details:\n` +
      `Reference: ${newId}\n` +
      `Service: ${primaryService.name}\n` +
      `Add-ons: ${addonNames || "None"}\n` +
      `Rush Service: ${rushOption ? "Yes (+$30)" : "No"}\n` +
      `Estimated Total: $${finalTotal} (Saved $${bundleDiscount})\n\n` +
      `Customer Information:\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}, ${zip}\n` +
      `Date & Time: ${date || "First available"} (${timeSlot})\n` +
      `Notes: ${notes}\n`
    );

    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    setBookingConfirmed(true);
  }

  return (
    <BookingContext.Provider
      value={{
        primaryId,
        setPrimaryId: handlePrimaryChange,
        selectedAddons,
        toggleAddon,
        rushOption,
        setRushOption,
        date,
        setDate,
        timeSlot,
        setTimeSlot,
        name,
        setName,
        email,
        setEmail,
        phone,
        setPhone,
        address,
        setAddress,
        zip,
        setZip,
        notes,
        setNotes,
        bookingConfirmed,
        setBookingConfirmed,
        bookingId,
        errors,
        primaryService,
        relevantAddons,
        baseSubtotal,
        addonsSubtotal,
        rushFee,
        hasBundleDiscount,
        bundleDiscount,
        finalTotal,
        handleBookingSubmit,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
