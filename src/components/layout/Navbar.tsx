"use client";

import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { setDrawerOpen, cartCount } = useStore();

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 md:px-8">
        <div className="flex items-center">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center truncate text-center font-heading text-lg leading-none tracking-wide text-[#7a1f1f] sm:text-3xl"
        >
          WEदेसी
        </Link>

        <div className="flex items-center justify-end gap-1 md:gap-2">
          <Link
            href="/shop"
            aria-label="Search"
            className="rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className="rounded-full p-2 transition-colors hover:bg-white/70"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
