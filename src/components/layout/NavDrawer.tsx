"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Home, LogIn, MapPinned, Search, ShoppingBag, ShoppingCart, Sparkles, UserRound, X } from "lucide-react";
import { useStore } from "@/context/store-context";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop?category=kurtis", label: "Kurtis", icon: ShoppingBag },
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
            className="fixed inset-0 z-40 bg-dark/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="glass fixed left-0 top-0 z-50 flex h-screen w-[92%] max-w-[420px] flex-col overflow-hidden border-r border-border/80 shadow-[0_30px_90px_rgba(0,0,0,0.24)]"
          >
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white text-gold shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-gold-dark">WEदेसी</p>
                  <p className="text-sm font-semibold text-dark">Luxury Edit</p>
                </div>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white text-dark transition hover:bg-white/90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                {LINKS.map((link, i) => {
                  const Icon = link.icon;

                  return (
                    <motion.div
                      key={link.href + link.label}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.28 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="mb-3 flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-white/90 px-5 py-4 text-sm font-medium tracking-[0.02em] text-dark transition hover:border-gold/40 hover:bg-gold/5"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={1.7} />
                          <span>{link.label}</span>
                        </span>
                        {link.label === "Cart" && cartCount > 0 && (
                          <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t border-border/80 px-6 py-5">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-dark/55">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-gold-dark transition hover:text-dark"
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
