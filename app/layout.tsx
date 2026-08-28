import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PersistentProjectCTA from "@/components/PersistentProjectCTA";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/config";

const displayFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium Tile, Stone & Architectural Surfaces`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.seo.keywords],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    address: { "@type": "PostalAddress", streetAddress: settings.address },
    telephone: settings.phone,
    email: settings.email,
  };

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-sans`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SiteChrome
          navbar={<Navbar />}
          footer={<Footer />}
          sticky={<StickyMobileCTA />}
          projectCta={<PersistentProjectCTA />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
