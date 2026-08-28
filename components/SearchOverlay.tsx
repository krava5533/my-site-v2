"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { products } from "@/lib/data/products";
import { collections } from "@/lib/data/collections";
import { projects } from "@/lib/data/projects";
import { blogPosts } from "@/lib/data/blog";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    return {
      products: products
        .filter((p) => `${p.name} ${p.material} ${p.color} ${p.finish}`.toLowerCase().includes(q))
        .slice(0, 5),
      collections: collections.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3),
      projects: projects.filter((p) => `${p.name} ${p.location}`.toLowerCase().includes(q)).slice(0, 3),
      posts: blogPosts.filter((b) => b.title.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-warmwhite mx-auto mt-24 max-w-2xl w-[92%] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-warmgray/20 px-5 py-4">
          <Search size={20} className="text-warmgray" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections, projects, inspiration..."
            className="flex-1 bg-transparent outline-none text-base"
          />
          <button onClick={onClose} aria-label="Close search">
            <X size={20} className="text-warmgray" />
          </button>
        </div>

        {results && (
          <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
            {results.products.length > 0 && (
              <section>
                <p className="eyebrow mb-2">Products</p>
                {results.products.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} onClick={onClose} className="block py-2 text-sm hover:text-accent">
                    {p.name} <span className="text-warmgray">— {p.material}</span>
                  </Link>
                ))}
              </section>
            )}
            {results.collections.length > 0 && (
              <section>
                <p className="eyebrow mb-2">Collections</p>
                {results.collections.map((c) => (
                  <Link key={c.id} href={`/collections/${c.slug}`} onClick={onClose} className="block py-2 text-sm hover:text-accent">
                    {c.name}
                  </Link>
                ))}
              </section>
            )}
            {results.projects.length > 0 && (
              <section>
                <p className="eyebrow mb-2">Projects</p>
                {results.projects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.slug}`} onClick={onClose} className="block py-2 text-sm hover:text-accent">
                    {p.name} <span className="text-warmgray">— {p.location}</span>
                  </Link>
                ))}
              </section>
            )}
            {results.posts.length > 0 && (
              <section>
                <p className="eyebrow mb-2">Inspiration</p>
                {results.posts.map((b) => (
                  <Link key={b.id} href={`/inspiration/${b.slug}`} onClick={onClose} className="block py-2 text-sm hover:text-accent">
                    {b.title}
                  </Link>
                ))}
              </section>
            )}
            {!results.products.length && !results.collections.length && !results.projects.length && !results.posts.length && (
              <p className="text-sm text-warmgray">No results for &ldquo;{query}&rdquo;.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
