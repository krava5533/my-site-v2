import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="section-heading mt-6 mb-8">Privacy Policy</h1>
      <div className="prose-lux space-y-6 text-warmgray leading-relaxed text-sm">
        <p className="bg-stonebeige/30 text-charcoal p-4 text-xs">
          PLACEHOLDER LEGAL COPY — this page requires review by qualified legal counsel before
          launch. Do not publish without professional review.
        </p>
        <p>
          {siteConfig.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects
          information you provide directly to us through forms on this site, including quote
          requests, project uploads and free estimate appointment bookings. This may
          include your name, email address, phone number, company, project details and any
          files you choose to upload.
        </p>
        <h2 className="font-serif text-xl text-charcoal">How We Use Information</h2>
        <p>
          We use the information you provide to respond to inquiries, prepare quotes, schedule
          estimate appointments, and improve our services. We do not sell your personal
          information to third parties.
        </p>
        <h2 className="font-serif text-xl text-charcoal">Data Retention</h2>
        <p>We retain lead and project information for as long as reasonably necessary to fulfill the purposes described above, or as required by law.</p>
        <h2 className="font-serif text-xl text-charcoal">Contact Us</h2>
        <p>Questions about this policy can be directed to {siteConfig.contact.email}.</p>
      </div>
    </div>
  );
}
