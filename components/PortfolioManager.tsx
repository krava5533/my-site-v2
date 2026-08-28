"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import type { PortfolioItem } from "@/lib/portfolio";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=70";

const CATEGORIES = [
  "Luxury Residential", "Kitchens", "Bathrooms", "Living Spaces", "Custom Homes",
  "Commercial", "Hospitality", "Restaurants", "Hotels", "Outdoor",
];

export default function PortfolioManager({ initial }: { initial: PortfolioItem[] }) {
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
      const res = await fetch("/api/admin/portfolio", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.item, ...prev]);
      form.reset();
      setFiles([]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch("/api/admin/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Upload a Completed Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Project Name *</label>
              <input name="name" required className="form-input" placeholder="e.g. Smith Family Kitchen" />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select name="category" className="form-input" defaultValue="">
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Location</label>
              <input name="location" className="form-input" placeholder="City, Province" />
            </div>
            <div>
              <label className="form-label">Materials Used</label>
              <input name="materialsUsed" className="form-input" placeholder="e.g. Porcelain, Marble" />
            </div>
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea name="description" required rows={4} className="form-input" placeholder="Describe the project..." />
          </div>
          <div>
            <label className="form-label">Photos *</label>
            <FileUploader files={files} onChange={setFiles} />
          </div>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Uploading..." : "Add to Project Gallery"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">Your Uploaded Projects ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-warmgray text-sm">No projects uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-warmgray/15">
                <div className="relative aspect-video">
                  <Image src={item.images[0] || FALLBACK_IMG} alt={item.name} fill sizes="300px" className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-warmgray mb-2">{item.category} {item.location && `— ${item.location}`}</p>
                  <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 text-xs text-warmgray hover:text-red-600">
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
