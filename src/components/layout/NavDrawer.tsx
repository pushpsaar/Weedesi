"use client";

import Image from "next/image";
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed left-0 top-0 z-50 flex h-screen w-[92%] max-w-[420px] flex-col overflow-hidden border-r border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_25%),linear-gradient(180deg,#6b1212,#240505)] shadow-[0_30px_120px_rgba(0,0,0,0.32)]"
          >
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white/10 shadow-sm">
                  <Image src="/logo.png" alt="WEदेसी logo" width={28} height={28} className="h-7 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Luxury Edit</p>
                </div>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7d1313] bg-[#7d1313] text-white shadow-[0_4px_12px_rgba(125,19,19,0.35)] transition hover:bg-[#940c0c]"
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
                        className={`mb-3 flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-sm font-medium tracking-[0.02em] transition ${
                          link.label === "Cart"
                            ? "border-[#7d1313] bg-[#7d1313] text-white shadow-[0_4px_12px_rgba(125,19,19,0.35)] hover:bg-[#940c0c]"
                            : "border-[#7d1313] bg-[#7d1313] text-white shadow-[0_4px_12px_rgba(125,19,19,0.35)] hover:bg-[#940c0c]"
                        }`}
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
                <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-[#7d1313] bg-[#7d1313] px-4 py-3 text-white shadow-[0_4px_12px_rgba(125,19,19,0.35)]">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/90">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-[#7d1313] bg-[#7d1313] px-4 py-2 text-sm uppercase tracking-[0.28em] text-white transition hover:bg-[#940c0c]"
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
