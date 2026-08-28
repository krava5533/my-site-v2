import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import { MaterialCard } from "@/components/CollectionCard";
import { getMaterials } from "@/lib/store/materials";

export const metadata: Metadata = {
  title: "Materials — Marble, Porcelain, Natural Stone & More",
  description: "Explore every material we work with, from marble and porcelain to terrazzo and large-format slabs.",
};

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Materials" }]} />
      <div className="mt-6 mb-12">
        <p className="eyebrow mb-3">Materials</p>
        <h1 className="section-heading">Find your surface, by material</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {materials.map((m) => (
          <MaterialCard key={m.slug} material={m} />
        ))}
      </div>
    </div>
  );
}
