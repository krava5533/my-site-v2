"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Collection } from "@/types";

export default function CollectionsManager({ initial }: { initial: Collection[] }) {
  const [items, setItems] = useState(initial);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/collections", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.collection, ...prev]);
      form.reset();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
    await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Add a Collection</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Collection Name *</label>
              <input name="name" required className="form-input" />
            </div>
            <div>
              <label className="form-label">Tagline</label>
              <input name="tagline" className="form-input" />
            </div>
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea name="description" required rows={3} className="form-input" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Colors (comma separated)</label>
              <input name="colors" className="form-input" placeholder="White, Grey" />
            </div>
            <div>
              <label className="form-label">Finishes (comma separated)</label>
              <input name="finishes" className="form-input" placeholder="Polished, Honed" />
            </div>
            <div>
              <label className="form-label">Sizes (comma separated)</label>
              <input name="sizes" className="form-input" placeholder='24" x 48"' />
            </div>
          </div>
          <div>
            <label className="form-label">Applications (comma separated)</label>
            <input name="applications" className="form-input" placeholder="Kitchens, Bathrooms" />
          </div>
          <div>
            <label className="form-label">Hero Photo</label>
            <input type="file" name="heroImage" accept="image/*" className="form-input" />
          </div>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Adding..." : "Add Collection"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">All Collections ({items.length})</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="bg-white border border-warmgray/15">
              <div className="relative aspect-video">
                <Image src={c.heroImage} alt={c.name} fill sizes="300px" className="object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="font-medium text-sm">{c.name}</p>
                <button onClick={() => handleDelete(c.id)} className="text-warmgray hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
