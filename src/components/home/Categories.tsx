import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/site-content-config";

export default function Categories({ content }: { content: SiteContent }) {
  const categoryImages = content?.categoryImages ?? [];
  const cards = categoryImages.length > 0 ? categoryImages : [
    {
      id: "fallback-category",
      name: "Explore More Kurtis",
      image: "/slider/Slider image 1.jpeg",
      link: "/shop?category=kurtis",
    },
  ];

  return (
    <section className="section-shell px-4 py-16 sm:px-6 md:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Curated collections</p>
          <h2 className="mt-2 font-heading text-3xl text-dark sm:text-[2rem]">Explore More Kurtis</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="group relative flex aspect-[16/9] items-end overflow-hidden rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-[0_12px_42px_rgba(43,43,43,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/50"
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 max-w-xs">
              <span className="font-heading text-2xl text-white transition-colors group-hover:text-gold">
                {card.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
