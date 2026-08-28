export type Application =
  | "Kitchens"
  | "Bathrooms"
  | "Living Spaces"
  | "Flooring"
  | "Walls"
  | "Fireplaces"
  | "Outdoor"
  | "Commercial"
  | "Hospitality"
  | "Restaurants"
  | "Hotels"
  | "Custom Homes";

export type MaterialType =
  | "Marble"
  | "Porcelain"
  | "Natural Stone"
  | "Granite"
  | "Quartz"
  | "Sintered Stone"
  | "Terrazzo"
  | "Travertine"
  | "Limestone"
  | "Slate"
  | "Mosaic"
  | "Glass"
  | "Large Format Slabs";

export interface Product {
  id: string;
  slug: string;
  name: string;
  collectionSlug: string;
  material: MaterialType;
  color: string;
  finish: "Polished" | "Honed" | "Matte" | "Textured" | "Brushed" | "Leathered";
  sizes: string[];
  thicknessMm: number[];
  applications: Application[];
  description: string;
  technicalSpecs: { label: string; value: string }[];
  documents: { label: string; href: string }[];
  images: string[];
  availability: "In Stock" | "Special Order" | "Limited";
  featured?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  colors: string[];
  finishes: string[];
  sizes: string[];
  applications: Application[];
  productSlugs: string[];
  relatedProjectSlugs: string[];
}

export interface MaterialPage {
  slug: string;
  name: MaterialType;
  intro: string;
  characteristics: string[];
  applications: Application[];
  care: string[];
  heroImage: string;
  gallery: string[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  designer?: string;
  architect?: string;
  contractor?: string;
  category:
    | "Luxury Residential"
    | "Kitchens"
    | "Bathrooms"
    | "Living Spaces"
    | "Custom Homes"
    | "Commercial"
    | "Hospitality"
    | "Restaurants"
    | "Hotels"
    | "Outdoor";
  heroImage: string;
  gallery: string[];
  description: string;
  materialsUsed: string[];
  productSlugs: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category:
    | "Tile Trends"
    | "Bathroom Design"
    | "Kitchen Design"
    | "Stone Guide"
    | "Material Guide"
    | "Maintenance"
    | "Architecture"
    | "Interior Design";
  coverImage: string;
  content: string;
  publishedAt: string;
  author: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  demo: true;
}

export type LeadSource =
  | "Homepage"
  | "Product"
  | "Project"
  | "Quote"
  | "Sample"
  | "Upload Project"
  | "Estimate"
  | "Contact";

export type LeadType =
  | "Quote Request"
  | "Sample Request"
  | "Project Upload"
  | "Estimate Appointment"
  | "General Contact";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "QUOTING" | "WON" | "LOST";

export interface Lead {
  id: string;
  type: LeadType;
  source: LeadSource;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project?: string;
  location?: string;
  message?: string;
  data: Record<string, unknown>;
  files?: string[];
  status: LeadStatus;
  notes: { id: string; text: string; createdAt: string }[];
  createdAt: string;
}
