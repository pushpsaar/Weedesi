export const metadata = { title: "Shipping & Returns" };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Shipping &amp; Returns</h1>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-dark/70">
        <div>
          <h2 className="font-heading text-xl text-dark">Shipping</h2>
          <p className="mt-2">
            Orders are processed within 1-2 business days and shipped across India within
            2-4 business days. You&apos;ll receive tracking details via SMS once your order ships.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl text-dark">Returns</h2>
          <p className="mt-2">
            We accept returns within 7 days of delivery for unused items with original tags
            attached. Reach out via Contact Us to initiate a return.
          </p>
        </div>
      </div>
    </div>
  );
}
