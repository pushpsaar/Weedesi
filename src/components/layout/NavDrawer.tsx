"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Home, LogIn, MapPinned, Search, ShoppingBag, ShoppingCart, UserRound, X } from "lucide-react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop?category=kurtis", label: "Explore Kurtis", icon: ShoppingBag },
  { href: "/shop", label: "Shop All", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/contact", label: "Contact", icon: MapPinned },
  { href: "/track-order", label: "Track Order", icon: Search },
];

export default function NavDrawer() {
  const { isDrawerOpen, setDrawerOpen, cartCount } = useStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-dark/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="glass fixed left-0 top-0 z-50 h-[92vh] w-[88%] max-w-sm overflow-hidden rounded-r-[28px] border-r border-border shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-heading text-2xl tracking-wide text-[#7a1f1f]">
                Weदेसी
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-white/70"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[calc(92vh-88px)] min-h-0 flex-col">
              <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                {LINKS.map((link, i) => {
                  const Icon = link.icon;

                  return (
                    <motion.div
                      key={link.href + link.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="mb-2 flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] tracking-wide text-dark/80 transition-colors hover:bg-white/70 hover:text-dark"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} strokeWidth={1.8} />
                          <span>{link.label}</span>
                        </span>
                        {link.label === "Cart" && cartCount > 0 && (
                          <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t border-border px-5 py-4">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-dark/50">Theme</span>
                  <ThemeToggle />
                </div>

                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-dark transition-colors hover:text-dark"
                >
                  <LogIn size={14} strokeWidth={1.8} />
                  Admin Login
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
