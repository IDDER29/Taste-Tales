"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, useToast, LoadingState, EmptyState } from "../components/ui";

interface ReportRow {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; name: string | null; email: string };
  recipe: { id: string; title: string; slug: string; authorId: string } | null;
}

export default function AdminReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "loading") return;
    if (!isAdmin) router.push("/");
  }, [isAdmin, status, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/reports");
      const data = res.ok ? await res.json() : null;
      setReports(data?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const act = async (id: string, newStatus: string, deleteRecipe?: boolean) => {
    const res = await fetch(`/api/v1/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: newStatus, deleteRecipe }),
    });
    if (res.ok) {
      toast({ title: "Report updated", variant: "success" });
      load();
    } else {
      toast({ title: "Action failed", variant: "error" });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container-page max-w-3xl py-12 lg:py-16">
      <header className="mb-8">
        <span className="eyebrow">Admin</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950">
          Moderation queue
        </h1>
        <p className="mt-2 text-sand-600">
          Review flagged recipes and take action.
        </p>
      </header>
      {loading ? (
        <LoadingState />
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          icon={<span>✓</span>}
          title="No open reports"
          description="Nothing to moderate right now — you're all caught up."
        />
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-sand-200/70 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-sand-950">
                    {r.recipe ? (
                      <Link
                        href={`/articles/${r.recipe.id}`}
                        className="hover:text-brand-600 hover:underline"
                      >
                        {r.recipe.title}
                      </Link>
                    ) : (
                      <span className="text-sand-400">(recipe deleted)</span>
                    )}
                  </p>
                  <p className="mt-1.5 rounded-lg bg-sand-50 px-3 py-2 text-sm text-sand-700">
                    {r.reason}
                  </p>
                  <p className="mt-2 text-xs text-sand-400">
                    by {r.reporter.name || r.reporter.email} ·{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button size="sm" onClick={() => act(r.id, "RESOLVED")}>
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => act(r.id, "DISMISSED")}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => act(r.id, "RESOLVED", true)}
                  >
                    Delete recipe
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
