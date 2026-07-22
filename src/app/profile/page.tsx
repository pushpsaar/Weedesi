"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, LogOut, PackageCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) router.replace("/auth");
        else setUser(data.user);
      } catch {
        router.replace("/auth");
      }
    }
    loadUser();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_70px_rgba(43,43,43,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dark text-white">
              <UserRound size={24} />
            </div>
            <div>
              <h1 className="font-heading text-3xl text-dark">My Account</h1>
              <p className="text-sm text-dark/60">{user?.name || "Welcome back"}</p>
              <p className="text-sm text-dark/50">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-dark/70 transition-colors hover:bg-dark hover:text-white">
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link href="/track-order" className="rounded-[1.3rem] border border-border bg-bg p-5 transition-colors hover:border-gold/60">
            <div className="flex items-center gap-3">
              <PackageCheck size={18} className="text-gold-dark" />
              <span className="font-semibold text-dark">My Orders</span>
            </div>
            <p className="mt-3 text-sm text-dark/60">Track your recent purchases and delivery updates.</p>
          </Link>
          <Link href="/wishlist" className="rounded-[1.3rem] border border-border bg-bg p-5 transition-colors hover:border-gold/60">
            <div className="flex items-center gap-3">
              <Heart size={18} className="text-gold-dark" />
              <span className="font-semibold text-dark">Wishlist</span>
            </div>
            <p className="mt-3 text-sm text-dark/60">Keep your favorite pieces saved for later.</p>
          </Link>
          <div className="rounded-[1.3rem] border border-border bg-bg p-5">
            <div className="flex items-center gap-3">
              <UserRound size={18} className="text-gold-dark" />
              <span className="font-semibold text-dark">Profile</span>
            </div>
            <p className="mt-3 text-sm text-dark/60">Your account details and preferences stay secured here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
