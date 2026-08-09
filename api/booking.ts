import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildRequestedWindow,
  createLead,
  isCrmConfigured,
  normalizeZip,
  resolveServiceSlug,
  splitCityState,
} from "./_crm.js";
import {
  clientIp,
  escapeHtml,
  isBot,
  isEmail,
  isNonEmptyString,
  isRateLimited,
} from "./_guard.js";
import {
  FROM_CUSTOMER,
  FROM_INTERNAL,
  INTERNAL_INBOX,
  customerEmailShell,
  sendMail,
} from "./_mail.js";

interface BookingPayload {
  category: string;
  categoryLabel: string;
  subservices: string[];
  addons: string[];
  frequency: string;
  notes: string;
  date: string;
  timeWindow: string;
  street: string;
  city: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
  hearAbout: string;
  /**
   * The floor figure the customer was shown in the wizard's running estimate,
   * after any bundle discount. Recorded so the crew quotes from the same number
   * the customer already saw — not so it can be treated as an agreed price.
   */
  estimateFloor?: number;
  /** True when a selected line genuinely needs a site visit to price. */
  estimateHasCustomItems?: boolean;
  /**
   * Honeypot. Hidden from humans, so any value means an automated submission.
   * Named `website` because that is a field bots expect to find and fill.
   */
  website?: string;
}

function formatEstimate(body: BookingPayload): string {
  if (typeof body.estimateFloor !== "number" || body.estimateFloor <= 0) {
    return "Custom quote, needs a site visit";
  }
  const base = `$${body.estimateFloor}+ (floor shown to customer)`;
  return body.estimateHasCustomItems ? `${base}, plus items needing a site visit` : base;
}

/** Bookings per IP per 10 minutes. See _guard.ts for why this is in memory. */
const RATE_LIMIT_MAX = 5;

function validate(body: Partial<BookingPayload>): string | null {
  if (!isNonEmptyString(body.category)) return "Missing service category.";
  if (!Array.isArray(body.subservices) || body.subservices.length === 0) {
    return "Select at least one subservice.";
  }
  if (!isNonEmptyString(body.date)) return "Missing preferred date.";
  if (!isNonEmptyString(body.timeWindow)) return "Missing preferred time window.";
  if (!isNonEmptyString(body.street)) return "Missing street address.";
  if (!isNonEmptyString(body.city)) return "Missing city.";
  if (!isNonEmptyString(body.name)) return "Missing name.";
  if (!isNonEmptyString(body.phone)) return "Missing phone number.";
  if (!isNonEmptyString(body.email)) return "Missing email.";
  if (!isEmail(body.email)) return "Enter a valid email address.";
  return null;
}

function buildCrmMessage(body: BookingPayload): string {
  const lines = [
    `Service: ${body.categoryLabel || body.category}`,
    `Selected: ${body.subservices.join(", ")}`,
  ];
  if (body.addons.length > 0) lines.push(`Add-ons: ${body.addons.join(", ")}`);
  lines.push(`Estimate shown: ${formatEstimate(body)}`);
  if (body.frequency) lines.push(`Frequency: ${body.frequency}`);
  if (body.timeWindow) lines.push(`Preferred window: ${body.date} (${body.timeWindow})`);
  if (body.hearAbout) lines.push(`Heard about us: ${body.hearAbout}`);
  if (body.notes) lines.push(`Notes: ${body.notes}`);
  return lines.join("\n").slice(0, 2000);
}

/**
 * Pushes the booking into the CRM as a customer + lead. Never throws: the
 * emailed booking is the source of truth for the crew, so a CRM outage must
 * not turn a captured lead into an error screen for the customer.
 */
async function sendToCrm(body: BookingPayload): Promise<string | null> {
  if (!isCrmConfigured()) {
    console.warn("WEBSITE_API_KEY is not configured; skipping CRM lead creation.");
    return null;
  }

  const zip = normalizeZip(body.zip);
  if (!zip) {
    console.warn("Booking has no valid ZIP; skipping CRM lead creation.");
    return null;
  }

  const { city, state } = splitCityState(body.city);
  const window = buildRequestedWindow(body.date, body.timeWindow);

  try {
    const lead = await createLead({
      name: body.name.slice(0, 120),
      phone: body.phone,
      email: body.email,
      address: { line1: body.street, city, state, zip },
      service_slug: resolveServiceSlug(body.category, body.frequency),
      message: buildCrmMessage(body),
      requested_window_start: window?.start,
      requested_window_end: window?.end,
    });
    return lead.id;
  } catch (err) {
    console.error("CRM lead creation failed:", err);
    return null;
  }
}

