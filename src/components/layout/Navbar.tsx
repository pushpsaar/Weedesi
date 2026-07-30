"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { setDrawerOpen } = useStore();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

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

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDarkTheme(root.classList.contains("dark"));

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const headerClass = isDarkTheme
    ? "navbar-shell sticky top-0 z-40 border-b border-white/10 bg-[#330404] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
    : "navbar-shell sticky top-0 z-40 border-b border-[#7a0000]/10 bg-white text-[#2a0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.08)]";

  const actionClass = "navbar-action rounded-full border border-[#8b0000] bg-[#8b0000] text-white shadow-[0_4px_12px_rgba(139,0,0,0.25)] transition-all duration-200 hover:bg-[#b30c0c]";
  const logoWordClass = isDarkTheme ? "text-[#f7b79b]" : "text-[#7a0000]";
  const logoNameClass = isDarkTheme ? "text-white" : "text-black";

  return (
    <header className={headerClass}>
      <div className="section-shell relative flex h-24 items-center justify-between py-4">
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className={`${actionClass} flex h-12 w-12 items-center justify-center hover:-translate-y-0.5`}
        >
          <Menu size={22} strokeWidth={1.7} />
        </button>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-none border-none bg-transparent p-0 shadow-none no-underline outline-none lg:-translate-y-1/2"
          aria-label="WEदेसी home"
        >
          <span className="select-none text-[1.45rem] font-semibold tracking-[0.16em] sm:text-[1.6rem]">
            <span className={logoWordClass}>WE</span>
            <span className={`ml-[-0.2rem] tracking-[0.01em] ${logoNameClass} [text-shadow:0_0_0_1px_#ffffff]`}>देसी</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className={`${actionClass} hidden items-center gap-2 px-4 py-2 text-sm font-semibold md:flex`}
            >
              <UserRound size={16} />
              <span>{user.name || user.email}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className={`${actionClass} hidden px-4 py-2 text-sm font-semibold md:inline-flex`}
            >
              Sign In
            </Link>
          )}
          <Link
            href="/cart"
            className={`${actionClass} flex h-12 w-12 items-center justify-center`}
          >
            <ShoppingBag size={20} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
