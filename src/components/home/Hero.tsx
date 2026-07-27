"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import type { SiteContent } from "@/lib/site-content-config";

export default function Hero({ content }: { content: SiteContent }) {
  const slides = content.hero.images?.length ? content.hero.images : ["/slider/Slider image 1.jpeg"];

  return (
    <section className="relative overflow-hidden bg-transparent py-16 md:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8 px-4 text-center md:px-0 md:text-left"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-gold-dark shadow-sm backdrop-blur-sm">
            <Sparkles size={14} />
            Luxury edit
          </div>
          <div className="space-y-5">
            <p className="max-w-xl text-sm uppercase tracking-[0.35em] text-dark/50">{content.hero.subtitle}</p>
            <h1 className="font-heading text-5xl leading-[0.96] tracking-[-0.03em] text-dark sm:text-6xl lg:text-[5.2rem]">
              {content.hero.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-dark/65 sm:text-lg">
              {content.hero.description || "Discover modern Indian elegance with pieces designed for comfort, craftsmanship, and quiet confidence."}
            </p>
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
              className="inline-flex items-center justify-center rounded-full border border-dark/20 bg-white px-8 py-4 text-sm font-semibold text-dark transition duration-300 hover:bg-white/90"
            >
              Explore Kurtis
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-dark/65">
            <span className="rounded-full border border-border/70 bg-white/80 px-4 py-2">Hand-finished tailoring</span>
            <span className="rounded-full border border-border/70 bg-white/80 px-4 py-2">Soft premium fabrics</span>
            <span className="rounded-full border border-border/70 bg-white/80 px-4 py-2">Effortless everyday luxury</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="px-4 md:px-0"
        >
          <HeroSlider slides={slides} primaryImage={content.hero.primaryImage} />
        </motion.div>
      </div>
    </section>
  );
}
