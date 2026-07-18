"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/store-context";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist } = useStore();
  const cover = product.variants[0]?.images[0];
  const isWishlisted = wishlist.includes(product.id);
  const discount = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-white">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-dark/30">
              No image
            </div>
          )}

          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-dark/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
              -{discount}%
            </span>
          )}

          <button
            aria-label="Toggle wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-gold text-gold" : "text-dark/60"}
            />
          </button>
        </div>

        <div className="mt-3.5 space-y-1">
          <h3 className="font-body text-sm text-dark/90">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-dark">
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
