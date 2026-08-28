"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/testimonials";
import { Trash2 } from "lucide-react";

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote, author, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setItems((prev) => [json.testimonial, ...prev]);
      setQuote("");
      setAuthor("");
      setRole("");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
    await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="font-serif text-xl mb-4">Add a Review</h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-md">
          <div>
            <label className="form-label">Review Text *</label>
            <textarea required value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className="form-input" />
          </div>
          <div>
            <label className="form-label">Customer Name *</label>
            <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Project / Location (optional)</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="form-input" placeholder="e.g. Kitchen Remodel, Toronto" />
          </div>
          {status === "error" && <p className="form-error">{errorMsg}</p>}
          <button type="submit" disabled={status === "saving"} className="btn-primary">
            {status === "saving" ? "Adding..." : "Add Review"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl mb-4">Current Reviews ({items.length})</h2>
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-white border border-warmgray/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm mb-2">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs text-warmgray">
                    {t.author} {t.role && `— ${t.role}`} {t.demo && <span className="text-accent">(demo)</span>}
                  </p>
                </div>
                <button onClick={() => handleDelete(t.id)} aria-label="Delete review" className="text-warmgray hover:text-red-600 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-warmgray text-sm">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
