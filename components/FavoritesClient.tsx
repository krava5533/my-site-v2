"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/lib/hooks/useLocalList";
import { Product } from "@/types";

export default function FavoritesClient({ products }: { products: Product[] }) {
  const favorites = useFavorites();
  const favoriteProducts = products.filter((p) => favorites.items.includes(p.slug));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, items: favoriteProducts.map((p) => p.name) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Favorites" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Favorites</p>
        <h1 className="section-heading">Your saved surfaces</h1>
      </div>

      {favoriteProducts.length === 0 ? (
        <p className="text-warmgray">
          You haven&rsquo;t saved any products yet. Browse the{" "}
          <Link href="/products" className="text-accent underline">catalog</Link> and tap the heart icon to save favorites here.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-16">
            {favoriteProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="max-w-xl bg-stonebeige/25 p-8">
            <h2 className="font-serif text-2xl mb-4">Send My Selection</h2>
            {status === "success" ? (
              <p className="text-warmgray">Thanks — your selection has been sent to our team.</p>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="form-input" />
                </div>
                {status === "error" && <p className="form-error">{errorMsg}</p>}
                <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
                  {status === "submitting" ? "Sending..." : "Send My Selection"}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
