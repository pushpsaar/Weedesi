import Link from "next/link";

const KURTI_SLIDE_IMAGE = "/slider/Slider image 1.jpeg";

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <h2 className="mb-8 font-heading text-3xl text-dark">Explore More Kurtis</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
        <Link
          href="/shop?category=kurtis"
          className="group relative flex aspect-[16/9] items-end overflow-hidden rounded-xl border border-border bg-white p-5 transition-colors hover:border-gold"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(${KURTI_SLIDE_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="font-heading text-2xl text-white transition-colors group-hover:text-gold-light">
            Explore More Kurtis
          </span>
        </Link>
      </div>
    </section>
  );
}
