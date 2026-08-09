import type { VercelRequest } from "@vercel/node";

/**
 * Shared abuse guards for the public form endpoints.
 *
 * Extracted from booking.ts when the waitlist endpoint was added. Two copies of
 * a rate limiter is how one of them ends up with a different window and nobody
 * notices which.
 */

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * In-memory rate limiter, keyed on client IP.
 *
 * Simple on purpose. This runs on Vercel's serverless runtime, so the map lives
 * only for the lifetime of one warm instance and resets on cold start. That
 * covers the actual threat, which is a bot hammering a form in a burst and
 * hitting the same warm instance. It is NOT a security control and it is not a
 * substitute for a durable store (Upstash/KV) if abuse becomes sustained.
 *
 * Each endpoint gets its own bucket so a burst of waitlist signups cannot lock
 * a real customer out of the booking form.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, Map<string, number[]>>();

export function clientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || "unknown";
}

export function isRateLimited(bucket: string, ip: string, max: number): boolean {
  let submissions = buckets.get(bucket);
  if (!submissions) {
    submissions = new Map<string, number[]>();
    buckets.set(bucket, submissions);
  }

  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= max) {
    submissions.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissions.set(ip, recent);

  // Opportunistic cleanup so a long-lived instance cannot grow unbounded.
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
 * The forms render a field that is hidden from humans and left empty by them.
 * Bots that fill every input will populate it. Anything with a value here gets
 * dropped, and answered with a normal 200 so the bot records a success and does
 * not retry with a different strategy.
 *
 * Named `website` because that is a field bots expect to find and fill.
 */
export function isBot(body: { website?: unknown }): boolean {
  return isNonEmptyString(body.website);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Loose enough to accept anything deliverable, strict enough to reject junk. */
export function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
