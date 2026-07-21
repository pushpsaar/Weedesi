"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { setDrawerOpen } = useStore();

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex min-w-12 items-center">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center font-heading text-[1.15rem] leading-[1.15] tracking-wide text-[#7a1f1f] sm:text-3xl"
        >
          WEदेसी
        </Link>

        <div className="flex min-w-12 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
