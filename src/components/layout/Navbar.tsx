"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { setDrawerOpen } = useStore();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/70 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-center border-b border-border/70 py-2 text-[11px] uppercase tracking-[0.3em] text-dark/60">
        <p>Luxury kurtas made with care, tailored for modern moments.</p>
      </div>

      <div className="section-shell relative flex h-24 items-center justify-between py-4">
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-white text-dark transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
        >
          <Menu size={22} strokeWidth={1.7} />
        </button>

        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/logo.png"
            alt="WEदेसी"
            width={196}
            height={72}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-full border border-border/70 bg-white px-4 py-2 text-sm text-dark transition-all duration-200 hover:bg-white/90 md:flex"
            >
              <UserRound size={16} />
              <span>{user.name || user.email}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="hidden rounded-full border border-border/70 bg-white px-4 py-2 text-sm font-medium text-dark transition-all duration-200 hover:bg-white/90 md:inline-flex"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/cart"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-white text-dark transition-all duration-200 hover:bg-white/90"
          >
            <ShoppingBag size={20} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
