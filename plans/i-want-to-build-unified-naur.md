# Lunova Services — Multi-Page Marketing Website

## Context
Build a professional home-services marketing website for "Lunova Services" offering cleaning, junk removal, and landscaping. The site must serve as both advertisement and landing page, with dedicated pages per service, a persistent navigation bar showing all services, and bold call-to-action buttons to call, text, and email.

## Aesthetic Direction
- **Stance**: Kinetic-bold — confident, motion-forward, dark navy ground with a vivid grass-green accent. Inspired by the reference images' bold color blocking and strong CTAs.
- **Palette**: Deep navy `#0a1628` background, white foreground, vibrant green `#3ecf5a` primary accent, warm off-white `#f5f2eb` for card surfaces
- **Fonts**: `Barlow Condensed` (display headings — bold/condensed punch) + `Inter` (body — clean and readable). Both from Google Fonts.
- **Tone**: Trustworthy, energetic, residential/commercial market

## Pages & Routing (React Router v7 Data Mode)

```
/           → Home (hero + all 3 services preview + testimonials + CTA)
/cleaning   → Cleaning Service page
/junk       → Junk Removal page  
/landscaping → Landscaping page
```

## File Structure
```
src/app/
  App.tsx              ← RouterProvider entry
  routes.ts            ← createBrowserRouter config
  components/
    Navbar.tsx         ← persistent nav with service links + call/text/email CTAs
    Footer.tsx         ← contact info, quick links
    CTABanner.tsx      ← reusable "call/text/email" action strip
  pages/
    Home.tsx           ← hero, services grid, why-us, testimonials, CTA
    Cleaning.tsx       ← cleaning service dedicated page
    JunkRemoval.tsx    ← junk removal dedicated page
    Landscaping.tsx    ← landscaping dedicated page
```

## Navbar (persistent across all pages)
- Logo: "LUNOVA" wordmark left-aligned
- Nav links: Home | Cleaning | Junk Removal | Landscaping
- Right side: `Call Us` button (tel: link) + `Get a Quote` button (mailto: link)
- Mobile: hamburger menu collapsing all links
- Active route gets green underline indicator

## Home Page Sections
1. **Hero** — Full-width dark section with headline "Your Home, Perfectly Maintained", subhead, hero photo from Unsplash, two CTA buttons (Call Now / Get a Free Quote)
2. **Services Grid** — 3 cards: Cleaning, Junk Removal, Landscaping — each with icon, short description, "Learn More" link
3. **Why Lunova** — 3-column stats strip: "500+ Jobs Done", "5-Star Rated", "Same-Day Service"
4. **Testimonials** — 3 customer reviews with star ratings
5. **Contact CTA Banner** — large section: "Ready to Get Started?" with phone, text, email buttons side by side

## Service Pages (Cleaning / Junk Removal / Landscaping)
Each page shares the same structure:
1. **Page Hero** — full-width hero with service name + relevant Unsplash photo + CTA
2. **What's Included** — icon + bullet list of specific offerings
3. **Pricing Teaser** — "Starting at $X" cards
4. **Gallery Strip** — 3 Unsplash photos of the service
5. **Contact CTA Banner** — same reusable component as home

## CTA Contact Buttons
All three contact methods present on every page:
- **Call** → `<a href="tel:+15551234567">` styled as primary green button
- **Text** → `<a href="sms:+15551234567">` styled as outline button
- **Email** → `<a href="mailto:hello@lunovaservices.com">` styled as outline button

## Design Tokens (theme.css updates)
```css
--background: #0a1628;         /* deep navy */
--foreground: #f0f4ff;
--card: #111e35;               /* slightly lighter navy for cards */
--primary: #3ecf5a;            /* vivid green accent */
--primary-foreground: #0a1628;
--secondary: #1a2d4a;
--muted: #1a2d4a;
--muted-foreground: #8a9bbf;
--accent: #3ecf5a;
--border: rgba(255,255,255,0.08);
--radius: 0.5rem;
```

## Fonts (fonts.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
```

## Unsplash Images to Use
- **Home hero**: cleaning team in action — `/photo-1581578731548-c64695cc6952` (cleaning)
- **Cleaning page**: `photo-1558618666-fcd25c85cd64` (house cleaning)
- **Junk Removal**: `photo-1504307651254-35680f356dfd` (workers loading truck)
- **Landscaping**: `photo-1416879595882-3373a0480b5b` (lawn/garden)

## Implementation Notes
- Use `react-router` v7 `createBrowserRouter` in `src/app/routes.ts`
- `App.tsx` exports `<RouterProvider router={router} />`
- Use `<Link>` from react-router for internal navigation
- Use `useLocation()` in Navbar to highlight active route
- Navbar uses `sticky top-0 z-50` so it persists on scroll
- All Unsplash images via `<img>` with proper `alt` text (no `ImageWithFallback` needed since these are URLs, not local imports)
- `image.png` and `image-1.png` are used as aesthetic **inspiration only** — the two reference screenshots show cleaning website layouts and color blocking style

## Verification
1. All 4 routes render without errors
2. Navbar shows on all pages with active-link highlighting
3. Call/Text/Email CTAs are visible on every page
4. Mobile hamburger menu opens/closes
5. Service pages each have unique hero + content
