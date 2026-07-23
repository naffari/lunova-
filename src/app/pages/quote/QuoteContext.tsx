import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { EMAIL } from "../../constants/contact";
import { priceFor, SERVICES } from "../../utils/pricing";

export type QuoteStep = "service" | "details" | "contact";

export interface QuoteContactInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  notes: string;
}

export interface QuoteFormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export const QUOTE_STEP_INDEX: Record<QuoteStep, number> = {
  service: 0,
  details: 1,
  contact: 2,
};

interface QuoteContextValue {
  step: QuoteStep;
  setStep: (step: QuoteStep) => void;
  service: string | null;
  setService: (service: string) => void;
  opts: Record<string, unknown>;
  setOpts: (opts: Record<string, unknown>) => void;
  contact: QuoteContactInfo;
  setContact: (contact: QuoteContactInfo) => void;
  errors: QuoteFormErrors;
  range: [number, number];
  handleSubmit: (e: React.FormEvent) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<QuoteStep>("service");
  const [service, setService] = useState<string | null>(null);
  const [opts, setOpts] = useState<Record<string, unknown>>({
    sqft: 1200,
    type: "standard",
    load: "quarter",
    rush: false,
    stairs: false,
    surface: "driveway",
    count: 10,
    screens: false,
    hardwater: false,
    pkg: "full",
    mobile: false,
    plan: "onetime",
    extraBins: 0,
  });
  const [contact, setContact] = useState<QuoteContactInfo>({
    name: "", email: "", phone: "", date: "", notes: "",
  });
  const [errors, setErrors] = useState<QuoteFormErrors>({});

  const range = service ? priceFor(service, opts) : ([0, 0] as [number, number]);

  function validateForm(): boolean {
    const newErrors: QuoteFormErrors = {};

    if (!contact.name.trim()) {
      newErrors.name = "Name is required";
    } else if (contact.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name";
    }

    if (!contact.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (contact.phone && !/^\d{10}$/.test(contact.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const serviceLabel = SERVICES.find((s) => s.id === service)?.label ?? service;
    const subject = encodeURIComponent(`Quote Request — ${serviceLabel}`);
    const body = encodeURIComponent(
      `Hi Lunova,\n\nI'd like a quote for ${serviceLabel}.\n\nEstimated range: $${range[0]}–$${range[1]}\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nPreferred date: ${contact.date}\nNotes: ${contact.notes}\n`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    navigate("/quote/success", { state: { name: contact.name, range } });
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <QuoteContext.Provider
      value={{ step, setStep, service, setService, opts, setOpts, contact, setContact, errors, range, handleSubmit }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within a QuoteProvider");
  return ctx;
}
