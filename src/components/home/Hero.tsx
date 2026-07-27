"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import type { SiteContent } from "@/lib/site-content-config";

export default function Hero({ content }: { content: SiteContent }) {
  const slides = content.hero.images?.length ? content.hero.images : ["/slider/Slider image 1.jpeg"];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const handler = () => {
      const y = window.scrollY || window.pageYOffset;
      raf = requestAnimationFrame(() => setScrollY(y));
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  const contentTranslate = Math.min(scrollY * 0.12, 120);
  const imageTranslate = Math.min(scrollY * 0.08, 80);
  const contentOpacity = Math.max(1 - scrollY / 900, 0.6);

  return (
    <section className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="px-4 md:px-0"
          style={{ transform: `translateY(-${imageTranslate}px)` }}
        >
          <HeroSlider slides={slides} primaryImage={content.hero.primaryImage} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 px-4 text-center sm:px-0 md:text-left"
          style={{ transform: `translateY(-${contentTranslate}px)`, opacity: contentOpacity }}
        >
          <div className="space-y-4">
            <h1 className="font-heading text-5xl leading-[0.96] tracking-[-0.03em] text-dark sm:text-6xl lg:text-[5.2rem]">
              Elegant kurtis for every day.
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={content.hero.buttonLink}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-dark px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#1a1916]"
            >
              {content.hero.buttonText}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop?category=kurtis"
              className="inline-flex items-center justify-center rounded-full border border-dark/20 bg-white px-8 py-4 text-sm font-semibold text-dark transition duration-300 hover:bg-white/90 dark:border-white/15 dark:bg-[#240d0d] dark:text-[#fff1ee]"
            >
              Explore Kurtis
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
