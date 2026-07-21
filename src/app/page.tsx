import { getActiveProducts } from "@/lib/data";
import { getSiteContent } from "@/lib/site-content";
import Hero from "@/components/home/Hero";
import ProductRail from "@/components/home/ProductRail";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";

export default async function HomePage() {
  const [products, siteContent] = await Promise.all([getActiveProducts(), getSiteContent()]);
  const newArrivals = products.filter((p) => p.tags.includes("new-arrival"));
  const bestSellers = products.filter((p) => p.tags.includes("best-seller"));
  const trending = products.slice(0, 8);
  const banners = Array.isArray(siteContent?.banners) ? siteContent.banners : [];
  const promos = Array.isArray(siteContent?.promoSections) ? siteContent.promoSections : [];
  const enabledBanners = banners.filter((banner) => banner?.enabled);
  const enabledPromos = promos.filter((promo) => promo?.enabled);

  return (
    <>
      <Hero content={siteContent} />
      {enabledBanners.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {enabledBanners.map((banner) => (
              <a
                key={banner.id}
                href={banner.link}
                className="group relative flex min-h-[220px] items-end overflow-hidden rounded-2xl border border-border bg-white p-5"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.18)), url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="max-w-sm">
                  <h3 className="font-heading text-2xl text-white">{banner.title}</h3>
                  <p className="mt-2 text-sm text-white/85">{banner.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      <Categories content={siteContent} />
      {enabledPromos.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {enabledPromos.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                  <div className="min-h-[220px] bg-cover bg-center" style={{ backgroundImage: `url(${promo.image})` }} />
                  <div className="p-5">
                    <h3 className="font-heading text-2xl text-dark">{promo.title}</h3>
                    <p className="mt-3 text-sm text-dark/65">{promo.description}</p>
                    <a href={promo.buttonLink} className="mt-4 inline-flex rounded-full bg-dark px-4 py-2 text-sm font-medium text-white">
                      {promo.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <ProductRail
        title="New Arrivals"
        subtitle="Fresh off the atelier"
        products={newArrivals}
        viewAllHref="/shop?tag=new-arrival"
      />
      <ProductRail
        title="Best Sellers"
        subtitle="What everyone's wearing"
        products={bestSellers}
        viewAllHref="/shop?tag=best-seller"
      />
      <ProductRail
        title="Trending Now"
        products={trending}
        viewAllHref="/shop"
      />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
