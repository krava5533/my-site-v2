"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import { LeadSource } from "@/types";

const PROJECT_TYPES = ["Kitchen", "Bathroom", "Flooring", "Commercial", "Hospitality", "Outdoor", "Whole Home", "Other"];
const BUDGETS = ["Under $5,000", "$5,000–$15,000", "$15,000–$50,000", "$50,000+", "Not sure yet"];
const TIMELINES = ["Immediately", "1–3 months", "3–6 months", "6+ months", "Just researching"];

export default function QuoteForm({
  presetProduct,
  source = "Quote",
}: {
  presetProduct?: string;
  source?: LeadSource;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("source", source);
    if (presetProduct) formData.set("product", presetProduct);
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/quote", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      form.reset();
      setFiles([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-warmgray/20 p-10 text-center">
        <h3 className="font-serif text-2xl mb-3">Thank you — request received.</h3>
        <p className="text-warmgray">
          Our team has received your quote request and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {presetProduct && (
        <div className="bg-stonebeige/30 px-4 py-3 text-sm">
          Requesting a quote for: <strong className="capitalize">{presetProduct.replace(/-/g, " ")}</strong>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="form-label">Full Name *</label>
          <input name="fullName" required className="form-input" />
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
          <label className="form-label">Company</label>
          <input name="company" className="form-input" />
        </div>
        <div>
          <label className="form-label">Project Type *</label>
          <select name="projectType" required className="form-input" defaultValue="">
            <option value="" disabled>Select project type</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Project Location *</label>
          <input name="projectLocation" required className="form-input" placeholder="City, Province" />
        </div>
        <div>
          <label className="form-label">Project Size</label>
          <input name="projectSize" className="form-input" placeholder="e.g. 500 sq ft" />
        </div>
        <div>
          <label className="form-label">Material Interest</label>
          <input name="materialInterest" className="form-input" placeholder="e.g. Marble, Porcelain" />
        </div>
        <div>
          <label className="form-label">Budget Range</label>
          <select name="budgetRange" className="form-input" defaultValue="">
            <option value="" disabled>Select budget range</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Timeline</label>
          <select name="timeline" className="form-input" defaultValue="">
            <option value="" disabled>Select timeline</option>
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Message</label>
        <textarea name="message" rows={4} className="form-input" placeholder="Tell us about your project..." />
      </div>

      <div>
        <label className="form-label">Upload Project Files (optional)</label>
        <FileUploader files={files} onChange={setFiles} />
      </div>

      {status === "error" && <p className="form-error">{errorMsg}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
        {status === "submitting" ? "Submitting..." : "Request My Quote"}
      </button>
    </form>
  );
}
