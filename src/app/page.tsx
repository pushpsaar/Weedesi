import { getActiveProducts } from "@/lib/data";
import Hero from "@/components/home/Hero";
import ProductRail from "@/components/home/ProductRail";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";

export default async function HomePage() {
  const products = await getActiveProducts();
  const newArrivals = products.filter((p) => p.tags.includes("new-arrival"));
  const bestSellers = products.filter((p) => p.tags.includes("best-seller"));
  const trending = products.slice(0, 8);

  return (
    <>
      <Hero />
      <Categories />
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
