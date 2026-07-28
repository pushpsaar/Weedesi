import { getActiveProducts } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string; q?: string }>;
}) {
  const { tag, category, q } = await searchParams;
  let products = await getActiveProducts();

  if (tag) products = products.filter((p) => p.tags.includes(tag));
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  const categories = Array.from(new Set((await getActiveProducts()).map((p) => p.category)));

  return (
    <div className="bg-transparent">
      {/* Tall red strip hero */}
      <div className="w-full bg-[#7a0f0f] dark:bg-[#180707] text-white">
        <div className="section-shell flex h-56 items-center justify-center sm:h-72 lg:h-96">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-6">
              <img src="/logo.png" alt="WEदेसी" className="block dark:hidden h-16 w-auto" />
              <img src="/logo%202.png" alt="WEदेसी" className="hidden dark:block h-16 w-auto" />
            </div>
            <div className="font-heading text-2xl font-bold sm:text-4xl">Where Tradition meets elegance</div>
          </div>
        </div>
      </div>

      <div className="bg-transparent py-20">
        <div className="section-shell">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-dark">Shop</p>
            <h1 className="mt-4 font-heading text-5xl leading-tight text-dark sm:text-6xl">The Collection</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-dark/65">
              Discover refined Indian fashion with effortless silhouettes, mindful fabrics, and distinctive details.
            </p>

            <div className="mt-6 rounded-lg bg-white/60 p-6 shadow-sm dark:bg-[#0f0606]/60">
              <h2 className="font-semibold text-lg text-dark">About WEदेसी</h2>
              <p className="mt-2 text-sm text-dark/70">
                WEदेसी curates handcrafted kurtis that blend timeless tradition with modern comfort. Each piece is thoughtfully designed
                for everyday elegance — breathable fabrics, careful stitching, and vibrant prints. Shop confidently with easy returns,
                secure payments, and attentive customer care.
              </p>
            </div>
          </div>

        {categories.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/shop"
              className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition ${
                !category ? "border-dark bg-dark text-white" : "border-border bg-white text-dark/70"
              }`}
            >
              All
            </a>
            {categories.map((c) => (
              <a
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition ${
                  category === c ? "border-dark bg-dark text-white" : "border-border bg-white text-dark/70"
                }`}
              >
                {c}
              </a>
            ))}
          </div>
        )}

        <div className="mt-12">
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
        </div>
      </div>
    </div>
  );
}
