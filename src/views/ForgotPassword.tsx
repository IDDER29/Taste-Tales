"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AuthLayout, { AuthField } from "../components/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show the same message (no account enumeration).
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={!sent ? "We'll email you a secure link to set a new one." : undefined}
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircleIcon className="h-8 w-8" />
          </span>
          <p className="text-sand-700">
            If an account exists for <strong className="text-sand-950">{email}</strong>, a
            password reset link is on its way. Check your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField id="email" label="Email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </AuthField>
          <Button type="submit" block size="lg" loading={loading}>
            <EnvelopeIcon className="h-5 w-5" />
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
