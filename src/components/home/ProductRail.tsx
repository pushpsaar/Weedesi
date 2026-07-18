import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl text-dark">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-dark/50">{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-medium uppercase tracking-[0.15em] text-gold-dark hover:text-dark transition-colors"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-dark/40">
          No products yet — add some from the admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
