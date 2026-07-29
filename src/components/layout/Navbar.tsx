"use client";

import Image from "next/image";
import Link from "next/link";
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
    <header className="sticky top-0 z-40 border-b border-[#7a0000]/10 bg-white text-[#2a0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:bg-[#330404] dark:text-[#fff1ee]">
      <div className="section-shell relative flex h-24 items-center justify-between py-4">
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border !border-[#7d1313] !bg-[#7d1313] text-white transition-all duration-200 hover:-translate-y-0.5 hover:!bg-[#940c0c] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <Menu size={22} strokeWidth={1.7} />
        </button>

        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:-translate-y-1/2">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="WEदेसी logo" width={96} height={96} className="h-20 w-auto object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-full border border-[#7d1313] bg-[#7d1313] px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-[#940c0c] md:flex dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <UserRound size={16} />
              <span>{user.name || user.email}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="hidden rounded-full border !border-[#7d1313] !bg-[#7d1313] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:!bg-[#940c0c] md:inline-flex dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/cart"
            className="flex h-12 w-12 items-center justify-center rounded-full border !border-[#7d1313] !bg-[#7d1313] text-white transition-all duration-200 hover:!bg-[#940c0c] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <ShoppingBag size={20} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
