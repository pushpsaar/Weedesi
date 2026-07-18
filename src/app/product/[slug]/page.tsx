import { notFound } from "next/navigation";
import { getActiveProducts, getProductBySlug } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyBox from "@/components/product/ProductBuyBox";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description?.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 155),
      images: product.variants[0]?.images ?? [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const all = await getActiveProducts();
  const related = all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.variants[0]?.images ?? [],
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.salePrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery product={product} />
        <ProductBuyBox product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-heading text-2xl text-dark">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
