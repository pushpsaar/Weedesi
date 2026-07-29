"use client";

import HeroSlider from "@/components/home/HeroSlider";
import type { SiteContent } from "@/lib/site-content-config";

const HERO_SLIDES = [
  {
    image: "/products/product (1).jpeg",
    title: "Quiet luxe in every layer",
    description: "Elevated kurtas and effortless silhouettes designed for subtle statement dressing.",
  },
  {
    image: "/products/product (2).jpeg",
    title: "Warm tones, refined details",
    description: "Handcrafted fabrics and modern tailoring with a heritage-inspired sensibility.",
  },
  {
    image: "/products/product (3).jpeg",
    title: "Sculpted ease for the everyday",
    description: "Tailored comfort in premium Indian essentials built for graceful movement.",
  },
  {
    image: "/products/product (4).jpeg",
    title: "Understated glamour, made wearable",
    description: "Quiet silhouettes with rich textures for contemporary festive dressing.",
  },
  {
    image: "/products/product (5).jpeg",
    title: "A new signature for every day",
    description: "Structured shapes and soft hues crafted for calm confidence.",
  },
];

export default function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="w-full">
      <HeroSlider slides={HERO_SLIDES} primaryHref={content.hero.buttonLink || "/shop"} secondaryHref="/about" />
    </section>
  );
}
