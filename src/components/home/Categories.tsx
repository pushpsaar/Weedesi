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
    <section className="section-shell px-4 py-20 sm:px-6 md:px-8 lg:py-24">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Curated collections</p>
          <h2 className="mt-3 max-w-2xl font-heading text-4xl leading-tight text-dark sm:text-5xl">Explore More Kurtis</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="group relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-[0_20px_80px_rgba(29,26,22,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_90px_rgba(29,26,22,0.1)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={card.image}
                alt={card.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-dark/50">Category</p>
              <h3 className="mt-4 font-heading text-2xl leading-tight text-dark transition-colors group-hover:text-gold-dark">
                {card.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
