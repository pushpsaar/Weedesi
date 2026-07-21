import { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedesi.example.com";
  const products = await getActiveProducts();

  const staticPages = [
    "", "shop", "collections", "about", "contact", "track-order", "shipping-returns",
  ].map((path) => ({
    url: `${siteUrl}/${path}`,
    lastModified: new Date(),
  }));

  const productPages = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));

  return [...staticPages, ...productPages];
}
