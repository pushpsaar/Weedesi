import { getActiveProducts } from "@/lib/data";
import { getSiteContent } from "@/lib/site-content";
import Hero from "@/components/home/Hero";
import ProductRail from "@/components/home/ProductRail";

export default async function HomePage() {
  const [products, siteContent] = await Promise.all([getActiveProducts(), getSiteContent()]);
  const newArrivalsAll = products.filter((p) => p.tags.includes("new-arrival") || p.tags.includes("new"));
  const bestSellersAll = products.filter((p) => p.tags.includes("best-seller") || p.tags.includes("sale"));

  const maxSectionSize = 4;
  const sectionLimit = Math.min(Math.ceil(products.length / 2), maxSectionSize);
  const newArrivals = newArrivalsAll.slice(0, sectionLimit);
  const newArrivalIds = new Set(newArrivals.map((p) => p.id));
  let bestSellers = bestSellersAll.filter((p) => !newArrivalIds.has(p.id)).slice(0, sectionLimit);

  if (bestSellers.length < sectionLimit) {
    const usedIds = new Set(bestSellers.map((p) => p.id));
    for (const product of products) {
      if (bestSellers.length >= sectionLimit) break;
      if (newArrivalIds.has(product.id) || usedIds.has(product.id)) continue;
      bestSellers.push(product);
      usedIds.add(product.id);
    }
  }

  return (
    <>
      <Hero content={siteContent} />

      <ProductRail
        title="New Arrivals"
        subtitle="Fresh off the atelier"
        products={newArrivals}
        viewAllHref="/shop?tag=new-arrival"
      />

      <ProductRail
        title="Best Sellers"
        subtitle="The pieces our clients return to again and again"
        products={bestSellers}
        viewAllHref="/shop?tag=best-seller"
      />

      <section className="section-shell px-3 py-10 sm:px-4 lg:py-16">
        <div className="rounded-[2rem] border border-border/70 bg-[#fffaf5] p-8 shadow-[0_24px_90px_rgba(29,26,22,0.08)] sm:p-10 lg:p-14 dark:bg-[#240d0d] dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7a0000]">About WEदेसी</p>
              <h2 className="mt-4 font-heading text-3xl leading-tight text-dark sm:text-4xl dark:text-[#fff1ee]">Quiet luxury, designed for everyday grace.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-dark/65 dark:text-[#f8e5dd]">
                WEदेसी pairs handcrafted silhouettes with modern comfort so every piece feels elevated, effortless, and timeless.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-[#7a0000]/30 bg-[#7a0000] p-6 text-sm font-semibold leading-8 text-white shadow-sm dark:border-[#ffb8a2]/25 dark:bg-[#4b0606]">
              <p>• Premium fabrics and thoughtful detailing</p>
              <p>• Contemporary silhouettes rooted in heritage</p>
              <p>• A wardrobe designed to be worn beautifully</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
