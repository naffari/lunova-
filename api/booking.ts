import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

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
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const body = (req.body ?? {}) as Partial<BookingPayload>;
  const validationError = validate(body);
  if (validationError) {
    return res.status(400).json({ ok: false, error: validationError });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return res.status(500).json({ ok: false, error: "Email service is not configured." });
  }

  const bookingId = `LUNOVA-${Date.now()}`;
  const payload = body as BookingPayload;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Lunova Booking <bookings@lunovaservices.com>",
      to: EMAIL,
      replyTo: isNonEmptyString(payload.email) ? payload.email : undefined,
      subject: `Booking request — ${payload.categoryLabel || payload.category}`,
      html: buildEmailHtml(payload, bookingId),
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ ok: false, error: "Failed to send booking email." });
    }

    return res.status(200).json({ ok: true, bookingId });
  } catch (err) {
    console.error("Booking submission failed:", err);
    return res.status(500).json({ ok: false, error: "Unexpected server error." });
  }
}
