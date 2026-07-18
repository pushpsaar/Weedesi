"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:px-8">
      <h1 className="font-heading text-4xl text-dark">Contact Us</h1>
      <p className="mt-3 text-sm text-dark/50">We usually respond within one business day.</p>
      {sent ? (
        <p className="mt-8 text-sm text-green-600">Thanks — your message has been sent.</p>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <input required placeholder="Name" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none" />
          <input required type="email" placeholder="Email" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none" />
          <textarea required rows={5} placeholder="Message" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none" />
          <button type="submit" className="rounded-full bg-dark px-7 py-3 text-sm font-medium text-white">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
