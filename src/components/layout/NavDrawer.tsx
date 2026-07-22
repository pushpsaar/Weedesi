"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Home, LogIn, MapPinned, Search, ShoppingBag, ShoppingCart, Sparkles, UserRound, X } from "lucide-react";
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
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-40 bg-dark/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="glass fixed left-0 top-0 z-50 flex h-screen w-[88%] max-w-sm flex-col overflow-hidden rounded-r-[28px] border-r border-border/80 shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-gold/30 bg-white/70 p-1.5 text-gold-dark">
                  <Sparkles size={15} />
                </div>
                <span className="font-heading text-2xl tracking-[0.18em] text-[#7a1f1f]">
                  WEदेसी
                </span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full border border-border/70 bg-white/70 p-2 text-dark transition-colors hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
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
                        className="mb-2 flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] tracking-[0.02em] text-dark/80 transition-all duration-200 hover:bg-white/80 hover:text-dark"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} strokeWidth={1.8} />
                          <span>{link.label}</span>
                        </span>
                        {link.label === "Cart" && cartCount > 0 && (
                          <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t border-border/80 px-5 py-4">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-white/70 px-3 py-2.5">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-dark/55">Theme</span>
                  <ThemeToggle />
                </div>

                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold-dark transition-colors hover:text-dark"
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
