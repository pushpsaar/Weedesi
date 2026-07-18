"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/context/store-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/shop?tag=new-arrival", label: "New Arrivals" },
  { href: "/shop?tag=best-seller", label: "Best Sellers" },
  { href: "/shop?tag=sale", label: "Sale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
            className="glass fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm border-r border-border shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-border">
              <span className="font-heading text-2xl tracking-wide text-dark">
                WEदेसी
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-white/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

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
                    className="block px-4 py-3 rounded-lg font-body text-[15px] tracking-wide text-dark/80 hover:text-dark hover:bg-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-border">
              <Link
                href="/admin/login"
                onClick={() => setDrawerOpen(false)}
                className="text-xs tracking-[0.2em] uppercase text-gold-dark hover:text-dark transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
