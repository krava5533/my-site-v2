"use client";

import { useState } from "react";

const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/appointment", { method: "POST", body: formData });
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
        <h3 className="font-serif text-2xl mb-3">Appointment requested.</h3>
        <p className="text-warmgray">We&rsquo;ll confirm your appointment shortly.</p>
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
          <label className="form-label">Phone *</label>
          <input type="tel" name="phone" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Project Type</label>
          <input name="projectType" className="form-input" />
        </div>
        <div>
          <label className="form-label">Preferred Date *</label>
          <input type="date" name="preferredDate" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Preferred Time *</label>
          <select name="preferredTime" required className="form-input" defaultValue="">
            <option value="" disabled>Select a time</option>
            {TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Number of Guests</label>
          <input name="guests" type="number" min={1} className="form-input" />
        </div>
      </div>
      <div>
        <label className="form-label">Message</label>
        <textarea name="message" rows={3} className="form-input" />
      </div>
      {status === "error" && <p className="form-error">{errorMsg}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
        {status === "submitting" ? "Submitting..." : "Book My Free Estimate"}
      </button>
    </form>
  );
}
