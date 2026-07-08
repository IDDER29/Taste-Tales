"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckBadgeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Spinner } from "../components/ui/Spinner";
import AuthLayout from "../components/AuthLayout";
import { buttonVariants } from "../components/ui/Button";

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
    <AuthLayout title="Verify your email">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {state === "verifying" && (
          <>
            <Spinner className="h-10 w-10 text-brand-500" />
            <p className="text-sand-600">Verifying your email…</p>
          </>
        )}
        {state === "success" && (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckBadgeIcon className="h-8 w-8" />
            </span>
            <h2 className="font-display text-xl font-semibold text-sand-950">
              Email verified 🎉
            </h2>
            <p className="text-sand-600">Your account is all set.</p>
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Continue to sign in
            </Link>
          </>
        )}
        {state === "error" && (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <ExclamationTriangleIcon className="h-8 w-8" />
            </span>
            <h2 className="font-display text-xl font-semibold text-sand-950">
              Verification failed
            </h2>
            <p className="text-sand-600">This link is invalid or has expired.</p>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
