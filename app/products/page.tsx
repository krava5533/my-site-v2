import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/store/products";

export const metadata: Metadata = {
  title: "Products — Premium Tile, Stone & Porcelain Catalog",
  description: "Browse our full catalog of premium marble, porcelain, natural stone and large-format slabs for residential and commercial projects.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Product Catalog</p>
        <h1 className="section-heading">Every surface, considered.</h1>
        <p className="text-warmgray max-w-2xl mt-4">
          Explore our full range of marble, porcelain, natural stone and large-format slabs —
          filter by material, finish, application or availability to find the right surface for
          your project.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
