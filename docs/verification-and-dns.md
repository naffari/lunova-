# Verification, DNS and connecting the Business Profile

Concrete steps for the things that live outside the codebase. Your DNS is at
**Spaceship** (nameservers `launch1.spaceship.net` / `launch2.spaceship.net`),
so every record below goes in the same place.

**Where that is:** spaceship.com → sign in → *Domains* → `lunovaservices.com`
→ *Manage* → **Advanced DNS** (sometimes shown as *DNS records*).

As of the last check the apex domain has **no TXT records at all**, which is
why the SPF in §4 matters.

---

## 1. Google Search Console

Both verifications are already in the code and deployed. You do not need to
upload anything — you need to click Verify.

### Option A — the HTML file (already live)

`public/google99eef85b1ad154d3.html` is committed and served. In Search
Console, add a **URL prefix** property for `https://www.lunovaservices.com`,
choose the **HTML file** method, and click Verify. Do not re-upload the file.

> **If verification fails:** it is almost certainly `cleanUrls` in
> `vercel.json`, which makes Vercel redirect `/anything.html` to `/anything`.
> Google may reject the redirect. Use Option B instead — it is the better
> method anyway. Check for yourself with:
>
> ```
> curl -I https://www.lunovaservices.com/google99eef85b1ad154d3.html
> ```
>
> `200` means it works. `308` means use Option B.

### Option B — DNS TXT (recommended)

Better than the file method: it verifies the **whole domain** in one go — www,
apex, http and https, and every subdomain — so you never have to redo it if
the site moves. It is also the only method that covers a Domain property.

1. Search Console → *Add property* → choose **Domain** (the left-hand box), and
   enter `lunovaservices.com` (no `https://`, no `www`).
2. Google shows you a TXT record. It looks like
   `google-site-verification=xxxxxxxxxxxxxxxxxxxxxxxx`.
3. In Spaceship → Advanced DNS → *Add record*:

   | Field | Value |
   | --- | --- |
   | Type | `TXT` |
   | Host / Name | `@` |
   | Value | the full `google-site-verification=…` string Google gave you |
   | TTL | Automatic (or 300) |

4. Save, wait 5–30 minutes, then click **Verify** in Search Console. If it
   fails, wait longer — DNS propagation is genuinely slow sometimes. Check
   progress with:

   ```
   nslookup -type=TXT lunovaservices.com 8.8.8.8
   ```

`@` means "the domain itself". Spaceship may display it as blank or as the
domain name; either is correct. Do **not** type `lunovaservices.com` into the
Host field if the interface already appends the domain — you would end up with
`lunovaservices.com.lunovaservices.com`.

### After verifying, do these three things

They are the entire point of Search Console, and skipping them means the
verification achieved nothing:

1. **Sitemaps → Add a new sitemap →** `sitemap.xml`. It lists 32 URLs and is
   regenerated on every build.
2. **URL Inspection** → paste `https://www.lunovaservices.com/` → *Request
   indexing*. Repeat for `/book` and `/contact`. This is a queue jump, not a
   guarantee, but it usually turns weeks into days.
3. Come back in 3–4 days and read **Pages** (what got indexed and what didn't)
   and **Performance** (what queries you appear for).

---

## 2. Bing Webmaster Tools

The meta tag `msvalidate.01` is in `index.html` and deployed. Go to
<https://www.bing.com/webmasters>, add `https://www.lunovaservices.com`, choose
the **meta tag** option, and click Verify.

Faster alternative: Bing offers "Import from Google Search Console". Do that
instead once §1 is done and it takes about two minutes with no verification
step at all.

Bing feeds DuckDuckGo and a meaningful share of ChatGPT's web results, so it is
worth the two minutes even though the traffic is smaller.

---

## 3. Connecting the Business Profile to the website

This is the part that is currently missing, and it is the highest-value item
on this page.

**Set the website field on the profile.** In the Business Profile (via Google
Maps or Search, or business.google.com) → *Edit profile* → *Contact* →
**Website** → enter exactly:

```
https://www.lunovaservices.com
```

With `https://` and with `www`, matching the canonical the site declares. A
profile with no website field is a profile that cannot pass authority to the
site, and a mismatched one (apex vs www) weakens the association.

**Then check these match character for character**, because Google
cross-references them and a mismatch is the most common reason a local
business fails to consolidate into one entity:

| Profile field | Must match |
| --- | --- |
| Business name | `Lunova Services` — `COMPANY_NAME` in `src/app/constants/contact.ts` |
| Phone | `(816) 315-1305` — `PHONE_DISPLAY`, same file |
| Hours | Mon–Fri 7:00–19:00, Sat 8:00–17:00, Sun closed — `OPENING_HOURS` in `business.ts` |
| Business type | **Service-area business**, no storefront address |

If the real hours differ from that table, change `OPENING_HOURS` in the code
rather than the profile — the site, the schema and the booking wizard's
"closed Sunday" rule all read from that one constant.

**Grab the review link while you are in there.** *Ask for reviews* gives you a
short link like `https://g.page/r/xxxx/review`. Paste it into `REVIEW_LINK` in
`src/app/constants/business.ts`. That is the link to text a customer the day
after a job, and with zero reviews today it is worth more than any other single
change available.

---

## 4. SPF, so booking emails stop landing in spam

There is currently no SPF record. Confirmation emails and review requests go
out through Resend, and without SPF a share of them will be filtered or
rejected outright — which for a booking form means the customer never sees
their confirmation.

In Spaceship → Advanced DNS → *Add record*:

| Field | Value |
| --- | --- |
| Type | `TXT` |
| Host / Name | `@` |
| Value | `v=spf1 include:_spf.resend.com ~all` |
| TTL | Automatic |

**Only one SPF record per domain, ever.** If one already exists, do not add a
second — merge the `include:` into the existing record. Two SPF records is a
permanent error and is worse than having none.

Then, in the Resend dashboard, verify the sending domain. Resend will give you
DKIM records (usually a `CNAME` or a TXT on `resend._domainkey`). Add those the
same way. Once SPF and DKIM both pass, consider tightening the existing DMARC
record from `p=none` to `p=quarantine`.

Verify afterwards:

```
nslookup -type=TXT lunovaservices.com 8.8.8.8
```

---

## Quick reference — every record in one table

| Purpose | Type | Host | Value |
| --- | --- | --- | --- |
| Search Console (domain property) | TXT | `@` | `google-site-verification=…` (Google gives you this) |
| Email deliverability | TXT | `@` | `v=spf1 include:_spf.resend.com ~all` |
| DKIM | per Resend | per Resend | per Resend |

Bing and the Google HTML-file method need no DNS — both are already in the
deployed site.
