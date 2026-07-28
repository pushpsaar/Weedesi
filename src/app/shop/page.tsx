import { getActiveProducts } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string; q?: string }>;
}) {
  const { tag, category, q } = await searchParams;

  // load products once and derive views from that
  let products = await getActiveProducts();

  if (tag) products = products.filter((p) => p.tags?.includes(tag));
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    const query = q.toLowerCase();
    products = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );
    });
  }

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  return (
    <div className="bg-transparent">
      <section className="w-full">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex h-64 items-center justify-center bg-[#7a0f0f] text-white dark:bg-[#180707]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center gap-6">
                <Image src="/logo.png" alt="WEदेसी" width={160} height={60} className="block dark:hidden" />
                <Image src="/logo%202.png" alt="WEदेसी" width={160} height={60} className="hidden dark:block" />
              </div>
              <h2 className="font-heading text-3xl font-bold">Where Tradition meets elegance</h2>
            </div>
          </div>
        </div>
      </section>

      <main className="py-20">
        <div className="section-shell">
          <header className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-dark">Shop</p>
            <h1 className="mt-4 font-heading text-5xl leading-tight text-dark sm:text-6xl">The Collection</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-dark/65">
              A carefully selected range of kurtis and Indian wear crafted for everyday elegance.
            </p>

            <div className="mt-6 rounded-lg bg-white/70 p-6 shadow-sm dark:bg-[#0f0606]/60">
              <h3 className="font-semibold text-lg text-dark">About WEदेसी</h3>
              <p className="mt-2 text-sm text-dark/70">
                Handcrafted pieces, breathable fabrics, and thoughtful details. Weदेसी brings together tradition and contemporary
                comfort for a wardrobe that lasts.
              </p>
            </div>
          </header>

          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={!category ? "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] bg-dark text-white" : "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] bg-white text-dark/70"}
              >
                All
              </Link>

              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/shop?category=${encodeURIComponent(c)}`}
                  className={category === c ? "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] bg-dark text-white" : "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] bg-white text-dark/70"}
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          <section className="mt-12">
            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border/70 bg-surface/80 py-24 text-center text-sm text-dark/45">
                No products found. Add products from the admin panel.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-7">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
