"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-dark/95 py-20 sm:py-24">
      <div className="section-shell px-4 text-center sm:px-6 md:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Exclusive access</p>
          <h2 className="mt-3 font-heading text-3xl text-white sm:text-[2rem]">Join the List</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/70">
            Early access to new drops, private sales, and styling notes.
          </p>
          {submitted ? (
            <p className="mt-7 text-sm text-gold">You&apos;re on the list. Welcome.</p>
          ) : (
            <form
              className="mt-8 flex flex-col gap-3 sm:flex-row"
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
                className="flex-1 rounded-full border border-white/20 bg-transparent px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-dark transition-transform hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
