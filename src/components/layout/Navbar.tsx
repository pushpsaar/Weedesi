"use client";

import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { setDrawerOpen, cartCount } = useStore();

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center px-4 md:px-8">
        {/* Left: hamburger */}
        <div className="flex flex-1 items-center">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-white/70 transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: logo, always centered regardless of side content */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-3xl tracking-wide text-dark"
        >
          WEदेसी
        </Link>

        {/* Right: search, wishlist, cart, profile */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <Link
            href="/shop"
            aria-label="Search"
            className="p-2 rounded-full hover:bg-white/70 transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="p-2 rounded-full hover:bg-white/70 transition-colors"
          >
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-full hover:bg-white/70 transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className="p-2 rounded-full hover:bg-white/70 transition-colors"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
