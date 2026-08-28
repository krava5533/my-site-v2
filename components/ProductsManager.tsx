"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { Product, Collection } from "@/types";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=70";

const MATERIALS = ["Marble", "Porcelain", "Natural Stone", "Granite", "Quartz", "Sintered Stone", "Terrazzo", "Travertine", "Limestone", "Slate", "Mosaic", "Glass", "Large Format Slabs"];
const FINISHES = ["Polished", "Honed", "Matte", "Textured", "Brushed", "Leathered"];
const AVAILABILITY = ["In Stock", "Special Order", "Limited"];

export default function ProductsManager({ initial, collections }: { initial: Product[]; collections: Collection[] }) {
  const [items, setItems] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch("/api/admin/products", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.product, ...prev]);
      form.reset();
      setFiles([]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Add a Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Product Name *</label>
              <input name="name" required className="form-input" />
            </div>
            <div>
              <label className="form-label">Collection</label>
              <select name="collectionSlug" className="form-input" defaultValue="">
                <option value="">None</option>
                {collections.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Material</label>
              <select name="material" className="form-input" defaultValue="Porcelain">
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Finish</label>
              <select name="finish" className="form-input" defaultValue="Matte">
                {FINISHES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Color</label>
              <input name="color" className="form-input" />
            </div>
            <div>
              <label className="form-label">Availability</label>
              <select name="availability" className="form-input" defaultValue="In Stock">
                {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Sizes (comma separated)</label>
              <input name="sizes" className="form-input" placeholder='24" x 48", 12" x 24"' />
            </div>
            <div>
              <label className="form-label">Thickness in mm (comma separated)</label>
              <input name="thicknessMm" className="form-input" placeholder="9, 12" />
            </div>
          </div>
          <div>
            <label className="form-label">Applications (comma separated)</label>
            <input name="applications" className="form-input" placeholder="Kitchens, Bathrooms, Flooring" />
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea name="description" required rows={3} className="form-input" />
          </div>
          <div>
            <label className="form-label">Photos</label>
            <FileUploader files={files} onChange={setFiles} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" className="accent-accent" /> Feature on homepage
          </label>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">All Products ({items.length})</h2>
        <div className="bg-white border border-warmgray/15 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-warmgray/15 text-left text-xs uppercase tracking-wide text-warmgray">
                <th className="p-3"></th>
                <th className="p-3">Name</th>
                <th className="p-3">Material</th>
                <th className="p-3">Availability</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-warmgray/10">
                  <td className="p-3 w-14">
                    <div className="relative w-10 h-10">
                      <Image src={p.images[0] || FALLBACK_IMG} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.material}</td>
                  <td className="p-3">{p.availability}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(p.id)} className="text-warmgray hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
