import { Check, CheckCircle2, Mail, MapPin, Phone, Sparkles, User } from "lucide-react";
import { PRIMARY_SERVICES } from "../../utils/bookingData";
import BookingCalendar from "./BookingCalendar";
import { useBooking } from "./BookingContext";
import BookingSummary from "./BookingSummary";

export default function BookingForm() {
  const {
    primaryId,
    setPrimaryId,
    selectedAddons,
    toggleAddon,
    rushOption,
    setRushOption,
    relevantAddons,
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
    errors,
    handleBookingSubmit,
  } = useBooking();

  return (
    <form onSubmit={handleBookingSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
      {/* ---- LEFT: Selection Steps ---- */}
      <div className="space-y-10">
        {/* STEP 1: Select Service */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              1
            </span>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                Select Service
              </h2>
              <p className="text-muted-foreground text-xs">Choose the primary work needed</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {PRIMARY_SERVICES.map((s) => {
              const Icon = s.icon;
              const active = primaryId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPrimaryId(s.id)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                    active
                      ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                      : "border-border bg-secondary/60 hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={active ? "text-primary" : "text-muted-foreground"} />
                    {active && <CheckCircle2 size={18} className="text-primary" />}
                  </div>
                  <p className="font-bold text-sm text-foreground mb-1">{s.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.desc}</p>
                  <div className="mt-auto pt-2 border-t border-border/50 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-primary">
                      ${s.basePrice}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Cross-Sell Add-ons Engine */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                  Recommended Add-ons &amp; Cross-Sells
                </h2>
                <p className="text-muted-foreground text-xs">Bundle 2+ services for an instant 10% total discount!</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles size={14} /> 10% Bundle Discount
            </span>
          </div>

          {relevantAddons.length > 0 ? (
            <div className="space-y-3 mb-6">
              {relevantAddons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border cursor-pointer transition-all gap-4 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-secondary/40 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-primary-foreground" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">{addon.name}</span>
                          {addon.badge && (
                            <span className="text-[11px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded">
                              {addon.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">{addon.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-8 sm:ml-0">
                      {addon.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${addon.originalPrice}
                        </span>
                      )}
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-primary">
                        +${addon.price}
                      </span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {isSelected ? "Added" : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mb-4">No additional cross-sells for this service.</p>
          )}

          {/* Rush option */}
          <div
            onClick={() => setRushOption(!rushOption)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              rushOption ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                  rushOption ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {rushOption && <Check size={12} className="text-primary-foreground" />}
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground">Same-Day / Rush Priority Booking</span>
                <p className="text-muted-foreground text-xs">Dispatch closest crew within 2–4 hours</p>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-primary">
              +$30
            </span>
          </div>
        </div>

        {/* STEP 3: Date & Time Picker */}
        <BookingCalendar />

        {/* STEP 4: Customer Details & Service Address */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              4
            </span>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                Contact &amp; Location
              </h2>
              <p className="text-muted-foreground text-xs">Where should our crew arrive?</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Full Name *</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Email Address *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  required
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Phone Number *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  required
                  type="tel"
                  placeholder="(816) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Zip Code *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  required
                  placeholder="64111"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-foreground mb-1">Street Address</label>
            <input
              placeholder="1234 Main St, Kansas City, MO"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Access Notes or Gate Code (Optional)</label>
            <textarea
              rows={2}
              placeholder="Side gate code 1234, park in driveway..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* ---- RIGHT: Summary & Checkout Card ---- */}
      <BookingSummary />
    </form>
  );
}
