"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const MATERIALS = [
  "Marble", "Porcelain", "Natural Stone", "Granite", "Quartz", "Sintered Stone",
  "Terrazzo", "Travertine", "Limestone", "Slate", "Mosaic", "Glass", "Large Format Slabs",
];
const FINISHES = ["Polished", "Honed", "Matte", "Textured", "Brushed", "Leathered"];
const APPLICATIONS = [
  "Kitchens", "Bathrooms", "Living Spaces", "Flooring", "Walls", "Fireplaces",
  "Outdoor", "Commercial", "Hospitality", "Restaurants", "Hotels", "Custom Homes",
];

type SortOption = "featured" | "name-asc" | "name-desc";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [material, setMaterial] = useState<string>("");
  const [finish, setFinish] = useState<string>("");
  const [application, setApplication] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (material && p.material !== material) return false;
      if (finish && p.finish !== finish) return false;
      if (application && !p.applications.includes(application as never)) return false;
      if (availability && p.availability !== availability) return false;
      if (query && !`${p.name} ${p.color}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    if (sort === "featured") {
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    } else if (sort === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [products, material, finish, application, availability, sort, query]);

  const resetFilters = () => {
    setMaterial("");
    setFinish("");
    setApplication("");
    setAvailability("");
    setQuery("");
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:items-end border-b border-warmgray/20 pb-8">
        <div className="flex-1">
          <label className="form-label">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Material</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className="form-input">
            <option value="">All Materials</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Finish</label>
          <select value={finish} onChange={(e) => setFinish(e.target.value)} className="form-input">
            <option value="">All Finishes</option>
            {FINISHES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Application</label>
          <select value={application} onChange={(e) => setApplication(e.target.value)} className="form-input">
            <option value="">All Applications</option>
            {APPLICATIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Availability</label>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="form-input">
            <option value="">All</option>
            <option>In Stock</option>
            <option>Special Order</option>
            <option>Limited</option>
          </select>
        </div>
        <div>
          <label className="form-label">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="form-input">
            <option value="featured">Featured</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>
        {(material || finish || application || availability || query) && (
          <button onClick={resetFilters} className="text-xs uppercase tracking-wide text-warmgray hover:text-accent underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-warmgray mb-6">{filtered.length} products</p>

      {filtered.length === 0 ? (
        <p className="text-warmgray py-16 text-center">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
