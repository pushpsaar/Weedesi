"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function OrderFailurePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <X size={36} className="text-red-700" />
      </div>
      <h1 className="mt-8 font-heading text-3xl text-dark">Payment Failed</h1>
      <p className="mt-3 text-sm text-dark/60">
        Your payment could not be verified. No amount has been charged, or it will be
        automatically refunded if deducted.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/checkout" className="rounded-full bg-dark px-8 py-3 text-sm font-medium text-white">
          Try Again
        </Link>
        <Link href="/contact" className="rounded-full border border-dark/20 px-8 py-3 text-sm font-medium text-dark">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
