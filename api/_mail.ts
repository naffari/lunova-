import { Resend } from "resend";
import { EMAIL, COMPANY_NAME, PHONE_DISPLAY } from "../src/app/constants/contact.js";

/**
 * Outbound email, in one place.
 *
 * Three endpoints send mail now (booking, waitlist, review request) and they
 * all need the same three things: a verified from-address on the domain, a
 * failure that never throws into the request path, and a consistent wrapper so
 * customer-facing mail does not look like three different companies.
 */

/**
 * Where internal notifications land.
 *
 * BOOKING_INBOX overrides the constant. contact.ts still holds a personal
 * address, and moving to a real company inbox should not need a code change and
 * a deploy: set BOOKING_INBOX in the Vercel project and the next request picks
 * it up.
 */
export const INTERNAL_INBOX = process.env.BOOKING_INBOX?.trim() || EMAIL;

/**
 * From-addresses. Both must be on a domain verified in Resend, or delivery
 * fails silently into spam. `bookings@` was already verified for the crew
 * notification; `hello@` is the customer-facing sender.
 */
export const FROM_INTERNAL = `${COMPANY_NAME} Booking <bookings@lunovaservices.com>`;
export const FROM_CUSTOMER = `${COMPANY_NAME} <hello@lunovaservices.com>`;

interface SendMailInput {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends one email. Returns whether it landed. Never throws.
 *
 * Callers decide what a failure means. For a booking it means falling back on
 * the CRM lead; for a review request it means logging and moving on. Neither
 * should surface a stack trace to a customer.
 */
export async function sendMail({ to, from, subject, html, replyTo }: SendMailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured; skipping email:", subject);
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, html, replyTo });
    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

/**
 * Shared shell for customer-facing mail.
 *
 * Inline styles only, and a table-free layout. Every major client strips
 * <style> blocks, and Gmail's clipping at 102KB is easy to hit once a booking
 * summary is inlined, so this stays deliberately small.
 */
export function customerEmailShell(heading: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#211D17;background:#FBF8F0;">
      <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#3d6b2e;margin:0 0 18px;font-weight:700;">
        ${COMPANY_NAME}
      </p>
      <h1 style="font-size:22px;line-height:1.25;margin:0 0 16px;color:#211D17;">${heading}</h1>
      ${bodyHtml}
      <p style="font-size:13px;line-height:1.6;color:#7A7166;margin:28px 0 0;border-top:1px solid rgba(33,29,23,0.12);padding-top:16px;">
        Questions? Call us on <a href="tel:+18163151305" style="color:#3d6b2e;font-weight:600;">${PHONE_DISPLAY}</a>.
        We serve the Kansas City metro, Monday to Saturday.
      </p>
    </div>
  `;
}
