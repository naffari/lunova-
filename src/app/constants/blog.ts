export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  body: string[];
}

// NOTE: Sample educational content to seed the blog scaffold. Swap in real
// posts (and real publish dates) as the content calendar develops — no
// business-specific claims or stats are made here, only general advice.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "5-signs-its-time-to-call-professional-cleaners",
    title: "5 Signs It's Time to Call in Professional House Cleaners",
    excerpt:
      "Between work, family, and everything else, cleaning is often the first thing to slip. Here's how to know when it's time to bring in help.",
    category: "Cleaning",
    date: "2026-01-12",
    readMinutes: 4,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&h=700&fit=crop&auto=format",
    imageAlt: "Bright, freshly cleaned living room",
    body: [
      "Most homeowners don't wake up one day and decide to hire a cleaning service — it's usually a gradual realization that the weekly clean is falling further and further down the to-do list. If any of the signs below sound familiar, it might be time to hand the mop off to a professional crew.",
      "You're spending your weekends cleaning instead of living. If Saturday mornings are dedicated to scrubbing bathrooms and vacuuming instead of the things you actually want to do, that's a strong signal your time is worth more than the cost of a cleaning visit.",
      "Dust and clutter are piling up in the same spots. Baseboards, ceiling fans, and the tops of cabinets are easy to forget during a quick weekly tidy. A professional deep clean resets those neglected areas so regular maintenance becomes easier to keep up with.",
      "You're hosting guests and feel the pressure. A pre-visit deep clean takes the stress out of entertaining, giving you one less thing to worry about before company arrives.",
      "Allergies or dust sensitivities are flaring up. Regular professional cleaning with the right products can reduce allergens like dust mites and pet dander that build up in carpets and upholstery over time.",
      "You just don't enjoy it — and that's okay. Not everyone needs a specific reason. If cleaning isn't how you want to spend your limited free time, outsourcing it is a completely reasonable choice.",
    ],
  },
  {
    slug: "how-often-should-you-mow-your-lawn",
    title: "How Often Should You Really Mow Your Lawn?",
    excerpt:
      "Mowing too often — or not often enough — can quietly damage your grass. Here's a simple rule of thumb for a healthier lawn all season long.",
    category: "Landscaping",
    date: "2026-02-03",
    readMinutes: 3,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=1000&h=700&fit=crop&auto=format",
    imageAlt: "Freshly mowed green lawn with clean stripe pattern",
    body: [
      "There's no single \"right\" mowing schedule that works for every yard — it depends on grass type, season, and how much rain your lawn is getting. But there is one rule that applies almost universally: the one-third rule.",
      "Never cut more than one-third of the grass blade's height in a single mow. Scalping your lawn stresses the roots, invites weeds, and makes grass more vulnerable to drought and disease. If your lawn grows fast, that might mean mowing weekly. If growth slows down in the heat of summer or the cool of fall, stretching to every 10–14 days is often healthier than sticking to a rigid weekly schedule.",
      "Spring and fall are typically peak growth periods for cool-season grasses common in the Midwest, so expect to mow more frequently during those months. Mid-summer heat often slows growth — mowing less during a dry spell actually helps the lawn conserve moisture.",
      "Keep your mower blade sharp, too. A dull blade tears grass instead of cutting it cleanly, leaving ragged, brown-tipped edges that make an otherwise healthy lawn look stressed even right after mowing.",
      "If your schedule doesn't leave room for consistent mowing, a routine lawn care service can keep your yard on the right cycle without you having to track the calendar yourself.",
    ],
  },
  {
    slug: "junk-removal-101-what-can-and-cant-be-hauled",
    title: "Junk Removal 101: What Can (and Can't) Be Hauled Away",
    excerpt:
      "Before you schedule a pickup, it helps to know what typically qualifies as standard junk removal — and what needs special handling.",
    category: "Junk Removal",
    date: "2026-02-20",
    readMinutes: 4,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&h=700&fit=crop&auto=format",
    imageAlt: "Junk removal truck loaded with furniture and boxes",
    body: [
      "Junk removal services can take a lot more than most people expect — but not everything. Knowing the difference ahead of time makes for a faster, smoother pickup.",
      "Typically fine: furniture, mattresses, appliances (fridges, washers, dryers), electronics, yard waste, construction debris from small renovations, boxes of clutter, and general estate cleanout items.",
      "Usually excluded or requiring special handling: hazardous materials like paint, chemicals, and propane tanks; asbestos-containing materials; medical waste; and certain large-scale construction debris from major demolition projects. Rules can vary by local disposal facility, so it's always worth asking before pickup day.",
      "A good rule of thumb: if it's something you could technically move yourself with a little help and a truck, it's probably a fit for standard junk removal. If it needs a hazmat suit, it probably needs a specialized disposal service instead.",
      "One more tip — you don't need to haul everything to the curb yourself. Most junk removal crews will pull items from inside your home, garage, or basement, so there's no need to do any of the heavy lifting before they arrive.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
