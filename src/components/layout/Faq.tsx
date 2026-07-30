import React from "react";

export default function Faq() {
  const faqs = [
    {
      q: "What is your return policy?",
      a: "We accept returns within 14 days of delivery for unworn items in original condition. See the Returns page for details.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes — we ship to many countries. Shipping costs and delivery times vary by destination.",
    },
    {
      q: "How do I track my order?",
      a: "After your order ships, you'll receive an email with tracking information. You can also check /track-order.",
    },
    {
      q: "Can I change or cancel my order?",
      a: "Contact our support as soon as possible; we can modify orders before they are processed.",
    },
  ];

  return (
    <section aria-labelledby="faq-heading" className="bg-surface/80 py-16">
      <div className="section-shell">
        <h2 id="faq-heading" className="font-heading text-2xl font-bold text-dark">Frequently Asked Questions</h2>

        <div className="mt-6 grid gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-lg border border-border/60 bg-surface p-4 dark:bg-surface-soft">
              <summary className="cursor-pointer list-none text-lg font-medium text-dark">{f.q}</summary>
              <div className="mt-3 text-sm text-dark/70">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
