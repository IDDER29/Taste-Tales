"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Registration failed.");
        return;
      }
      // Auto sign-in after registering.
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!signInRes || signInRes.error) {
        // Account created but auto sign-in failed — send them to login.
        router.push("/login");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create your account
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">At least 8 characters.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
