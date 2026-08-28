"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { MaterialPage } from "@/types";

export default function MaterialsManager({ initial }: { initial: MaterialPage[] }) {
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
      const res = await fetch("/api/admin/materials", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.material, ...prev]);
      form.reset();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(slug: string) {
    setItems((prev) => prev.filter((m) => m.slug !== slug));
    await fetch("/api/admin/materials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Add a Material</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="form-label">Material Name *</label>
            <input name="name" required className="form-input" placeholder="e.g. Porcelain" />
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea name="intro" required rows={3} className="form-input" />
          </div>
          <div>
            <label className="form-label">Characteristics (comma separated)</label>
            <input name="characteristics" className="form-input" placeholder="Durable, Low maintenance" />
          </div>
          <div>
            <label className="form-label">Care Instructions (comma separated)</label>
            <input name="care" className="form-input" placeholder="Sweep and damp mop, No sealing required" />
          </div>
          <div>
            <label className="form-label">Applications (comma separated)</label>
            <input name="applications" className="form-input" placeholder="Kitchens, Bathrooms, Flooring" />
          </div>
          <div>
            <label className="form-label">Photo</label>
            <input type="file" name="heroImage" accept="image/*" className="form-input" />
          </div>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Adding..." : "Add Material"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">All Materials ({items.length})</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.slug} className="bg-white border border-warmgray/15">
              <div className="relative aspect-square">
                <Image src={m.heroImage} alt={m.name} fill sizes="200px" className="object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="font-medium text-sm">{m.name}</p>
                <button onClick={() => handleDelete(m.slug)} className="text-warmgray hover:text-red-600">
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
