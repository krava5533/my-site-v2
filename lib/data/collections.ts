import { Collection } from "@/types";

// NOTE: images are placeholder editorial photography from Unsplash's free
// license library, wired through Next/Image. Replace with real LuxeStone
// photography by swapping the URLs — the image system is fully centralized
// here and in products.ts / projects.ts.

export const collections: Collection[] = [
  {
    id: "col-1",
    slug: "calacatta-luna",
    name: "Calacatta Luna",
    tagline: "Timeless veining, modern scale",
    description:
      "Calacatta Luna reinterprets the classic marble look in large-format porcelain, bringing dramatic gold-grey veining to kitchens, bathrooms and feature walls without the maintenance of natural stone.",
    heroImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    colors: ["White", "Grey", "Gold Vein"],
    finishes: ["Polished", "Honed"],
    sizes: ['24" x 48"', '48" x 110"', '12" x 24"'],
    applications: ["Kitchens", "Bathrooms", "Walls", "Commercial"],
    productSlugs: ["luna-calacatta", "calacatta-luna-mosaic"],
    relatedProjectSlugs: ["rosedale-luxury-kitchen", "yorkville-penthouse-bath"],
  },
  {
    id: "col-2",
    slug: "maison-collection",
    name: "Maison",
    tagline: "Warm minimalism for everyday luxury",
    description:
      "A soft, warm-beige porcelain collection designed for large open interiors that call for calm, continuous surfaces from floor to wall.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    colors: ["Beige", "Sand", "Taupe"],
    finishes: ["Matte", "Textured"],
    sizes: ['24" x 24"', '32" x 32"', '24" x 48"'],
    applications: ["Living Spaces", "Flooring", "Custom Homes"],
    productSlugs: ["maison-beige", "maison-sand-large-format"],
    relatedProjectSlugs: ["forest-hill-custom-home"],
  },
  {
    id: "col-3",
    slug: "arden-stone",
    name: "Arden Stone",
    tagline: "Quarried character, engineered consistency",
    description:
      "Natural limestone and sandstone tones translated into a durable porcelain body — ideal for architects specifying consistent lot-to-lot color for large commercial builds.",
    heroImage:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80",
    colors: ["Ash Grey", "Warm Grey", "Charcoal"],
    finishes: ["Honed", "Brushed"],
    sizes: ['24" x 48"', '48" x 48"'],
    applications: ["Commercial", "Hospitality", "Flooring", "Outdoor"],
    productSlugs: ["arden-stone-ash", "arden-stone-charcoal"],
    relatedProjectSlugs: ["king-west-boutique-hotel"],
  },
  {
    id: "col-4",
    slug: "noir-collection",
    name: "Noir",
    tagline: "Dramatic depth for statement spaces",
    description:
      "A near-black, richly veined marble-look porcelain built for fireplace surrounds, waterfall islands and feature walls that anchor a room.",
    heroImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
    colors: ["Black", "Graphite"],
    finishes: ["Polished", "Leathered"],
    sizes: ['24" x 48"', '48" x 110"'],
    applications: ["Kitchens", "Fireplaces", "Walls", "Custom Homes"],
    productSlugs: ["noir-vein", "noir-vein-slab"],
    relatedProjectSlugs: ["rosedale-luxury-kitchen"],
  },
  {
    id: "col-5",
    slug: "serena-limestone",
    name: "Serena",
    tagline: "Soft, sun-washed limestone tones",
    description:
      "Serena brings the pale, chalky warmth of European limestone to floors and walls that need to feel quiet, tactile and grounded.",
    heroImage:
      "https://images.unsplash.com/photo-1600566752734-2a0cd53d6cff?w=1600&q=80",
    colors: ["Ivory", "Pale Grey"],
    finishes: ["Honed", "Matte"],
    sizes: ['18" x 36"', '24" x 24"'],
    applications: ["Bathrooms", "Living Spaces", "Outdoor"],
    productSlugs: ["serena-limestone-ivory"],
    relatedProjectSlugs: ["muskoka-lakeside-retreat"],
  },
  {
    id: "col-6",
    slug: "monaco-travertine",
    name: "Monaco",
    tagline: "Riviera-inspired travertine texture",
    description:
      "Monaco captures the pitted, sun-bleached texture of classic travertine — a favorite for spa bathrooms, outdoor terraces and Mediterranean-influenced interiors.",
    heroImage:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1600&q=80",
    colors: ["Walnut", "Ivory", "Silver"],
    finishes: ["Honed", "Brushed"],
    sizes: ['16" x 32"', '24" x 24"'],
    applications: ["Outdoor", "Bathrooms", "Hospitality"],
    productSlugs: ["monaco-travertine-walnut"],
    relatedProjectSlugs: ["muskoka-lakeside-retreat", "king-west-boutique-hotel"],
  },
  {
    id: "col-7",
    slug: "velora-terrazzo",
    name: "Velora",
    tagline: "Contemporary terrazzo, made to scale",
    description:
      "A refined take on terrazzo with fine aggregate and a soft palette — built for hospitality lobbies, retail floors and playful residential moments.",
    heroImage:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1600&q=80",
    colors: ["Cloud", "Blush", "Onyx Fleck"],
    finishes: ["Polished", "Matte"],
    sizes: ['24" x 24"', '32" x 32"'],
    applications: ["Commercial", "Hospitality", "Restaurants", "Flooring"],
    productSlugs: ["velora-terrazzo-cloud"],
    relatedProjectSlugs: ["king-west-boutique-hotel"],
  },
  {
    id: "col-8",
    slug: "aurelia-marble",
    name: "Aurelia",
    tagline: "The signature LuxeStone marble collection",
    description:
      "Our flagship large-format marble-look collection — designed for architects and designers who need book-matched drama at a porcelain price point.",
    heroImage:
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1600&q=80",
    colors: ["Statuario White", "Emperador Brown", "Verde Green"],
    finishes: ["Polished", "Honed"],
    sizes: ['48" x 110"', '24" x 48"'],
    applications: ["Kitchens", "Bathrooms", "Commercial", "Walls"],
    productSlugs: ["aurelia-marble-statuario", "aurelia-marble-emperador"],
    relatedProjectSlugs: ["yorkville-penthouse-bath", "forest-hill-custom-home"],
  },
];

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}
