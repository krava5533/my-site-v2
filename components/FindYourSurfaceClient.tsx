"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/CTASection";
import { Application, MaterialType, Product } from "@/types";

const SPACES: { label: string; value: Application }[] = [
  { label: "Kitchen", value: "Kitchens" },
  { label: "Bathroom", value: "Bathrooms" },
  { label: "Living Space", value: "Living Spaces" },
  { label: "Commercial", value: "Commercial" },
  { label: "Outdoor", value: "Outdoor" },
];

const STYLES = ["Modern", "Classic", "Minimal", "Luxury", "Natural", "Warm"];

const MATERIAL_OPTIONS: MaterialType[] = ["Marble", "Porcelain", "Natural Stone", "Quartz", "Sintered Stone"];

// Rough style → finish/color mapping used purely to make recommendations feel tailored
const STYLE_FINISH_HINT: Record<string, string[]> = {
  Modern: ["Polished", "Matte"],
  Classic: ["Honed", "Polished"],
  Minimal: ["Matte", "Honed"],
  Luxury: ["Polished", "Leathered"],
  Natural: ["Textured", "Brushed"],
  Warm: ["Brushed", "Textured"],
};

export default function FindYourSurfaceClient({ products }: { products: Product[] }) {
  const [step, setStep] = useState(1);
  const [space, setSpace] = useState<Application | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [material, setMaterial] = useState<MaterialType | null>(null);

  const recommendations =
    step === 4
      ? products
          .filter((p) => (space ? p.applications.includes(space) : true))
          .filter((p) => (material ? p.material === material : true))
          .filter((p) => (style ? STYLE_FINISH_HINT[style]?.includes(p.finish) : true))
          .slice(0, 8)
      : [];

  const fallback = recommendations.length === 0 && step === 4
    ? products.filter((p) => (space ? p.applications.includes(space) : true)).slice(0, 8)
    : recommendations;

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Find Your Surface" }]} />
      <div className="mt-6 mb-12 max-w-2xl">
        <p className="eyebrow mb-3">Find Your Surface</p>
        <h1 className="section-heading">Let&rsquo;s find the right material for your project</h1>
      </div>

      {step === 1 && (
        <div>
          <p className="text-lg font-serif mb-6">What are you designing?</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {SPACES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setSpace(s.value); setStep(2); }}
                className="border border-warmgray/30 p-6 text-left hover:border-accent hover:bg-accent/5 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-lg font-serif mb-6">What style are you drawn to?</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => { setStyle(s); setStep(3); }}
                className="border border-warmgray/30 p-6 text-left hover:border-accent hover:bg-accent/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-8 text-xs uppercase tracking-wide text-warmgray underline">Back</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-lg font-serif mb-6">What material interests you most?</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {MATERIAL_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => { setMaterial(m); setStep(4); }}
                className="border border-warmgray/30 p-6 text-left hover:border-accent hover:bg-accent/5 transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="mt-8 text-xs uppercase tracking-wide text-warmgray underline">Back</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <p className="text-lg font-serif">Recommended for your {space?.toLowerCase()}</p>
            <button onClick={() => { setStep(1); setSpace(null); setStyle(null); setMaterial(null); }} className="text-xs uppercase tracking-wide text-warmgray underline">
              Start Over
            </button>
          </div>
          {fallback.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {fallback.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-warmgray">
              No exact matches — browse our{" "}
              <Link href="/products" className="text-accent underline">full catalog</Link> instead.
            </p>
          )}
          <div className="mt-12 bg-stonebeige/25 p-8 text-center">
            <p className="font-serif text-xl mb-4">Want expert guidance on these options?</p>
            <Link href="/request-quote" className="btn-primary">Request a Quote</Link>
          </div>
        </div>
      )}
    </div>
  );
}
