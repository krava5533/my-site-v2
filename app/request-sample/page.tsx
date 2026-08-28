import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import SampleForm from "@/components/SampleForm";

export const metadata: Metadata = {
  title: "Request a Sample",
  description: "Request physical samples of any LuxeStone Interiors product before you buy.",
};

export default function RequestSamplePage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Request a Sample" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Request a Sample</p>
        <h1 className="section-heading mb-4">See and Feel It First</h1>
        <p className="text-warmgray">
          Select the products you&rsquo;d like to sample and we&rsquo;ll ship them directly to
          you.
        </p>
      </div>
      <SampleForm presetProduct={searchParams.product} />
    </div>
  );
}
