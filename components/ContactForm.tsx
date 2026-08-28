"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-warmgray/20 p-10 text-center">
        <h3 className="font-serif text-2xl mb-3">Message sent.</h3>
        <p className="text-warmgray">Our team has received your message and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="form-label">Phone</label>
          <input type="tel" name="phone" className="form-input" />
        </div>
        <div>
          <label className="form-label">Subject</label>
          <input name="subject" className="form-input" />
        </div>
      </div>
      <div>
        <label className="form-label">Message *</label>
        <textarea name="message" required rows={5} className="form-input" />
      </div>
      {status === "error" && <p className="form-error">{errorMsg}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
        {status === "submitting" ? "Sending..." : "Talk to a Specialist"}
      </button>
    </form>
  );
}
