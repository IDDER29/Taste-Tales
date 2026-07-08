"use client";

import React, { useState } from "react";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Subscription: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // No backend newsletter service — acknowledge locally.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-4xl bg-sand-950 px-6 py-14 shadow-lift sm:px-12 lg:px-16">
        {/* Warm mesh + spice accents */}
        <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-70" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
            <EnvelopeIcon className="h-4 w-4" />
            The weekly dish
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Fresh recipes, straight to your inbox
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Join thousands of home cooks. One thoughtful email a week — seasonal
            recipes, kitchen tips, and no spam.
          </p>

          {subscribed ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur">
              <CheckCircleIcon className="h-6 w-6 flex-none text-accent-300" />
              <p className="font-medium">
                You&apos;re in! Look out for fresh recipes soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sand-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-full border border-transparent bg-white pl-11 pr-4 text-sand-950 placeholder:text-sand-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-7 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-white/50">
            Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
