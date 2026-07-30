import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import {
  buildRequestedWindow,
  createLead,
  isCrmConfigured,
  normalizeZip,
  resolveServiceSlug,
  splitCityState,
} from "./_crm.js";

const EMAIL = "naffari@myyahoo.com";

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
    return "Custom quote — needs a site visit";
  }
  const base = `$${body.estimateFloor}+ (floor shown to customer)`;
  return body.estimateHasCustomItems ? `${base}, plus items needing a site visit` : base;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * In-memory rate limiter, keyed on client IP.
 *
 * Deliberately simple: this runs on Vercel's serverless runtime, so the map
 * lives only for the lifetime of one warm instance and resets on cold start.
 * That is fine for the actual threat — a bot hammering the form in a burst hits
 * the same warm instance. It is NOT a security control, and it is not a
 * substitute for a durable store (Upstash/KV) if abuse becomes sustained.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, number[]>();

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissions.set(ip, recent);

  // Opportunistic cleanup so a long-lived instance can't grow unbounded.
  if (submissions.size > 500) {
    for (const [key, times] of submissions) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) submissions.delete(key);
    }
  }

  return false;
}

/**
 * Honeypot check.
 *
 * The form renders a field that is hidden from humans and left empty by them.
 * Bots that blindly fill every input will populate it. Anything with a value
 * here is dropped — and answered with a normal 200, so the bot records a success
 * and doesn't retry with a different strategy.
 */
function isBot(body: Partial<BookingPayload>): boolean {
  return isNonEmptyString(body.website);
}

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
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
    `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px;">${escapeHtml(label)}</td><td style="padding:4px 0;font-size:13px;"><strong>${escapeHtml(value || "—")}</strong></td></tr>`;

  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin-bottom:4px;">New booking request — ${escapeHtml(body.categoryLabel || body.category)}</h2>
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured; skipping booking email.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Lunova Booking <bookings@lunovaservices.com>",
      to: EMAIL,
      replyTo: isNonEmptyString(body.email) ? body.email : undefined,
      subject: `Booking request — ${body.categoryLabel || body.category}`,
      html: buildEmailHtml(body, bookingId),
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Booking email failed:", err);
    return false;
  }
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
  if (isRateLimited(ip)) {
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
    // Independent destinations: the email reaches the crew, the CRM lead makes
    // the booking trackable. Either one landing means we have the booking, so
    // both are attempted regardless of the other's outcome.
    const [emailed, leadId] = await Promise.all([
      sendEmail(payload, bookingId),
      sendToCrm(payload),
    ]);

    if (!emailed && !leadId) {
      console.error(`Booking ${bookingId} landed nowhere: email and CRM both failed.`);
      return res.status(502).json({ ok: false, error: "Failed to submit your booking request." });
    }

    if (!emailed) console.warn(`Booking ${bookingId}: CRM lead ${leadId} created, email failed.`);
    if (!leadId) console.warn(`Booking ${bookingId}: emailed, but no CRM lead created.`);

    return res.status(200).json({ ok: true, bookingId, leadId });
  } catch (err) {
    console.error("Booking submission failed:", err);
    return res.status(500).json({ ok: false, error: "Unexpected server error." });
  }
}
