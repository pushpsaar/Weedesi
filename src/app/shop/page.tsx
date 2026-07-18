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
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Shop</h1>
      <p className="mt-2 text-sm text-dark/50">{products.length} pieces</p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="/shop"
            className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              !category ? "border-dark bg-dark text-white" : "border-border text-dark/60"
            }`}
          >
            All
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/shop?category=${c}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                category === c ? "border-dark bg-dark text-white" : "border-border text-dark/60"
              }`}
            >
              {c}
            </a>
          ))}
        </div>
      )}

      <div className="mt-8">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-24 text-center text-sm text-dark/40">
            No products found. Add products from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
