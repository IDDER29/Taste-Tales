"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout, { AuthField, AuthAlert } from "../components/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

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
    <AuthLayout
      title="Create your account"
      subtitle="Join the community and start collecting recipes worth remembering."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthAlert>{error}</AuthAlert>}
        <AuthField id="name" label="Name">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jamie Rivera"
          />
        </AuthField>
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
        <AuthField id="password" label="Password" hint="At least 8 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthField>
        <Button type="submit" block size="lg" loading={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs text-sand-500">
          By creating an account you agree to our Terms &amp; Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
