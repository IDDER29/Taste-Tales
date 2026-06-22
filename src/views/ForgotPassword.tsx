"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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
    <div className="container mx-auto py-16 px-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reset your password
      </h1>
      {sent ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-4">
          <p className="text-gray-700">
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a
            password reset link. Check your inbox.
          </p>
          <Link
            href="/login"
            className="inline-block text-red-500 font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <p className="text-sm text-gray-600">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
          <p className="text-sm text-gray-600 text-center">
            <Link href="/login" className="text-red-500 font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
