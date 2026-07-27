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
    <section className="section-shell px-4 py-20 sm:px-6 md:px-8 lg:py-24">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Signature edit
          </p>
          <h2 className="mt-3 font-heading text-4xl leading-tight text-dark sm:text-5xl">{title}</h2>
          {subtitle && <p className="mt-4 max-w-2xl text-base leading-8 text-dark/65">{subtitle}</p>}
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-dark transition-colors hover:text-gold"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border/70 bg-surface/80 py-20 text-center text-sm text-dark/45">
          No products yet — add some from the admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
