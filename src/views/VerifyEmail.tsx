"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type State = "verifying" | "success" | "error";

export default function VerifyEmail() {
  const token = useSearchParams().get("token") || "";
  const [state, setState] = useState<State>(token ? "verifying" : "error");
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true; // guard against StrictMode double-invoke
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        setState(res.ok ? "success" : "error");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  return (
    <div className="container mx-auto py-16 px-4 max-w-md text-center">
      {state === "verifying" && (
        <p className="text-gray-600">Verifying your email…</p>
      )}
      {state === "success" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Email verified 🎉</h1>
          <p className="text-gray-600">Your account is all set.</p>
          <Link href="/login" className="text-red-500 font-medium hover:underline">
            Continue to sign in
          </Link>
        </div>
      )}
      {state === "error" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Verification failed
          </h1>
          <p className="text-gray-600">
            This link is invalid or has expired.
          </p>
          <Link href="/login" className="text-red-500 font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
}
