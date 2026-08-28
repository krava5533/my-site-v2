/**
 * CENTRAL SITE CONFIGURATION
 * ----------------------------------------------------------------
 * Static, non-editable site config (name, URL, nav structure, SEO
 * keywords). Editable contact info (phone/email/address/social) now
 * lives in lib/settings.ts, managed from /admin/settings — see that
 * file for the live, admin-editable values.
 * ----------------------------------------------------------------
 */

export const MOCK_MODE = process.env.MOCK_MODE !== "false";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "LuxeStone Interiors Ltd.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Professional tile and stone installation for exceptional residential and commercial interiors — kitchens, bathrooms, floors and custom projects.",
  legalName: process.env.COMPANY_LEGAL_NAME || "LuxeStone Interiors Ltd.",

  contact: {
    address: process.env.COMPANY_ADDRESS || "[ADD REAL ADDRESS]",
    phone: process.env.COMPANY_PHONE || "[ADD REAL PHONE]",
    email: process.env.COMPANY_EMAIL || "[ADD REAL EMAIL]",
  },

  nav: {
    primary: [
      { label: "Products", href: "/products" },
      { label: "Collections", href: "/collections" },
      { label: "Materials", href: "/materials" },
      { label: "Projects", href: "/projects" },
      { label: "Inspiration", href: "/inspiration" },
      { label: "About", href: "/about" },
      { label: "Get an Estimate", href: "/showroom" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      explore: [
        { label: "Products", href: "/products" },
        { label: "Collections", href: "/collections" },
        { label: "Materials", href: "/materials" },
        { label: "Projects", href: "/projects" },
        { label: "Inspiration", href: "/inspiration" },
      ],
      company: [
        { label: "About", href: "/about" },
        { label: "Get an Estimate", href: "/showroom" },
        { label: "Contact", href: "/contact" },
      ],
      leadGen: [
        { label: "Request a Quote", href: "/request-quote" },
        { label: "Upload Your Project", href: "/upload-project" },
        { label: "Book a Free Estimate", href: "/showroom#appointment" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
  },

  seo: {
    keywords: [
      "tile installer",
      "tile installation",
      "stone installation contractor",
      "bathroom tile installation",
      "kitchen tile installation",
      "flooring installation",
      "marble",
      "porcelain tile",
      "natural stone",
      "large format porcelain",
      "interior surfaces",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
