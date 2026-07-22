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
    <section className="bg-white/70 py-16 backdrop-blur-sm sm:py-20">
      <div className="section-shell px-4 sm:px-6 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Client love</p>
          <h2 className="mt-3 font-heading text-3xl text-dark sm:text-[2rem]">
            Loved by our customers
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded-[1.4rem] border border-border/70 bg-bg/70 p-7 shadow-[0_12px_40px_rgba(43,43,43,0.05)]"
            >
              <p className="text-sm leading-7 text-dark/70">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark">
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
