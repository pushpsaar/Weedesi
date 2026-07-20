"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Product, Size } from "@/lib/types";
import { useStore } from "@/context/store-context";

export default function ProductBuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [variantIdx] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"description" | "shipping">("description");

  const variant = product.variants[variantIdx];
  const discount = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100);
  const isWishlisted = wishlist.includes(product.id);
  const selectedStock = variant.sizes.find((s) => s.size === size)?.stock ?? 0;

  function handleAdd(buyNow: boolean) {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    setError("");
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: variant.images[0] ?? "",
      color: variant.color,
      size,
      price: product.salePrice,
      qty,
    });
    if (buyNow) {
      router.push("/checkout");
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
        {product.category}
      </p>
      <h1 className="mt-2 font-heading text-3xl text-dark">{product.name}</h1>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-medium text-dark">
          ₹{product.salePrice.toLocaleString("en-IN")}
        </span>
        {product.mrp > product.salePrice && (
          <>
            <span className="text-base text-dark/40 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-medium text-green-600">{discount}% off</span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-dark/40">Inclusive of all taxes</p>

      <div className="mt-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark/60">
          Select Size
        </p>
        <div className="flex flex-wrap gap-2">
          {variant.sizes.map((s) => (
            <button
              key={s.size}
              disabled={s.stock === 0}
              onClick={() => setSize(s.size)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                size === s.size ? "border-dark bg-dark text-white" : "border-border text-dark/70 hover:border-dark/40"
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>
        {size && selectedStock > 0 && selectedStock <= 5 && (
          <p className="mt-2 text-xs text-amber-600">Only {selectedStock} left in stock</p>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark/60">
          Quantity
        </p>
        <div className="flex w-fit items-center rounded-full border border-border">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg">
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-lg">
            +
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => handleAdd(false)}
          className="flex-1 rounded-full border border-dark px-6 py-3.5 text-sm font-medium text-dark transition-colors hover:bg-dark hover:text-white"
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleAdd(true)}
          className="flex-1 rounded-full bg-dark px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          Buy Now
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="rounded-full border border-border p-3.5 hover:border-dark/40"
        >
          <Heart size={18} className={isWishlisted ? "fill-gold text-gold" : "text-dark/60"} />
        </button>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => setTab("description")}
            className={`pb-2 border-b-2 transition-colors ${
              tab === "description" ? "border-gold text-dark" : "border-transparent text-dark/40"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab("shipping")}
            className={`pb-2 border-b-2 transition-colors ${
              tab === "shipping" ? "border-gold text-dark" : "border-transparent text-dark/40"
            }`}
          >
            Shipping &amp; Returns
          </button>
        </div>

        {tab === "description" ? (
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-dark/70">
            <p>{product.description || "No description added yet."}</p>
            {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
            {product.washCare && <p><strong>Wash Care:</strong> {product.washCare}</p>}
          </div>
        ) : (
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-dark/70">
            <p>Ships within 2-4 business days across India.</p>
            <p>Easy 7-day returns on unused items with tags intact.</p>
          </div>
        )}
      </div>
    </div>
  );
}
