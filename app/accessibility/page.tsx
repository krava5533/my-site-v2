import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <h1 className="section-heading mt-6 mb-8">Accessibility</h1>
      <div className="prose-lux space-y-6 text-warmgray leading-relaxed text-sm">
        <p className="bg-stonebeige/30 text-charcoal p-4 text-xs">
          PLACEHOLDER COPY — verify actual conformance level with an accessibility audit before
          making any compliance claims.
        </p>
        <p>
          {siteConfig.legalName} is committed to making this website usable by as many people as
          possible, including people with disabilities. We aim to follow applicable accessibility
          guidelines for color contrast, keyboard navigation, alternative text and semantic
          structure.
        </p>
        <p>
          If you experience difficulty accessing any part of this website, please contact us at
          {" "}{siteConfig.contact.email} and we will work to address the issue.
        </p>
      </div>
    </div>
  );
}
