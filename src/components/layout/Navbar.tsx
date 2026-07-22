"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Sparkles, UserRound } from "lucide-react";
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
    <header className="glass sticky top-0 z-30 border-b border-border/80">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-12 items-center">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded-full border border-border/70 bg-white/70 p-2.5 text-dark transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
          >
            <Menu size={20} strokeWidth={1.7} />
          </button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image 
            src="/logo1.png"
            alt="WEदेसी" 
            width={280} 
            height={140}
            className="h-24 w-auto"
            priority
          />
        </Link>

        <div className="flex min-w-12 items-center justify-end gap-2">
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-3 py-2 text-sm text-dark">
              <UserRound size={16} />
              <span className="hidden sm:inline">{user.name || user.email}</span>
            </Link>
          ) : (
            <Link href="/auth" className="rounded-full border border-border/70 bg-white/70 px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-white">
              Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
