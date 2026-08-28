"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function set<K extends keyof SiteSettings>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="form-label">Phone Number</label>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} className="form-input" placeholder="(555) 123-4567" />
      </div>
      <div>
        <label className="form-label">Email Address</label>
        <input value={values.email} onChange={(e) => set("email", e.target.value)} className="form-input" placeholder="you@yourbusiness.com" />
      </div>
      <div>
        <label className="form-label">Business Address / Service Area</label>
        <input value={values.address} onChange={(e) => set("address", e.target.value)} className="form-input" placeholder="City, Province or service area" />
      </div>
      <div>
        <label className="form-label">Instagram URL</label>
        <input value={values.instagram} onChange={(e) => set("instagram", e.target.value)} className="form-input" placeholder="https://instagram.com/yourbusiness" />
      </div>
      <div>
        <label className="form-label">LinkedIn URL</label>
        <input value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} className="form-input" placeholder="https://linkedin.com/company/yourbusiness" />
      </div>
      <div>
        <label className="form-label">Pinterest URL</label>
        <input value={values.pinterest} onChange={(e) => set("pinterest", e.target.value)} className="form-input" />
      </div>
      <div>
        <label className="form-label">Houzz URL</label>
        <input value={values.houzz} onChange={(e) => set("houzz", e.target.value)} className="form-input" />
      </div>

      {status === "error" && <p className="form-error">Something went wrong — please try again.</p>}
      <button type="submit" disabled={status === "saving"} className="btn-primary">
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
