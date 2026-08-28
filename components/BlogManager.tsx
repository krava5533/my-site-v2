"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { BlogPost } from "@/types";

const CATEGORIES = ["Tile Trends", "Bathroom Design", "Kitchen Design", "Stone Guide", "Material Guide", "Maintenance", "Architecture", "Interior Design"];

export default function BlogManager({ initial }: { initial: BlogPost[] }) {
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
      const res = await fetch("/api/admin/blog", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.post, ...prev]);
      form.reset();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Add a Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="form-label">Title *</label>
            <input name="title" required className="form-input" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select name="category" className="form-input" defaultValue="Interior Design">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Author</label>
              <input name="author" className="form-input" defaultValue="Our Team" />
            </div>
          </div>
          <div>
            <label className="form-label">Short Excerpt</label>
            <input name="excerpt" className="form-input" placeholder="One sentence summary shown on the list page" />
          </div>
          <div>
            <label className="form-label">Content *</label>
            <textarea name="content" required rows={6} className="form-input" />
          </div>
          <div>
            <label className="form-label">Cover Photo</label>
            <input type="file" name="coverImage" accept="image/*" className="form-input" />
          </div>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">All Posts ({items.length})</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-white border border-warmgray/15">
              <div className="relative aspect-video">
                <Image src={p.coverImage} alt={p.title} fill sizes="300px" className="object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm mb-2">{p.title}</p>
                <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-xs text-warmgray hover:text-red-600">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
