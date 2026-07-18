"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-dark py-20">
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="font-heading text-3xl text-white">Join the List</h2>
        <p className="mt-3 text-sm text-white/60">
          Early access to new drops, private sales, and styling notes.
        </p>
        {submitted ? (
          <p className="mt-6 text-sm text-gold">You&apos;re on the list. Welcome.</p>
        ) : (
          <form
            className="mt-7 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-dark transition-transform hover:scale-[1.03]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
