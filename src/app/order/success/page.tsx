"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessInner />
    </Suspense>
  );
}

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [eta] = useState(() =>
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
    })
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <Check size={36} className="text-green-600" />
      </motion.div>
      <h1 className="mt-8 font-heading text-3xl text-dark">Order Confirmed</h1>
      <p className="mt-3 text-sm text-dark/60">
        Thank you — your order has been placed successfully.
      </p>
      {orderId && (
        <p className="mt-4 rounded-full border border-border px-4 py-1.5 text-xs text-dark/60">
          Order ID: {orderId.slice(0, 8)}
        </p>
      )}
      <p className="mt-2 text-sm text-dark/50">Estimated delivery by {eta}</p>
      <Link
        href="/shop"
        className="mt-10 rounded-full bg-dark px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
      >
        Continue to Shop
      </Link>
    </div>
  );
}
