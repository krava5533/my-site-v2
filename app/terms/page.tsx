import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <h1 className="section-heading mt-6 mb-8">Terms of Service</h1>
      <div className="prose-lux space-y-6 text-warmgray leading-relaxed text-sm">
        <p className="bg-stonebeige/30 text-charcoal p-4 text-xs">
          PLACEHOLDER LEGAL COPY — this page requires review by qualified legal counsel before
          launch. Do not publish without professional review.
        </p>
        <p>
          By using this website, you agree to these Terms of Service. This site is provided by
          {" "}{siteConfig.legalName} for the purpose of showcasing products, collecting project
          inquiries, and facilitating quote and sample requests.
        </p>
        <h2 className="font-serif text-xl text-charcoal">Product Information</h2>
        <p>
          Product images, colors and finishes shown on this site may vary from actual materials
          due to photography, screen calibration and natural material variation. Always confirm
          exact specifications with a sample before final purchase.
        </p>
        <h2 className="font-serif text-xl text-charcoal">Quotes &amp; Orders</h2>
        <p>Quotes provided through this site are estimates and subject to confirmation by our team.</p>
        <h2 className="font-serif text-xl text-charcoal">Limitation of Liability</h2>
        <p>This site and its content are provided &ldquo;as is&rdquo; without warranties of any kind.</p>
      </div>
    </div>
  );
}
