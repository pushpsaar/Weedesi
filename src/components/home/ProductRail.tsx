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
    <section className="section-shell px-4 py-16 sm:px-6 md:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Signature edit
          </p>
          <h2 className="mt-2 font-heading text-3xl text-dark sm:text-[2rem]">{title}</h2>
          {subtitle && <p className="mt-2 max-w-xl text-sm leading-6 text-dark/55">{subtitle}</p>}
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark transition-colors hover:text-dark"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[1.4rem] border border-dashed border-border/70 bg-white/55 py-16 text-center text-sm text-dark/45">
          No products yet — add some from the admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-7">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
