"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) router.replace(redirectTo.startsWith("/") ? redirectTo : "/");
      } catch {
        // ignore
      }
    }
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "signup"
        ? { name: form.name, email: form.email, password: form.password, confirmPassword: form.confirmPassword }
        : { email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }

      const destination = redirectTo.startsWith("/") ? redirectTo : "/";
      router.replace(destination);
    } catch {
      setError("Unable to authenticate right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-white/80 shadow-[0_24px_90px_rgba(43,43,43,0.12)] backdrop-blur-sm"
      >
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.24),transparent_45%),linear-gradient(135deg,#fdf8ef_0%,#f3e7d7_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
                <Sparkles size={13} />
                WEदेसी
              </div>
              <h1 className="mt-8 max-w-md font-heading text-4xl leading-[0.95] text-dark">
                Welcome to a more considered wardrobe.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-dark/65">
                Sign in to access your wishlist, orders, and a private shopping experience tailored to you.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-5 text-sm text-dark/70">
              “A wardrobe shaped by elegance, craft, and ease.”
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Account</p>
                <h2 className="mt-2 font-heading text-3xl text-dark">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>
              </div>
              <Link href="/" className="text-sm font-medium text-dark/60 transition-colors hover:text-dark">
                Back home
              </Link>
            </div>

            <div className="mt-7 flex rounded-full border border-border/70 bg-bg p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${mode === "signin" ? "bg-dark text-white" : "text-dark/65"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${mode === "signup" ? "bg-dark text-white" : "text-dark/65"}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-sm text-dark/70">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-gold"
                    placeholder="Aarohi Sharma"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm text-dark/70">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-gold"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-dark/70">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gold"
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/55">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-sm text-dark/70">Confirm Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gold"
                      placeholder="Re-enter password"
                    />
                    <button type="button" onClick={() => setShowConfirm((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/55">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-dark px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f1a17] disabled:opacity-60"
              >
                {loading ? <LoaderCircle className="animate-spin" size={18} /> : null}
                {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
