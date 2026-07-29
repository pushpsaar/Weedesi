"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const DEFAULT_SLIDES: Array<{ image: string; title: string; description: string }> = [
  {
    image: "/slider/Slider image 1.jpeg",
    title: "Quiet luxe in every layer",
    description: "Elevated kurtas and effortless silhouettes designed for subtle statement dressing.",
  },
  {
    image: "/slider/Slider image 2.jpeg",
    title: "Warm tones, refined details",
    description: "Handcrafted fabrics and modern tailoring with a heritage-inspired sensibility.",
  },
  {
    image: "/slider/Slider image 3.jpeg",
    title: "Sculpted ease for the everyday",
    description: "Tailored comfort in premium Indian essentials built for graceful movement.",
  },
  {
    image: "/slider/Slider image 4.jpeg",
    title: "Understated glamour, made wearable",
    description: "Quiet silhouettes with rich textures for contemporary festive dressing.",
  },
  {
    image: "/slider/Slider image 5.jpeg",
    title: "A new signature for every day",
    description: "Structured shapes and soft hues crafted for calm confidence.",
  },
  {
    image: "/slider/collection-1 (1).jpeg",
    title: "Soft structure, elevated ease",
    description: "Subtle tailoring meets premium detail for everyday refined dressing.",
  },
  {
    image: "/slider/collection-1 (2).jpeg",
    title: "Modern heritage, reimagined",
    description: "Contemporary silhouettes rooted in classic Indian craftsmanship.",
  },
  {
    image: "/slider/collection-1 (3).jpeg",
    title: "A palette for calm confidence",
    description: "Neutral tones and clean lines designed to feel luxurious and effortless.",
  },
  {
    image: "/slider/collection-1 (4).jpeg",
    title: "Lightness with lasting polish",
    description: "Comfort-forward layering pieces with rich texture and thoughtful finish.",
  },
  {
    image: "/slider/collection-1 (5).jpeg",
    title: "Refined ease for every occasion",
    description: "Timeless pieces designed to carry from morning rituals to evenings out.",
  },
  {
    image: "/slider/collection-1 (6).jpeg",
    title: "Subtle drama in soft silhouettes",
    description: "Luxurious fabrics and gentle structure for modern dressing.",
  },
  {
    image: "/slider/collection-1 (7).jpeg",
    title: "Warm minimalism, beautifully tailored",
    description: "A quiet wardrobe built from refined essentials and signature detail.",
  },
  {
    image: "/slider/collection-1 (8).jpeg",
    title: "Everyday elegance in motion",
    description: "Flowing shapes and understated adornment for graceful wear.",
  },
  {
    image: "/slider/collection-1 (9).jpeg",
    title: "Timeless textures, modern intent",
    description: "Curated Indian craftsmanship with a clean, contemporary finish.",
  },
  {
    image: "/slider/collection-1 (10).jpeg",
    title: "Minimal luxury that feels true",
    description: "Soft silhouettes and considered details for quiet confidence.",
  },
  {
    image: "/slider/collection-1 (11).jpeg",
    title: "Quiet confidence in quiet color",
    description: "Muted tones and modern forms made for everyday grace.",
  },
  {
    image: "/slider/collection-1 (12).jpeg",
    title: "Crafted calmness, naturally refined",
    description: "Thoughtful fabrics and gentle shaping with premium Indian attitude.",
  },
  {
    image: "/slider/collection-1 (13).jpeg",
    title: "A new silhouette for simple luxury",
    description: "Understated tailoring and elegant proportion for modern dressing.",
  },
  {
    image: "/slider/collection-1 (14).jpeg",
    title: "Rich minimalism, beautifully balanced",
    description: "Expressive details and effortless comfort for daily style.",
  },
  {
    image: "/slider/collection-1 (15).jpeg",
    title: "The quiet art of premium dressing",
    description: "Soft silhouettes crafted in beautiful, modern Indian prints.",
  },
];

type SlideItem = {
  image: string;
  title: string;
  description: string;
};

export default function HeroSlider({
  slides = DEFAULT_SLIDES,
  primaryHref = "/shop",
  secondaryHref = "/about",
}: {
  slides?: SlideItem[];
  primaryHref?: string;
  secondaryHref?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function previousSlide() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function nextSlide() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-white dark:bg-[radial-gradient(circle_at_top_left,rgba(210,74,74,0.18),transparent_25%),linear-gradient(180deg,#5f0b0b,#190404)]">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === activeIndex ? "dark:opacity-100 opacity-0" : "dark:opacity-0 opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={`Slider image ${index + 1}`}
            fill
            sizes="100vw"
            priority={index === 0}
            quality={92}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,3,3,0.88)_0%,rgba(17,3,3,0.5)_45%,rgba(17,3,3,0.24)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_45%)]" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-end px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="w-full max-w-lg rounded-[1.5rem] border border-[#8c1b1b]/20 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.08)] sm:p-6 lg:p-7 text-[#2a0d0d] backdrop-blur-md dark:bg-transparent dark:text-white">
          <div className="inline-flex rounded-full bg-[#2a0707] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white shadow-sm">
            WEदेसी Collection
          </div>
          <h1 className="mt-5 font-heading text-3xl leading-[1.02] text-white sm:text-4xl lg:text-5xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white sm:text-base">
            {slides[activeIndex].description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full border border-[#7d1313] bg-[#7d1313] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#940c0c] dark:border-white/25 dark:bg-white dark:text-[#7d1313] dark:hover:bg-white/90"
            >
              Shop Now
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-[#7d1313] bg-[#7d1313] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#940c0c] dark:border-white/25 dark:bg-white dark:text-[#7d1313] dark:hover:bg-white/90"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={previousSlide}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-dark shadow-sm transition hover:bg-white sm:h-12 sm:w-12"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs text-white backdrop-blur-sm">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-dark shadow-sm transition hover:bg-white sm:h-12 sm:w-12"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="absolute left-4 top-4 z-10 rounded-full bg-transparent px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white sm:left-6 sm:top-6">
        {String(activeIndex + 1).padStart(2, "0")} / {slides.length}
      </div>
    </section>
  );
}
