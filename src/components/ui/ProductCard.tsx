"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/store-context";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist } = useStore();
  const cover = product.variants[0]?.images[0];
  const isWishlisted = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/80 p-2 shadow-[0_12px_40px_rgba(43,43,43,0.06)] transition-all duration-300 group-hover:shadow-[0_24px_70px_rgba(43,43,43,0.12)]">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              className="rounded-[1rem] object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-[1rem] border border-dashed border-border/70 text-xs text-dark/30">
              No image
            </div>
          )}

          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-dark/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-white">
              -{discount}%
            </span>
          )}

          <button
            aria-label="Toggle wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 p-2.5 text-dark shadow-sm backdrop-blur transition-all duration-200 hover:scale-105"
          >
            <Heart size={16} className={isWishlisted ? "fill-gold text-gold" : "text-dark/60"} />
          </button>

          <div className="absolute inset-x-4 bottom-4 rounded-full border border-white/50 bg-black/20 px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-sm">
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={12} />
              Curated edit
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <h3 className="font-body text-[0.95rem] font-medium text-dark/90">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-dark">
              ₹{product.salePrice.toLocaleString("en-IN")}
            </span>
            {product.mrp > product.salePrice && (
              <span className="text-xs text-dark/40 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
