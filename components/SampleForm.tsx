"use client";

import { useState } from "react";
import { products } from "@/lib/data/products";

export default function SampleForm({ presetProduct }: { presetProduct?: string }) {
  const [selected, setSelected] = useState<string[]>(presetProduct ? [presetProduct] : []);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleProduct(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length === 0) {
      setStatus("error");
      setErrorMsg("Please select at least one product.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    selected.forEach((s) => formData.append("products", s));

    try {
      const res = await fetch("/api/sample", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      form.reset();
      setSelected([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-warmgray/20 p-10 text-center">
        <h3 className="font-serif text-2xl mb-3">Sample request received.</h3>
        <p className="text-warmgray">We&rsquo;ll ship your samples and follow up shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="form-label">Select Products *</label>
        <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-warmgray/20 p-3">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(p.slug)}
                onChange={() => toggleProduct(p.slug)}
                className="accent-accent"
              />
              {p.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="form-label">Name *</label>
          <input name="name" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Email *</label>
          <input type="email" name="email" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Phone *</label>
          <input type="tel" name="phone" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Quantity</label>
          <input name="quantity" className="form-input" placeholder="e.g. 1 sample per product" />
        </div>
        <div>
          <label className="form-label">Project Type</label>
          <input name="projectType" className="form-input" />
        </div>
        <div>
          <label className="form-label">Project Timeline</label>
          <input name="timeline" className="form-input" />
        </div>
      </div>

      <div>
        <label className="form-label">Shipping Address *</label>
        <textarea name="shippingAddress" required rows={2} className="form-input" />
      </div>

      <div>
        <label className="form-label">Message</label>
        <textarea name="message" rows={3} className="form-input" />
      </div>

      {status === "error" && <p className="form-error">{errorMsg}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
        {status === "submitting" ? "Submitting..." : "Request My Samples"}
      </button>
    </form>
  );
}
