"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductGallery({ product }: { product: Product }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const variant = product.variants[variantIdx] ?? product.variants[0];
  const images = variant?.images ?? [];
  const activeImage = images[imageIdx];

  return (
    <div>
      <div
        className="relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-white"
        onClick={() => setZoomed((z) => !z)}
      >
        {activeImage ? (
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-dark/30">
            No image uploaded for this variant
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setImageIdx(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                i === imageIdx ? "border-gold" : "border-border"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {product.variants.length > 1 && (
        <div className="mt-4 flex gap-2">
          {product.variants.map((v, i) => (
            <button
              key={v.color}
              onClick={() => {
                setVariantIdx(i);
                setImageIdx(0);
              }}
              aria-label={v.color}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                i === variantIdx ? "border-dark scale-110" : "border-border"
              }`}
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
