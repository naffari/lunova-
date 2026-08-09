import type { VercelRequest, VercelResponse } from "@vercel/node";
import { escapeHtml, isEmail, isNonEmptyString } from "./_guard.js";
import { FROM_CUSTOMER, INTERNAL_INBOX, customerEmailShell, sendMail } from "./_mail.js";
import { GOOGLE_BUSINESS } from "../src/app/constants/business.js";
import { GUARANTEE } from "../src/app/constants/proof.js";

/**
 * Sends a finished-job customer their review link.
 *
 * WHY THIS IS AN ENDPOINT AND NOT A CRON: the website has no idea when a job
 * finishes. The CRM does. So this is a hook the CRM (or a person, or a Zap)
 * calls once the job is marked complete, rather than something that guesses on
 * a timer and emails people mid-job.
 *
 *   POST /api/review-request
 *   Authorization: Bearer $REVIEW_REQUEST_TOKEN
 *   { "name": "Dana", "email": "dana@example.com", "service": "Deep clean" }
 *
 * WHY IT MATTERS: review signals are roughly 16% of local ranking weight, and
 * velocity beats volume, so four fresh reviews a month outweigh fifty old ones.
 * Lunova has none. Nothing else on this list moves local rank as much per unit
 * of effort, and the whole mechanism is one email sent at the right moment.
 *
 * TIMING: send it the day after the job, not the same evening. Same-day asks
 * land while someone is still tidying up after the crew left.
 */

interface ReviewRequestPayload {
  name?: string;
  email: string;
  /** What was done, e.g. "Deep clean" or "Gutter clearing". Used in the copy. */
  service?: string;
}

/**
 * Shared secret, checked on every request.
 *
 * This endpoint sends mail to an arbitrary address on Lunova's behalf, so
 * leaving it open would make it an open relay for anyone who found the URL.
 * Unset means disabled rather than unprotected: a missing token returns 503,
 * never "allow everything".
 */
function isAuthorised(req: VercelRequest): boolean {
  const expected = process.env.REVIEW_REQUEST_TOKEN?.trim();
  if (!expected) return false;

  const header = req.headers.authorization ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  return provided.length > 0 && provided === expected;
}

function reviewHtml(firstName: string, service: string): string {
  const jobLine = service
    ? `the ${escapeHtml(service.toLowerCase())} we did for you`
    : "the job we did for you";

  return customerEmailShell(
    firstName ? `How did we do, ${escapeHtml(firstName)}?` : "How did we do?",
    `
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        Thanks for having us out. If ${jobLine} went well, a short review on Google would genuinely
        help. We are a new local business, so the first handful of reviews carry more weight for us
        than they would for anyone established.
      </p>

      <p style="margin:0 0 22px;">
        <a href="${GOOGLE_BUSINESS.REVIEW_URL}"
           style="display:inline-block;background:#3d6b2e;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:13px 24px;border-radius:999px;">
          Leave a review
        </a>
      </p>

      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        It takes about a minute. If you can mention which service we did and which part of town you
        are in, that helps other people nearby find us.
      </p>

      <p style="font-size:14px;line-height:1.6;margin:0;">
        And if it did not go well, reply to this instead of leaving a review and we will put it
        right. ${escapeHtml(GUARANTEE.terms)}
      </p>
    `
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  if (!process.env.REVIEW_REQUEST_TOKEN?.trim()) {
    console.warn("REVIEW_REQUEST_TOKEN is not set; review request endpoint is disabled.");
    return res.status(503).json({ ok: false, error: "Review requests are not configured." });
  }

  if (!isAuthorised(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const body = (req.body ?? {}) as Partial<ReviewRequestPayload>;

  if (!isEmail(body.email)) {
    return res.status(400).json({ ok: false, error: "A valid email address is required." });
  }

  const firstName = isNonEmptyString(body.name) ? body.name.trim().split(/\s+/)[0].slice(0, 40) : "";
  const service = isNonEmptyString(body.service) ? body.service.trim().slice(0, 60) : "";

  const sent = await sendMail({
    to: body.email.trim(),
    from: FROM_CUSTOMER,
    replyTo: INTERNAL_INBOX,
    subject: firstName ? `${firstName}, how did we do?` : "How did we do?",
    html: reviewHtml(firstName, service),
  });

  if (!sent) {
    return res.status(502).json({ ok: false, error: "Could not send the review request." });
  }

  // Surfaced so a caller can tell whether the link is the direct write-review
  // form or the profile page. It is the profile page until PLACE_ID is set in
  // constants/business.ts, and the direct form converts noticeably better.
  return res.status(200).json({
    ok: true,
    usedDirectReviewLink: Boolean(GOOGLE_BUSINESS.PLACE_ID),
  });
}
