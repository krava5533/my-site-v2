import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/store/products";
import { getCollectionBySlug } from "@/lib/store/collections";
import { products as seedProducts } from "@/lib/data/products";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=70";

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.material}`,
    description: product.description,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const collection = product.collectionSlug ? await getCollectionBySlug(product.collectionSlug) : undefined;
  const related = await getRelatedProducts(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    material: product.material,
    color: product.color,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "USD" },
  };

  return (
    <div className="container-lux py-12 md:py-16 pb-28 lg:pb-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-12 mt-8">
        <div className="space-y-4">
          <div className="relative aspect-square bg-stonebeige/30">
            <Image src={product.images[0] || FALLBACK_IMG} alt={product.name} fill sizes="50vw" className="object-cover" priority />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-stonebeige/30">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill sizes="16vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {collection && (
            <Link href={`/collections/${collection.slug}`} className="text-xs uppercase tracking-wide text-accent hover:underline">
              {collection.name} Collection
            </Link>
          )}
          <h1 className="font-serif text-3xl md:text-4xl mt-2 mb-4">{product.name}</h1>
          <p className="text-warmgray leading-relaxed mb-6">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 text-sm mb-8 border-t border-warmgray/20 pt-6">
            <div><dt className="text-warmgray">Material</dt><dd className="font-medium">{product.material}</dd></div>
            <div><dt className="text-warmgray">Color</dt><dd className="font-medium">{product.color}</dd></div>
            <div><dt className="text-warmgray">Finish</dt><dd className="font-medium">{product.finish}</dd></div>
            <div><dt className="text-warmgray">Availability</dt><dd className="font-medium">{product.availability}</dd></div>
            <div><dt className="text-warmgray">Sizes</dt><dd className="font-medium">{product.sizes.join(", ") || "—"}</dd></div>
            <div><dt className="text-warmgray">Thickness</dt><dd className="font-medium">{product.thicknessMm.length ? `${product.thicknessMm.join("mm, ")}mm` : "—"}</dd></div>
          </dl>

          {product.applications.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wide text-warmgray mb-2">Applications</p>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="text-xs border border-warmgray/30 px-3 py-1.5">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-stonebeige/25 p-6 mb-8">
            <p className="font-serif text-lg mb-4">Interested in this surface?</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/request-quote?product=${product.slug}`} className="btn-primary !py-3 text-xs flex-1 justify-center">
                Request a Quote
              </Link>
              <Link href="/showroom" className="btn-secondary !py-3 text-xs flex-1 justify-center">
                Book a Free Estimate
              </Link>
              <Link href={`/upload-project?product=${product.slug}`} className="btn-secondary !py-3 text-xs flex-1 justify-center">
                Upload Your Project
              </Link>
            </div>
            <p className="text-xs text-warmgray mt-4">
              Is this right for your project?{" "}
              <Link href="/contact" className="text-accent underline underline-offset-2">Ask a specialist</Link>.
            </p>
          </div>

          {product.technicalSpecs.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-warmgray mb-3">Technical Specifications</p>
              <table className="w-full text-sm">
                <tbody>
                  {product.technicalSpecs.map((spec) => (
                    <tr key={spec.label} className="border-b border-warmgray/15">
                      <td className="py-2 text-warmgray">{spec.label}</td>
                      <td className="py-2 text-right font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.documents.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-warmgray mb-3">Documents</p>
              <ul className="space-y-2">
                {product.documents.map((doc) => (
                  <li key={doc.label}>
                    <a href={doc.href} className="text-sm text-accent hover:underline">{doc.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="section-heading mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
