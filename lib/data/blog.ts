import { BlogPost, Testimonial } from "@/types";

const img = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80`;

export const blogPosts: BlogPost[] = [
  {
    id: "b-1",
    slug: "2026-tile-trends-north-america",
    title: "2026 Tile Trends Shaping North American Interiors",
    excerpt: "From large-format marble looks to warm minimalism, here's what's defining premium interiors this year.",
    category: "Tile Trends",
    coverImage: img("photo-1600566752355-35792bedcfea"),
    content:
      "Large-format porcelain continues to dominate high-end specifications, with book-matched veining and seamless waterfall edges appearing across kitchens and bathrooms alike. Warm, sand-toned neutrals are replacing stark whites, while terrazzo is having a considered, contemporary resurgence in hospitality settings.",
    publishedAt: "2026-01-14",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-2",
    slug: "choosing-tile-for-a-luxury-bathroom",
    title: "How to Choose Tile for a Luxury Bathroom",
    excerpt: "A practical guide to balancing material, finish and scale in a high-end bathroom renovation.",
    category: "Bathroom Design",
    coverImage: img("photo-1600566752229-250ed79470f8"),
    content:
      "Start with the wet zone: honed or textured finishes reduce slip risk in showers while polished finishes suit dry vanity walls. Large-format slabs minimize grout lines for a spa-like continuous surface, and a single accent material — like a marble mosaic niche — keeps the palette cohesive.",
    publishedAt: "2026-02-02",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-3",
    slug: "kitchen-island-waterfall-edge-guide",
    title: "The Complete Guide to Waterfall Edge Kitchen Islands",
    excerpt: "Everything to consider when specifying a book-matched waterfall island for a custom kitchen.",
    category: "Kitchen Design",
    coverImage: img("photo-1600607687939-ce8a6c25118c"),
    content:
      "A waterfall edge requires careful slab selection to ensure veining continues naturally around the corner. Large-format porcelain and marble slabs up to 110 inches allow a single continuous panel, avoiding visible seams at the mitred edge.",
    publishedAt: "2026-02-18",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-4",
    slug: "marble-vs-porcelain-marble-look",
    title: "Marble vs. Porcelain Marble-Look: Which Is Right for You?",
    excerpt: "Comparing the authenticity of natural marble against the durability of engineered porcelain.",
    category: "Stone Guide",
    coverImage: img("photo-1600210492486-724fe5c67fb0"),
    content:
      "Natural marble offers unmatched depth and one-of-a-kind veining, but requires regular sealing and careful maintenance around acidic spills. Porcelain marble-look slabs replicate the aesthetic with far greater stain resistance and consistency, making them a popular choice for busy kitchens.",
    publishedAt: "2026-03-05",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-5",
    slug: "material-guide-large-format-slabs",
    title: "Material Guide: Understanding Large-Format Slabs",
    excerpt: "What architects and designers need to know when specifying large-format surfaces.",
    category: "Material Guide",
    coverImage: img("photo-1600566752734-2a0cd53d6cff"),
    content:
      "Large-format slabs, typically up to 48 by 110 inches, reduce grout lines and enable book-matching across large surfaces. Installation requires specialized handling equipment and experienced trades, so early coordination with your fabricator is essential.",
    publishedAt: "2026-03-21",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-6",
    slug: "caring-for-natural-stone-surfaces",
    title: "Caring for Natural Stone Surfaces: A Maintenance Guide",
    excerpt: "Simple habits that keep marble, limestone and travertine looking their best for decades.",
    category: "Maintenance",
    coverImage: img("photo-1600566752229-250ed79470f8"),
    content:
      "Natural stone benefits from periodic resealing, pH-neutral cleaners, and prompt attention to acidic spills like wine or citrus. Avoid abrasive pads, and consider professional honing every few years to refresh a worn polished finish.",
    publishedAt: "2026-04-02",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-7",
    slug: "architectural-surfaces-in-hospitality-design",
    title: "Architectural Surfaces in Hospitality Design",
    excerpt: "How boutique hotels and restaurants are using stone and tile to create memorable first impressions.",
    category: "Architecture",
    coverImage: img("photo-1600121848594-d8644e57abab"),
    content:
      "In hospitality design, flooring and feature walls set the tone before a guest reaches the front desk. Durable, large-format porcelain and terrazzo are increasingly specified for their combination of visual impact and long-term performance under heavy foot traffic.",
    publishedAt: "2026-04-19",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-8",
    slug: "terrazzo-comeback-modern-interiors",
    title: "Terrazzo's Comeback in Modern Interiors",
    excerpt: "Why designers are rediscovering terrazzo for contemporary residential and commercial spaces.",
    category: "Interior Design",
    coverImage: img("photo-1600585154340-be6161a56a0c"),
    content:
      "Once associated with mid-century institutional buildings, terrazzo is returning in refined, fine-aggregate formats suited to boutique retail and residential kitchens. Its seamless installation and durability make it a practical choice for high-traffic floors.",
    publishedAt: "2026-05-06",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-9",
    slug: "outdoor-porcelain-pavers-guide",
    title: "A Designer's Guide to Outdoor Porcelain Pavers",
    excerpt: "How 20mm porcelain pavers are changing the way we design patios, pool decks and terraces.",
    category: "Material Guide",
    coverImage: img("photo-1600607688969-a5bfcd646154"),
    content:
      "Thicker 20mm porcelain pavers offer the frost resistance and structural strength required for exterior installation while matching the exact finish of interior floor tile — allowing a continuous look from indoors to out.",
    publishedAt: "2026-05-22",
    author: "LuxeStone Design Team",
  },
  {
    id: "b-10",
    slug: "designing-a-cohesive-material-palette",
    title: "Designing a Cohesive Material Palette for Your Home",
    excerpt: "A framework for selecting tile, stone and surface materials that work together across a whole home.",
    category: "Interior Design",
    coverImage: img("photo-1600566752355-35792bedcfea"),
    content:
      "Start with one hero material — often the kitchen island or a feature bathroom wall — then select two to three supporting neutrals with similar undertones. Consistency in warmth (warm vs. cool) across materials is often more important than matching color exactly.",
    publishedAt: "2026-06-10",
    author: "LuxeStone Design Team",
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((b) => b.slug === slug);
}

// DEMO CONTENT — REPLACE BEFORE LAUNCH
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "The team helped us find the exact large-format marble look we needed for a book-matched island, and the samples matched what arrived on site perfectly.",
    author: "Interior Designer",
    role: "Residential Project, Toronto",
    demo: true,
  },
  {
    id: "t-2",
    quote:
      "Their on-site estimate was thorough and the itemized quote made it easy to plan our full commercial order.",
    author: "Project Architect",
    role: "Hospitality Project",
    demo: true,
  },
  {
    id: "t-3",
    quote:
      "Responsive, knowledgeable, and genuinely helpful throughout our custom home build.",
    author: "Homeowner",
    role: "Custom Home, Ontario",
    demo: true,
  },
];
