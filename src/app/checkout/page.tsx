"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/store-context";

const GST_RATE = 0.05;

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  method?: string;
}

interface RazorpayInstance {
  open: () => void;
}

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
  const [sdkReady, setSdkReady] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "signed-in" | "guest">("loading");
  const [error, setError] = useState("");
  const [paymentStage, setPaymentStage] = useState<"idle" | "creating" | "processing" | "failed">("idle");

  useEffect(() => {
    let active = true;

    async function loadAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!active) return;
        setAuthState(data.user ? "signed-in" : "guest");
      } catch {
        if (active) {
          setAuthState("guest");
        }
      }
    }

    void loadAuth();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setSdkReady(true);
      return;
    }

    const existing = document.querySelector("script[data-razorpay]");
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "true";
    script.onload = () => setSdkReady(true);
    script.onerror = () => setError("The secure payment gateway could not be loaded. Please retry in a moment.");
    document.body.appendChild(script);
  }, []);

  const gst = Math.round(cartTotal * GST_RATE);
  const total = cartTotal + gst;

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function markPaymentFailed(orderId: string, reason?: string) {
    try {
      await fetch("/api/razorpay/fail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason }),
      });
    } catch {
      // Ignore and rely on the visible error state.
    }
  }

  async function handlePlaceOrder() {
    setError("");

    if (authState !== "signed-in") {
      setError("Please sign in before placing your order.");
      return;
    }

    if (!sdkReady || typeof window === "undefined" || !window.Razorpay) {
      setError("The secure payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setLoading(true);
    setPaymentStage("creating");

    try {
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: form,
          couponCode,
        }),
      });
      const orderData = await createRes.json();

      if (!createRes.ok) {
        setError(orderData.error ?? "Could not initialize payment.");
        setLoading(false);
        setPaymentStage("failed");
        return;
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "WEदेसी",
        description: `Order payment for ${cart.length} item(s)`,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          orderId: orderData.orderId,
        },
        theme: {
          color: "#181818",
        },
        handler: async (response) => {
          setPaymentStage("processing");
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: response.method,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              await markPaymentFailed(orderData.orderId, verifyData.error ?? "Payment verification failed.");
              setError(verifyData.error ?? "Payment could not be verified. Please try again.");
              setLoading(false);
              setPaymentStage("failed");
              return;
            }

            clearCart();
            router.push(`/order/success?orderId=${orderData.orderId}`);
          } catch {
            await markPaymentFailed(orderData.orderId, "Payment verification failed.");
            setError("Your payment could not be verified. Please try again.");
            setLoading(false);
            setPaymentStage("failed");
          }
        },
        modal: {
          ondismiss: async () => {
            await markPaymentFailed(orderData.orderId, "Payment cancelled by customer.");
            setError("Payment was cancelled. You can try again whenever you are ready.");
            setLoading(false);
            setPaymentStage("failed");
          },
        },
      };

      const instance = new window.Razorpay(options);
      setPaymentStage("processing");
      instance.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      setPaymentStage("failed");
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

      {authState !== "signed-in" && (
        <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/10 p-5">
          <p className="text-sm font-medium text-dark">Please sign in before placing your order.</p>
          <p className="mt-1 text-sm text-dark/60">Your order will be linked to your account once you’re signed in.</p>
          <Link
            href={`/auth?redirect=/checkout`}
            className="mt-4 inline-flex rounded-full bg-dark px-4 py-2 text-sm font-medium text-white"
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
        <form
          className="space-y-4 md:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handlePlaceOrder();
          }}
        >
          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-dark">
              <ShieldCheck size={16} className="text-gold-dark" />
              Secure Razorpay checkout
            </div>
            <p className="mt-2 text-sm text-dark/60">
              Pay with UPI, cards, net banking, wallets, or EMI. The payment is verified securely on the server before your order is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(v) => handleChange("name", v)} required disabled={authState !== "signed-in"} />
            <Input label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} required disabled={authState !== "signed-in"} />
          </div>
          <Input label="Email (optional)" type="email" value={form.email} onChange={(v) => handleChange("email", v)} disabled={authState !== "signed-in"} />
          <Input label="Address" value={form.address} onChange={(v) => handleChange("address", v)} required disabled={authState !== "signed-in"} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={form.city} onChange={(v) => handleChange("city", v)} required disabled={authState !== "signed-in"} />
            <Input label="State" value={form.state} onChange={(v) => handleChange("state", v)} required disabled={authState !== "signed-in"} />
            <Input label="PIN Code" value={form.pincode} onChange={(v) => handleChange("pincode", v)} required disabled={authState !== "signed-in"} />
          </div>
          <Input label="Country" value={form.country} onChange={(v) => handleChange("country", v)} required disabled={authState !== "signed-in"} />

          {error && paymentStage === "failed" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-medium">Payment could not be completed.</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setPaymentStage("idle");
                  void handlePlaceOrder();
                }}
                className="mt-3 rounded-full bg-dark px-4 py-2 text-sm font-medium text-white"
              >
                Retry payment
              </button>
            </div>
          ) : error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading || authState !== "signed-in" || !sdkReady}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-dark px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={16} />
                {paymentStage === "creating" ? "Preparing payment…" : "Processing payment…"}
              </>
            ) : sdkReady ? (
              `Pay Now • ₹${total.toLocaleString("en-IN")}`
            ) : (
              "Loading secure payment…"
            )}
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
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-dark/60">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
