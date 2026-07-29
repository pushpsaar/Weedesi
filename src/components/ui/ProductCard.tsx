"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Product, Size } from "@/lib/types";
import { useStore } from "@/context/store-context";

const FALLBACK_IMAGE_POOL = [
  "/products/product-1.jpeg",
  "/products/product-2.jpeg",
  "/products/product-7.jpeg",
  "/products/product-8.jpeg",
  "/products/product-9.jpeg",
  "/products/product-12.jpeg",
];

export default function ProductCard({ product, imageIndex = 0 }: { product: Product; imageIndex?: number }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const variant = product.variants[0];
  const mainImage = variant?.images[0] ?? ""; // primary product image
  const hoverImage = variant?.images[1] ?? mainImage; // image shown on hover
  const fallbackImage = FALLBACK_IMAGE_POOL[imageIndex % FALLBACK_IMAGE_POOL.length] ?? FALLBACK_IMAGE_POOL[0];
  const resolvedMainImage = mainImage || fallbackImage;
  const resolvedHoverImage = hoverImage || fallbackImage;
  const defaultSize = variant?.sizes[0]?.size as Size | undefined;
  const sizes = variant?.sizes.map((item) => item.size) ?? [];
  const isWishlisted = wishlist.includes(product.id);
  const discount = product.mrp > 0 ? Math.round(((product.mrp - product.salePrice) / product.mrp) * 100) : 0;
  const [displayImage, setDisplayImage] = useState(resolvedMainImage);
  const isSale = product.tags.includes("sale") || discount > 0;
  const isNew = product.tags.includes("new-arrival") || product.tags.includes("new");

  useEffect(() => {
    setDisplayImage(resolvedMainImage);
  }, [resolvedMainImage]);

  function handleQuickBuy(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!variant || !defaultSize) return;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: mainImage ?? "",
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
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-[#7a0000] shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_90px_rgba(0,0,0,0.22)] dark:bg-[#200909]">
          <div
            className="relative aspect-[5/7] overflow-hidden bg-white dark:bg-[#7a0000]"
            onMouseEnter={() => setDisplayImage(resolvedHoverImage)}
            onMouseLeave={() => setDisplayImage(resolvedMainImage)}
          >
            {resolvedMainImage ? (
              <Image
                src={displayImage || resolvedMainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition duration-600 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/40">No image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 flex gap-2">
              {isSale && (
                <span className="rounded-full bg-[#7a0000] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                  Sale
                </span>
              )}
              {isNew && (
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-dark">
                  New
                </span>
              )}
            </div>
            <button
              aria-label="Toggle wishlist"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-white shadow-sm transition duration-200 hover:scale-105"
            >
              <Heart size={18} className={isWishlisted ? "fill-[#7a0000] text-[#7a0000]" : "text-white/70"} />
            </button>
          </div>

          <div className="space-y-3 px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">{product.category}</p>
            <div>
              <h3 className="font-heading text-lg leading-tight text-white transition-colors group-hover:text-[#7a0000]">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-base font-semibold text-white">₹{product.salePrice.toLocaleString("en-IN")}</span>
                {product.mrp > product.salePrice && (
                  <span className="text-sm text-white/60 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.length > 0 ? (
                sizes.slice(0, 4).map((size) => (
                  <span key={size} className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                    {size}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                  One size
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleQuickBuy}
                className="flex-1 rounded-full bg-[#7a0000] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#960101]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
