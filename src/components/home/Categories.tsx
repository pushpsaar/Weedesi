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
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <h2 className="mb-8 font-heading text-3xl text-dark">Explore More Kurtis</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="group relative flex aspect-[16/9] items-end overflow-hidden rounded-xl border border-border bg-white p-5 transition-colors hover:border-gold"
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
              <span className="font-heading text-2xl text-white transition-colors group-hover:text-gold-light">
                {card.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
