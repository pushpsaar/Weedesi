"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/context/store-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop?category=kurtis", label: "Explore Kurtis" },
  { href: "/shop", label: "Shop All Kurtis" },
  { href: "/track-order", label: "Track Order" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

export default function NavDrawer() {
  const { isDrawerOpen, setDrawerOpen } = useStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="glass fixed left-0 top-0 z-50 h-[92vh] w-[85%] max-w-sm overflow-hidden rounded-r-3xl border-r border-border shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-6">
              <span className="font-heading text-2xl tracking-wide text-[#7a1f1f]">
                WEदेसी
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-white/70"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[calc(92vh-88px)] flex-col overflow-y-auto">
              <nav className="flex flex-col px-2 py-4">
                {LINKS.map((link, i) => (
                  <motion.div
                    key={link.href + link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-lg px-4 py-3 font-body text-[15px] tracking-wide text-dark/80 transition-colors hover:bg-white/70 hover:text-dark"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto border-t border-border px-6 py-5">
                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-gold-dark transition-colors hover:text-dark"
                >
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
