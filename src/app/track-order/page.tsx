"use client";

import { useState } from "react";
import { Order } from "@/lib/types";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    const res = await fetch(`/api/track-order?id=${encodeURIComponent(orderId)}`);
    if (!res.ok) {
      setError("Order not found. Check your order ID and try again.");
      return;
    }
    setOrder(await res.json());
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Track Your Order</h1>
      <form onSubmit={handleTrack} className="mt-8 flex gap-3">
        <input
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your Order ID"
          className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
        <button type="submit" className="rounded-full bg-dark px-6 py-2.5 text-sm font-medium text-white">
          Track
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-xl border border-border bg-white p-6">
          <p className="text-sm">
            Status: <span className="font-medium capitalize">{order.status}</span>
          </p>
          <p className="mt-1 text-sm text-dark/60">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
          <p className="mt-1 text-sm text-dark/60">
            {order.items.reduce((s, i) => s + i.qty, 0)} item(s) · ₹{order.total.toLocaleString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
}
