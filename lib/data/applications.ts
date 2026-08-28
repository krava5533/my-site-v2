import { Application } from "@/types";

const img = (id: string) => `https://images.unsplash.com/${id}?w=900&q=75`;

export const APPLICATION_LIST: { slug: string; name: Application; image: string; description: string }[] = [
  { slug: "kitchens", name: "Kitchens", image: img("photo-1600607687939-ce8a6c25118c"), description: "Waterfall islands, backsplashes and flooring built for the heart of the home." },
  { slug: "bathrooms", name: "Bathrooms", image: img("photo-1600566752229-250ed79470f8"), description: "Spa-inspired surfaces for showers, vanities and feature walls." },
  { slug: "living-spaces", name: "Living Spaces", image: img("photo-1600585154340-be6161a56a0c"), description: "Continuous flooring and fireplace surrounds for open-concept living." },
  { slug: "flooring", name: "Flooring", image: img("photo-1600566752734-2a0cd53d6cff"), description: "Durable, large-format flooring for residential and commercial interiors." },
  { slug: "walls", name: "Walls", image: img("photo-1600210492486-724fe5c67fb0"), description: "Feature walls and accent surfaces that anchor a room." },
  { slug: "fireplaces", name: "Fireplaces", image: img("photo-1600566752229-250ed79470f8"), description: "Heat-appropriate surrounds in marble, porcelain and natural stone." },
  { slug: "outdoor", name: "Outdoor", image: img("photo-1600607688969-a5bfcd646154"), description: "Frost-resistant pavers and slabs for patios, pool decks and terraces." },
  { slug: "commercial", name: "Commercial", image: img("photo-1600121848594-d8644e57abab"), description: "High-traffic, durable specifications for offices and retail." },
  { slug: "hospitality", name: "Hospitality", image: img("photo-1600566752229-250ed79470f8"), description: "Statement surfaces for hotel lobbies and guest experiences." },
  { slug: "restaurants", name: "Restaurants", image: img("photo-1600585154340-be6161a56a0c"), description: "Durable, design-forward surfaces for bars and dining rooms." },
  { slug: "hotels", name: "Hotels", image: img("photo-1600121848594-d8644e57abab"), description: "Consistent, large-scale specification across guest rooms and public areas." },
  { slug: "custom-homes", name: "Custom Homes", image: img("photo-1600566752734-2a0cd53d6cff"), description: "Whole-home material palettes for architects and custom builders." },
];

export function getApplicationBySlug(slug: string) {
  return APPLICATION_LIST.find((a) => a.slug === slug);
}
