"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed.");
        return;
      }

      const next = searchParams.get("next") || "/admin";
      window.location.assign(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="glass w-full max-w-md rounded-[28px] border border-border p-6 shadow-[0_24px_90px_-32px_rgba(43,43,43,0.35)] md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-dark text-lg font-semibold text-white">
            A
          </div>
          <h1 className="font-heading text-3xl text-dark">Weदेसी</h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-dark/45">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-dark/60">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-[15px] focus:border-gold focus:outline-none"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-dark py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-dark/45">
          Secure access for store management
        </p>
      </div>
    </div>
  );
}
