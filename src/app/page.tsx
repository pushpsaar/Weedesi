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
        <section className="section-shell py-5 sm:py-6 lg:py-8">
          <div className="grid gap-4 md:grid-cols-2">
            {enabledBanners.map((banner) => (
              <a
                key={banner.id}
                href={banner.link}
                className="group relative flex min-h-[240px] items-end overflow-hidden rounded-[1.6rem] border border-border/70 bg-white p-6 shadow-[0_10px_35px_rgba(43,43,43,0.06)]"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0.18)), url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="max-w-sm">
                  <h3 className="font-heading text-2xl text-white">{banner.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/85">{banner.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      <Categories content={siteContent} />
      {enabledPromos.length > 0 && (
        <section className="section-shell py-2 sm:py-3">
          <div className="grid gap-4 md:grid-cols-2">
            {enabledPromos.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-white/80 shadow-[0_12px_42px_rgba(43,43,43,0.06)]">
                <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                  <div className="min-h-[220px] bg-cover bg-center" style={{ backgroundImage: `url(${promo.image})` }} />
                  <div className="p-6">
                    <h3 className="font-heading text-2xl text-dark">{promo.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-dark/65">{promo.description}</p>
                    <a href={promo.buttonLink} className="mt-5 inline-flex rounded-full bg-dark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f1a17]">
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
      <section className="section-shell px-4 py-10 sm:px-6 md:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Best seller styling</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-dark sm:text-5xl">Shop the imagery</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-dark/65">
              A rich visual mix from our slider, collection and promo images to inspire the way you wear WEदेसी.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from(
            new Set([
              ...siteContent.hero.images,
              ...siteContent.banners.map((item) => item.image),
              ...siteContent.collections.map((item) => item.image),
              ...siteContent.promoSections.map((item) => item.image),
              ...siteContent.categoryImages.map((item) => item.image),
            ])
          ).map((src) => (
            <div key={src} className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-white shadow-[0_16px_45px_rgba(43,43,43,0.08)]">
              <img
                src={src}
                alt="Decorative product image"
                className="h-64 w-full object-cover transition duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </section>
      <ProductRail
        title="Trending Now"
        products={trending}
        viewAllHref="/shop"
      />
      <Testimonials />
      <InstagramGallery content={siteContent} />
      <Newsletter />
    </>
  );
}
