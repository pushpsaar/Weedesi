import Link from "next/link";

const CATEGORIES = [
  { name: "Sarees", slug: "sarees" },
  { name: "Kurtas", slug: "kurtas" },
  { name: "Lehengas", slug: "lehengas" },
  { name: "Co-ords", slug: "co-ords" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <h2 className="mb-8 font-heading text-3xl text-dark">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="group relative flex aspect-square items-end overflow-hidden rounded-xl border border-border bg-white p-5 transition-colors hover:border-gold"
          >
            <span className="font-heading text-xl text-dark transition-colors group-hover:text-gold-dark">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
