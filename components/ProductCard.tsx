"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, GitCompare } from "lucide-react";
import { Product } from "@/types";
import { useFavorites, useCompare } from "@/lib/hooks/useLocalList";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=70";

export default function ProductCard({ product }: { product: Product }) {
  const favorites = useFavorites();
  const compare = useCompare();
  const isFavorite = favorites.items.includes(product.slug);
  const isCompared = compare.items.includes(product.slug);

  return (
    <div className="group">
      <div className="card-hover-reveal relative aspect-[4/5] bg-stonebeige/30">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0] || FALLBACK_IMG}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </Link>
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Toggle favorite"
            onClick={() => favorites.toggle(product.slug)}
            className={`p-2 backdrop-blur bg-warmwhite/80 hover:bg-warmwhite transition-colors ${isFavorite ? "text-accent" : "text-charcoal"}`}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Toggle compare"
            onClick={() => (isCompared ? compare.remove(product.slug) : compare.add(product.slug, 3))}
            className={`p-2 backdrop-blur bg-warmwhite/80 hover:bg-warmwhite transition-colors ${isCompared ? "text-accent" : "text-charcoal"}`}
          >
            <GitCompare size={14} />
          </button>
        </div>
      </div>
      <div className="pt-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg text-charcoal group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-warmgray mt-1">
          {product.material} &middot; {product.finish} &middot; {product.color}
        </p>
        <div className="flex gap-3 mt-3">
          <Link
            href={`/request-quote?product=${product.slug}`}
            className="text-xs uppercase tracking-wide text-charcoal border-b border-charcoal/40 hover:border-accent hover:text-accent transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
