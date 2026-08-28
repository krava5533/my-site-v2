"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Breadcrumbs } from "@/components/CTASection";
import { useCompare } from "@/lib/hooks/useLocalList";
import { Product } from "@/types";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=70";

const ROWS: { label: string; get: (p: Product) => string }[] = [
  { label: "Material", get: (p) => p.material },
  { label: "Finish", get: (p) => p.finish },
  { label: "Color", get: (p) => p.color },
  { label: "Sizes", get: (p) => p.sizes.join(", ") },
  { label: "Thickness", get: (p) => p.thicknessMm.join("mm, ") + "mm" },
  { label: "Applications", get: (p) => p.applications.join(", ") },
  { label: "Availability", get: (p) => p.availability },
];

export default function CompareClient({ products }: { products: Product[] }) {
  const compare = useCompare();
  const compareProducts = products.filter((p) => compare.items.includes(p.slug));

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare Products" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Compare Products</p>
        <h1 className="section-heading">Compare up to 3 products side by side</h1>
      </div>

      {compareProducts.length === 0 ? (
        <p className="text-warmgray">
          You haven&rsquo;t added any products to compare yet. Browse the{" "}
          <Link href="/products" className="text-accent underline">catalog</Link> and tap the compare icon to add products here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-40" />
                {compareProducts.map((p) => (
                  <th key={p.id} className="text-left p-4 align-top">
                    <div className="relative aspect-square w-full mb-3">
                      <Image src={p.images[0] || FALLBACK_IMG} alt={p.name} fill sizes="200px" className="object-cover" />
                    </div>
                    <Link href={`/products/${p.slug}`} className="font-serif text-lg hover:text-accent">{p.name}</Link>
                    <button
                      onClick={() => compare.remove(p.slug)}
                      className="flex items-center gap-1 text-xs text-warmgray hover:text-red-600 mt-2"
                    >
                      <X size={12} /> Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-warmgray/15">
                  <td className="p-4 text-xs uppercase tracking-wide text-warmgray">{row.label}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-sm">{row.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-10">
            <Link href="/request-quote" className="btn-primary">Request Information</Link>
          </div>
        </div>
      )}
    </div>
  );
}
