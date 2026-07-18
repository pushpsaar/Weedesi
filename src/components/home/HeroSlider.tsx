"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
  "/slider/Slider image 1.jpeg",
  "/slider/Slider image 2.jpeg",
  "/slider/Slider image 3.jpeg",
  "/slider/Slider image 4.jpeg",
  "/slider/Slider image 5.jpeg",
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function previousSlide() {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }

  function nextSlide() {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border bg-bg shadow-[0_18px_80px_rgba(0,0,0,0.08)]">
      {SLIDES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slider image ${index + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35" />
        </div>
      ))}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={previousSlide}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-dark shadow-sm transition hover:bg-white sm:h-12 sm:w-12"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="hidden items-center gap-2 rounded-full bg-black/30 px-3 py-2 text-xs text-white backdrop-blur-sm md:flex">
          {SLIDES.map((_, index) => (
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

      <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-dark shadow-sm backdrop-blur-sm sm:left-6 sm:top-6">
        01 / {SLIDES.length}
      </div>
    </div>
  );
}
