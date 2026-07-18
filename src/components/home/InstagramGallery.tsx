export default function InstagramGallery() {
  const placeholders = Array.from({ length: 6 });
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl text-dark">@vedesi</h2>
        <p className="mt-1.5 text-sm text-dark/50">Follow us for daily inspiration</p>
      </div>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {placeholders.map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-white text-[10px] text-dark/30"
          >
            image {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}
