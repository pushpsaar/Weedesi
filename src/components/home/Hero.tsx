"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import type { SiteContent } from "@/lib/site-content-config";

export default function Hero({ content }: { content: SiteContent }) {
  const slides = content.hero.images?.length ? content.hero.images : ["/slider/Slider image 1.jpeg"];

  return (
    <section className="relative overflow-hidden">
      <div className="section-shell grid grid-cols-1 items-center gap-8 px-0 py-12 sm:py-16 md:grid-cols-[0.95fr_1.05fr] md:gap-10 lg:min-h-[88vh] lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex flex-col items-center px-3 text-center sm:px-4 md:items-start md:px-0 md:text-left"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-dark">
            <Sparkles size={13} />
            WEदेसी Kurtis
          </div>
          <h1 className="max-w-2xl font-heading text-4xl leading-[0.95] text-dark sm:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-dark/65 sm:text-base">
            {content.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={content.hero.buttonLink}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-dark px-7 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f1a17]"
            >
              {content.hero.buttonText}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop?category=kurtis"
              className="inline-flex items-center justify-center rounded-full border border-dark/15 bg-white/70 px-7 py-3.5 text-sm font-medium text-dark transition-all duration-200 hover:border-dark/30 hover:bg-white"
            >
              Explore Kurtis
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-dark/60 md:justify-start">
            <span className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5">Premium hand-finished fabrics</span>
            <span className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5">Modern silhouettes</span>
            <span className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5">Thoughtful detailing</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="px-3 sm:px-4 md:px-0"
        >
          <HeroSlider slides={slides} primaryImage={content.hero.primaryImage} />
        </motion.div>
      </div>
    </section>
  );
}
