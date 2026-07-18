import Link from "next/link";
import { getActiveProducts } from "@/lib/data";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const products = await getActiveProducts();
  const collections = Array.from(
    new Set(products.map((p) => p.collection).filter(Boolean))
  ) as string[];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Collections</h1>
      {collections.length === 0 ? (
        <p className="mt-6 text-sm text-dark/40">
          No collections yet. Group products by collection from the admin panel.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c}
              href={`/shop?collection=${c}`}
              className="rounded-xl border border-border bg-white p-8 text-center hover:border-gold transition-colors"
            >
              <span className="font-heading text-xl text-dark">{c}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
