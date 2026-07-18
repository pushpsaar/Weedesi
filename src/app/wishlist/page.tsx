"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/context/store-context";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) => setProducts(all.filter((p) => wishlist.includes(p.id))));
  }, [wishlist]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-dark">Wishlist</h1>
      {products.length === 0 ? (
        <p className="mt-8 text-sm text-dark/40">Nothing here yet — tap the heart on any product to save it.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
