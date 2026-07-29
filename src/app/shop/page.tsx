import Image from "next/image";
import { getActiveProducts } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string; q?: string }>;
}) {
  const { tag, category, q } = await searchParams;

  let products = await getActiveProducts();

  if (tag) products = products.filter((p) => p.tags?.includes(tag));
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    const query = q.toLowerCase();
    products = products.filter((p) => {
      return p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    });
  }

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const displayProducts = products.slice(0, 15);

  return (
    <div className="bg-transparent">
      <section className="section-shell px-3 py-8 sm:px-4 lg:py-12">
        <div className="rounded-[2.2rem] border border-border/70 bg-[#fffaf5] px-6 py-10 shadow-[0_24px_90px_rgba(29,26,22,0.08)] sm:px-10 lg:px-14 lg:py-14 dark:bg-[#240d0d] dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7a0000]">Shop</p>
              <h1 className="mt-4 font-heading text-4xl leading-tight text-dark sm:text-5xl">The Collection</h1>
              <p className="mt-4 text-base leading-8 text-dark/65">
                Discover premium kurtis and contemporary Indian staples, crafted for everyday elegance and effortless wear.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-[#7a0000] px-4 py-3 text-sm font-semibold text-white shadow-sm dark:bg-[#4b0606]">
              <Image src="/logo.png" alt="WEदेसी logo" width={64} height={64} className="h-16 w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="section-shell">
          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={!category ? "rounded-full border border-[#7a0000] bg-[#7a0000] px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white" : "rounded-full border border-border/70 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-dark/70"}
              >
                All
              </Link>

              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/shop?category=${encodeURIComponent(c)}`}
                  className={category === c ? "rounded-full border border-[#7a0000] bg-[#7a0000] px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white" : "rounded-full border border-border/70 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-dark/70"}
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          <section className="mt-12">
            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border/70 bg-[#fffaf5] py-24 text-center text-sm text-dark/45">
                No products found. Add products from the admin panel.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-7">
                {displayProducts.map((p, index) => (
                  <ProductCard key={`${p.id}-${index}`} product={p} imageIndex={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
