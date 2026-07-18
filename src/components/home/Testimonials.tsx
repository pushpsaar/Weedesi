const REVIEWS = [
  {
    name: "Ananya R.",
    quote:
      "The fabric quality and finishing feel genuinely couture. Worth every rupee.",
  },
  {
    name: "Priyanka S.",
    quote:
      "Fast shipping, beautiful packaging, and the fit was exactly as described.",
  },
  {
    name: "Meera K.",
    quote: "My go-to for anything I need to feel put-together and elegant.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="mb-10 text-center font-heading text-3xl text-dark">
          Loved by our customers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-border bg-bg p-7"
            >
              <p className="text-sm leading-relaxed text-dark/70">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
