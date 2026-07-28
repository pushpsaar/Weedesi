"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Product, Size } from "@/lib/types";
import { useStore } from "@/context/store-context";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const cover = product.variants[0]?.images[0];
  const variant = product.variants[0];
  const defaultSize = variant?.sizes[0]?.size as Size | undefined;
  const isWishlisted = wishlist.includes(product.id);
  const discount = product.mrp > 0 ? Math.round(((product.mrp - product.salePrice) / product.mrp) * 100) : 0;

  function handleQuickBuy(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!variant || !defaultSize) return;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: cover ?? "",
      color: variant.color,
      size: defaultSize,
      price: product.salePrice,
      qty: 1,
    });
  }

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group overflow-hidden rounded-[2rem]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-[0_24px_60px_rgba(29,26,22,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(29,26,22,0.12)]">
          <div className="relative aspect-[5/7] overflow-hidden bg-[#f6f1eb]">
            {cover ? (
              <Image
                src={cover}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-dark/40">No image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                -{discount}%
              </span>
            )}
            <button
              aria-label="Toggle wishlist"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-dark shadow-sm transition duration-200 hover:scale-105"
            >
              <Heart size={18} className={isWishlisted ? "fill-gold text-gold" : "text-dark/70"} />
            </button>
          </div>

          <div className="space-y-3 px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-dark/50">
              {product.category}
            </p>
            <div>
              <h3 className="font-heading text-lg leading-tight text-dark transition-colors group-hover:text-gold-dark">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-base font-semibold text-dark">₹{product.salePrice.toLocaleString("en-IN")}</span>
                {product.mrp > product.salePrice && (
                  <span className="text-sm text-dark/40 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleQuickBuy}
                className="flex-1 rounded-full bg-[#7a0f0f] dark:bg-dark px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f1a1a] dark:hover:bg-gold/90"
              >
                Buy
              </button>
              <span className="text-xs uppercase tracking-[0.28em] text-dark/50">
                {defaultSize ? defaultSize : "One size"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
