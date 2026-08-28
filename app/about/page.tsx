import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs, WhyLuxeStone, CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description: "LuxeStone Interiors Ltd. is a premium tile, stone and surfaces company serving residential and commercial clients across North America.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="container-lux py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </div>

      <section className="container-lux grid md:grid-cols-2 gap-16 items-center pb-20">
        <div>
          <p className="eyebrow mb-3">About LuxeStone</p>
          <h1 className="section-heading mb-6">Premium surfaces, thoughtfully sourced</h1>
          <p className="text-warmgray leading-relaxed mb-4">
            LuxeStone Interiors Ltd. specializes in premium tile, stone, marble, porcelain,
            slabs and interior surface solutions for homeowners, interior designers, architects,
            contractors, builders and commercial clients across North America.
          </p>
          <p className="text-warmgray leading-relaxed">
            From a single kitchen renovation to a full commercial build-out, our team works
            alongside designers and architects to find the right material for every project —
            backed by a clear, itemized estimate you can trust before any work begins.
          </p>
        </div>
        <div className="relative aspect-[4/3]">
          <Image
            src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80"
            alt="LuxeStone Interiors"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </section>

      <WhyLuxeStone />

      <CTASection
        title="Let's talk about your project"
        primaryLabel="Talk to a Specialist"
        primaryHref="/contact"
        secondaryLabel="Book a Free Estimate"
        secondaryHref="/showroom"
      />
    </div>
  );
}
