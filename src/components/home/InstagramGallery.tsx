import Image from "next/image";

const galleryImages = [
  "/slider/Slider image 1.jpeg",
  "/slider/Slider image 2.jpeg",
  "/slider/Slider image 3.jpeg",
  "/slider/Slider image 4.jpeg",
  "/slider/Slider image 5.jpeg",
  "/slider/collection-1 (1).jpeg",
];

export default function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl text-dark">@WEदेसी</h2>
        <p className="mt-1.5 text-sm text-dark/50">Follow us for daily inspiration</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {galleryImages.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-white">
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
