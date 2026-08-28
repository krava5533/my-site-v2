import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import { CollectionCard } from "@/components/CollectionCard";
import { getCollections } from "@/lib/store/collections";

export const metadata: Metadata = {
  title: "Collections — Curated Surface Collections",
  description: "Explore our curated collections of marble, porcelain and stone surfaces.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <div className="mt-6 mb-12">
        <p className="eyebrow mb-3">Collections</p>
        <h1 className="section-heading">Curated for exceptional interiors</h1>
        <p className="text-warmgray max-w-2xl mt-4">
          Each collection is designed as a cohesive palette — colors, finishes and sizes
          selected to work together across a full project.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </div>
  );
}
