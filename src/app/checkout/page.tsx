"use client";

import { ChangeEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/store-context";

const GST_RATE = 0.05;
const UPI_ID = "soniroshni410-1@okaxis";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon") ?? undefined;
  const { cart, cartTotal, clearCart } = useStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");

  const gst = Math.round(cartTotal * GST_RATE);
  const total = cartTotal + gst;

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentScreenshot(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  }

  async function handlePlaceOrder() {
    setError("");
    setLoading(true);

    try {
      const createRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: form,
          couponCode,
          paymentScreenshot,
        }),
      });
      const orderData = await createRes.json();

      if (!createRes.ok) {
        setError(orderData.error ?? "Could not place order.");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/order/success?orderId=${orderData.orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-heading text-3xl text-dark">Your cart is empty</h1>
        <p className="mt-3 text-sm text-dark/50">Add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-dark">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
        <form
          className="space-y-4 md:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceOrder();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(v) => handleChange("name", v)} required />
            <Input label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} required />
          </div>
          <Input label="Email (optional)" type="email" value={form.email} onChange={(v) => handleChange("email", v)} />
          <Input label="Address" value={form.address} onChange={(v) => handleChange("address", v)} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={form.city} onChange={(v) => handleChange("city", v)} required />
            <Input label="State" value={form.state} onChange={(v) => handleChange("state", v)} required />
            <Input label="PIN Code" value={form.pincode} onChange={(v) => handleChange("pincode", v)} required />
          </div>
          <Input label="Country" value={form.country} onChange={(v) => handleChange("country", v)} required />

          <div className="rounded-xl border border-border bg-white p-4">
            <h2 className="font-heading text-lg text-dark">Pay by UPI</h2>
            <p className="mt-2 text-sm text-dark/60">
              Please pay to <span className="font-semibold text-dark">{UPI_ID}</span>
            </p>
            <p className="mt-1 text-xs text-dark/40">After payment, upload a screenshot of the transaction below.</p>
            <label className="mt-4 block text-xs font-medium text-dark/60">Payment Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-gold-dark"
              required
            />
            {paymentScreenshot && (
              <img
                src={paymentScreenshot}
                alt="Payment proof preview"
                className="mt-3 max-h-56 rounded-lg border border-border object-cover"
              />
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-dark px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Placing Order…" : `Place Order • ₹${total.toLocaleString("en-IN")}`}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-xl text-dark">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {cart.map((l) => (
              <div key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between text-dark/70">
                <span>
                  {l.name} × {l.qty}
                </span>
                <span>₹{(l.price * l.qty).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 text-dark/60">
              <span>GST (5%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium text-dark">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-dark/60">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
