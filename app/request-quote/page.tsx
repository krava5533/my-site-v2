import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Get a personalized quote from LuxeStone Interiors' team of surface specialists.",
};

export default function RequestQuotePage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Request a Quote</p>
        <h1 className="section-heading mb-4">Get a Personalized Quote</h1>
        <p className="text-warmgray">
          Share a few details about your project and one of our surface specialists will follow
          up with pricing and availability.
        </p>
      </div>
      <QuoteForm presetProduct={searchParams.product} />
    </div>
  );
}
