"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center container-lux">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-2 text-center">LuxeStone Admin</h1>
        <p className="text-sm text-warmgray text-center mb-8">Sign in to manage leads and content.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-warmgray text-center mt-6">
          Mock mode credentials come from ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD in your .env.local
        </p>
      </div>
    </div>
  );
}
