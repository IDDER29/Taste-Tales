"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Welcome back
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-4"
      >
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
            {error}
          </p>
        )}
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
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="mt-1 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-red-500 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
