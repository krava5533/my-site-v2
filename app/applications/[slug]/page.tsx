import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, CTASection } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { APPLICATION_LIST, getApplicationBySlug } from "@/lib/data/applications";
import { getProducts } from "@/lib/store/products";

export function generateStaticParams() {
  return APPLICATION_LIST.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = getApplicationBySlug(params.slug);
  if (!app) return {};
  return { title: `${app.name} Surfaces`, description: app.description };
}

export default async function ApplicationDetailPage({ params }: { params: { slug: string } }) {
  const app = getApplicationBySlug(params.slug);
  if (!app) notFound();

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.applications.includes(app.name)).slice(0, 8);

  return (
    <div>
      <div className="relative h-[45vh] min-h-[320px]">
        <Image src={app.image} alt={app.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-deepblack/40" />
        <div className="relative h-full container-lux flex flex-col justify-end pb-10">
          <h1 className="font-serif text-4xl md:text-6xl text-warmwhite">{app.name}</h1>
        </div>
      </div>
      <div className="container-lux py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Applications", href: "/applications" }, { label: app.name }]} />
        <p className="text-warmgray max-w-2xl mt-6 text-lg font-serif">{app.description}</p>
      </div>

      <section className="container-lux pb-20">
        <h2 className="section-heading mb-8">Recommended Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-warmgray">Browse our full catalog for options suited to this application.</p>
        )}
      </section>

      <CTASection
        title={`Planning a ${app.name.toLowerCase()} project?`}
        primaryLabel="Request a Quote"
        primaryHref="/request-quote"
        secondaryLabel="Upload Your Project"
        secondaryHref="/upload-project"
      />
    </div>
  );
}
