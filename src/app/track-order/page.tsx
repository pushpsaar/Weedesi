"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";

export default function TrackOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [authState, setAuthState] = useState<"loading" | "signed-in" | "guest">("loading");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack() {
    setError("");
    setLoading(true);

    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      if (!authData.user) {
        setAuthState("guest");
        setOrders([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/track-order");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to load your orders right now.");
        setAuthState("signed-in");
        setOrders([]);
        setLoading(false);
        return;
      }

      setAuthState("signed-in");
      setOrders(Array.isArray(data.orders) ? data.orders : data ? [data] : []);
    } catch {
      setError("Unable to load your orders right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void handleTrack();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Track Your Order</h1>
      <p className="mt-3 text-sm text-dark/60">
        Sign in to see your recent orders and current status without entering an order ID.
      </p>

      {authState !== "signed-in" && (
        <div className="mt-8 rounded-2xl border border-border bg-white p-6">
          <p className="text-sm font-medium text-dark">
            {authState === "loading" ? "Checking your account..." : "Please sign in to view your orders."}
          </p>
          {authState === "guest" && (
            <Link href="/auth?redirect=/track-order" className="mt-4 inline-flex rounded-full bg-dark px-4 py-2 text-sm font-medium text-white">
              Sign in
            </Link>
          )}
        </div>
      )}

      {authState === "signed-in" && (
        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => void handleTrack()}
            className="rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white"
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh orders"}
          </button>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          {orders.length === 0 && !error && !loading && (
            <div className="rounded-2xl border border-border bg-white p-6 text-sm text-dark/60">
              No orders found yet.
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-dark">Order #{order.id.slice(0, 8)}</p>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-dark">
                  {order.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-dark/60">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-dark/60">
                {order.items.reduce((sum, item) => sum + item.qty, 0)} item(s) · ₹{order.total.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
