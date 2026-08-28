import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, CTASection } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { projects } from "@/lib/data/projects";
import { getAnyProjectBySlug } from "@/lib/data/all-projects";
import { products } from "@/lib/data/products";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getAnyProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.name, description: project.description };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getAnyProjectBySlug(params.slug);
  if (!project) notFound();

  const usedProducts = products.filter((p) => project.productSlugs.includes(p.slug));

  return (
    <div>
      <div className="relative h-[65vh] min-h-[440px]">
        <Image src={project.heroImage} alt={project.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deepblack/70 to-deepblack/10" />
        <div className="relative h-full container-lux flex flex-col justify-end pb-14">
          <p className="text-warmwhite/80 text-sm mb-2">{project.category}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-warmwhite">{project.name}</h1>
        </div>
      </div>

      <div className="container-lux py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.name }]} />
      </div>

      <section className="container-lux grid md:grid-cols-3 gap-12 pb-16">
        <p className="md:col-span-2 text-lg font-serif text-warmgray leading-relaxed">{project.description}</p>
        <dl className="space-y-4 text-sm">
          <div><dt className="text-warmgray text-xs uppercase tracking-wide">Location</dt><dd className="font-medium">{project.location}</dd></div>
          <div><dt className="text-warmgray text-xs uppercase tracking-wide">Project Type</dt><dd className="font-medium">{project.type}</dd></div>
          {project.designer && <div><dt className="text-warmgray text-xs uppercase tracking-wide">Designer</dt><dd className="font-medium">{project.designer}</dd></div>}
          {project.architect && <div><dt className="text-warmgray text-xs uppercase tracking-wide">Architect</dt><dd className="font-medium">{project.architect}</dd></div>}
          {project.contractor && <div><dt className="text-warmgray text-xs uppercase tracking-wide">Contractor</dt><dd className="font-medium">{project.contractor}</dd></div>}
          {project.materialsUsed.length > 0 && (
            <div><dt className="text-warmgray text-xs uppercase tracking-wide">Materials Used</dt><dd className="font-medium">{project.materialsUsed.join(", ")}</dd></div>
          )}
        </dl>
      </section>

      {project.gallery.length > 0 && (
        <section className="container-lux grid grid-cols-2 gap-4 pb-20">
          {project.gallery.map((img, i) => (
            <div key={i} className="relative aspect-[4/3]">
              <Image src={img} alt={`${project.name} ${i + 1}`} fill sizes="50vw" className="object-cover" />
            </div>
          ))}
        </section>
      )}

      {usedProducts.length > 0 && (
        <section className="container-lux pb-20">
          <h2 className="section-heading mb-8">Products Used in This Project</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {usedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <CTASection
        title="Considering a similar project?"
        primaryLabel="Request a Quote"
        primaryHref="/request-quote"
        secondaryLabel="Book a Free Estimate"
        secondaryHref="/showroom"
      />
    </div>
  );
}
