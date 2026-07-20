import { Phone, MessageSquare, Mail } from "lucide-react";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

interface CTABannerProps {
  heading?: string;
  subtext?: string;
}

export default function CTABanner({
  heading = "Ready to Get Started?",
  subtext = "Book today and get a free estimate. We serve the Kansas City metro — same-day slots available.",
}: CTABannerProps) {
  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-5xl md:text-6xl font-bold text-primary-foreground mb-3 uppercase tracking-wide"
        >
          {heading}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">{subtext}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:+1${PHONE}`}
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground text-primary font-bold text-lg hover:bg-primary-foreground/90 transition-colors w-full sm:w-auto justify-center"
          >
            <Phone size={20} />
            {PHONE_DISPLAY}
          </a>
          <a
            href={`sms:+1${PHONE}`}
            className="flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-primary-foreground text-primary-foreground font-bold text-lg hover:bg-primary-foreground/10 transition-colors w-full sm:w-auto justify-center"
          >
            <MessageSquare size={20} />
            Text Us
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-primary-foreground text-primary-foreground font-bold text-lg hover:bg-primary-foreground/10 transition-colors w-full sm:w-auto justify-center"
          >
            <Mail size={20} />
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}
