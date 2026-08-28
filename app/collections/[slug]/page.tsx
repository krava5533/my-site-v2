import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CTASection } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { ProjectCard } from "@/components/CollectionCard";
import { getCollections, getCollectionBySlug } from "@/lib/store/collections";
import { getProductsByCollection } from "@/lib/store/products";
import { collections as seedCollections } from "@/lib/data/collections";
import { getAllProjects } from "@/lib/data/all-projects";

export function generateStaticParams() {
  return seedCollections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const collectionProducts = await getProductsByCollection(collection.slug);
  const allProjects = await getAllProjects();
  const relatedProjects = allProjects.filter((p) => collection.relatedProjectSlugs?.includes(p.slug));

  return (
    <div>
      <div className="relative h-[60vh] min-h-[420px]">
        <Image src={collection.heroImage} alt={collection.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deepblack/70 to-deepblack/10" />
        <div className="relative h-full container-lux flex flex-col justify-end pb-14">
          <p className="text-warmwhite/80 text-sm mb-2">{collection.tagline}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-warmwhite">{collection.name}</h1>
        </div>
      </div>

      <div className="container-lux py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: collection.name },
          ]}
        />
      </div>

      <section className="container-lux grid md:grid-cols-3 gap-12 pb-20">
        <div className="md:col-span-2">
          <p className="text-warmgray leading-relaxed text-lg font-serif">{collection.description}</p>
        </div>
        <div className="space-y-6 text-sm">
          {collection.colors.length > 0 && (
            <div><p className="text-xs uppercase tracking-wide text-warmgray mb-2">Colors</p><p>{collection.colors.join(", ")}</p></div>
          )}
          {collection.finishes.length > 0 && (
            <div><p className="text-xs uppercase tracking-wide text-warmgray mb-2">Finishes</p><p>{collection.finishes.join(", ")}</p></div>
          )}
          {collection.sizes.length > 0 && (
            <div><p className="text-xs uppercase tracking-wide text-warmgray mb-2">Sizes</p><p>{collection.sizes.join(", ")}</p></div>
          )}
          {collection.applications.length > 0 && (
            <div><p className="text-xs uppercase tracking-wide text-warmgray mb-2">Recommended Applications</p><p>{collection.applications.join(", ")}</p></div>
          )}
        </div>
      </section>

      {collectionProducts.length > 0 && (
        <section className="container-lux pb-20">
          <h2 className="section-heading mb-8">Products in this Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="container-lux pb-20">
          <h2 className="section-heading mb-8">Related Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <CTASection
        title={`Ready to bring ${collection.name} into your project?`}
        primaryLabel="Request a Quote"
        primaryHref={`/request-quote?product=${collectionProducts[0]?.slug ?? ""}`}
        secondaryLabel="Book a Free Estimate"
        secondaryHref="/showroom"
      />
    </div>
  );
}
