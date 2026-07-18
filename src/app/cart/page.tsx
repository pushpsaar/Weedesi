"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/context/store-context";

const GST_RATE = 0.05;

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  async function applyCoupon() {
    setCouponError("");
    if (!coupon.trim()) return;
    const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(coupon)}&subtotal=${cartTotal}`);
    if (!res.ok) {
      setCouponError("Invalid or inactive coupon.");
      setApplied(null);
      return;
    }
    const data = await res.json();
    setApplied({ code: coupon.toUpperCase(), discount: data.discount });
  }

  const discount = applied?.discount ?? 0;
  const gst = Math.round((cartTotal - discount) * GST_RATE);
  const total = cartTotal - discount + gst;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-heading text-3xl text-dark">Your cart is empty</h1>
        <p className="mt-3 text-sm text-dark/50">Discover pieces made to last.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-dark px-8 py-3 text-sm font-medium text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-dark">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {cart.map((line) => (
            <div
              key={`${line.productId}-${line.size}-${line.color}`}
              className="flex gap-4 rounded-xl border border-border bg-white p-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-bg">
                {line.image && (
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark">{line.name}</p>
                    <p className="mt-0.5 text-xs text-dark/50">
                      {line.color} / {line.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(line.productId, line.size, line.color)}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      onClick={() => updateQty(line.productId, line.size, line.color, line.qty - 1)}
                      className="px-3 py-1 text-base"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      onClick={() => updateQty(line.productId, line.size, line.color, line.qty + 1)}
                      className="px-3 py-1 text-base"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-dark">
                    ₹{(line.price * line.qty).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-xl text-dark">Order Summary</h2>

          <div className="mt-4 flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <button
              onClick={applyCoupon}
              className="rounded-lg border border-dark px-4 py-2 text-xs font-medium text-dark hover:bg-dark hover:text-white"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="mt-1 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {couponError}
            </p>
          )}
          {applied && (
            <p className="mt-1 text-xs text-green-600">
              &ldquo;{applied.code}&rdquo; applied — you saved ₹{applied.discount}
            </p>
          )}

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-dark/60">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-dark/60">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-dark/60">
              <span>GST (5%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-dark/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium text-dark">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Link
            href={{ pathname: "/checkout", query: applied ? { coupon: applied.code } : {} }}
            className="mt-6 block rounded-full bg-dark px-6 py-3.5 text-center text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
