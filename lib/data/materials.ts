import { MaterialPage } from "@/types";

const img = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=80`;

export const materials: MaterialPage[] = [
  {
    slug: "marble",
    name: "Marble",
    intro:
      "Marble remains the definitive symbol of luxury interiors — prized for its dramatic veining and soft, luminous surface.",
    characteristics: ["Natural veining, no two slabs alike", "Soft, luminous finish", "Cool to the touch", "Porous — benefits from sealing"],
    applications: ["Kitchens", "Bathrooms", "Walls", "Commercial"],
    care: ["Seal periodically", "Use pH-neutral cleaners", "Wipe acidic spills promptly"],
    heroImage: img("photo-1600566752355-35792bedcfea"),
    gallery: [img("photo-1600607687939-ce8a6c25118c"), img("photo-1600210492486-724fe5c67fb0"), img("photo-1600566752229-250ed79470f8")],
  },
  {
    slug: "porcelain",
    name: "Porcelain",
    intro:
      "Engineered porcelain delivers the beauty of natural stone with exceptional durability, consistency and low maintenance — ideal for both floors and walls.",
    characteristics: ["Extremely durable and dense", "Low water absorption", "Consistent color lot-to-lot", "Available in large-format slabs"],
    applications: ["Kitchens", "Bathrooms", "Flooring", "Commercial", "Outdoor"],
    care: ["Sweep and damp mop", "No sealing required", "Resistant to stains and scratches"],
    heroImage: img("photo-1600585154340-be6161a56a0c"),
    gallery: [img("photo-1600566752734-2a0cd53d6cff"), img("photo-1600121848594-d8644e57abab")],
  },
  {
    slug: "natural-stone",
    name: "Natural Stone",
    intro:
      "Quarried directly from the earth, natural stone brings unmatched texture and authenticity to architectural interiors.",
    characteristics: ["Truly one-of-a-kind material", "Variety of textures and finishes", "Requires periodic sealing", "Excellent thermal mass"],
    applications: ["Outdoor", "Flooring", "Walls", "Fireplaces"],
    care: ["Seal annually", "Avoid harsh chemicals", "Professional polishing as needed"],
    heroImage: img("photo-1600607688969-a5bfcd646154"),
    gallery: [img("photo-1600566752355-35792bedcfea"), img("photo-1600585154340-be6161a56a0c")],
  },
  {
    slug: "granite",
    name: "Granite",
    intro:
      "Prized for its strength and heat resistance, granite is a long-standing favorite for kitchen countertops and heavy-use surfaces.",
    characteristics: ["Extremely hard and scratch-resistant", "Heat resistant", "Wide color range", "Low porosity once sealed"],
    applications: ["Kitchens", "Commercial", "Outdoor"],
    care: ["Seal every 1–2 years", "Use cutting boards to preserve finish", "Clean with mild soap and water"],
    heroImage: img("photo-1600210492486-724fe5c67fb0"),
    gallery: [img("photo-1600566752229-250ed79470f8")],
  },
  {
    slug: "quartz",
    name: "Quartz",
    intro:
      "Engineered quartz surfaces combine natural quartz crystals with resin binders for a non-porous, highly consistent surface.",
    characteristics: ["Non-porous — no sealing needed", "Highly consistent pattern", "Resistant to stains and bacteria", "Wide design range"],
    applications: ["Kitchens", "Bathrooms", "Commercial"],
    care: ["Wipe clean with soap and water", "Avoid prolonged direct heat", "No sealing required"],
    heroImage: img("photo-1600607687939-ce8a6c25118c"),
    gallery: [img("photo-1600566752734-2a0cd53d6cff")],
  },
  {
    slug: "sintered-stone",
    name: "Sintered Stone",
    intro:
      "Sintered stone is produced under extreme heat and pressure, resulting in an ultra-compact surface ideal for demanding commercial and residential applications.",
    characteristics: ["Exceptional durability", "UV stable — safe for outdoor use", "Scratch and stain resistant", "Available in large-format slabs"],
    applications: ["Kitchens", "Outdoor", "Commercial", "Flooring"],
    care: ["Wipe clean, no sealing required", "Resistant to most chemicals"],
    heroImage: img("photo-1600121848594-d8644e57abab"),
    gallery: [img("photo-1600566752355-35792bedcfea")],
  },
  {
    slug: "terrazzo",
    name: "Terrazzo",
    intro:
      "A composite of marble, quartz, granite or glass chips set in a binder, terrazzo offers playful texture and exceptional longevity.",
    characteristics: ["Highly durable composite surface", "Customizable aggregate and color", "Seamless large-area installation", "Long service life"],
    applications: ["Commercial", "Hospitality", "Flooring", "Restaurants"],
    care: ["Seal per manufacturer guidance", "Damp mop regularly"],
    heroImage: img("photo-1600585154340-be6161a56a0c"),
    gallery: [img("photo-1600566752229-250ed79470f8")],
  },
  {
    slug: "travertine",
    name: "Travertine",
    intro:
      "Travertine's warm, sun-washed texture brings a Mediterranean sensibility to bathrooms, patios and spa-inspired interiors.",
    characteristics: ["Naturally textured, pitted surface", "Warm, earthy tones", "Available filled or unfilled", "Porous — benefits from sealing"],
    applications: ["Outdoor", "Bathrooms", "Hospitality"],
    care: ["Seal regularly", "Re-grout pitted holes as needed"],
    heroImage: img("photo-1600607688969-a5bfcd646154"),
    gallery: [img("photo-1600566752734-2a0cd53d6cff")],
  },
  {
    slug: "limestone",
    name: "Limestone",
    intro:
      "Soft and chalky in tone, limestone lends a quiet, grounded warmth to interiors that call for understated luxury.",
    characteristics: ["Soft, matte natural texture", "Pale, warm tonal range", "Porous — benefits from sealing", "Ages gracefully with a natural patina"],
    applications: ["Living Spaces", "Bathrooms", "Outdoor"],
    care: ["Seal periodically", "Avoid acidic cleaners"],
    heroImage: img("photo-1600566752355-35792bedcfea"),
    gallery: [img("photo-1600210492486-724fe5c67fb0")],
  },
  {
    slug: "slate",
    name: "Slate",
    intro:
      "Slate's fine-grained texture and rich, deep tones make it a durable choice for flooring and exterior applications.",
    characteristics: ["Dense, fine-grained texture", "Naturally slip-resistant", "Rich, deep color range", "Excellent for exterior use"],
    applications: ["Outdoor", "Flooring", "Commercial"],
    care: ["Seal as needed", "Sweep and damp mop"],
    heroImage: img("photo-1600566752229-250ed79470f8"),
    gallery: [img("photo-1600607687939-ce8a6c25118c")],
  },
  {
    slug: "mosaic",
    name: "Mosaic",
    intro:
      "Mosaics bring intricate pattern and texture to accent walls, showers and feature floors in a wide range of materials.",
    characteristics: ["Intricate pattern and texture", "Available in stone, glass or porcelain", "Ideal for curved or small-format areas", "Wide design flexibility"],
    applications: ["Bathrooms", "Walls", "Kitchens"],
    care: ["Care depends on base material", "Reseal grout lines periodically"],
    heroImage: img("photo-1600585154340-be6161a56a0c"),
    gallery: [img("photo-1600566752734-2a0cd53d6cff")],
  },
  {
    slug: "glass",
    name: "Glass",
    intro:
      "Glass surfaces and tile introduce light-reflective texture and vivid color for feature walls and backsplashes.",
    characteristics: ["Light-reflective, vivid color", "Non-porous and easy to clean", "Ideal for backsplashes and accent walls"],
    applications: ["Kitchens", "Bathrooms", "Walls", "Commercial"],
    care: ["Clean with glass-safe cleaner", "No sealing required"],
    heroImage: img("photo-1600121848594-d8644e57abab"),
    gallery: [img("photo-1600566752229-250ed79470f8")],
  },
  {
    slug: "large-format-slabs",
    name: "Large Format Slabs",
    intro:
      "Our large-format slab program enables seamless, book-matched surfaces across kitchen islands, feature walls and shower surrounds.",
    characteristics: ['Up to 48" x 110" panels', "Minimal to no visible seams", "Available in marble, porcelain and stone looks", "Ideal for waterfall edges"],
    applications: ["Kitchens", "Bathrooms", "Commercial", "Walls"],
    care: ["Depends on base material — see product page"],
    heroImage: img("photo-1600607688969-a5bfcd646154"),
    gallery: [img("photo-1600566752355-35792bedcfea"), img("photo-1600210492486-724fe5c67fb0")],
  },
];

export function getMaterialBySlug(slug: string) {
  return materials.find((m) => m.slug === slug);
}
