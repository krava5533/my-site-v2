import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, CTASection } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { getMaterials, getMaterialBySlug } from "@/lib/store/materials";
import { getProducts } from "@/lib/store/products";
import { materials as seedMaterials } from "@/lib/data/materials";
import { getAllProjects } from "@/lib/data/all-projects";
import { ProjectCard } from "@/components/CollectionCard";

export function generateStaticParams() {
  return seedMaterials.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const material = await getMaterialBySlug(params.slug);
  if (!material) return {};
  return { title: material.name, description: material.intro };
}

export default async function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const material = await getMaterialBySlug(params.slug);
  if (!material) notFound();

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.material === material.name).slice(0, 8);
  const allProjects = await getAllProjects();
  const relatedProjects = allProjects
    .filter((p) => p.materialsUsed.some((m) => m.toLowerCase().includes(material.name.toLowerCase())))
    .slice(0, 3);

  return (
    <div>
      <div className="relative h-[50vh] min-h-[360px]">
        <Image src={material.heroImage} alt={material.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-deepblack/40" />
        <div className="relative h-full container-lux flex flex-col justify-end pb-12">
          <h1 className="font-serif text-4xl md:text-6xl text-warmwhite">{material.name}</h1>
        </div>
      </div>

      <div className="container-lux py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Materials", href: "/materials" }, { label: material.name }]} />
      </div>

      <section className="container-lux grid md:grid-cols-3 gap-12 pb-16">
        <p className="md:col-span-2 text-lg font-serif text-warmgray leading-relaxed">{material.intro}</p>
        <div className="space-y-6 text-sm">
          {material.characteristics.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-warmgray mb-2">Characteristics</p>
              <ul className="space-y-1">{material.characteristics.map((c) => <li key={c}>&mdash; {c}</li>)}</ul>
            </div>
          )}
          {material.care.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-warmgray mb-2">Care</p>
              <ul className="space-y-1">{material.care.map((c) => <li key={c}>&mdash; {c}</li>)}</ul>
            </div>
          )}
        </div>
      </section>

      {material.gallery.length > 0 && (
        <section className="container-lux pb-16 grid grid-cols-2 md:grid-cols-3 gap-4">
          {material.gallery.map((img, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={img} alt={`${material.name} texture ${i + 1}`} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="container-lux pb-20">
          <h2 className="section-heading mb-8">{material.name} Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="container-lux pb-20">
          <h2 className="section-heading mb-8">Projects Featuring {material.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      <CTASection
        title={`Considering ${material.name} for your project?`}
        primaryLabel="Request a Quote"
        primaryHref="/request-quote"
        secondaryLabel="Book a Free Estimate"
        secondaryHref="/showroom"
      />
    </div>
  );
}