function buildEmailHtml(body: BookingPayload, bookingId: string): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px;">${escapeHtml(label)}</td><td style="padding:4px 0;font-size:13px;"><strong>${escapeHtml(value || "Not given")}</strong></td></tr>`;

  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin-bottom:4px;">New booking request: ${escapeHtml(body.categoryLabel || body.category)}</h2>
      <p style="color:#666;font-size:12px;margin-top:0;">Booking ID: ${escapeHtml(bookingId)}</p>
      <table>
        ${row("Service", body.categoryLabel || body.category)}
        ${row("Selected", body.subservices.join(", "))}
        ${row("Add-ons", body.addons.join(", ") || "None")}
        ${row("Estimate shown", formatEstimate(body))}
        ${row("Frequency", body.frequency)}
        ${row("Date & time", `${body.date} (${body.timeWindow})`)}
        ${row("Address", [body.street, body.city, body.zip].filter(Boolean).join(", "))}
        ${row("Name", body.name)}
        ${row("Phone", body.phone)}
        ${row("Email", body.email)}
        ${row("Heard about us", body.hearAbout)}
        ${row("Notes", body.notes)}
      </table>
    </div>
  `;
}

/**
 * Emails the booking to the crew. Like `sendToCrm`, never throws: the two
 * destinations are independent, and one being down must not cost us the other.
 */
async function sendEmail(body: BookingPayload, bookingId: string): Promise<boolean> {
  return sendMail({
    to: INTERNAL_INBOX,
    from: FROM_INTERNAL,
    replyTo: isNonEmptyString(body.email) ? body.email : undefined,
    subject: `Booking request: ${body.categoryLabel || body.category}`,
    html: buildEmailHtml(body, bookingId),
  });
}

/**
 * The customer's copy of what they just booked.
 *
 * WHY: before this, a booking ended at a confirmation screen and nothing else.
 * Close the tab and there was no record the request existed, no booking ID to
 * quote, and nothing in the inbox to prove a real company received it. For a
 * new business with no reviews, a receipt is one of the few trust signals
 * available, and it costs one email.
 *
 * Deliberately does NOT ask for a review. That comes after the job is done,
 * through api/review-request.ts. Asking now would be asking someone to rate work
 * that has not happened.
 */
function buildCustomerHtml(body: BookingPayload, bookingId: string): string {
  const line = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:5px 14px 5px 0;color:#7A7166;font-size:13px;vertical-align:top;">${escapeHtml(label)}</td>
           <td style="padding:5px 0;font-size:13px;color:#211D17;"><strong>${escapeHtml(value)}</strong></td>
         </tr>`
      : "";

  const schedule = [body.date, body.timeWindow].filter(Boolean).join(", ");
  const address = [body.street, body.city, body.zip].filter(Boolean).join(", ");

  return customerEmailShell(
    `We've got your ${escapeHtml(body.categoryLabel || body.category)} request`,
    `
      <p style="font-size:15px;line-height:1.6;margin:0 0 18px;">
        Thanks ${escapeHtml((body.name || "").split(" ")[0] || "")}. Nothing is booked or charged
        yet. We will call you within one business hour to confirm the slot and agree the price, and
        the job is only on the calendar once you have said yes on that call.
      </p>

      <table style="border-collapse:collapse;margin:0 0 18px;">
        ${line("Reference", bookingId)}
        ${line("Service", body.categoryLabel || body.category)}
        ${line("Selected", body.subservices.join(", "))}
        ${line("Add-ons", body.addons.join(", "))}
        ${line("Estimate shown", formatEstimate(body))}
        ${line("Preferred time", schedule)}
        ${line("Address", address)}
      </table>

      <p style="font-size:13px;line-height:1.6;color:#7A7166;margin:0 0 14px;">
        The estimate above is the floor price you saw while booking, not a final quote. If anything
        on site changes it, we tell you before we start, not after we finish.
      </p>
      <p style="font-size:13px;line-height:1.6;color:#7A7166;margin:0;">
        Need to change something? Reply to this email or call us. Free to cancel or reschedule up to
        24 hours before your appointment.
      </p>
    `
  );
}

/**
 * Sends the customer their receipt. Failure is logged and ignored: the booking
 * has already landed with the crew, and a bounced confirmation is not a reason
 * to show the customer an error for a request we successfully received.
 */
async function sendCustomerConfirmation(body: BookingPayload, bookingId: string): Promise<boolean> {
  if (!isEmail(body.email)) return false;

  return sendMail({
    to: body.email.trim(),
    from: FROM_CUSTOMER,
    replyTo: INTERNAL_INBOX,
    subject: `Booking request received (${bookingId})`,
    html: buildCustomerHtml(body, bookingId),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const body = (req.body ?? {}) as Partial<BookingPayload>;

  // Silent 200: a bot that sees success stops probing. A 400 tells it to retry
  // with the honeypot left blank, which is the opposite of what we want.
  if (isBot(body)) {
    console.warn("Booking dropped: honeypot field was filled.");
    return res.status(200).json({ ok: true, bookingId: `LUNOVA-${Date.now()}` });
  }

  const ip = clientIp(req);
  if (isRateLimited("booking", ip, RATE_LIMIT_MAX)) {
    console.warn(`Booking rate limit hit for ${ip}.`);
    return res.status(429).json({
      ok: false,
      error: "Too many requests. Please wait a few minutes or call us directly.",
    });
  }

  const validationError = validate(body);
  if (validationError) {
    return res.status(400).json({ ok: false, error: validationError });
  }

  const bookingId = `LUNOVA-${Date.now()}`;
  const payload = body as BookingPayload;

  try {
    // Three destinations, all attempted regardless of each other's outcome.
    //
    // The first two are what "we received the booking" means: the crew email
    // and the CRM lead. Either one landing is enough. The customer confirmation
    // is a courtesy on top and is explicitly NOT part of that test, because a
    // bounced receipt is not a reason to tell someone their booking failed when
    // the crew already has it.
    const [emailed, leadId, confirmed] = await Promise.all([
      sendEmail(payload, bookingId),
      sendToCrm(payload),
      sendCustomerConfirmation(payload, bookingId),
    ]);

    if (!emailed && !leadId) {
      console.error(`Booking ${bookingId} landed nowhere: email and CRM both failed.`);
      return res.status(502).json({ ok: false, error: "Failed to submit your booking request." });
    }

    if (!emailed) console.warn(`Booking ${bookingId}: CRM lead ${leadId} created, email failed.`);
    if (!leadId) console.warn(`Booking ${bookingId}: emailed, but no CRM lead created.`);
    if (!confirmed) console.warn(`Booking ${bookingId}: customer confirmation not delivered.`);

    return res.status(200).json({ ok: true, bookingId, leadId });
  } catch (err) {
    console.error("Booking submission failed:", err);
    return res.status(500).json({ ok: false, error: "Unexpected server error." });
  }
}
