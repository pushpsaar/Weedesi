"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSlider from "@/components/home/HeroSlider";
import type { SiteContent } from "@/lib/site-content-config";

export default function Hero({ content }: { content: SiteContent }) {
  const slides = content.hero.images?.length ? content.hero.images : ["/slider/Slider image 1.jpeg"];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-32 md:px-8 lg:h-screen lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            WEदेसी Kurtis
          </p>
          <h1 className="font-heading text-5xl leading-[1.1] text-dark md:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-dark/60">
            {content.hero.subtitle}
          </p>
          <div className="mt-9 flex gap-4">
            <Link
              href={content.hero.buttonLink}
              className="rounded-full bg-dark px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              {content.hero.buttonText}
            </Link>
            <Link
              href="/shop?category=kurtis"
              className="rounded-full border border-dark/20 px-8 py-3.5 text-sm font-medium text-dark transition-colors hover:border-dark"
            >
              Explore Kurtis
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative h-full w-full"
        >
          <HeroSlider slides={slides} primaryImage={content.hero.primaryImage} />
        </motion.div>
      </div>
    </section>
  );
}
