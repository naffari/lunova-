import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clientIp, escapeHtml, isBot, isEmail, isRateLimited } from "./_guard.js";
import { FROM_CUSTOMER, FROM_INTERNAL, INTERNAL_INBOX, customerEmailShell, sendMail } from "./_mail.js";

/**
 * Out-of-area signups from the ZIP coverage checker.
 *
 * WHY THIS EXISTS: the checker already asked for an email and already told the
 * visitor "we'll email you the moment we start running routes near 64111". The
 * handler behind it fired an analytics event and did nothing else, so the
 * address went to Umami, the promise on screen was never kept, and every signal
 * about where to expand next was thrown away. This endpoint is the missing half.
 *
 * Not routed into the CRM. `createLead` requires a full address on a servable
 * ZIP, and a waitlist signup has neither. Forcing one in would put junk records
 * in the pipeline the crew works from. Email is the right destination until
 * there is somewhere real to put these.
 */

interface WaitlistPayload {
  email: string;
  zip: string;
  /**
   * Which parked service the signup is asking for, as a display name.
   *
   * The ZIP waitlist answers "when will you reach my street". This one answers
   * "when will you offer the thing I came here for", and the two are worth
   * telling apart: a stack of signups against one service is the cheapest
   * possible read on which line to bring back first, and it is demand that has
   * already found the site rather than demand somebody guessed at.
   *
   * Optional, so the existing ZIP form keeps working unchanged.
   */
  service?: string;
  /** Honeypot. Any value means an automated submission. */
  website?: string;
}

/** Lower than the booking limit. Nobody legitimately joins a waitlist 5 times. */
const RATE_LIMIT_MAX = 3;

function internalHtml(email: string, zip: string, service?: string): string {
  const heading = service
    ? `Service waitlist: ${escapeHtml(service)}`
    : `Waitlist signup, ZIP ${escapeHtml(zip)}`;
  const intro = service
    ? `Someone asked to be told when <strong>${escapeHtml(service)}</strong> is available.`
    : "Someone outside the current service area asked to be told when we expand.";
  const footer = service
    ? "Count these by service. A stack against one line is the signal to bring it back."
    : "Worth tracking which ZIPs repeat. That is the cheapest expansion signal available.";

  return `
    <div style="font-family:sans-serif;max-width:520px;">
      <h2 style="margin-bottom:4px;">${heading}</h2>
      <p style="color:#666;font-size:13px;margin-top:0;">${intro}</p>
      <p style="font-size:14px;">
        ${service ? `<strong>Service:</strong> ${escapeHtml(service)}<br/>` : ""}
        <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br/>
        <strong>ZIP:</strong> ${escapeHtml(zip)}
      </p>
      <p style="color:#666;font-size:12px;">${footer}</p>
    </div>
  `;
}

function customerHtml(zip: string, service?: string): string {
  if (service) {
    return customerEmailShell(
      "You're on the list",
      `
        <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
          Thanks for the note. We are not offering ${escapeHtml(service)} yet, so we have not
          promised you a booking. What we have done is put you on the list.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
          Lunova is new and deliberately small: two people who would rather do two things properly
          than eight things badly. We add a service when we have the kit and the practice to stand
          behind it, and you will hear from us when this one is ready. Nothing else will be sent to
          you in the meantime.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0;">
          What we do today is house cleaning and mobile detailing, across the Kansas City metro. If
          either of those is useful, everything is on the site.
        </p>
      `
    );
  }

  return customerEmailShell(
    "You're on the list",
    `
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
        Thanks for the note. ${escapeHtml(zip)} is outside the routes we run today, so we have not
        promised you a booking. What we have done is put you on the list.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
        We add areas when enough requests come from the same direction to make a route work. If that
        happens near you, you will hear from us. If it does not, you will not get anything else from
        us, and there is no list to unsubscribe from beyond this one.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0;">
        In the meantime, if you are on the edge of the metro it is worth calling. Jobs a little
        beyond our standing routes are often still workable and the phone sorts that out faster than
        a ZIP lookup can.
      </p>
    `
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const body = (req.body ?? {}) as Partial<WaitlistPayload>;

  // Silent 200, same reasoning as the booking endpoint: a bot that sees success
  // stops probing, where a 400 tells it to retry with the honeypot left blank.
  if (isBot(body)) {
    console.warn("Waitlist signup dropped: honeypot field was filled.");
    return res.status(200).json({ ok: true });
  }

  const ip = clientIp(req);
  if (isRateLimited("waitlist", ip, RATE_LIMIT_MAX)) {
    console.warn(`Waitlist rate limit hit for ${ip}.`);
    return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
  }

  if (!isEmail(body.email)) {
    return res.status(400).json({ ok: false, error: "Enter a valid email address." });
  }

  const email = body.email.trim().slice(0, 200);
  const zip = String(body.zip ?? "").replace(/\D/g, "").slice(0, 5) || "unknown";
  const service = String(body.service ?? "").trim().slice(0, 80) || undefined;

  // The internal copy is what makes this a captured lead. The customer copy is
  // what makes the on-screen promise true. Sent together, and a failure on the
  // customer copy alone must not report failure to the visitor.
  const [notified] = await Promise.all([
    sendMail({
      to: INTERNAL_INBOX,
      from: FROM_INTERNAL,
      subject: service ? `Service waitlist: ${service}` : `Waitlist signup, ZIP ${zip}`,
      replyTo: email,
      html: internalHtml(email, zip, service),
    }),
    sendMail({
      to: email,
      from: FROM_CUSTOMER,
      subject: "You're on the Lunova waitlist",
      html: customerHtml(zip, service),
    }),
  ]);

  if (!notified) {
    console.error(`Waitlist signup for ${service ?? zip} was not delivered to ${INTERNAL_INBOX}.`);
    return res.status(502).json({ ok: false, error: "Could not save your details. Please try again." });
  }

  return res.status(200).json({ ok: true });
}
